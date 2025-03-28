"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Header } from "@/components/header"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const { user, loading } = useAuth()

  useEffect(() => {
    if (!loading && !user && pathname !== "/admin/login") {
      router.push("/admin/login")
    }
  }, [user, loading, router, pathname])

  // Don't apply the admin layout to the login page
  if (pathname === "/admin/login") {
    return <>{children}</>
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-ivory">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!user && pathname !== "/admin/login") {
    return null
  }

  return (
    <div className="flex min-h-screen flex-col bg-ivory">
      <Header />
      <main className="flex-1 pt-16">{children}</main>
    </div>
  )
}

