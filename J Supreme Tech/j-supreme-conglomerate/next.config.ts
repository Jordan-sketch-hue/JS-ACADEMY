import type { NextConfig } from "next";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Baseline security headers applied to every response (Cyber Command hardening).
 * These are the safe, high-value headers that don't risk breaking Clerk/Supabase/
 * analytics. A full Content-Security-Policy is tracked as a roadmap item — it must
 * be authored against the live third-party origins and shipped report-only first
 * so it can't break production auth.
 */
const securityHeaders = [
  // Force HTTPS for 2 years incl. subdomains; eligible for the preload list.
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  // Clickjacking: only this origin may frame the operator app.
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  // Stop MIME-type sniffing.
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Don't leak full URLs (which can carry tokens) to other origins.
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Lock down powerful browser APIs we don't use.
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), browsing-topics=()" },
  { key: "X-DNS-Prefetch-Control", value: "on" },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  outputFileTracingRoot: path.join(__dirname),
  async headers() {
    return [{ source: "/(.*)", headers: securityHeaders }];
  },
};

export default nextConfig;
