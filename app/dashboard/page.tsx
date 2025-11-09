// app/dashboard/page.tsx
import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import DashboardClient from "@/components/dashboard-client"

// Cloudflare Pages (next-on-pages) için Edge runtime
export const runtime = "edge"
export const dynamic = "force-dynamic"

export default async function DashboardPage() {
  const user = await getCurrentUser().catch(() => null)

  if (!user || !("email" in user) || !user.email) {
    redirect("/login")
  }

  // Tip çakışmasını önlemek için burada yerel tip TANIMLAMIYORUZ.
  const clientUser = {
    email: user.email as string,
    name: "name" in user ? (user as any).name ?? null : null,
  }

  return <DashboardClient user={clientUser} />
}
