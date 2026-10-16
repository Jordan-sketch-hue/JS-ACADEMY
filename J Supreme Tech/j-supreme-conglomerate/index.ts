import { config, higgsfield } from "@higgsfield/client/v2";

// ─── COST-OPTIMIZED MODEL REGISTRY ───────────────────────────────────────────
//
//  DEFAULT (cheapest):
//    image   → higgsfield-ai/soul/v2/standard    ($0.003 / image)
//    video   → alibaba/wan-3.0/text-to-video     ($0.020 / second)
//
//  PREMIUM (explicit opt-in only):
//    video   → bytedance/seedance-2.5/text-to-video  (higher quality, higher cost)
//
//  AI INFLUENCER (Soul ID):
//    1. POST /v1/custom-references  — upload portrait photos → get a Soul ID UUID
//    2. Pass custom_reference_id to soul/v2/standard to lock in a consistent face
//    3. Use Genjutsu (higgsfield/genjutsu/motion-transfer/v1.0) to put that face
//       into existing video footage
//
// ─────────────────────────────────────────────────────────────────────────────

config({ credentials: process.env.HF_CREDENTIALS });

async function generateImage() {
  console.log("[image] Soul 2 — cheapest image model (~$0.003/img)");
  const result = await higgsfield.subscribe(
    "higgsfield-ai/soul/v2/standard",
    {
      input: {
        prompt: "A cinematic scene at sunset",
        resolution: "720p",
        aspect_ratio: "16:9",
        enhance_prompt: true,
        batch_size: 1,
      },
      withPolling: true,
    },
  );

  if (result.status !== "completed") {
    console.error("[image] failed:", result.status, (result as any).error ?? "");
    process.exit(1);
  }

  const url = result.images?.[0]?.url ?? (result as any).image?.url;
  url ? console.log("[image] URL:", url) : console.log("[image] result:", JSON.stringify(result, null, 2));
}

async function generateVideo() {
  console.log("[video] Wan 3.0 — cheapest video model (~$0.020/s)");
  const result = await higgsfield.subscribe(
    "alibaba/wan-3.0/text-to-video",
    {
      input: {
        prompt: "A cinematic scene at sunset",
        duration: 5,
        resolution: "720p",
        aspect_ratio: "16:9",
        generate_audio: true,
      },
      withPolling: true,
    },
  );

  if (result.status !== "completed") {
    console.error("[video] failed:", result.status, (result as any).error ?? "");
    process.exit(1);
  }

  const url = result.video?.url ?? (result as any).videos?.[0]?.url;
  url ? console.log("[video] URL:", url) : console.log("[video] result:", JSON.stringify(result, null, 2));
}

// Explicit premium mode — only use when quality > cost matters
async function generateVideoSeedance() {
  console.log("[seedance] Seedance 2.5 — premium quality, higher cost than Wan 3.0");
  const result = await higgsfield.subscribe(
    "bytedance/seedance-2.5/text-to-video",
    {
      input: {
        prompt: "A cinematic scene at sunset",
        duration: 5,
        resolution: "720p",
        aspect_ratio: "16:9",
        output_format: "mp4",
        generate_audio: true,
      },
      withPolling: true,
    },
  );

  if (result.status !== "completed") {
    console.error("[seedance] failed:", result.status, (result as any).error ?? "");
    process.exit(1);
  }

  const url = result.video?.url ?? (result as any).videos?.[0]?.url;
  url ? console.log("[seedance] URL:", url) : console.log("[seedance] result:", JSON.stringify(result, null, 2));
}

const mode = process.argv[2] ?? "video";
if (mode === "image") generateImage().catch(console.error);
else if (mode === "seedance") generateVideoSeedance().catch(console.error);
else generateVideo().catch(console.error);
