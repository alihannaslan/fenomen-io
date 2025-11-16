"use client"

import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import type { SessionData } from "@/lib/session"
import Image from "next/image"

interface DashboardClientProps {
  user: SessionData
}

type BrightDataTopVideo = {
  video_id: string
  playcount?: number
  diggcount?: number
  commentcount?: number
  share_count?: number
  video_url?: string
  cover_image?: string
}

type BrightDataProfile = {
  account_id?: string
  nickname?: string
  biography?: string
  bio_link?: string
  url?: string
  profile_pic_url?: string
  profile_pic_url_hd?: string
  followers?: number
  likes?: number
  like_count?: number
  videos_count?: number
  awg_engagement_rate?: number
  comment_engagement_rate?: number
  like_engagement_rate?: number
  top_videos?: BrightDataTopVideo[]
}

type KVProfile = {
  status: string
  username: string
  // KV’de tuttuğun string JSON sunucuda parse ediliyorsa buraya direkt obje geliyor
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
  // KV’deki diğer alanlar (brightdata_raw, profile_pic_url vb.)
  brightdata_raw?: BrightDataProfile
  profile_pic_url?: string
  profile_pic_key?: string
  profile_pic_api_url?: string
  meta?: unknown
  ts?: number
}

// --------------------------------------------------------
//  Helpers
// --------------------------------------------------------

const formatCompactNumber = (value?: number | null) => {
  if (value == null || Number.isNaN(value)) return "-"
  const n = Number(value)
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M"
  if (n >= 1_000) return (n / 1_000).toFixed(1).replace(/\.0$/, "") + "K"
  return n.toLocaleString("tr-TR")
}

const formatPercent = (value?: number | null) => {
  if (value == null || Number.isNaN(value)) return "-"
  return (value * 100).toFixed(1).replace(/\.0$/, "") + " %"
}

// --------------------------------------------------------
//  ONBOARDING (TikTok username input ekranı)
// --------------------------------------------------------

const UsernameOnboarding = ({ onSubmit }: { onSubmit: (username: string) => Promise<void> | void }) => {
  const [username, setUsername] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handle = async (e: React.FormEvent) => {
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
    try {
      await onSubmit(clean)
    } catch (err: any) {
      const message = err?.message ? String(err.message) : "Analiz başlatılamadı."
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="w-full max-w-lg">
        <div className="mb-6 text-center">
          <p className="text-sm uppercase tracking-wide text-zinc-500">Adım 1 / 2</p>
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
            Şu an sadece TikTok profiliyle çalışıyoruz. Kullanıcı adını girdiğinde analiz birkaç dakika içinde hazırlanır.
          </p>
        </form>
      </div>
    </div>
  )
}

// --------------------------------------------------------
//  Markdown renderer (inline + block + table support)
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
      // **bold**
      nodes.push(
        <strong key={`${keyBase}-strong-${matchIndex}`}>
          {renderInlineMarkdown(match[1], `${keyBase}-strong-${matchIndex}`)}
        </strong>
      )
    } else if (match[2]) {
      // *italic*
      nodes.push(
        <em key={`${keyBase}-em-${matchIndex}`}>
          {renderInlineMarkdown(match[2], `${keyBase}-em-${matchIndex}`)}
        </em>
      )
    } else if (match[3]) {
      // `code`
      nodes.push(
        <code
          key={`${keyBase}-code-${matchIndex}`}
          className="rounded bg-zinc-800 px-1 py-0.5 text-xs"
        >
          {match[3]}
        </code>
      )
    } else if (match[4] && match[5]) {
      // [label](url)
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

  // tablo: header + rows
  let tableBuffer: { header: string[] | null; rows: string[][] } | null = null

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
      <blockquote
        key={quoteKey}
        className="space-y-2 border-l-2 border-zinc-700 pl-4 text-zinc-300"
      >
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

  const flushTable = () => {
    if (!tableBuffer) return

    const tableKey = `md-table-${blockIndex}`
    const header = tableBuffer.header
    const rows = tableBuffer.rows

    blocks.push(
      <div key={tableKey} className="overflow-x-auto">
        <table className="w-full border-collapse text-sm text-zinc-200">
          {header && (
            <thead>
              <tr>
                {header.map((cell, ci) => (
                  <th
                    key={`${tableKey}-head-${ci}`}
                    className="border border-zinc-800 bg-zinc-900 px-3 py-2 text-left font-semibold"
                  >
                    {renderInlineMarkdown(cell, `${tableKey}-head-${ci}`)}
                  </th>
                ))}
              </tr>
            </thead>
          )}
          <tbody>
            {rows.map((row, ri) => (
              <tr key={`${tableKey}-row-${ri}`} className="border-t border-zinc-800">
                {row.map((cell, ci) => (
                  <td
                    key={`${tableKey}-cell-${ri}-${ci}`}
                    className="border border-zinc-800 px-3 py-2 align-top"
                  >
                    {renderInlineMarkdown(cell, `${tableKey}-cell-${ri}-${ci}`)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )

    blockIndex += 1
    tableBuffer = null
  }

  for (const line of lines) {
    const trimmedLine = line.trim()

    // CODE BLOCK MODU
    if (inCodeBlock) {
      if (trimmedLine.startsWith("```") || trimmedLine.startsWith("~~~")) {
        flushCode()
        inCodeBlock = false
        continue
      }

      codeBuffer.push(line)
      continue
    }

    // Kod bloğu başlangıcı
    if (trimmedLine.startsWith("```") || trimmedLine.startsWith("~~~")) {
      flushList()
      flushQuote()
      flushTable()
      inCodeBlock = true
      codeBuffer = []
      continue
    }

    // Boş satır
    if (!trimmedLine) {
      flushList()
      flushQuote()
      flushTable()
      continue
    }

    // TABLO satırı mı?
    const isTableRow = /^\|(.+)\|$/.test(trimmedLine)
    if (isTableRow) {
      // |---|---| ayırıcı satır mı?
      const isSeparator = /^\|\s*(:?-+:?\s*\|)+\s*$/.test(trimmedLine)

      if (isSeparator) {
        // header sonrası separator satırı: sadece yutuyoruz
        if (!tableBuffer) {
          // header yoksa görmezden gel
        }
        continue
      }

      // gerçek hücreler
      const cells = trimmedLine
        .split("|")
        .slice(1, -1)
        .map((c) => c.trim())

      // tablo ilk defa başlıyorsa: önce diğer blokları flush et
      if (!tableBuffer) {
        flushList()
        flushQuote()
        flushCode()
        tableBuffer = {
          header: cells,
          rows: [],
        }
      } else {
        // mevcut tabloya satır ekle
        tableBuffer.rows.push(cells)
      }

      continue
    } else {
      // tablo bitiyorsa flush et
      flushTable()
    }

    // QUOTE satırı
    if (trimmedLine.startsWith(">")) {
      flushList()
      if (!quoteBuffer) {
        quoteBuffer = []
      }
      quoteBuffer.push(trimmedLine.replace(/^>\s?/, ""))
      continue
    }

    flushQuote()

    // BAŞLIK
    const headingMatch = trimmedLine.match(/^(#{1,6})\s+(.*)$/)
    if (headingMatch) {
      flushList()
      const level = Math.min(headingMatch[1].length, 3)
      const content = headingMatch[2].trim()
      const sizeClass =
        level === 1 ? "text-xl" : level === 2 ? "text-lg" : "text-base"

      blocks.push(
        <h4
          key={`md-heading-${blockIndex}`}
          className={`font-semibold text-white ${
            sizeClass !== "text-base" ? sizeClass : ""
          } leading-tight`}
        >
          {renderInlineMarkdown(content, `heading-${blockIndex}`)}
        </h4>
      )

      blockIndex += 1
      continue
    }

    // BULLET list
    if (/^[-*+]\s+/.test(trimmedLine)) {
      const item = trimmedLine.replace(/^[-*+]\s+/, "")
      if (!listBuffer || listBuffer.ordered) {
        flushList()
        listBuffer = { ordered: false, items: [] }
      }
      listBuffer.items.push(item)
      continue
    }

    // NUMARALI list
    if (/^\d+\.\s+/.test(trimmedLine)) {
      const item = trimmedLine.replace(/^\d+\.\s+/, "")
      if (!listBuffer || !listBuffer.ordered) {
        flushList()
        listBuffer = { ordered: true, items: [] }
      }
      listBuffer.items.push(item)
      continue
    }

    // HR (---)
    if (/^(-{3,}|\*{3,}|_{3,})$/.test(trimmedLine)) {
      flushList()
      flushTable()
      blocks.push(<hr key={`md-hr-${blockIndex}`} className="border-zinc-800" />)
      blockIndex += 1
      continue
    }

    // Normal paragraf
    flushList()

    blocks.push(
      <p key={`md-p-${blockIndex}`} className="leading-relaxed">
        {renderInlineMarkdown(trimmedLine, `paragraph-${blockIndex}`)}
      </p>
    )

    blockIndex += 1
  }

  // Loop bitince kalan buffer'ları flush et
  if (inCodeBlock) {
    flushCode()
  }

  flushList()
  flushQuote()
  flushTable()

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

  const fetchProfile = useCallback(async () => {
    if (!user?.email) return null
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
      return data
    } catch (err: any) {
      setError(err?.message || "Beklenmeyen hata")
      throw err
    } finally {
      setKvLoading(false)
    }
  }, [user?.email])

  useEffect(() => {
    fetchProfile().catch(() => undefined)
  }, [fetchProfile])

  // onboarding submit → analizi başlat
  const handleUsernameSubmit = async (cleanUsername: string) => {
    setError(null)
    const res = await fetch("/api/start-analysis", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ username: cleanUsername }),
    })

    if (!res.ok) {
      let message = `HTTP ${res.status}`
      try {
        const data = (await res.json()) as unknown
        if (data && typeof data === "object" && "error" in data) {
          message = String((data as { error: unknown }).error)
        }
      } catch {
        // ignore json parse errors
      }
      setError(message)
      throw new Error(message)
    }

    await fetchProfile()
  }

  const profileStatus = kvData?.profile?.status
  const username = kvData?.user?.username || kvData?.profile?.username

  // Analiz sonucu hazır olana kadar KV'yi tekrar tekrar çek
  useEffect(() => {
    if (!username) return
    const pendingStates = new Set(["pending", "analysis_running"])
    if (!profileStatus || !pendingStates.has(profileStatus)) return

    const id = setInterval(() => {
      fetchProfile().catch(() => undefined)
    }, 10000)

    return () => clearInterval(id)
  }, [profileStatus, username, fetchProfile])

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
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay }}
      >
        <Card className="bg-zinc-900/50 border-zinc-800 p-6">
          <h3 className="text-xl font-semibold text-white mb-4">{title}</h3>
          <MarkdownRenderer text={text} />
        </Card>
      </motion.div>
    )
  }

  // ----------------------------------------------------
  //  Derived data (TikTok + growth)
  // ----------------------------------------------------

  const bright: BrightDataProfile | undefined =
    (kvData?.profile as unknown as { brightdata_raw?: BrightDataProfile })?.brightdata_raw

  const profileResult = kvData?.profile?.result

  const currentFollowers = bright?.followers ?? null
  const totalLikes = bright?.likes ?? bright?.like_count ?? null
  const videosCount = bright?.videos_count ?? null
  const avgEngagement = bright?.awg_engagement_rate ?? null
  const likeER = bright?.like_engagement_rate ?? null
  const commentER = bright?.comment_engagement_rate ?? null

  // Roadmap’e göre kabaca +%20 follower projeksiyonu
  const projectedFollowers = currentFollowers ? Math.round(currentFollowers * 1.2) : null
  const growthDelta = currentFollowers && projectedFollowers
    ? projectedFollowers - currentFollowers
    : null

  const profilePicUrl =
    kvData?.profile?.profile_pic_url ||
    bright?.profile_pic_url_hd ||
    bright?.profile_pic_url ||
    undefined

  const showOnboarding = !kvLoading && !kvData?.profile?.username
  const loadingStatuses = useMemo(() => new Set(["pending", "analysis_running", "paid", "awaiting_payment"]), [])
  const isAnalysisLoading = profileStatus ? loadingStatuses.has(profileStatus) : false

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
            <div className="flex items-center gap-2">
              <Image
                src="/logo.png"
                alt="Fenomen Logo"
                width={40}
                height={40}
                className="h-8 w-28 object-contain"
                priority
              />
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
                  TikTok profil verilerini topluyor, içerik performansını analiz ediyor ve büyüme
                  yol haritanı oluşturuyoruz. Bu işlem genellikle 1–3 dakika sürer.
                </p>
              </div>
            </div>
          )}

          {/* 3) Profil & sonuçlar – yeni layout */}
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
                  TikTok hesabının bugünkü durumu ve 6 aylık büyüme yolculuğu burada.
                </p>
                <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-zinc-500">
                  <span>{formattedDate}</span>
                  {user?.userId && (
                    <span className="text-zinc-600">
                      Kullanıcı ID: <span className="font-mono">#{user.userId.substring(0, 8)}</span>
                    </span>
                  )}
                </div>
                {kvLoading && <p className="text-sm text-zinc-500 mt-2">KV verisi yükleniyor…</p>}
                {error && <p className="text-sm text-red-400 mt-2">Hata: {error}</p>}
              </div>

              {/* KPI Grid – mevcut durum + potansiyel */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
                {/* Takipçi & Potansiyel */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.05 }}
                >
                  <Card className="bg-zinc-900/60 border-zinc-800 p-6 h-full flex flex-col">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-zinc-400 text-xs uppercase tracking-wide mb-1">
                          Takipçi & Büyüme Yolculuğu
                        </p>
                        <p className="text-2xl font-bold text-white">
                          {formatCompactNumber(currentFollowers)}
                        </p>
                        <p className="text-xs text-zinc-500 mt-1">
                          Şu anki takipçi sayın
                        </p>
                      </div>
                      <div className="w-10 h-10 bg-[#e78a53]/10 rounded-lg flex items-center justify-center text-[#e78a53] text-lg">
                        ↑
                      </div>
                    </div>

                    {projectedFollowers && (
                      <div className="mt-4 border-t border-zinc-800 pt-3">
                        <p className="text-[11px] text-zinc-400 mb-1">
                          Roadmap&apos;i uygularsan tahmini 6 ay projeksiyonu:
                        </p>
                        <div className="flex items-baseline gap-2">
                          <span className="text-base font-semibold text-[#e78a53]">
                            {formatCompactNumber(projectedFollowers)}
                          </span>
                          {growthDelta && (
                            <span className="text-xs text-green-400">
                              (+{formatCompactNumber(growthDelta)})
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </Card>
                </motion.div>

                {/* Etkileşim */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  <Card className="bg-zinc-900/60 border-zinc-800 p-6 h-full flex flex-col">
                    <p className="text-zinc-400 text-xs uppercase tracking-wide mb-1">
                      Ortalama Etkileşim Oranı
                    </p>
                    <p className="text-2xl font-bold text-white">
                      {avgEngagement ? formatPercent(avgEngagement) : "-"}
                    </p>
                    <p className="text-xs text-zinc-500 mt-1">
                      Son dönem genel ortalama (like + yorum)
                    </p>
                    <div className="mt-4 grid grid-cols-2 gap-3 text-[11px] text-zinc-400">
                      <div>
                        <p className="mb-0.5">Like ER</p>
                        <p className="text-xs text-zinc-200">
                          {likeER ? formatPercent(likeER) : "-"}
                        </p>
                      </div>
                      <div>
                        <p className="mb-0.5">Yorum ER</p>
                        <p className="text-xs text-zinc-200">
                          {commentER ? formatPercent(commentER) : "-"}
                        </p>
                      </div>
                    </div>
                  </Card>
                </motion.div>

                {/* Video & Hero içerikler */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.15 }}
                >
                  <Card className="bg-zinc-900/60 border-zinc-800 p-6 h-full flex flex-col">
                    <p className="text-zinc-400 text-xs uppercase tracking-wide mb-1">
                      İçerik Hacmi
                    </p>
                    <p className="text-2xl font-bold text-white">
                      {formatCompactNumber(videosCount)}
                    </p>
                    <p className="text-xs text-zinc-500 mt-1">
                      Toplam video sayısı
                    </p>
                    <div className="mt-4 border-t border-zinc-800 pt-3 text-xs text-zinc-400">
                      Toplam beğeni:{" "}
                      <span className="text-zinc-200">
                        {formatCompactNumber(totalLikes)}
                      </span>
                    </div>
                  </Card>
                </motion.div>

                {/* Sistem / meta */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <Card className="bg-zinc-900/60 border-zinc-800 p-6 h-full flex flex-col justify-between">
                    <div>
                      <p className="text-zinc-400 text-xs uppercase tracking-wide mb-1">
                        Hesap Durumu
                      </p>
                      <p className="text-2xl font-bold text-green-400">
                        {profileStatus === "done" ? "Analiz Hazır" : "Aktif"}
                      </p>
                      <p className="text-xs text-zinc-500 mt-1">
                        Fenomen analiz sistemi ile eşleştirildi.
                      </p>
                    </div>
                    <div className="mt-4 border-t border-zinc-800 pt-3 text-[11px] text-zinc-500 space-y-1">
                      {kvData?.profile?.ts && (
                        <p>
                          Son KV güncellemesi:{" "}
                          <span className="text-zinc-300">
                            {new Date(kvData.profile.ts).toLocaleString("tr-TR")}
                          </span>
                        </p>
                      )}
                      <p>
                        E-posta:{" "}
                        <span className="text-zinc-300">{kvData?.email}</span>
                      </p>
                    </div>
                  </Card>
                </motion.div>
              </div>

              {/* Ana layout: Sol profil / Sağ analiz kartları */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
                {/* Profil Kartı + Top Videolar */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.25 }}
                  className="lg:col-span-1"
                >
                  <Card className="bg-zinc-900/60 border-zinc-800 p-6 h-full flex flex-col gap-6">
                    <div className="flex items-start gap-4">
                      {profilePicUrl ? (
                        <img
                          src={profilePicUrl}
                          alt={bright?.nickname || username || "Profil fotoğrafı"}
                          className="h-20 w-20 rounded-full border border-zinc-700 object-cover"
                        />
                      ) : (
                        <div className="h-20 w-20 rounded-full border border-zinc-800 bg-zinc-900 grid place-items-center text-zinc-500 text-2xl">
                          {username?.[0]?.toUpperCase() ?? "@"}
                        </div>
                      )}

                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-zinc-400 mb-0.5">TikTok Profilin</p>
                        <p className="text-lg font-semibold text-white truncate">
                          {bright?.nickname || username || "-"}
                        </p>
                        {username && (
                          <p className="text-sm text-zinc-500">@{username}</p>
                        )}
                        {bright?.biography && (
                          <p className="mt-2 text-xs text-zinc-300 line-clamp-3">
                            {bright.biography}
                          </p>
                        )}
                        <div className="mt-2 flex flex-wrap gap-2">
                          {bright?.url && (
                            <a
                              href={bright.url}
                              target="_blank"
                              rel="noreferrer"
                              className="text-xs text-[#e78a53] underline-offset-2 hover:underline"
                            >
                              TikTok profili
                            </a>
                          )}
                          {bright?.bio_link && (
                            <a
                              href={bright.bio_link}
                              target="_blank"
                              rel="noreferrer"
                              className="text-xs text-[#e78a53] underline-offset-2 hover:underline"
                            >
                              Bio linki
                            </a>
                          )}
                        </div>
                      </div>
                    </div>

                    {bright?.top_videos && bright.top_videos.length > 0 && (
                      <div className="border-t border-zinc-800 pt-4">
                        <p className="text-xs font-medium text-zinc-300 mb-3">
                          Hero içeriklerin (son dönem)
                        </p>
                        <div className="space-y-3">
                          {bright.top_videos.slice(0, 3).map((video) => (
                            <a
                              key={video.video_id}
                              href={video.video_url}
                              target="_blank"
                              rel="noreferrer"
                              className="flex items-center gap-3 group"
                            >
                              {video.cover_image ? (
                                <img
                                  src={video.cover_image}
                                  alt=""
                                  className="h-12 w-20 rounded-md object-cover border border-zinc-800 group-hover:border-[#e78a53]/60 transition-colors"
                                />
                              ) : (
                                <div className="h-12 w-20 rounded-md bg-zinc-900 border border-zinc-800 grid place-items-center text-xs text-zinc-500">
                                  Video
                                </div>
                              )}
                              <div className="flex-1 min-w-0">
                                <p className="text-xs text-zinc-300 truncate group-hover:text-white transition-colors">
                                  {video.video_id}
                                </p>
                                <p className="text-[11px] text-zinc-500 mt-0.5">
                                  {formatCompactNumber(video.playcount)} izlenme ·{" "}
                                  {formatCompactNumber(video.diggcount)} like
                                </p>
                              </div>
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </Card>
                </motion.div>

                {/* Analiz & Strateji Kartları */}
                <div className="lg:col-span-2 space-y-8">
                  {/* Analiz bloğu */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <SectionCard
                      title="Profil Özeti"
                      text={profileResult?.profile_summary}
                      delay={0.1}
                    />
                    <SectionCard
                      title="İçerik Performans Desenleri"
                      text={profileResult?.content_patterns}
                      delay={0.15}
                    />
                  </div>

                  {/* Zayıflar & Roadmap */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <SectionCard
                      title="Zayıf Noktalar & Gelişim Alanları"
                      text={profileResult?.weaknesses}
                      delay={0.2}
                    />
                    <SectionCard
                      title="30 Günlük İçerik Roadmap"
                      text={profileResult?.roadmap}
                      delay={0.25}
                    />
                  </div>

                  {/* Hook & Marka */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <SectionCard
                      title="Hook & Caption Bankası"
                      text={profileResult?.hooks}
                      delay={0.3}
                    />
                    <SectionCard
                      title="Markalaşma & Kimlik Önerileri"
                      text={profileResult?.branding}
                      delay={0.35}
                    />
                  </div>

                  {/* Büyüme & Sonuç */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <SectionCard
                      title="Büyüme Projeksiyonu (6 Ay)"
                      text={profileResult?.growth_projection}
                      delay={0.4}
                    />
                    <SectionCard
                      title="Genel Değerlendirme & Sonuç"
                      text={profileResult?.final_summary}
                      delay={0.45}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </main>
      </div>
    </div>
  )
}
