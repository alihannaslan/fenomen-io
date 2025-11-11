// app/api/result-update/route.ts
/// <reference types="@cloudflare/workers-types" />
import { getRequestContext } from "@cloudflare/next-on-pages";

export const runtime = "edge";

type Bindings = {
  USERS_KV: KVNamespace;
  N8N_TOKEN?: string;
};

// ---------------------------------------------------------
// GET  /api/result-update?diag=1        → ortam teşhis bilgisi
// GET  /api/result-update?peek=username → KV içeriğini göster
// ---------------------------------------------------------
export async function GET(req: Request) {
  const { env } = getRequestContext();
  const { searchParams } = new URL(req.url);

  // Teşhis modu
  if (searchParams.get("diag")) {
    const hasKV = !!(env as any)?.USERS_KV;
    const token = (env as any)?.N8N_TOKEN as string | undefined;
    const hasToken = !!token && token.length > 0;

    let tokenLen = 0;
    let tokenSha256: string | null = null;
    if (hasToken) {
      tokenLen = token!.length;
      const enc = new TextEncoder().encode(token!);
      const digest = await crypto.subtle.digest("SHA-256", enc);
      tokenSha256 = Array.from(new Uint8Array(digest))
        .map(b => b.toString(16).padStart(2, "0"))
        .join("");
    }

    return Response.json({
      ok: true,
      hasUSERS_KV: hasKV,
      hasN8N_TOKEN: hasToken,
      n8n_token_len: tokenLen,
      n8n_token_sha256: tokenSha256,
    });
  }

  // Hızlı bakış: KV'deki sonucu getir
  const peekUsername = (searchParams.get("peek") || "").replace(/^@/, "").trim();
  if (peekUsername) {
    const { USERS_KV } = env as unknown as Bindings;
    const key = `result:${peekUsername}`;
    const val = await USERS_KV.get(key, "json");
    return Response.json({ key, value: val ?? null });
  }

  // Varsayılan bilgi
  return Response.json({ ok: true, info: "POST ile güncelleyin. Tanılama için ?diag=1, KV okuma için ?peek=username kullanın." });
}

// ---------------------------------------------------------
// POST /api/result-update
// Body: { username: string, result: any, meta?: any }
// Header: Authorization: Bearer <N8N_TOKEN>
// ---------------------------------------------------------
export async function POST(req: Request) {
  try {
    const { env } = getRequestContext();
    const { USERS_KV, N8N_TOKEN } = env as unknown as Bindings;

    // Authorization (case-insensitive header; Bearer <token>)
    const authRaw =
      req.headers.get("authorization") ||
      req.headers.get("Authorization") ||
      "";
    const incoming = authRaw.startsWith("Bearer ")
      ? authRaw.slice(7).trim()
      : "";

    if (N8N_TOKEN && incoming !== N8N_TOKEN) {
      return Response.json({ error: "unauthorized" }, { status: 401 });
    }

    const body = (await req.json().catch(() => ({}))) as {
      username?: string;
      result?: unknown;
      meta?: unknown;
    };

    const username = String(body.username || "").replace(/^@/, "").trim();
    if (!username || typeof body.result === "undefined") {
      return Response.json(
        { error: "username and result required" },
        { status: 400 }
      );
    }

    const key = `result:${username}`;
    const payload = {
      status: "done",
      username,
      result: body.result,
      meta: body.meta ?? null,
      ts: Date.now(),
    };

    await USERS_KV.put(key, JSON.stringify(payload));
    return Response.json({ ok: true });
  } catch (err: any) {
    return Response.json(
      { error: "exception", message: String(err?.message || err) },
      { status: 500 }
    );
  }
}
