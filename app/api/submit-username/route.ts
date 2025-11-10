export const runtime = "edge";

type Env = {
  USERS_KV: KVNamespace;
  N8N_URL: string;   // Cloudflare Pages → Variables
  N8N_TOKEN: string; // Cloudflare Pages → Variables
};

export async function POST(req: Request, ctx: { env: Env }) {
  try {
const { username } = (await req.json()) as { username?: string }

    if (!username) {
      return Response.json({ error: "username required" }, { status: 400 });
    }

    const clean = username.replace(/^@/, "").trim();
    if (!clean) {
      return Response.json({ error: "invalid username" }, { status: 400 });
    }

    const key = `result:${clean}`;

    // 1) KV'ye pending yaz
    await ctx.env.USERS_KV.put(
      key,
      JSON.stringify({ status: "pending", username: clean, ts: Date.now() })
    );

    // 2) n8n'i tetikle (fire-and-forget)
    const url = new URL(ctx.env.N8N_URL);
    url.searchParams.set("username", clean);
    url.searchParams.set("token", ctx.env.N8N_TOKEN);
    // hata yutsa da sorun yok; arkada çalışsın
    fetch(url.toString()).catch(() => {});

    return Response.json({ ok: true, key }, { status: 200 });
  } catch (e: any) {
    return Response.json({ error: String(e?.message || e) }, { status: 500 });
  }
}
