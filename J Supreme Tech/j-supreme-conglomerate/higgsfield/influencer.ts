import { config, higgsfield } from "@higgsfield/client/v2";
import * as fs from "fs";
import * as path from "path";

// ─── AI INFLUENCER PIPELINE ───────────────────────────────────────────────────
//
//  PERSONAS:
//    alex  — Male, 25-32. Tech-forward J Supreme Tech sales executive.
//            Promotes bundles, SaaS services, modern business solutions.
//            Target audience: Caribbean business owners, SMEs, startups.
//
//    maya  — Female, 24-31. Modern marketing strategist for J Supreme Marketing.
//            Promotes lifestyle, brand identity, social media growth.
//            Target audience: brand founders, content creators, entrepreneurs.
//
//  HOW SOUL ID WORKS:
//    1. Upload 5–10 portrait photos per persona → POST /v1/custom-references
//       Each photo should show: clear face, varied angles/lighting, no glasses,
//       plain backgrounds preferred. File: PNG or JPEG, under 5MB each.
//    2. API returns a Soul ID UUID — save it in .env.local as:
//       HF_SOUL_ID_ALEX=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
//       HF_SOUL_ID_MAYA=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
//    3. Pass UUID as custom_reference_id in Soul 2 generations below.
//    4. Use Genjutsu for motion transfer — put Alex/Maya into video footage.
//
//  USAGE:
//    tsx higgsfield/influencer.ts train-alex    — Upload photos to get Soul ID
//    tsx higgsfield/influencer.ts train-maya    — Upload photos to get Soul ID
//    tsx higgsfield/influencer.ts alex          — Generate Alex image
//    tsx higgsfield/influencer.ts maya          — Generate Maya image
//    tsx higgsfield/influencer.ts both          — Generate both (default)
//
// ─────────────────────────────────────────────────────────────────────────────

config({ credentials: process.env.HF_CREDENTIALS });

// ─── PERSONA DEFINITIONS ─────────────────────────────────────────────────────

const PERSONAS = {
  alex: {
    name: "Alex",
    soulId: process.env.HF_SOUL_ID_ALEX,
    prompts: {
      // Approved look: biracial Black/White, light caramel skin, short soft black curls faded on sides,
      // defined bone structure, black turtleneck, bright airy background
      jst: "Attractive mixed-race male model, light caramel skin tone, biracial Black and White, short soft black curls faded on sides, symmetrical handsome face, defined bone structure, warm brown eyes, relaxed confident smile, light stubble, fitted black turtleneck, clean modern luxury lifestyle portrait, bright airy background, professional fashion photography, sharp focus, photorealistic 4K",
      lifestyle: "Attractive mixed-race male model, light caramel skin, biracial Black and White, short soft black curls faded sides, confident warm smile, casual luxury streetwear, golden hour Caribbean city backdrop, lifestyle photography, fashion editorial, photorealistic 4K",
      sales: "Attractive mixed-race male model, light caramel skin, biracial Black and White, short soft black curls faded sides, sharp black blazer white shirt, confident professional presentation, modern glass office, dynamic editorial portrait, photorealistic 4K",
    },
    style: "tech-forward, confident, approachable, modern biracial executive",
  },
  maya: {
    name: "Maya",
    soulId: process.env.HF_SOUL_ID_MAYA,
    prompts: {
      // Approved look: Black female, colorful bold blazer, arms crossed, confident warm expression
      jst: "A sophisticated Black female marketing executive in her late 20s, bold colorful structured blazer, arms confidently crossed, warm smile, elegant jewelry, modern minimalist background, cinematic portrait lighting, photorealistic 4K",
      lifestyle: "A confident stylish Black woman in her late 20s, bold fashion statement outfit, warm genuine smile, vibrant Caribbean city setting, golden hour lifestyle photography, aspirational editorial, photorealistic 4K",
      sales: "A dynamic Black female executive in her late 20s, bold professional blazer, confident posture, presenting to camera, modern office environment, warm professional portrait, photorealistic 4K",
    },
    style: "modern, bold, sophisticated, aspirational brand ambassador",
  },
};

// ─── SOUL ID TRAINING ────────────────────────────────────────────────────────
// Upload portrait photos to create a persistent Soul ID for a persona.
// Run once per persona, then save the returned UUID to .env.local

async function trainSoulId(persona: "alex" | "maya", photosDir: string) {
  const p = PERSONAS[persona];
  console.log(`[train-${persona}] Uploading reference photos for ${p.name}...`);
  console.log(`[train-${persona}] Looking for photos in: ${photosDir}`);

  if (!fs.existsSync(photosDir)) {
    console.error(`[train-${persona}] Photos directory not found: ${photosDir}`);
    console.error(`[train-${persona}] Create it and add 5–10 portrait photos (PNG/JPEG).`);
    process.exit(1);
  }

  const photos = fs
    .readdirSync(photosDir)
    .filter((f) => /\.(jpg|jpeg|png)$/i.test(f))
    .map((f) => path.join(photosDir, f));

  if (photos.length < 5) {
    console.error(`[train-${persona}] Need at least 5 photos, found ${photos.length}.`);
    console.error(`[train-${persona}] Add more portrait photos to: ${photosDir}`);
    process.exit(1);
  }

  console.log(`[train-${persona}] Found ${photos.length} photos. Uploading...`);

  // POST /v1/custom-references via raw fetch (SDK may not wrap this endpoint)
  const [keyId, keySecret] = (process.env.HF_CREDENTIALS ?? "").split(":");
  const formData = new FormData();
  formData.append("name", `${persona}-${Date.now()}`);

  for (const photo of photos) {
    const blob = new Blob([fs.readFileSync(photo)], { type: "image/jpeg" });
    formData.append("images", blob, path.basename(photo));
  }

  const res = await fetch("https://api.higgsfield.ai/v1/custom-references", {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${keyId}:${keySecret}`).toString("base64")}`,
    },
    body: formData,
  });

  if (!res.ok) {
    const err = await res.text();
    console.error(`[train-${persona}] Upload failed (${res.status}):`, err);
    process.exit(1);
  }

  const data = (await res.json()) as { id: string; name: string };
  console.log(`\n[train-${persona}] Soul ID created!`);
  console.log(`[train-${persona}] UUID: ${data.id}`);
  console.log(`\nAdd this to .env.local:`);
  console.log(`HF_SOUL_ID_${persona.toUpperCase()}=${data.id}`);
}

// ─── IMAGE GENERATION ────────────────────────────────────────────────────────

async function generateInfluencer(
  persona: "alex" | "maya",
  scene: "jst" | "lifestyle" | "sales" = "jst",
  aspectRatio: string = "4:5",
) {
  const p = PERSONAS[persona];

  if (!p.soulId) {
    console.error(`[${persona}] No Soul ID set. Run: tsx higgsfield/influencer.ts train-${persona}`);
    console.error(`[${persona}] Then add HF_SOUL_ID_${persona.toUpperCase()}=<uuid> to .env.local`);
    process.exit(1);
  }

  const prompt = p.prompts[scene];
  console.log(`[${persona}] Generating ${p.name} — scene: ${scene}`);
  console.log(`[${persona}] Prompt: ${prompt}`);

  const result = await higgsfield.subscribe("higgsfield-ai/soul/v2/standard", {
    input: {
      prompt,
      resolution: "1080p",
      aspect_ratio: aspectRatio,
      enhance_prompt: true,
      batch_size: 1,
      custom_reference_id: p.soulId,
    },
    withPolling: true,
  });

  if (result.status !== "completed") {
    console.error(`[${persona}] Generation failed:`, result.status, (result as any).error ?? "");
    process.exit(1);
  }

  const url = result.images?.[0]?.url ?? (result as any).image?.url;
  if (url) {
    console.log(`[${persona}] ✓ ${p.name} generated:`);
    console.log(`[${persona}] URL: ${url}`);
  } else {
    console.log(`[${persona}] result:`, JSON.stringify(result, null, 2));
  }

  return url;
}

// ─── ENTRY POINT ─────────────────────────────────────────────────────────────

const mode = process.argv[2] ?? "both";
const scene = (process.argv[3] as "jst" | "lifestyle" | "sales") ?? "jst";

if (mode === "train-alex") {
  const photosDir = process.argv[3] ?? "./higgsfield/photos/alex";
  trainSoulId("alex", photosDir).catch(console.error);
} else if (mode === "train-maya") {
  const photosDir = process.argv[3] ?? "./higgsfield/photos/maya";
  trainSoulId("maya", photosDir).catch(console.error);
} else if (mode === "alex") {
  generateInfluencer("alex", scene).catch(console.error);
} else if (mode === "maya") {
  generateInfluencer("maya", scene).catch(console.error);
} else {
  // both — generate Alex and Maya in sequence
  (async () => {
    await generateInfluencer("alex", scene);
    console.log("");
    await generateInfluencer("maya", scene);
  })().catch(console.error);
}
