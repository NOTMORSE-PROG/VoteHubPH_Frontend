"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ThumbsUp, MessageSquare, Vote } from "lucide-react"
import Link from "next/link"

interface Post {
  id: number
  user_id: string
  name: string
  level: string
  position: string
  bio: string
  platform: string | null
  education: Array<{ level: string; school: string }> | null
  achievements: string[] | null
  images: Array<{ url: string; caption: string }> | null
  profile_photo?: string | null
  party?: string | null
  status: string
  created_at: string
  updated_at: string
  votes_count?: number
  comments_count?: number
  user: {
    id: string
    name: string
    email: string
  }
}

interface CandidateCardProps {
  post: Post
  currentTab?: "local" | "national" | "partylist"
}

export function CandidateCard({ post, currentTab = "local" }: CandidateCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage
              src={post.profile_photo || "/placeholder.svg"}
              alt={post.name}
            />
            <AvatarFallback>
              {post.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <CardTitle className="text-xl">{post.name}</CardTitle>
            <CardDescription className="mt-1">Running for {post.position}</CardDescription>
            {post.party && (
              <Badge variant="secondary" className="mt-2">
                {post.party}
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Key Achievements */}
        {post.achievements && post.achievements.length > 0 ? (
          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Key Achievements</h4>
            <ul className="space-y-1.5">
              {post.achievements.slice(0, 3).map((achievement, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <span className="text-primary mt-1.5 flex-shrink-0">✓</span>
                  <span className="line-clamp-2">{achievement}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">About</h4>
            <p className="text-sm text-muted-foreground line-clamp-3">{post.bio}</p>
          </div>
        )}

        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Vote className="h-4 w-4" />
            <span>{post.votes_count || 0} votes</span>
          </div>
          <div className="flex items-center gap-1">
            <MessageSquare className="h-4 w-4" />
            <span>{post.comments_count || 0} comments</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="gap-2">
        <Button variant="default" className="w-full" asChild>
          <Link href={`/candidate/${post.id}?from=${currentTab}`}>View Profile</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
