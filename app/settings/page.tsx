"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { signOut, useSession, update as updateSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ArrowLeft, Lock, Globe, HelpCircle, Trash2, LogOut, User, X, Loader2 } from "lucide-react"
import { useLanguage } from "@/lib/language-context"
import { T } from "@/components/auto-translate"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"
import { authenticatedFetch } from "@/lib/api-client"

export default function SettingsPage() {
  const router = useRouter()
  const { data: session } = useSession()
  const { language, setLanguage } = useLanguage()
  const { toast } = useToast()
  const [anonymousVoting, setAnonymousVoting] = useState(true)
  const [mounted, setMounted] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  
  // Profile editing state
  const [name, setName] = useState("")
  const [originalName, setOriginalName] = useState("")
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null)
  const [profilePhotoPreview, setProfilePhotoPreview] = useState<string>("")
  const [existingProfilePhoto, setExistingProfilePhoto] = useState<string>("")
  const [isSavingProfile, setIsSavingProfile] = useState(false)
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  
  // Check if there are any changes
  const hasChanges = () => {
    const nameChanged = name.trim() !== originalName.trim()
    const photoChanged = profilePhoto !== null
    return nameChanged || photoChanged
  }

  useEffect(() => {
    setMounted(true)

    const savedAnonymousVoting = localStorage.getItem("anonymousVoting")
    if (savedAnonymousVoting !== null) {
      setAnonymousVoting(JSON.parse(savedAnonymousVoting))
    }

    // Load user profile data from session initially
    if (session?.user) {
      const userName = session.user.name || ""
      setName(userName)
      setOriginalName(userName)
      if (session.user.image) {
        setExistingProfilePhoto(session.user.image)
        setProfilePhotoPreview(session.user.image)
      }
    }
  }, [session])

  // Fetch latest profile data from API when component mounts (in background, don't block UI)
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (session?.user?.id) {
        try {
          const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"
          const response = await authenticatedFetch(`${API_URL}/user/profile`, {
            method: "GET",
          })
          
          if (response.ok) {
            const data = await response.json()
            // Update name from API (most up-to-date)
            if (data.name) {
              setName(data.name)
              setOriginalName(data.name)
            }
            // Update profile photo from API (most up-to-date)
            if (data.image) {
              setExistingProfilePhoto(data.image)
              setProfilePhotoPreview(data.image)
            }
          }
        } catch (error) {
          console.error("Failed to fetch user profile:", error)
          // Fallback to session data if API fails - already set in first useEffect
        }
      }
    }

    // Fetch in background after a short delay to not block initial render
    const timeoutId = setTimeout(fetchUserProfile, 100)
    return () => clearTimeout(timeoutId)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.user?.id])

  const toggleAnonymousVoting = () => {
    const newValue = !anonymousVoting
    setAnonymousVoting(newValue)
    localStorage.setItem("anonymousVoting", JSON.stringify(newValue))
  }

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage as "en" | "fil")
  }

  const handleProfilePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select an image smaller than 5MB",
          variant: "destructive",
        })
        return
      }

      if (!file.type.startsWith("image/")) {
        toast({
          title: "Invalid file type",
          description: "Please select an image file",
          variant: "destructive",
        })
        return
      }

      setProfilePhoto(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setProfilePhotoPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeProfilePhoto = () => {
    setProfilePhoto(null)
    setProfilePhotoPreview(existingProfilePhoto || "")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const uploadImageToCloudinary = async (file: File): Promise<string> => {
    const formData = new FormData()
    formData.append("file", file)
    formData.append("folder", "profiles") // Organize profile photos in votehubph/profiles folder

    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({}))
      throw new Error(error.message || "Failed to upload image")
    }

    const data = await response.json()
    return data.url
  }

  const deleteOldProfilePhoto = async (imageUrl: string) => {
    if (!imageUrl || !imageUrl.includes('cloudinary.com')) {
      return // Not a Cloudinary image, skip deletion
    }

    try {
      const response = await fetch("/api/delete-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: imageUrl }),
      })

      if (response.ok) {
        const data = await response.json()
        console.log("Old profile photo deleted:", data)
      }
    } catch (error) {
      console.error("Failed to delete old profile photo:", error)
      // Don't throw - deletion failure shouldn't block the update
    }
  }

  const handleSaveProfile = async () => {
    if (!name.trim()) {
      toast({
        title: "Name required",
        description: "Please enter your name",
        variant: "destructive",
      })
      return
    }

    setIsSavingProfile(true)

    try {
      let imageUrl = existingProfilePhoto
      const oldPhotoUrl = existingProfilePhoto // Store old photo URL for deletion

      // Upload new profile photo if selected
      if (profilePhoto) {
        imageUrl = await uploadImageToCloudinary(profilePhoto)
        
        // Delete old profile photo from Cloudinary if it exists
        if (oldPhotoUrl && oldPhotoUrl !== imageUrl) {
          await deleteOldProfilePhoto(oldPhotoUrl)
        }
      }

      // Update profile via API
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"
      const response = await authenticatedFetch(`${API_URL}/user/update`, {
        method: "PUT",
        body: JSON.stringify({
          name: name.trim(),
          image: imageUrl,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Failed to update profile")
      }

      // Update UI immediately (optimistic update)
      const savedName = name.trim()
      setOriginalName(savedName)
      
      // Reset photo state if new photo was uploaded
      if (profilePhoto) {
        setExistingProfilePhoto(imageUrl)
        setProfilePhoto(null)
        setProfilePhotoPreview(imageUrl)
        if (fileInputRef.current) {
          fileInputRef.current.value = ""
        }
      }

      // Show success toast immediately
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully",
      })

      // Update session in background
      updateSession().catch(error => {
        console.error("Failed to update session:", error)
      })

      // Fetch latest profile data from API in background to ensure sync
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"
        const refreshResponse = await authenticatedFetch(`${API_URL}/user/profile`, {
          method: "GET",
        })
        
        if (refreshResponse.ok) {
          const refreshData = await refreshResponse.json()
          // Only update if API returned different values (sync check)
          if (refreshData.image && refreshData.image !== imageUrl) {
            setExistingProfilePhoto(refreshData.image)
            setProfilePhotoPreview(refreshData.image)
          }
          if (refreshData.name && refreshData.name !== savedName) {
            setName(refreshData.name)
            setOriginalName(refreshData.name)
          }
        }
      } catch (error) {
        console.error("Failed to refresh profile data:", error)
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update profile. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSavingProfile(false)
    }
  }

  const handleLogout = async () => {
    // Clear saved location when logging out
    if (typeof window !== 'undefined') {
      localStorage.removeItem('browse_selected_location')
    }
    await signOut({ callbackUrl: "/login" })
  }

  const handleDeleteAccount = () => {
    // Clear all user data from localStorage
    localStorage.clear()
    // In a real app, you would also make an API call to delete the account from the backend
    // For now, we'll just redirect to the home page
    alert("Your account has been deleted. All data has been removed.")
    router.push("/")
  }

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <button onClick={() => router.back()} className="p-2 rounded-lg hover:bg-muted/80 transition-colors">
              <ArrowLeft className="h-5 w-5" />
            </button>
            <h1 className="text-2xl font-bold"><T>Settings</T></h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="space-y-6">
          {/* Profile Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                <T>Edit Profile</T>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Profile Photo */}
              <div className="flex flex-col items-center gap-4">
                <div className="relative">
                  <Avatar className="w-24 h-24">
                    <AvatarImage 
                      src={profilePhotoPreview || existingProfilePhoto || undefined} 
                      alt="Profile" 
                    />
                    <AvatarFallback>
                      {name.charAt(0).toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  {profilePhotoPreview && (
                    <button
                      onClick={removeProfilePhoto}
                      className="absolute -top-2 -right-2 bg-destructive text-white rounded-full p-1 hover:bg-destructive/90 transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
                <div className="flex flex-col items-center gap-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleProfilePhotoChange}
                    className="hidden"
                    id="profile-photo-input"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      console.log('Change Photo clicked, fileInputRef:', fileInputRef.current)
                      if (fileInputRef.current) {
                        fileInputRef.current.click()
                      } else {
                        console.error('fileInputRef is null')
                      }
                    }}
                    className="w-full sm:w-auto cursor-pointer"
                  >
                    <T>Change Photo</T>
                </Button>
                  <p className="text-xs text-muted-foreground text-center">
                    <T>JPG, PNG or GIF. Max size 5MB</T>
                  </p>
                </div>
              </div>

              {/* Name Input */}
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">
                  <T>Name</T>
                </label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  maxLength={255}
                />
              </div>

              {/* Save Button */}
              <Button
                onClick={handleSaveProfile}
                disabled={isSavingProfile || !name.trim() || !hasChanges()}
                className="w-full"
              >
                {isSavingProfile ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    <T>Saving...</T>
                  </>
                ) : (
                  <T>Save Changes</T>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Language Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                <T>Language</T>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium"><T>Preferred Language</T></p>
                  <p className="text-sm text-muted-foreground">{language === "en" ? "English" : "Filipino"}</p>
                </div>
                <select
                  value={language}
                  onChange={(e) => handleLanguageChange(e.target.value)}
                  className="px-3 py-2 border border-border rounded-lg bg-background text-foreground"
                >
                  <option value="en">English</option>
                  <option value="fil">Filipino</option>
                </select>
              </div>
            </CardContent>
          </Card>

          {/* Privacy Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5" />
                <T>Privacy & Security</T>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium"><T>Anonymous Voting</T></p>
                  <p className="text-sm text-muted-foreground"><T>Hide your identity when voting in community polls</T></p>
                </div>
                <Button
                  variant={anonymousVoting ? "default" : "outline"}
                  onClick={toggleAnonymousVoting}
                  className="gap-2"
                >
                  {anonymousVoting ? <T>Enabled</T> : <T>Disabled</T>}
                </Button>
              </div>

              <div className="pt-4 border-t">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium"><T>Logout</T></p>
                    <p className="text-sm text-muted-foreground"><T>Sign out of your account</T></p>
                  </div>
                  <Button
                    variant="outline"
                    onClick={handleLogout}
                    className="gap-2"
                  >
                    <LogOut className="h-4 w-4" />
                    <T>Logout</T>
                  </Button>
                </div>
              </div>

              <div className="pt-4 border-t">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-destructive"><T>Delete Account</T></p>
                    <p className="text-sm text-muted-foreground"><T>Permanently delete your account and all data</T></p>
                  </div>
                  <Button
                    variant="destructive"
                    onClick={() => setShowDeleteConfirm(true)}
                    className="gap-2"
                  >
                    <Trash2 className="h-4 w-4" />
                    <T>Delete</T>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Help & Support */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5" />
                <T>Help & Support</T>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <p className="text-sm">
                  <strong><T>Version</T>:</strong> 1.0.0
                </p>
                <p className="text-sm text-muted-foreground"><T>VoteHubPH - Your voice shapes the future of the Philippines</T></p>
              </div>
              <Button variant="outline" className="w-full bg-transparent">
                <T>Contact Support</T>
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Delete Account Confirmation Dialog */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-md w-full">
            <CardHeader>
              <CardTitle className="text-destructive"><T>Delete Account</T></CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm"><T>Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently removed.</T></p>
              <div className="flex gap-3 justify-end">
                <Button
                  variant="outline"
                  onClick={() => setShowDeleteConfirm(false)}
                >
                  <T>Cancel</T>
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleDeleteAccount}
                  className="gap-2"
                >
                  <Trash2 className="h-4 w-4" />
                  <T>Confirm Delete</T>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
