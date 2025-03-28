"use client"

import Link from "next/link"
import Image from "next/image"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Lock } from "lucide-react"
import { usePathname } from "next/navigation"
// Import the ColoredText component
import { ColoredText } from "@/components/colored-text"

export function Footer() {
  const { user, signOut } = useAuth()
  const pathname = usePathname()
  const isAdmin = pathname.startsWith("/admin")

  return (
    <footer className="border-t py-6 md:py-8 bg-ivory">
      <div className="container flex flex-col items-center justify-center gap-4 px-4 md:px-6">
        <div className="flex items-center gap-2 text-lg font-semibold">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/D%20Coppard%20Fine%20Art%20Logo%20-%20middle-3NGLqWn0DLFEhvwI9L5PResNV8EOj5.png"
            alt="D.Coppard Fine Art"
            width={225}
            height={57}
            className="h-12 w-auto"
          />
        </div>
        <nav className="flex gap-4 sm:gap-6">
          <Link href="/" className="text-sm font-medium hover:underline underline-offset-4">
            Gallery
          </Link>
          <Link href="/about" className="text-sm font-medium hover:underline underline-offset-4">
            About
          </Link>
          <Link href="/contact" className="text-sm font-medium hover:underline underline-offset-4">
            Contact
          </Link>
        </nav>
        <div className="flex items-center justify-center gap-4">
          {/* Update the copyright text to use ColoredText */}
          <div className="text-center text-sm text-muted-foreground">
            <ColoredText>© {new Date().getFullYear()} D.Coppard Fine Art. All rights reserved.</ColoredText>
          </div>
          {user ? (
            <Button variant="outline" size="sm" onClick={() => signOut()}>
              {isAdmin ? "Logout" : "Admin Logout"}
            </Button>
          ) : (
            <Link href="/admin/login" className="ml-2">
              <Button variant="ghost" size="icon" className="h-8 w-8" aria-label="Admin Login">
                <Lock className="h-4 w-4 text-muted-foreground" />
              </Button>
            </Link>
          )}
        </div>
      </div>
    </footer>
  )
}

