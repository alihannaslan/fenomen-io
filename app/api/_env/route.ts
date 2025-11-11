// app/api/_env/route.ts
import { getRequestContext } from "@cloudflare/next-on-pages";
export const runtime = "edge";

export async function GET() {
  const { env } = getRequestContext();
  const hasKV = !!env?.USERS_KV;
  const token = (env as any)?.N8N_TOKEN;
  const hasN8N = typeof token === "string" && token.length > 0;

  // Güvenlik için token’ı göstermiyoruz; sadece uzunluk ve SHA-256 digest veriyoruz.
  let tokenLen = 0, tokenDigest = null;
  if (hasN8N) {
    tokenLen = token.length;
    const enc = new TextEncoder().encode(token);
    const d = await crypto.subtle.digest("SHA-256", enc);
    tokenDigest = Array.from(new Uint8Array(d)).map(b => b.toString(16).padStart(2, "0")).join("");
  }

  return Response.json({
    env: "production",
    hasUSERS_KV: hasKV,
    hasN8N_TOKEN: hasN8N,
    n8n_token_len: tokenLen,
    n8n_token_sha256: tokenDigest,
  });
}
