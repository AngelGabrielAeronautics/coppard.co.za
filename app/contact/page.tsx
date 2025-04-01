"use client"
import { MainLayout } from "@/components/main-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { Mail } from "lucide-react"
import Image from "next/image"
import { ColoredText } from "@/components/colored-text"
import { submitContactForm } from "@/lib/actions"
import { useFormStatus } from "react-dom"

export default function ContactPage() {
  const { toast } = useToast()

  const handleSubmit = async (formData: FormData) => {
    const result = await submitContactForm(formData)

    if (result.success) {
      toast({
        title: "Message sent!",
        description: <ColoredText>Thank you for your message. I'll get back to you soon.</ColoredText>,
      })
      // Reset the form
      ;(document.getElementById("contact-form") as HTMLFormElement)?.reset()
    } else {
      toast({
        title: "Error",
        description: result.error || "Failed to send message. Please try again.",
        variant: "destructive",
      })
    }
  }

  function SubmitButton() {
    const { pending } = useFormStatus()

    return (
      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? "Sending..." : "Send Message"}
      </Button>
    )
  }

  return (
    <MainLayout>
      <div className="container px-4 py-12 md:px-6 md:py-16">
        <div className="grid gap-8 md:grid-cols-2">
          <div>
            <h1 className="text-3xl font-light tracking-wider sm:text-4xl">Get in Touch</h1>
            {/* Update the paragraph text to use ColoredText */}
            <p className="mt-4 text-muted-foreground">
              <ColoredText>
                Interested in a painting or have questions about commissioning a piece? Fill out the form or contact
                Dylan directly.
              </ColoredText>
            </p>

            <div className="mt-8 space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-muted-foreground" />
                <span>dylan@coppard.je</span>
              </div>

              {/* Jersey location information */}
              <div className="my-6 rounded-lg overflow-hidden shadow-md">
                <div className="relative w-full">
                  {/* Map and flag container */}
                  <div className="flex flex-col md:flex-row">
                    {/* Map of Jersey */}
                    <div className="relative w-full md:w-3/4 h-64 bg-ivory-darker">
                      <Image
                        src="/images/jersey-map.png"
                        alt="Map of Jersey, Channel Islands"
                        fill
                        className="object-contain"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                    </div>

                    {/* Flag of Jersey */}
                    <div className="relative w-full md:w-1/4 h-40 md:h-64 flex items-center justify-center p-4 bg-ivory-darker">
                      <div className="relative w-40 h-40 md:w-full md:h-full max-w-[180px] max-h-[200px]">
                        <Image
                          src="/images/jersey-flag.png"
                          alt="Flag of Jersey"
                          fill
                          className="object-contain"
                          sizes="180px"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="bg-ivory-darker p-2 text-center text-sm text-muted-foreground">
                    <span>Jersey, Channel Islands</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-lg border p-6">
            <form id="contact-form" action={handleSubmit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label htmlFor="first-name" className="text-sm font-medium">
                    First name
                  </label>
                  <Input id="first-name" name="first-name" required />
                </div>
                <div className="space-y-2">
                  <label htmlFor="last-name" className="text-sm font-medium">
                    Last name
                  </label>
                  <Input id="last-name" name="last-name" required />
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Email
                </label>
                <Input id="email" name="email" type="email" required />
              </div>
              <div className="space-y-2">
                <label htmlFor="subject" className="text-sm font-medium">
                  Subject
                </label>
                <Input id="subject" name="subject" required />
              </div>
              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium">
                  Message
                </label>
                <Textarea id="message" name="message" rows={5} required />
              </div>
              <SubmitButton />
            </form>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}

