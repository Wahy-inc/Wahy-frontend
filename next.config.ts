import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: '/api/:path*',
          destination: 'http://52.58.17.12:8000/api/:path*',
        },
      ],
    }
  }
};

export default nextConfig;
