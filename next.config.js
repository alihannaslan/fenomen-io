/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',        // Next.js 13/14 SSG export
  images: { unoptimized: true } // Next Image kullanıyorsan şart
};
module.exports = nextConfig;
