import Link from "next/link"
import { getArtworks } from "../actions"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Plus, Pencil } from "lucide-react"
import { DeleteArtworkButton } from "./delete-button"

export default async function ArtworksPage() {
  const artworks = await getArtworks()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Artworks</h1>
        <Button asChild>
          <Link href="/admin/artworks/new">
            <Plus className="mr-2 h-4 w-4" />
            Add New Artwork
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {artworks.map((artwork) => (
          <Card key={artwork.id}>
            <div className="aspect-square overflow-hidden">
              <img
                src={artwork.image || "/placeholder.svg"}
                alt={artwork.title}
                className="object-cover w-full h-full"
              />
            </div>
            <CardContent className="p-4">
              <h3 className="font-medium">{artwork.title}</h3>
              <p className="text-sm text-muted-foreground">{artwork.category}</p>
              <div className="flex items-center justify-between mt-2">
                <p className="font-medium">£{artwork.price}</p>
                <div className="flex gap-2">
                  <Button variant="outline" size="icon" asChild>
                    <Link href={`/admin/artworks/${artwork.id}/edit`}>
                      <Pencil className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
                    </Link>
                  </Button>
                  <DeleteArtworkButton id={artwork.id} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {artworks.length === 0 && (
        <div className="text-center py-12">
          <h2 className="text-xl font-medium">No artworks yet</h2>
          <p className="text-muted-foreground mt-2">Add your first artwork to get started</p>
          <Button className="mt-4" asChild>
            <Link href="/admin/artworks/new">
              <Plus className="mr-2 h-4 w-4" />
              Add New Artwork
            </Link>
          </Button>
        </div>
      )}
    </div>
  )
}

