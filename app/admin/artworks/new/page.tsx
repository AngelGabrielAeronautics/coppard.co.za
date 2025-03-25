import Link from "next/link"
import { createArtwork } from "../../actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"

export default function NewArtworkPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/artworks">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Add New Artwork</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Artwork Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={createArtwork} className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" name="title" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <select
                  id="category"
                  name="category"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  required
                >
                  <option value="">Select a category</option>
                  <option value="Landscapes">Landscapes</option>
                  <option value="Abstracts">Abstracts</option>
                  <option value="Still Life">Still Life</option>
                  <option value="Wildlife">Wildlife</option>
                  <option value="Figurative">Figurative</option>
                  <option value="Nude Studies">Nude Studies</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="year">Year</Label>
                <Input id="year" name="year" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="medium">Medium</Label>
                <Input id="medium" name="medium" placeholder="e.g., Oil on canvas" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dimensions">Dimensions</Label>
                <Input id="dimensions" name="dimensions" placeholder='e.g., 12" × 16"' />
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">Price (£)</Label>
                <Input id="price" name="price" type="number" min="0" step="0.01" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="image">Image URL</Label>
                <Input id="image" name="image" placeholder="/images/your-image.jpg" required />
                <p className="text-xs text-muted-foreground">
                  Enter the path to your image. In a real app, this would be an image upload.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="available">Availability</Label>
                <select
                  id="available"
                  name="available"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="true">Available for sale</option>
                  <option value="false">Sold</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" name="description" rows={4} placeholder="Describe your artwork..." />
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="details">Details</Label>
                <Textarea id="details" name="details" rows={3} placeholder="Materials, techniques, etc." />
              </div>

              <div className="space-y-2">
                <Label htmlFor="shipping">Shipping</Label>
                <Textarea id="shipping" name="shipping" rows={3} placeholder="Shipping information..." />
              </div>

              <div className="space-y-2">
                <Label htmlFor="returns">Returns</Label>
                <Textarea id="returns" name="returns" rows={3} placeholder="Return policy..." />
              </div>
            </div>

            <div className="flex justify-end gap-4">
              <Button type="button" variant="outline" asChild>
                <Link href="/admin/artworks">Cancel</Link>
              </Button>
              <Button type="submit">Create Artwork</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

