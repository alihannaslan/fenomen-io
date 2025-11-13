import { NextResponse } from "next/server"
import { getSession } from "@/lib/session"
import { findUserById } from "@/lib/kv-store"
import { getRequestContext } from "@cloudflare/next-on-pages"
import type { KVNamespace } from "@cloudflare/workers-types"

const useLocalKv = process.env.USE_LOCAL_KV === "true"

export const runtime = "edge"

export async function GET(request: Request) {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json({ error: "Oturum bulunamadı" }, { status: 401 })
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
