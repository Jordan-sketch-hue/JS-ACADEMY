import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/**
 * PUBLIC marketing short-links: jsupremeconglomerate.online/s/<slug>
 *
 * Pure 302 redirects to public marketing destinations with UTM tags baked in.
 * This namespace must NEVER carry secrets or magic links — that is what the
 * auth-gated /go/[target] launcher is for. Keep the two separate.
 *
 * 302 (not 301) on purpose: campaign destinations get re-pointed (e.g. lc-app
 * moves to app.thelanguagecradle.com or the App Store) and we don't want
 * browsers caching a permanent redirect.
 *
 * Source of truth for the Language Cradle set:
 * Downloads\The Language Cradle\Global Marketing Plan 2026-06-09\_build\links.json
 */
const LINKS: Record<string, string> = {
  // ---- The Language Cradle (IBLC) — lc-global-2026 campaign ----
  // The interactive marketing-plan microsite (white-dominant, storytelling).
  "lc-plan":
    "https://lc-marketing-plan.vercel.app/?utm_source=share&utm_medium=link&utm_campaign=lc-plan-2026",
  "lc-ig-bio":
    "https://thelanguagecradle.com/?utm_source=instagram&utm_medium=bio&utm_campaign=lc-global-2026",
  "lc-fb-page":
    "https://thelanguagecradle.com/?utm_source=facebook&utm_medium=page&utm_campaign=lc-global-2026",
  "lc-li":
    "https://thelanguagecradle.com/?utm_source=linkedin&utm_medium=profile&utm_campaign=lc-global-2026",
  "lc-globalvoice":
    "https://thelanguagecradle.com/global-voice?utm_source=social&utm_medium=share&utm_campaign=lc-globalvoice-2026",
  "lc-corporate":
    "https://thelanguagecradle.com/corporate?utm_source=social&utm_medium=share&utm_campaign=lc-corporate-2026",
  "lc-courses":
    "https://thelanguagecradle.com/courses?utm_source=social&utm_medium=share&utm_campaign=lc-courses-2026",
  "lc-translate":
    "https://thelanguagecradle.com/translation-interpretation?utm_source=social&utm_medium=share&utm_campaign=lc-translate-2026",
  "lc-book":
    "https://thelanguagecradle.com/book?utm_source=social&utm_medium=share&utm_campaign=lc-book-2026",
  // Portal only — app.thelanguagecradle.com has no DNS yet; swap here when wired.
  "lc-app":
    "https://language-cradle-app.vercel.app/?utm_source=social&utm_medium=share&utm_campaign=lc-app-2026",
  "lc-story":
    "https://thelanguagecradle.com/about?utm_source=social&utm_medium=share&utm_campaign=lc-story-2026",
  "lc-wa":
    "https://wa.me/18766188822?text=Hi%20The%20Language%20Cradle%2C%20I%27d%20like%20to%20learn%20more%20about%20your%20programmes.",
  "lc-qr":
    "https://thelanguagecradle.com/?utm_source=qr&utm_medium=print&utm_campaign=lc-global-2026",
  "lc-news":
    "https://thelanguagecradle.com/contact?utm_source=social&utm_medium=share&utm_campaign=lc-newsletter-2026",
  "lc-dm":
    "https://thelanguagecradle.com/global-voice?utm_source=instagram&utm_medium=dm&utm_campaign=lc-dm-automation-2026",
};

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ slug: string }> },
) {
  const { slug } = await ctx.params;
  const dest = LINKS[slug.toLowerCase()];
  // Unknown slug: land on the conglomerate hub rather than a 404 — a typo on a
  // printed flyer should still reach a real page.
  return NextResponse.redirect(dest ?? "https://jsupremeconglomerate.online/", {
    status: 302,
  });
}
