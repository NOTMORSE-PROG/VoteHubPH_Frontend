"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { T } from "@/components/auto-translate"

interface Position {
  id: string
  name: string
  level: "barangay" | "city" | "national"
}

const positions: Position[] = [
  // Barangay Level
  { id: "barangay-chairman", name: "Barangay Chairman", level: "barangay" },
  { id: "barangay-kagawad", name: "Barangay Kagawad", level: "barangay" },
  
  // City Level
  { id: "mayor", name: "Mayor", level: "city" },
  { id: "vice-mayor", name: "Vice Mayor", level: "city" },
  { id: "councilor", name: "Councilor", level: "city" },
  
  // National Level
  { id: "president", name: "President", level: "national" },
  { id: "vice-president", name: "Vice President", level: "national" },
  { id: "senator", name: "Senator", level: "national" },
  { id: "representative", name: "Representative", level: "national" },
]

interface PositionFilterProps {
  level: "barangay" | "city" | "national"
  value: string
  onValueChange: (value: string) => void
}

export function PositionFilter({ level, value, onValueChange }: PositionFilterProps) {
  const filteredPositions = positions.filter((p) => p.level === level)

  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium"><T>Position</T></label>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger>
          <SelectValue placeholder="All" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all"><T>All</T></SelectItem>
          {filteredPositions.map((position) => (
            <SelectItem key={position.id} value={position.id}>
              {position.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
