import { NextResponse } from "next/server"
import { createSession, setSessionCookie } from "@/lib/session"
import { verifyUserPassword } from "@/lib/kv-store"
import type { KVNamespace } from "@cloudflare/workers-types"

export const runtime = "edge"

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    // Validate input
    if (!email || !password) {
      return NextResponse.json({ error: "E-posta ve şifre gereklidir" }, { status: 400 })
    }

    // @ts-ignore - Cloudflare specific context
    const kv: KVNamespace = request.cf?.env?.USERS_KV || process.env.USERS_KV

    if (!kv) {
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
