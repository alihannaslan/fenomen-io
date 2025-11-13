import { NextResponse } from "next/server"
import { createSession, setSessionCookie } from "@/lib/session"
import { verifyUserPassword } from "@/lib/kv-store"
import { getRequestContext } from "@cloudflare/next-on-pages"
import type { KVNamespace } from "@cloudflare/workers-types"

const useLocalKv = process.env.USE_LOCAL_KV === "true"

export const runtime = "edge"

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    // Validate input
    if (!email || !password) {
      return NextResponse.json({ error: "E-posta ve şifre gereklidir" }, { status: 400 })
    }

    let kv: KVNamespace | undefined
    if (!useLocalKv) {
      try {
        const { env } = getRequestContext()
        kv = (env as Record<string, unknown>)?.USERS_KV as KVNamespace | undefined
      } catch (error) {
        console.error("KV binding erişilemedi:", error)
      }
    }

    if (!kv && !useLocalKv) {
      return NextResponse.json({ error: "Depolama bağlantısı kurulamadı" }, { status: 500 })
    }

    const user = await verifyUserPassword(kv, email, password)

    if (!user) {
      return NextResponse.json({ error: "Geçersiz e-posta veya şifre" }, { status: 401 })
    }

    const token = await createSession(user.id, user.email, user.name)
    await setSessionCookie(token)

    return NextResponse.json(
      { success: true, user: { id: user.id, email: user.email, name: user.name, username: user.username } },
      { status: 200 },
    )
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Sunucu hatası oluştu" }, { status: 500 })
  }
}
