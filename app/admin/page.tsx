"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Plus, Edit, Trash2, Search, Filter, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import { Input } from "@/components/ui/input"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { getPaintings, deletePainting } from "@/lib/db"
import type { Painting } from "@/types/painting"
import { ChevronDown, ChevronUp } from "lucide-react"

// Helper function to get aspect ratio from dimensions
function getAspectRatio(dimensionsStr: string): number {
  try {
    // Extract height and width from the dimensions string (e.g., "24 x 36 inches")
    const match = dimensionsStr.match(/^([\d.]+)\s*x\s*([\d.]+)/)
    if (match) {
      const height = Number.parseFloat(match[1])
      const width = Number.parseFloat(match[2])
      return width / height // Return the aspect ratio (width / height)
    }
  } catch (error) {
    console.error("Error parsing dimensions:", error)
  }

  // Default to a 3:4 aspect ratio if parsing fails
  return 0.75
}

// Add a helper function to check if a painting has missing data (after the getAspectRatio function)
function paintingNeedsAttention(painting: Painting): boolean {
  // Check for missing required fields
  return (
    !painting.title ||
    !painting.description ||
    !painting.medium ||
    !painting.dimensions ||
    !painting.year ||
    painting.imageUrl.includes("placeholder")
  )
}

// Helper function to calculate total value of unsold paintings
function calculateTotalValue(paintings: Painting[]): { count: number; value: number } {
  const unsoldPaintings = paintings.filter((p) => !p.sold && typeof p.price === "number")
  const totalValue = unsoldPaintings.reduce((sum, painting) => sum + (painting.price as number), 0)
  return {
    count: unsoldPaintings.length,
    value: totalValue,
  }
}

export default function AdminDashboard() {
  const { toast } = useToast()
  const [paintings, setPaintings] = useState<Painting[]>([])
  const [filteredPaintings, setFilteredPaintings] = useState<Painting[]>([])
  const [loading, setLoading] = useState(true)
  const [paintingToDelete, setPaintingToDelete] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  // Search and filter states
  const [searchQuery, setSearchQuery] = useState("")
  const [genreFilter, setGenreFilter] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState<"all" | "available" | "sold">("all")
  const [featuredFilter, setFeaturedFilter] = useState<boolean | null>(null)
  const [inProgressFilter, setInProgressFilter] = useState<boolean | null>(null)
  const [yearFilter, setYearFilter] = useState<number | null>(null)
  const [needsAttentionFilter, setNeedsAttentionFilter] = useState<boolean | null>(null)
  const [years, setYears] = useState<number[]>([])
  const [showFilters, setShowFilters] = useState(false)
  const [genres, setGenres] = useState<string[]>([])

  // Collapsible section states
  const [completedWorksExpanded, setCompletedWorksExpanded] = useState(true)
  const [inProgressWorksExpanded, setInProgressWorksExpanded] = useState(true)

  const fetchPaintings = async () => {
    try {
      setLoading(true)
      const data = await getPaintings()
      setPaintings(data)

      // Extract unique genres for the filter dropdown
      const uniqueGenres = Array.from(new Set(data.filter((p) => p.genre).map((p) => p.genre as string)))
      setGenres(uniqueGenres)

      // Extract unique years for the filter dropdown
      const uniqueYears = Array.from(new Set(data.map((p) => p.year))).sort((a, b) => b - a) // Sort descending
      setYears(uniqueYears)

      // Initialize filtered paintings with all paintings
      setFilteredPaintings(data)
    } catch (error) {
      console.error("Error fetching paintings:", error)
      toast({
        title: "Error",
        description: "Failed to load paintings",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPaintings()
  }, [toast])

  // Apply filters whenever filter states change
  useEffect(() => {
    let result = [...paintings]

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (painting) =>
          painting.title.toLowerCase().includes(query) ||
          (painting.description && painting.description.toLowerCase().includes(query)) ||
          (painting.medium && painting.medium.toLowerCase().includes(query)),
      )
    }

    // Apply genre filter
    if (genreFilter) {
      result = result.filter((painting) => painting.genre === genreFilter)
    }

    // Apply status filter
    if (statusFilter !== "all") {
      result = result.filter((painting) => (statusFilter === "sold" ? painting.sold : !painting.sold))
    }

    // Apply featured filter
    if (featuredFilter !== null) {
      result = result.filter((painting) => painting.featured === featuredFilter)
    }

    // Apply in-progress filter
    if (inProgressFilter !== null) {
      result = result.filter((painting) => painting.inProgress === inProgressFilter)
    }

    // Apply year filter
    if (yearFilter !== null) {
      result = result.filter((painting) => painting.year === yearFilter)
    }

    // Apply needs attention filter
    if (needsAttentionFilter !== null) {
      result = result.filter((painting) => paintingNeedsAttention(painting) === needsAttentionFilter)
    }

    setFilteredPaintings(result)
  }, [
    paintings,
    searchQuery,
    genreFilter,
    statusFilter,
    featuredFilter,
    inProgressFilter,
    yearFilter,
    needsAttentionFilter,
  ])

  const handleDelete = async () => {
    if (!paintingToDelete) return

    try {
      setIsDeleting(true)

      // Show a toast to indicate deletion is in progress
      toast({
        title: "Deleting painting...",
        description: "Please wait while the painting is being deleted.",
      })

      await deletePainting(paintingToDelete)

      // Remove the painting from the state
      setPaintings(paintings.filter((p) => p.id !== paintingToDelete))

      // Show success toast
      toast({
        title: "Painting deleted",
        description: "The painting has been successfully deleted",
      })

      // Refresh the paintings list to ensure we have the latest data
      fetchPaintings()
    } catch (error) {
      console.error("Error deleting painting:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete painting",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
      setPaintingToDelete(null)
    }
  }

  const resetFilters = () => {
    setSearchQuery("")
    setGenreFilter(null)
    setStatusFilter("all")
    setFeaturedFilter(null)
    setInProgressFilter(null)
    setYearFilter(null)
    setNeedsAttentionFilter(null)
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  // Separate paintings into completed and in-progress
  const completedPaintings = filteredPaintings.filter((painting) => !painting.inProgress)
  const inProgressPaintings = filteredPaintings.filter((painting) => painting.inProgress)

  return (
    <div className="container px-4 py-8 md:px-6 md:py-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-light tracking-wider">Admin Dashboard</h1>
        <Link href="/admin/paintings/new">
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add New Painting
          </Button>
        </Link>
      </div>

      {/* Search and Filter Section */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search paintings..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <Button variant="outline" className="flex items-center gap-2" onClick={() => setShowFilters(!showFilters)}>
            <Filter className="h-4 w-4" />
            Filters
            {(genreFilter ||
              statusFilter !== "all" ||
              featuredFilter !== null ||
              inProgressFilter !== null ||
              yearFilter !== null ||
              needsAttentionFilter !== null) && (
              <Badge className="ml-1 bg-primary text-primary-foreground pointer-events-none">
                {[
                  genreFilter ? 1 : 0,
                  statusFilter !== "all" ? 1 : 0,
                  featuredFilter !== null ? 1 : 0,
                  inProgressFilter !== null ? 1 : 0,
                  yearFilter !== null ? 1 : 0,
                  needsAttentionFilter !== null ? 1 : 0,
                ].reduce((a, b) => a + b, 0)}
              </Badge>
            )}
          </Button>
        </div>

        {/* Filter options */}
        {showFilters && (
          <div className="p-4 border rounded-md bg-background shadow-sm space-y-4">
            <div className="flex flex-wrap gap-4 items-center">
              {/* Genre Filter */}
              <div className="space-y-1">
                <label className="text-sm font-medium">Genre</label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="min-w-[150px] justify-between">
                      {genreFilter || "All Genres"}
                      <Filter className="h-4 w-4 ml-2" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    <DropdownMenuCheckboxItem
                      checked={genreFilter === null}
                      onCheckedChange={() => setGenreFilter(null)}
                    >
                      All Genres
                    </DropdownMenuCheckboxItem>
                    {genres.map((genre) => (
                      <DropdownMenuCheckboxItem
                        key={genre}
                        checked={genreFilter === genre}
                        onCheckedChange={() => setGenreFilter(genre)}
                      >
                        {genre}
                      </DropdownMenuCheckboxItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Status Filter */}
              <div className="space-y-1">
                <label className="text-sm font-medium">Status</label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="min-w-[150px] justify-between">
                      {statusFilter === "all" ? "All Status" : statusFilter === "sold" ? "Sold" : "Available"}
                      <Filter className="h-4 w-4 ml-2" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    <DropdownMenuCheckboxItem
                      checked={statusFilter === "all"}
                      onCheckedChange={() => setStatusFilter("all")}
                    >
                      All Status
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      checked={statusFilter === "available"}
                      onCheckedChange={() => setStatusFilter("available")}
                    >
                      Available
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      checked={statusFilter === "sold"}
                      onCheckedChange={() => setStatusFilter("sold")}
                    >
                      Sold
                    </DropdownMenuCheckboxItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Featured Filter */}
              <div className="space-y-1">
                <label className="text-sm font-medium">Featured</label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="min-w-[150px] justify-between">
                      {featuredFilter === null ? "All" : featuredFilter ? "Featured" : "Not Featured"}
                      <Filter className="h-4 w-4 ml-2" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    <DropdownMenuCheckboxItem
                      checked={featuredFilter === null}
                      onCheckedChange={() => setFeaturedFilter(null)}
                    >
                      All
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      checked={featuredFilter === true}
                      onCheckedChange={() => setFeaturedFilter(true)}
                    >
                      Featured
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      checked={featuredFilter === false}
                      onCheckedChange={() => setFeaturedFilter(false)}
                    >
                      Not Featured
                    </DropdownMenuCheckboxItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* In Progress Filter */}
              <div className="space-y-1">
                <label className="text-sm font-medium">Progress</label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="min-w-[150px] justify-between">
                      {inProgressFilter === null ? "All" : inProgressFilter ? "In Progress" : "Completed"}
                      <Filter className="h-4 w-4 ml-2" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    <DropdownMenuCheckboxItem
                      checked={inProgressFilter === null}
                      onCheckedChange={() => setInProgressFilter(null)}
                    >
                      All
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      checked={inProgressFilter === true}
                      onCheckedChange={() => setInProgressFilter(true)}
                    >
                      In Progress
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      checked={inProgressFilter === false}
                      onCheckedChange={() => setInProgressFilter(false)}
                    >
                      Completed
                    </DropdownMenuCheckboxItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Year Filter */}
              <div className="space-y-1">
                <label className="text-sm font-medium">Year</label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="min-w-[150px] justify-between">
                      {yearFilter === null ? "All Years" : yearFilter.toString()}
                      <Filter className="h-4 w-4 ml-2" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="max-h-[300px] overflow-y-auto">
                    <DropdownMenuCheckboxItem checked={yearFilter === null} onCheckedChange={() => setYearFilter(null)}>
                      All Years
                    </DropdownMenuCheckboxItem>
                    {years.map((year) => (
                      <DropdownMenuCheckboxItem
                        key={year}
                        checked={yearFilter === year}
                        onCheckedChange={() => setYearFilter(year)}
                      >
                        {year}
                      </DropdownMenuCheckboxItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Needs Attention Filter */}
              <div className="space-y-1">
                <label className="text-sm font-medium">Data Status</label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="min-w-[150px] justify-between">
                      {needsAttentionFilter === null ? "All" : needsAttentionFilter ? "Needs Attention" : "Complete"}
                      <Filter className="h-4 w-4 ml-2" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    <DropdownMenuCheckboxItem
                      checked={needsAttentionFilter === null}
                      onCheckedChange={() => setNeedsAttentionFilter(null)}
                    >
                      All
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      checked={needsAttentionFilter === true}
                      onCheckedChange={() => setNeedsAttentionFilter(true)}
                    >
                      Needs Attention
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      checked={needsAttentionFilter === false}
                      onCheckedChange={() => setNeedsAttentionFilter(false)}
                    >
                      Complete
                    </DropdownMenuCheckboxItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Reset Filters Button */}
              <Button
                variant="ghost"
                onClick={resetFilters}
                className="ml-auto"
                disabled={
                  !searchQuery &&
                  genreFilter === null &&
                  statusFilter === "all" &&
                  featuredFilter === null &&
                  inProgressFilter === null &&
                  yearFilter === null &&
                  needsAttentionFilter === null
                }
              >
                Reset Filters
              </Button>
            </div>
          </div>
        )}

        {/* Results count */}
        <div className="text-sm text-muted-foreground">
          Showing {filteredPaintings.length} of {paintings.length} paintings
        </div>
      </div>

      {/* Summary Cards */}
      <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Total Value Card */}
        <div className="bg-background border rounded-md p-4 shadow-sm">
          <h3 className="text-sm font-medium text-muted-foreground mb-1">Unsold Paintings Value</h3>
          <div className="flex items-baseline">
            <span className="text-2xl font-semibold">
              £{calculateTotalValue(filteredPaintings).value.toLocaleString()}
            </span>
            <span className="ml-2 text-sm text-muted-foreground">
              ({calculateTotalValue(filteredPaintings).count} paintings)
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1"></p>
        </div>

        {/* Additional summary cards can be added here */}
      </div>

      {/* Completed Works Section */}
      <section className="mb-8 border rounded-md overflow-hidden">
        <div className="bg-background p-4 border-b">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-light tracking-wider">Completed Works ({completedPaintings.length})</h2>
            <Button
              variant="ghost"
              size="sm"
              className="p-1 h-8 w-8"
              onClick={() => setCompletedWorksExpanded(!completedWorksExpanded)}
              aria-label={completedWorksExpanded ? "Collapse completed works" : "Expand completed works"}
            >
              {completedWorksExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        <div
          className={`transition-all duration-500 ease-in-out overflow-hidden ${
            completedWorksExpanded ? "max-h-[5000px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          {completedPaintings.length > 0 ? (
            <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {completedPaintings.map((painting) => {
                // Get the aspect ratio from the dimensions
                const aspectRatio = getAspectRatio(painting.dimensions)

                return (
                  <Card key={painting.id} className="overflow-hidden h-full flex flex-col bg-background">
                    <div className="relative w-full bg-muted">
                      <div className="w-full" style={{ paddingTop: `${(1 / aspectRatio) * 100}%` }}>
                        <Image
                          src={painting.imageUrl || "/placeholder.svg?height=800&width=600"}
                          alt={painting.title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          unoptimized={painting.imageUrl?.startsWith("https://firebasestorage.googleapis.com")}
                        />
                      </div>
                      {/* New corner badge design */}
                      <div className="absolute top-0 left-0 flex flex-col">
                        {painting.sold && (
                          <Badge
                            variant="destructive"
                            className="rounded-none rounded-br-md pointer-events-none px-3 py-1 bg-rose-200 text-rose-800 hover:bg-rose-200"
                          >
                            Sold
                          </Badge>
                        )}
                        {painting.featured && (
                          <Badge className="rounded-none rounded-br-md pointer-events-none px-3 py-1 bg-blue-200 text-blue-800 mt-1 hover:bg-blue-200">
                            Featured
                          </Badge>
                        )}
                        {paintingNeedsAttention(painting) && (
                          <Badge
                            variant="destructive"
                            className="rounded-none rounded-br-md pointer-events-none px-3 py-1 mt-1 flex items-center gap-1 bg-red-200 text-red-800 hover:bg-red-200"
                          >
                            <span className="h-2 w-2 animate-pulse bg-red-800 rounded-full"></span>
                            Alert!
                          </Badge>
                        )}
                      </div>
                    </div>
                    <CardContent className="p-4 flex-grow">
                      <h3 className="font-light text-lg">{painting.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {painting.medium}, {painting.year}
                      </p>
                      {painting.genre && <p className="text-xs text-muted-foreground mt-1">Genre: {painting.genre}</p>}
                    </CardContent>
                    <CardFooter className="p-4 pt-0 flex justify-between">
                      <Link href={`/admin/paintings/${painting.id}`}>
                        <Button variant="outline" size="sm" className="flex items-center gap-1">
                          <Edit className="h-3 w-3" />
                          Edit
                        </Button>
                      </Link>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="destructive"
                            size="sm"
                            className="flex items-center gap-1"
                            onClick={() => setPaintingToDelete(painting.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                            Delete
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="bg-background">
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently delete the painting "{painting.title}"
                              and remove all data from the server.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel onClick={() => setPaintingToDelete(null)} disabled={isDeleting}>
                              Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction
                              onClick={handleDelete}
                              disabled={isDeleting}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              {isDeleting ? (
                                <>
                                  <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></span>
                                  Deleting...
                                </>
                              ) : (
                                "Delete"
                              )}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </CardFooter>
                  </Card>
                )
              })}
            </div>
          ) : (
            <div className="p-8 text-center">
              <p className="text-muted-foreground">No completed paintings found with the current filters.</p>
            </div>
          )}
        </div>
      </section>

      {/* Works in Progress Section */}
      <section className="mb-8 border rounded-md overflow-hidden">
        <div className="bg-background p-4 border-b">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-light tracking-wider">Works in Progress ({inProgressPaintings.length})</h2>
            <Button
              variant="ghost"
              size="sm"
              className="p-1 h-8 w-8"
              onClick={() => setInProgressWorksExpanded(!inProgressWorksExpanded)}
              aria-label={inProgressWorksExpanded ? "Collapse works in progress" : "Expand works in progress"}
            >
              {inProgressWorksExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        <div
          className={`transition-all duration-500 ease-in-out overflow-hidden ${
            inProgressWorksExpanded ? "max-h-[5000px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          {inProgressPaintings.length > 0 ? (
            <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {inProgressPaintings.map((painting) => {
                // Get the aspect ratio from the dimensions
                const aspectRatio = getAspectRatio(painting.dimensions)

                return (
                  <Card key={painting.id} className="overflow-hidden h-full flex flex-col bg-background">
                    <div className="relative w-full bg-muted">
                      <div className="w-full" style={{ paddingTop: `${(1 / aspectRatio) * 100}%` }}>
                        <Image
                          src={painting.imageUrl || "/placeholder.svg?height=800&width=600"}
                          alt={painting.title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          unoptimized={painting.imageUrl?.startsWith("https://firebasestorage.googleapis.com")}
                        />
                      </div>
                      {/* New corner badge design */}
                      <div className="absolute top-0 left-0 flex flex-col">
                        {painting.sold && (
                          <Badge
                            variant="destructive"
                            className="rounded-none rounded-br-md pointer-events-none px-3 py-1 bg-rose-200 text-rose-800 hover:bg-rose-200"
                          >
                            Sold
                          </Badge>
                        )}
                        {painting.featured && (
                          <Badge className="rounded-none rounded-br-md pointer-events-none px-3 py-1 bg-blue-200 text-blue-800 mt-1 hover:bg-blue-200">
                            Featured
                          </Badge>
                        )}
                        <Badge
                          variant="secondary"
                          className="rounded-none rounded-br-md pointer-events-none px-3 py-1 bg-amber-200 text-amber-800 hover:bg-amber-200"
                        >
                          In Progress
                        </Badge>
                        {paintingNeedsAttention(painting) && (
                          <Badge
                            variant="destructive"
                            className="rounded-none rounded-br-md pointer-events-none px-3 py-1 mt-1 flex items-center gap-1 bg-red-200 text-red-800 hover:bg-red-200"
                          >
                            <span className="h-2 w-2 animate-pulse bg-red-800 rounded-full"></span>
                            Alert!
                          </Badge>
                        )}
                      </div>
                    </div>
                    <CardContent className="p-4 flex-grow">
                      <h3 className="font-light text-lg">{painting.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {painting.medium}, {painting.year}
                      </p>
                      {painting.genre && <p className="text-xs text-muted-foreground mt-1">Genre: {painting.genre}</p>}
                    </CardContent>
                    <CardFooter className="p-4 pt-0 flex justify-between">
                      <Link href={`/admin/paintings/${painting.id}`}>
                        <Button variant="outline" size="sm" className="flex items-center gap-1">
                          <Edit className="h-3 w-3" />
                          Edit
                        </Button>
                      </Link>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="destructive"
                            size="sm"
                            className="flex items-center gap-1"
                            onClick={() => setPaintingToDelete(painting.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                            Delete
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="bg-background">
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently delete the painting "{painting.title}"
                              and remove all data from the server.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel onClick={() => setPaintingToDelete(null)} disabled={isDeleting}>
                              Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction
                              onClick={handleDelete}
                              disabled={isDeleting}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              {isDeleting ? (
                                <>
                                  <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></span>
                                  Deleting...
                                </>
                              ) : (
                                "Delete"
                              )}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </CardFooter>
                  </Card>
                )
              })}
            </div>
          ) : (
            <div className="p-8 text-center">
              <p className="text-muted-foreground">No works in progress found with the current filters.</p>
            </div>
          )}
        </div>
      </section>

      {filteredPaintings.length === 0 && (
        <div className="text-center py-12 border rounded-lg bg-background">
          <h2 className="text-xl font-semibold mb-2">No paintings found</h2>
          <p className="text-muted-foreground mb-6">
            {paintings.length > 0
              ? "Try adjusting your search or filters to find what you're looking for."
              : "Add your first painting to get started."}
          </p>
          {paintings.length > 0 ? (
            <Button onClick={resetFilters}>Reset Filters</Button>
          ) : (
            <Link href="/admin/paintings/new">
              <Button>Add New Painting</Button>
            </Link>
          )}
        </div>
      )}
    </div>
  )
}

