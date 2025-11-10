/// <reference types="@cloudflare/workers-types" />
declare module "@cloudflare/next-on-pages";

interface Env {
  USERS_KV: KVNamespace;
  N8N_URL: string;
  N8N_TOKEN: string;
}
