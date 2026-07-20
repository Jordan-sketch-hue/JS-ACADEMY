import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: { unoptimized: true },
  env: {
    NEXT_PUBLIC_ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || "BIT2026admin",
  },
};

export default nextConfig;
