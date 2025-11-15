// app/api/start-analysis/route.ts
import { NextRequest, NextResponse } from "next/server"
import { getRequestContext } from "@cloudflare/next-on-pages"
import type { KVNamespace } from "@cloudflare/workers-types"
import { getSession } from "@/lib/session"
import type { User } from "@/lib/kv-store"

export const runtime = "edge"

const useLocalKv = process.env.USE_LOCAL_KV === "true"

type Bindings = {
  USERS_KV: KVNamespace
  N8N_URL?: string
  N8N_TOKEN?: string
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json({ error: "Oturum bulunamadı" }, { status: 401 })
    }

    const body = (await req.json().catch(() => null)) as { username?: string } | null
    const rawUsername = body?.username?.trim()

    if (!rawUsername) {
      return NextResponse.json({ error: "username gerekli" }, { status: 400 })
    }

    const clean = rawUsername.startsWith("@") ? rawUsername.slice(1) : rawUsername

    if (useLocalKv) {
      const mod = await import("@/lib/mock-kv")
      await mod.mockSetUserUsername(session.userId, clean)
      await mod.mockSavePendingResult(clean)
      return NextResponse.json({ ok: true, mode: "local" })
    }

    const { env } = getRequestContext()
    const { USERS_KV, N8N_URL, N8N_TOKEN } = env as unknown as Bindings

    if (!USERS_KV) {
      console.error("[start-analysis] USERS_KV binding bulunamadı")
      return NextResponse.json({ error: "Depolama bağlantısı kurulamadı" }, { status: 500 })
    }

    const userKey = `user:${session.userId}`
    const userRaw = await USERS_KV.get(userKey)

    if (!userRaw) {
      return NextResponse.json({ error: "Kullanıcı bulunamadı" }, { status: 404 })
    }

    const userData = JSON.parse(userRaw) as User
    userData.username = clean
    await USERS_KV.put(userKey, JSON.stringify(userData))

    const pendingPayload = {
      status: "analysis_running",
      username: clean,
      result: {},
      meta: {
        requestedBy: session.userId,
        email: userData.email,
      },
      ts: Date.now(),
    }

    await USERS_KV.put(`result:${clean}`, JSON.stringify(pendingPayload))

    if (N8N_URL && N8N_TOKEN) {
      fetch(N8N_URL, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          authorization: `Bearer ${N8N_TOKEN}`,
        },
        body: JSON.stringify({
          username: clean,
          userId: session.userId,
          email: userData.email,
        }),
      }).catch((err) => {
        console.error("[start-analysis] n8n webhook hatası", err)
      })
    }

    return NextResponse.json({ ok: true })
  } catch (err: any) {
    console.error("start-analysis error:", err)
    return NextResponse.json(
      { error: err?.message || "Internal error" },
      { status: 500 },
    )
  }
}
