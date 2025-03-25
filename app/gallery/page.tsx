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
        <button className="px-4 py-2 text-sm font-medium rounded-full bg-muted text-muted-foreground hover:bg-muted/80">
          Figurative
        </button>
        <button className="px-4 py-2 text-sm font-medium rounded-full bg-muted text-muted-foreground hover:bg-muted/80">
          Nude Studies
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
            <div className="overflow-hidden bg-neutral-100" style={{ minHeight: "300px" }}>
              <Image
                src={item.image || "/placeholder.svg"}
                alt={item.title}
                width={480}
                height={600}
                className="object-contain w-full h-full transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <div className="p-4">
              <h3 className="text-xl font-medium">{item.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {item.year} • {item.medium}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">{item.dimensions}</p>
              {item.available ? (
                <p className="mt-2 font-medium">£{item.price}</p>
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
    id: "barn-owl",
    title: "Who",
    year: "2023",
    medium: "Oil on canvas",
    dimensions: '10" × 10"',
    price: 550,
    available: true,
    category: "Wildlife",
    image: "/images/barn-owl.jpeg",
  },
  {
    id: "white-house",
    title: "White House by the Sea",
    year: "2023",
    medium: "Oil on canvas",
    dimensions: '12" × 16"',
    price: 675,
    available: true,
    category: "Landscapes",
    image: "/images/white-house.jpeg",
  },
  {
    id: "sculpted-figure",
    title: "Sculpted Figure",
    year: "2023",
    medium: "Oil on canvas",
    dimensions: '12" × 24"',
    price: 950,
    available: true,
    category: "Nude Studies",
    image: "/images/sculpted-figure.jpeg",
  },
  {
    id: "sarahs-gift",
    title: "Sarah's Gift",
    year: "2023",
    medium: "Oil on canvas",
    dimensions: '8" × 8"',
    price: 950,
    available: true,
    category: "Nude Studies",
    image: "/images/sarahs-gift.jpeg",
  },
  {
    id: "robert-ford",
    title: "Robert Ford",
    year: "2023",
    medium: "Oil on canvas",
    dimensions: '12" × 24"',
    price: 850,
    available: true,
    category: "Figurative",
    image: "/images/robert-ford.jpeg",
  },
  {
    id: "pear",
    title: "Pear Study",
    year: "2023",
    medium: "Oil on canvas",
    dimensions: '6" × 6"',
    price: 325,
    available: true,
    category: "Still Life",
    image: "/images/pear.jpeg",
  },
  {
    id: "mirror-lake",
    title: "Mirror Lake Sunset",
    year: "2023",
    medium: "Oil on canvas",
    dimensions: '12" × 16"',
    price: 750,
    available: true,
    category: "Landscapes",
    image: "/images/mirror-lake.jpeg",
  },
  {
    id: "little-red-apple",
    title: "Little Red Apple",
    year: "2023",
    medium: "Oil on canvas",
    dimensions: '12" × 16"',
    price: 650,
    available: true,
    category: "Figurative",
    image: "/images/little-red-apple.jpeg",
  },
  {
    id: "lemons",
    title: "Lemons in Sack",
    year: "2023",
    medium: "Oil on canvas",
    dimensions: '8" × 10"',
    price: 425,
    available: true,
    category: "Still Life",
    image: "/images/lemons.jpeg",
  },
  {
    id: "naartjies",
    title: "Naartjies in Silver Bowl",
    year: "2023",
    medium: "Oil on canvas",
    dimensions: '8" × 10"',
    price: 425,
    available: true,
    category: "Still Life",
    image: "/images/naartjies.jpeg",
  },
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
]

