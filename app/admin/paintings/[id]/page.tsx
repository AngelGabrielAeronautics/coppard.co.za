"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { PaintingForm } from "@/components/painting-form"
import { getPainting } from "@/lib/db"
import type { Painting } from "@/types/painting"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { X } from "lucide-react"

export default function EditPaintingPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const id = params.id as string

  const isNewPainting = id === "new"
  const [painting, setPainting] = useState<Painting | null>(null)
  const [loading, setLoading] = useState(!isNewPainting) // Don't show loading for new paintings
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Skip fetching if we're creating a new painting
    if (isNewPainting) {
      // Create an empty painting structure for consistency
      const emptyPainting: Painting = {
        id: "",
        title: "",
        description: "",
        imageUrl: "",
        dimensions: "",
        medium: "Oil on canvas",
        year: new Date().getFullYear(),
        price: undefined,
        sold: false,
        featured: false,
        createdAt: new Date(),
      }
      setPainting(emptyPainting)
      return
    }

    const fetchPainting = async () => {
      try {
        console.log(`Fetching painting with ID: ${id}`)
        const data = await getPainting(id)

        if (!data) {
          console.error(`Painting with ID ${id} not found`)
          setError("Painting not found")
          return
        }

        console.log("Painting data:", data)
        setPainting(data)
      } catch (error) {
        console.error("Error fetching painting:", error)
        setError("Failed to load painting")
        toast({
          title: "Error",
          description: "Failed to load painting",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchPainting()
  }, [id, toast, isNewPainting])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error && !isNewPainting) {
    return (
      <div className="container px-4 py-8 md:px-6 md:py-12">
        <h1 className="text-3xl font-bold mb-8">Error</h1>
        <p className="mb-6">{error || "Painting not found"}</p>
        <Button onClick={() => router.push("/admin")}>Back to Dashboard</Button>
      </div>
    )
  }

  return (
    <div className="container px-4 py-8 md:px-6 md:py-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">{isNewPainting ? "Add New Painting" : "Edit Painting"}</h1>
        <button
          onClick={() => router.push("/admin")}
          className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          aria-label="Close and return to dashboard"
        >
          <X className="h-6 w-6 text-gray-500 hover:text-dark" />
        </button>
      </div>
      <PaintingForm painting={painting as Painting} isEditing={!isNewPainting} twoColumnLayout={true} />
    </div>
  )
}

