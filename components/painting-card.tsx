import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Painting } from "@/types/painting"

// Import the ColoredText component
import { ColoredText } from "@/components/colored-text"

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

interface PaintingCardProps {
  painting: Painting
}

export function PaintingCard({ painting }: PaintingCardProps) {
  // Get the aspect ratio from the dimensions
  const aspectRatio = getAspectRatio(painting.dimensions)

  return (
    <Link href={`/painting/${painting.id}`}>
      <Card className="overflow-hidden transition-all hover:shadow-lg h-full flex flex-col bg-ivory">
        <div className="relative w-full bg-ivory">
          <div className="w-full" style={{ paddingTop: `${(1 / aspectRatio) * 100}%` }}>
            <Image
              src={painting.imageUrl || "/placeholder.svg?height=800&width=600"}
              alt={painting.title}
              fill
              className="object-contain"
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
            {painting.inProgress && (
              <Badge
                variant="secondary"
                className="rounded-none rounded-br-md pointer-events-none px-3 py-1 bg-amber-200 text-amber-800 mt-1 hover:bg-amber-200"
              >
                In Progress
              </Badge>
            )}
          </div>
        </div>
        <CardContent className="p-4 flex-grow">
          <h3 className="font-light tracking-wider text-lg">{painting.title}</h3>
          <p className="text-sm text-muted-foreground">
            <ColoredText>
              {painting.medium}, {painting.year}
            </ColoredText>
          </p>
        </CardContent>
        <CardFooter className="p-4 pt-0 flex justify-between">
          <p className="text-sm font-light tracking-wider">{painting.dimensions}</p>
          {painting.price && (
            <p className={`font-medium ${painting.sold ? "line-through text-muted-foreground" : ""}`}>
              £{painting.price}
            </p>
          )}
        </CardFooter>
      </Card>
    </Link>
  )
}

