import type { ReactNode } from "react"
import Link from "next/link"
import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { LogOut, Home, Image, LayoutDashboard } from "lucide-react"

export default function AdminLayout({ children }: { children: ReactNode }) {
  // Check if user is logged in (except for login page)
  const session = getSession()
  const isLoginPage = children.props.childProp.segment === "login"

  if (!session && !isLoginPage) {
    redirect("/admin/login")
  }

  // If on login page and already logged in, redirect to dashboard
  if (session && isLoginPage) {
    redirect("/admin/dashboard")
  }

  // If not logged in and on login page, just show the login page
  if (!session && isLoginPage) {
    return children
  }

  // Otherwise, show the admin layout with navigation
  return (
    <div className="flex min-h-screen bg-muted/30">
      {/* Sidebar */}
      <aside className="w-64 bg-card border-r">
        <div className="p-6">
          <h1 className="text-xl font-bold">Admin Panel</h1>
          <p className="text-sm text-muted-foreground">Manage your artwork</p>
        </div>

        <nav className="px-3 py-2">
          <ul className="space-y-1">
            <li>
              <Link href="/admin/dashboard" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted">
                <LayoutDashboard className="w-5 h-5" />
                Dashboard
              </Link>
            </li>
            <li>
              <Link href="/admin/artworks" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted">
                <Image className="w-5 h-5" />
                Artworks
              </Link>
            </li>
            <li>
              <Link href="/" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted">
                <Home className="w-5 h-5" />
                View Website
              </Link>
            </li>
          </ul>
        </nav>

        <div className="absolute bottom-0 w-64 p-4 border-t">
          <form action="/admin/logout" method="POST">
            <Button variant="outline" className="w-full flex items-center gap-2" type="submit">
              <LogOut className="w-4 h-4" />
              Log Out
            </Button>
          </form>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6 overflow-auto">{children}</main>
    </div>
  )
}

