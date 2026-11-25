import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: { ignoreBuildErrors: true },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  async headers() {
    return [
      {
        // Gallery images and CRM banners — revalidate frequently, never immutable
        source: "/gallery/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=60, stale-while-revalidate=3600" },
        ],
      },
      {
        source: "/crm-banners/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=60, stale-while-revalidate=3600" },
        ],
      },
      {
        source: "/heroes/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=3600, stale-while-revalidate=86400" },
        ],
      },
    ];
  },
};

export default nextConfig;