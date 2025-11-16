/// <reference types="@cloudflare/workers-types" />
import { getRequestContext } from "@cloudflare/next-on-pages"

export const runtime = "edge"

// Local geliştirme için flag (Cloudflare KV yerine env'den okuma vs. yapabilmek için)
const useLocalKv = process.env.USE_LOCAL_KV === "true"

// Cloudflare Pages binding tipi
type Bindings = { USERS_KV: KVNamespace }

export async function GET(
  _req: Request,
  { params }: { params: { username: string } }
) {
  try {
    const rawUsername = params?.username ?? ""
    const clean = rawUsername.replace(/^@/, "").trim()

    if (!clean) {
      return Response.json(
        {
          error: "missing_username",
          message: "Username param is required",
        },
        { status: 400 }
      )
    }

    // 🔹 Local geliştirme modu (USE_LOCAL_KV="true" ise)
    if (useLocalKv) {
      // İstersen .env.local içine LOCAL_RESULT_JSON ile dummy JSON koyup test edebilirsin
      const local = process.env.LOCAL_RESULT_JSON

      if (!local) {
        return Response.json(
          {
            status: "not_found",
            username: clean,
            local: true,
          },
          { status: 404 }
        )
      }

      try {
        const parsed = JSON.parse(local)
        return Response.json(parsed)
      } catch {
        return Response.json(
          {
            error: "invalid_local_json",
            message: "LOCAL_RESULT_JSON geçerli bir JSON değil",
          },
          { status: 500 }
        )
      }
    }

    // 🔹 Cloudflare KV (USERS_KV binding'i)
    const { env } = getRequestContext()
    const { USERS_KV } = env as unknown as Bindings

    if (!USERS_KV) {
      return Response.json(
        {
          error: "kv_binding_not_found",
          message: "KV binding USERS_KV bu ortamda tanımlı değil",
        },
        { status: 500 }
      )
    }

    // KV key pattern: result:<username>  → örnek: result:canselbicer
    const data = await USERS_KV.get(`result:${clean}`, "json")

    if (!data) {
      return Response.json(
        {
          status: "not_found",
          username: clean,
        },
        { status: 404 }
      )
    }

    // KV’de zaten JSON tuttuğumuz için direkt geri döndürüyoruz
    return Response.json(data)
  } catch (err: any) {
    return Response.json(
      {
        error: "exception",
        message: String(err?.message ?? err),
      },
      { status: 500 }
    )
  }
}
