export interface Artwork {
  id: string
  title: string
  description: string
  year: string
  medium: string
  dimensions: string
  price: number
  available: boolean
  category: string
  image: string
  additionalImages?: string[]
  details?: string
  shipping?: string
  returns?: string
  createdAt: number
  updatedAt: number
}

export type ArtworkFormData = Omit<Artwork, "id" | "createdAt" | "updatedAt">

