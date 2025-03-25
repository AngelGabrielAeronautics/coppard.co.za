import Link from "next/link"
import Image from "next/image"
import { ArrowRight, ShoppingCart } from "lucide-react"

import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative w-full h-[70vh] bg-neutral-100">
        <div className="container flex flex-col items-center justify-center h-full px-4 py-16 mx-auto text-center md:px-6 lg:py-20">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">Artistic Expressions in Oil</h1>
          <p className="max-w-[42rem] mt-6 text-lg text-muted-foreground">
            Discover unique oil paintings that capture emotion, light, and beauty. Each piece tells a story and brings a
            touch of artistry to your space.
          </p>
          <div className="flex flex-col gap-4 mt-8 sm:flex-row">
            <Button asChild size="lg">
              <Link href="/gallery">
                Explore Gallery <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/shop">
                Shop Paintings <ShoppingCart className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Works */}
      <section className="py-16 bg-white">
        <div className="container px-4 mx-auto md:px-6">
          <div className="flex flex-col items-center justify-between gap-4 mb-10 md:flex-row">
            <h2 className="text-3xl font-bold tracking-tight">Featured Works</h2>
            <Button asChild variant="ghost">
              <Link href="/gallery">
                View All <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredPaintings.map((painting) => (
              <Link
                key={painting.id}
                href={`/paintings/${painting.id}`}
                className="group overflow-hidden rounded-lg transition-all hover:shadow-lg"
              >
                <div className="aspect-[4/5] overflow-hidden bg-neutral-100">
                  <Image
                    src={painting.image || "/placeholder.svg"}
                    alt={painting.title}
                    width={480}
                    height={600}
                    className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-xl font-medium">{painting.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{painting.dimensions}</p>
                  <p className="mt-2 font-medium">${painting.price}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Artist Statement */}
      <section className="py-16 bg-neutral-50">
        <div className="container grid items-center gap-6 px-4 mx-auto md:px-6 lg:grid-cols-2 lg:gap-10">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">About the Artist</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              I create oil paintings that explore the interplay of light, color, and emotion. My work is inspired by
              both natural landscapes and inner emotional states, seeking to create a bridge between the physical world
              and our perception of it.
            </p>
            <Button asChild className="mt-6" variant="outline">
              <Link href="/about">
                Read More <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="overflow-hidden rounded-lg bg-neutral-100 aspect-square">
            <img
              src="/placeholder.svg?height=600&width=600"
              alt="Artist in studio"
              className="object-cover w-full h-full"
            />
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container px-4 mx-auto text-center md:px-6">
          <h2 className="text-3xl font-bold tracking-tight">Stay Updated</h2>
          <p className="max-w-[42rem] mx-auto mt-4 text-primary-foreground/80">
            Subscribe to receive updates on new paintings, exhibitions, and special offers.
          </p>
          <form className="flex flex-col max-w-md gap-2 mx-auto mt-6 sm:flex-row">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex h-10 w-full rounded-md border border-primary-foreground/20 bg-primary-foreground/10 px-3 py-2 text-sm placeholder:text-primary-foreground/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
            <Button type="submit" variant="secondary">
              Subscribe
            </Button>
          </form>
        </div>
      </section>
    </div>
  )
}

// Sample data - would be replaced with actual data from a database
const featuredPaintings = [
  {
    id: "limes",
    title: "Limes in Basket",
    dimensions: '8" × 8"',
    price: 375,
    image: "/images/limes.jpeg",
  },
  {
    id: "two-cherries",
    title: "Two Cherries",
    dimensions: '6" × 6"',
    price: 325,
    image: "/images/two-cherries.jpeg",
  },
  {
    id: "blue-waxbill",
    title: "Blue Waxbill",
    dimensions: '6" × 6"',
    price: 350,
    image: "/images/blue-waxbill.jpeg",
  },
]

