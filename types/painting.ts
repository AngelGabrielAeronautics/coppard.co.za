export interface Painting {
  id: string
  title: string
  description: string
  imageUrl: string
  imageVersions?: string[] // Array of additional image URLs
  dimensions: string
  medium: string
  genre?: string
  year: number
  price?: number
  sold: boolean
  featured: boolean
  inProgress?: boolean
  referenceCredit?: string
  createdAt: Date
  ratePerSquareInch?: number // Add this field
  materialCosts?: number // Add this field
}

