/// <reference types="@cloudflare/workers-types" />

interface Env {
  USERS_KV: KVNamespace;
  N8N_URL: string;
  N8N_TOKEN: string;
}
