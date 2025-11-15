// next.config.mjs
import { setupDevPlatform } from "@cloudflare/next-on-pages/next-dev";

/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
};

if (process.env.NODE_ENV === "development") {
  // await zorunlu değil; config'te sorun çıkarmasın diye promise şekilde kullanıyoruz
  setupDevPlatform().catch((e) => {
    console.error("setupDevPlatform error:", e);
  });
}

export default nextConfig;
