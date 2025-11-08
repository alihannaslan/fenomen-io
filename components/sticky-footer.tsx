"use client"
import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect } from "react"

export function StickyFooter() {
  const [isAtBottom, setIsAtBottom] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    let ticking = false
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollTop = window.scrollY
          const windowHeight = window.innerHeight
          const documentHeight = document.documentElement.scrollHeight
          const isNearBottom = scrollTop + windowHeight >= documentHeight - 120
          setIsAtBottom(isNearBottom)
          ticking = false
        })
        ticking = true
      }
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const brandBg = "#e78a53"
  const brandText = "#121113"

  return (
    <AnimatePresence>
      {isAtBottom && !dismissed && (
        <motion.div
          className="fixed bottom-0 left-0 z-50 w-full"
          style={{ backgroundColor: brandBg }}
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          aria-label="Fenomen alt çağrı alanı"
        >
          <div className="relative mx-auto flex h-80 max-w-7xl items-start justify-between px-6 py-10 sm:px-12">
            {/* Sol tarafta marka ve ana mesaj */}
            <motion.div
              className="flex max-w-2xl flex-col gap-3"
              initial={{ opacity: 0, x: -24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div
                className="inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium"
                style={{ borderColor: `${brandText}1A`, color: brandText, backgroundColor: "#ffffff4d" }}
              >
                Yapay zekâ ile büyüme
              </div>
              <h3
                className="text-3xl font-extrabold leading-tight sm:text-4xl"
                style={{ color: brandText }}
              >
                Hesabını <span className="underline decoration-black/30">AI ile</span> hızla büyüt.
              </h3>
              <p className="text-sm sm:text-base" style={{ color: `${brandText}CC` }}>
                Fenomen, profilini analiz eder; <strong>AI hook & senaryolar</strong> üretir, haftalık içerik
                takvimi ve <strong>aylık otomatik raporlar</strong> ile sürdürülebilir büyüme sağlar.
              </p>

              {/* Mini form: handle + CTA */}
              <form
                className="mt-2 flex w-full max-w-xl flex-col gap-3 sm:flex-row"
                onSubmit={(e) => {
                  e.preventDefault()
                  window.location.href = "/signup"
                }}
              >
                <input
                  type="text"
                  placeholder="@kullaniciadi veya profil URL"
                  className="w-full rounded-lg border border-black/20 bg-white/90 px-4 py-3 text-sm outline-none ring-0 placeholder:text-black/50 focus:border-black/40"
                  aria-label="Profil kullanıcı adın veya URL'in"
                />
                <button
                  type="submit"
                  className="rounded-lg bg-black px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
                >
                  Ücretsiz analizi başlat
                </button>
              </form>

              <div className="mt-1 text-xs" style={{ color: `${brandText}99` }}>
                Kredi kartı gerekmez • 14 gün deneme • İstediğin zaman iptal
              </div>
            </motion.div>

            {/* Sağ tarafta navigasyon kısa linkler */}
            <motion.nav
              className="hidden gap-10 text-right sm:flex"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
            >
              <ul className="space-y-2">
                {[
                  { href: "#features", label: "Özellikler" },
                  { href: "#pricing", label: "Fiyatlandırma" },
                  { href: "/sample-report", label: "Örnek Rapor" },
                ].map((l) => (
                  <li key={l.label}>
                    <a
                      href={l.href}
                      className="transition hover:underline"
                      style={{ color: brandText }}
                    >
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
              <ul className="space-y-2">
                {[
                  { href: "/security", label: "Güvenlik" },
                  { href: "/blog", label: "Blog" },
                  { href: "/contact", label: "İletişim" },
                ].map((l) => (
                  <li key={l.label}>
                    <a
                      href={l.href}
                      className="transition hover:underline"
                      style={{ color: brandText }}
                    >
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.nav>

            {/* Marka dev yazı */}
            <motion.h2
              className="pointer-events-none absolute bottom-0 left-0 select-none text-[72px] font-extrabold leading-none sm:text-[140px] md:text-[180px]"
              style={{ color: brandText, opacity: 0.15 }}
              initial={{ opacity: 0, x: -80 }}
              animate={{ opacity: 0.15, x: 0 }}
              transition={{ duration: 0.6, delay: 0.25 }}
            >
              fenomen
            </motion.h2>

            {/* Kapat butonu */}
            <button
              onClick={() => setDismissed(true)}
              className="absolute right-4 top-4 rounded-full border border-black/20 bg-white/70 p-2 text-black/80 transition hover:bg-white"
              aria-label="Kapat"
              title="Kapat"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 6 6 18"></path>
                <path d="m6 6 12 12"></path>
              </svg>
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
