// app/pricing/page.tsx
"use client"

import { useState } from "react"

type CheckoutResponse = {
  ok: boolean
  url?: string
  error?: string
  detail?: unknown
}

export default function PricingPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleBuy = async () => {
    try {
      setLoading(true)
      setError(null)

      const res = await fetch("/api/iyzico-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          packageId: "tiktok-single",
          userId: "demo-user-1", // TODO: burada gerçek userId'yi session'dan verirsin
        }),
      })

      const data = (await res.json()) as CheckoutResponse

      if (!res.ok || !data.ok || !data.url) {
        console.error("iyzico-checkout error:", data)
        setError("Ödeme başlatılırken bir hata oluştu.")
        return
      }

      // Burada data.url kesinlikle string
      window.location.href = data.url
    } catch (e) {
      console.error(e)
      setError("Beklenmeyen bir hata oluştu.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
      <div className="max-w-md w-full bg-slate-900/70 border border-slate-800 rounded-2xl p-8 shadow-xl">
        <h1 className="text-2xl font-bold mb-2">TikTok Analiz Paketi</h1>
        <p className="text-slate-300 mb-4">
          Tek seferlik yapay zeka destekli TikTok profil analizi.
        </p>

        <div className="text-3xl font-extrabold mb-6">299 TL</div>

        {error && <p className="text-sm text-red-400 mb-4">{error}</p>}

        <button
          onClick={handleBuy}
          disabled={loading}
          className="w-full py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-black font-semibold disabled:opacity-60"
        >
          {loading ? "Yönlendiriliyor..." : "Satın Al"}
        </button>

        <p className="mt-3 text-xs text-slate-500">
          Ödeme, iyzico güvenli ödeme sayfası üzerinden alınacaktır.
        </p>
      </div>
    </div>
  )
}
