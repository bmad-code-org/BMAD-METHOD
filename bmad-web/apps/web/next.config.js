/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@bmad/core', '@bmad/ui'],
  experimental: {
    serverComponentsExternalPackages: ['@bmad/core'],
  },
  images: {
    domains: ['avatars.githubusercontent.com'],
  },
};

module.exports = nextConfig;
