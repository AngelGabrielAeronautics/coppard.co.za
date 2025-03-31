import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Helper function to get aspect ratio from dimensions
export function getAspectRatio(dimensionsStr: string): number {
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

