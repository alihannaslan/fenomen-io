/// <reference types="@cloudflare/workers-types" />
import { getRequestContext } from "@cloudflare/next-on-pages";

export const runtime = "edge";

type Bindings = { USERS_KV: KVNamespace };

export async function GET(
  _req: Request,
  { params }: { params: { username: string } }
) {
  try {
    const { env } = getRequestContext();
    const { USERS_KV } = env as unknown as Bindings;

    const clean = (params.username || "").replace(/^@/, "").trim();
    const data = await USERS_KV.get(`result:${clean}`, "json");

    if (!data) {
      return Response.json({ status: "not_found", username: clean }, { status: 404 });
    }
    return Response.json(data);
  } catch (err: any) {
    return Response.json({ error: "exception", message: String(err?.message || err) }, { status: 500 });
  }
}
