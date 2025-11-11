// app/api/_env/route.ts
import { getRequestContext } from "@cloudflare/next-on-pages";
export const runtime = "edge";

export async function GET() {
  const { env } = getRequestContext();
  const hasKV = !!env?.USERS_KV;
  const hasToken = typeof env?.N8N_TOKEN === "string" && (env.N8N_TOKEN as string).length > 0;
  return Response.json({ env: "production", hasUSERS_KV: hasKV, hasN8N_TOKEN: hasToken });
}
