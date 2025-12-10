// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  // 🔕 Disable ESLint during production builds (Vercel)
  eslint: {
    ignoreDuringBuilds: true,
  },

  experimental: {
    // Allow Next to use this native package in server components / routes
    serverComponentsExternalPackages: ["swisseph"],
  },
};

export default nextConfig;
