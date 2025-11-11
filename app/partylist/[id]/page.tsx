"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Users, Loader2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface PartyListMember {
  id: number
  post_id: number
  position_order: number
  post: {
    id: number
    name: string
    level: string
    position: string
    bio: string
    profile_photo?: string | null
    achievements?: string[] | null
    education?: Array<{ level: string; school: string }> | null
    platform?: string | null
  }
}

interface PartyList {
  id: number
  name: string
  acronym?: string | null
  sector?: string | null
  description?: string | null
  platform?: string[] | null
  member_count: number
  members?: PartyListMember[]
}

export default function PartyListDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [partyList, setPartyList] = useState<PartyList | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPartyList = async () => {
      try {
        setIsLoading(true)
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/partylists/${params.id}`,
          { credentials: "include" }
        )
        
        if (!response.ok) {
          throw new Error("Failed to fetch party list")
        }
        
        const data = await response.json()
        setPartyList(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load party list")
      } finally {
        setIsLoading(false)
      }
    }

    if (params.id) {
      fetchPartyList()
    }
  }, [params.id])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-muted-foreground">Loading party list...</p>
        </div>
      </div>
    )
  }

  if (error || !partyList) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Party-List Not Found</h2>
          <p className="text-muted-foreground mb-4">{error || "The party list you're looking for doesn't exist."}</p>
          <Button onClick={() => router.push("/browse?tab=partylist")}>Back to Browse</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/browse?tab=partylist">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Party-List
            </Link>
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8 max-w-7xl">
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h1 className="text-4xl font-bold mb-2 line-clamp-2">{partyList.name}</h1>
                {partyList.acronym && <p className="text-2xl text-muted-foreground mb-3">{partyList.acronym}</p>}
                <div className="flex items-center gap-4 flex-wrap">
                  {partyList.sector && (
                    <Badge variant="secondary" className="text-base px-3 py-1">
                      {partyList.sector}
                    </Badge>
                  )}
                  <span className="text-base text-muted-foreground font-medium">
                    {partyList.member_count || 0} {partyList.member_count === 1 ? 'member' : 'members'}
                  </span>
                </div>
              </div>
            </div>

            {partyList.description && (
              <p className="text-muted-foreground leading-relaxed line-clamp-3 text-base">{partyList.description}</p>
            )}
          </div>

          <div className="space-y-4">
            <h2 className="text-3xl font-bold">Members</h2>
            {!partyList.members || partyList.members.length === 0 ? (
              <div className="text-center py-12 bg-muted/50 rounded-lg">
                <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground text-lg">No members yet</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {partyList.members.map((member) => (
                  <Card key={member.id} className="hover:shadow-lg transition-all duration-200 border-2">
                    <CardContent className="p-6">
                      <div className="flex gap-6">
                        <div className="relative w-32 h-32 rounded-xl overflow-hidden flex-shrink-0 bg-muted border-2 border-primary/20 shadow-sm">
                          <Image
                            src={member.post.profile_photo || "/placeholder.svg"}
                            alt={member.post.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1 space-y-3 min-w-0">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1 min-w-0">
                              <h3 className="font-bold text-xl mb-2 line-clamp-1">{member.post.name}</h3>
                              <div className="flex items-center gap-3 flex-wrap">
                                <p className="text-sm text-muted-foreground font-medium">Position #{member.position_order}</p>
                                {member.post.level && (
                                  <>
                                    <span className="text-sm text-muted-foreground">•</span>
                                    <Badge variant="outline" className="text-sm px-2.5 py-1">
                                      {member.post.level}
                                    </Badge>
                                  </>
                                )}
                                {member.post.position && (
                                  <>
                                    <span className="text-sm text-muted-foreground">•</span>
                                    <span className="text-sm text-muted-foreground font-semibold">
                                      {member.post.position}
                                    </span>
                                  </>
                                )}
                              </div>
                            </div>
                            <Button variant="outline" size="default" asChild className="flex-shrink-0">
                              <Link href={`/candidate/${member.post.id}?from=partylist&partylistId=${params.id}`}>
                                View Profile
                              </Link>
                            </Button>
                          </div>
                          {member.post.achievements && member.post.achievements.length > 0 && (
                            <div className="space-y-1.5 pt-1">
                              <p className="text-sm font-semibold text-foreground">Key Achievements:</p>
                              <ul className="space-y-1.5">
                                {member.post.achievements.slice(0, 2).map((achievement, index) => (
                                  <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                                    <span className="text-primary flex-shrink-0 mt-1 text-base">•</span>
                                    <span className="line-clamp-2 break-words">
                                      {achievement.length > 100 ? `${achievement.substring(0, 100)}...` : achievement}
                                    </span>
                                  </li>
                                ))}
                                {member.post.achievements.length > 2 && (
                                  <li className="text-sm text-muted-foreground italic pl-4">
                                    +{member.post.achievements.length - 2} more
                                  </li>
                                )}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
