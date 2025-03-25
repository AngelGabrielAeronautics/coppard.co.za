"use client"

import type React from "react"

import { useState } from "react"
import { Mail, MapPin, Phone } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1500))

    toast({
      title: "Message Sent",
      description: "Thank you for your message. I'll get back to you soon!",
    })

    setFormData({
      name: "",
      email: "",
      subject: "",
      message: "",
    })

    setIsSubmitting(false)
  }

  return (
    <div className="container px-4 py-12 mx-auto md:px-6 md:py-16">
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">Contact</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Get in touch for inquiries about available paintings, commissions, or exhibitions.
        </p>
      </div>

      <div className="grid gap-8 mt-12 md:grid-cols-3">
        <Card>
          <CardContent className="flex flex-col items-center p-6 text-center">
            <Mail className="w-10 h-10 mb-4 text-primary" />
            <h3 className="text-lg font-medium">Email</h3>
            <p className="mt-2 text-sm text-muted-foreground">artist@example.com</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex flex-col items-center p-6 text-center">
            <Phone className="w-10 h-10 mb-4 text-primary" />
            <h3 className="text-lg font-medium">Phone</h3>
            <p className="mt-2 text-sm text-muted-foreground">(555) 123-4567</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex flex-col items-center p-6 text-center">
            <MapPin className="w-10 h-10 mb-4 text-primary" />
            <h3 className="text-lg font-medium">Studio</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              By appointment only
              <br />
              123 Art Street, City, State
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="max-w-2xl mx-auto mt-12">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="subject">Subject</Label>
            <Input id="subject" name="subject" value={formData.subject} onChange={handleChange} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea id="message" name="message" rows={6} value={formData.message} onChange={handleChange} required />
          </div>

          <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
            {isSubmitting ? "Sending..." : "Send Message"}
          </Button>
        </form>
      </div>
    </div>
  )
}

