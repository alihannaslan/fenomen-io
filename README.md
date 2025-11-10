# Fenomen - Cloudflare KV ile Authentication

Bu proje Cloudflare KV ve JWT kullanarak kullanıcı kimlik doğrulama sistemi içerir.

## Kurulum

1. Bağımlılıkları yükleyin:
\`\`\`bash
npm install
\`\`\`

2. Cloudflare KV namespace'i oluşturun:
\`\`\`bash
wrangler kv:namespace create "USERS_KV"
\`\`\`

3. `wrangler.toml` dosyasındaki KV namespace ID'yi güncelleyin.

4. JWT secret anahtarını ayarlayın (production için).

## Cloudflare'e Deploy

\`\`\`bash
npm run build
wrangler pages deploy
\`\`\`

## Özellikler

- ✅ Cloudflare KV ile kullanıcı depolama
- ✅ JWT tabanlı oturum yönetimi
- ✅ Bcrypt ile şifre hash'leme
- ✅ Edge runtime desteği
- ✅ Türkçe arayüz
- ✅ Korumalı dashboard sayfası
- ✅ Otomatik route protection
