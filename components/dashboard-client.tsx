"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

// Bu tip, JWT akışında gelebilecek alanları kapsayacak şekilde esnek tutuldu.
// Zorunlu tek alan email; diğerleri opsiyonel.
type DashboardUser = {
  email: string
  name?: string | null
  id?: string | number | null
  createdAt?: string | number | Date | null
  created_at?: string | null // bazı akışlarda snake_case gelebilir
}

interface DashboardClientProps {
  user: DashboardUser
}

function formatMaybeDate(user: DashboardUser): string {
  const raw = user.createdAt ?? user.created_at
  if (!raw) return "—"
  const d = raw instanceof Date ? raw : new Date(raw as any)
  if (isNaN(d.getTime())) return "—"
  return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
}

export default function DashboardClient({ user }: DashboardClientProps) {
  const router = useRouter()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      await fetch("/api/auth/logout", { method: "POST" })
      router.push("/")
      router.refresh()
    } catch (err) {
      console.error("[v0] Logout error:", err)
      setIsLoggingOut(false)
    }
  }

  const formattedDate = formatMaybeDate(user)
  const userId = user.id ?? "—"

  return (
    <div className="min-h-screen bg-black">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 via-black to-zinc-900" />

      {/* Decorative elements */}
      <div className="absolute top-20 right-20 w-72 h-72 bg-[#e78a53]/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-20 w-96 h-96 bg-[#e78a53]/5 rounded-full blur-3xl" />

      <div className="relative z-10">
        {/* Header */}
        <header className="border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <svg
                fill="currentColor"
                viewBox="0 0 147 70"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
                className="text-[#e78a53] rounded-full size-8 w-8"
              >
                <path d="M56 50.2031V14H70V60.1562C70 65.5928 65.5928 70 60.1562 70C57.5605 70 54.9982 68.9992 53.1562 67.1573L0 14H19.7969L56 50.2031Z"></path>
                <path d="M147 56H133V23.9531L100.953 56H133V70H96.6875C85.8144 70 77 61.1856 77 50.3125V14H91V46.1562L123.156 14H91V0H127.312C138.186 0 147 8.81439 147 19.6875V56Z"></path>
              </svg>
              <span className="text-xl font-bold text-white">Dashboard</span>
            </div>

            <Button
              onClick={handleLogout}
              disabled={isLoggingOut}
              variant="outline"
              className="bg-zinc-800/50 border-zinc-700 text-zinc-300 hover:bg-zinc-700 hover:text-white transition-colors"
            >
              {isLoggingOut ? "Logging out..." : "Logout"}
            </Button>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            {/* Welcome Section */}
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-white mb-2">
                Welcome back{user.name ? `, ${user.name}` : ""}!
              </h1>
              <p className="text-zinc-400 text-lg">Here's what's happening with your account today.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
                <Card className="bg-zinc-900/50 border-zinc-800 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-zinc-400 text-sm mb-1">User ID</p>
                      <p className="text-2xl font-bold text-white">#{userId}</p>
                    </div>
                    <div className="w-12 h-12 bg-[#e78a53]/10 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-[#e78a53]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                  </div>
                </Card>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
                <Card className="bg-zinc-900/50 border-zinc-800 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-zinc-400 text-sm mb-1">Account Status</p>
                      <p className="text-2xl font-bold text-green-400">Active</p>
                    </div>
                    <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                </Card>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}>
                <Card className="bg-zinc-900/50 border-zinc-800 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-zinc-400 text-sm mb-1">Member Since</p>
                      <p className="text-xl font-bold text-white">{formattedDate}</p>
                    </div>
                    <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  </div>
                </Card>
              </motion.div>
            </div>

            {/* User Info Card */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }}>
              <Card className="bg-zinc-900/50 border-zinc-800 p-8">
                <h2 className="text-2xl font-bold text-white mb-6">Account Information</h2>

                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3 border-b border-zinc-800">
                    <span className="text-zinc-400">Full Name</span>
                    <span className="text-white font-medium">{user.name || "Not provided"}</span>
                  </div>

                  <div className="flex items-center justify-between py-3 border-b border-zinc-800">
                    <span className="text-zinc-400">Email Address</span>
                    <span className="text-white font-medium">{user.email}</span>
                  </div>

                  <div className="flex items-center justify-between py-3 border-b border-zinc-800">
                    <span className="text-zinc-400">User ID</span>
                    <span className="text-white font-medium">#{userId}</span>
                  </div>

                  <div className="flex items-center justify-between py-3">
                    <span className="text-zinc-400">Account Created</span>
                    <span className="text-white font-medium">{formattedDate}</span>
                  </div>
                </div>

                <div className="mt-8 flex gap-4">
                  <Button className="bg-[#e78a53] hover:bg-[#e78a53]/90 text-white">Edit Profile</Button>
                  <Button variant="outline" className="bg-zinc-800/50 border-zinc-700 text-zinc-300 hover:bg-zinc-700 hover:text-white">
                    Settings
                  </Button>
                </div>
              </Card>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              <Card className="bg-zinc-900/50 border-zinc-800 p-6 hover:border-[#e78a53]/50 transition-colors cursor-pointer">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-[#e78a53]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-[#e78a53]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-1">Create New Project</h3>
                    <p className="text-zinc-400 text-sm">Start building something amazing with v0</p>
                  </div>
                </div>
              </Card>

              <Card className="bg-zinc-900/50 border-zinc-800 p-6 hover:border-[#e78a53]/50 transition-colors cursor-pointer">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-1">View Documentation</h3>
                    <p className="text-zinc-400 text-sm">Learn how to make the most of your account</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          </motion.div>
        </main>
      </div>
    </div>
  )
}
