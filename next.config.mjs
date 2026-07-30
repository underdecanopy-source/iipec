/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'pottershousecommand.wixsite.com',
      },
    ],
  },
  experimental: {
    optimizePackageImports: ['react-photo-view'],
  },
}

export default nextConfig
