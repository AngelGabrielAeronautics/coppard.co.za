"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Filter, ShoppingCart } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"

export default function ShopPage() {
  const [sortOption, setSortOption] = useState("featured")

  return (
    <div className="container px-4 py-12 mx-auto md:px-6 md:py-16">
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">Shop</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Browse and purchase original oil paintings to add to your collection.
        </p>
      </div>

      {/* Shop Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 mt-10">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Filter
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <SheetHeader>
              <SheetTitle>Filter Paintings</SheetTitle>
              <SheetDescription>Narrow down your search with these filters.</SheetDescription>
            </SheetHeader>
            <div className="py-6 space-y-6">
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Categories</h3>
                <div className="space-y-2">
                  {["Landscapes", "Abstracts", "Still Life", "Wildlife", "Figurative", "Nude Studies"].map(
                    (category) => (
                      <div key={category} className="flex items-center space-x-2">
                        <Checkbox id={category} />
                        <label
                          htmlFor={category}
                          className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {category}
                        </label>
                      </div>
                    ),
                  )}
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Size</h3>
                <div className="space-y-2">
                  {['Small (under 16")', 'Medium (16-30")', 'Large (over 30")'].map((size) => (
                    <div key={size} className="flex items-center space-x-2">
                      <Checkbox id={size} />
                      <label
                        htmlFor={size}
                        className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {size}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Price Range</h3>
                <div className="space-y-2">
                  {["Under £500", "£500-£1000", "£1000-£2000", "Over £2000"].map((price) => (
                    <div key={price} className="flex items-center space-x-2">
                      <Checkbox id={price} />
                      <label
                        htmlFor={price}
                        className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {price}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex justify-between">
              <Button variant="outline">Reset</Button>
              <Button>Apply Filters</Button>
            </div>
          </SheetContent>
        </Sheet>

        <Select value={sortOption} onValueChange={setSortOption}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="featured">Featured</SelectItem>
            <SelectItem value="newest">Newest</SelectItem>
            <SelectItem value="price-low">Price: Low to High</SelectItem>
            <SelectItem value="price-high">Price: High to Low</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Shop Grid */}
      <div className="grid grid-cols-1 gap-6 mt-8 sm:grid-cols-2 lg:grid-cols-3">
        {shopItems.map((item) => (
          <div
            key={item.id}
            className="group overflow-hidden rounded-lg border bg-card text-card-foreground shadow-sm transition-all hover:shadow-md"
          >
            <Link href={`/paintings/${item.id}`}>
              <div className="overflow-hidden bg-neutral-100" style={{ minHeight: "300px" }}>
                <Image
                  src={item.image || "/placeholder.svg"}
                  alt={item.title}
                  width={480}
                  height={600}
                  className="object-contain w-full h-full transition-transform duration-300 group-hover:scale-105"
                />
              </div>
            </Link>
            <div className="p-4">
              <Link href={`/paintings/${item.id}`}>
                <h3 className="text-xl font-medium">{item.title}</h3>
              </Link>
              <p className="mt-1 text-sm text-muted-foreground">{item.dimensions}</p>
              <div className="flex items-center justify-between mt-4">
                <p className="font-medium">£{item.price}</p>
                <Button size="sm" className="flex items-center gap-1">
                  <ShoppingCart className="h-4 w-4" />
                  Add to Cart
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Sample data - would be replaced with actual data from a database
const shopItems = [
  {
    id: "barn-owl",
    title: "Who",
    dimensions: '10" × 10"',
    price: 550,
    image: "/images/barn-owl.jpeg",
  },
  {
    id: "white-house",
    title: "White House by the Sea",
    dimensions: '12" × 16"',
    price: 675,
    image: "/images/white-house.jpeg",
  },
  {
    id: "sculpted-figure",
    title: "Sculpted Figure",
    dimensions: '12" × 24"',
    price: 950,
    image: "/images/sculpted-figure.jpeg",
  },
  {
    id: "sarahs-gift",
    title: "Sarah's Gift",
    dimensions: '8" × 8"',
    price: 950,
    image: "/images/sarahs-gift.jpeg",
  },
  {
    id: "robert-ford",
    title: "Robert Ford",
    dimensions: '12" × 24"',
    price: 850,
    image: "/images/robert-ford.jpeg",
  },
  {
    id: "pear",
    title: "Pear Study",
    dimensions: '6" × 6"',
    price: 325,
    image: "/images/pear.jpeg",
  },
  {
    id: "mirror-lake",
    title: "Mirror Lake Sunset",
    dimensions: '12" × 16"',
    price: 750,
    image: "/images/mirror-lake.jpeg",
  },
  {
    id: "little-red-apple",
    title: "Little Red Apple",
    dimensions: '12" × 16"',
    price: 650,
    image: "/images/little-red-apple.jpeg",
  },
  {
    id: "lemons",
    title: "Lemons in Sack",
    dimensions: '8" × 10"',
    price: 425,
    image: "/images/lemons.jpeg",
  },
  {
    id: "naartjies",
    title: "Naartjies in Silver Bowl",
    dimensions: '8" × 10"',
    price: 425,
    image: "/images/naartjies.jpeg",
  },
  {
    id: "limes",
    title: "Limes in Basket",
    dimensions: '8" × 8"',
    price: 375,
    image: "/images/limes.jpeg",
  },
  {
    id: "one-cherry",
    title: "One Cherry",
    dimensions: '6" × 6"',
    price: 300,
    image: "/images/one-cherry.jpeg",
  },
]

