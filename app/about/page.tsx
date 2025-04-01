import { MainLayout } from "@/components/main-layout"
import { ColoredText } from "@/components/colored-text"
import Image from "next/image"

export default function AboutPage() {
  return (
    <MainLayout>
      <div className="container px-4 py-12 md:px-6 md:py-16 bg-ivory">
        <div className="max-w-3xl mx-auto space-y-8">
          <h1 className="text-3xl font-light tracking-wider sm:text-4xl md:text-5xl">About the Artist</h1>

          <div className="space-y-6">
            <p className="text-base">
              <ColoredText>
                I'm an artist based in Jersey, Channel Islands. Born and raised in Johannesburg, South Africa, my
                journey into art began in childhood, marked by a natural talent and passion for creating. During my
                secondary school years, I studied fine art, graphic design, and sculpture, laying a foundational
                appreciation for artistic expression.
              </ColoredText>
            </p>

            <p className="text-base">
              <ColoredText>
                After several years building a successful tourism-based business in Johannesburg, I faced significant
                setbacks when the COVID-19 pandemic struck in 2020. The impact on the tourism industry was devastating,
                prompting my family's relocation to Jersey, where we established our new home.
              </ColoredText>
            </p>

            <p className="text-base">
              <ColoredText>
                In 2023, amidst ongoing challenges to revive my tourism business, I rediscovered my love for art as a
                therapeutic outlet. Encouraged by supportive viewers and admirers of my work, I transitioned towards
                professional artistry in 2025, embracing the opportunity to sell my artwork to provide for my family.
              </ColoredText>
            </p>

            <p className="text-base">
              <ColoredText>
                My artistic focus centers around portraits and figurative works, deeply influenced by classical and
                medieval art periods, as well as the evocative portraits from the dawn of photography in the 1800s.
                Additionally, the elegance of Gil Elvgren 1950s-era figures and the striking portraiture style of John
                Singer Sargent and William-Adolphe Bouguereau captivate my imagination. Among my other artistic
                influences are Aaron Westerberg, and Vladimir Volegov whose subject matter and techniques continually
                inspire my creations.
              </ColoredText>
            </p>

            <blockquote className="border-l-4 border-gray-300 pl-4 italic">
              <ColoredText>
                "Through my art, I strive to capture emotional depth and timeless beauty, inviting viewers to connect
                intimately with each piece."
              </ColoredText>
            </blockquote>

            <div className="mt-8">
              <p className="font-light tracking-wider text-xl mb-1">Dylan Coppard.</p>
              <div className="w-48">
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/D%20Coppard%20Fine%20Art%20Logo%20-%20middle-3NGLqWn0DLFEhvwI9L5PResNV8EOj5.png"
                  alt="D.Coppard Fine Art"
                  width={260}
                  height={65}
                  className="h-auto w-auto"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}

