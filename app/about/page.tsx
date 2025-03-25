import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

export default function AboutPage() {
  return (
    <div className="container px-4 py-12 mx-auto md:px-6 md:py-16">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">About the Artist</h1>

        <div className="mt-8 overflow-hidden rounded-lg bg-neutral-100">
          <img
            src="/placeholder.svg?height=600&width=1200"
            alt="Artist in studio"
            className="object-cover w-full h-64 sm:h-80 md:h-96"
          />
        </div>

        <div className="mt-8 space-y-6">
          <p>
            Hello, I'm D. Coppard, an oil painter based in [Location]. My journey as an artist began over 15 years ago
            when I first discovered the rich textures and luminous qualities that oil paints can create.
          </p>

          <p>
            My work explores the interplay between light, color, and emotion. I'm particularly drawn to landscapes and
            natural scenes, finding endless inspiration in the way light transforms ordinary moments into extraordinary
            visual experiences.
          </p>

          <p>
            Each painting begins with direct observation—whether it's a plein air study or detailed reference
            photographs I've taken. I then develop these initial impressions in my studio, focusing on capturing not
            just the visual elements of a scene, but the feeling and atmosphere it evokes.
          </p>

          <h2 className="mt-10 text-2xl font-bold tracking-tight">Artist Statement</h2>
          <p>
            In my work, I seek to create a bridge between the physical world and our perception of it. I believe that a
            successful painting doesn't merely represent what we see, but reveals something about how we see and
            experience our surroundings.
          </p>

          <p>
            Oil paint, with its depth, versatility, and luminosity, allows me to build layers of color and texture that
            mirror the complexity of both landscapes and emotional states. My process involves a balance between careful
            observation and intuitive response, between planning and spontaneity.
          </p>

          <p>
            Through my paintings, I invite viewers to pause and reconnect with the beauty that surrounds us daily but
            often goes unnoticed in our busy lives. I hope my work encourages a moment of contemplation and perhaps a
            renewed appreciation for the natural world.
          </p>

          <Separator className="my-10" />

          <h2 className="text-2xl font-bold tracking-tight">Education & Training</h2>
          <ul className="mt-4 space-y-2 list-disc list-inside text-muted-foreground">
            <li>BFA in Fine Arts, [University Name], [Year]</li>
            <li>Master Classes with [Notable Artist], [Year]</li>
            <li>Residency at [Art Center/Institution], [Year]</li>
          </ul>

          <h2 className="mt-8 text-2xl font-bold tracking-tight">Exhibitions</h2>
          <ul className="mt-4 space-y-2 list-disc list-inside text-muted-foreground">
            <li>"[Exhibition Title]" - [Gallery Name], [Location], [Year]</li>
            <li>"[Exhibition Title]" - [Gallery Name], [Location], [Year]</li>
            <li>"[Exhibition Title]" - [Gallery Name], [Location], [Year]</li>
            <li>"[Exhibition Title]" - [Gallery Name], [Location], [Year]</li>
          </ul>

          <h2 className="mt-8 text-2xl font-bold tracking-tight">Awards & Recognition</h2>
          <ul className="mt-4 space-y-2 list-disc list-inside text-muted-foreground">
            <li>[Award Name], [Organization], [Year]</li>
            <li>[Award Name], [Organization], [Year]</li>
            <li>Featured in [Publication/Magazine], [Year]</li>
          </ul>

          <div className="flex justify-center mt-12">
            <Button asChild size="lg">
              <a href="/contact">Get in Touch</a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

