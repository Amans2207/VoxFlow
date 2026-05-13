import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:5001/api/:path*',
      },
      {
        source: '/exports/:path*',
        destination: 'http://localhost:5001/exports/:path*',
      },
    ];
  },
  experimental: {
    // Ensuring Turbopack doesn't cache proxy responses
    serverComponentsExternalPackages: ["@supabase/supabase-js"],
  },
};

export default nextConfig;
