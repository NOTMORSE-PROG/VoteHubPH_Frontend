import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import crypto from 'crypto'

const otpStore = new Map<string, { code: string; expiresAt: Date }>()

function generateOTP(): string {
  return crypto.randomInt(100000, 999999).toString()
}

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json()

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 400 })
    }

    const otp = generateOTP()
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000)
    otpStore.set(email, { code: otp, expiresAt })

    if (process.env.NODE_ENV === 'development') {
      console.log(f'
=== OTP for {email} ===')
      console.log(f'Code: {otp}')
      console.log(f'========================
')
    }

    return NextResponse.json({
      success: true,
      message: 'OTP sent successfully',
      ...(process.env.NODE_ENV === 'development' && { otp })
    })
  } catch (error) {
    console.error('Send OTP error:', error)
    return NextResponse.json({ error: 'Failed to send OTP' }, { status: 500 })
  }
}

export { otpStore }
