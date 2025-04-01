"use server"

import { revalidatePath } from "next/cache"

// Email to receive form submissions
const ADMIN_EMAIL = "dylan@coppard.je"
const FROM_EMAIL = "noreply@coppard.je" // This should be verified in SendGrid

// SendGrid API key from environment variable
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY

// Contact form submission
export async function submitContactForm(formData: FormData) {
  try {
    // Extract form data
    const firstName = formData.get("first-name") as string
    const lastName = formData.get("last-name") as string
    const email = formData.get("email") as string
    const subject = formData.get("subject") as string
    const message = formData.get("message") as string

    // Validate required fields
    if (!firstName || !lastName || !email || !subject || !message) {
      return { success: false, error: "All fields are required" }
    }

    // Prepare email content
    const emailData = {
      personalizations: [
        {
          to: [{ email: ADMIN_EMAIL }],
          subject: `New Contact Form: ${subject}`,
        },
      ],
      from: { email: FROM_EMAIL },
      content: [
        {
          type: "text/html",
          value: `
            <h2>New Contact Form Submission</h2>
            <p><strong>Name:</strong> ${firstName} ${lastName}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Subject:</strong> ${subject}</p>
            <p><strong>Message:</strong></p>
            <p>${message.replace(/\n/g, "<br>")}</p>
          `,
        },
      ],
    }

    // Send email using SendGrid API directly
    const response = await fetch("https://api.sendgrid.com/v3/mail/send", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${SENDGRID_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(emailData),
    })

    if (!response.ok) {
      console.error("SendGrid API error:", await response.text())
      return { success: false, error: "Failed to send email" }
    }

    // Revalidate the contact page
    revalidatePath("/contact")

    return { success: true }
  } catch (error) {
    console.error("Error sending contact form:", error)
    return { success: false, error: "Failed to send message. Please try again." }
  }
}

// Painting inquiry submission
export async function submitInquiry(formData: FormData) {
  try {
    // Extract form data
    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const message = formData.get("message") as string
    const paintingId = formData.get("paintingId") as string
    const paintingTitle = formData.get("paintingTitle") as string
    const paintingDetails = formData.get("paintingDetails") as string

    // Validate required fields
    if (!name || !email || !message || !paintingId || !paintingTitle) {
      return { success: false, error: "All fields are required" }
    }

    // Prepare email content
    const emailData = {
      personalizations: [
        {
          to: [{ email: ADMIN_EMAIL }],
          subject: `Painting Inquiry: ${paintingTitle}`,
        },
      ],
      from: { email: FROM_EMAIL },
      content: [
        {
          type: "text/html",
          value: `
            <h2>New Painting Inquiry</h2>
            <div style="margin-bottom: 20px; padding: 15px; background-color: #f2efe7; border-radius: 5px;">
              <p><strong>Painting:</strong> ${paintingTitle}</p>
              <p><strong>Details:</strong> ${paintingDetails}</p>
            </div>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Message:</strong></p>
            <p>${message.replace(/\n/g, "<br>")}</p>
          `,
        },
      ],
    }

    // Send email using SendGrid API directly
    const response = await fetch("https://api.sendgrid.com/v3/mail/send", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${SENDGRID_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(emailData),
    })

    if (!response.ok) {
      console.error("SendGrid API error:", await response.text())
      return { success: false, error: "Failed to send inquiry" }
    }

    return { success: true }
  } catch (error) {
    console.error("Error sending inquiry:", error)
    return { success: false, error: "Failed to send inquiry. Please try again." }
  }
}

// Painting offer submission
export async function submitOffer(formData: FormData) {
  try {
    // Extract form data
    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const offerAmount = formData.get("offerAmount") as string
    const comments = (formData.get("comments") as string) || ""
    const paintingId = formData.get("paintingId") as string
    const paintingTitle = formData.get("paintingTitle") as string
    const paintingDetails = formData.get("paintingDetails") as string

    // Validate required fields
    if (!name || !email || !offerAmount || !paintingId || !paintingTitle) {
      return { success: false, error: "All fields are required" }
    }

    // Prepare email content
    const emailData = {
      personalizations: [
        {
          to: [{ email: ADMIN_EMAIL }],
          subject: `Offer for Painting: ${paintingTitle}`,
        },
      ],
      from: { email: FROM_EMAIL },
      content: [
        {
          type: "text/html",
          value: `
            <h2>New Painting Offer</h2>
            <div style="margin-bottom: 20px; padding: 15px; background-color: #f2efe7; border-radius: 5px;">
              <p><strong>Painting:</strong> ${paintingTitle}</p>
              <p><strong>Details:</strong> ${paintingDetails}</p>
            </div>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Offer Amount:</strong> £${offerAmount}</p>
            <p><strong>Comments:</strong></p>
            <p>${comments.replace(/\n/g, "<br>")}</p>
          `,
        },
      ],
    }

    // Send email using SendGrid API directly
    const response = await fetch("https://api.sendgrid.com/v3/mail/send", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${SENDGRID_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(emailData),
    })

    if (!response.ok) {
      console.error("SendGrid API error:", await response.text())
      return { success: false, error: "Failed to submit offer" }
    }

    return { success: true }
  } catch (error) {
    console.error("Error sending offer:", error)
    return { success: false, error: "Failed to submit offer. Please try again." }
  }
}

