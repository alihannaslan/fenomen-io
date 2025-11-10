/// <reference types="@cloudflare/workers-types" />

type Bindings = {
  USERS_KV: KVNamespace;
  N8N_URL: string;
  N8N_TOKEN: string;
};

export const onRequestPost: PagesFunction<Bindings> = async (context) => {
  const body = (await context.request.json().catch(() => ({}))) as { username?: string };
  const username = String(body.username || "").replace(/^@/, "").trim();

  if (!username) {
    return new Response(JSON.stringify({ ok: false, error: "username required" }), {
      status: 400,
      headers: { "content-type": "application/json" },
    });
  }

  // KV: pending
  const key = `result:${username}`;
  await context.env.USERS_KV.put(
    key,
    JSON.stringify({ status: "pending", username, ts: Date.now() })
  );

  // n8n tetikle (POST)
  const url = context.env.N8N_URL;
  const token = context.env.N8N_TOKEN;
  if (url && token) {
    await fetch(url, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ username }),
    }).catch(() => {});
  }

  return new Response(JSON.stringify({ ok: true, key }), {
    headers: { "content-type": "application/json" },
  });
};
