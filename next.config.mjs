// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  // keep native modules like swisseph server-side (don’t bundle)
  serverExternalPackages: ["swisseph"],
};

export default nextConfig;
