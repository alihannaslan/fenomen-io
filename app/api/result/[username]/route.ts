export const runtime = "edge";

type Env = { USERS_KV: KVNamespace };

export async function GET(
  _req: Request,
  ctx: { params: { username: string }; env: Env }
) {
  const clean = ctx.params.username.replace(/^@/, "").trim();
  const key = `result:${clean}`;
  const data = await ctx.env.USERS_KV.get(key, "json");

  if (!data) {
    return Response.json({ status: "not_found", username: clean }, { status: 404 });
  }
  return Response.json(data, { status: 200 });
}
