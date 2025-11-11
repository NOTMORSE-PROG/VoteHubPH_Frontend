"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

interface PartyList {
  id: number
  name: string
  acronym?: string | null
  sector?: string | null
  description?: string | null
  member_count: number
}

interface PartyListCardProps {
  partyList: PartyList
  currentTab?: "local" | "national" | "partylist"
}

export function PartyListCard({ partyList, currentTab = "partylist" }: PartyListCardProps) {
  return (
    <Link href={`/partylist/${partyList.id}?from=${currentTab}`}>
      <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
        <CardHeader className="space-y-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <h3 className="font-bold text-lg leading-tight line-clamp-2">{partyList.name}</h3>
              {partyList.acronym && <p className="text-sm text-muted-foreground mt-1">{partyList.acronym}</p>}
            </div>
          </div>
          {partyList.sector && (
            <Badge variant="secondary" className="w-fit">
              {partyList.sector}
            </Badge>
          )}
        </CardHeader>
        <CardContent className="space-y-3">
          {partyList.description && (
            <p className="text-sm text-muted-foreground line-clamp-3">{partyList.description}</p>
          )}
          <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
            <span className="font-medium">{partyList.member_count || 0} {partyList.member_count === 1 ? 'member' : 'members'}</span>
            <span className="text-primary font-medium">View Details →</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

