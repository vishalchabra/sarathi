// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Fix: Disable linting during Vercel build
  eslint: {
    ignoreDuringBuilds: true,
  },

  // Keep SwissEph native module server-side
  serverExternalPackages: ["swisseph"],
};

export default nextConfig;
