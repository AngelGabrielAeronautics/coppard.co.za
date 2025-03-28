export interface Painting {
  id: string
  title: string
  description: string
  imageUrl: string
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
}

