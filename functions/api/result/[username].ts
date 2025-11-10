/// <reference types="@cloudflare/workers-types" />

type Bindings = { USERS_KV: KVNamespace };

export const onRequestGet: PagesFunction<Bindings> = async (context) => {
  try {
    const username = String(context.params.username || "").replace(/^@/, "").trim();
    const key = `result:${username}`;

    // binding var mı?
    if (!context.env || !context.env.USERS_KV) {
      return new Response(
        JSON.stringify({ error: "USERS_KV binding missing", haveEnv: Object.keys(context.env || {}) }),
        { status: 500, headers: { "content-type": "application/json" } }
      );
    }

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
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: "exception", message: String(err?.message || err) }),
      { status: 500, headers: { "content-type": "application/json" } }
    );
  }
};
