/// <reference types="@cloudflare/workers-types" />

// CF Pages/Workers runtime'tan gelen binding'ler ve env
declare const USERS_KV: KVNamespace;

interface Env {
  USERS_KV: KVNamespace;
  N8N_URL: string;
  N8N_TOKEN: string;
}
