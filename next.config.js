/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: { unoptimized: true }, // next/image kullanıyorsan şart
  typescript: {
    ignoreBuildErrors: true, // Build sırasında tip hatalarını yok say
  },
};

module.exports = nextConfig;
