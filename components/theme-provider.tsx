"use client"

import type React from "react"

import { useEffect, useState } from "react"

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Always use light mode - remove any dark class
    document.documentElement.classList.remove("dark")
    localStorage.removeItem("theme")
  }, [])

  if (!mounted) return <>{children}</>

  return <>{children}</>
}
