import { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { prisma } from './prisma'
import bcrypt from 'bcryptjs'

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  secret: process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET,
  providers: [
    // Google OAuth Provider
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    }),

    // Email/Password Provider
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Invalid credentials')
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        })

        if (!user || !user.password) {
          throw new Error('Invalid credentials')
        }

        const isCorrectPassword = await bcrypt.compare(
          credentials.password,
          user.password
        )

        if (!isCorrectPassword) {
          throw new Error('Invalid credentials')
        }

        // Return user object - PrismaAdapter will create session automatically
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
        }
      }
    })
  ],

  session: {
    strategy: 'jwt', // Use JWT for CredentialsProvider compatibility
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  pages: {
    signIn: '/login',
    signOut: '/',
    error: '/login',
    newUser: '/browse', // Redirect new users directly to browse
  },

  callbacks: {
    async jwt({ token, user, trigger, session }) {
      // JWT callback is still called for middleware even with database sessions
      // Populate token for middleware to use
      if (user) {
        // Initial sign-in - populate token with user data
        token.id = user.id
        token.email = user.email
        token.name = user.name
        
        const dbUser = await prisma.user.findUnique({
          where: { id: user.id as string },
          select: {
            provider: true,
            profileCompleted: true
          }
        })

        token.provider = dbUser?.provider || 'credentials'
        token.profileCompleted = dbUser?.profileCompleted || false
      } else if (!token.id && !token.email) {
        // With database sessions, on subsequent requests, we need to get user from session
        // But since we don't have access to session here, we'll populate from token if available
        // If token is empty, try to get from database using the session token
        // This is a fallback - the token should be populated on first request
        return token
      } else if (token?.email && (!token.id || !token.name)) {
        // Token has email but missing other fields - refresh from database
        const dbUser = await prisma.user.findUnique({
          where: { email: token.email as string },
          select: {
            id: true,
            email: true,
            name: true,
            provider: true,
            profileCompleted: true
          }
        })
        
        if (dbUser) {
          token.id = dbUser.id
          token.email = dbUser.email
          token.name = dbUser.name
          token.provider = dbUser.provider || 'credentials'
          token.profileCompleted = dbUser.profileCompleted || false
        }
      }
      
      // Update token when session is updated
      if (trigger === 'update' && session) {
        token.id = session.user.id
        token.email = session.user.email
        token.name = session.user.name
        token.provider = session.user.provider
        token.profileCompleted = session.user.profileCompleted
      }
      
      return token
    },

    async session({ session, token }) {
      // With JWT sessions, token is always available
      if (token) {
        session.user.id = token.id as string
        session.user.email = token.email as string
        session.user.name = token.name as string
        session.user.provider = token.provider
        session.user.profileCompleted = token.profileCompleted
      }
      
      return session
    },

    async signIn({ user, account, profile }) {
      try {
        // Update last login and provider info for existing users
        if (user?.email) {
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email }
          })

          if (existingUser) {
            // User exists, update their info
            const updateData: any = {
              lastLoginAt: new Date()
            }

            // For OAuth providers, update provider info
            if (account?.provider && account.provider !== 'credentials') {
              updateData.provider = account.provider
              updateData.providerId = account.providerAccountId
            }

            await prisma.user.update({
              where: { email: user.email },
              data: updateData
            })
          }
          // If user doesn't exist, Prisma Adapter will create them
        }
      } catch (error) {
        console.error('SignIn callback error:', error)
        // Don't block login if update fails
      }

      return true
    },

    async redirect({ url, baseUrl }) {
      // If redirecting to a URL on our domain, use it
      if (url.startsWith(baseUrl)) {
        return url
      }
      // After OAuth callback, redirect directly to browse
      return `${baseUrl}/browse`
    }
  },

  debug: process.env.NODE_ENV === 'development',
}
