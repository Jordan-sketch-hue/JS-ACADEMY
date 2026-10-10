/**
 * Shared types for the Marketing Command Center.
 *
 * The data is split in two:
 *  - GeneratedAsset[]  — produced by `_build/stage-marketing.mjs` (machine facts:
 *                        optimized file paths, dimensions, channel inferred from folder).
 *  - AssetNarrative    — hand-authored storytelling layer in `marketing-campaigns.ts`.
 * They merge at render time keyed by `id`, so re-staging never clobbers the story work.
 */

export type ChannelId = "plan" | "story" | "feed" | "ad";
export type FormatId = "static" | "video" | "pdf";
export type RatioId = "square" | "portrait" | "landscape";

export const CHANNELS: { id: ChannelId; label: string; blurb: string }[] = [
  { id: "plan", label: "Plan", blurb: "Strategy decks & growth plans — read before you post." },
  { id: "story", label: "Stories", blurb: "9:16 vertical frames & highlight covers for the story tray." },
  { id: "feed", label: "Feed", blurb: "Square posts, carousels & reels for the grid." },
  { id: "ad", label: "Ads & Print", blurb: "Paid creative, flyers, banners, signage & loyalty cards." },
];

/** Machine-derived facts written by the staging script. */
export type GeneratedAsset = {
  id: string;
  campaign: string; // campaign slug
  channel: ChannelId;
  format: FormatId;
  title: string; // humanized from filename (overridable by narrative.retitle)
  file: string; // public path, e.g. /marketing/ship2door/ship2door-feed-post-1-launch.webp
  poster?: string; // public path for video/pdf cover
  pages?: number; // pdf page count
  w?: number;
  h?: number;
  ratio?: RatioId;
  bytes: number; // optimized size
  src: string; // original relative provenance path
  date?: string; // YYYY-MM-DD extracted from source folder name — used for recency sort
};

/** Hand-authored storytelling overlay, keyed by asset id (or matched by `match`). */
export type AssetNarrative = {
  /** Caption idea / the beat this asset plays in the story. */
  hook?: string;
  /** Series this asset belongs to (continuation thread). */
  series?: string;
  /** Order within the series — drives the Story Sequence planner. */
  sequence?: number;
  /** Narrative role. */
  role?: "teaser" | "payoff" | "episode" | "evergreen";
  /** A hidden detail, callback, or "eye for something" planted for sharp-eyed followers. */
  easterEgg?: string;
  /** Where it is in your workflow. */
  status?: "posted" | "scheduled" | "ready";
  /** Override the auto-generated title. */
  retitle?: string;
  /** Override the auto-inferred channel. */
  channel?: ChannelId;
};

export type Series = {
  id: string;
  campaign: string;
  name: string;
  /** The storytelling premise — what thread ties these posts together. */
  premise: string;
  /** Suggested posting rhythm. */
  cadence?: string;
};

export type Campaign = {
  slug: string;
  name: string;
  /** Tailwind gradient classes for the campaign chip, e.g. "from-sky-500 to-blue-700". */
  brand: string;
  /** Accent hex for borders/keylines. */
  accent: string;
  /** Public path to the real brand logo, e.g. "/brands/language-cradle.webp". Falls back to gradient initials when unset. */
  logo?: string;
  tagline: string;
  handle?: string;
  site?: string;
  blurb: string;
};

/** Generated facts + resolved narrative, ready to render. */
export type MarketingAsset = GeneratedAsset & {
  narrative?: AssetNarrative;
  resolvedTitle: string;
  resolvedChannel: ChannelId;
};
