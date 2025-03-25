import Link from "next/link"
import Image from "next/image"
import { ArrowRight, ShoppingCart } from "lucide-react"

import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section - Gallery Wall Only */}
      <section className="relative w-full h-[80vh] bg-neutral-100 overflow-hidden">
        {/* Gallery Wall Background */}
        <div className="absolute inset-0 w-full h-full">
          <Image src="/images/gallery-wall.jpg" alt="Minimalist gallery space" fill className="object-cover" priority />
        </div>

        {/* Gallery Wall Artwork Overlay - Rearranged to match example */}
        <div className="absolute inset-0 w-full h-full">
          <div className="relative w-full h-full max-w-6xl mx-auto">
            {/* Top row - larger paintings */}

            {/* White House - top left (12" × 16") */}
            <div className="absolute left-[5%] top-[20%] w-[160px] shadow-xl drop-shadow-[0_10px_4px_rgba(0,0,0,0.4)] transition-all duration-500 hover:scale-105">
              <div style={{ aspectRatio: "12/16" }}>
                <Image
                  src="/images/white-house.jpeg"
                  alt="White House by the Sea"
                  width={160}
                  height={213}
                  className="object-contain w-full h-full"
                />
              </div>
            </div>

            {/* Mirror Lake - center left (12" × 16") */}
            <div className="absolute left-[24%] top-[20%] w-[160px] shadow-xl drop-shadow-[0_10px_4px_rgba(0,0,0,0.4)] transition-all duration-500 hover:scale-105">
              <div style={{ aspectRatio: "12/16" }}>
                <Image
                  src="/images/mirror-lake.jpeg"
                  alt="Mirror Lake Sunset"
                  width={160}
                  height={213}
                  className="object-contain w-full h-full"
                />
              </div>
            </div>

            {/* Little Red Apple - center (12" × 16") */}
            <div className="absolute left-[46%] top-[20%] w-[160px] shadow-xl drop-shadow-[0_10px_4px_rgba(0,0,0,0.4)] transition-all duration-500 hover:scale-105">
              <div style={{ aspectRatio: "12/16" }}>
                <Image
                  src="/images/little-red-apple.jpeg"
                  alt="Little Red Apple"
                  width={160}
                  height={213}
                  className="object-contain w-full h-full"
                />
              </div>
            </div>

            {/* Cherry group - right of center (both 6" × 6") */}
            <div className="absolute left-[67%] top-[20%] flex flex-col gap-3">
              {/* One Cherry */}
              <div className="w-[80px] shadow-xl drop-shadow-[0_10px_4px_rgba(0,0,0,0.4)] transition-all duration-500 hover:scale-105">
                <div style={{ aspectRatio: "1/1" }}>
                  <Image
                    src="/images/one-cherry.jpeg"
                    alt="One Cherry"
                    width={80}
                    height={80}
                    className="object-contain w-full h-full"
                  />
                </div>
              </div>

              {/* Two Cherries */}
              <div className="w-[80px] shadow-xl drop-shadow-[0_10px_4px_rgba(0,0,0,0.4)] transition-all duration-500 hover:scale-105">
                <div style={{ aspectRatio: "1/1" }}>
                  <Image
                    src="/images/two-cherries.jpeg"
                    alt="Two Cherries"
                    width={80}
                    height={80}
                    className="object-contain w-full h-full"
                  />
                </div>
              </div>
            </div>

            {/* Sculpted Figure - far right (12" × 24") */}
            <div className="absolute right-[5%] top-[15%] w-[140px] shadow-xl drop-shadow-[0_10px_4px_rgba(0,0,0,0.4)] transition-all duration-500 hover:scale-105">
              <div style={{ aspectRatio: "12/24" }}>
                <Image
                  src="/images/sculpted-figure.jpeg"
                  alt="Sculpted Figure"
                  width={140}
                  height={280}
                  className="object-contain w-full h-full"
                />
              </div>
            </div>

            {/* Second row - smaller paintings */}

            {/* Pear - bottom left (6" × 6") */}
            <div className="absolute left-[5%] bottom-[25%] w-[80px] shadow-xl drop-shadow-[0_10px_4px_rgba(0,0,0,0.4)] transition-all duration-500 hover:scale-105">
              <div style={{ aspectRatio: "1/1" }}>
                <Image
                  src="/images/pear.jpeg"
                  alt="Pear Study"
                  width={80}
                  height={80}
                  className="object-contain w-full h-full"
                />
              </div>
            </div>

            {/* Blue Waxbill - bottom left center (6" × 6") */}
            <div className="absolute left-[18%] bottom-[25%] w-[80px] shadow-xl drop-shadow-[0_10px_4px_rgba(0,0,0,0.4)] transition-all duration-500 hover:scale-105">
              <div style={{ aspectRatio: "1/1" }}>
                <Image
                  src="/images/blue-waxbill.jpeg"
                  alt="Blue Waxbill"
                  width={80}
                  height={80}
                  className="object-contain w-full h-full"
                />
              </div>
            </div>

            {/* Lemons - bottom center left (8" × 10") */}
            <div className="absolute left-[33%] bottom-[25%] w-[100px] shadow-xl drop-shadow-[0_10px_4px_rgba(0,0,0,0.4)] transition-all duration-500 hover:scale-105">
              <div style={{ aspectRatio: "8/10" }}>
                <Image
                  src="/images/lemons.jpeg"
                  alt="Lemons in Sack"
                  width={100}
                  height={125}
                  className="object-contain w-full h-full"
                />
              </div>
            </div>

            {/* Limes - bottom center (8" × 8") */}
            <div className="absolute left-[48%] bottom-[25%] w-[100px] shadow-xl drop-shadow-[0_10px_4px_rgba(0,0,0,0.4)] transition-all duration-500 hover:scale-105">
              <div style={{ aspectRatio: "1/1" }}>
                <Image
                  src="/images/limes.jpeg"
                  alt="Limes in Basket"
                  width={100}
                  height={100}
                  className="object-contain w-full h-full"
                />
              </div>
            </div>

            {/* Naartjies - bottom center right (8" × 10") */}
            <div className="absolute left-[63%] bottom-[25%] w-[100px] shadow-xl drop-shadow-[0_10px_4px_rgba(0,0,0,0.4)] transition-all duration-500 hover:scale-105">
              <div style={{ aspectRatio: "8/10" }}>
                <Image
                  src="/images/naartjies.jpeg"
                  alt="Naartjies in Silver Bowl"
                  width={100}
                  height={125}
                  className="object-contain w-full h-full"
                />
              </div>
            </div>

            {/* Barn Owl - bottom right (10" × 10") */}
            <div className="absolute right-[5%] bottom-[25%] w-[120px] shadow-xl drop-shadow-[0_10px_4px_rgba(0,0,0,0.4)] transition-all duration-500 hover:scale-105">
              <div style={{ aspectRatio: "1/1" }}>
                <Image
                  src="/images/barn-owl.jpeg"
                  alt="Who"
                  width={120}
                  height={120}
                  className="object-contain w-full h-full"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Artistic Expressions Section - Moved below the hero */}
      <section className="py-16 bg-white">
        <div className="container px-4 mx-auto text-center md:px-6">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">Artistic Expressions in Oil</h1>
          <p className="max-w-[42rem] mx-auto mt-6 text-lg text-muted-foreground">
            Discover unique oil paintings that capture emotion, light, and beauty. Each piece tells a story and brings a
            touch of artistry to your space.
          </p>
          <div className="flex flex-col gap-4 mt-8 sm:flex-row justify-center">
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
      <section className="py-16 bg-neutral-50">
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
                className="group overflow-hidden rounded-lg transition-all hover:shadow-lg bg-white"
              >
                <div className="overflow-hidden bg-neutral-100" style={{ minHeight: "300px" }}>
                  <Image
                    src={painting.image || "/placeholder.svg"}
                    alt={painting.title}
                    width={480}
                    height={600}
                    className="object-contain w-full h-full transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-xl font-medium">{painting.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{painting.dimensions}</p>
                  <p className="mt-2 font-medium">£{painting.price}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Artist Statement */}
      <section className="py-16 bg-white">
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
]

