"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useSession } from "next-auth/react"
import { authenticatedFetch } from "@/lib/api-client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Vote, ArrowLeft, ImageIcon, Plus, X, Loader2, CheckCircle2 } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface ImageWithCaption {
  id: string
  file: File | null
  preview: string
  caption: string
}

export default function CreatePostPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { data: session, status } = useSession()
  const returnTab = searchParams.get("tab") || "local"
  const [name, setName] = useState("")
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null)
  const [profilePhotoPreview, setProfilePhotoPreview] = useState<string>("")
  const [party, setParty] = useState("")
  const [level, setLevel] = useState("")
  const [position, setPosition] = useState("")
  const [bio, setBio] = useState("")
  const [platform, setPlatform] = useState("")
  const [education, setEducation] = useState<Array<{ level: string; school: string }>>([])
  const [educationLevel, setEducationLevel] = useState("")
  const [educationSchool, setEducationSchool] = useState("")
  const [achievements, setAchievements] = useState<string[]>([])
  const [achievementsInput, setAchievementsInput] = useState("")
  const [images, setImages] = useState<ImageWithCaption[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [selectedRegion, setSelectedRegion] = useState<string>("")
  const [selectedCity, setSelectedCity] = useState<string>("")
  const [selectedDistrict, setSelectedDistrict] = useState<string>("")
  const [selectedBarangay, setSelectedBarangay] = useState<string>("")
  const [regions, setRegions] = useState<Array<{ id: number; name: string }>>([])
  const [cities, setCities] = useState<Array<{ id: number; name: string }>>([])
  const [districts, setDistricts] = useState<Array<{ id: number; name: string }>>([])
  const [barangays, setBarangays] = useState<Array<{ id: number; name: string }>>([])
  const [isLoadingLocations, setIsLoadingLocations] = useState(false)
  const { toast } = useToast()

  // Redirect to login if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
    }
  }, [status, router])

  // Fetch regions on mount
  useEffect(() => {
    const fetchRegions = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/locations/regions`)
        if (response.ok) {
          const data = await response.json()
          setRegions(data)
        }
      } catch (error) {
        console.error("Failed to fetch regions:", error)
      }
    }
    fetchRegions()
  }, [])

  // Fetch cities when region changes
  useEffect(() => {
    if (!selectedRegion) {
      setCities([])
      setSelectedCity("")
      setBarangays([])
      setSelectedBarangay("")
      return
    }

    setIsLoadingLocations(true)
    const fetchCities = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/locations/cities?region_id=${selectedRegion}`)
        if (response.ok) {
          const data = await response.json()
          setCities(data)
        }
      } catch (error) {
        console.error("Failed to fetch cities:", error)
      } finally {
        setIsLoadingLocations(false)
      }
    }
    fetchCities()
  }, [selectedRegion])

  // Fetch districts when city changes (for Barangay level)
  useEffect(() => {
    if (!selectedCity || level !== "Barangay") {
      setDistricts([])
      setSelectedDistrict("")
      setBarangays([])
      setSelectedBarangay("")
      return
    }

    setIsLoadingLocations(true)
    const fetchDistricts = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/locations/districts?city_id=${selectedCity}`)
        if (response.ok) {
          const data = await response.json()
          setDistricts(data)
          
          // If no districts, fetch barangays directly from city
          if (data.length === 0) {
            const barangaysResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/locations/barangays?city_id=${selectedCity}`)
            if (barangaysResponse.ok) {
              const barangaysData = await barangaysResponse.json()
              setBarangays(barangaysData)
            }
          } else {
            // City has districts, clear barangays until district is selected
            setBarangays([])
            setSelectedBarangay("")
          }
        }
      } catch (error) {
        console.error("Failed to fetch districts:", error)
      } finally {
        setIsLoadingLocations(false)
      }
    }
    fetchDistricts()
  }, [selectedCity, level])

  // Fetch barangays when district changes (for Barangay level with districts)
  useEffect(() => {
    if (!selectedDistrict || level !== "Barangay" || districts.length === 0) {
      if (districts.length === 0) {
        // No districts, barangays already fetched in previous effect
        return
      }
      setBarangays([])
      setSelectedBarangay("")
      return
    }

    if (!selectedCity) {
      return
    }

    setIsLoadingLocations(true)
    const fetchBarangays = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/locations/barangays?city_id=${selectedCity}&district_id=${selectedDistrict}`)
        if (response.ok) {
          const data = await response.json()
          setBarangays(data)
        }
      } catch (error) {
        console.error("Failed to fetch barangays:", error)
      } finally {
        setIsLoadingLocations(false)
      }
    }
    fetchBarangays()
  }, [selectedDistrict, selectedCity, districts.length, level])

  // Reset location when level changes
  useEffect(() => {
    if (level === "National") {
      setSelectedRegion("")
      setSelectedCity("")
      setSelectedDistrict("")
      setSelectedBarangay("")
    }
  }, [level])

  const educationLevels = ["Elementary", "High School", "Senior High School", "College", "Graduate School", "Other"]

  const getPositionsByLevel = (selectedLevel: string) => {
    const positions: Record<string, string[]> = {
      National: ["President", "Vice President", "Senator"],
      "Local (City/Municipality)": ["Mayor", "Vice Mayor", "City Councilor"],
      Barangay: ["Barangay Captain", "Barangay Kagawad", "SK Chairperson"],
    }
    return positions[selectedLevel] || []
  }

  const availablePositions = getPositionsByLevel(level)

  const addEducation = () => {
    if (!educationLevel) {
      toast({
        variant: "destructive",
        title: "Education Level Required",
        description: "Please choose the education level first",
      })
      return
    }
    if (!educationSchool.trim()) {
      toast({
        variant: "destructive",
        title: "School Name Required",
        description: "Please enter a school/university name",
      })
      return
    }
    if (educationSchool.trim().length > 100) {
      toast({
        variant: "destructive",
        title: "Character Limit Exceeded",
        description: "School name must be 100 characters or less",
      })
      return
    }
      setEducation([...education, { level: educationLevel, school: educationSchool.trim() }])
      setEducationLevel("")
      setEducationSchool("")
  }

  const removeEducation = (index: number) => {
    setEducation(education.filter((_, i) => i !== index))
  }

  const addAchievement = () => {
    if (achievementsInput.trim() && achievementsInput.trim().length <= 150) {
      setAchievements([...achievements, achievementsInput.trim()])
      setAchievementsInput("")
    } else if (achievementsInput.trim().length > 150) {
      toast({
        variant: "destructive",
        title: "Character Limit Exceeded",
        description: "Achievement must be 150 characters or less",
      })
    }
  }

  const removeAchievement = (index: number) => {
    setAchievements(achievements.filter((_, i) => i !== index))
  }

  const handleProfilePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Revoke old preview URL if exists
    if (profilePhotoPreview) {
      URL.revokeObjectURL(profilePhotoPreview)
    }

    setProfilePhoto(file)
    setProfilePhotoPreview(URL.createObjectURL(file))
  }

  const removeProfilePhoto = () => {
    if (profilePhotoPreview) {
      URL.revokeObjectURL(profilePhotoPreview)
    }
    setProfilePhoto(null)
    setProfilePhotoPreview("")
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    const newImages: ImageWithCaption[] = Array.from(files).map((file) => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      preview: URL.createObjectURL(file),
      caption: "",
    }))

    setImages([...images, ...newImages])
  }

  const updateImageCaption = (id: string, caption: string) => {
    setImages(images.map((img) => (img.id === id ? { ...img, caption } : img)))
  }

  const removeImage = (id: string) => {
    const imageToRemove = images.find((img) => img.id === id)
    if (imageToRemove?.preview) {
      URL.revokeObjectURL(imageToRemove.preview)
    }
    setImages(images.filter((img) => img.id !== id))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!session) {
      toast({
        variant: "destructive",
        title: "Authentication Required",
        description: "You must be logged in to create a post",
      })
      router.push("/login")
      return
    }

    if (!name.trim() || !position || !level || !bio.trim() || !profilePhoto) {
      toast({
        variant: "destructive",
        title: "Required Fields Missing",
        description: "Please fill in all required fields including profile photo",
      })
      return
    }

    // Validate location fields based on level
    if (level === "Local (City/Municipality)" && (!selectedRegion || !selectedCity)) {
      toast({
        variant: "destructive",
        title: "Location Required",
        description: "Please select a region and city/municipality",
      })
      return
    }

    if (level === "Barangay") {
      // If city has districts, district is required; otherwise just city and barangay
      const hasDistricts = districts.length > 0
      if (!selectedRegion || !selectedCity || (hasDistricts && !selectedDistrict) || !selectedBarangay) {
        toast({
          variant: "destructive",
          title: "Location Required",
          description: hasDistricts 
            ? "Please select a region, city/municipality, district, and barangay"
            : "Please select a region, city/municipality, and barangay",
        })
        return
      }
    }

    setIsLoading(true)

    try {
      // Upload profile photo to Cloudinary first
      let profilePhotoUrl = null
      if (profilePhoto) {
        try {
          const formData = new FormData()
          formData.append('file', profilePhoto)

          const uploadResponse = await fetch('/api/upload', {
            method: 'POST',
            body: formData,
          })

          if (uploadResponse.ok) {
            const uploadData = await uploadResponse.json()
            profilePhotoUrl = uploadData.url
          } else {
            console.error('Failed to upload profile photo')
          }
        } catch (uploadError) {
          console.error('Error uploading profile photo:', uploadError)
        }
      }

      // Upload campaign images to Cloudinary in parallel
      const processedImages = await Promise.all(
        images.map(async (img) => {
          if (!img.file) {
            return {
              file: null,
              caption: img.caption,
            }
          }

          try {
            const formData = new FormData()
            formData.append('file', img.file)

            const uploadResponse = await fetch('/api/upload', {
              method: 'POST',
              body: formData,
            })

            if (uploadResponse.ok) {
              const uploadData = await uploadResponse.json()
              return {
                file: uploadData.url,
                caption: img.caption,
              }
            } else {
              console.error('Failed to upload image:', img.file.name)
              return {
                file: null,
                caption: img.caption,
              }
            }
          } catch (uploadError) {
            console.error('Error uploading image:', uploadError)
            return {
              file: null,
              caption: img.caption,
            }
          }
        })
      )

      // Filter out images that failed to upload
      const validImages = processedImages.filter(img => img.file !== null)

      const response = await authenticatedFetch(`${process.env.NEXT_PUBLIC_API_URL}/posts`, {
        method: "POST",
        body: JSON.stringify({
          name,
          level,
          position,
          bio,
          platform: platform || null,
          education: education.length > 0 ? education : null,
          achievements: achievements.length > 0 ? achievements : null,
          images: validImages.length > 0 ? validImages : null,
          profile_photo: profilePhotoUrl,
          party: party.trim() || null,
          city_id: level === "Local (City/Municipality)" || level === "Barangay" ? (selectedCity ? parseInt(selectedCity) : null) : null,
          district_id: level === "Barangay" && selectedDistrict ? parseInt(selectedDistrict) : null,
          barangay_id: level === "Barangay" ? (selectedBarangay ? parseInt(selectedBarangay) : null) : null,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        toast({
          variant: "destructive",
          title: "Error",
          description: errorData.message || "Failed to create post",
        })
        setIsLoading(false)
        return
      }

      const data = await response.json()
      setIsLoading(false)
      setShowSuccessModal(true)
    } catch (error) {
      console.error("Error creating post:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create post. Please try again.",
      })
      setIsLoading(false)
    }
  }

  // Show loading state while checking authentication
  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  // Don't render the page if not authenticated (will redirect)
  if (status === "unauthenticated") {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <Link href={`/browse?tab=${returnTab}`} className="flex items-center gap-3">
              <ArrowLeft className="h-5 w-5" />
              <span className="text-sm font-medium">Back</span>
            </Link>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center">
                <Vote className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-primary">CivicVoicePH</h1>
              </div>
            </div>
            <div className="w-20"></div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Create a Post</CardTitle>
              <CardDescription>Share your profile and platform as a candidate</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Your Name *</label>
                  <input
                    type="text"
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full h-10 px-3 rounded-md border border-input bg-background"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Profile Photo *</label>
                  <p className="text-xs text-muted-foreground mb-2">
                    Upload a professional photo of yourself
                  </p>

                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleProfilePhotoUpload}
                    className="hidden"
                    id="profile-photo-upload"
                  />

                  {profilePhotoPreview ? (
                    <div className="relative w-40 h-40 mx-auto">
                      <Image
                        src={profilePhotoPreview}
                        alt="Profile photo preview"
                        fill
                        className="object-cover rounded-full"
                      />
                      <button
                        type="button"
                        onClick={removeProfilePhoto}
                        className="absolute -top-2 -right-2 bg-destructive text-white rounded-full p-2 hover:bg-destructive/90 shadow-lg backdrop-blur-sm border-2 border-white/50 z-10"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <label
                      htmlFor="profile-photo-upload"
                      className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-muted/50 transition block"
                    >
                      <ImageIcon className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm font-medium">Upload profile photo</p>
                      <p className="text-xs text-muted-foreground">Click to upload</p>
                    </label>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Party / Partylist (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g., Independent, Liberal Party, etc."
                    value={party}
                    onChange={(e) => setParty(e.target.value)}
                    className="w-full h-10 px-3 rounded-md border border-input bg-background"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Level *</label>
                  <select
                    value={level}
                    onChange={(e) => {
                      setLevel(e.target.value)
                      setPosition("") // Reset position when level changes
                    }}
                    className="w-full h-10 px-3 rounded-md border border-input bg-background"
                  >
                    <option value="">Select Level</option>
                    <option value="National">National</option>
                    <option value="Local (City/Municipality)">Local (City/Municipality)</option>
                    <option value="Barangay">Barangay</option>
                  </select>
                </div>

                {level && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Position *</label>
                    <select
                      value={position}
                      onChange={(e) => setPosition(e.target.value)}
                      className="w-full h-10 px-3 rounded-md border border-input bg-background"
                    >
                      <option value="">Select Position</option>
                      {availablePositions.map((pos) => (
                        <option key={pos} value={pos}>
                          {pos}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Location fields for Local and Barangay */}
                {level === "Local (City/Municipality)" && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Region *</label>
                      <Select
                        value={selectedRegion}
                        onValueChange={(value) => {
                          setSelectedRegion(value)
                          setSelectedCity("")
                          setSelectedBarangay("")
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Region" />
                        </SelectTrigger>
                        <SelectContent>
                          {regions.map((region) => (
                            <SelectItem key={region.id} value={region.id.toString()}>
                              {region.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {selectedRegion && (
                      <div className="space-y-2">
                        <label className="text-sm font-medium">City/Municipality *</label>
                        <Select
                          value={selectedCity}
                          onValueChange={(value) => {
                            setSelectedCity(value)
                            setSelectedBarangay("")
                          }}
                          disabled={isLoadingLocations}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder={isLoadingLocations ? "Loading cities..." : "Select City/Municipality"} />
                          </SelectTrigger>
                          <SelectContent>
                            {cities.map((city) => (
                              <SelectItem key={city.id} value={city.id.toString()}>
                                {city.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </div>
                )}

                {level === "Barangay" && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Region *</label>
                      <Select
                        value={selectedRegion}
                        onValueChange={(value) => {
                          setSelectedRegion(value)
                          setSelectedCity("")
                          setSelectedBarangay("")
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Region" />
                        </SelectTrigger>
                        <SelectContent>
                          {regions.map((region) => (
                            <SelectItem key={region.id} value={region.id.toString()}>
                              {region.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {selectedRegion && (
                      <div className="space-y-2">
                        <label className="text-sm font-medium">City/Municipality *</label>
                        <Select
                          value={selectedCity}
                          onValueChange={(value) => {
                            setSelectedCity(value)
                            setSelectedDistrict("")
                            setSelectedBarangay("")
                          }}
                          disabled={isLoadingLocations}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder={isLoadingLocations ? "Loading cities..." : "Select City/Municipality"} />
                          </SelectTrigger>
                          <SelectContent>
                            {cities.map((city) => (
                              <SelectItem key={city.id} value={city.id.toString()}>
                                {city.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    {selectedCity && districts.length > 0 && (
                      <div className="space-y-2">
                        <label className="text-sm font-medium">District *</label>
                        <Select
                          value={selectedDistrict}
                          onValueChange={(value) => {
                            setSelectedDistrict(value)
                            setSelectedBarangay("")
                          }}
                          disabled={isLoadingLocations}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder={isLoadingLocations ? "Loading districts..." : "Select District"} />
                          </SelectTrigger>
                          <SelectContent>
                            {districts.map((district) => (
                              <SelectItem key={district.id} value={district.id.toString()}>
                                {district.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    {selectedCity && (districts.length === 0 || selectedDistrict) && (
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Barangay *</label>
                        <Select
                          value={selectedBarangay}
                          onValueChange={setSelectedBarangay}
                          disabled={isLoadingLocations || (districts.length > 0 && !selectedDistrict)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder={
                              isLoadingLocations 
                                ? "Loading barangays..." 
                                : districts.length > 0 && !selectedDistrict
                                ? "Select district first"
                                : "Select Barangay"
                            } />
                          </SelectTrigger>
                          <SelectContent>
                            {barangays.map((barangay) => (
                              <SelectItem key={barangay.id} value={barangay.id.toString()}>
                                {barangay.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-sm font-medium">Your Bio *</label>
                  <textarea
                    placeholder="Tell us about yourself..."
                    maxLength={500}
                    rows={3}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="w-full px-3 py-2 border rounded-md bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <p className="text-xs text-muted-foreground">{bio.length}/500</p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Education</label>
                  <div className="space-y-2 mb-3">
                    <div className="flex gap-2">
                      <select
                        value={educationLevel}
                        onChange={(e) => setEducationLevel(e.target.value)}
                        className="flex-1 h-10 px-3 rounded-md border border-input bg-background"
                      >
                        <option value="">Select Level</option>
                        {educationLevels.map((level) => (
                          <option key={level} value={level}>
                            {level}
                          </option>
                        ))}
                      </select>
                      <div className="flex-1 relative pb-5">
                        <input
                          type="text"
                          placeholder="School/University name"
                          maxLength={100}
                          value={educationSchool}
                          onChange={(e) => setEducationSchool(e.target.value)}
                          onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addEducation())}
                          className="w-full h-10 px-3 rounded-md border border-input bg-background"
                        />
                        <p className="absolute bottom-0 right-0 text-xs text-muted-foreground">
                          {educationSchool.length}/100
                        </p>
                      </div>
                      <Button type="button" onClick={addEducation} size="sm" variant="outline">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {education.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2 p-3 rounded-lg bg-muted/50">
                        <span className="text-primary font-bold">•</span>
                        <div className="flex-1">
                          <p className="text-sm font-medium">{item.level}</p>
                          <p className="text-xs text-muted-foreground">{item.school}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeEducation(idx)}
                          className="text-muted-foreground hover:bg-muted/50 p-1 rounded"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Key Achievements</label>
                  <div className="flex gap-2 mb-3">
                    <div className="flex-1 relative pb-5">
                      <input
                        type="text"
                        placeholder="Add achievement (e.g., Led community development project)"
                        maxLength={150}
                        value={achievementsInput}
                        onChange={(e) => setAchievementsInput(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addAchievement())}
                        className="w-full h-10 px-3 rounded-md border border-input bg-background"
                      />
                      <p className="absolute bottom-0 right-0 text-xs text-muted-foreground">
                        {achievementsInput.length}/150
                      </p>
                    </div>
                    <Button type="button" onClick={addAchievement} size="sm" variant="outline">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {achievements.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2 p-3 rounded-lg bg-muted/50">
                        <span className="text-primary font-bold flex-shrink-0">✓</span>
                        <span className="text-sm flex-1 break-words min-w-0">{item}</span>
                        <button
                          type="button"
                          onClick={() => removeAchievement(idx)}
                          className="text-muted-foreground hover:bg-muted/50 p-1 rounded flex-shrink-0"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Platform & Advocacy</label>
                  <textarea
                    placeholder="What are your main platforms and advocacy areas?"
                    maxLength={1000}
                    rows={4}
                    value={platform}
                    onChange={(e) => setPlatform(e.target.value)}
                    className="w-full px-3 py-2 border rounded-md bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <p className="text-xs text-muted-foreground">{platform.length}/1000</p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Photos & Images</label>
                  <p className="text-xs text-muted-foreground mb-3">
                    Add photos of your contributions, achievements, or campaign activities
                  </p>

                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                  />

                  <label
                    htmlFor="image-upload"
                    className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-muted/50 transition block"
                  >
                    <ImageIcon className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm font-medium">Add photos</p>
                    <p className="text-xs text-muted-foreground">Click to upload or drag and drop</p>
                    <p className="text-xs text-muted-foreground mt-1">You can select multiple images</p>
                  </label>

                  {images.length > 0 && (
                    <div className="space-y-4 mt-4">
                      {images.map((image) => (
                        <div key={image.id} className="border rounded-lg p-4 space-y-3">
                          <div className="relative w-full h-48 rounded-lg overflow-hidden bg-muted">
                            <Image
                              src={image.preview}
                              alt="Upload preview"
                              fill
                              className="object-cover"
                            />
                            <button
                              type="button"
                              onClick={() => removeImage(image.id)}
                              className="absolute top-2 right-2 bg-destructive text-white rounded-full p-2 hover:bg-destructive/90 shadow-lg backdrop-blur-sm border-2 border-white/50 z-10"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Caption / Description</label>
                            <textarea
                              placeholder="Add a caption or description for this photo..."
                              maxLength={300}
                              rows={2}
                              value={image.caption}
                              onChange={(e) => updateImageCaption(image.id, e.target.value)}
                              className="w-full px-3 py-2 border rounded-md bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                            />
                            <p className="text-xs text-muted-foreground">{image.caption.length}/300</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1 bg-transparent"
                    onClick={() => router.push(`/browse?tab=${returnTab}`)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="flex-1" disabled={isLoading}>
                    {isLoading ? "Publishing..." : "Publish Post"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
      <Toaster />

      {/* Success Confirmation Modal */}
      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center justify-center mb-4">
              <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle2 className="h-10 w-10 text-green-600" />
              </div>
            </div>
            <DialogTitle className="text-center text-xl">Post Submitted Successfully!</DialogTitle>
            <DialogDescription className="text-center pt-2">
              Your post has been submitted to the admin for review. You will be notified once it has been approved or if any changes are needed.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-center">
            <Button
              onClick={() => {
                setShowSuccessModal(false)
                router.push(`/browse?tab=${returnTab}`)
              }}
              className="w-full sm:w-auto"
            >
              Return to Browse
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
