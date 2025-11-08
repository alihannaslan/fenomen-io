/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: { unoptimized: true } // next/image kullanıyorsan şart
};
module.exports = nextConfig;
