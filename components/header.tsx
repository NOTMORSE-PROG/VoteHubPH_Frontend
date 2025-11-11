"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Vote } from "lucide-react"

export function Header() {
  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 hover:bg-muted/50 px-2 py-1 rounded transition-colors">
            <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center">
              <Vote className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-primary">CivicVoicePH</h1>
              <p className="text-xs text-muted-foreground">Empowering Voters</p>
            </div>
          </Link>

          {/* Auth Links */}
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm">
                Sign In
              </Button>
            </Link>
            <Link href="/register">
              <Button size="sm">Create Account</Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
