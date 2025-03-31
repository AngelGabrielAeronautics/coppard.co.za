import { MainLayout } from "@/components/main-layout"
import { ColoredText } from "@/components/colored-text"

export default function AboutPage() {
  return (
    <MainLayout>
      <div className="container px-4 py-12 md:px-6 md:py-16 bg-ivory">
        <div className="max-w-3xl mx-auto space-y-8">
          <h1 className="text-3xl font-light tracking-wider sm:text-4xl md:text-5xl">About the Artist</h1>

          <div className="prose prose-stone dark:prose-invert max-w-none">
            <p>
              <ColoredText>
                My name is Dylan Coppard, and I'm an artist based in Jersey, Channel Islands. Born and raised in
                Johannesburg, South Africa, my journey into art began in childhood, marked by a natural talent and
                passion for creating. During my secondary school years, I studied fine art, graphic design, and
                sculpture, laying a foundational appreciation for artistic expression.
              </ColoredText>
            </p>

            <p>
              <ColoredText>
                After several years building a successful tourism-based business in Johannesburg, I faced significant
                setbacks when the COVID-19 pandemic struck in 2020. The impact on the tourism industry was devastating,
                prompting my family's relocation to Jersey, where we established our new home.
              </ColoredText>
            </p>

            <p>
              <ColoredText>
                In 2023, amidst ongoing challenges to revive my tourism business, I rediscovered my love for art as a
                therapeutic outlet. Encouraged by supportive viewers and admirers of my work, I transitioned towards
                professional artistry in 2025, embracing the opportunity to sell my artwork to provide for my family.
              </ColoredText>
            </p>

            <p>
              <ColoredText>
                My artistic focus centers around portraits and figurative works, deeply influenced by classical and
                medieval art periods, as well as the evocative portraits from the dawn of photography in the 1800s.
                Additionally, the elegance of 1950s-era depictions of women and the striking portraiture style of John
                Singer Sargent captivate my imagination.
              </ColoredText>
            </p>

            <h2 className="font-light tracking-wider">Artistic Influences</h2>

            <p>
              <ColoredText>
                Among my greatest artistic influences are John William Waterhouse, John Singer Sargent, Aaron
                Westerberg, and William-Adolphe Bouguereau, whose subject matter and techniques continually inspire my
                creations.
              </ColoredText>
            </p>

            <blockquote>
              <ColoredText>
                "Through my art, I strive to capture emotional depth and timeless beauty, inviting viewers to connect
                intimately with each piece."
              </ColoredText>
            </blockquote>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}

