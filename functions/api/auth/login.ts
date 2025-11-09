import { SignJWT } from "jose"

const cookieName = "auth_token"
const maxAgeSec = 60 * 60 * 24 * 7 // 7 gün

export const onRequestPost: PagesFunction<{ USERS: KVNamespace }> = async (ctx) => {
  try {
    const body = await ctx.request.json() as { email?: string; password?: string }
    const email = (body.email ?? "").trim().toLowerCase()
    const password = body.password ?? ""

    if (!email || !password) {
      return new Response(JSON.stringify({ error: "Missing fields" }), { status: 400 })
    }

    const user = await ctx.env.USERS.get(`user:${email}`, { type: "json" }) as any | null
    if (!user) return new Response(JSON.stringify({ error: "Invalid credentials" }), { status: 401 })

    const { compareSync } = await import("bcryptjs")
    const ok = compareSync(password, user.password_hash)
    if (!ok) return new Response(JSON.stringify({ error: "Invalid credentials" }), { status: 401 })

    const secret = new TextEncoder().encode(getSecret())
    const token = await new SignJWT({ sub: email, name: user.name })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime(`${maxAgeSec}s`)
      .sign(secret)

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: {
        "Set-Cookie": `${cookieName}=${token}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${maxAgeSec}`,
        "Content-Type": "application/json",
      },
    })
  } catch {
    return new Response(JSON.stringify({ error: "Unexpected error" }), { status: 500 })
  }
}

function getSecret() {
  // Pages → Settings → Environment variables → JWT_SECRET
  return (globalThis as any).JWT_SECRET ?? "dev-secret-change-me"
}
