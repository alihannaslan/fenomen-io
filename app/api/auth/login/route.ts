import { NextResponse } from "next/server"
import { getRequestContext } from "@cloudflare/next-on-pages"
import { createSession, setSessionCookie } from "@/lib/session"
import { verifyUserPassword } from "@/lib/kv-store"

export const runtime = "edge"

const useLocalKv = process.env.USE_LOCAL_KV === "true"

type LoginBody = {
  email?: string
  password?: string
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as LoginBody
    const email = body?.email?.toString().trim() ?? ""
    const password = body?.password?.toString() ?? ""

    // 1) Input validation
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email ve şifre gereklidir" },
        { status: 400 },
      )
    }

    let user:
      | {
          id: string
          email: string
          name: string
          username?: string
        }
      | null = null

    // 2) LOCAL MOD: KV olmadan fake login
    if (useLocalKv) {
      // Lokal geliştirme için test kullanıcı
      if (email === "test@local.dev" && password === "123456") {
        user = {
          id: "local-user",
          email,
          name: "Local User",
          username: "localuser",
        }
      } else {
        return NextResponse.json(
          { error: "Email veya şifre hatalı (local)" },
          { status: 401 },
        )
      }
    } else {
      // 3) PROD MOD: Cloudflare KV ile gerçek doğrulama
      const { env } = getRequestContext()
      const kv = (env as any)?.USERS_KV

      if (!kv) {
        console.error("USERS_KV binding bulunamadı")
        return NextResponse.json(
          { error: "Depolama bağlantısı kurulamadı" },
          { status: 500 },
        )
      }

      // BURADA artık senin imzandaki gibi KV ile çağırıyoruz
      user = await verifyUserPassword(kv, email, password)
    }

    if (!user) {
      return NextResponse.json(
        { error: "Email veya şifre hatalı" },
        { status: 401 },
      )
    }

    // 4) Session oluştur ve cookie yaz
    const token = await createSession(user.id, user.email, user.name)
    await setSessionCookie(token)

    return NextResponse.json(
      {
        success: true,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          username: user.username ?? null,
        },
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json(
      { error: "Sunucu hatası oluştu" },
      { status: 500 },
    )
  }
}
