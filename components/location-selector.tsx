"use client"

import { useState, useEffect } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MapPin, Loader2 } from "lucide-react"

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

interface LocationSelectorProps {
  value?: {
    regionId: string
    cityId: string
    districtId?: string
    barangayId: string
  } | null
  onChange?: (location: {
    regionId: string
    cityId: string
    districtId?: string
    barangayId: string
  }) => void
  onLocationChange?: (location: {
    regionId: string
    cityId: string
    districtId?: string
    barangayId: string
  }) => void
  className?: string
  isLoading?: boolean
  compact?: boolean
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'

export function LocationSelector({
  value,
  onChange,
  onLocationChange,
  className,
  isLoading: externalLoading,
  compact = false
}: LocationSelectorProps) {
  // Initialize state from value prop immediately
  const [selectedRegion, setSelectedRegion] = useState<string>(value?.regionId || "")
  const [selectedCity, setSelectedCity] = useState<string>(value?.cityId || "")
  const [selectedDistrict, setSelectedDistrict] = useState<string>(value?.districtId || "")
  const [selectedBarangay, setSelectedBarangay] = useState<string>(value?.barangayId || "")
  const [isDetectingLocation, setIsDetectingLocation] = useState(false)
  const [error, setError] = useState("")

  // API data states
  const [regions, setRegions] = useState<Region[]>([])
  const [cities, setCities] = useState<City[]>([])
  const [districts, setDistricts] = useState<District[]>([])
  const [barangays, setBarangays] = useState<Barangay[]>([])
  const [isLoadingData, setIsLoadingData] = useState(true)

  // Update state when value prop changes
  useEffect(() => {
    if (value) {
      setSelectedRegion(value.regionId || "")
      setSelectedCity(value.cityId || "")
      setSelectedDistrict(value.districtId || "")
      setSelectedBarangay(value.barangayId || "")
    } else {
      // Clear state if value is null
      setSelectedRegion("")
      setSelectedCity("")
      setSelectedDistrict("")
      setSelectedBarangay("")
    }
  }, [value])

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

  // Fetch cities when region changes or on mount if region is already selected
  useEffect(() => {
    if (!selectedRegion) {
      setCities([])
      if (!value?.cityId) {
      setSelectedCity("")
      }
      if (!value?.districtId) {
      setSelectedDistrict("")
      }
      return
    }

    const fetchCities = async () => {
      try {
        const response = await fetch(`${API_URL}/locations/cities?region_id=${selectedRegion}`)
        const data = await response.json()
        setCities(data)
      } catch (error) {
        console.error('Failed to fetch cities:', error)
        setError('Failed to load cities. Please try again.')
      }
    }
    fetchCities()
  }, [selectedRegion, value?.cityId, value?.districtId])

  // Fetch districts when city changes or on mount if city is already selected
  useEffect(() => {
    if (!selectedCity) {
      setDistricts([])
      if (!value?.districtId) {
      setSelectedDistrict("")
      }
      setBarangays([])
      if (!value?.barangayId) {
      setSelectedBarangay("")
      }
      return
    }

    const fetchDistricts = async () => {
      try {
        const response = await fetch(`${API_URL}/locations/districts?city_id=${selectedCity}`)
        const data = await response.json()
        setDistricts(data)

        // If no districts, fetch barangays directly from city
        if (data.length === 0) {
          const barangaysResponse = await fetch(`${API_URL}/locations/barangays?city_id=${selectedCity}`)
          const barangaysData = await barangaysResponse.json()
          setBarangays(barangaysData)
        } else {
          // City has districts, clear barangays until district is selected
          setBarangays([])
          if (!value?.barangayId) {
          setSelectedBarangay("")
          }
        }
      } catch (error) {
        console.error('Failed to fetch districts:', error)
      }
    }
    fetchDistricts()
  }, [selectedCity, value?.districtId, value?.barangayId])

  // Fetch barangays when district changes or on mount if district is already selected
  useEffect(() => {
    if (!selectedDistrict) {
      if (!value?.barangayId) {
        setBarangays([])
        setSelectedBarangay("")
      }
      return
    }

    if (!selectedCity) {
      return
    }

    const fetchBarangays = async () => {
      try {
        const response = await fetch(`${API_URL}/locations/barangays?city_id=${selectedCity}&district_id=${selectedDistrict}`)
        const data = await response.json()
        setBarangays(data)
      } catch (error) {
        console.error('Failed to fetch barangays:', error)
      }
    }
    fetchBarangays()
  }, [selectedDistrict, selectedCity, value?.barangayId])

  const handleAutoDetect = async () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser")
      return
    }

    setIsDetectingLocation(true)
    setError("")
    
    // Clear saved location when auto-detect is clicked
    // This will trigger onLocationChange with null/empty to clear localStorage
    if (onLocationChange) {
      onLocationChange({
        regionId: "",
        cityId: "",
        barangayId: ""
      })
    }

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

              // Filter out district names (not actual barangays)
              const cleanBarangay = detectedBarangay && !detectedBarangay.toLowerCase().includes('district')
                ? detectedBarangay
                : ''

              await processLocation(detectedRegion, detectedCity, cleanBarangay)
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

            // Filter out district names (not actual barangays)
            const cleanBarangay = detectedBarangay && !detectedBarangay.toLowerCase().includes('district')
              ? detectedBarangay
              : ''

            await processLocation(detectedRegion, detectedCity, cleanBarangay)
          }

          setIsDetectingLocation(false)
        } catch (err) {
          console.error('Reverse geocoding error:', err)
          setError("Could not detect your location. Please select manually.")
          setIsDetectingLocation(false)
        }
      },
      (error) => {
        console.error('Geolocation error:', error)
        setError("Could not access your location. Please enable location services and try again.")
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
        setSelectedRegion(matchedRegion.id.toString())

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
          setSelectedCity(matchedCity.id.toString())

          // Fetch districts to check if city has districts
          const districtsResponse = await fetch(`${API_URL}/locations/districts?city_id=${matchedCity.id}`)
          const districtsData = await districtsResponse.json()
          setDistricts(districtsData)

          // If no districts, fetch barangays directly
          if (districtsData.length === 0) {
            const barangaysResponse = await fetch(`${API_URL}/locations/barangays?city_id=${matchedCity.id}`)
            const barangaysData = await barangaysResponse.json()
            setBarangays(barangaysData)

            if (barangaysData.length > 0 && detectedBarangay) {
              const matchedBarangay = barangaysData.find((b: Barangay) => {
                const brgyName = b.name.toLowerCase()
                const detectedBrgyLower = detectedBarangay.toLowerCase()
                return brgyName === detectedBrgyLower ||
                       brgyName.includes(detectedBrgyLower) ||
                       detectedBrgyLower.includes(brgyName) ||
                       brgyName.replace(/barangay\s*/i, '').trim() === detectedBrgyLower.replace(/barangay\s*/i, '').trim()
              })

              if (matchedBarangay) {
                setSelectedBarangay(matchedBarangay.id.toString())
                // Trigger callback with complete location
                // Note: Auto-detect doesn't save to localStorage (handled in browse page)
                const location = {
                  regionId: matchedRegion.id.toString(),
                  cityId: matchedCity.id.toString(),
                  barangayId: matchedBarangay.id.toString()
                }
                onChange?.(location)
                // Don't call onLocationChange for auto-detect - it will clear localStorage
                // The location is set temporarily but won't persist
                return
              }
            }
            
            // If no barangay was detected/matched, still notify parent about the city
            // This allows filtering posts by city when auto-detect only finds a city
            const location = {
              regionId: matchedRegion.id.toString(),
              cityId: matchedCity.id.toString(),
              barangayId: ""
            }
            onChange?.(location)
            return
          } else {
            // City has districts - handle district-based barangay matching
            // For now, if no barangay is detected, still notify about the city
            const location = {
              regionId: matchedRegion.id.toString(),
              cityId: matchedCity.id.toString(),
              barangayId: ""
            }
            onChange?.(location)
            return
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

  const handleRegionChange = (regionId: string) => {
    setSelectedRegion(regionId)
    setSelectedCity("")
    setSelectedDistrict("")
    setSelectedBarangay("")
  }

  const handleCityChange = (cityId: string) => {
    setSelectedCity(cityId)
    setSelectedDistrict("")
    setSelectedBarangay("")
    // Trigger callback when city is selected (for filtering posts)
    if (cityId) {
      const location = {
        regionId: selectedRegion,
        cityId: cityId,
        districtId: selectedDistrict || undefined,
        barangayId: "",
      }
      onChange?.(location)
      onLocationChange?.(location)
    }
  }

  const handleDistrictChange = (districtId: string) => {
    setSelectedDistrict(districtId)
    setSelectedBarangay("")
  }

  const handleBarangayChange = (barangayId: string) => {
    setSelectedBarangay(barangayId)
    const location = {
      regionId: selectedRegion,
      cityId: selectedCity,
      districtId: selectedDistrict || undefined,
      barangayId,
    }
    // Call both callbacks for compatibility
    onChange?.(location)
    onLocationChange?.(location)
  }

  // Compact mode - just the select fields without Card wrapper
  if (compact) {
    return (
      <Card className={className}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-base">
              <MapPin className="h-4 w-4" />
              Select Your Location
            </CardTitle>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleAutoDetect}
              disabled={isDetectingLocation || isLoadingData || externalLoading}
            >
              {isDetectingLocation || externalLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <MapPin className="h-4 w-4" />
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3 pt-0">
          {error && (
            <div className="bg-destructive/10 text-destructive text-xs p-2 rounded-md">
              {error}
            </div>
          )}
          <div className="grid gap-3">
            <Select value={selectedRegion} onValueChange={handleRegionChange} disabled={isLoadingData}>
              <SelectTrigger className="h-9">
                <SelectValue placeholder={isLoadingData ? "Loading..." : "Region"} />
              </SelectTrigger>
              <SelectContent>
                {regions.map((region) => (
                  <SelectItem key={region.id} value={region.id.toString()}>
                    {region.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {selectedRegion && cities.length > 0 && (
              <Select value={selectedCity} onValueChange={handleCityChange}>
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="City" />
                </SelectTrigger>
                <SelectContent>
                  {cities.map((city) => (
                    <SelectItem key={city.id} value={city.id.toString()}>
                      {city.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            {districts.length > 0 && selectedCity && (
              <Select value={selectedDistrict} onValueChange={handleDistrictChange}>
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="District" />
                </SelectTrigger>
                <SelectContent>
                  {districts.map((district) => (
                    <SelectItem key={district.id} value={district.id.toString()}>
                      {district.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            {selectedCity && barangays.length > 0 && (
              <Select
                value={selectedBarangay}
                onValueChange={handleBarangayChange}
                disabled={districts.length > 0 && !selectedDistrict}
              >
                <SelectTrigger className="h-9">
                  <SelectValue placeholder={
                    districts.length > 0 && !selectedDistrict ? "Select district first" : "Barangay"
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
            )}
          </div>
        </CardContent>
      </Card>
    )
  }

  // Full mode - with header, description, and auto-detect button
  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Select Your Location
            </CardTitle>
            <CardDescription>Choose your region, city, and barangay to see relevant candidates</CardDescription>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAutoDetect}
            disabled={isDetectingLocation || isLoadingData || externalLoading}
          >
            {isDetectingLocation || externalLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Detecting...
              </>
            ) : (
              <>
                <MapPin className="h-4 w-4 mr-2" />
                Auto-detect
              </>
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md">
            {error}
          </div>
        )}

        <div className="space-y-2">
          <label className="text-sm font-medium">Region</label>
          <Select value={selectedRegion} onValueChange={handleRegionChange} disabled={isLoadingData}>
            <SelectTrigger>
              <SelectValue placeholder={isLoadingData ? "Loading regions..." : "Select region"} />
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
            <label className="text-sm font-medium">City/Municipality</label>
            <Select value={selectedCity} onValueChange={handleCityChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select city" />
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

        {/* District dropdown - only show if city has districts */}
        {districts.length > 0 && selectedCity && (
          <div className="space-y-2">
            <label className="text-sm font-medium">District</label>
            <Select value={selectedDistrict} onValueChange={handleDistrictChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select district" />
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

        {selectedCity && barangays.length > 0 && (
          <div className="space-y-2">
            <label className="text-sm font-medium">Barangay</label>
            <Select
              value={selectedBarangay}
              onValueChange={handleBarangayChange}
              disabled={districts.length > 0 && !selectedDistrict}
            >
              <SelectTrigger>
                <SelectValue placeholder={
                  districts.length > 0 && !selectedDistrict
                    ? "Select district first"
                    : "Select barangay"
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
      </CardContent>
    </Card>
  )
}
