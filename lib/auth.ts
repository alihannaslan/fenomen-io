// lib/auth.ts  (Cloudflare Pages + Next.js Edge uyumlu, DB YOK)
import { cookies } from "next/headers"
import { jwtVerify } from "jose"

/** API /auth/me yanıtı için hafif tip */
type ApiMe = {
  authenticated: boolean
  user?: { sub?: string; name?: string }
}

/** Uygulama içinde kullanacağımız minimal kullanıcı şekli */
export type CurrentUser = { email: string; name: string }

/** Edge'de process.env her zaman mevcut olmayabilir; varsa kullanırız, yoksa null döneriz */
function getServerSecret(): string | null {
  // Cloudflare Pages Functions’ta process.env genelde yoktur.
  // Varsa alırız; yoksa null dönüp /api/auth/me fallback’ine düşeriz.
  const s = process.env?.JWT_SECRET
  return s && s.trim() ? s : null
}

/** Küçük yardımcı: güvenli JSON parse */
async function safeJSON<T = unknown>(res: Response): Promise<T | null> {
  try {
    return (await res.json()) as T
  } catch {
    return null
  }
}

/**
 * Server Component içinde kullan.
 * 1) Cookie'den token oku
 * 2) Eğer sunucuda secret varsa JWT’yi burada doğrula (hızlı yol)
 * 3) Değilse /api/auth/me endpoint’ine sor (Functions tarafında doğrulanır)
 */
export async function getCurrentUser(): Promise<CurrentUser | null> {
  const token = cookies().get("auth_token")?.value
  if (!token) return null

  // 2) Hızlı yol: server secret mevcutsa burada doğrula
  const secret = getServerSecret()
  if (secret) {
    try {
      const key = new TextEncoder().encode(secret)
      const { payload } = await jwtVerify(token, key)
      return {
        email: (payload.sub as string) || "",
        name: (payload.name as string) || "",
      }
    } catch {
      // JWT doğrulanamadı -> API fallback
    }
  }

  // 3) Fallback: /api/auth/me
  try {
    const base = process.env.NEXT_PUBLIC_BASE_URL ?? ""
    const res = await fetch(`${base}/api/auth/me`, { cache: "no-store" })
    if (!res.ok) return null
    const data = await safeJSON<ApiMe>(res)
    if (data?.authenticated && data.user) {
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

/**
 * Client tarafı kullanım (örn. useEffect içinde)
 * Her zaman /api/auth/me üzerinden sorgular.
 */
export async function getCurrentUserClient(): Promise<CurrentUser | null> {
  try {
    const res = await fetch("/api/auth/me", { cache: "no-store" })
    if (!res.ok) return null
    const data = await safeJSON<ApiMe>(res)
    if (data?.authenticated && data.user) {
      return { email: data.user.sub ?? "", name: data.user.name ?? "" }
    }
  } catch {
    // yut
  }
  return null
}

/** Signup — başarılıysa server /api/auth/signup HttpOnly cookie set edebilir */
export async function signup(email: string, password: string, name?: string) {
  const res = await fetch("/api/auth/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, name }),
  })
  if (!res.ok) {
    const data = await safeJSON<{ error?: string }>(res)
    throw new Error(data?.error || "Signup failed")
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
    const data = await safeJSON<{ error?: string }>(res)
    throw new Error(data?.error || "Login failed")
  }
  return true
}

/** Logout — /api/auth/logout Functions dosyası cookie’yi temizlemeli */
export async function logout() {
  try {
    const res = await fetch("/api/auth/logout", { method: "POST" })
    return res.ok
  } catch {
    return false
  }
}
