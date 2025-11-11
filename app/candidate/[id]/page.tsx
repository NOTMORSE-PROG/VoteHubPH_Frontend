"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, MapPin, Loader2, GraduationCap, Trophy, Flag, ThumbsUp, MessageSquare, Vote as VoteIcon, Heart, Reply, ChevronDown, ChevronUp } from "lucide-react"
import Link from "next/link"
import { useState, useEffect, memo } from "react"
import { useSearchParams } from "next/navigation"
import { useSession } from "next-auth/react"
import Image from "next/image"
import { authenticatedFetch } from "@/lib/api-client"

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
  user: {
    id: string
    name: string
    email: string
  }
}

interface Comment {
  id: number
  post_id: number
  parent_id?: number | null
  user_id: string
  user_name: string
  content: string
  is_anonymous: boolean
  likes_count: number
  created_at: string
  user_has_liked: boolean
  replies: Comment[]
}

const CommentItem = memo(function CommentItem({
  comment,
  depth,
  onLike,
  onReply,
  replyingTo,
  replyContent,
  replyAnonymous,
  setReplyContent,
  setReplyAnonymous,
  onReplySubmit,
  onCancelReply,
  isSubmittingComment,
}: {
  comment: Comment
  depth: number
  onLike: (id: number) => void
  onReply: (id: number) => void
  replyingTo: number | null
  replyContent: string
  replyAnonymous: boolean
  setReplyContent: (content: string) => void
  setReplyAnonymous: (anonymous: boolean) => void
  onReplySubmit: (parentId: number) => void
  onCancelReply: () => void
  isSubmittingComment: boolean
}) {
  const maxDepth = 3
  const indent = depth > 0 ? "ml-8 border-l-2 border-muted pl-4" : ""

  return (
    <div className={`space-y-3 ${indent}`}>
      <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/30">
        <Avatar className="h-10 w-10 border-2 flex-shrink-0">
          <AvatarFallback className="bg-primary/10">
            {comment.is_anonymous ? "?" : comment.user_name[0]}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 space-y-2 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-semibold">{comment.user_name}</span>
            <span className="text-xs text-muted-foreground">
              {new Date(comment.created_at).toLocaleDateString()}
            </span>
          </div>
          <p className="text-sm text-foreground leading-relaxed break-words">{comment.content}</p>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 -ml-2"
              onClick={() => onLike(comment.id)}
            >
              <Heart
                className={`h-3 w-3 mr-1 ${comment.user_has_liked ? "fill-current text-red-500" : ""}`}
              />
              {comment.likes_count}
            </Button>
            {depth < maxDepth && (
              <Button
                variant="ghost"
                size="sm"
                className="h-8"
                onClick={() => onReply(comment.id)}
              >
                <Reply className="h-3 w-3 mr-1" />
                Reply
              </Button>
            )}
          </div>

          {/* Reply Form */}
          {replyingTo === comment.id && (
            <div className="mt-3 space-y-2 border-l-2 border-primary pl-3">
              <Textarea
                placeholder="Write a reply..."
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                rows={3}
                className="resize-none text-sm"
              />
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-xs text-muted-foreground cursor-pointer">
                  <input
                    type="checkbox"
                    checked={replyAnonymous}
                    onChange={(e) => setReplyAnonymous(e.target.checked)}
                    className="rounded"
                  />
                  Reply anonymously
                </label>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onCancelReply}
                    disabled={isSubmittingComment}
                  >
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => onReplySubmit(comment.id)}
                    disabled={!replyContent.trim() || isSubmittingComment}
                  >
                    {isSubmittingComment ? (
                      <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                    ) : (
                      <Reply className="h-3 w-3 mr-1" />
                    )}
                    Post Reply
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Render replies recursively */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="space-y-3">
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              depth={depth + 1}
              onLike={onLike}
              onReply={onReply}
              replyingTo={replyingTo}
              replyContent={replyContent}
              replyAnonymous={replyAnonymous}
              setReplyContent={setReplyContent}
              setReplyAnonymous={setReplyAnonymous}
              onReplySubmit={onReplySubmit}
              onCancelReply={onCancelReply}
              isSubmittingComment={isSubmittingComment}
            />
          ))}
        </div>
      )}
    </div>
  )
})

export default function CandidatePage({ params }: { params: { id: string } }) {
  const searchParams = useSearchParams()
  const returnTo = searchParams.get("from") || "local"
  const partylistId = searchParams.get("partylistId")
  const profileTab = searchParams.get("tab") || "posts"
  const { data: session } = useSession()

  const [post, setPost] = useState<Post | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Comments state
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState("")
  const [isAnonymous, setIsAnonymous] = useState(false)
  const [isSubmittingComment, setIsSubmittingComment] = useState(false)
  const [replyingTo, setReplyingTo] = useState<number | null>(null)
  const [replyContent, setReplyContent] = useState("")
  const [replyAnonymous, setReplyAnonymous] = useState(false)

  // Voting state
  const [votesCount, setVotesCount] = useState(0)
  const [commentsCount, setCommentsCount] = useState(0)
  const [hasVoted, setHasVoted] = useState(false)
  const [isVoteAnonymous, setIsVoteAnonymous] = useState(true)
  const [isSubmittingVote, setIsSubmittingVote] = useState(false)
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({})

  // Optimized: Fetch all data in a single API call
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const response = await authenticatedFetch(
          `${process.env.NEXT_PUBLIC_API_URL}/posts/${params.id}`
        )

        if (response.ok) {
          const data = await response.json()
          setPost(data.post)
          setVotesCount(data.votes_count)
          setCommentsCount(data.comments_count)
          setHasVoted(data.user_has_voted)
          setComments(data.comments)

          if (data.user_vote_is_anonymous !== null) {
            setIsVoteAnonymous(data.user_vote_is_anonymous)
          }
        }
      } catch (error) {
        console.error("Failed to load candidate data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchAllData()
  }, [params.id])

  const handleVote = async () => {
    if (!session) {
      alert("Please sign in to vote")
      return
    }

    // Optimistic update: update UI immediately
    const previousVoted = hasVoted
    const previousCount = votesCount
    const newVoted = !hasVoted
    const newCount = newVoted ? votesCount + 1 : Math.max(0, votesCount - 1)
    
    setHasVoted(newVoted)
    setVotesCount(newCount)
    setIsSubmittingVote(true)

    try {
      const response = await authenticatedFetch(
        `${process.env.NEXT_PUBLIC_API_URL}/posts/${post?.id}/vote`,
        {
          method: "POST",
          body: JSON.stringify({ is_anonymous: isVoteAnonymous }),
        }
      )

      if (response.ok) {
        const data = await response.json()
        // Sync with server response
        setHasVoted(data.voted)
        setVotesCount(data.votes_count)
      } else {
        // Revert on error
        setHasVoted(previousVoted)
        setVotesCount(previousCount)
        alert("Failed to record vote")
      }
    } catch (error) {
      console.error("Failed to vote:", error)
      // Revert on error
      setHasVoted(previousVoted)
      setVotesCount(previousCount)
      alert("Failed to record vote")
    } finally {
      setIsSubmittingVote(false)
    }
  }

  const handleCommentSubmit = async () => {
    if (!session) {
      alert("Please sign in to comment")
      return
    }

    if (!newComment.trim()) return

    const commentContent = newComment.trim()
    const commentIsAnonymous = isAnonymous
    
    // Optimistic update: add comment immediately
    const tempId = Date.now() // Temporary ID for optimistic update
    const optimisticComment: Comment = {
      id: tempId,
      post_id: post?.id || 0,
      parent_id: null,
      user_id: session.user?.id || "",
      user_name: commentIsAnonymous ? "Anonymous" : (session.user?.name || "You"),
      content: commentContent,
      is_anonymous: commentIsAnonymous,
      likes_count: 0,
      created_at: new Date().toISOString(),
      user_has_liked: false,
      replies: [],
    }
    
    setComments([optimisticComment, ...comments])
    setNewComment("")
    setCommentsCount(commentsCount + 1)
    setIsSubmittingComment(true)

    try {
      const response = await authenticatedFetch(
        `${process.env.NEXT_PUBLIC_API_URL}/posts/${post?.id}/comments`,
        {
          method: "POST",
          body: JSON.stringify({
            content: commentContent,
            is_anonymous: commentIsAnonymous,
          }),
        }
      )

      if (response.ok) {
        const data = await response.json()
        // Replace optimistic comment with real one
        setComments(comments => [
          data.comment,
          ...comments.filter(c => c.id !== tempId)
        ])
      } else {
        // Revert on error
        setComments(comments => comments.filter(c => c.id !== tempId))
        setCommentsCount(prev => Math.max(0, prev - 1))
        alert("Failed to post comment")
      }
    } catch (error) {
      console.error("Failed to post comment:", error)
      // Revert on error
      setComments(comments => comments.filter(c => c.id !== tempId))
      setCommentsCount(prev => Math.max(0, prev - 1))
      alert("Failed to post comment")
    } finally {
      setIsSubmittingComment(false)
    }
  }

  const handleReplySubmit = async (parentId: number) => {
    if (!session) {
      alert("Please sign in to reply")
      return
    }

    if (!replyContent.trim()) return

    const replyContentText = replyContent.trim()
    const replyIsAnonymous = replyAnonymous
    
    // Optimistic update: add reply immediately
    const tempId = Date.now()
    const optimisticReply: Comment = {
      id: tempId,
      post_id: post?.id || 0,
      parent_id: parentId,
      user_id: session.user?.id || "",
      user_name: replyIsAnonymous ? "Anonymous" : (session.user?.name || "You"),
      content: replyContentText,
      is_anonymous: replyIsAnonymous,
      likes_count: 0,
      created_at: new Date().toISOString(),
      user_has_liked: false,
      replies: [],
    }
    
    setComments(
      comments.map((comment) => {
        if (comment.id === parentId) {
          return {
            ...comment,
            replies: [...comment.replies, optimisticReply],
          }
        }
        return comment
      })
    )
    setReplyContent("")
    setReplyingTo(null)
    setCommentsCount(commentsCount + 1)
    setIsSubmittingComment(true)

    try {
      const response = await authenticatedFetch(
        `${process.env.NEXT_PUBLIC_API_URL}/posts/${post?.id}/comments`,
        {
          method: "POST",
          body: JSON.stringify({
            content: replyContentText,
            is_anonymous: replyIsAnonymous,
            parent_id: parentId,
          }),
        }
      )

      if (response.ok) {
        const data = await response.json()
        // Replace optimistic reply with real one
        setComments(
          comments.map((comment) => {
            if (comment.id === parentId) {
              return {
                ...comment,
                replies: [
                  ...comment.replies.filter(r => r.id !== tempId),
                  data.comment
                ],
              }
            }
            return comment
          })
        )
      } else {
        // Revert on error
        setComments(
          comments.map((comment) => {
            if (comment.id === parentId) {
              return {
                ...comment,
                replies: comment.replies.filter(r => r.id !== tempId),
              }
            }
            return comment
          })
        )
        setCommentsCount(prev => Math.max(0, prev - 1))
        alert("Failed to post reply")
      }
    } catch (error) {
      console.error("Failed to post reply:", error)
      // Revert on error
      setComments(
        comments.map((comment) => {
          if (comment.id === parentId) {
            return {
              ...comment,
              replies: comment.replies.filter(r => r.id !== tempId),
            }
          }
          return comment
        })
      )
      setCommentsCount(prev => Math.max(0, prev - 1))
      alert("Failed to post reply")
    } finally {
      setIsSubmittingComment(false)
    }
  }

  const handleCommentLike = async (commentId: number) => {
    if (!session) {
      alert("Please sign in to like comments")
      return
    }

    // Helper function to find and update comment recursively
    const findComment = (comments: Comment[], id: number): Comment | null => {
      for (const comment of comments) {
        if (comment.id === id) return comment
        if (comment.replies) {
          const found = findComment(comment.replies, id)
          if (found) return found
        }
      }
      return null
    }

    // Optimistic update: update UI immediately
    const comment = findComment(comments, commentId)
    if (!comment) return

    const previousLiked = comment.user_has_liked
    const previousCount = comment.likes_count
    const newLiked = !previousLiked
    const newCount = newLiked ? previousCount + 1 : Math.max(0, previousCount - 1)

    const updateCommentLikes = (comments: Comment[]): Comment[] => {
      return comments.map((comment) => {
        if (comment.id === commentId) {
          return {
            ...comment,
            likes_count: newCount,
            user_has_liked: newLiked,
          }
        }
        if (comment.replies && comment.replies.length > 0) {
          return {
            ...comment,
            replies: updateCommentLikes(comment.replies),
          }
        }
        return comment
      })
    }

    setComments(updateCommentLikes(comments))

    try {
      const response = await authenticatedFetch(
        `${process.env.NEXT_PUBLIC_API_URL}/comments/${commentId}/like`,
        {
          method: "POST",
        }
      )

      if (response.ok) {
        const data = await response.json()
        // Sync with server response
        const syncCommentLikes = (comments: Comment[]): Comment[] => {
          return comments.map((comment) => {
            if (comment.id === commentId) {
              return {
                ...comment,
                likes_count: data.likes_count,
                user_has_liked: data.liked,
              }
            }
            if (comment.replies && comment.replies.length > 0) {
              return {
                ...comment,
                replies: syncCommentLikes(comment.replies),
              }
            }
            return comment
          })
        }
        setComments(syncCommentLikes(comments))
      } else {
        // Revert on error
        const revertCommentLikes = (comments: Comment[]): Comment[] => {
          return comments.map((comment) => {
            if (comment.id === commentId) {
              return {
                ...comment,
                likes_count: previousCount,
                user_has_liked: previousLiked,
              }
            }
            if (comment.replies && comment.replies.length > 0) {
              return {
                ...comment,
                replies: revertCommentLikes(comment.replies),
              }
            }
            return comment
          })
        }
        setComments(revertCommentLikes(comments))
      }
    } catch (error) {
      console.error("Failed to like comment:", error)
      // Revert on error
      const revertCommentLikes = (comments: Comment[]): Comment[] => {
        return comments.map((comment) => {
          if (comment.id === commentId) {
            return {
              ...comment,
              likes_count: previousCount,
              user_has_liked: previousLiked,
    }
  }
          if (comment.replies && comment.replies.length > 0) {
            return {
              ...comment,
              replies: revertCommentLikes(comment.replies),
            }
          }
          return comment
        })
      }
      setComments(revertCommentLikes(comments))
    }
  }

  // Skeleton loading component
  const SkeletonCard = () => (
    <div className="animate-pulse">
      <div className="h-8 bg-muted rounded w-3/4 mb-4"></div>
      <div className="h-4 bg-muted rounded w-full mb-2"></div>
      <div className="h-4 bg-muted rounded w-5/6"></div>
    </div>
  )

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b bg-card">
          <div className="container mx-auto px-4 py-4">
            <div className="h-10 bg-muted rounded w-24 animate-pulse"></div>
          </div>
        </header>
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row gap-6 mb-8">
              <div className="w-full md:w-1/3">
                <div className="h-64 bg-muted rounded-lg animate-pulse"></div>
              </div>
              <div className="w-full md:w-2/3 space-y-4">
                <SkeletonCard />
                <SkeletonCard />
                <SkeletonCard />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Candidate Not Found</h2>
          <Button asChild>
            <Link href={
              returnTo === "profile" 
                ? `/profile?tab=${profileTab}` 
                : "/browse"
            }>
              {returnTo === "profile" ? "Return to Profile" : "Return to Browse"}
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <Button variant="ghost" asChild>
            <Link href={
              returnTo === "profile" 
                ? `/profile?tab=${profileTab}` 
                : partylistId 
                  ? `/partylist/${partylistId}` 
                  : `/browse?tab=${returnTo}`
            }>
              <ArrowLeft className="h-4 w-4 mr-2" />
              {returnTo === "profile" 
                ? "Back to Profile" 
                : partylistId 
                  ? "Back to Party List" 
                  : "Back to Candidates"}
            </Link>
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-shrink-0 mx-auto md:mx-0">
                    <Avatar className="h-40 w-40 border-4 border-primary/10">
                      <AvatarImage
                        src={post.profile_photo || "/placeholder.svg"}
                        alt={post.name}
                      />
                      <AvatarFallback className="text-3xl bg-primary/5">
                        {post.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="flex-1 space-y-4 text-center md:text-left">
                    <div>
                      <h1 className="text-4xl font-bold text-balance">{post.name}</h1>
                      <p className="text-xl text-muted-foreground mt-2">Running for {post.position}</p>
                    </div>
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                      {post.party && (
                        <Badge variant="secondary" className="text-sm px-3 py-1">
                          {post.party}
                        </Badge>
                      )}
                      <Badge variant="outline" className="text-sm px-3 py-1">
                        <MapPin className="h-3 w-3 mr-1" />
                        {post.level}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-center md:justify-start gap-6 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <VoteIcon className="h-5 w-5 text-primary" />
                        <span className="font-semibold">{votesCount}</span>
                        <span>votes</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MessageSquare className="h-5 w-5 text-primary" />
                        <span className="font-semibold">{commentsCount}</span>
                        <span>comments</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Bio */}
            <Card>
              <CardHeader>
                <CardTitle>About</CardTitle>
              </CardHeader>
              <CardContent>
                {(() => {
                  const bioKey = `bio-${post.id}`
                  const isExpanded = expandedSections[bioKey] || false
                  const shouldTruncate = post.bio && post.bio.length > 300
                  const displayText = shouldTruncate && !isExpanded 
                    ? post.bio.substring(0, 300) + '...' 
                    : post.bio
                  
                  return (
                    <div>
                      <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap break-words">{displayText}</p>
                      {shouldTruncate && (
                        <button
                          onClick={() => setExpandedSections(prev => ({ ...prev, [bioKey]: !isExpanded }))}
                          className="mt-3 text-sm text-primary hover:text-primary/80 font-medium flex items-center gap-1 transition-colors"
                        >
                          {isExpanded ? (
                            <>
                              <ChevronUp className="h-4 w-4" />
                              Show Less
                            </>
                          ) : (
                            <>
                              <ChevronDown className="h-4 w-4" />
                              Show More
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  )
                })()}
              </CardContent>
            </Card>

            {/* Platform */}
            {post.platform && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Flag className="h-5 w-5" />
                    Platform & Advocacy
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {(() => {
                    const platformKey = `platform-${post.id}`
                    const isExpanded = expandedSections[platformKey] || false
                    const shouldTruncate = post.platform && post.platform.length > 300
                    const displayText = shouldTruncate && !isExpanded 
                      ? post.platform.substring(0, 300) + '...' 
                      : post.platform
                    
                    return (
                      <div>
                        <p className="text-muted-foreground whitespace-pre-line leading-relaxed break-words">{displayText}</p>
                        {shouldTruncate && (
                          <button
                            onClick={() => setExpandedSections(prev => ({ ...prev, [platformKey]: !isExpanded }))}
                            className="mt-3 text-sm text-primary hover:text-primary/80 font-medium flex items-center gap-1 transition-colors"
                          >
                            {isExpanded ? (
                              <>
                                <ChevronUp className="h-4 w-4" />
                                Show Less
                              </>
                            ) : (
                              <>
                                <ChevronDown className="h-4 w-4" />
                                Show More
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    )
                  })()}
                </CardContent>
              </Card>
            )}

            {/* Education */}
            {post.education && post.education.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <GraduationCap className="h-5 w-5" />
                    Education
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {post.education.map((edu, index) => (
                      <div key={index} className="flex gap-3 p-3 rounded-lg bg-muted/50">
                        <span className="text-primary font-bold text-xl mt-0.5">•</span>
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-foreground">{edu.level}</p>
                          <p className="text-sm text-muted-foreground">{edu.school}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Achievements */}
            {post.achievements && post.achievements.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="h-5 w-5" />
                    Key Achievements
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-4">
                    {post.achievements.map((achievement, index) => (
                      <li key={index} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                        <span className="text-primary font-bold text-xl mt-0.5 flex-shrink-0">✓</span>
                        <span className="text-foreground leading-relaxed flex-1 break-words min-w-0">{achievement}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Images Gallery */}
            {post.images && post.images.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Campaign Gallery</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    {post.images.map((image, index) => {
                      const captionKey = `caption-${post.id}-${index}`
                      const isExpanded = expandedSections[captionKey] || false
                      const shouldTruncate = image.caption && image.caption.length > 150
                      const displayCaption = shouldTruncate && !isExpanded 
                        ? image.caption.substring(0, 150) + '...' 
                        : image.caption
                      
                      return (
                        <div key={index} className="space-y-2">
                          <div className="relative h-64 w-full rounded-lg overflow-hidden">
                            <Image
                              src={image.url}
                              alt={image.caption || post.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          {image.caption && (
                            <div>
                              <p className="text-sm text-muted-foreground italic whitespace-pre-wrap break-words">
                                {displayCaption}
                              </p>
                              {shouldTruncate && (
                                <button
                                  onClick={() => setExpandedSections(prev => ({ ...prev, [captionKey]: !isExpanded }))}
                                  className="mt-1 text-xs text-primary hover:text-primary/80 font-medium flex items-center gap-1 transition-colors"
                                >
                                  {isExpanded ? (
                                    <>
                                      <ChevronUp className="h-3 w-3" />
                                      Show Less
                                    </>
                                  ) : (
                                    <>
                                      <ChevronDown className="h-3 w-3" />
                                      Show More
                                    </>
                                  )}
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Comments Section */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Community Discussion</CardTitle>
                <CardDescription>What voters are saying about this candidate</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Add Comment */}
                <div className="space-y-3">
                  <Textarea
                    placeholder="Share your thoughts about this candidate..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    rows={4}
                    className="resize-none"
                  />
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isAnonymous}
                        onChange={(e) => setIsAnonymous(e.target.checked)}
                        className="rounded"
                      />
                      Post anonymously
                    </label>
                    <Button
                      onClick={handleCommentSubmit}
                      disabled={!newComment.trim() || isSubmittingComment}
                    >
                      {isSubmittingComment ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <MessageSquare className="h-4 w-4 mr-2" />
                      )}
                      Post Comment
                    </Button>
                  </div>
                </div>

                <Separator />

                {/* Comments List */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                    Recent Comments ({comments.length})
                  </h3>
                  {comments.length === 0 ? (
                    <p className="text-center py-8 text-muted-foreground">
                      No comments yet. Be the first to share your thoughts!
                    </p>
                  ) : (
                    comments.map((comment) => (
                      <CommentItem
                        key={comment.id}
                        comment={comment}
                        depth={0}
                        onLike={handleCommentLike}
                        onReply={(commentId) => {
                          setReplyingTo(commentId)
                          setReplyContent("")
                          setReplyAnonymous(false)
                        }}
                        replyingTo={replyingTo}
                        replyContent={replyContent}
                        replyAnonymous={replyAnonymous}
                        setReplyContent={setReplyContent}
                        setReplyAnonymous={setReplyAnonymous}
                        onReplySubmit={handleReplySubmit}
                        onCancelReply={() => setReplyingTo(null)}
                        isSubmittingComment={isSubmittingComment}
                      />
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle>Support This Candidate</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <Button
                    className="w-full"
                    size="lg"
                    onClick={handleVote}
                    disabled={isSubmittingVote || hasVoted}
                    variant={hasVoted ? "secondary" : "default"}
                  >
                    {isSubmittingVote ? (
                      <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    ) : (
                      <ThumbsUp className="h-5 w-5 mr-2" />
                    )}
                    {hasVoted ? "Vote Recorded" : `Vote for ${post.name.split(" ")[0]}`}
                  </Button>
                  <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isVoteAnonymous}
                      onChange={(e) => setIsVoteAnonymous(e.target.checked)}
                      className="rounded"
                      disabled={hasVoted}
                    />
                    Vote anonymously
                  </label>
                </div>
                <p className="text-xs text-muted-foreground text-center leading-relaxed">
                  This is a community poll to gauge voter sentiment.{" "}
                  {isVoteAnonymous ? "Your vote will be anonymous" : "Your name will be shown with your vote"} and
                  helps others understand public opinion.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Facts</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Position</p>
                  <p className="font-semibold">{post.position}</p>
                </div>
                <Separator />
                <div>
                  <p className="text-sm text-muted-foreground">Level</p>
                  <p className="font-semibold">{post.level}</p>
                </div>
                {post.party && (
                  <>
                    <Separator />
                    <div>
                      <p className="text-sm text-muted-foreground">Party / Partylist</p>
                      <p className="font-semibold">{post.party}</p>
                    </div>
                  </>
                )}
                <Separator />
                <div>
                  <p className="text-sm text-muted-foreground">Submitted by</p>
                  <p className="font-semibold">{post.user.name}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">About This Profile</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Candidate profiles are created and maintained by community members. All information should be
                  verified through official sources.
                </p>
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>
    </div>
  )
}
