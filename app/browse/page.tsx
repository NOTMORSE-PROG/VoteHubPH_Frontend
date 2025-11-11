"use client"

import { useState, useEffect, useRef, useCallback, useMemo } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { LocationSelector } from "@/components/location-selector"
import { GovernmentNav } from "@/components/government-nav"
import { ScrollToTop } from "@/components/scroll-to-top"
import { CandidateCard } from "@/components/candidate-card"
import { PartyListCard } from "@/components/partylist-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Search,
  Users,
  ChevronLeft,
  ChevronRight,
  Plus,
  BarChart3,
  Calendar,
  Settings,
  User,
  Loader2,
  ArrowLeft,
  RefreshCw,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { electionSchedule } from "@/lib/election-data"

const CANDIDATES_PER_PAGE = 9

export default function BrowsePage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { data: session, status } = useSession()
  const tabParam = searchParams.get("tab") || "local"
  const viewParam = searchParams.get("view") || "candidates"

  const [governmentLevel, setGovernmentLevel] = useState<"local" | "national" | "partylist">(
    (tabParam as "local" | "national" | "partylist") || "local",
  )
  const [view, setView] = useState<"candidates" | "statistics" | "elections">(
    (viewParam === "statistics" ? "candidates" : viewParam) as "candidates" | "statistics" | "elections",
  )
  // Load selected location from localStorage on mount
  const [selectedLocation, setSelectedLocation] = useState<{
    regionId: string
    cityId: string
    districtId?: string
    barangayId: string
  } | null>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('browse_selected_location')
      if (saved) {
        try {
          return JSON.parse(saved)
        } catch (e) {
          return null
        }
      }
    }
    return null
  })
  const [selectedStatus, setSelectedStatus] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoadingUserLocation, setIsLoadingUserLocation] = useState(false)
  const [platformStats, setPlatformStats] = useState<any>(null)
  const [isLoadingStats, setIsLoadingStats] = useState(false)
  const [posts, setPosts] = useState<any[]>([])
  const [partyLists, setPartyLists] = useState<any[]>([])
  const [isLoadingPosts, setIsLoadingPosts] = useState(false)
  const [isLoadingPartyLists, setIsLoadingPartyLists] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const lastFetchRef = useRef<number>(0)
  const isInitialMount = useRef(true)
  const isAutoDetecting = useRef(false)

  // Fetch platform statistics
  useEffect(() => {
    const fetchStats = async () => {
      if (view === "statistics") {
        setIsLoadingStats(true)
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/statistics/platform`)
          if (response.ok) {
            const data = await response.json()
            setPlatformStats(data)
          }
        } catch (error) {
          console.error("Failed to load statistics:", error)
        } finally {
          setIsLoadingStats(false)
        }
      }
    }
    fetchStats()
  }, [view])

  // Removed auto-fill location - user must manually select or use auto-detect button

  // Restore location from localStorage on mount and when window regains focus
  // This ensures location is restored when navigating back from profile pages
  const restoreLocationFromStorage = useCallback(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('browse_selected_location')
      if (saved) {
        try {
          const parsed = JSON.parse(saved)
          // Only update if it's different to avoid unnecessary re-renders
          setSelectedLocation(prev => {
            if (!prev || 
                prev.regionId !== parsed.regionId ||
                prev.cityId !== parsed.cityId ||
                prev.barangayId !== parsed.barangayId) {
              return parsed
            }
            return prev
          })
        } catch (e) {
          // Invalid JSON, ignore
        }
      }
    }
  }, [])

  useEffect(() => {
    // Restore on mount
    restoreLocationFromStorage()
    
    // Restore when window regains focus (user comes back to tab)
    const handleFocus = () => {
      restoreLocationFromStorage()
    }
    
    window.addEventListener('focus', handleFocus)
    return () => {
      window.removeEventListener('focus', handleFocus)
    }
  }, [restoreLocationFromStorage])

  useEffect(() => {
    router.push(`/browse?tab=${governmentLevel}&view=${view}`, { scroll: false })
  }, [governmentLevel, view, router])

  const fetchPosts = useCallback(async (silent = false) => {
    if (view !== "candidates") return
    
    if (!silent) {
      setIsLoadingPosts(true)
    } else {
      setIsRefreshing(true)
    }
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts/approved`, {
        credentials: "include",
        cache: 'default', // Allow browser caching
      })
      if (response.ok) {
        const data = await response.json()
        // Ensure data is an array before setting it
        if (Array.isArray(data)) {
          setPosts(data)
          lastFetchRef.current = Date.now()
        } else {
          console.error("Invalid response format - expected array, got:", data)
          setPosts([])
        }
      } else {
        // Try to parse error message for debugging
        try {
          const errorData = await response.json()
          console.error("Failed to load posts:", errorData)
        } catch (e) {
          console.error("Failed to load posts: HTTP", response.status)
        }
        setPosts([])
      }
    } catch (error) {
      console.error("Failed to load posts:", error)
      setPosts([])
    } finally {
      setIsLoadingPosts(false)
      setIsRefreshing(false)
    }
  }, [view])

  const fetchPartyLists = useCallback(async (silent = false) => {
    if (view !== "candidates" || governmentLevel !== "partylist") return
    
    if (!silent) {
      setIsLoadingPartyLists(true)
    } else {
      setIsRefreshing(true)
    }
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/partylists`, {
        credentials: "include",
        cache: 'no-store',
      })
      if (response.ok) {
        const data = await response.json()
        setPartyLists(data)
        lastFetchRef.current = Date.now()
      } else {
        setPartyLists([])
      }
    } catch (error) {
      console.error("Failed to load party lists:", error)
      setPartyLists([])
    } finally {
      setIsLoadingPartyLists(false)
      setIsRefreshing(false)
    }
  }, [view, governmentLevel])

  // Initial fetch and fetch on view/governmentLevel/location change
  useEffect(() => {
    if (governmentLevel === "partylist") {
      fetchPartyLists()
    } else {
      fetchPosts()
    }
    isInitialMount.current = false
  }, [view, governmentLevel, selectedLocation, fetchPosts, fetchPartyLists])

  // Auto-refresh every 60 seconds when tab is visible (reduced from 30s for better performance)
  useEffect(() => {
    if (view !== "candidates") return

    const setupAutoRefresh = () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }

      intervalRef.current = setInterval(() => {
        // Only refresh if tab is visible
        if (document.visibilityState === 'visible') {
          const now = Date.now()
          // Don't refresh if we just fetched (within last 10 seconds)
          if (now - lastFetchRef.current > 10000) {
            if (governmentLevel === "partylist") {
              fetchPartyLists(true) // Silent refresh
            } else {
              fetchPosts(true) // Silent refresh
            }
          }
        }
      }, 60000) // 60 seconds (reduced frequency for better performance)
    }

    setupAutoRefresh()

    // Handle visibility change
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && view === "candidates") {
        // Refresh immediately when tab becomes visible (if enough time has passed)
        const now = Date.now()
        if (now - lastFetchRef.current > 5000) {
          if (governmentLevel === "partylist") {
            fetchPartyLists(true)
          } else {
            fetchPosts(true)
          }
        }
        setupAutoRefresh()
      } else {
        // Clear interval when tab is hidden
        if (intervalRef.current) {
          clearInterval(intervalRef.current)
        }
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [view, governmentLevel, fetchPosts, fetchPartyLists])

  const handleManualRefresh = () => {
    if (governmentLevel === "partylist") {
      fetchPartyLists(false)
    } else {
      fetchPosts(false)
    }
  }

  // Memoize filtered posts to prevent infinite re-renders
  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      // Filter by government level
      if (governmentLevel === "national" && post.level !== "National") {
        return false
      }
      if (governmentLevel === "local" && post.level !== "Local (City/Municipality)" && post.level !== "Barangay") {
        return false
      }

      // Filter by location if selected (for local level)
      if (governmentLevel === "local" && selectedLocation) {
        // If user selected a barangay, only show barangay-level posts for that specific barangay
        if (selectedLocation.barangayId && selectedLocation.barangayId !== "") {
          // Must be barangay level and match the selected barangay
          if (post.level !== "Barangay" || !post.barangay_id || post.barangay_id.toString() !== selectedLocation.barangayId) {
            return false
          }
        } 
        // If user only selected a city (no barangay), show:
        // - Local (City/Municipality) posts for that city
        // - All Barangay posts within that city
        else if (selectedLocation.cityId && selectedLocation.cityId !== "") {
          // Post must have city_id matching selected city
          // If post doesn't have city_id (old posts), exclude it
          if (!post.city_id) {
            return false
          }
          // Convert both to strings for comparison to handle number/string mismatches
          const postCityId = String(post.city_id || "")
          const selectedCityId = String(selectedLocation.cityId || "")
          if (postCityId !== selectedCityId) {
            return false
          }
        }
      }

      // Filter by search query
    if (searchQuery && !post.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false
    }
      
      // Filter by status
    if (selectedStatus !== "all" && post.status !== selectedStatus) {
      return false
    }
      
    return true
  })
  }, [posts, governmentLevel, selectedLocation, searchQuery, selectedStatus])

  const filteredPartyLists = partyLists.filter((pl) => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return (
        pl.name.toLowerCase().includes(query) ||
        (pl.acronym && pl.acronym.toLowerCase().includes(query)) ||
        (pl.sector && pl.sector.toLowerCase().includes(query))
      )
    }
    return true
  })

  const totalPages = Math.ceil(
    governmentLevel === "partylist" 
      ? filteredPartyLists.length / CANDIDATES_PER_PAGE
      : filteredPosts.length / CANDIDATES_PER_PAGE
  )
  const paginatedPosts = filteredPosts.slice(
    (currentPage - 1) * CANDIDATES_PER_PAGE,
    currentPage * CANDIDATES_PER_PAGE,
  )
  const paginatedPartyLists = filteredPartyLists.slice(
    (currentPage - 1) * CANDIDATES_PER_PAGE,
    currentPage * CANDIDATES_PER_PAGE,
  )

  return (
    <div className="min-h-screen bg-background">
      <ScrollToTop />

      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              {view === "candidates" && (
                <Button
                  onClick={handleManualRefresh}
                  disabled={isRefreshing || isLoadingPosts || isLoadingPartyLists}
                  variant="outline"
                  size="sm"
                  className="gap-2"
                  title={governmentLevel === "partylist" ? "Refresh party lists" : "Refresh candidates"}
                >
                  <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                  {isRefreshing ? 'Refreshing...' : 'Refresh'}
                </Button>
              )}
              <Button
                size="sm"
                className="gap-2"
                onClick={() => {
                  if (status === "authenticated") {
                    router.push(`/posts/create?tab=${governmentLevel}`)
                  } else {
                    router.push("/login")
                  }
                }}
              >
                <Plus className="h-4 w-4" />
                Create Post
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-lg"
                onClick={() => {
                  if (status === "authenticated") {
                    router.push("/profile")
                  } else {
                    router.push("/login")
                  }
                }}
              >
                <User className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-lg"
                onClick={() => {
                  if (status === "authenticated") {
                    router.push("/settings")
                  } else {
                    router.push("/login")
                  }
                }}
              >
                <Settings className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <GovernmentNav value={governmentLevel} onValueChange={setGovernmentLevel} />
        </div>

        <div className="flex gap-2 mb-6 border-b">
          <Button
            variant={view === "candidates" ? "default" : "ghost"}
            size="sm"
            onClick={() => setView("candidates")}
            className="gap-2"
          >
            <Users className="h-4 w-4" />
            Candidates
          </Button>
          {/* Statistics tab hidden for now */}
          {/* <Button
            variant={view === "statistics" ? "default" : "ghost"}
            size="sm"
            onClick={() => setView("statistics")}
            className="gap-2"
          >
            <BarChart3 className="h-4 w-4" />
            Statistics
          </Button> */}
          <Button
            variant={view === "elections" ? "default" : "ghost"}
            size="sm"
            onClick={() => setView("elections")}
            className="gap-2"
          >
            <Calendar className="h-4 w-4" />
            Elections
          </Button>
        </div>

        {view === "candidates" && (
          <div className="space-y-6">
            {governmentLevel === "local" && (
              <div className="space-y-4">
                <LocationSelector
                  value={selectedLocation}
                  onChange={(location) => {
                    setSelectedLocation(location)
                    // Only save to localStorage if it's a manual selection (not auto-detect)
                    if (!isAutoDetecting.current && typeof window !== 'undefined') {
                      localStorage.setItem('browse_selected_location', JSON.stringify(location))
                    }
                    setCurrentPage(1)
                  }}
                  onLocationChange={(location) => {
                    // This is called when auto-detect is clicked (clears location)
                    // Mark that we're in auto-detect mode
                    isAutoDetecting.current = true
                    // Clear localStorage when auto-detect is used
                    if (typeof window !== 'undefined') {
                      localStorage.removeItem('browse_selected_location')
                    }
                    if (!location || (!location.cityId && !location.barangayId)) {
                      setSelectedLocation(null)
                    } else {
                      // Auto-detect sets location temporarily
                      setSelectedLocation(location)
                    }
                    setCurrentPage(1)
                    // Reset flag after a short delay
                    setTimeout(() => {
                      isAutoDetecting.current = false
                    }, 1000)
                  }}
                  isLoading={isLoadingUserLocation}
                />
              </div>
            )}

            {governmentLevel === "local" && !selectedLocation && (
              <div className="text-center py-12 bg-muted/50 rounded-lg">
                <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Select Your Location</h3>
                <p className="text-sm text-muted-foreground">
                  Please select your region, city, and barangay to view local candidates
                </p>
              </div>
            )}

            {(governmentLevel === "national" || governmentLevel === "partylist" || selectedLocation) && (
              <>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder={
                      governmentLevel === "partylist"
                        ? "Search party-list groups by name, acronym, or sector..."
                        : "Search candidates by name or platform..."
                    }
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value)
                      setCurrentPage(1)
                    }}
                    className="pl-10"
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold">
                      {governmentLevel === "national"
                        ? "National Candidates"
                        : governmentLevel === "partylist"
                        ? "Party-List Groups"
                        : "Local Candidates"}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      {governmentLevel === "partylist"
                        ? `${filteredPartyLists.length} groups found`
                        : `${filteredPosts.length} candidates found`}
                    </p>
                  </div>

                  {/* Create Post Button */}
                  <Button
                    className="gap-2"
                    onClick={() => {
                      if (status === "authenticated") {
                        router.push(`/posts/create?tab=${governmentLevel}`)
                      } else {
                        router.push("/login")
                      }
                    }}
                  >
                    <Plus className="h-4 w-4" />
                    Create Candidate Post
                  </Button>

                  {/* Party Lists Grid */}
                  {governmentLevel === "partylist" ? (
                    <>
                      {isLoadingPartyLists ? (
                        <div className="flex justify-center items-center py-12">
                          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                        </div>
                      ) : filteredPartyLists.length === 0 ? (
                        <div className="text-center py-12 bg-muted/50 rounded-lg">
                          <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                          <h3 className="text-lg font-semibold mb-2">No Party Lists Yet</h3>
                          <p className="text-sm text-muted-foreground mb-4">
                            Party lists will appear here once candidates are added to them.
                          </p>
                        </div>
                      ) : (
                        <>
                          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {paginatedPartyLists.map((partyList) => (
                              <PartyListCard key={partyList.id} partyList={partyList} currentTab={governmentLevel} />
                            ))}
                          </div>

                          {/* Pagination */}
                          {totalPages > 1 && (
                            <div className="flex items-center justify-center gap-2 pt-4">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                disabled={currentPage === 1}
                              >
                                <ChevronLeft className="h-4 w-4" />
                                Previous
                              </Button>
                              <div className="flex items-center gap-1">
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                  <Button
                                    key={page}
                                    variant={currentPage === page ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => setCurrentPage(page)}
                                    className="w-10"
                                  >
                                    {page}
                                  </Button>
                                ))}
                              </div>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                                disabled={currentPage === totalPages}
                              >
                                Next
                                <ChevronRight className="h-4 w-4" />
                              </Button>
                            </div>
                          )}
                        </>
                      )}
                    </>
                  ) : (
                    /* Candidates Grid */
                    <>
                      {isLoadingPosts ? (
                        <div className="flex justify-center items-center py-12">
                          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                        </div>
                      ) : filteredPosts.length === 0 ? (
                        <div className="text-center py-12 bg-muted/50 rounded-lg">
                          <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                          <h3 className="text-lg font-semibold mb-2">No Candidates Yet</h3>
                          <p className="text-sm text-muted-foreground mb-4">
                            Be the first to create a candidate post for your area!
                          </p>
                          <Button
                            onClick={() => {
                              if (status === "authenticated") {
                                router.push(`/posts/create?tab=${governmentLevel}`)
                              } else {
                                router.push("/login")
                              }
                            }}
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Create Post
                          </Button>
                        </div>
                      ) : (
                        <>
                          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {paginatedPosts.map((post) => (
                              <CandidateCard key={post.id} post={post} currentTab={governmentLevel} />
                            ))}
                          </div>

                          {/* Pagination */}
                          {totalPages > 1 && (
                            <div className="flex items-center justify-center gap-2 pt-4">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                disabled={currentPage === 1}
                              >
                                <ChevronLeft className="h-4 w-4" />
                                Previous
                              </Button>
                              <div className="flex items-center gap-1">
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                  <Button
                                    key={page}
                                    variant={currentPage === page ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => setCurrentPage(page)}
                                    className="w-10"
                                  >
                                    {page}
                                  </Button>
                                ))}
                              </div>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                                disabled={currentPage === totalPages}
                              >
                                Next
                                <ChevronRight className="h-4 w-4" />
                              </Button>
                            </div>
                          )}
                        </>
                      )}
                    </>
                  )}
                </div>
              </>
            )}
          </div>
        )}

        {/* Statistics View - Hidden for now */}
        {false && view === "statistics" && (
          <Card>
            <CardHeader>
              <CardTitle>Platform Statistics</CardTitle>
              <CardDescription>Overview of the VoteHubPH platform</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingStats ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              ) : platformStats ? (
                <div className="grid gap-4 md:grid-cols-3">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-2xl">{platformStats.platform?.total_users || 0}</CardTitle>
                      <CardDescription>Total Users</CardDescription>
                    </CardHeader>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-2xl">{platformStats.platform?.total_discussions || 0}</CardTitle>
                      <CardDescription>Total Discussions</CardDescription>
                    </CardHeader>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-2xl">{platformStats.platform?.total_votes || 0}</CardTitle>
                      <CardDescription>Total Votes</CardDescription>
                    </CardHeader>
                  </Card>
                </div>
              ) : (
                <p className="text-center text-gray-500">No statistics available</p>
              )}
            </CardContent>
          </Card>
        )}

        {/* Elections View */}
        {view === "elections" && (
          <div className="space-y-4">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold">Election Schedule</h2>
              <p className="text-muted-foreground text-sm">Upcoming elections and voting dates</p>
            </div>
            <div className="space-y-3">
              {electionSchedule
                .sort((a, b) => a.date.getTime() - b.date.getTime())
                .slice(0, 3)
                .map((election) => (
                  <Card key={election.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Calendar className="h-4 w-4 text-primary" />
                            <p className="font-semibold text-sm">{election.name}</p>
                          </div>
                          <p className="text-xs text-muted-foreground mb-2">
                            {election.date.toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </p>
                          <p className="text-xs text-muted-foreground line-clamp-2">
                            {election.description}
                          </p>
                        </div>
                        <Badge variant={election.level === "national" ? "default" : "secondary"} className="ml-2">
                          {election.level === "national" ? "National" : "Local"}
                        </Badge>
                      </div>
                      <div className="mt-3 pt-3 border-t">
                        <p className="text-xs font-medium text-muted-foreground mb-1">Positions:</p>
                        <div className="flex flex-wrap gap-1">
                          {election.positions.slice(0, 3).map((position, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {position}
                            </Badge>
                          ))}
                          {election.positions.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{election.positions.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
            <div className="flex items-center justify-between pt-2">
              <p className="text-xs text-muted-foreground">
                Showing {Math.min(3, electionSchedule.length)} of {electionSchedule.length} upcoming elections
              </p>
              <Link href="/elections">
                <Button variant="outline" size="sm">
                  View All Elections
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
