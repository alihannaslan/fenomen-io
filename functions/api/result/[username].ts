/// <reference types="@cloudflare/workers-types" />

type Bindings = {
  USERS_KV: KVNamespace;
};

export const onRequestGet: PagesFunction<Bindings> = async (context) => {
  const username = String(context.params.username || "").replace(/^@/, "").trim();
  const key = `result:${username}`;

  const data = await context.env.USERS_KV.get(key, "json");
  if (!data) {
    return new Response(JSON.stringify({ status: "not_found", username }), {
      status: 404,
      headers: { "content-type": "application/json" },
    });
  }

  return new Response(JSON.stringify(data), {
    headers: { "content-type": "application/json" },
  });
};
