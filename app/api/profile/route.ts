// app/api/profile/route.ts
export const runtime = "edge"

// next-on-pages kullanıyorsan:
import { getRequestContext } from "@cloudflare/next-on-pages"

// Eğer next-on-pages kullanmıyorsan, yukarıdaki importu kaldırıp aşağıdaki iki satırdan birini kullan:
// import { env } from "cloudflare:env" // (Next 15 + Cloudflare Pages modern)
// sonra: const kv = env.FENOMEN_KV as KVNamespace

export async function GET(req: Request) {
  try {
    // next-on-pages yolu:
    const { env } = getRequestContext() as unknown as { env: { FENOMEN_KV: KVNamespace } }
    const kv = env?.FENOMEN_KV
    if (!kv) {
      return new Response(JSON.stringify({ error: "KV binding not found: FENOMEN_KV" }), { status: 500 })
    }

    const url = new URL(req.url)
    const email = url.searchParams.get("email")
    if (!email) {
      return new Response(JSON.stringify({ error: "email query param required" }), { status: 400 })
    }

    // 1) email:... -> "user_XXXXXXXX"
    const userPointer = await kv.get(`email:${email}`)
    if (!userPointer) {
      return new Response(JSON.stringify({ error: "User pointer not found for email" }), { status: 404 })
    }

    // 2) user:user_XXXXXXXX -> { id, email, name, username, ... }
    const userObj = await kv.get(`user:${userPointer}`, { type: "json" }) as
      | { id: string; email: string; name?: string; username?: string }
      | null

    if (!userObj?.username) {
      return new Response(JSON.stringify({ error: "Username not found on user object" }), { status: 404 })
    }

    const username = userObj.username

    // 3) result:username -> profil JSON’un
    const profile = await kv.get(`result:${username}`, { type: "json" })
    if (!profile) {
      return new Response(JSON.stringify({ error: "Result not found for username" }), { status: 404 })
    }

    return Response.json({
      email,
      user: userObj,
      profile, // {status, username, result:{...}, ts, ...}
    })
  } catch (err) {
    console.error(err)
    return new Response(JSON.stringify({ error: "Unexpected error" }), { status: 500 })
  }
}
