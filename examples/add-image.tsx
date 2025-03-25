// Example of how to add and reference an image
import Image from "next/image"

export default function ArtworkDisplay() {
  return (
    <div className="artwork-container">
      {/* Using a regular img tag */}
      <img src="/images/landscape-1.png" alt="Sunset landscape oil painting" className="regular-image" />

      {/* Using Next.js Image component (recommended) */}
      <Image
        src="/images/landscape-1.png"
        alt="Sunset landscape oil painting"
        width={600}
        height={480}
        className="optimized-image"
      />
    </div>
  )
}

