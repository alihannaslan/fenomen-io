# Fenomen - Cloudflare KV ile Authentication

Cloudflare KV ve JWT kullanarak kullanıcı kimlik doğrulama sistemi içeren modern SaaS landing page.

---

## 🚀 Hızlı Başlangıç

### 1️⃣ Bağımlılıkları Yükleyin (ÖNEMLİ - İLK ADIM!)

Projeyi çalıştırmadan önce MUTLAKA bağımlılıkları yüklemeniz gerekiyor:

\`\`\`bash
npm install
\`\`\`

veya pnpm kullanıyorsanız:

\`\`\`bash
pnpm install
\`\`\`

### 2️⃣ Environment Variables Ayarlayın

`.env.local` dosyası oluşturun:

\`\`\`bash
cp .env.local.example .env.local
\`\`\`

`.env.local` içeriğini düzenleyin:

\`\`\`env
JWT_SECRET=super-gizli-anahtar-buraya-yazin
USERS_KV=your-kv-namespace-id
\`\`\`

### 3️⃣ Development Server'ı Başlatın

\`\`\`bash
npm run dev
\`\`\`

Tarayıcınızda [http://localhost:3000](http://localhost:3000) adresini açın.

---

## 📦 Cloudflare'e Deploy

Detaylı deploy talimatları için [KURULUM.md](./KURULUM.md) dosyasına bakın.

### Kısa Özet:

1. **KV Namespace Oluşturun:**
\`\`\`bash
npx wrangler login
npx wrangler kv:namespace create USERS_KV
npx wrangler kv:namespace create USERS_KV --preview
\`\`\`

2. **wrangler.toml'u Güncelleyin:**
Aldığınız ID'leri `wrangler.toml` dosyasına yapıştırın.

3. **Deploy Edin:**
\`\`\`bash
npm run build
npx wrangler pages deploy .next --project-name fenomen
\`\`\`

---

## 🎯 Özellikler

- ✅ Cloudflare KV ile kullanıcı depolama
- ✅ JWT tabanlı güvenli oturum yönetimi
- ✅ Bcrypt ile şifre hash'leme
- ✅ Edge runtime desteği (ultra hızlı)
- ✅ Tam Türkçe arayüz
- ✅ Korumalı dashboard sayfası
- ✅ Otomatik route protection (middleware)
- ✅ Modern ve responsive tasarım
- ✅ Fenomen markası için özelleştirilmiş

---

## 🛠️ Teknolojiler

- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS v4
- **UI Components:** Radix UI + shadcn/ui
- **Database:** Cloudflare KV
- **Auth:** JWT + bcrypt
- **Deployment:** Cloudflare Pages
- **Icons:** Lucide React

---

## 📝 Proje Yapısı

\`\`\`
fenomen/
├── app/                    # Next.js App Router
│   ├── api/auth/          # Auth API routes
│   ├── dashboard/         # Korumalı dashboard
│   ├── login/             # Giriş sayfası
│   └── signup/            # Kayıt sayfası
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   └── home/             # Landing page components
├── lib/                   # Utility fonksiyonlar
│   ├── kv-store.ts       # Cloudflare KV yönetimi
│   ├── jwt.ts            # JWT işlemleri
│   └── session.ts        # Session yönetimi
├── wrangler.toml         # Cloudflare konfigürasyonu
└── middleware.ts         # Route protection

\`\`\`

---

## 🐛 Sorun Giderme

### "next: command not found" hatası

Bu hata, bağımlılıkların yüklenmediğini gösterir:

\`\`\`bash
npm install
npm run dev
\`\`\`

### Build hatası alıyorum

\`\`\`bash
rm -rf node_modules .next
npm install
npm run build
\`\`\`

### Daha fazla yardım için

[KURULUM.md](./KURULUM.md) dosyasına bakın veya detaylı sorun giderme adımlarını inceleyin.

---

## 📄 Lisans

Bu proje Fenomen markası için özel olarak geliştirilmiştir.
