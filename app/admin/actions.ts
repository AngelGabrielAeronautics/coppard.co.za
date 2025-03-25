"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { requireAuth } from "@/lib/auth"
import type { Artwork } from "@/types/artwork"

// In a real application, this would interact with a database
// For this demo, we'll use a mock data store

// Mock data store - in a real app, this would be a database
let artworks: Artwork[] = [
  // Sample data from the existing gallery
  {
    id: "barn-owl",
    title: "Who",
    description:
      "A striking close-up portrait of a barn owl, capturing the bird's distinctive heart-shaped facial disc and penetrating dark eyes against a rich, dark background.",
    year: "2023",
    medium: "Oil on canvas",
    dimensions: '10" × 10"',
    price: 550,
    available: true,
    category: "Wildlife",
    image: "/images/barn-owl.jpeg",
    additionalImages: ["/images/barn-owl.jpeg"],
    details: "This painting was created using high-quality oil paints on a premium cotton canvas.",
    shipping: "Carefully packaged and shipped with tracking.",
    returns: "Returns accepted within 14 days.",
    createdAt: Date.now() - 1000000,
    updatedAt: Date.now() - 1000000,
  },
  {
    id: "white-house",
    title: "White House by the Sea",
    description:
      "A moody, atmospheric landscape depicting a solitary white cottage with stone outbuildings perched on the edge of a dark, turbulent sea.",
    year: "2023",
    medium: "Oil on canvas",
    dimensions: '12" × 16"',
    price: 675,
    available: true,
    category: "Landscapes",
    image: "/images/white-house.jpeg",
    additionalImages: ["/images/white-house.jpeg"],
    details: "This painting was created using high-quality oil paints on a premium cotton canvas.",
    shipping: "Carefully packaged and shipped with tracking.",
    returns: "Returns accepted within 14 days.",
    createdAt: Date.now() - 2000000,
    updatedAt: Date.now() - 2000000,
  },
]

// Get all artworks
export async function getArtworks() {
  // Ensure user is authenticated
  requireAuth()

  // Sort by most recently updated
  return [...artworks].sort((a, b) => b.updatedAt - a.updatedAt)
}

// Get a single artwork by ID
export async function getArtwork(id: string) {
  // Ensure user is authenticated
  requireAuth()

  return artworks.find((artwork) => artwork.id === id)
}

// Create a new artwork
export async function createArtwork(formData: FormData) {
  // Ensure user is authenticated
  requireAuth()

  // Process form data
  const title = formData.get("title") as string
  const description = formData.get("description") as string
  const year = formData.get("year") as string
  const medium = formData.get("medium") as string
  const dimensions = formData.get("dimensions") as string
  const price = Number.parseFloat(formData.get("price") as string)
  const available = formData.get("available") === "true"
  const category = formData.get("category") as string
  const image = formData.get("image") as string
  const details = formData.get("details") as string
  const shipping = formData.get("shipping") as string
  const returns = formData.get("returns") as string

  // Validate required fields
  if (!title || !image || !category || !price) {
    return { success: false, error: "Missing required fields" }
  }

  // Generate a unique ID (slug) from the title
  const id = title
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")

  // Check if ID already exists
  if (artworks.some((artwork) => artwork.id === id)) {
    return { success: false, error: "An artwork with this title already exists" }
  }

  // Create new artwork
  const newArtwork: Artwork = {
    id,
    title,
    description,
    year,
    medium,
    dimensions,
    price,
    available,
    category,
    image,
    details,
    shipping,
    returns,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  }

  // Add to collection
  artworks.push(newArtwork)

  // Revalidate paths to update the UI
  revalidatePath("/admin/artworks")
  revalidatePath("/gallery")
  revalidatePath("/shop")
  revalidatePath("/")

  // Redirect to the artworks list
  redirect("/admin/artworks")
}

// Update an existing artwork
export async function updateArtwork(id: string, formData: FormData) {
  // Ensure user is authenticated
  requireAuth()

  // Find the artwork
  const artworkIndex = artworks.findIndex((artwork) => artwork.id === id)

  if (artworkIndex === -1) {
    return { success: false, error: "Artwork not found" }
  }

  // Process form data
  const title = formData.get("title") as string
  const description = formData.get("description") as string
  const year = formData.get("year") as string
  const medium = formData.get("medium") as string
  const dimensions = formData.get("dimensions") as string
  const price = Number.parseFloat(formData.get("price") as string)
  const available = formData.get("available") === "true"
  const category = formData.get("category") as string
  const image = formData.get("image") as string
  const details = formData.get("details") as string
  const shipping = formData.get("shipping") as string
  const returns = formData.get("returns") as string

  // Validate required fields
  if (!title || !image || !category || !price) {
    return { success: false, error: "Missing required fields" }
  }

  // Update the artwork
  artworks[artworkIndex] = {
    ...artworks[artworkIndex],
    title,
    description,
    year,
    medium,
    dimensions,
    price,
    available,
    category,
    image,
    details,
    shipping,
    returns,
    updatedAt: Date.now(),
  }

  // Revalidate paths to update the UI
  revalidatePath("/admin/artworks")
  revalidatePath("/gallery")
  revalidatePath("/shop")
  revalidatePath("/")
  revalidatePath(`/paintings/${id}`)

  // Redirect to the artworks list
  redirect("/admin/artworks")
}

// Delete an artwork
export async function deleteArtwork(id: string) {
  // Ensure user is authenticated
  requireAuth()

  // Filter out the artwork to delete
  artworks = artworks.filter((artwork) => artwork.id !== id)

  // Revalidate paths to update the UI
  revalidatePath("/admin/artworks")
  revalidatePath("/gallery")
  revalidatePath("/shop")
  revalidatePath("/")

  // Return success
  return { success: true }
}

