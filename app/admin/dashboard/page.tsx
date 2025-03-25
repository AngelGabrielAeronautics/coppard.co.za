import Link from "next/link"
import { getArtworks } from "../actions"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Image, DollarSign, ShoppingCart } from "lucide-react"

export default async function DashboardPage() {
  const artworks = await getArtworks()

  // Calculate some stats
  const totalArtworks = artworks.length
  const availableArtworks = artworks.filter((artwork) => artwork.available).length
  const totalValue = artworks.reduce((sum, artwork) => sum + artwork.price, 0)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <Button asChild>
          <Link href="/admin/artworks/new">
            <Plus className="mr-2 h-4 w-4" />
            Add New Artwork
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Artworks</CardTitle>
            <Image className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalArtworks}</div>
            <p className="text-xs text-muted-foreground">{availableArtworks} available for sale</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">£{totalValue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">All artworks combined</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">For Sale</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{availableArtworks}</div>
            <p className="text-xs text-muted-foreground">
              {Math.round((availableArtworks / totalArtworks) * 100)}% of collection
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-bold tracking-tight">Recent Artworks</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {artworks.slice(0, 3).map((artwork) => (
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
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/admin/artworks/${artwork.id}/edit`}>Edit</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex justify-center">
          <Button variant="outline" asChild>
            <Link href="/admin/artworks">View All Artworks</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

