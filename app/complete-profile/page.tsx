"use client"

import type React from "react"
import { useState, useEffect, useMemo, useRef } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Vote, User, Loader2, MapPin } from "lucide-react"
import { T } from "@/components/auto-translate"

// API types
interface Region {
  id: number
  code: string
  name: string
  psgc_code: string
}

interface City {
  id: number
  region_id: number
  province_id: number | null
  parent_city_id: number | null
  name: string
  type: string
  is_district: boolean
  has_districts: boolean
  psgc_code: string
}

interface District {
  id: number
  region_id: number
  parent_city_id: number
  name: string
  type: string
  is_district: boolean
  psgc_code: string
}

interface Barangay {
  id: number
  city_id: number
  name: string
  psgc_code: string
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'

export default function CompleteProfilePage() {
  const router = useRouter()
  const { data: session, status, update } = useSession()
  const [name, setName] = useState("")
  const [regionId, setRegionId] = useState("")
  const [cityId, setCityId] = useState("")
  const [districtId, setDistrictId] = useState("")
  const [barangay, setBarangay] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [isDetectingLocation, setIsDetectingLocation] = useState(false)
  const [barangayNotListed, setBarangayNotListed] = useState(false)
  const [customBarangay, setCustomBarangay] = useState("")

  // API data states
  const [regions, setRegions] = useState<Region[]>([])
  const [cities, setCities] = useState<City[]>([])
  const [districts, setDistricts] = useState<District[]>([])
  const [barangays, setBarangays] = useState<Barangay[]>([])
  const [isLoadingData, setIsLoadingData] = useState(true)

  // Ref to track if auto-detect is running
  const isAutoDetecting = useRef(false)

  // Fetch regions on mount
  useEffect(() => {
    const fetchRegions = async () => {
      try {
        const response = await fetch(`${API_URL}/locations/regions`)
        const data = await response.json()
        setRegions(data)
      } catch (error) {
        console.error('Failed to fetch regions:', error)
        setError('Failed to load regions. Please refresh the page.')
      } finally {
        setIsLoadingData(false)
      }
    }
    fetchRegions()
  }, [])

  // Fetch cities when region changes
  useEffect(() => {
    if (!regionId) {
      setCities([])
      setCityId("")
      setDistrictId("")
      return
    }

    const fetchCities = async () => {
      try {
        const response = await fetch(`${API_URL}/locations/cities?region_id=${regionId}`)
        const data = await response.json()
        setCities(data)
      } catch (error) {
        console.error('Failed to fetch cities:', error)
        setError('Failed to load cities. Please try again.')
      }
    }
    fetchCities()
  }, [regionId])

  // Fetch districts when city changes
  useEffect(() => {
    if (!cityId) {
      setDistricts([])
      setDistrictId("")
      setBarangays([])
      setBarangay("")
      return
    }

    const fetchDistricts = async () => {
      try {
        const response = await fetch(`${API_URL}/locations/districts?city_id=${cityId}`)
        const data = await response.json()
        setDistricts(data)

        // If no districts, fetch barangays directly from city
        if (data.length === 0) {
          const barangaysResponse = await fetch(`${API_URL}/locations/barangays?city_id=${cityId}`)
          const barangaysData = await barangaysResponse.json()
          setBarangays(barangaysData)
        } else if (!isAutoDetecting.current) {
          // City has districts, clear barangays until district is selected
          // But only if we're not in auto-detect mode
          setBarangays([])
          setBarangay("")
        }
      } catch (error) {
        console.error('Failed to fetch districts:', error)
      }
    }
    fetchDistricts()
  }, [cityId])

  // Fetch barangays when district changes
  useEffect(() => {
    if (!districtId) {
      return
    }

    const fetchBarangays = async () => {
      try {
        const response = await fetch(`${API_URL}/locations/barangays?district_id=${districtId}`)
        const data = await response.json()
        setBarangays(data)
      } catch (error) {
        console.error('Failed to fetch barangays:', error)
      }
    }
    fetchBarangays()
  }, [districtId])

  const [hasName, setHasName] = useState(false)

  useEffect(() => {
    // Wait for session to load before checking authentication
    if (status === "loading") {
      return // Still loading, don't redirect yet
    }
    
    // Only redirect if we're sure the user is not authenticated
    // Give it a moment for the session to establish after redirect
    if (status === "unauthenticated") {
      // Wait a bit more in case session is still establishing
      const timer = setTimeout(() => {
        if (status === "unauthenticated") {
          router.push("/login")
        }
      }, 2000)
      return () => clearTimeout(timer)
    }
    
    if (session?.user?.name) {
      setName(session.user.name)
      setHasName(true) // User already has a name from email sign up
    }
  }, [status, session, router])

  const handleAutoDetect = async () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser")
      return
    }

    setIsDetectingLocation(true)
    setError("")
    isAutoDetecting.current = true

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords
          console.log('GPS Coordinates:', { latitude, longitude, accuracy: position.coords.accuracy })

          // Try multiple geocoding services for better accuracy
          let geocodingData: any = null

          // Try BigDataCloud first (free, no API key, very accurate)
          try {
            const bigDataResponse = await fetch(
              `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
            )
            geocodingData = await bigDataResponse.json()
            console.log('BigDataCloud data:', geocodingData)

            if (geocodingData && geocodingData.locality) {
              // Process BigDataCloud format
              const detectedRegion = geocodingData.principalSubdivision || geocodingData.countryName || ''
              const detectedCity = geocodingData.city || geocodingData.locality || ''
              const detectedBarangay = geocodingData.localityInfo?.administrative?.[4]?.name ||
                                       geocodingData.localityInfo?.administrative?.[5]?.name ||
                                       geocodingData.neighbourhood || ''

              console.log('BigDataCloud Detected:', { detectedRegion, detectedCity, detectedBarangay })

              // Pass the detected value as-is (could be district or barangay)
              await processLocation(detectedRegion, detectedCity, detectedBarangay)
              isAutoDetecting.current = false
              setIsDetectingLocation(false)
              return
            }
          } catch (err) {
            console.log('BigDataCloud failed, trying Nominatim:', err)
          }

          // Fallback to OpenStreetMap Nominatim
          const nominatimResponse = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
            {
              headers: {
                'User-Agent': 'VoteHubPH/1.0'
              }
            }
          )

          const data = await nominatimResponse.json()
          console.log('Nominatim data:', data)

          if (data.address) {
            // Extract location details with better fallbacks
            const detectedRegion = data.address.region || data.address.state || data.address.province || ''
            const detectedCity = data.address.city || data.address.municipality || data.address.town || data.address.city_district || ''
            const detectedBarangay = data.address.suburb || data.address.neighbourhood || data.address.quarter || data.address.village || ''

            console.log('Nominatim Detected:', { detectedRegion, detectedCity, detectedBarangay })

            // Pass the detected value as-is (could be district or barangay)
            await processLocation(detectedRegion, detectedCity, detectedBarangay)
          }

          isAutoDetecting.current = false
          setIsDetectingLocation(false)
        } catch (err) {
          console.error('Reverse geocoding error:', err)
          setError("Could not detect your location. Please select manually.")
          isAutoDetecting.current = false
          setIsDetectingLocation(false)
        }
      },
      (error) => {
        console.error('Geolocation error:', error)
        setError("Could not access your location. Please enable location services and try again.")
        isAutoDetecting.current = false
        setIsDetectingLocation(false)
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0
      }
    )
  }

  const processLocation = async (detectedRegion: string, detectedCity: string, detectedBarangay: string) => {
    try {
      // Better region matching with multiple strategies
      let matchedRegion = regions.find(r => {
              const regionName = r.name.toLowerCase()
              const detectedLower = detectedRegion.toLowerCase()

              // Strategy 1: Special cases FIRST (most specific)
              if (detectedLower.includes('metro manila') || detectedLower.includes('national capital')) {
                return r.code === 'NCR'
              }
              if (detectedLower.includes('cordillera')) {
                return r.code === 'CAR'
              }
              if (detectedLower.includes('bangsamoro') || detectedLower.includes('barmm')) {
                return r.code === 'BARMM'
              }

              // Strategy 2: Extract region number (e.g., "Region IV" -> "IV-A")
              const regionMatch = detectedRegion.match(/region\s+([IVX]+)/i)
              if (regionMatch && r.code.includes(regionMatch[1])) {
                return true
              }

              // Strategy 3: Code match (NCR, CAR, etc.)
              if (r.code !== 'NCR' && r.code !== 'CAR' && r.code !== 'BARMM' && detectedLower.includes(r.code.toLowerCase())) {
                return true
              }

              // Strategy 4: Direct name match (least specific, avoid partial matches)
              if (regionName.includes(detectedLower) && detectedLower.length > 5) {
                return true
              }

        return false
      })

      // If no region found, try to match by city name across all regions
      if (!matchedRegion && detectedCity) {
        for (const region of regions) {
          const citiesResponse = await fetch(`${API_URL}/locations/cities?region_id=${region.id}`)
          const citiesData = await citiesResponse.json()

          const cityMatch = citiesData.find((c: City) => {
            const cityName = c.name.toLowerCase()
            const detectedCityLower = detectedCity.toLowerCase()
            const cityNameBase = cityName.replace(' city', '').trim()
            const detectedCityBase = detectedCityLower.replace(' city', '').trim()
            return cityName.includes(detectedCityLower) ||
                   detectedCityLower.includes(cityName) ||
                   cityNameBase === detectedCityBase
          })

          if (cityMatch) {
            matchedRegion = region
            break
          }
        }
      }

      if (matchedRegion) {
        // Set region and fetch cities
        setRegionId(matchedRegion.id.toString())

        // Fetch cities for the matched region
        const citiesResponse = await fetch(`${API_URL}/locations/cities?region_id=${matchedRegion.id}`)
        const citiesData = await citiesResponse.json()
        setCities(citiesData)

        // Better city matching
        const matchedCity = citiesData.find((c: City) => {
          const cityName = c.name.toLowerCase()
          const detectedCityLower = detectedCity.toLowerCase()

          // Remove "City" suffix for better matching
          const cityNameBase = cityName.replace(' city', '').trim()
          const detectedCityBase = detectedCityLower.replace(' city', '').trim()

          return cityName.includes(detectedCityLower) ||
                 detectedCityLower.includes(cityName) ||
                 cityNameBase === detectedCityBase
        })

        if (matchedCity) {
          setCityId(matchedCity.id.toString())

          // Check if city has districts
          const districtsResponse = await fetch(`${API_URL}/locations/districts?city_id=${matchedCity.id}`)
          const districtsData = await districtsResponse.json()
          setDistricts(districtsData)

          if (districtsData.length > 0 && detectedBarangay) {
            // City has districts - check if detected value is a district name
            console.log('City has districts. Checking if detected value is a district...')

            // Check if the detected value contains "district" - it's likely a district name
            if (detectedBarangay.toLowerCase().includes('district')) {
              const matchedDistrict = districtsData.find((d: District) => {
                const districtName = d.name.toLowerCase()
                const detectedLower = detectedBarangay.toLowerCase()
                return districtName.includes(detectedLower) || detectedLower.includes(districtName)
              })

              if (matchedDistrict) {
                // Auto-fill district only (user will select barangay manually)
                setDistrictId(matchedDistrict.id.toString())
                console.log(`Auto-filled district: ${matchedDistrict.name}`)

                // Load barangays for this district
                const barangaysResponse = await fetch(`${API_URL}/locations/barangays?district_id=${matchedDistrict.id}`)
                const barangaysData = await barangaysResponse.json()
                setBarangays(barangaysData)
              } else {
                console.log('District not matched. User will select manually.')
              }
            }
            // Don't auto-fill barangay - user will select manually
          } else if (districtsData.length === 0) {
            // No districts - fetch barangays directly from city
            const barangaysResponse = await fetch(`${API_URL}/locations/barangays?city_id=${matchedCity.id}`)
            const barangaysData = await barangaysResponse.json()
            setBarangays(barangaysData)
            // Don't auto-fill barangay - user will select manually
          }
        }
      } else {
        setError("Could not match your location to a Philippine region. Please select manually.")
      }
    } catch (err) {
      console.error('Location processing error:', err)
      setError("Could not detect your location. Please select manually.")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    const finalBarangay = barangayNotListed ? customBarangay : barangay

    // Validate required fields - if city has districts, district is required
    // Name is only required if user doesn't already have one
    if ((!hasName && !name) || !regionId || !cityId || !finalBarangay) {
      setError("All fields are required (Region, City, and Barangay" + (!hasName ? ", and Name" : "") + ")")
      return
    }

    if (districts.length > 0 && !districtId) {
      setError("Please select a district")
      return
    }

    setIsLoading(true)

    try {
      // Get the actual names from IDs
      const selectedRegion = regions.find(r => r.id === Number(regionId))
      const selectedCity = cities.find(c => c.id === Number(cityId))
      const selectedDistrict = districtId ? districts.find(d => d.id === Number(districtId)) : null

      // Build city name: if district exists, use "City - District" format
      const cityName = selectedDistrict
        ? `${selectedCity?.name} - ${selectedDistrict.name}`
        : selectedCity?.name || ""

      const response = await fetch("/api/user/complete-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: hasName ? session?.user?.name : name, // Use existing name if available
          region: selectedRegion?.name || "",
          city: cityName,
          barangay: finalBarangay
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        setError(data.error || "Failed to update profile")
        setIsLoading(false)
        return
      }

      // Trigger session update to refresh JWT token with new profileCompleted status
      await update()

      // Redirect to browse page
      router.push("/browse")
    } catch (err) {
      setError("Failed to update profile. Please try again.")
      setIsLoading(false)
    }
  }

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto h-16 w-16 rounded-full bg-primary flex items-center justify-center mb-4">
              <Vote className="h-8 w-8 text-primary-foreground" />
            </div>
            <CardTitle className="text-2xl"><T>Complete Your Profile</T></CardTitle>
            <CardDescription>
              <T>Help us personalize your experience by completing your profile</T>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md">
                  {error}
                </div>
              )}

              {!hasName && (
                <div className="space-y-2">
                  <label className="text-sm font-medium"><T>Full Name</T></label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="text"
                      placeholder="Juan Dela Cruz"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium"><T>Location</T></label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAutoDetect}
                    disabled={isDetectingLocation || isLoadingData}
                    className="text-xs"
                  >
                    {isDetectingLocation ? (
                      <>
                        <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                        <T>Detecting...</T>
                      </>
                    ) : (
                      <>
                        <MapPin className="h-3 w-3 mr-1" />
                        <T>Auto-detect</T>
                      </>
                    )}
                  </Button>
                </div>

                <div className="space-y-2">
                  <select
                    className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    value={regionId}
                    onChange={(e) => {
                      setRegionId(e.target.value)
                      setCityId("")
                      setDistrictId("")
                      setBarangay("")
                    }}
                    required
                    disabled={isLoadingData}
                  >
                    <option value="">{isLoadingData ? "Loading regions..." : "Select Region"}</option>
                    {regions.map((region) => (
                      <option key={region.id} value={region.id}>
                        {region.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <select
                    className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
                    value={cityId}
                    onChange={(e) => {
                      setCityId(e.target.value)
                      setDistrictId("")
                      setBarangay("")
                    }}
                    disabled={!regionId}
                    required
                  >
                    <option value="">Select City/Municipality</option>
                    {cities.map((city) => (
                      <option key={city.id} value={city.id}>
                        {city.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* District dropdown - always visible */}
                <div className="space-y-2">
                  <select
                    className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
                    value={districtId}
                    onChange={(e) => {
                      setDistrictId(e.target.value)
                      setBarangay("")
                    }}
                    disabled={!cityId || districts.length === 0}
                    required={districts.length > 0}
                  >
                    <option value="">
                      {!cityId
                        ? "Select city first"
                        : districts.length === 0
                          ? "No districts (proceed to barangay)"
                          : "Select District"}
                    </option>
                    {districts
                      .sort((a, b) => {
                        // Sort numerically: First, Second, Third, Fourth, Fifth, Sixth
                        const order = ['First', 'Second', 'Third', 'Fourth', 'Fifth', 'Sixth'];
                        const aIndex = order.findIndex(o => a.name.includes(o));
                        const bIndex = order.findIndex(o => b.name.includes(o));
                        return aIndex - bIndex;
                      })
                      .map((district) => (
                        <option key={district.id} value={district.id}>
                          {district.name}
                        </option>
                      ))}
                  </select>
                </div>

                <div className="space-y-2">
                  {!barangayNotListed ? (
                    <select
                      className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
                      value={barangay}
                      onChange={(e) => setBarangay(e.target.value)}
                      disabled={
                        (districts.length > 0 && !districtId) ||
                        (!cityId) ||
                        barangays.length === 0
                      }
                      required={!barangayNotListed}
                    >
                      <option value="">
                        {barangays.length === 0
                          ? (districts.length > 0 && !districtId
                              ? "Select district first to load barangays"
                              : "Select city first to load barangays")
                          : "Select Barangay *"}
                      </option>
                      {barangays.map((brgy) => (
                        <option key={brgy.id} value={brgy.name}>
                          {brgy.name}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <Input
                      type="text"
                      placeholder="Enter your barangay name *"
                      value={customBarangay}
                      onChange={(e) => setCustomBarangay(e.target.value)}
                      disabled={districts.length > 0 ? !districtId : !cityId}
                      required={barangayNotListed}
                    />
                  )}

                  <label className="flex items-center space-x-2 text-sm">
                    <input
                      type="checkbox"
                      checked={barangayNotListed}
                      onChange={(e) => {
                        setBarangayNotListed(e.target.checked)
                        if (e.target.checked) {
                          setBarangay("")
                        } else {
                          setCustomBarangay("")
                        }
                      }}
                      disabled={districts.length > 0 ? !districtId : !cityId}
                      className="rounded border-gray-300"
                    />
                    <span className="text-muted-foreground">
                      <T>My barangay is not listed</T>
                    </span>
                  </label>
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? <T>Saving...</T> : <T>Continue to VoteHubPH</T>}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
