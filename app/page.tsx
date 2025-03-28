"use client"

import { useState, useEffect } from "react"
import { MainLayout } from "@/components/main-layout"
import { PaintingCard } from "@/components/painting-card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { ColoredText } from "@/components/colored-text"
import { ChevronDown, ChevronUp } from "lucide-react"
import type { Painting } from "@/types/painting"
import { Footer } from "@/components/footer"

// Helper function to extract dimensions and calculate relative size
function getRelativeSize(dimensionsStr: string): { width: number; height: number; scale: number } {
  // Default values if parsing fails
  let width = 10
  let height = 10

  try {
    // Extract height and width from the dimensions string (e.g., "24 x 36 inches")
    const match = dimensionsStr.match(/^([\d.]+)\s*x\s*([\d.]+)/)
    if (match) {
      height = Number.parseFloat(match[1])
      width = Number.parseFloat(match[2])
    }
  } catch (error) {
    console.error("Error parsing dimensions:", error)
  }

  // Calculate the area of the painting
  const area = width * height

  // Calculate a scale factor based on the area
  // We use a square root to make the scaling more reasonable
  // (otherwise very large paintings would dominate too much)
  const scale = Math.sqrt(area) / 10 // Normalize to a reasonable range

  // Ensure the scale is within reasonable bounds
  const boundedScale = Math.max(0.5, Math.min(scale, 2.5))

  return { width, height, scale: boundedScale }
}

// Update the collage layout function to ensure proper spacing and prevent overlaps
function generateCollageLayout(paintings: any[]) {
  // Create a copy of the paintings array to avoid modifying the original
  const paintingsToArrange = [...paintings]

  // Shuffle the array to get a random arrangement each time
  for (let i = paintingsToArrange.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[paintingsToArrange[i], paintingsToArrange[j]] = [paintingsToArrange[j], paintingsToArrange[i]]
  }

  // Define grid-based positions for the collage with more spacing to prevent overlaps
  // Each position has x, y coordinates (as pixels) and a z-index for layering
  const positions = [
    { x: 50, y: 50, z: 1 },
    { x: 250, y: 30, z: 2 },
    { x: 450, y: 70, z: 3 },
    { x: 650, y: 40, z: 2 },
    { x: 850, y: 90, z: 1 },
    { x: 30, y: 220, z: 2 },
    { x: 230, y: 200, z: 3 },
    { x: 430, y: 240, z: 2 },
    { x: 630, y: 210, z: 1 },
    { x: 830, y: 250, z: 2 },
    { x: 150, y: 380, z: 1 },
    { x: 350, y: 360, z: 2 },
  ]

  // Limit the number of paintings to display to avoid overcrowding
  const maxPaintings = Math.min(paintingsToArrange.length, positions.length)

  // Assign positions to paintings
  return paintingsToArrange.slice(0, maxPaintings).map((painting, index) => {
    return {
      painting,
      position: positions[index],
    }
  })
}

// Constants
const PAINTINGS_PER_PAGE = 12
const HERO_HEIGHT = "100vh" // Full viewport height for hero section

export default function HomePage() {
  const [allPaintings, setAllPaintings] = useState<Painting[]>([])
  const [filteredPaintings, setFilteredPaintings] = useState<Painting[]>([])
  const [featuredPaintings, setFeaturedPaintings] = useState<Painting[]>([])
  const [filteredFeaturedPaintings, setFilteredFeaturedPaintings] = useState<Painting[]>([])
  const [inProgressPaintings, setInProgressPaintings] = useState<Painting[]>([])
  const [filteredInProgressPaintings, setFilteredInProgressPaintings] = useState<Painting[]>([])
  const [loading, setLoading] = useState(true)

  // Pagination states
  const [featuredPaintingsToShow, setFeaturedPaintingsToShow] = useState(PAINTINGS_PER_PAGE)
  const [allPaintingsToShow, setAllPaintingsToShow] = useState(PAINTINGS_PER_PAGE)
  const [inProgressPaintingsToShow, setInProgressPaintingsToShow] = useState(PAINTINGS_PER_PAGE)

  // Collapsible section states
  const [featuredExpanded, setFeaturedExpanded] = useState(true)
  const [inProgressExpanded, setInProgressExpanded] = useState(true)

  // Filter states
  const [selectedGenre, setSelectedGenre] = useState<string>("All")
  const [availabilityFilter, setAvailabilityFilter] = useState<string>("All")

  // Fetch paintings on component mount
  useEffect(() => {
    const fetchPaintings = async () => {
      try {
        setLoading(true)
        // Import getPaintings dynamically to avoid issues with server/client components
        const { getPaintings } = await import("@/lib/db")
        const paintings = await getPaintings()

        // Filter out in-progress paintings for the main sections
        const nonInProgressPaintings = paintings.filter((p) => !p.inProgress)

        setAllPaintings(nonInProgressPaintings)
        setFilteredPaintings(nonInProgressPaintings)

        const featured = nonInProgressPaintings.filter((p) => p.featured)
        setFeaturedPaintings(featured)
        setFilteredFeaturedPaintings(featured)

        // Separate in-progress paintings
        const inProgress = paintings.filter((p) => p.inProgress)
        setInProgressPaintings(inProgress)
        setFilteredInProgressPaintings(inProgress)
      } catch (error) {
        console.error("Error fetching paintings:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchPaintings()
  }, [])

  // Apply filters when they change
  useEffect(() => {
    const applyFilters = (paintings: Painting[]) => {
      return paintings.filter((painting) => {
        // Genre filter
        const genreMatch =
          selectedGenre === "All" ||
          (painting.genre && painting.genre === selectedGenre) ||
          (!painting.genre && selectedGenre === "Uncategorized")

        // Availability filter
        const availabilityMatch =
          availabilityFilter === "All" ||
          (availabilityFilter === "Available" && !painting.sold) ||
          (availabilityFilter === "Sold" && painting.sold)

        return genreMatch && availabilityMatch
      })
    }

    // Apply filters only to non-featured sections
    setFilteredPaintings(applyFilters(allPaintings))
    setFilteredInProgressPaintings(applyFilters(inProgressPaintings))

    // Don't apply filters to featured paintings
    setFilteredFeaturedPaintings(featuredPaintings)

    // Reset pagination when filters change
    setAllPaintingsToShow(PAINTINGS_PER_PAGE)
    setInProgressPaintingsToShow(PAINTINGS_PER_PAGE)
    // Don't reset featured pagination on filter change
  }, [selectedGenre, availabilityFilter, allPaintings, inProgressPaintings, featuredPaintings])

  // Generate the collage layout
  const collageItems = generateCollageLayout(allPaintings.filter((p) => !p.inProgress))

  // Get unique genres from all paintings
  const genres = ["All", ...new Set(allPaintings.filter((p) => p.genre).map((p) => p.genre as string)), "Uncategorized"]

  // Load more handlers
  const handleLoadMoreFeatured = () => {
    setFeaturedPaintingsToShow((prev) => prev + PAINTINGS_PER_PAGE)
  }

  const handleLoadMoreAll = () => {
    setAllPaintingsToShow((prev) => prev + PAINTINGS_PER_PAGE)
  }

  const handleLoadMoreInProgress = () => {
    setInProgressPaintingsToShow((prev) => prev + PAINTINGS_PER_PAGE)
  }

  // Show less handlers
  const handleShowLessFeatured = () => {
    setFeaturedPaintingsToShow(PAINTINGS_PER_PAGE)
  }

  const handleShowLessAll = () => {
    setAllPaintingsToShow(PAINTINGS_PER_PAGE)
  }

  const handleShowLessInProgress = () => {
    setInProgressPaintingsToShow(PAINTINGS_PER_PAGE)
  }

  // Slice paintings for display
  const displayedFeaturedPaintings = filteredFeaturedPaintings.slice(0, featuredPaintingsToShow)
  const displayedAllPaintings = filteredPaintings.slice(0, allPaintingsToShow)
  const displayedInProgressPaintings = filteredInProgressPaintings.slice(0, inProgressPaintingsToShow)

  return (
    <MainLayout>
      {/* Fixed Hero Section with Painting Thumbnails in Collage */}
      <section className="fixed top-16 left-0 right-0 z-0" style={{ height: HERO_HEIGHT }}>
        {/* Backdrop Image - Using the updated gallery wall image */}
        <div className="absolute inset-0">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Gallary%20Wall%20cropped.jpg-MwSy8jdAtYrON05hMqmBYUeuuIzcua.jpeg"
            alt="Art Gallery Wall"
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Collage of Paintings */}
        <div className="absolute inset-0">
          <div className="relative w-full h-full max-w-6xl mx-auto">
            {collageItems.map((item, index) => {
              const { painting, position } = item
              const { width, height, scale } = getRelativeSize(painting.dimensions)

              // Base size that will be scaled
              const baseHeight = 120 // Adjust this value to control overall size

              // Calculate display height and width while maintaining aspect ratio
              const displayHeight = baseHeight * scale
              const displayWidth = (width / height) * displayHeight

              return (
                <Link
                  key={`collage-${painting.id}`}
                  href={`/painting/${painting.id}`}
                  className="absolute shadow-md hover:shadow-lg transition-all duration-300"
                  style={{
                    left: `${position.x}px`,
                    top: `${position.y}px`,
                    height: `${displayHeight}px`,
                    width: `${displayWidth}px`,
                    zIndex: position.z,
                    margin: "10px", // Increased margin to prevent overlaps
                  }}
                >
                  <div className="relative w-full h-full">
                    <Image
                      src={painting.imageUrl || "/placeholder.svg?height=200&width=150"}
                      alt={painting.title}
                      fill
                      className="object-cover"
                      sizes={`${Math.round(displayWidth)}px`}
                      unoptimized={painting.imageUrl?.startsWith("https://firebasestorage.googleapis.com")}
                    />
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* Spacer to push content below the hero */}
      <div style={{ height: `calc(${HERO_HEIGHT} - 30px)` }}></div>

      {/* Content that will slide over the hero */}
      <div className="relative z-10 bg-ivory rounded-t-3xl shadow-[0_-15px_40px_rgba(0,0,0,0.2)] -mt-[30px]">
        {/* Pull tab indicator */}
        <div className="absolute right-1/2 transform translate-x-1/2 -top-10 bg-ivory px-8 py-2 rounded-t-xl shadow-md">
          <ChevronUp className="h-5 w-5 text-dark/70" />
        </div>

        {/* Title Section */}
        <section className="py-12 bg-ivory border-b">
          <div className="container px-4 md:px-6">
            <div className="text-center max-w-2xl mx-auto">
              <h1 className="text-3xl tracking-wider sm:text-4xl md:text-5xl mb-4">
                <span className="font-light tracking-wider font-[Beirut,sans-serif]">D.Coppard Fine Art</span>{" "}
                <span className="font-['Times_New_Roman'] italic font-medium tracking-wider">Gallery</span>
              </h1>
              <p className="text-muted-foreground md:text-xl">
                <ColoredText>De gustibus non est disputandum.</ColoredText>
              </p>
            </div>
          </div>
        </section>

        {featuredPaintings.length > 0 && (
          <section className="py-8 md:py-12 border-b bg-ivory">
            <div className="container px-4 md:px-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                <div className="flex items-center">
                  <h2 className="text-2xl font-bold tracking-tighter">Featured Work</h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="ml-2 p-1 h-8 w-8"
                    onClick={() => setFeaturedExpanded(!featuredExpanded)}
                    aria-label={featuredExpanded ? "Collapse featured works" : "Expand featured works"}
                  >
                    {featuredExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                  </Button>
                </div>
              </div>

              <div
                className={`transition-all duration-500 ease-in-out overflow-hidden ${featuredExpanded ? "max-h-[5000px] opacity-100" : "max-h-0 opacity-0"}`}
              >
                {filteredFeaturedPaintings.length > 0 ? (
                  <>
                    <div className="max-w-md mx-auto">
                      {filteredFeaturedPaintings.length > 0 && (
                        <PaintingCard key={filteredFeaturedPaintings[0].id} painting={filteredFeaturedPaintings[0]} />
                      )}
                    </div>
                  </>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">No featured paintings to display.</p>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        <section className="py-8 md:py-12 bg-ivory">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
              <h2 className="text-2xl font-bold tracking-tighter">Completed Works</h2>

              <div className="flex flex-wrap gap-2 mt-4 md:mt-0 justify-end">
                {/* Genre Filter */}
                <div className="flex flex-wrap gap-1">
                  {genres.map((genre) => (
                    <Button
                      key={genre}
                      variant={selectedGenre === genre ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedGenre(genre)}
                      className="text-xs"
                    >
                      {genre}
                    </Button>
                  ))}
                </div>

                {/* Availability Filter */}
                <div className="flex gap-1 ml-2">
                  {["All", "Available", "Sold"].map((status) => (
                    <Button
                      key={status}
                      variant={availabilityFilter === status ? "default" : "outline"}
                      size="sm"
                      onClick={() => setAvailabilityFilter(status)}
                      className="text-xs"
                    >
                      {status}
                    </Button>
                  ))}
                </div>
                {/* Reset All Filters */}
                <div className="flex gap-1 ml-2">
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => {
                      setSelectedGenre("All")
                      setAvailabilityFilter("All")
                    }}
                    className="text-xs"
                  >
                    Reset All Filters
                  </Button>
                </div>
              </div>
            </div>

            {filteredPaintings.length > 0 ? (
              <>
                {/* Pagination info */}
                <div className="text-sm text-muted-foreground text-right mb-4">
                  Showing {Math.min(displayedAllPaintings.length, filteredPaintings.length)} of{" "}
                  {filteredPaintings.length} paintings
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {displayedAllPaintings.map((painting) => (
                    <PaintingCard key={painting.id} painting={painting} />
                  ))}
                </div>

                {/* Pagination controls */}
                <div className="flex justify-center gap-4 mt-8 bg-dark p-4 w-full">
                  {allPaintingsToShow > PAINTINGS_PER_PAGE && (
                    <Button
                      variant="outline"
                      onClick={handleShowLessAll}
                      className="min-w-[150px] bg-ivory hover:bg-ivory/90"
                    >
                      Show Less
                    </Button>
                  )}

                  {displayedAllPaintings.length < filteredPaintings.length && (
                    <Button
                      variant="outline"
                      onClick={handleLoadMoreAll}
                      className="min-w-[150px] bg-ivory hover:bg-ivory/90"
                    >
                      Show 12 More
                    </Button>
                  )}
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-6">No paintings match your current filters.</p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedGenre("All")
                    setAvailabilityFilter("All")
                  }}
                >
                  Reset Filters
                </Button>
              </div>
            )}
          </div>
        </section>

        {inProgressPaintings.length > 0 && (
          <section className="py-8 md:py-12 bg-ivory border-t">
            <div className="container px-4 md:px-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <h2 className="text-2xl font-bold tracking-tighter">Works in Progress</h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="ml-2 p-1 h-8 w-8"
                    onClick={() => setInProgressExpanded(!inProgressExpanded)}
                    aria-label={inProgressExpanded ? "Collapse works in progress" : "Expand works in progress"}
                  >
                    {inProgressExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                  </Button>
                </div>

                {/* Note: Filter controls removed as they're now controlled by the Featured Works section */}
              </div>

              <div
                className={`transition-all duration-500 ease-in-out overflow-hidden ${inProgressExpanded ? "max-h-[5000px] opacity-100" : "max-h-0 opacity-0"}`}
              >
                {filteredInProgressPaintings.length > 0 ? (
                  <>
                    {/* Pagination info */}
                    <div className="text-sm text-muted-foreground text-right mb-4">
                      Showing {Math.min(displayedInProgressPaintings.length, filteredInProgressPaintings.length)} of{" "}
                      {filteredInProgressPaintings.length} paintings
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                      {displayedInProgressPaintings.map((painting) => (
                        <PaintingCard key={painting.id} painting={painting} />
                      ))}
                    </div>

                    {/* Pagination controls */}
                    <div className="flex justify-center gap-4 mt-8">
                      {inProgressPaintingsToShow > PAINTINGS_PER_PAGE && (
                        <Button variant="outline" onClick={handleShowLessInProgress} className="min-w-[150px]">
                          Show Less
                        </Button>
                      )}

                      {displayedInProgressPaintings.length < filteredInProgressPaintings.length && (
                        <Button variant="outline" onClick={handleLoadMoreInProgress} className="min-w-[150px]">
                          Show 12 More
                        </Button>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">No works in progress match your current filters.</p>
                    <Button
                      variant="outline"
                      className="mt-4"
                      onClick={() => {
                        setSelectedGenre("All")
                        setAvailabilityFilter("All")
                      }}
                    >
                      Reset Filters
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {/* Add Footer component here */}
        <Footer />
      </div>
    </MainLayout>
  )
}

