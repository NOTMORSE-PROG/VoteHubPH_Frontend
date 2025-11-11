"use client"

import { Home, Flag, Users } from "lucide-react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { T } from "@/components/auto-translate"

interface GovernmentNavProps {
  value: "local" | "national" | "partylist"
  onValueChange: (value: "local" | "national" | "partylist") => void
}

export function GovernmentNav({ value, onValueChange }: GovernmentNavProps) {
  return (
    <Tabs value={value} onValueChange={onValueChange as any} className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="local" className="flex items-center gap-2">
          <Home className="h-4 w-4" />
          <T>Local</T>
        </TabsTrigger>
        <TabsTrigger value="national" className="flex items-center gap-2">
          <Flag className="h-4 w-4" />
          <T>National</T>
        </TabsTrigger>
        <TabsTrigger value="partylist" className="flex items-center gap-2">
          <Users className="h-4 w-4" />
          <T>Party-List</T>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  )
}
