"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Minus, Plus, ShoppingCart } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function LittleRedApplePage() {
  const [quantity, setQuantity] = useState(1)

  const painting = {
    id: "little-red-apple",
    title: "Little Red Apple",
    description:
      "A haunting and evocative figurative painting depicting a figure in a flowing white dress or robe with a white head covering, holding a single bright red apple. Set against a dark olive-green background, the painting creates a powerful sense of mystery and symbolism. The stark contrast between the ethereal white figure and the vivid red apple draws the viewer's eye and invites contemplation about innocence, temptation, and the human condition. The figure's face remains obscured, adding to the enigmatic quality of the work.",
    year: "2023",
    medium: "Oil on canvas",
    dimensions: '12" × 16"',
    price: 650,
    available: true,
    category: "Figurative",
    image: "/images/little-red-apple.jpeg",
    additionalImages: ["/images/little-red-apple.jpeg"],
    details:
      "This painting was created using high-quality oil paints on a premium cotton canvas. The sides are painted, so framing is optional. The painting comes varnished for protection and is signed on the front.",
    shipping:
      "Carefully packaged and shipped with tracking. Please allow 1-2 weeks for delivery. International shipping available at additional cost.",
    returns:
      "I want you to be completely satisfied with your purchase. If you're not happy with your painting, you may return it within 14 days for a full refund (excluding shipping costs).",
  }

  const incrementQuantity = () => setQuantity((prev) => prev + 1)
  const decrementQuantity = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1))

  return (
    <div className="container px-4 py-12 mx-auto md:px-6 md:py-16">
      <Link
        href="/gallery"
        className="inline-flex items-center mb-8 text-sm font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Gallery
      </Link>

      <div className="grid gap-8 md:grid-cols-2 lg:gap-12">
        {/* Painting Image */}
        <div className="space-y-4">
          <div className="overflow-hidden rounded-lg bg-neutral-100" style={{ minHeight: "500px" }}>
            <Image
              src={painting.image || "/placeholder.svg"}
              alt={painting.title}
              width={600}
              height={800}
              className="object-contain w-full h-full"
            />
          </div>
        </div>

        {/* Painting Details */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{painting.title}</h1>
          <p className="mt-2 text-xl font-medium">£{painting.price}</p>

          <div className="mt-6 space-y-2 text-sm text-muted-foreground">
            <p>
              <span className="font-medium text-foreground">Year:</span> {painting.year}
            </p>
            <p>
              <span className="font-medium text-foreground">Medium:</span> {painting.medium}
            </p>
            <p>
              <span className="font-medium text-foreground">Dimensions:</span> {painting.dimensions}
            </p>
            <p>
              <span className="font-medium text-foreground">Category:</span> {painting.category}
            </p>
          </div>

          <p className="mt-6">{painting.description}</p>

          {painting.available ? (
            <div className="mt-8 space-y-6">
              <div className="flex items-center">
                <Button variant="outline" size="icon" onClick={decrementQuantity} disabled={quantity <= 1}>
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-12 text-center">{quantity}</span>
                <Button variant="outline" size="icon" onClick={incrementQuantity}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              <Button className="w-full" size="lg">
                <ShoppingCart className="mr-2 h-5 w-5" />
                Add to Cart
              </Button>
            </div>
          ) : (
            <div className="p-4 mt-8 text-center rounded-lg bg-muted">
              <p className="font-medium">This painting has been sold</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Please check out my other available works or contact me for commission inquiries.
              </p>
            </div>
          )}

          <Separator className="my-8" />

          <Tabs defaultValue="details">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="shipping">Shipping</TabsTrigger>
              <TabsTrigger value="returns">Returns</TabsTrigger>
            </TabsList>
            <TabsContent value="details" className="mt-4 text-sm">
              {painting.details}
            </TabsContent>
            <TabsContent value="shipping" className="mt-4 text-sm">
              {painting.shipping}
            </TabsContent>
            <TabsContent value="returns" className="mt-4 text-sm">
              {painting.returns}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

