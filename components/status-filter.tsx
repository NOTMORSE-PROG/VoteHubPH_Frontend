"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { T } from "@/components/auto-translate"

interface StatusFilterProps {
  value: string
  onValueChange: (value: string) => void
}

export function StatusFilter({ value, onValueChange }: StatusFilterProps) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium"><T>Experience</T></label>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger>
          <SelectValue placeholder="All" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all"><T>All</T></SelectItem>
          <SelectItem value="incumbent"><T>Running Again</T></SelectItem>
          <SelectItem value="challenger"><T>First Time</T></SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
