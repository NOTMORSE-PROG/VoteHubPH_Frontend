import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth.config"
import { prisma } from "@/lib/prisma"

// Force dynamic rendering since we use getServerSession which uses headers()
export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Fetch user from database
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Format joined date
    const joinedDate = new Intl.DateTimeFormat("en-US", {
      month: "long",
      year: "numeric",
    }).format(new Date(user.createdAt))

    // Mock data for votes, comments, and posts (will be replaced with real data later)
    // For now, return empty arrays except for one mock post
    const userData = {
      name: user.name || "User",
      email: user.email,
      joinedDate,
      votedCandidates: [],
      comments: [],
      posts: [
        {
          id: "post1",
          title: "My Thoughts on Upcoming Elections",
          content:
            "As a concerned citizen, I believe it's important to research candidates thoroughly before making a decision. We should look at their track record, platform, and how they've served their communities in the past. What are your thoughts?",
          date: "Jan 20, 2025",
          likes: 12,
          comments: 5,
        },
      ],
    }

    return NextResponse.json(userData)
  } catch (error) {
    console.error("Profile fetch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
