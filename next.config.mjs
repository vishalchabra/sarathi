
/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },

 compiler: {
  removeConsole: false,
},
};

export default nextConfig;