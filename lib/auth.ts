// lib/auth.ts  (Cloudflare KV + JWT uyumlu, DB YOK)
import { cookies } from "next/headers"
import { jwtVerify } from "jose"

type ApiMe = {
  authenticated: boolean
  user?: { sub?: string; name?: string }
}

// SSR tarafında env varsa sunucuda JWT doğrularız; yoksa /api/auth/me'ye düşeriz.
function getSecret() {
  return process.env.JWT_SECRET ?? "dev-secret-change-me"
}

/** Server Component içinde kullan (varsa env ile cookie doğrular, yoksa /api/auth/me’ye fallback yap) */
export async function getCurrentUser() {
  // 1) SSR: Cookie oku
  const token = cookies().get("auth_token")?.value
  if (!token) return null

  // 2) Env varsa sunucuda doğrula (daha hızlı)
  try {
    const secret = new TextEncoder().encode(getSecret())
    const { payload } = await jwtVerify(token, secret)
    return {
      email: (payload.sub as string) || "",
      name: (payload.name as string) || "",
    }
  } catch {
    // 3) Fallback: API'ye sor (Functions doğrular)
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL ?? ""}/api/auth/me`, {
        cache: "no-store",
      })
      const data = (await res.json()) as ApiMe

      if (data && data.authenticated && data.user) {
        return {
          email: data.user.sub ?? "",
          name: data.user.name ?? "",
        }
      }
    } catch {
      // yut
    }
    return null
  }
}

/** Client’ta kullan (ör: useEffect içinde) */
export async function getCurrentUserClient(): Promise<{ email: string; name: string } | null> {
  try {
    const res = await fetch("/api/auth/me", { cache: "no-store" })
    const data = (await res.json()) as ApiMe
    if (data && data.authenticated && data.user) {
      return { email: data.user.sub ?? "", name: data.user.name ?? "" }
    }
  } catch {
    // yut
  }
  return null
}

/** Signup — frontend’ten çağır (sayfandaki fetch ile aynı endpoint) */
export async function signup(email: string, password: string, name?: string) {
  const res = await fetch("/api/auth/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, name }),
  })
  if (!res.ok) {
    const data = await res.json().catch(() => ({} as any))
    throw new Error((data as any)?.error || "Signup failed")
  }
  return true
}

/** Login — başarılıysa HttpOnly cookie set olur */
export async function login(email: string, password: string) {
  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  })
  if (!res.ok) {
    const data = await res.json().catch(() => ({} as any))
    throw new Error((data as any)?.error || "Login failed")
  }
  return true
}

/** Logout — /api/auth/logout Functions dosyasını da ekle */
export async function logout() {
  const res = await fetch("/api/auth/logout", { method: "POST" })
  return res.ok
}
