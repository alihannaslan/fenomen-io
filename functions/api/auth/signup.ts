/// <reference types="@cloudflare/workers-types" />

export const onRequestPost: PagesFunction<{ USERS: KVNamespace }> = async (ctx) => {
  try {
    const body = await ctx.request.json() as { email?: string; password?: string; name?: string }
    const email = (body.email ?? "").trim().toLowerCase()
    const password = body.password ?? ""
    const name = (body.name ?? "").trim()

    if (!email || !password) {
      return new Response(JSON.stringify({ error: "Missing fields" }), { status: 400 })
    }

    // e-posta var mı?
    const existing = await ctx.env.USERS.get(`user:${email}`, { type: "json" }) as any | null
    if (existing) {
      return new Response(JSON.stringify({ error: "Email already exists" }), { status: 409 })
    }

    // bcryptjs pure JS — Workers’ta çalışır
    const { hashSync, genSaltSync } = await import("bcryptjs")
    const password_hash = hashSync(password, genSaltSync(10))

    const user = {
      email,
      name,
      password_hash,
      created_at: new Date().toISOString(),
    }

    await ctx.env.USERS.put(`user:${email}`, JSON.stringify(user))

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    })
  } catch {
    return new Response(JSON.stringify({ error: "Unexpected error" }), { status: 500 })
  }
}
