/// <reference types="@cloudflare/workers-types" />
import { getRequestContext } from "@cloudflare/next-on-pages";

export const runtime = "edge";

type Bindings = {
  USERS_KV: KVNamespace;
  N8N_TOKEN?: string; // varsa doğrulama yapacağız
};

export async function POST(req: Request) {
  try {
    // Cloudflare Pages env/bindings
    const { env } = getRequestContext();
    const { USERS_KV, N8N_TOKEN } = env as unknown as Bindings;

    // (Opsiyonel ama önerilir) Bearer auth
    const auth = req.headers.get("authorization") || "";
    const token = auth.startsWith("Bearer ") ? auth.slice(7) : "";
    if (N8N_TOKEN && token !== N8N_TOKEN) {
      return Response.json({ error: "unauthorized" }, { status: 401 });
    }

    const body = (await req.json().catch(() => ({}))) as {
      username?: string;
      result?: unknown;
      meta?: unknown;
    };

    const username = String(body.username || "").replace(/^@/, "").trim();
    if (!username || typeof body.result === "undefined") {
      return Response.json({ error: "username and result required" }, { status: 400 });
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
