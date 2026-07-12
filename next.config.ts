import type { NextConfig } from "next";

const backendUrlRaw = process.env.BACKEND_URL || '';

const nextConfig: NextConfig = {
  // Expose the backend URL to the browser bundle so API calls can bypass the
  // Next.js rewrite proxy (which causes ECONNRESET when both services sit
  // behind Coolify's reverse proxy on the same server).
  env: {
    NEXT_PUBLIC_BACKEND_URL: backendUrlRaw,
  },
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
        ],
      },
      {
        source: "/sw.js",
        headers: [
          {
            key: "Content-Type",
            value: "application/javascript; charset=utf-8",
          },
          {
            key: "Cache-Control",
            value: "no-cache, no-store, must-revalidate",
          },
          {
            key: "Content-Security-Policy",
            value: "default-src 'self'; script-src 'self'",
          },
        ],
      },
    ]
  },
  async rewrites() {
    // Server-side rewrites are kept as a fallback for SSR and local development
    // (when BACKEND_URL is empty, requests go through localhost).
    const backendUrl = backendUrlRaw || 'http://localhost:9000';
    return {
      beforeFiles: [
        {
          source: '/api/:path*',
          destination: `${backendUrl}/api/:path*`,
        },
      ],
    }
  }
};

export default nextConfig;
