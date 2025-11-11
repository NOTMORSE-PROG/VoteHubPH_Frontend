import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { otpStore } from '../send-otp/route'

export async function POST(req: NextRequest) {
  try {
    const { email, otp, password, name } = await req.json()

    if (\!email || \!otp || \!password) {
      return NextResponse.json(
        { error: 'Email, OTP, and password are required' },
        { status: 400 }
      )
    }

    const storedOTP = otpStore.get(email)

    if (\!storedOTP) {
      return NextResponse.json(
        { error: 'OTP not found or expired' },
        { status: 400 }
      )
    }

    if (new Date() > storedOTP.expiresAt) {
      otpStore.delete(email)
      return NextResponse.json(
        { error: 'OTP expired' },
        { status: 400 }
      )
    }

    if (storedOTP.code \!== otp) {
      return NextResponse.json(
        { error: 'Invalid OTP' },
        { status: 400 }
      )
    }

    otpStore.delete(email)

    const hashedPassword = await bcrypt.hash(password, 12)

    const user = await prisma.user.create({
      data: {
        email,
        name: name || email.split('@')[0],
        password: hashedPassword,
        provider: 'credentials',
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Account created successfully',
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      }
    })
  } catch (error) {
    console.error('Verify OTP error:', error)
    return NextResponse.json(
      { error: 'Failed to verify OTP' },
      { status: 500 }
    )
  }
}
