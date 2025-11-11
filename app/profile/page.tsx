"use client"
import { useEffect, useState, useMemo } from "react"
import { useSession } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import { authenticatedFetch } from "@/lib/api-client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, MapPin, Calendar, ThumbsUp, User, Loader2, FileText, Edit, XCircle, CheckCircle, Clock, ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"
import { T } from "@/components/auto-translate"
import Image from "next/image"

interface Post {
  id: number
  name: string
  position: string
  level: string
  status: string
  admin_notes: string | null
  profile_photo: string | null
  created_at: string
  updated_at: string
  votes_count: number
  comments_count: number
}

interface Comment {
  id: number
  post_id: number
  post_name: string
  post_profile_photo: string | null
  content: string
  is_anonymous: boolean
  likes_count: number
  created_at: string
}

interface Vote {
  id: number
  post_id: number
  post_name: string
  post_position: string
  post_level: string
  post_profile_photo: string | null
  is_anonymous: boolean
  created_at: string
}

interface UserData {
  id: string
  name: string
  email: string
  image: string | null
  createdAt: string
  posts: Post[]
  comments: Comment[]
  votes: Vote[]
}

export default function ProfilePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [userData, setUserData] = useState<UserData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState(searchParams.get("tab") || "posts")
  const [postStatusFilter, setPostStatusFilter] = useState<"all" | "approved" | "rejected" | "pending">("all")
  const [postsPage, setPostsPage] = useState(1)
  const [votesPage, setVotesPage] = useState(1)
  const [commentsPage, setCommentsPage] = useState(1)
  
  const ITEMS_PER_PAGE = 5

  // Update active tab when URL parameter changes
  useEffect(() => {
    const tab = searchParams.get("tab")
    if (tab && ["posts", "votes", "comments"].includes(tab)) {
      setActiveTab(tab)
    }
  }, [searchParams])

  // Reset pagination when tab changes
  useEffect(() => {
    setPostsPage(1)
    setVotesPage(1)
    setCommentsPage(1)
  }, [activeTab])

  // Scroll to top when pagination changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [postsPage, votesPage, commentsPage])

  // Filter and paginate posts
  const filteredPosts = useMemo(() => {
    if (!userData) return []
    let filtered = userData.posts
    if (postStatusFilter !== "all") {
      filtered = filtered.filter(post => post.status === postStatusFilter)
    }
    return filtered
  }, [userData, postStatusFilter])

  const paginatedPosts = useMemo(() => {
    const start = (postsPage - 1) * ITEMS_PER_PAGE
    return filteredPosts.slice(start, start + ITEMS_PER_PAGE)
  }, [filteredPosts, postsPage])

  const postsTotalPages = Math.ceil(filteredPosts.length / ITEMS_PER_PAGE)

  // Paginate votes
  const paginatedVotes = useMemo(() => {
    if (!userData) return []
    const start = (votesPage - 1) * ITEMS_PER_PAGE
    return userData.votes.slice(start, start + ITEMS_PER_PAGE)
  }, [userData, votesPage])

  const votesTotalPages = Math.ceil((userData?.votes.length || 0) / ITEMS_PER_PAGE)

  // Paginate comments
  const paginatedComments = useMemo(() => {
    if (!userData) return []
    const start = (commentsPage - 1) * ITEMS_PER_PAGE
    return userData.comments.slice(start, start + ITEMS_PER_PAGE)
  }, [userData, commentsPage])

  const commentsTotalPages = Math.ceil((userData?.comments.length || 0) / ITEMS_PER_PAGE)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
      return
    }
    
    if (status === "authenticated" && session?.user?.email) {
      fetchUserData()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, session?.user?.email])

  const fetchUserData = async () => {
    try {
      setIsLoading(true)
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"
      
      const response = await authenticatedFetch(`${API_URL}/user/profile`, {
        method: "GET",
      })
      
      if (!response.ok) {
        if (response.status === 401) {
          // Unauthorized - redirect to login
          router.push("/login")
          return
        }
        const errorData = await response.json().catch(() => ({}))
        console.error("Failed to fetch user data:", response.status, errorData)
        throw new Error(errorData.message || `Failed to load profile: ${response.status}`)
      }
      
      const data = await response.json()
        setUserData(data)
    } catch (error: any) {
      console.error("Failed to fetch user data:", error)
      // Don't set error state, just log it - the UI will show loading or empty state
    } finally {
      setIsLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-500"><CheckCircle className="h-3 w-3 mr-1" />Approved</Badge>
      case 'rejected':
        return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" />Rejected</Badge>
      case 'pending':
        return <Badge variant="secondary"><Clock className="h-3 w-3 mr-1" />Pending</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!userData && !isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center flex-col gap-4">
        <p className="text-muted-foreground"><T>Failed to load profile data</T></p>
        <Button onClick={() => fetchUserData()} variant="outline">
          <T>Retry</T>
        </Button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <Link href="/browse">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Browse
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-primary">My Profile</h1>
              <p className="text-sm text-muted-foreground mt-1">Manage your civic engagement</p>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-start gap-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={userData.image || "/placeholder.svg?height=80&width=80"} />
                <AvatarFallback className="text-2xl">
                  <User className="h-10 w-10" />
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <CardTitle className="text-2xl">{userData.name}</CardTitle>
                <CardDescription className="mt-1">{userData.email}</CardDescription>
                <div className="flex flex-wrap gap-4 mt-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span><T>Joined</T> {formatDate(userData.createdAt)}</span>
                  </div>
                </div>
              </div>
              <Link href="/settings">
              <Button variant="outline">Edit Profile</Button>
              </Link>
            </div>
          </CardHeader>
        </Card>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="posts"><T>My Posts</T></TabsTrigger>
            <TabsTrigger value="votes"><T>My Votes</T></TabsTrigger>
            <TabsTrigger value="comments"><T>My Comments</T></TabsTrigger>
          </TabsList>

          <TabsContent value="posts" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle><T>My Posts</T></CardTitle>
                    <CardDescription><T>Candidates you've created</T></CardDescription>
                  </div>
                  {userData.posts.length > 0 && (
                    <div className="flex items-center gap-2">
                      <select
                        value={postStatusFilter}
                        onChange={(e) => {
                          setPostStatusFilter(e.target.value as "all" | "approved" | "rejected" | "pending")
                          setPostsPage(1)
                        }}
                        className="h-9 px-3 rounded-md border border-input bg-background text-sm"
                      >
                        <option value="all">All</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                        <option value="pending">Pending</option>
                      </select>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {filteredPosts.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    {userData.posts.length === 0 ? (
                      <T>You haven't created any posts yet</T>
                    ) : (
                      <T>No posts found with the selected filter</T>
                    )}
                  </p>
                ) : (
                  <>
                    {paginatedPosts.map((post) => (
                    <div key={post.id} className="p-4 border rounded-lg space-y-3 hover:shadow-md transition-shadow">
                      <div className="flex items-start gap-4">
                        {post.profile_photo && (
                          <div className="relative h-16 w-16 rounded-full overflow-hidden flex-shrink-0">
                            <Image
                              src={post.profile_photo}
                              alt={post.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-lg">{post.name}</h3>
                              <p className="text-sm text-muted-foreground">{post.position} • {post.level}</p>
                            </div>
                            {getStatusBadge(post.status)}
                          </div>
                          {post.status === 'rejected' && post.admin_notes && (
                            <div className="mt-2 p-2 bg-destructive/10 border border-destructive/20 rounded text-sm">
                              <p className="font-medium text-destructive mb-1">Admin Notes:</p>
                              <p className="text-muted-foreground">{post.admin_notes}</p>
                            </div>
                          )}
                          <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <ThumbsUp className="h-4 w-4" />
                              <span>{post.votes_count} <T>votes</T></span>
                            </div>
                            <div className="flex items-center gap-1">
                              <span>{post.comments_count} <T>comments</T></span>
                            </div>
                            <span className="text-xs">{formatDate(post.created_at)}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 pt-2 border-t">
                        {post.status === 'rejected' && (
                          <Link href={`/posts/edit/${post.id}`}>
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4 mr-2" />
                              <T>Edit & Resubmit</T>
                            </Button>
                          </Link>
                        )}
                        {post.status === 'approved' && (
                          <Link href={`/candidate/${post.id}?from=profile&tab=posts`}>
                            <Button variant="outline" size="sm">
                              <T>View Profile</T>
                            </Button>
                          </Link>
                        )}
                      </div>
                    </div>
                    ))}
                    {/* Pagination for Posts */}
                    {postsTotalPages > 1 && (
                      <div className="flex items-center justify-center gap-2 pt-4 border-t">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setPostsPage(Math.max(1, postsPage - 1))}
                          disabled={postsPage === 1}
                        >
                          <ChevronLeft className="h-4 w-4" />
                          Previous
                        </Button>
                        <div className="flex items-center gap-1">
                          {Array.from({ length: postsTotalPages }, (_, i) => i + 1).map((page) => (
                            <Button
                              key={page}
                              variant={postsPage === page ? "default" : "outline"}
                              size="sm"
                              onClick={() => setPostsPage(page)}
                              className="w-10"
                            >
                              {page}
                            </Button>
                          ))}
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setPostsPage(Math.min(postsTotalPages, postsPage + 1))}
                          disabled={postsPage === postsTotalPages}
                        >
                          Next
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="votes" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle><T>Voted Candidates</T></CardTitle>
                <CardDescription><T>Candidates you've voted for</T></CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {userData.votes.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    <T>You haven't voted for any candidates yet</T>
                  </p>
                ) : (
                  <>
                    {paginatedVotes.map((vote) => (
                    <div key={vote.id} className="flex items-center gap-4 p-4 border rounded-lg hover:shadow-md transition-shadow">
                      {vote.post_profile_photo && (
                        <div className="relative h-16 w-16 rounded-full overflow-hidden flex-shrink-0">
                          <Image
                            src={vote.post_profile_photo}
                            alt={vote.post_name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold">{vote.post_name}</h3>
                        <p className="text-sm text-muted-foreground">{vote.post_position} • {vote.post_level}</p>
                        <div className="flex items-center gap-2 mt-1">
                          {vote.is_anonymous && (
                            <Badge variant="secondary" className="text-xs">Anonymous</Badge>
                          )}
                          <span className="text-xs text-muted-foreground">{formatDate(vote.created_at)}</span>
                        </div>
                      </div>
                      <Link href={`/candidate/${vote.post_id}?from=profile&tab=votes`}>
                          <Button variant="outline" size="sm">
                            <T>View Profile</T>
                          </Button>
                        </Link>
                      </div>
                    ))}
                    {/* Pagination for Votes */}
                    {votesTotalPages > 1 && (
                      <div className="flex items-center justify-center gap-2 pt-4 border-t">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setVotesPage(Math.max(1, votesPage - 1))}
                          disabled={votesPage === 1}
                        >
                          <ChevronLeft className="h-4 w-4" />
                          Previous
                        </Button>
                        <div className="flex items-center gap-1">
                          {Array.from({ length: votesTotalPages }, (_, i) => i + 1).map((page) => (
                            <Button
                              key={page}
                              variant={votesPage === page ? "default" : "outline"}
                              size="sm"
                              onClick={() => setVotesPage(page)}
                              className="w-10"
                            >
                              {page}
                            </Button>
                          ))}
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setVotesPage(Math.min(votesTotalPages, votesPage + 1))}
                          disabled={votesPage === votesTotalPages}
                        >
                          Next
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="comments" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle><T>My Comments</T></CardTitle>
                <CardDescription><T>Your discussions about candidates</T></CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {userData.comments.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    <T>You haven't posted any comments yet</T>
                  </p>
                ) : (
                  <>
                    {paginatedComments.map((comment) => (
                    <div key={comment.id} className="p-4 border rounded-lg space-y-2 hover:shadow-md transition-shadow">
                      <div className="flex items-start gap-3">
                        {comment.post_profile_photo && (
                          <div className="relative h-12 w-12 rounded-full overflow-hidden flex-shrink-0">
                            <Image
                              src={comment.post_profile_photo}
                              alt={comment.post_name}
                              fill
                              className="object-cover"
                            />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-2">
                            <Badge variant="secondary">{comment.post_name}</Badge>
                            <span className="text-xs text-muted-foreground">{formatDate(comment.created_at)}</span>
                      </div>
                      <p className="text-sm">{comment.content}</p>
                          <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                        <ThumbsUp className="h-4 w-4" />
                            <span>{comment.likes_count} <T>likes</T></span>
                            {comment.is_anonymous && (
                              <Badge variant="secondary" className="text-xs ml-2">Anonymous</Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="pt-2 border-t">
                        <Link href={`/candidate/${comment.post_id}?from=profile&tab=comments`}>
                          <Button variant="ghost" size="sm">
                            <T>View Post</T>
                          </Button>
                        </Link>
                      </div>
                    </div>
                    ))}
                    {/* Pagination for Comments */}
                    {commentsTotalPages > 1 && (
                      <div className="flex items-center justify-center gap-2 pt-4 border-t">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCommentsPage(Math.max(1, commentsPage - 1))}
                          disabled={commentsPage === 1}
                        >
                          <ChevronLeft className="h-4 w-4" />
                          Previous
                        </Button>
                        <div className="flex items-center gap-1">
                          {Array.from({ length: commentsTotalPages }, (_, i) => i + 1).map((page) => (
                            <Button
                              key={page}
                              variant={commentsPage === page ? "default" : "outline"}
                              size="sm"
                              onClick={() => setCommentsPage(page)}
                              className="w-10"
                            >
                              {page}
                            </Button>
                          ))}
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCommentsPage(Math.min(commentsTotalPages, commentsPage + 1))}
                          disabled={commentsPage === commentsTotalPages}
                        >
                          Next
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
