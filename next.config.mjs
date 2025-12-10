// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  // 🔕 Disable ESLint during production builds (Vercel)
  eslint: {
    ignoreDuringBuilds: true,
  },

  // Tell Next/Vercel this native package must be available at runtime,
  // don't tree-shake or bundle it away
  serverExternalPackages: ["swisseph"],
};

export default nextConfig;
