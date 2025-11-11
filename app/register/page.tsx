"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { signIn, useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Vote, Mail, Chrome, ArrowLeft, Lock, User } from "lucide-react"
import Link from "next/link"
import { T } from "@/components/auto-translate"

export default function RegisterPage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [step, setStep] = useState<"email" | "otp">("email")
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [otp, setOtp] = useState("")
  const [storedPassword, setStoredPassword] = useState("") // Store password for after OTP verification
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [otpTimer, setOtpTimer] = useState(0) // Countdown timer in seconds
  const [canResend, setCanResend] = useState(false) // Whether resend button is enabled
  const [isResending, setIsResending] = useState(false) // Whether OTP is being resent

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    if (!email) {
      setError("Email is required")
      return
    }

    if (!name) {
      setError("Name is required")
      return
    }

    if (!password || password.length < 8) {
      setError("Password must be at least 8 characters")
      return
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    setIsLoading(true)

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'
      const response = await fetch(`${API_URL}/auth/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || data.errors?.email?.[0] || "Failed to send OTP")
        setIsLoading(false)
        return
      }

      // Store password for after OTP verification
      setStoredPassword(password)
      
      // Start 5-minute countdown timer (300 seconds)
      setOtpTimer(300)
      setCanResend(false) // Disable resend button initially
      setIsResending(false)
      
      // If OTP is returned in response (development mode when mail fails)
      if (data.otp) {
        setSuccess(`OTP sent! ${data.warning ? data.warning + ' ' : ''}Your OTP: ${data.otp}`)
        console.log("🔐 Your OTP:", data.otp)
      } else {
        setSuccess("OTP sent to your email! Please check your inbox.")
      }
      setStep("otp")
    } catch (err) {
      setError("Failed to send OTP. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    if (!otp || otp.length !== 6) {
      setError("Please enter the 6-digit OTP")
      return
    }

    setIsLoading(true)

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'
      const response = await fetch(`${API_URL}/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Invalid OTP")
        setIsLoading(false)
        return
      }

      setSuccess("Account created successfully! Redirecting to sign in...")

      // Store token for authentication (will be used when user signs in)
      if (data.token) {
        localStorage.setItem('auth_token', data.token)
      }

      // Sync user from Laravel to Prisma (for NextAuth)
      // This allows the user to sign in on the login page
      let syncSuccess = false
      try {
        const syncResponse = await fetch('/api/auth/sync-user', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email,
            name: data.user?.name || name,
            password: storedPassword || password, // Plain password - will be hashed in sync endpoint
            userId: data.user?.id,
            token: data.token, // Pass token to fetch user data from Laravel if needed
          }),
        })

        const syncData = await syncResponse.json()
        
        if (syncResponse.ok && syncData.success) {
          syncSuccess = true
          console.log('✅ User synced to Prisma:', syncData.message)
        } else {
          console.error('❌ Sync failed:', syncData.error || syncData.message)
          // If sync fails, we should still allow redirect but warn user
          setError(`Account created but sync failed: ${syncData.error || 'Unknown error'}. You may need to try signing in again.`)
        }
      } catch (syncErr: any) {
        console.error('❌ Sync user error:', syncErr)
        setError(`Account created but sync failed: ${syncErr.message}. You may need to try signing in again.`)
      }

      // If sync failed, wait a bit and try to verify user exists
      if (!syncSuccess) {
        // Wait and check if user exists in Prisma
        await new Promise(resolve => setTimeout(resolve, 2000))
        
        try {
          const verifyResponse = await fetch('/api/auth/sync-user', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
        email,
              name: data.user?.name || name,
              password: storedPassword || password,
              userId: data.user?.id,
              token: data.token,
            }),
          })
          
          const verifyData = await verifyResponse.json()
          if (verifyResponse.ok && verifyData.success) {
            syncSuccess = true
            setError("") // Clear error if retry succeeded
            console.log('✅ User synced on retry')
          }
        } catch (retryErr) {
          console.error('❌ Retry sync failed:', retryErr)
        }
      }

      // Wait a moment to show success message
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Redirect directly to login page with email pre-filled
      // User will sign in and go to browse (no profile completion needed)
      router.push(`/login?email=${encodeURIComponent(email)}`)
    } catch (err) {
      setError("Failed to verify OTP. Please try again.")
      setIsLoading(false)
    }
  }

  // Countdown timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null
    
    if (step === "otp" && otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer((prev) => {
          if (prev <= 1) {
            setCanResend(true) // Enable resend button when timer reaches 0
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [step, otpTimer])

  const handleResendOTP = async () => {
    if (!canResend || isResending) return
    
    setIsResending(true)
    setError("")
    setSuccess("")
    setCanResend(false) // Disable button immediately when clicked
    
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'
      const passwordToUse = storedPassword || password
      const response = await fetch(`${API_URL}/auth/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name, password: passwordToUse }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || data.errors?.email?.[0] || "Failed to resend OTP")
        setCanResend(true) // Re-enable if error
        setIsResending(false)
        return
      }

      // Restart timer
      setOtpTimer(300) // 5 minutes
      setCanResend(false)
      
      // If OTP is returned in response (development mode when mail fails)
      if (data.otp) {
        setSuccess(`OTP resent! ${data.warning ? data.warning + ' ' : ''}Your OTP: ${data.otp}`)
        console.log("🔐 Your OTP:", data.otp)
      } else {
        setSuccess("OTP resent to your email! Please check your inbox.")
      }
    } catch (err) {
      setError("Failed to resend OTP. Please try again.")
      setCanResend(true) // Re-enable if error
    } finally {
      setIsResending(false)
    }
  }

  const handleGoogleSignUp = async () => {
    setIsLoading(true)
    setError("")

    try {
      await signIn("google", {
        callbackUrl: "/browse",
      })
    } catch (err) {
      setError("Google sign up failed. Please try again.")
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted flex items-center justify-center px-4">
      <div className="absolute top-0 left-0 right-0 border-b bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <Button type="button" variant="ghost" size="sm" onClick={() => router.back()} className="gap-2">
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
            <CardTitle className="text-2xl"><T>Create Account</T></CardTitle>
            <CardDescription>
              <T>{step === "email" ? "Join VoteHubPH and make your voice heard" : "Enter the OTP sent to your email"}</T>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Error/Success Messages */}
            {error && (
              <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md">
                {error}
              </div>
            )}
            {success && (
              <div className="bg-green-500/10 text-green-600 dark:text-green-400 text-sm p-3 rounded-md">
                {success}
              </div>
            )}

            {step === "email" ? (
              /* Email Registration Form */
              <>
                <form onSubmit={handleSendOTP} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium"><T>Name</T></label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="text"
                        placeholder="Juan Dela Cruz"
                        value={name}
                        onChange={(e) => {
                          setName(e.target.value)
                          setError("")
                        }}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium"><T>Email</T></label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="email"
                        placeholder="your@email.com"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value)
                          setError("")
                        }}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium"><T>Password</T></label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value)
                          setError("")
                        }}
                        className="pl-10"
                        required
                        minLength={8}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">At least 8 characters</p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium"><T>Confirm Password</T></label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="password"
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChange={(e) => {
                          setConfirmPassword(e.target.value)
                          setError("")
                        }}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? <T>Sending OTP...</T> : <T>Send OTP</T>}
                  </Button>
                </form>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t"></div>
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">Or sign up with</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full bg-transparent"
                    onClick={handleGoogleSignUp}
                    disabled={isLoading}
                  >
                    <Chrome className="h-4 w-4 mr-2" />
                    <T>Continue with Google</T>
                  </Button>
                </div>
              </>
            ) : (
              /* OTP Verification Form */
              <form onSubmit={handleVerifyOTP} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium"><T>Enter OTP</T></label>
                  <Input
                    type="text"
                    placeholder="123456"
                    value={otp}
                    onChange={(e) => {
                      setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                      setError("")
                    }}
                    className="text-center text-2xl tracking-widest"
                    maxLength={6}
                    required
                  />
                  <p className="text-xs text-muted-foreground text-center">
                    <T>Check your email inbox for the OTP code</T>
                  </p>
                </div>

                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={() => {
                      setStep("email")
                      setOtp("")
                      setError("")
                      setSuccess("")
                    }}
                    disabled={isLoading}
                  >
                    <T>Back</T>
                  </Button>
                  <Button type="submit" className="flex-1" disabled={isLoading}>
                    {isLoading ? <T>Verifying...</T> : <T>Verify OTP</T>}
                  </Button>
                </div>

                <Button
                  type="button"
                  variant="ghost"
                  className="w-full text-sm"
                  onClick={handleResendOTP}
                  disabled={!canResend || isResending || isLoading}
                >
                  {isResending ? (
                    <T>Resending...</T>
                  ) : canResend ? (
                  <T>Resend OTP</T>
                  ) : (
                    <T>Resend OTP ({Math.floor(otpTimer / 60)}:{(otpTimer % 60).toString().padStart(2, '0')})</T>
                  )}
                </Button>
              </form>
            )}

            <p className="text-center text-sm text-muted-foreground">
              <T>Already have an account?</T>{" "}
              <Link href="/login" className="text-primary hover:underline font-medium">
                <T>Sign in</T>
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
