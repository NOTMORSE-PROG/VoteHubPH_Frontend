import NextAuth, { DefaultSession, DefaultUser } from "next-auth"
import { JWT } from "next-auth/jwt"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      provider?: string
      profileCompleted?: boolean
    } & DefaultSession["user"]
  }

  interface User extends DefaultUser {
    profileCompleted?: boolean
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string
    email?: string
    name?: string
    provider?: string
    profileCompleted?: boolean
  }
}
