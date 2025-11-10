# Fenomen - Kurulum ve Deploy Rehberi

Bu proje Next.js ile geliştirilmiş ve Cloudflare Pages + KV ile çalışacak şekilde yapılandırılmıştır.

## Ön Gereksinimler

- Node.js 18 veya üzeri
- npm veya yarn
- Cloudflare hesabı
- Wrangler CLI

## 1. Wrangler CLI Kurulumu

\`\`\`bash
npm install -g wrangler
\`\`\`

Cloudflare'e giriş yapın:
\`\`\`bash
wrangler login
\`\`\`

## 2. Bağımlılıkları Yükleyin

\`\`\`bash
npm install
\`\`\`

## 3. Cloudflare KV Namespace Oluşturun

### Production için:
\`\`\`bash
wrangler kv:namespace create "USERS_KV"
\`\`\`

Bu komut size bir ID verecek. Örneğin:
\`\`\`
⛅️ wrangler 3.0.0
--------------------
🌀 Creating namespace with title "fenomen-app-USERS_KV"
✨ Success!
Add the following to your wrangler.toml:
{ binding = "USERS_KV", id = "abc123def456" }
\`\`\`

### Preview için (opsiyonel):
\`\`\`bash
wrangler kv:namespace create "USERS_KV" --preview
\`\`\`

## 4. wrangler.toml Dosyasını Güncelleyin

`wrangler.toml` dosyasını açın ve KV namespace ID'yi güncelleyin:

\`\`\`toml
name = "fenomen-app"
compatibility_date = "2024-01-01"
pages_build_output_dir = ".vercel/output/static"

[[kv_namespaces]]
binding = "USERS_KV"
id = "BURAYA-KV-ID-YAPIŞTIRIN"  # 3. adımda aldığınız ID

[vars]
JWT_SECRET = "super-gizli-jwt-anahtari-degistir"  # Production'da mutlaka değiştirin!
\`\`\`

## 5. Environment Variables (Opsiyonel - Vercel için)

Eğer v0'dan Vercel'e deploy ediyorsanız:

1. Vercel dashboard'a gidin
2. Project Settings > Environment Variables
3. Şu değişkenleri ekleyin:
   - `USERS_KV`: KV binding (Cloudflare entegrasyonu ile otomatik)
   - `JWT_SECRET`: Güçlü bir secret key

## 6. Local Development

Projeyi local'de çalıştırın:

\`\`\`bash
npm run dev
\`\`\`

Tarayıcıda açın: http://localhost:3000

**NOT:** Local development'ta KV çalışmayacak, sadece UI'ı görebilirsiniz. Auth testi için deploy etmelisiniz.

## 7. Build ve Test

Build alın:
\`\`\`bash
npm run build
\`\`\`

## 8. Cloudflare Pages'e Deploy

### İlk Defa Deploy

\`\`\`bash
npx wrangler pages deploy .next --project-name=fenomen-app
\`\`\`

veya build output'u deploy edin:

\`\`\`bash
npm run build
npx wrangler pages deploy .next
\`\`\`

### Sonraki Deploylar

\`\`\`bash
npm run build
npx wrangler pages deploy .next
\`\`\`

## 9. KV Binding'i Cloudflare Dashboard'dan Ayarlayın

1. Cloudflare Dashboard'a gidin: https://dash.cloudflare.com
2. Workers & Pages > Seçtiğiniz projeyi açın
3. Settings > Functions > KV Namespace Bindings
4. "Add binding" butonuna tıklayın
5. Variable name: `USERS_KV`
6. KV namespace: Oluşturduğunuz KV'yi seçin
7. Save

## 10. Environment Variables (Production)

Cloudflare Pages Settings'e gidin ve şu değişkeni ekleyin:

- **JWT_SECRET**: Güçlü bir random string (min 32 karakter)

Örnek oluşturma:
\`\`\`bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
\`\`\`

## Sorun Giderme

### "KV namespace not found" hatası
- `wrangler.toml` dosyasında doğru KV ID olduğundan emin olun
- Cloudflare dashboard'da binding'in doğru yapıldığından emin olun

### "JWT secret not found" hatası
- Environment variables'ın production'da set edildiğinden emin olun

### Font hataları
- Build sırasında font dosyalarının doğru yüklendiğinden emin olun
- `npm run build` tekrar çalıştırın

### Local'de auth çalışmıyor
- Normal! KV sadece Cloudflare'de çalışır. Deploy edip test edin.

## Faydalı Komutlar

\`\`\`bash
# KV'ye veri yazmak (test için)
wrangler kv:key put --binding=USERS_KV "test-key" "test-value"

# KV'den veri okumak
wrangler kv:key get --binding=USERS_KV "test-key"

# Tüm KV keylerini listele
wrangler kv:key list --binding=USERS_KV

# Logs izle
wrangler pages deployment tail

# Project sil
wrangler pages project delete fenomen-app
\`\`\`

## Başarılı Deploy Sonrası

Deploy başarılı olunca Cloudflare size bir URL verecek:
\`\`\`
https://fenomen-app.pages.dev
\`\`\`

Artık:
1. Ana sayfayı ziyaret edebilirsiniz
2. "Hemen Başla" ile kayıt olabilirsiniz
3. Giriş yapıp dashboard'a erişebilirsiniz

## Destek

Sorun yaşarsanız:
- Cloudflare logs: `wrangler pages deployment tail`
- Browser console'u kontrol edin
- Network tab'de API çağrılarını inceleyin
