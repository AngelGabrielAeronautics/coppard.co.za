import { cookies } from "next/headers"
import { redirect } from "next/navigation"

// In a real application, you would use a more secure method like NextAuth.js or Clerk
// This is a simplified version for demonstration purposes

// Mock admin credentials - in a real app, these would be stored securely in a database
const ADMIN_USERNAME = "admin"
const ADMIN_PASSWORD = "password123"

// Session duration - 7 days
const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000

export async function login(username: string, password: string) {
  // Validate credentials
  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    // Create a session token (in a real app, this would be a JWT or similar)
    const sessionToken = Buffer.from(
      JSON.stringify({
        username,
        expires: Date.now() + SESSION_DURATION,
      }),
    ).toString("base64")

    // Set the session cookie
    cookies().set("session", sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: SESSION_DURATION / 1000, // Convert to seconds
      path: "/",
    })

    return { success: true }
  }

  return { success: false, error: "Invalid username or password" }
}

export async function logout() {
  // Delete the session cookie
  cookies().delete("session")
}

export function getSession() {
  const sessionCookie = cookies().get("session")

  if (!sessionCookie) {
    return null
  }

  try {
    const sessionData = JSON.parse(Buffer.from(sessionCookie.value, "base64").toString())

    // Check if session has expired
    if (sessionData.expires < Date.now()) {
      return null
    }

    return sessionData
  } catch (error) {
    return null
  }
}

export function requireAuth() {
  const session = getSession()

  if (!session) {
    redirect("/admin/login")
  }

  return session
}

