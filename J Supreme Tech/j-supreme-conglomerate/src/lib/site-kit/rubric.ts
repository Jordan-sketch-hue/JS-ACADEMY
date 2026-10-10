import type { SiteKitKind } from "./types";

export function buildRubricDocument(kind: SiteKitKind): string {
  const shared = `SITE / APP KIT — BUILD RUBRIC (generated)
================================================

This archive is a starting point from your J Supreme workspace. Customize copy,
imagery, and deploy to Vercel or any host.

STACK OUTLINE
-------------
`;

  const website = `
• HTML5 — Multi-page structure (home, about, contact); semantic landmarks.
• JavaScript (ES Modules) — js/main.js: mobile nav drawer, modal, scroll reveal,
  FAQ accordion, smooth anchor scrolling.
• CSS — Tailwind CSS via CDN script for layout, responsive, premium dark UI.
  Brand color applied as CSS variables (data-theme on <html>).
• JSON — package.json (local preview), vercel.json (clean URLs on Vercel).
• SVG — favicon.svg (vector mark; swap for client logo artwork).
• XML — sitemap.xml for crawlers (set your real base URL in Vercel env or edit file).
• Plain text — robots.txt (Allow: /).

NEXT STEPS
----------
1. Replace placeholder text and ${kind === "website" ? "logo URL" : "assets"}.
2. npm install && npm run dev (static kit) or npm run dev (Vite kit).
3. Connect repo to Vercel; ensure build/output matches vercel.json.
`;

  const react = `
• React 19 + Vite + TypeScript — src/App.tsx contains the same UX patterns
  (nav, modal, FAQ, reveal) using hooks + ES module imports.
• Tailwind CSS — postcss + tailwind.config.js (utility-first, responsive).
• JSON — package.json, tsconfig.json, vercel.json.
• SVG — public/favicon.svg
• XML / robots — public/sitemap.xml, public/robots.txt (edit base URL).

NEXT STEPS
----------
1. Replace branding in src/App.tsx and index.html <title>.
2. npm install && npm run build && npm run preview
3. Deploy: Vercel detects Vite; output is dist/.
`;

  return `${shared}${kind === "react-app" ? react : website}`.trim() + "\n";
}
