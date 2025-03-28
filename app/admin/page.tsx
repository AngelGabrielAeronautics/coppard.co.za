"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Plus, Edit, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
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
import { getPaintings, deletePainting } from "@/lib/db"
import type { Painting } from "@/types/painting"

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

export default function AdminDashboard() {
  const { toast } = useToast()
  const [paintings, setPaintings] = useState<Painting[]>([])
  const [loading, setLoading] = useState(true)
  const [paintingToDelete, setPaintingToDelete] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const fetchPaintings = async () => {
    try {
      setLoading(true)
      const data = await getPaintings()
      setPaintings(data)
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

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="container px-4 py-8 md:px-6 md:py-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <Link href="/admin/paintings/new">
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add New Painting
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {paintings.map((painting) => {
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
                {painting.sold && (
                  <Badge variant="destructive" className="absolute top-2 right-2">
                    Sold
                  </Badge>
                )}
                {painting.featured && <Badge className="absolute top-2 left-2 bg-amber-500">Featured</Badge>}
              </div>
              <CardContent className="p-4 flex-grow">
                <h3 className="font-semibold text-lg">{painting.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {painting.medium}, {painting.year}
                </p>
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
                        This action cannot be undone. This will permanently delete the painting "{painting.title}" and
                        remove all data from the server.
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

      {paintings.length === 0 && (
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold mb-2">No paintings yet</h2>
          <p className="text-muted-foreground mb-6">Add your first painting to get started</p>
          <Link href="/admin/paintings/new">
            <Button>Add New Painting</Button>
          </Link>
        </div>
      )}
    </div>
  )
}

