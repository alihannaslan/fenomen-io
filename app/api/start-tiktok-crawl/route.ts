import { NextResponse } from "next/server";
import crypto from "crypto";

const HANDLE_RE = /^[A-Za-z0-9._]{2,24}$/;   // basit TikTok handle doğrulaması
const COUNTRY_RE = /^[A-Za-z]{2}$/;          // ISO-2 country (TR, US, DE ...)

function hmac(body: string, secret?: string) {
  if (!secret) return undefined;
  return crypto.createHmac("sha256", secret).update(body, "utf8").digest("hex");
}

export async function POST(req: Request) {
  try {
    const { userId, email, username, country } = await req.json();

    if (!username) {
      return NextResponse.json({ error: "username_required" }, { status: 400 });
    }
    if (!country) {
      return NextResponse.json({ error: "country_required" }, { status: 400 });
    }

    // normalize
    const handle = String(username).replace("@", "").trim();
    const countryIso2 = String(country).trim().toUpperCase();

    // basic validations
    if (!HANDLE_RE.test(handle)) {
      return NextResponse.json({ error: "invalid_username" }, { status: 422 });
    }
    if (!COUNTRY_RE.test(countryIso2)) {
      return NextResponse.json({ error: "invalid_country" }, { status: 422 });
    }

    // (opsiyonel) n8n'e hem handle+country hem de tam TikTok URL'i gönder
    const tiktokUrl = `https://www.tiktok.com/@${handle}`;

    const payload = {
      user_id: userId ?? null,
      email: email ?? null,
      tiktok_handle: handle,       // n8n kolay okusun diye aynı isim
      country: countryIso2,        // Bright Data'ya iletilecek ülke
      url: tiktokUrl,              // Bright Data bulk için işine yarar
      source: "nextjs_onboarding",
      ts: new Date().toISOString(),
    };

    const bodyStr = JSON.stringify(payload);
    const headers: Record<string, string> = { "Content-Type": "application/json" };

    // Opsiyonel: HMAC imza (n8n 'Function' node'unda doğrula)
    const sig = hmac(bodyStr, process.env.N8N_SIGNING_SECRET);
    if (sig) headers["X-Signature"] = sig;

    const res = await fetch(process.env.N8N_WEBHOOK_START!, {
      method: "POST",
      headers,
      body: bodyStr,
      cache: "no-store",
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      return NextResponse.json(
        { error: "n8n_error", status: res.status, detail: text.slice(0, 500) },
        { status: 502 }
      );
    }

    const data = await res.json().catch(() => ({}));
    return NextResponse.json({ ok: true, data });
  } catch (e: any) {
    return NextResponse.json({ error: "server_error", detail: e?.message }, { status: 500 });
  }
}
