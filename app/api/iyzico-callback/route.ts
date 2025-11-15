// app/api/iyzico-callback/route.ts

export const runtime = "edge"

import { NextRequest, NextResponse } from "next/server"

/**
 * İyzico entegrasyonu kaldırıldı.
 * Callback endpoint'i artık sadece kullanıcıyı dashboard'a yönlendiriyor.
 */

function redirectToDashboard(req: NextRequest) {
  const url = new URL("/dashboard", req.nextUrl)
  return NextResponse.redirect(url)
}

export async function GET(req: NextRequest) {
  return redirectToDashboard(req)
}

export async function POST(req: NextRequest) {
  return redirectToDashboard(req)
}
