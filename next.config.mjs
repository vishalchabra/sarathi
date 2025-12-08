// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  // 🔕 Disable ESLint during production builds (Vercel)
  eslint: {
    ignoreDuringBuilds: true,
  },

  // Keep native modules like swisseph server-side (don’t bundle)
  serverExternalPackages: ["swisseph"],
};

export default nextConfig;
