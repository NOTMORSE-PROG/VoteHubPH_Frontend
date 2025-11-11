"use client"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { electionSchedule, type ElectionEvent } from "@/lib/election-data"
import { MapPin, ArrowLeft, Filter, X, Calendar, Users, MapPinned, Info } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export default function ElectionsPage() {
  const [selectedPosition, setSelectedPosition] = useState<string | null>(null)
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null)
  const [selectedType, setSelectedType] = useState<string | null>(null)
  const [selectedElection, setSelectedElection] = useState<ElectionEvent | null>(null)

  const upcomingElections = electionSchedule.sort((a, b) => a.date.getTime() - b.date.getTime())

  const allPositions = Array.from(new Set(upcomingElections.flatMap((e) => e.positions)))
  const allRegions = Array.from(new Set(upcomingElections.flatMap((e) => e.votingLocations.map((l) => l.region))))
  const electionTypes = ["National", "Local"]

  const filteredElections = upcomingElections.filter((election) => {
    const matchesPosition = !selectedPosition || election.positions.includes(selectedPosition)
    const matchesRegion = !selectedRegion || election.votingLocations.some((l) => l.region === selectedRegion)
    const matchesType =
      !selectedType ||
      (selectedType === "National" && election.level === "national") ||
      (selectedType === "Local" && election.level === "local")
    return matchesPosition && matchesRegion && matchesType
  })

  const hasActiveFilters = selectedPosition || selectedRegion || selectedType

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/browse?tab=local&view=elections">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </Link>
            <h1 className="text-2xl font-bold">Election Schedule</h1>
            <div className="w-20"></div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="space-y-2 mb-8">
          <h2 className="text-3xl font-bold">Upcoming Elections</h2>
          <p className="text-muted-foreground">Important dates and voting locations for Philippine elections</p>
        </div>

        <div className="mb-8 p-4 bg-card rounded-lg border">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="h-4 w-4" />
            <h3 className="font-semibold">Filter Elections</h3>
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSelectedPosition(null)
                  setSelectedRegion(null)
                  setSelectedType(null)
                }}
              >
                <X className="h-4 w-4 mr-1" />
                Clear Filters
              </Button>
            )}
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {/* Position Filter */}
            <div>
              <label className="text-sm font-medium mb-2 block">Position</label>
              <select
                value={selectedPosition || ""}
                onChange={(e) => setSelectedPosition(e.target.value || null)}
                className="w-full px-3 py-2 border rounded-md bg-background text-sm"
              >
                <option value="">All Positions</option>
                {allPositions.map((position) => (
                  <option key={position} value={position}>
                    {position}
                  </option>
                ))}
              </select>
            </div>

            {/* Region Filter */}
            <div>
              <label className="text-sm font-medium mb-2 block">Region</label>
              <select
                value={selectedRegion || ""}
                onChange={(e) => setSelectedRegion(e.target.value || null)}
                className="w-full px-3 py-2 border rounded-md bg-background text-sm"
              >
                <option value="">All Regions</option>
                {allRegions.map((region) => (
                  <option key={region} value={region}>
                    {region}
                  </option>
                ))}
              </select>
            </div>

            {/* Election Type Filter */}
            <div>
              <label className="text-sm font-medium mb-2 block">Election Type</label>
              <select
                value={selectedType || ""}
                onChange={(e) => setSelectedType(e.target.value || null)}
                className="w-full px-3 py-2 border rounded-md bg-background text-sm"
              >
                <option value="">All Types</option>
                {electionTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Elections List */}
        <div className="space-y-6">
          {filteredElections.length > 0 ? (
            filteredElections.map((election) => (
              <Card
                key={election.id}
                className="hover:shadow-lg transition-all cursor-pointer border-l-4 border-l-primary"
                onClick={() => setSelectedElection(election)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-6">
                    {/* Date Section */}
                    <div className="flex flex-col items-center justify-center bg-primary text-primary-foreground rounded-lg p-4 min-w-[100px]">
                      <div className="text-3xl font-bold">
                        {election.date.toLocaleDateString("en-US", { day: "numeric" })}
                      </div>
                      <div className="text-sm font-medium">
                        {election.date.toLocaleDateString("en-US", { month: "short" })}
                      </div>
                      <div className="text-xs opacity-80">
                        {election.date.toLocaleDateString("en-US", { year: "numeric" })}
                      </div>
                    </div>

                    {/* Content Section */}
                    <div className="flex-1 space-y-4">
                      {/* Title and Description */}
                      <div>
                        <h3 className="text-xl font-bold mb-1">{election.name}</h3>
                        <p className="text-sm text-muted-foreground">{election.description}</p>
                      </div>

                      {/* Positions */}
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-medium">Positions ({election.positions.length})</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {election.positions.slice(0, 5).map((position) => (
                            <span key={position} className="px-3 py-1 bg-primary/10 text-primary text-xs rounded-full font-medium">
                              {position}
                            </span>
                          ))}
                          {election.positions.length > 5 && (
                            <span className="px-3 py-1 bg-muted text-muted-foreground text-xs rounded-full font-medium">
                              +{election.positions.length - 5} more
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Regions */}
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <MapPinned className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-medium">Voting Locations</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {election.votingLocations.slice(0, 3).map((location, idx) => (
                            <span key={idx} className="px-3 py-1 bg-muted text-foreground text-xs rounded-full">
                              {location.region}
                            </span>
                          ))}
                          {election.votingLocations.length > 3 && (
                            <span className="px-3 py-1 bg-muted text-muted-foreground text-xs rounded-full">
                              +{election.votingLocations.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>

                      {/* View Details Button */}
                      <Button variant="outline" size="sm" className="gap-2">
                        <Info className="h-4 w-4" />
                        View Full Details
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <p className="text-muted-foreground text-lg">No elections found matching your filters.</p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => {
                    setSelectedPosition(null)
                    setSelectedRegion(null)
                    setSelectedType(null)
                  }}
                >
                  Clear All Filters
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Election Details Dialog */}
      <Dialog open={!!selectedElection} onOpenChange={(open) => !open && setSelectedElection(null)}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          {selectedElection && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl">{selectedElection.name}</DialogTitle>
                <DialogDescription>{selectedElection.description}</DialogDescription>
              </DialogHeader>

              <div className="space-y-6 mt-4">
                {/* Election Date */}
                <div className="flex items-center gap-3 p-4 bg-primary/10 rounded-lg">
                  <Calendar className="h-6 w-6 text-primary" />
                  <div>
                    <div className="text-sm text-muted-foreground">Election Date</div>
                    <div className="text-lg font-bold">
                      {selectedElection.date.toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric"
                      })}
                    </div>
                  </div>
                </div>

                {/* Positions */}
                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Positions to be Elected ({selectedElection.positions.length})
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    {selectedElection.positions.map((position) => (
                      <div key={position} className="p-3 bg-muted rounded-lg text-sm">
                        • {position}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Voting Locations */}
                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <MapPinned className="h-5 w-5" />
                    Voting Locations ({selectedElection.votingLocations.length} regions)
                  </h4>
                  <div className="space-y-4">
                    {selectedElection.votingLocations.map((location, idx) => (
                      <div key={idx} className="p-4 bg-muted rounded-lg">
                        <div className="font-semibold mb-2 text-primary">{location.region}</div>
                        <div className="text-sm text-muted-foreground mb-2">
                          <strong>Cities/Municipalities:</strong>
                        </div>
                        <div className="text-sm">{location.cities.join(", ")}</div>
                        <div className="text-sm text-muted-foreground mt-2">
                          <strong>Voting Centers:</strong> {location.votingCenters.join(", ")}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
