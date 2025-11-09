"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type LoginResponse = { error?: string; redirect?: string }

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })
      const data = (await res.json()) as LoginResponse
      if (!res.ok) {
        setError((typeof data.error === "string" && data.error) || "Login failed")
        return
      }
      router.push((typeof data.redirect === "string" && data.redirect) || "/dashboard")
    } catch (err) {
      console.error(err)
      setError("Unexpected error")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <form onSubmit={onSubmit} className="w-full max-w-sm space-y-4 bg-zinc-900/50 border border-zinc-800 p-6 rounded-2xl">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-white">Email</Label>
          <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)}
                 autoComplete="email"
                 className="bg-zinc-800/50 border-zinc-700 text-white" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password" className="text-white">Password</Label>
          <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)}
                 autoComplete="current-password"
                 className="bg-zinc-800/50 border-zinc-700 text-white" required />
        </div>
        {error && <div role="alert" className="text-sm text-red-400">{error}</div>}
        <Button type="submit" disabled={isLoading} className="w-full bg-[#e78a53] hover:bg-[#e78a53]/90 text-white">
          {isLoading ? "Signing in..." : "Sign in"}
        </Button>
      </form>
    </div>
  )
}
