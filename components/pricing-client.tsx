// components/pricing-client.tsx
"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export default function PricingClient({ username }: { username: string }) {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [started, setStarted] = useState(false)

  useEffect(() => {
    const run = async () => {
      if (!username || started) return
      setStarted(true)
      setError(null)

      try {
        const res = await fetch("/api/start-analysis", {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({ username }),
        })

        if (!res.ok) {
          let message = `HTTP ${res.status}`
          try {
            const data = await res.json()
            if (data && typeof data === "object" && "error" in data) {
              message = String((data as { error: unknown }).error)
            }
          } catch {
            // ignore
          }
          throw new Error(message)
        }

        // Analiz başlatıldı → dashboard'a dön
        router.push("/dashboard")
      } catch (err: any) {
        console.error("start-analysis error:", err)
        setError(err?.message || "Analiz başlatılırken bir hata oluştu.")
      }
    }

    void run()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [username, started])

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4">
      <div className="w-full max-w-md text-center space-y-4">
        <div className="w-10 h-10 border-2 border-[#e78a53]/40 border-t-[#e78a53] rounded-full animate-spin mx-auto" />

        <div>
          <p className="text-sm text-zinc-400 mb-1">Adım 2 / 3</p>
          <h1 className="text-2xl font-semibold text-white mb-2">
            @{username} için analiz başlatılıyor…
          </h1>
          <p className="text-sm text-zinc-400">
            Şu an MVP modundayız. Ödeme adımını atlayıp analizi doğrudan başlatıyoruz.
            Birazdan dashboard ekranına yönlendirileceksin.
          </p>
        </div>

        {error && (
          <p className="text-sm text-red-400 mt-2">
            {error}
          </p>
        )}
      </div>
    </div>
  )
}
