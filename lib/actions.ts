"use server"

import sgMail from "@sendgrid/mail"
import { revalidatePath } from "next/cache"
import { z } from "zod"

// Initialize SendGrid with your API key
sgMail.setApiKey(process.env.SENDGRID_API_KEY || "")

// Email to receive form submissions
const ADMIN_EMAIL = "dylan@coppard.je"
const FROM_EMAIL = "noreply@coppard.je" // This should be verified in SendGrid

// Schema for contact form
const contactFormSchema = z.object({
  "first-name": z.string().min(1, "First name is required"),
  "last-name": z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  subject: z.string().min(1, "Subject is required"),
  message: z.string().min(1, "Message is required"),
})

// Schema for inquiry form
const inquiryFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  message: z.string().min(1, "Message is required"),
  paintingId: z.string(),
  paintingTitle: z.string(),
  paintingDetails: z.string(),
})

// Schema for offer form
const offerFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  offerAmount: z.string().min(1, "Offer amount is required"),
  comments: z.string().optional(),
  paintingId: z.string(),
  paintingTitle: z.string(),
  paintingDetails: z.string(),
})

// Contact form submission
export async function submitContactForm(formData: FormData) {
  try {
    // Validate form data
    const validatedFields = contactFormSchema.parse({
      "first-name": formData.get("first-name"),
      "last-name": formData.get("last-name"),
      email: formData.get("email"),
      subject: formData.get("subject"),
      message: formData.get("message"),
    })

    // Prepare email content
    const msg = {
      to: ADMIN_EMAIL,
      from: FROM_EMAIL,
      subject: `New Contact Form: ${validatedFields.subject}`,
      text: `
Name: ${validatedFields["first-name"]} ${validatedFields["last-name"]}
Email: ${validatedFields.email}
Subject: ${validatedFields.subject}

Message:
${validatedFields.message}
      `,
      html: `
<h2>New Contact Form Submission</h2>
<p><strong>Name:</strong> ${validatedFields["first-name"]} ${validatedFields["last-name"]}</p>
<p><strong>Email:</strong> ${validatedFields.email}</p>
<p><strong>Subject:</strong> ${validatedFields.subject}</p>
<p><strong>Message:</strong></p>
<p>${validatedFields.message.replace(/\n/g, "<br>")}</p>
      `,
    }

    // Send email
    await sgMail.send(msg)

    // Revalidate the contact page
    revalidatePath("/contact")

    return { success: true }
  } catch (error) {
    console.error("Error sending contact form:", error)
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message }
    }
    return { success: false, error: "Failed to send message. Please try again." }
  }
}

// Painting inquiry submission
export async function submitInquiry(formData: FormData) {
  try {
    // Validate form data
    const validatedFields = inquiryFormSchema.parse({
      name: formData.get("name"),
      email: formData.get("email"),
      message: formData.get("message"),
      paintingId: formData.get("paintingId"),
      paintingTitle: formData.get("paintingTitle"),
      paintingDetails: formData.get("paintingDetails"),
    })

    // Prepare email content
    const msg = {
      to: ADMIN_EMAIL,
      from: FROM_EMAIL,
      subject: `Painting Inquiry: ${validatedFields.paintingTitle}`,
      text: `
Painting Inquiry

Painting: ${validatedFields.paintingTitle} (ID: ${validatedFields.paintingId})
Details: ${validatedFields.paintingDetails}

Name: ${validatedFields.name}
Email: ${validatedFields.email}

Message:
${validatedFields.message}
      `,
      html: `
<h2>New Painting Inquiry</h2>
<div style="margin-bottom: 20px; padding: 15px; background-color: #f2efe7; border-radius: 5px;">
  <p><strong>Painting:</strong> ${validatedFields.paintingTitle}</p>
  <p><strong>Details:</strong> ${validatedFields.paintingDetails}</p>
</div>
<p><strong>Name:</strong> ${validatedFields.name}</p>
<p><strong>Email:</strong> ${validatedFields.email}</p>
<p><strong>Message:</strong></p>
<p>${validatedFields.message.replace(/\n/g, "<br>")}</p>
      `,
    }

    // Send email
    await sgMail.send(msg)

    return { success: true }
  } catch (error) {
    console.error("Error sending inquiry:", error)
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message }
    }
    return { success: false, error: "Failed to send inquiry. Please try again." }
  }
}

// Painting offer submission
export async function submitOffer(formData: FormData) {
  try {
    // Validate form data
    const validatedFields = offerFormSchema.parse({
      name: formData.get("name"),
      email: formData.get("email"),
      offerAmount: formData.get("offerAmount"),
      comments: formData.get("comments") || "",
      paintingId: formData.get("paintingId"),
      paintingTitle: formData.get("paintingTitle"),
      paintingDetails: formData.get("paintingDetails"),
    })

    // Prepare email content
    const msg = {
      to: ADMIN_EMAIL,
      from: FROM_EMAIL,
      subject: `Offer for Painting: ${validatedFields.paintingTitle}`,
      text: `
Painting Offer

Painting: ${validatedFields.paintingTitle} (ID: ${validatedFields.paintingId})
Details: ${validatedFields.paintingDetails}

Name: ${validatedFields.name}
Email: ${validatedFields.email}
Offer Amount: £${validatedFields.offerAmount}

Comments:
${validatedFields.comments}
      `,
      html: `
<h2>New Painting Offer</h2>
<div style="margin-bottom: 20px; padding: 15px; background-color: #f2efe7; border-radius: 5px;">
  <p><strong>Painting:</strong> ${validatedFields.paintingTitle}</p>
  <p><strong>Details:</strong> ${validatedFields.paintingDetails}</p>
</div>
<p><strong>Name:</strong> ${validatedFields.name}</p>
<p><strong>Email:</strong> ${validatedFields.email}</p>
<p><strong>Offer Amount:</strong> £${validatedFields.offerAmount}</p>
<p><strong>Comments:</strong></p>
<p>${validatedFields.comments.replace(/\n/g, "<br>")}</p>
      `,
    }

    // Send email
    await sgMail.send(msg)

    return { success: true }
  } catch (error) {
    console.error("Error sending offer:", error)
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message }
    }
    return { success: false, error: "Failed to submit offer. Please try again." }
  }
}

