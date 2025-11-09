/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { nextRuntime }) => {
    if (nextRuntime === 'edge') {
      config.resolve.alias['node:stream'] = false
      config.resolve.fallback = {
        stream: false,
        fs: false,
        path: false,
        crypto: false,
        zlib: false
      }
    }
    return config
  },
}
export default nextConfig
