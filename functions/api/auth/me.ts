/// <reference types="@cloudflare/workers-types" />

import { jwtVerify } from "jose"
const cookieName = "auth_token"

export const onRequestGet: PagesFunction = async (ctx) => {
  const cookie = ctx.request.headers.get("Cookie") ?? ""
  const token = cookie.split("; ").find(c => c.startsWith(`${cookieName}=`))?.split("=")[1]
  if (!token) return new Response(JSON.stringify({ authenticated: false }), { status: 200 })

  try {
    const secret = new TextEncoder().encode(getSecret())
    const { payload } = await jwtVerify(token, secret)
    return new Response(JSON.stringify({ authenticated: true, user: payload }), { status: 200 })
  } catch {
    return new Response(JSON.stringify({ authenticated: false }), { status: 200 })
  }
}

function getSecret() {
  return (globalThis as any).JWT_SECRET ?? "dev-secret-change-me"
}
