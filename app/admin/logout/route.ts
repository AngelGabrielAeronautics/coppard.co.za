import { type NextRequest, NextResponse } from "next/server"
import { logout } from "@/lib/auth"

export async function POST(request: NextRequest) {
  await logout()
  return NextResponse.redirect(new URL("/admin/login", request.url))
}

