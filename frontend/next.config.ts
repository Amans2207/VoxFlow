import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return {
      fallback: [
        {
          source: '/api/:path*',
          destination: 'http://localhost:5001/api/:path*',
        },
        {
          source: '/exports/:path*',
          destination: 'http://localhost:5001/exports/:path*',
        },
      ]
    };
  },
  serverExternalPackages: ["@supabase/supabase-js"],
};

export default nextConfig;
