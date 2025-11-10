/// <reference types="@cloudflare/workers-types" />
import { getRequestContext } from "@cloudflare/next-on-pages";

export const runtime = "edge";

type Bindings = {
  USERS_KV: KVNamespace;
  N8N_URL: string;
  N8N_TOKEN: string;
};

export async function POST(req: Request) {
  try {
    // Cloudflare Pages env/bindings
    const { env } = getRequestContext();
    const { USERS_KV, N8N_URL, N8N_TOKEN } = env as unknown as Bindings;

    const body = (await req.json().catch(() => ({}))) as { username?: string };
    const clean = (body.username || "").replace(/^@/, "").trim();
    if (!clean) return Response.json({ error: "username required" }, { status: 400 });

    const key = `result:${clean}`;

    // 1) KV'ye pending yaz
    await USERS_KV.put(
      key,
      JSON.stringify({ status: "pending", username: clean, ts: Date.now() })
    );

    // 2) n8n'i tetikle (fire-and-forget)
    if (N8N_URL && N8N_TOKEN) {
      fetch(N8N_URL, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          authorization: `Bearer ${N8N_TOKEN}`,
        },
        body: JSON.stringify({ username: clean }),
      }).catch(() => {});
    }

    return Response.json({ ok: true, key });
  } catch (err: any) {
    return Response.json(
      { error: "exception", message: String(err?.message || err) },
      { status: 500 }
    );
  }
}
