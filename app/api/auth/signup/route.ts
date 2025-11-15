// app/api/auth/signup/route.ts
import { NextResponse } from "next/server"
import { createSession, setSessionCookie } from "@/lib/session"

export const runtime = "edge"

// n8n tarafındaki webhook URL'n
// .env.local ve Cloudflare Pages Env içine ekle:
// N8N_SIGNUP_WEBHOOK_URL=https://n8n.xxx/webhook/....
const N8N_SIGNUP_WEBHOOK_URL = process.env.N8N_SIGNUP_WEBHOOK_URL

export async function POST(request: Request) {
  try {
const body = (await request.json()) as {
  email?: string
  password?: string
  name?: string
  username?: string
}

const { email, password, name, username } = body

    // Basit validation
    if (!email || !password || !name) {
      return NextResponse.json(
        { error: "Email, şifre ve isim zorunludur." },
        { status: 400 },
      )
    }

    // Kullanıcı objesini basitçe oluştur (şimdilik KV'ye kaydetmeden)
    const user = {
      id: crypto.randomUUID(),
      email,
      name,
      username: username || email.split("@")[0],
    }

    // ✅ n8n webhook'una haber ver
    if (N8N_SIGNUP_WEBHOOK_URL) {
      try {
        await fetch(N8N_SIGNUP_WEBHOOK_URL, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            event: "signup",
            email: user.email,
            name: user.name,
            username: user.username,
            source: "fenomen.io",
          }),
        })
      } catch (err) {
        console.error("n8n webhook error:", err)
        // webhook patlasa bile signup'ı bozmuyoruz
      }
    } else {
      console.warn("N8N_SIGNUP_WEBHOOK_URL tanımlı değil")
    }

    // Session oluştur
    const token = await createSession(user.id, user.email, user.name)
    await setSessionCookie(token)

    return NextResponse.json(
      {
        success: true,
        user,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Signup error:", error)
    return NextResponse.json({ error: "Sunucu hatası oluştu" }, { status: 500 })
  }
}
