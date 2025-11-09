// app/dashboard/page.tsx
import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"

// Cloudflare Pages (next-on-pages) için Edge runtime
export const runtime = "edge"
export const dynamic = "force-dynamic"

import DashboardClient from "@/components/dashboard-client"

export default async function DashboardPage() {
  // JWT cookie'den kullanıcıyı oku (SSR tarafında)
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  // DashboardClient'in prop tipi eskiden DB User ise, email/name ile çalışacak şekilde güncel olmalı.
  // Örn: type DashboardUser = { email: string; name?: string }
  return <DashboardClient user={{ email: user.email, name: user.name }} />
}
