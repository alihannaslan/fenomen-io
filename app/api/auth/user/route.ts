import { NextResponse } from "next/server"
import { getSession } from "@/lib/session"
import { findUserById } from "@/lib/kv-store"
import type { KVNamespace } from "@cloudflare/workers-types"

export const runtime = "edge"

export async function GET(request: Request) {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json({ error: "Oturum bulunamadı" }, { status: 401 })
    }

    // Get KV namespace from Cloudflare context
    // @ts-ignore - Cloudflare specific context
    const kv: KVNamespace = request.cf?.env?.USERS_KV || process.env.USERS_KV

    if (!kv) {
      return NextResponse.json({ error: "Depolama bağlantısı kurulamadı" }, { status: 500 })
    }

    const user = await findUserById(kv, session.userId)

    if (!user) {
      return NextResponse.json({ error: "Kullanıcı bulunamadı" }, { status: 404 })
    }

    return NextResponse.json({ user }, { status: 200 })
  } catch (error) {
    console.error("Get user error:", error)
    return NextResponse.json({ error: "Sunucu hatası oluştu" }, { status: 500 })
  }
}
