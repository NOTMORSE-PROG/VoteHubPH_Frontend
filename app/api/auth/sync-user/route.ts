import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'

export async function POST(req: NextRequest) {
  try {
    const { email, name, password, userId, token } = await req.json()

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    // Check if user already exists in Prisma
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      // User already exists - always update password if provided
      if (password) {
        const hashedPassword = await bcrypt.hash(password, 12)
        await prisma.user.update({
          where: { email },
          data: { password: hashedPassword }
        })
        console.log('✅ Password updated for existing user in Prisma')
      }

      return NextResponse.json({
        success: true,
        message: password ? 'User synced and password updated' : 'User already synced',
        user: {
          id: existingUser.id,
          email: existingUser.email,
          name: existingUser.name
        }
      })
    }

    // Hash the password if provided (plain text)
    // We always hash it here since we receive plain password from register page
    let hashedPassword: string | undefined = undefined
    if (password) {
      // Always hash the password - it should be plain text from register page
      // Use same bcrypt rounds (12) as Laravel for consistency
      hashedPassword = await bcrypt.hash(password, 12)
      console.log('✅ Password hashed for Prisma sync')
    }

    // Create user in Prisma with data from Laravel or provided data
    const userData: any = {
      email,
      name: laravelUser?.name || name || email.split('@')[0],
      provider: 'credentials',
      emailVerified: new Date(),
      profileCompleted: true, // No longer require profile completion
    }

    // Use Laravel's user ID if available
    if (userId) {
      userData.id = userId
    }

    // Add password if we have it
    if (hashedPassword) {
      userData.password = hashedPassword
    }

    const user = await prisma.user.create({
      data: userData
    })

    return NextResponse.json({
      success: true,
      message: 'User synced successfully',
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      }
    })
  } catch (error: any) {
    console.error('❌ Sync user error:', error)
    console.error('Error details:', {
      code: error.code,
      message: error.message,
      meta: error.meta
    })
    
    // If user already exists (unique constraint violation), that's okay
    if (error.code === 'P2002') {
      console.log('✅ User already exists in Prisma')
      return NextResponse.json({
        success: true,
        message: 'User already exists',
      })
    }

    // Return detailed error for debugging
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to sync user', 
        details: error.message,
        code: error.code,
        meta: error.meta
      },
      { status: 500 }
    )
  }
}

