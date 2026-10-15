// JST Higgsfield Generation Wrapper
// Uses cheap models by default + applies JST creative context layer

import { config, higgsfield } from "@higgsfield/client/v2";
import { enrichPrompt, BRAND_PRESETS, type BrandContext } from "./context.js";
import { DIMENSIONS, type Platform } from "./dimensions.js";

config({ credentials: process.env.HF_CREDENTIALS });

// ─── MODELS ──────────────────────────────────────────────────────────────────
const MODELS = {
  image: "higgsfield-ai/soul/v2/standard",    // $0.003/img — cheapest
  video: "alibaba/wan-3.0/text-to-video",     // $0.020/s  — cheapest
} as const;

// ─── IMAGE GENERATION ────────────────────────────────────────────────────────

export async function generateImage(opts: {
  prompt: string;
  platform?: Platform;
  brand?: string;
  context?: BrandContext;
  batchSize?: number;
}) {
  const ctx = opts.brand ? { ...BRAND_PRESETS[opts.brand], ...opts.context } : opts.context ?? {};
  const enriched = enrichPrompt(opts.prompt, ctx);
  const dim = opts.platform ? DIMENSIONS[opts.platform] : DIMENSIONS.instagram_feed_square;

  console.log(`[image] model: ${MODELS.image} | platform: ${dim.label}`);
  console.log(`[image] prompt: ${enriched}`);

  const result = await higgsfield.subscribe(MODELS.image, {
    input: {
      prompt: enriched,
      resolution: dim.resolution,
      aspect_ratio: dim.aspect_ratio,
      enhance_prompt: true,
      batch_size: opts.batchSize ?? 1,
    },
    withPolling: true,
  });

  if (result.status !== "completed") {
    throw new Error(`Image generation ${result.status}: ${JSON.stringify((result as any).error ?? "")}`);
  }

  const urls = result.images?.map((i: { url: string }) => i.url) ?? [(result as any).image?.url];
  return { urls, platform: dim, prompt: enriched };
}

// ─── VIDEO GENERATION ────────────────────────────────────────────────────────

export async function generateVideo(opts: {
  prompt: string;
  platform?: Platform;
  brand?: string;
  context?: BrandContext;
  duration?: number;
}) {
  const ctx = opts.brand ? { ...BRAND_PRESETS[opts.brand], ...opts.context } : opts.context ?? {};
  const enriched = enrichPrompt(opts.prompt, ctx);
  const dim = opts.platform ? DIMENSIONS[opts.platform] : DIMENSIONS.instagram_reels;
  const duration = opts.duration ?? 5;

  console.log(`[video] model: ${MODELS.video} | platform: ${dim.label} | duration: ${duration}s`);
  console.log(`[video] prompt: ${enriched}`);

  const result = await higgsfield.subscribe(MODELS.video, {
    input: {
      prompt: enriched,
      duration,
      resolution: dim.resolution,
      aspect_ratio: dim.aspect_ratio,
      generate_audio: true,
    },
    withPolling: true,
  });

  if (result.status !== "completed") {
    throw new Error(`Video generation ${result.status}: ${JSON.stringify((result as any).error ?? "")}`);
  }

  const url = result.video?.url ?? (result as any).videos?.[0]?.url;
  return { url, platform: dim, prompt: enriched, duration };
}
