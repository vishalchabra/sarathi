/** @type {import('next').NextConfig} */
const nextConfig = {
  // 🔕 Disable ESLint during production builds (Vercel)
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
