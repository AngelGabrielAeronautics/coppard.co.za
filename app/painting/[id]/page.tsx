"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import { MainLayout } from "@/components/main-layout"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog"
import { getPainting } from "@/lib/db"
import type { Painting } from "@/types/painting"

// Import the arrow icons at the top of the file with the other imports
import { ChevronLeft, ChevronRight, X } from "lucide-react"

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

export default function PaintingPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string
  const { toast } = useToast()

  const [painting, setPainting] = useState<Painting | null>(null)
  const [loading, setLoading] = useState(true)
  const [magnifyPosition, setMagnifyPosition] = useState({ x: 0, y: 0 })
  const [isMagnifying, setIsMagnifying] = useState(false)
  const [isInquiryOpen, setIsInquiryOpen] = useState(false)
  const [isOfferOpen, setIsOfferOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const imageContainerRef = useRef<HTMLDivElement>(null)
  // Add this after the existing state variables
  const [allPaintings, setAllPaintings] = useState<Painting[]>([])

  useEffect(() => {
    const fetchPaintingData = async () => {
      try {
        setLoading(true)

        // Fetch the current painting
        const data = await getPainting(id)
        console.log("Fetched painting data:", data)
        setPainting(data)

        // Fetch all paintings for navigation
        const { getPaintings } = await import("@/lib/db")
        const paintings = await getPaintings()
        setAllPaintings(paintings)
      } catch (error) {
        console.error("Error fetching painting:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchPaintingData()

    // Add a refresh interval to periodically check for updates
    const refreshInterval = setInterval(() => fetchPaintingData(), 30000) // Check every 30 seconds

    return () => clearInterval(refreshInterval)
  }, [id])

  const handleInquirySubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    const formData = new FormData(e.currentTarget)
    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const message = formData.get("message") as string

    // Simulate sending the inquiry
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Show success message
    toast({
      title: "Inquiry Sent",
      description: "Your inquiry has been sent successfully. We'll get back to you soon.",
    })

    setIsSubmitting(false)
    setIsInquiryOpen(false)
  }

  const handleOfferSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    const formData = new FormData(e.currentTarget)
    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const offerAmount = formData.get("offerAmount") as string
    const comments = formData.get("comments") as string

    // Simulate sending the offer
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Show success message
    toast({
      title: "Offer Submitted",
      description: "Your offer has been submitted successfully. We'll get back to you soon.",
    })

    setIsSubmitting(false)
    setIsOfferOpen(false)
  }

  if (loading) {
    return (
      <MainLayout>
        <div className="flex min-h-[50vh] items-center justify-center bg-ivory">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </MainLayout>
    )
  }

  if (!painting) {
    return (
      <MainLayout>
        <div className="container px-4 py-12 md:px-6 md:py-16 text-center bg-ivory">
          <h1 className="text-3xl font-bold mb-4">Painting Not Found</h1>
          <p className="mb-8">The painting you are looking for does not exist or has been removed.</p>
          <Button onClick={() => router.push("/")}>Return to Gallery</Button>
        </div>
      </MainLayout>
    )
  }

  // Get the aspect ratio from the dimensions
  const aspectRatio = getAspectRatio(painting.dimensions)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageContainerRef.current) return

    const { left, top, width, height } = imageContainerRef.current.getBoundingClientRect()
    const x = ((e.clientX - left) / width) * 100
    const y = ((e.clientY - top) / height) * 100

    setMagnifyPosition({ x, y })
  }

  // Add the navigation functions inside the component, before the return statement
  // Add this after the handleMouseMove function and before the return statement:

  const navigateToPrevious = () => {
    if (!painting || allPaintings.length <= 1) return

    // Find the current painting's index
    const currentIndex = allPaintings.findIndex((p) => p.id === painting.id)
    if (currentIndex === -1) return

    // Calculate the previous index (wrap around to the end if at the beginning)
    const prevIndex = currentIndex === 0 ? allPaintings.length - 1 : currentIndex - 1
    const prevPainting = allPaintings[prevIndex]

    // Navigate to the previous painting
    router.push(`/painting/${prevPainting.id}`)
  }

  const navigateToNext = () => {
    if (!painting || allPaintings.length <= 1) return

    // Find the current painting's index
    const currentIndex = allPaintings.findIndex((p) => p.id === painting.id)
    if (currentIndex === -1) return

    // Calculate the next index (wrap around to the beginning if at the end)
    const nextIndex = currentIndex === allPaintings.length - 1 ? 0 : currentIndex + 1
    const nextPainting = allPaintings[nextIndex]

    // Navigate to the next painting
    router.push(`/painting/${nextPainting.id}`)
  }

  return (
    <MainLayout>
      {/* Update the container div to include the navigation arrows */}
      {/* Replace: */}
      {/* <div className="container px-4 py-12 md:px-6 md:py-16 bg-ivory"> */}

      {/* With: */}
      <div className="relative flex items-stretch bg-ivory">
        {/* Left gutter with previous button */}
        <div className="hidden md:flex w-16 lg:w-24 flex-shrink-0 items-center justify-center relative">
          <button
            onClick={navigateToPrevious}
            className="text-primary hover:text-primary/80 rounded-full p-3 z-10 flex items-center justify-center transition-colors"
            aria-label="Previous painting"
          >
            <ChevronLeft className="h-8 w-8" />
          </button>
        </div>

        {/* Main content */}
        <div className="container relative px-4 py-12 md:px-6 md:py-16">
          <div className="grid gap-8 md:grid-cols-2">
            <div
              className="relative w-full cursor-zoom-in"
              ref={imageContainerRef}
              onMouseEnter={() => setIsMagnifying(true)}
              onMouseLeave={() => setIsMagnifying(false)}
              onMouseMove={handleMouseMove}
            >
              <div className="w-full" style={{ paddingTop: `${(1 / aspectRatio) * 100}%` }}>
                <Image
                  src={painting.imageUrl || "/placeholder.svg?height=800&width=600"}
                  alt={painting.title}
                  fill
                  className="object-contain bg-transparent"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                  unoptimized={painting.imageUrl?.startsWith("https://firebasestorage.googleapis.com")}
                />

                {isMagnifying && painting.imageUrl && (
                  <div
                    className="absolute pointer-events-none z-10 rounded-full shadow-lg overflow-hidden"
                    style={{
                      width: "150px",
                      height: "150px",
                      left: `${Math.min(Math.max(magnifyPosition.x - 7.5, 0), 85)}%`,
                      top: `${Math.min(Math.max(magnifyPosition.y - 7.5, 0), 85)}%`,
                      backgroundImage: `url(${painting.imageUrl})`,
                      backgroundPosition: `${magnifyPosition.x}% ${magnifyPosition.y}%`,
                      backgroundSize: "800%",
                      backgroundRepeat: "no-repeat",
                      border: "2px solid white",
                    }}
                  />
                )}
              </div>
            </div>
            <div className="flex flex-col space-y-6">
              <div>
                <h1 className="text-3xl font-bold">{painting.title}</h1>
                <p className="text-lg text-muted-foreground">{painting.year}</p>
              </div>

              <div className="space-y-3">
                <p className="text-lg">{painting.medium}</p>

                {painting.genre && <p className="text-lg">{painting.genre}</p>}

                <p className="text-lg">{painting.dimensions}</p>

                {painting.price && <p className="text-lg">£{painting.price}</p>}

                <div>
                  {painting.sold ? (
                    <Badge variant="destructive">Sold</Badge>
                  ) : (
                    <Badge variant="outline">Available</Badge>
                  )}
                </div>

                {painting.referenceCredit && painting.referenceCredit.trim() !== "" && (
                  <p className="text-lg italic text-muted-foreground">Reference: {painting.referenceCredit}</p>
                )}
              </div>

              <div className="space-y-2">
                <h2 className="text-xl font-semibold">Description</h2>
                <p className="text-muted-foreground">{painting.description}</p>
              </div>

              {!painting.sold && (
                <div className="flex flex-col sm:flex-row gap-4">
                  <Dialog open={isInquiryOpen} onOpenChange={setIsInquiryOpen}>
                    <DialogTrigger asChild>
                      <Button className="flex-1">Inquire About This Piece</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px]">
                      <DialogHeader>
                        <DialogTitle>Inquire About Artwork</DialogTitle>
                        <DialogDescription>
                          Fill out the form below to inquire about this painting. We'll get back to you as soon as
                          possible.
                        </DialogDescription>
                      </DialogHeader>

                      {/* Painting details section */}
                      <div className="mt-4 p-4 bg-muted/40 rounded-lg border">
                        <div className="flex gap-4 items-start">
                          <div className="relative w-20 h-20 flex-shrink-0 bg-muted rounded overflow-hidden">
                            <Image
                              src={painting.imageUrl || "/placeholder.svg?height=100&width=100"}
                              alt={painting.title}
                              fill
                              className="object-contain"
                              sizes="80px"
                              unoptimized={painting.imageUrl?.startsWith("https://firebasestorage.googleapis.com")}
                            />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-medium text-base">{painting.title}</h3>
                            <div className="text-sm text-muted-foreground space-y-1 mt-1">
                              <p>
                                {painting.year} • {painting.medium}
                              </p>
                              <p>{painting.dimensions}</p>
                              {painting.price && <p>Price: £{painting.price}</p>}
                              <input type="hidden" name="paintingId" value={painting.id} />
                              <input type="hidden" name="paintingTitle" value={painting.title} />
                              <input
                                type="hidden"
                                name="paintingDetails"
                                value={`${painting.year}, ${painting.medium}, ${painting.dimensions}${painting.price ? `, £${painting.price}` : ""}`}
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      <form onSubmit={handleInquirySubmit} className="space-y-4 mt-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Name</Label>
                          <Input id="name" name="name" required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input id="email" name="email" type="email" required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="message">Message</Label>
                          <Textarea
                            id="message"
                            name="message"
                            rows={5}
                            required
                            defaultValue={`I am interested in your painting "${painting.title}" and would like more information.`}
                          />
                        </div>
                        <DialogFooter>
                          <DialogClose asChild>
                            <Button type="button" variant="outline">
                              Cancel
                            </Button>
                          </DialogClose>
                          <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? "Sending..." : "Send Inquiry"}
                          </Button>
                        </DialogFooter>
                      </form>
                    </DialogContent>
                  </Dialog>

                  <Dialog open={isOfferOpen} onOpenChange={setIsOfferOpen}>
                    <DialogTrigger asChild>
                      <Button className="flex-1" variant="outline">
                        Make an Offer
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px]">
                      <DialogHeader>
                        <DialogTitle>Make an Offer</DialogTitle>
                        <DialogDescription>
                          Submit your offer for this painting. Include any comments or questions you may have.
                        </DialogDescription>
                      </DialogHeader>

                      {/* Painting details section */}
                      <div className="mt-4 p-4 bg-muted/40 rounded-lg border">
                        <div className="flex gap-4 items-start">
                          <div className="relative w-20 h-20 flex-shrink-0 bg-muted rounded overflow-hidden">
                            <Image
                              src={painting.imageUrl || "/placeholder.svg?height=100&width=100"}
                              alt={painting.title}
                              fill
                              className="object-contain"
                              sizes="80px"
                              unoptimized={painting.imageUrl?.startsWith("https://firebasestorage.googleapis.com")}
                            />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-medium text-base">{painting.title}</h3>
                            <div className="text-sm text-muted-foreground space-y-1 mt-1">
                              <p>
                                {painting.year} • {painting.medium}
                              </p>
                              <p>{painting.dimensions}</p>
                              {painting.price && <p>Listed Price: £{painting.price}</p>}
                              <input type="hidden" name="paintingId" value={painting.id} />
                              <input type="hidden" name="paintingTitle" value={painting.title} />
                              <input
                                type="hidden"
                                name="paintingDetails"
                                value={`${painting.year}, ${painting.medium}, ${painting.dimensions}${painting.price ? `, £${painting.price}` : ""}`}
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      <form onSubmit={handleOfferSubmit} className="space-y-4 mt-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Name</Label>
                          <Input id="name" name="name" required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input id="email" name="email" type="email" required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="offerAmount">Your Offer (£)</Label>
                          <Input
                            id="offerAmount"
                            name="offerAmount"
                            type="number"
                            min="1"
                            step="1"
                            required
                            defaultValue={painting.price || ""}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="comments">Comments</Label>
                          <Textarea
                            id="comments"
                            name="comments"
                            rows={4}
                            placeholder="Add any comments or questions about your offer here."
                          />
                        </div>
                        <DialogFooter>
                          <DialogClose asChild>
                            <Button type="button" variant="outline">
                              Cancel
                            </Button>
                          </DialogClose>
                          <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? "Submitting..." : "Submit Offer"}
                          </Button>
                        </DialogFooter>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right gutter with next button */}
        <div className="hidden md:flex w-16 lg:w-24 flex-shrink-0 items-center justify-center relative">
          {/* Close button - positioned at the top */}
          <button
            onClick={() => router.push("/")}
            className="absolute top-4 right-4 text-primary hover:text-primary/80 rounded-full p-3 z-10 flex items-center justify-center transition-colors"
            aria-label="Close and return to gallery"
          >
            <X className="h-9 w-9" />
          </button>

          <button
            onClick={navigateToNext}
            className="text-primary hover:text-primary/80 rounded-full p-3 z-10 flex items-center justify-center transition-colors"
            aria-label="Next painting"
          >
            <ChevronRight className="h-8 w-8" />
          </button>
        </div>
      </div>
    </MainLayout>
  )
}

