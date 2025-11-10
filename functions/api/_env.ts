/// <reference types="@cloudflare/workers-types" />
type Bindings = { USERS_KV?: KVNamespace; N8N_URL?: string; N8N_TOKEN?: string };

export const onRequestGet: PagesFunction<Bindings> = async (c) => {
  return new Response(JSON.stringify({
    hasUSERS_KV: !!c.env.USERS_KV,
    vars: {
      N8N_URL: typeof c.env.N8N_URL === "string",
      N8N_TOKEN: typeof c.env.N8N_TOKEN === "string"
    }
  }), { headers: { "content-type": "application/json" }});
};
