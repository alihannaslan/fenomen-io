import { getRequestContext } from "@cloudflare/next-on-pages";
export const runtime = "edge";

type Bindings = {
  USERS_KV: KVNamespace;
  N8N_TOKEN?: string;
};

export async function POST(req: Request) {
  try {
    const { env } = getRequestContext();
    const { USERS_KV, N8N_TOKEN } = env as unknown as Bindings;

    // Header'ı hem lowercase hem büyük harfle dene
    const h1 = req.headers.get("authorization") || "";
    const h2 = req.headers.get("Authorization") || "";
    const auth = h1 || h2;
    const incoming = auth.startsWith("Bearer ") ? auth.slice(7).trim() : "";

    // (DEBUG için istersen query de ekleyebilirsin; test bitince kaldır)
    // const queryToken = new URL(req.url).searchParams.get("token")?.trim() || "";
    // const incoming = (auth.startsWith("Bearer ") ? auth.slice(7).trim() : "") || queryToken;

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
      return Response.json({ error: "username and result required" }, { status: 400 });
    }

    const key = `result:${username}`;
    await USERS_KV.put(
      key,
      JSON.stringify({
        status: "done",
        username,
        result: body.result,
        meta: body.meta ?? null,
        ts: Date.now(),
      })
    );

    return Response.json({ ok: true });
  } catch (err: any) {
    return Response.json({ error: "exception", message: String(err?.message || err) }, { status: 500 });
  }
}
