"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

export default function PartyListMemberPage({ params }: { params: { id: string; memberId: string } }) {
  const router = useRouter()

  useEffect(() => {
    // Redirect to candidate page since memberId is actually the post ID
    // The member detail page should just show the candidate profile
    router.replace(`/candidate/${params.memberId}`)
  }, [params.memberId, router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
        <p className="text-muted-foreground">Redirecting to candidate profile...</p>
      </div>
    </div>
  )
}
