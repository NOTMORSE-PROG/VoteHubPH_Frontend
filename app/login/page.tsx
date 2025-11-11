"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { signIn, useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Vote, Mail, Lock, Chrome, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { T } from "@/components/auto-translate"

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { data: session, status, update } = useSession()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  // Pre-fill email from URL parameter (after OTP verification)
  useEffect(() => {
    const emailParam = searchParams.get("email")
    if (emailParam) {
      setEmail(emailParam)
    }
  }, [searchParams])

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError("Invalid email or password")
        setIsLoading(false)
      } else {
        // Wait for session to be established and created in database
        // With database sessions, we need to wait for the session to be created
        await new Promise(resolve => setTimeout(resolve, 2000))
        
        // Force session refresh to ensure it's loaded from database
        await update()
        
        // Wait a bit more for session to be fully ready
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // Refresh router to ensure session is loaded in middleware
        router.refresh()
        
        // Wait one more time for everything to sync
        await new Promise(resolve => setTimeout(resolve, 1000))

        // Use window.location for hard redirect to ensure session cookie is sent
        window.location.href = "/browse"
      }
    } catch (err) {
      setError("An error occurred. Please try again.")
      setIsLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setIsLoading(true)
    setError("")

    try {
      await signIn("google", {
        callbackUrl: "/browse",
      })
    } catch (err) {
      setError("Google login failed. Please try again.")
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted flex items-center justify-center px-4">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 border-b bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <Button type="button" variant="ghost" size="sm" onClick={() => router.push("/")} className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <Link href="/" className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center">
                <Vote className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-primary">VoteHubPH</h1>
                <p className="text-xs text-muted-foreground">Empowering Filipino Voters</p>
              </div>
            </Link>
            <div className="w-20" />
          </div>
        </div>
      </div>

      <div className="w-full max-w-md mt-20">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl"><T>Welcome Back</T></CardTitle>
            <CardDescription><T>Sign in to your VoteHubPH account</T></CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Error Message */}
            {error && (
              <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md">
                {error}
              </div>
            )}

            {/* Email/Password Form */}
            <form onSubmit={handleEmailLogin} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
              </div>
            </div>

            {/* SSO Buttons */}
            <div className="space-y-2">
              <Button
                type="button"
                variant="outline"
                className="w-full bg-transparent"
                onClick={handleGoogleLogin}
                disabled={isLoading}
              >
                <Chrome className="h-4 w-4 mr-2" />
                <T>Continue with Google</T>
              </Button>
            </div>

            {/* Sign Up Link */}
            <p className="text-center text-sm text-muted-foreground">
              <T>Don't have an account?</T>{" "}
              <Link href="/register" className="text-primary hover:underline font-medium">
                <T>Sign up</T>
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
