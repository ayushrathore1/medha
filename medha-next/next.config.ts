import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ─── Performance Optimization ───
  // Enable React compiler for automatic memoization (Next.js 16)
  reactCompiler: true,

  // Compress responses
  compress: true,

  // Image optimization
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "ik.imagekit.io" },
      { protocol: "https", hostname: "img.youtube.com" },
      { protocol: "https", hostname: "i.ytimg.com" },
    ],
    formats: ["image/avif", "image/webp"],
    qualities: [75, 85, 90],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
  },

  // Enable Partial Prerendering for hybrid static/dynamic pages (Next.js 16+)
  cacheComponents: true,

  // Experimental performance features
  experimental: {
    // Optimize server actions
    serverActions: {
      bodySizeLimit: "70mb",
    },
  },

  // Custom headers for security and caching
  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-XSS-Protection", value: "1; mode=block" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
      {
        source: "/:path*",
        headers: [
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
        ],
      },
    ];
  },

  // Rewrites: uploads still served by Express backend
  async rewrites() {
    return [
      {
        source: "/uploads/:path*",
        destination: "http://localhost:5000/uploads/:path*",
      },
    ];
  },
};

export default nextConfig;
