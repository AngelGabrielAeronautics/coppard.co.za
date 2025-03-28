"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import Image from "next/image"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Header() {
  const pathname = usePathname()
  const { user } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const isAdmin = pathname.startsWith("/admin")

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background border-b">
      <div className="container flex h-20 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2 text-lg font-semibold">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/D%20Coppard%20Fine%20Art%20Logo%20-%20middle-3NGLqWn0DLFEhvwI9L5PResNV8EOj5.png"
            alt="DCoppard Art"
            width={260}
            height={65}
            className="h-[52px] w-auto"
          />
        </Link>
        <div className="flex items-center gap-6">
          {/* Desktop Navigation */}
          <nav className="hidden md:flex gap-6">
            <Link
              href="/"
              className={`text-sm font-medium ${pathname === "/" ? "text-primary" : "text-muted-foreground hover:text-primary"}`}
            >
              Gallery
            </Link>
            <Link
              href="/about"
              className={`text-sm font-medium ${pathname === "/about" ? "text-primary" : "text-muted-foreground hover:text-primary"}`}
            >
              About
            </Link>
            <Link
              href="/contact"
              className={`text-sm font-medium ${pathname === "/contact" ? "text-primary" : "text-muted-foreground hover:text-primary"}`}
            >
              Contact
            </Link>
            {user && (
              <Link
                href="/admin"
                className={`text-sm font-medium ${pathname.startsWith("/admin") ? "text-primary" : "text-muted-foreground hover:text-primary"}`}
              >
                Admin
              </Link>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <Button variant="ghost" size="icon" className="md:hidden" onClick={toggleMobileMenu} aria-label="Toggle menu">
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-background border-b shadow-lg">
          <nav className="container flex flex-col py-4 px-4">
            <Link
              href="/"
              className={`py-3 text-base font-medium ${pathname === "/" ? "text-primary" : "text-muted-foreground"}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Gallery
            </Link>
            <Link
              href="/about"
              className={`py-3 text-base font-medium ${pathname === "/about" ? "text-primary" : "text-muted-foreground"}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              About
            </Link>
            <Link
              href="/contact"
              className={`py-3 text-base font-medium ${pathname === "/contact" ? "text-primary" : "text-muted-foreground"}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Contact
            </Link>
            {user && (
              <Link
                href="/admin"
                className={`py-3 text-base font-medium ${pathname.startsWith("/admin") ? "text-primary" : "text-muted-foreground"}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Admin
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}

