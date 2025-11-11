import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth.config'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { name, region, city, barangay } = await req.json()

    if (!name || !region || !city) {
      return NextResponse.json(
        { error: 'Name, region, and city are required' },
        { status: 400 }
      )
    }

    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data: {
        name,
        region,
        city,
        barangay: barangay || null,
        profileCompleted: true,
      }
    })

    return NextResponse.json({
      success: true,
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        region: updatedUser.region,
        city: updatedUser.city,
        barangay: updatedUser.barangay,
      }
    })
  } catch (error) {
    console.error('Complete profile error:', error)
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    )
  }
}
