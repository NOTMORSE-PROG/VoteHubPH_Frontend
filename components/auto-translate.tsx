"use client"

import { useTranslate } from "@/lib/use-translate"

interface AutoTranslateProps {
  children: string
}

export function AutoTranslate({ children }: AutoTranslateProps) {
  const translated = useTranslate(children)
  return <>{translated}</>
}

// Component for translating text in elements
export function T({ children }: { children: string }) {
  const translated = useTranslate(children)
  return <>{translated}</>
}
