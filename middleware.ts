import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { verifySession } from "@/lib/session"

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Get session token from cookies
  const token = request.cookies.get("session")?.value

  // Verify session
  const session = token ? await verifySession(token) : null

  // Protected routes - require authentication
  const isProtectedRoute = pathname.startsWith("/dashboard")

  // Auth routes - redirect to dashboard if already logged in
  const isAuthRoute = pathname.startsWith("/login") || pathname.startsWith("/signup")

  // If accessing protected route without session, redirect to login
  if (isProtectedRoute && !session) {
    const url = new URL("/login", request.url)
    return NextResponse.redirect(url)
  }

  // If accessing auth route with session, redirect to dashboard
  if (isAuthRoute && session) {
    const url = new URL("/dashboard", request.url)
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    // Match all paths except static files and api routes
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
