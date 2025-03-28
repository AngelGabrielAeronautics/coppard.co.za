import { MainLayout } from "@/components/main-layout"
import { ColoredText } from "@/components/colored-text"

export default function AboutPage() {
  return (
    <MainLayout>
      <div className="container px-4 py-12 md:px-6 md:py-16 bg-ivory">
        <div className="max-w-3xl mx-auto space-y-8">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">About the Artist</h1>

          <div className="prose prose-stone dark:prose-invert max-w-none">
            <p>
              <ColoredText>
                Dylan Coppard is a contemporary oil painter known for capturing the essence of light and emotion in
                their work. With a background in traditional techniques and a passion for exploring new artistic
                boundaries, Dylan creates pieces that resonate with viewers on a deep emotional level.
              </ColoredText>
            </p>

            <p>
              <ColoredText>
                Having studied at prestigious art institutions and exhibited in galleries across the country, Dylan has
                developed a distinctive style that blends classical techniques with modern sensibilities. Each painting
                is a labor of love, often taking weeks or months to complete as layers of oil paint are carefully
                applied and developed.
              </ColoredText>
            </p>

            <p>
              <ColoredText>
                The artist draws inspiration from nature, human connections, and the interplay of light and shadow.
                Through careful observation and technical mastery, Dylan creates works that invite viewers to pause,
                reflect, and connect with the deeper meanings embedded in each piece.
              </ColoredText>
            </p>

            <h2>Artist Statement</h2>

            <blockquote>
              <ColoredText>
                "My work explores the boundaries between reality and perception, using oil paint to capture fleeting
                moments of beauty and truth. I believe that art has the power to transform how we see the world around
                us, revealing the extraordinary within the ordinary."
              </ColoredText>
            </blockquote>

            <p>
              <ColoredText>
                When not in the studio, Dylan can be found teaching workshops, exploring nature for new inspiration, or
                experimenting with new techniques and approaches to the timeless medium of oil painting.
              </ColoredText>
            </p>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}

