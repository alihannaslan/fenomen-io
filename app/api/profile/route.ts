// app/api/profile/route.ts
import { NextRequest, NextResponse } from "next/server"
import { getRequestContext } from "@cloudflare/next-on-pages"
import type { KVNamespace } from "@cloudflare/workers-types"
import { findUserByEmail } from "@/lib/kv-store"

const useLocalKv = process.env.USE_LOCAL_KV === "true"

type Bindings = {
  USERS_KV: KVNamespace
}

export const runtime = "edge"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const email = searchParams.get("email")?.trim()

    if (!email) {
      return NextResponse.json({ error: "email gerekli" }, { status: 400 })
    }

    let kv: KVNamespace | undefined
    if (!useLocalKv) {
      const { env } = getRequestContext()
      kv = (env as unknown as Bindings).USERS_KV

      if (!kv) {
        console.error("[profile] USERS_KV binding bulunamadı")
        return NextResponse.json({ error: "Depolama bağlantısı kurulamadı" }, { status: 500 })
      }
    }

    const userRecord = await findUserByEmail(kv, email)

    if (!userRecord) {
      return NextResponse.json({ error: "Kullanıcı bulunamadı" }, { status: 404 })
    }

    const normalizedUsername = userRecord.username?.replace(/^@/, "").trim() || ""

    let profilePayload: Record<string, unknown> | null = null

    if (normalizedUsername) {
      if (useLocalKv) {
        const mod = await import("@/lib/mock-kv")
        profilePayload = (await mod.mockGetProfileByUsername(normalizedUsername)) as Record<string, unknown> | null
      } else if (kv) {
        profilePayload = (await kv.get(`result:${normalizedUsername}`, "json")) as Record<string, unknown> | null
      }
    }

    const fallbackProfile = {
      status: normalizedUsername ? "pending" : "awaiting_username",
      username: normalizedUsername,
      result: {},
    }

    const profile = profilePayload && typeof profilePayload === "object"
      ? profilePayload
      : fallbackProfile

    return NextResponse.json({
      email,
      user: {
        id: userRecord.id,
        email: userRecord.email,
        name: userRecord.name,
        username: normalizedUsername || null,
      },
      profile,
    })
  } catch (err: any) {
    console.error("profile error:", err)
    return NextResponse.json(
      { error: err?.message || "Internal error" },
      { status: 500 },
    )
  }
}
