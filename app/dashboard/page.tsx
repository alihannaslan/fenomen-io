// app/dashboard/page.tsx
import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import DashboardClient from "@/components/dashboard-client"

// Cloudflare Pages (next-on-pages) için Edge runtime
export const runtime = "edge"
export const dynamic = "force-dynamic"

// DashboardClient'in beklediği minimal kullanıcı tipi
type DashboardUser = {
  email: string
  name?: string | null
}

export default async function DashboardPage() {
  // JWT cookie'den kullanıcıyı oku (SSR tarafında)
  const user = await getCurrentUser().catch(() => null)

  // Kullanıcı yoksa veya email yoksa login'e yönlendir
  if (!user || !("email" in user) || !user.email) {
    redirect("/login")
  }

  const clientUser: DashboardUser = {
    email: user.email as string,
    name: "name" in user ? (user as any).name ?? null : null,
  }

  return <DashboardClient user={clientUser} />
}
