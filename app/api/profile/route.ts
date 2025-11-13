// app/api/profile/route.ts
export const runtime = "edge"
import { getRequestContext } from "@cloudflare/next-on-pages"
import type { KVNamespace } from "@cloudflare/workers-types"

const useLocalKv = process.env.USE_LOCAL_KV === "true"

type Bindings = { USERS_KV: KVNamespace }

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const email = searchParams.get("email")
    if (!email) {
      return new Response(JSON.stringify({ error: "email query param required" }), { status: 400 })
    }

    if (useLocalKv) {
      const mod = await import("@/lib/mock-kv")
      const data = await mod.mockGetProfileForEmail(email)
      if (!data) {
        return new Response(JSON.stringify({ error: "Local mock verisi bulunamadı" }), { status: 404 })
      }
      return Response.json(data)
    }

    const { env } = getRequestContext()
    const { USERS_KV } = env as unknown as Bindings

    if (!USERS_KV) {
      return new Response(JSON.stringify({ error: "KV binding not found: USERS_KV" }), { status: 500 })
    }

    // 1) email:{email} -> "user_XXXXXXXX"
    const userPointer = await USERS_KV.get(`email:${email}`)
    if (!userPointer) {
      return new Response(JSON.stringify({ error: "User pointer not found for email" }), { status: 404 })
    }

    // 2) user:user_XXXXXXXX -> { id, email, name?, username? }
    const userObj = (await USERS_KV.get(`user:${userPointer}`, "json")) as
      | { id: string; email: string; name?: string; username?: string }
      | null

    if (!userObj?.username) {
      return new Response(JSON.stringify({ error: "Username not found on user object" }), { status: 404 })
    }

    const username = userObj.username.replace(/^@/, "").trim()

    // 3) result:{username} -> profil JSON’u
    const profile = await USERS_KV.get(`result:${username}`, "json")
    if (!profile) {
      return new Response(JSON.stringify({ error: "Result not found for username" }), { status: 404 })
    }

    return Response.json({ email, user: userObj, profile })
  } catch (err: any) {
    return new Response(JSON.stringify({ error: String(err?.message || err) }), { status: 500 })
  }
}
