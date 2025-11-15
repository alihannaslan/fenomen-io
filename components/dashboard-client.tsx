"use client"

import { useEffect, useMemo, useState, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import type { SessionData } from "@/lib/session"

interface DashboardClientProps {
  user: SessionData
}

type KVProfile = {
  status: string
  username: string
  result: {
    profile_summary?: string
    content_patterns?: string
    weaknesses?: string
    roadmap?: string
    hooks?: string
    branding?: string
    growth_projection?: string
    final_summary?: string
  }
  meta?: unknown
  ts?: number
}

// --------------------------------------------------------
//  ONBOARDING (TikTok username input ekranı)
// --------------------------------------------------------

const UsernameOnboarding = ({ onSubmit }: { onSubmit: (username: string) => void }) => {
  const [username, setUsername] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handle = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    let raw = username.trim()
    if (!raw) {
      setError("Lütfen TikTok kullanıcı adını gir.")
      return
    }

    const clean = raw.startsWith("@") ? raw.slice(1) : raw
    if (!clean.match(/^[a-zA-Z0-9._]+$/)) {
      setError("Kullanıcı adı sadece harf, rakam, nokta ve alt çizgi içerebilir.")
      return
    }

    setLoading(true)
    onSubmit(clean)
  }

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="w-full max-w-lg">
        <div className="mb-6 text-center">
          <p className="text-sm uppercase tracking-wide text-zinc-500">
            Adım 1 / 3
          </p>
          <h1 className="mt-2 text-2xl font-semibold text-white">
            TikTok profilini analiz edelim
          </h1>
          <p className="mt-2 text-sm text-zinc-400">
            Profil skorun, büyüme yol haritan ve içerik fikirlerin birkaç dakika içinde hazır olsun.
          </p>
        </div>

        <form
          onSubmit={handle}
          className="rounded-2xl border border-zinc-800 bg-zinc-900/60 backdrop-blur px-6 py-6 space-y-4"
        >
          <label className="block text-sm font-medium text-zinc-300">
            TikTok kullanıcı adın
          </label>

          <div className="flex gap-2">
            <div className="inline-flex items-center rounded-xl border border-zinc-700 bg-zinc-800/60 px-3 text-sm text-zinc-400">
              @
            </div>

            <input
              type="text"
              placeholder="ornekhesap"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="flex-1 rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-white outline-none focus-visible:ring-2 focus-visible:ring-[#e78a53]"
            />
          </div>

          {error && <p className="text-xs text-red-400">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="mt-4 w-full rounded-xl bg-[#e78a53] px-4 py-2.5 text-sm font-medium text-white disabled:opacity-60"
          >
            {loading ? "Yönlendiriliyor…" : "TikTok Profilimi Analiz Et"}
          </button>

          <p className="text-[11px] text-zinc-500 text-center mt-2">
            Şu an sadece TikTok profiliyle çalışıyoruz. Ödeme sonrası analiz birkaç dakika içinde hazırlanır.
          </p>
        </form>
      </div>
    </div>
  )
}

// --------------------------------------------------------
//  Markdown renderer (mevcut kodun)
// --------------------------------------------------------

const renderInlineMarkdown = (text: string, keyBase: string): ReactNode[] => {
  if (!text) return []

  const nodes: ReactNode[] = []
  const tokenRegex = /\*\*(.+?)\*\*|\*(.+?)\*|`([^`]+)`|\[([^\]]+)\]\(([^)]+)\)/g
  let lastIndex = 0
  let matchIndex = 0

  for (const match of text.matchAll(tokenRegex)) {
    const start = match.index ?? 0

    if (start > lastIndex) {
      nodes.push(text.slice(lastIndex, start))
    }

    if (match[1]) {
      nodes.push(
        <strong key={`${keyBase}-strong-${matchIndex}`}>
          {renderInlineMarkdown(match[1], `${keyBase}-strong-${matchIndex}`)}
        </strong>
      )
    } else if (match[2]) {
      nodes.push(
        <em key={`${keyBase}-em-${matchIndex}`}>
          {renderInlineMarkdown(match[2], `${keyBase}-em-${matchIndex}`)}
        </em>
      )
    } else if (match[3]) {
      nodes.push(
        <code key={`${keyBase}-code-${matchIndex}`} className="rounded bg-zinc-800 px-1 py-0.5 text-xs">
          {match[3]}
        </code>
      )
    } else if (match[4] && match[5]) {
      nodes.push(
        <a
          key={`${keyBase}-link-${matchIndex}`}
          href={match[5]}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#e78a53] underline-offset-2 hover:underline"
        >
          {renderInlineMarkdown(match[4], `${keyBase}-link-label-${matchIndex}`)}
        </a>
      )
    }

    lastIndex = start + match[0].length
    matchIndex += 1
  }

  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex))
  }

  return nodes
}

const convertMarkdownToReact = (markdown: string): ReactNode[] => {
  const normalized = markdown.replace(/\r\n/g, "\n")
  const lines = normalized.split("\n")
  const blocks: ReactNode[] = []

  let blockIndex = 0
  let listBuffer: { ordered: boolean; items: string[] } | null = null
  let quoteBuffer: string[] | null = null
  let inCodeBlock = false
  let codeBuffer: string[] = []

  const flushList = () => {
    if (!listBuffer) return

    const listKey = `md-list-${blockIndex}`
    const ListTag = listBuffer.ordered ? "ol" : "ul"
    const listClass = listBuffer.ordered ? "list-decimal" : "list-disc"

    blocks.push(
      <ListTag key={listKey} className={`${listClass} space-y-2 pl-5 text-zinc-200`}>
        {listBuffer.items.map((item, idx) => (
          <li key={`${listKey}-item-${idx}`} className="leading-relaxed">
            {renderInlineMarkdown(item.trim(), `${listKey}-item-${idx}`)}
          </li>
        ))}
      </ListTag>
    )

    blockIndex += 1
    listBuffer = null
  }

  const flushQuote = () => {
    if (!quoteBuffer || quoteBuffer.length === 0) return

    const quoteKey = `md-quote-${blockIndex}`
    const paragraphs = quoteBuffer
      .join("\n")
      .split(/\n{2,}/)
      .map((paragraph) => paragraph.trim())
      .filter(Boolean)

    blocks.push(
      <blockquote key={quoteKey} className="space-y-2 border-l-2 border-zinc-700 pl-4 text-zinc-300">
        {paragraphs.length > 0
          ? paragraphs.map((paragraph, idx) => (
            <p key={`${quoteKey}-p-${idx}`} className="leading-relaxed italic">
              {renderInlineMarkdown(paragraph, `${quoteKey}-p-${idx}`)}
            </p>
          ))
          : (
            <p className="leading-relaxed italic">
              {renderInlineMarkdown(quoteBuffer.join(" "), `${quoteKey}-p-0`)}
            </p>
            )}
      </blockquote>
    )

    blockIndex += 1
    quoteBuffer = null
  }

  const flushCode = () => {
    if (codeBuffer.length === 0) return

    const codeKey = `md-code-${blockIndex}`

    blocks.push(
      <pre
        key={codeKey}
        className="overflow-x-auto rounded-md border border-zinc-800 bg-zinc-950 p-4 text-sm text-zinc-100"
      >
        <code className="whitespace-pre">
          {codeBuffer.join("\n").replace(/\s+$/u, "")}
        </code>
      </pre>
    )

    blockIndex += 1
    codeBuffer = []
  }

  for (const line of lines) {
    const trimmedLine = line.trim()

    if (inCodeBlock) {
      if (trimmedLine.startsWith("```") || trimmedLine.startsWith("~~~")) {
        flushCode()
        inCodeBlock = false
        continue
      }

      codeBuffer.push(line)
      continue
    }

    if (trimmedLine.startsWith("```") || trimmedLine.startsWith("~~~")) {
      flushList()
      flushQuote()
      inCodeBlock = true
      codeBuffer = []
      continue
    }

    if (!trimmedLine) {
      flushList()
      flushQuote()
      continue
    }

    if (trimmedLine.startsWith(">")) {
      flushList()
      if (!quoteBuffer) {
        quoteBuffer = []
      }
      quoteBuffer.push(trimmedLine.replace(/^>\s?/, ""))
      continue
    }

    flushQuote()

    const headingMatch = trimmedLine.match(/^(#{1,6})\s+(.*)$/)
    if (headingMatch) {
      flushList()
      const level = Math.min(headingMatch[1].length, 3)
      const content = headingMatch[2].trim()
      const sizeClass = level === 1 ? "text-xl" : level === 2 ? "text-lg" : "text-base"

      blocks.push(
        <h4
          key={`md-heading-${blockIndex}`}
          className={`font-semibold text-white ${sizeClass !== "text-base" ? sizeClass : ""} leading-tight`}
        >
          {renderInlineMarkdown(content, `heading-${blockIndex}`)}
        </h4>
      )

      blockIndex += 1
      continue
    }

    if (/^[-*+]\s+/.test(trimmedLine)) {
      const item = trimmedLine.replace(/^[-*+]\s+/, "")
      if (!listBuffer || listBuffer.ordered) {
        flushList()
        listBuffer = { ordered: false, items: [] }
      }
      listBuffer.items.push(item)
      continue
    }

    if (/^\d+\.\s+/.test(trimmedLine)) {
      const item = trimmedLine.replace(/^\d+\.\s+/, "")
      if (!listBuffer || !listBuffer.ordered) {
        flushList()
        listBuffer = { ordered: true, items: [] }
      }
      listBuffer.items.push(item)
      continue
    }

    if (/^(-{3,}|\*{3,}|_{3,})$/.test(trimmedLine)) {
      flushList()
      blocks.push(<hr key={`md-hr-${blockIndex}`} className="border-zinc-800" />)
      blockIndex += 1
      continue
    }

    flushList()

    blocks.push(
      <p key={`md-p-${blockIndex}`} className="leading-relaxed">
        {renderInlineMarkdown(trimmedLine, `paragraph-${blockIndex}`)}
      </p>
    )

    blockIndex += 1
  }

  if (inCodeBlock) {
    flushCode()
  }

  flushList()
  flushQuote()

  if (blocks.length === 0) {
    return [
      <p key="md-fallback" className="leading-relaxed">
        {markdown}
      </p>,
    ]
  }

  return blocks
}

const MarkdownRenderer = ({ text }: { text: string }) => {
  const content = useMemo(() => convertMarkdownToReact(text), [text])

  return (
    <div className="space-y-3 text-[15px] leading-relaxed text-zinc-200">
      {content}
    </div>
  )
}

// --------------------------------------------------------
//  DASHBOARD CLIENT
// --------------------------------------------------------

export default function DashboardClient({ user }: DashboardClientProps) {
  const router = useRouter()
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [kvLoading, setKvLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [kvData, setKvData] = useState<{
    email: string
    user: { id: string; email: string; name?: string; username?: string }
    profile: KVProfile
  } | null>(null)

  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      await fetch("/api/auth/logout", { method: "POST" })
      router.push("/")
      router.refresh()
    } catch (e) {
      console.error("Logout error:", e)
      setIsLoggingOut(false)
    }
  }

  // onboarding submit → pricing
  const handleUsernameSubmit = (cleanUsername: string) => {
    router.push(`/pricing?username=${encodeURIComponent(cleanUsername)}`)
  }

  // KV'den profil verisini çek
  useEffect(() => {
    const run = async () => {
      if (!user?.email) return
      setKvLoading(true)
      setError(null)
      try {
        const res = await fetch(`/api/profile?email=${encodeURIComponent(user.email)}`, { cache: "no-store" })

        if (!res.ok) {
          let message = `HTTP ${res.status}`

          try {
            const data = (await res.json()) as unknown
            if (data && typeof data === "object" && "error" in data) {
              message = String((data as { error: unknown }).error)
            }
          } catch {
            // ignore
          }

          throw new Error(message)
        }

        const data = (await res.json()) as {
          email: string
          user: { id: string; email: string; name?: string; username?: string }
          profile: KVProfile
        }
        setKvData(data)
      } catch (err: any) {
        setError(err?.message || "Beklenmeyen hata")
      } finally {
        setKvLoading(false)
      }
    }
    run()
  }, [user?.email])

  const profileStatus = kvData?.profile?.status
  const username = kvData?.user?.username || kvData?.profile?.username

  // awaiting_payment durumunda otomatik pricing'e yönlendir
  useEffect(() => {
    if (profileStatus === "awaiting_payment" && username) {
      router.push(`/pricing?username=${encodeURIComponent(username)}`)
    }
  }, [profileStatus, username, router])

  const formattedDate = useMemo(
    () =>
      new Date().toLocaleDateString("tr-TR", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    []
  )

  const SectionCard = ({
    title,
    text,
    delay = 0,
  }: {
    title: string
    text?: string
    delay?: number
  }) => {
    if (!text) return null
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay }}>
        <Card className="bg-zinc-900/50 border-zinc-800 p-6">
          <h3 className="text-xl font-semibold text-white mb-4">{title}</h3>
          <MarkdownRenderer text={text} />
        </Card>
      </motion.div>
    )
  }

  // ----------------------------------------------------
  //  GÖRÜNÜM DURUMLARI
  // ----------------------------------------------------

  const showOnboarding = !kvLoading && !kvData?.profile?.username
  const isAnalysisLoading = profileStatus === "paid" || profileStatus === "analysis_running"

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
              <span className="text-xl font-bold text-white">Fenomen Dashboard</span>
            </div>

            <Button
              onClick={handleLogout}
              disabled={isLoggingOut}
              variant="outline"
              className="bg-zinc-800/50 border-zinc-700 text-zinc-300 hover:bg-zinc-700 hover:text-white transition-colors"
            >
              {isLoggingOut ? "Çıkış yapılıyor..." : "Çıkış Yap"}
            </Button>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* KV load hatası */}
          {error && !showOnboarding && !isAnalysisLoading && (
            <p className="mb-4 text-sm text-red-400">Hata: {error}</p>
          )}

          {/* 1) Onboarding */}
          {showOnboarding && (
            <UsernameOnboarding onSubmit={handleUsernameSubmit} />
          )}

          {/* 2) Analiz hazırlanıyor */}
          {!showOnboarding && isAnalysisLoading && (
            <div className="min-h-[50vh] flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-10 h-10 border-2 border-[#e78a53]/40 border-t-[#e78a53] rounded-full animate-spin" />
              <div>
                <h2 className="text-xl font-semibold text-white mb-2">
                  Analiz hazırlanıyor…
                </h2>
                <p className="text-sm text-zinc-400 max-w-md">
                  TikTok profil verilerini topluyor, içerik performansını analiz ediyor ve büyüme yol haritanı oluşturuyoruz.
                  Bu işlem genellikle 1–3 dakika sürer.
                </p>
              </div>
            </div>
          )}

          {/* 3) Profil & sonuçlar (eski dashboard görünümü) */}
          {!showOnboarding && !isAnalysisLoading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* Welcome Section */}
              <div className="mb-8">
                <h1 className="text-4xl font-bold text-white mb-2">
                  Hoş geldin{user.name ? `, ${user.name}` : ""}!
                  {username ? <span className="ml-2 text-zinc-400 text-2xl">(@{username})</span> : null}
                </h1>
                <p className="text-zinc-400 text-lg">
                  Hesabınızla ilgili güncel bilgiler burada.
                </p>
                {kvLoading && <p className="text-sm text-zinc-500 mt-2">KV verisi yükleniyor…</p>}
                {error && <p className="text-sm text-red-400 mt-2">Hata: {error}</p>}
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  <Card className="bg-zinc-900/50 border-zinc-800 p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-zinc-400 text-sm mb-1">Kullanıcı ID</p>
                        <p className="text-2xl font-bold text-white">#{user.userId.substring(0, 8)}</p>
                      </div>
                      <div className="w-12 h-12 bg-[#e78a53]/10 rounded-lg flex items-center justify-center">
                        <svg className="w-6 h-6 text-[#e78a53]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                      </div>
                    </div>
                  </Card>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <Card className="bg-zinc-900/50 border-zinc-800 p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-zinc-400 text-sm mb-1">Hesap Durumu</p>
                        <p className="text-2xl font-bold text-green-400">Aktif</p>
                      </div>
                      <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center">
                        <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                    </div>
                  </Card>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <Card className="bg-zinc-900/50 border-zinc-800 p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-zinc-400 text-sm mb-1">Üyelik Tarihi</p>
                        <p className="text-xl font-bold text-white">{formattedDate}</p>
                      </div>
                      <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
                        <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              </div>

              {/* User Info Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <Card className="bg-zinc-900/50 border-zinc-800 p-8">
                  <h2 className="text-2xl font-bold text-white mb-6">Hesap Bilgileri</h2>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between py-3 border-b border-zinc-800">
                      <span className="text-zinc-400">İsim Soyisim</span>
                      <span className="text-white font-medium">{user.name || "Belirtilmemiş"}</span>
                    </div>

                    <div className="flex items-center justify-between py-3 border-b border-zinc-800">
                      <span className="text-zinc-400">E-posta Adresi</span>
                      <span className="text-white font-medium">{user.email}</span>
                    </div>

                    <div className="flex items-center justify-between py-3 border-b border-zinc-800">
                      <span className="text-zinc-400">Kullanıcı ID</span>
                      <span className="text-white font-medium">#{user.userId.substring(0, 16)}...</span>
                    </div>

                    <div className="flex items-center justify-between py-3">
                      <span className="text-zinc-400">Hesap Oluşturulma</span>
                      <span className="text-white font-medium">{formattedDate}</span>
                    </div>
                  </div>
                </Card>
              </motion.div>

              {/* KV'den gelen PROFİL blokları */}
              {kvData?.profile?.result && (
                <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <SectionCard title="Profil Özeti" text={kvData.profile.result.profile_summary} delay={0.1} />
                  <SectionCard title="İçerik Desenleri" text={kvData.profile.result.content_patterns} delay={0.15} />
                  <SectionCard title="Zayıf Noktalar & Öneriler" text={kvData.profile.result.weaknesses} delay={0.2} />
                  <SectionCard title="30 Günlük Roadmap" text={kvData.profile.result.roadmap} delay={0.25} />
                  <SectionCard title="Hook & Caption Bankası" text={kvData.profile.result.hooks} delay={0.3} />
                  <SectionCard title="Markalaşma Önerileri" text={kvData.profile.result.branding} delay={0.35} />
                  <SectionCard title="Büyüme Projeksiyonu" text={kvData.profile.result.growth_projection} delay={0.4} />
                  <SectionCard title="Genel Değerlendirme" text={kvData.profile.result.final_summary} delay={0.45} />
                </div>
              )}

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
                      <h3 className="text-lg font-semibold text-white mb-1">Yeni Proje Oluştur</h3>
                      <p className="text-zinc-400 text-sm">Fenomen ile harika bir şeyler inşa etmeye başlayın</p>
                    </div>
                  </div>
                </Card>

                <Card className="bg-zinc-900/50 border-zinc-800 p-6 hover:border-[#e78a53]/50 transition-colors cursor-pointer">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-1">Dokümantasyon</h3>
                      <p className="text-zinc-400 text-sm">
                        Hesabınızdan en iyi şekilde nasıl yararlanacağınızı öğrenin
                      </p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            </motion.div>
          )}
        </main>
      </div>
    </div>
  )
}
