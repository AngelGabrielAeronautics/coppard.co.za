"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Minus, Plus, ShoppingCart } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function PaintingDetailPage({ params }: { params: { id: string } }) {
  const [quantity, setQuantity] = useState(1)

  // In a real app, you would fetch the painting data based on the ID
  // For this example, we'll use a mock painting
  const painting = {
    id: params.id,
    title: "Sunset Reflections",
    description:
      "A vibrant sunset scene capturing the warm glow of evening light reflecting off a tranquil lake. The rich palette of oranges, purples, and blues creates a sense of peace and contemplation.",
    year: "2023",
    medium: "Oil on canvas",
    dimensions: '24" × 36"',
    price: 850,
    available: true,
    category: "Landscapes",
    image: "/placeholder.svg?height=800&width=640",
    additionalImages: [
      "/placeholder.svg?height=400&width=400",
      "/placeholder.svg?height=400&width=400",
      "/placeholder.svg?height=400&width=400",
    ],
    details:
      "This painting was created using high-quality oil paints on a premium cotton canvas. The sides are painted, so framing is optional. The painting comes varnished for protection and is signed on the front and back.",
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
          <div className="overflow-hidden rounded-lg bg-neutral-100" style={{ minHeight: "400px" }}>
            <img
              src={painting.image || "/placeholder.svg"}
              alt={painting.title}
              className="object-contain w-full h-full"
            />
          </div>
          <div className="grid grid-cols-3 gap-4">
            {painting.additionalImages.map((img, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-lg bg-neutral-100 cursor-pointer"
                style={{ height: "100px" }}
              >
                <img
                  src={img || "/placeholder.svg"}
                  alt={`${painting.title} detail ${index + 1}`}
                  className="object-contain w-full h-full"
                />
              </div>
            ))}
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

