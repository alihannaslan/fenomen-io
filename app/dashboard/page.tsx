import { redirect } from "next/navigation"
import { getSession } from "@/lib/session"
import { getUserById } from "@/lib/auth"
import DashboardClient from "@/components/dashboard-client"

export default async function DashboardPage() {
  const session = await getSession()

  if (!session) {
    redirect("/login")
  }

  const user = getUserById(session.userId)

  if (!user) {
    redirect("/login")
  }

  return <DashboardClient user={user} />
}
