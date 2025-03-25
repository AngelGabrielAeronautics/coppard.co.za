import Link from "next/link"
import Image from "next/image"

export default function GalleryPage() {
  return (
    <div className="container px-4 py-12 mx-auto md:px-6 md:py-16">
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">Gallery</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Explore my collection of oil paintings, each created with passion and attention to detail.
        </p>
      </div>

      {/* Gallery Filters */}
      <div className="flex flex-wrap items-center justify-center gap-2 mt-10">
        <button className="px-4 py-2 text-sm font-medium rounded-full bg-primary text-primary-foreground">
          All Works
        </button>
        <button className="px-4 py-2 text-sm font-medium rounded-full bg-muted text-muted-foreground hover:bg-muted/80">
          Landscapes
        </button>
        <button className="px-4 py-2 text-sm font-medium rounded-full bg-muted text-muted-foreground hover:bg-muted/80">
          Abstracts
        </button>
        <button className="px-4 py-2 text-sm font-medium rounded-full bg-muted text-muted-foreground hover:bg-muted/80">
          Still Life
        </button>
        <button className="px-4 py-2 text-sm font-medium rounded-full bg-muted text-muted-foreground hover:bg-muted/80">
          Wildlife
        </button>
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 gap-6 mt-10 sm:grid-cols-2 lg:grid-cols-3">
        {galleryItems.map((item) => (
          <Link
            key={item.id}
            href={`/paintings/${item.id}`}
            className="group overflow-hidden rounded-lg transition-all hover:shadow-lg"
          >
            <div className="aspect-[4/5] overflow-hidden bg-neutral-100">
              <Image
                src={item.image || "/placeholder.svg"}
                alt={item.title}
                width={480}
                height={600}
                className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <div className="p-4">
              <h3 className="text-xl font-medium">{item.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {item.year} • {item.medium}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">{item.dimensions}</p>
              {item.available ? (
                <p className="mt-2 font-medium">${item.price}</p>
              ) : (
                <p className="mt-2 font-medium text-muted-foreground">Sold</p>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

// Sample data - would be replaced with actual data from a database
const galleryItems = [
  {
    id: "limes",
    title: "Limes in Basket",
    year: "2023",
    medium: "Oil on canvas",
    dimensions: '8" × 8"',
    price: 375,
    available: true,
    category: "Still Life",
    image: "/images/limes.jpeg",
  },
  {
    id: "one-cherry",
    title: "One Cherry",
    year: "2023",
    medium: "Oil on canvas",
    dimensions: '6" × 6"',
    price: 300,
    available: true,
    category: "Still Life",
    image: "/images/one-cherry.jpeg",
  },
  {
    id: "two-cherries",
    title: "Two Cherries",
    year: "2023",
    medium: "Oil on canvas",
    dimensions: '6" × 6"',
    price: 325,
    available: true,
    category: "Still Life",
    image: "/images/two-cherries.jpeg",
  },
  {
    id: "blue-waxbill",
    title: "Blue Waxbill",
    year: "2023",
    medium: "Oil on canvas",
    dimensions: '6" × 6"',
    price: 350,
    available: true,
    category: "Wildlife",
    image: "/images/blue-waxbill.jpeg",
  },
  {
    id: "avocado-study",
    title: "Avocado Study",
    year: "2023",
    medium: "Oil on canvas",
    dimensions: '6" × 6"',
    price: 325,
    available: true,
    category: "Still Life",
    image: "/images/still-life-avocado.jpeg",
  },
  {
    id: "sunset-reflections",
    title: "Sunset Reflections",
    year: "2023",
    medium: "Oil on canvas",
    dimensions: '24" × 36"',
    price: 850,
    available: true,
    category: "Landscapes",
    image: "/placeholder.svg?height=600&width=480",
  },
  {
    id: "autumn-path",
    title: "Autumn Path",
    year: "2023",
    medium: "Oil on canvas",
    dimensions: '18" × 24"',
    price: 650,
    available: true,
    category: "Landscapes",
    image: "/placeholder.svg?height=600&width=480",
  },
  {
    id: "coastal-dreams",
    title: "Coastal Dreams",
    year: "2022",
    medium: "Oil on canvas",
    dimensions: '30" × 40"',
    price: 1200,
    available: true,
    category: "Landscapes",
    image: "/placeholder.svg?height=600&width=480",
  },
  {
    id: "abstract-emotions",
    title: "Abstract Emotions",
    year: "2022",
    medium: "Oil on canvas",
    dimensions: '24" × 24"',
    price: 750,
    available: true,
    category: "Abstracts",
    image: "/placeholder.svg?height=600&width=600",
  },
  {
    id: "summer-garden",
    title: "Summer Garden",
    year: "2021",
    medium: "Oil on canvas",
    dimensions: '16" × 20"',
    price: 550,
    available: false,
    category: "Still Life",
    image: "/placeholder.svg?height=600&width=480",
  },
  {
    id: "mountain-solitude",
    title: "Mountain Solitude",
    year: "2021",
    medium: "Oil on canvas",
    dimensions: '36" × 48"',
    price: 1500,
    available: true,
    category: "Landscapes",
    image: "/placeholder.svg?height=600&width=480",
  },
]

