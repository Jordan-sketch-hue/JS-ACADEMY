# J Supreme Conglomerate — Agent SOPs

---

## HIGGSFIELD AI — MEDIA GENERATION SOP

Credentials load from `.env.local` → `HF_CREDENTIALS=key-id:key-secret` (never commit, never log).

### Default Models — ALWAYS use these unless overridden

| Type  | Model ID                         | Cost       |
|-------|----------------------------------|------------|
| Image | `higgsfield-ai/soul/v2/standard` | $0.003/img |
| Video | `alibaba/wan-3.0/text-to-video`  | $0.020/s   |

### Upgrade options (when quality justifies it)

| Type  | Model ID                                  | Cost      |
|-------|-------------------------------------------|-----------|
| Image | `alibaba/qwen-image-3/text-to-image`      | $0.040/img |
| Video | `alibaba/wan-3.0-prime/text-to-video`     | $0.027/s  |
| Video | `bytedance/seedance-2.5/text-to-video`    | $0.144/s  |

---

## GENERATION WRAPPER — USE THIS, NOT RAW SDK

Import from `higgsfield/generate.ts` for all JST brand content:

```ts
import { generateImage, generateVideo } from "./higgsfield/generate.js";
import { enrichPrompt, BRAND_PRESETS } from "./higgsfield/context.js";
import { DIMENSIONS } from "./higgsfield/dimensions.js";

// Image for Instagram feed (portrait) for Language Cradle
const img = await generateImage({
  prompt: "Mother and child learning together at a sunlit table",
  platform: "instagram_feed_portrait",
  brand: "language-cradle",
});

// Reel for 876 Car Wash
const vid = await generateVideo({
  prompt: "Gleaming luxury SUV emerging from a car wash in sunlight",
  platform: "instagram_reels",
  brand: "876-car-wash",
  duration: 5,
});
```

---

## PLATFORM DIMENSION PRESETS

All presets defined in `higgsfield/dimensions.ts`. Key ones:

| Platform key               | Label                   | Pixels      | Aspect  |
|----------------------------|-------------------------|-------------|---------|
| `instagram_feed_square`    | IG Feed (Square)        | 1080×1080   | 1:1     |
| `instagram_feed_portrait`  | IG Feed (Portrait 4:5)  | 1080×1350   | 3:4     |
| `instagram_story`          | IG Story                | 1080×1920   | 9:16    |
| `instagram_reels`          | IG Reels                | 1080×1920   | 9:16    |
| `tiktok`                   | TikTok                  | 1080×1920   | 9:16    |
| `linkedin_feed`            | LinkedIn Post           | 1200×627    | 16:9    |
| `linkedin_cover`           | LinkedIn Cover          | 1584×396    | 4:1     |
| `twitter_card`             | Twitter/X Card          | 1600×900    | 16:9    |
| `youtube_thumbnail`        | YouTube Thumbnail       | 1280×720    | 16:9    |
| `hero_desktop`             | Website Hero (Desktop)  | 1920×1080   | 16:9    |
| `hero_mobile`              | Website Hero (Mobile)   | 1080×1920   | 9:16    |

---

## CREATIVE CONTEXT SYSTEM (from JST Academy)

The `enrichPrompt()` function in `higgsfield/context.ts` auto-appends these principles.

### Color Psychology (Design M3 + Creative M8)
Apply based on brand emotion target:
- **Red** → urgency, passion, appetite — System 1 trigger
- **Blue** → trust, authority, competence — System 2, B2B/tech
- **Gold/Black** → premium, exclusivity, authority
- **Green** → health, growth, wealth, calm
- **Orange** → warmth, affordability, approachable energy
- **Purple** → luxury, mystery, aspiration

### System 1 vs System 2 (Consumer Psychology M1–M2)
- **System 1 prompts** (fast/emotional): include direct eye contact faces, contrast, motion, bright saturated colors, babies/animals, social scenes
- **System 2 prompts** (rational/trust): include clean composition, authority signals, structured information, before/after, professional environment

### Lighting (Creative M2 — Photography Vocabulary)
- **Golden hour** → warmth, aspiration, lifestyle
- **Blue hour** → moody, premium, mysterious
- **Soft diffused** → beauty, wellness, approachable lifestyle
- **Harsh/high contrast** → editorial, bold, fashion
- **Backlit** → dramatic, ethereal, aspirational
- **Studio white** → e-commerce, product, clinical trust

### Composition (Design M1 + M5)
- **Rule of thirds** → dynamic, natural, most brand content
- **Negative space** → premium, minimal, gives copy room
- **Leading lines** → guides eye, architectural, tech
- **Symmetry** → authority, luxury, institutional
- **Shallow DOF** → isolates subject, portrait, product

### Visual Storytelling (Creative M1 + M4)
- **Hero journey** → transformation and aspiration
- **Slice of life** → authenticity, trust, relatability
- **Aspirational** → lifestyle, premium, travel
- **Cultural moment** → community, belonging, identity

### Cultural Context (Cross Cultures + Consumer Psych M10)
Encoded in `CULTURAL_CONTEXTS` in context.ts — pass `culture` to automatically enrich with authentic visual references:
- `jamaican` → reggae, coast, green/gold/black, community, celebration
- `caribbean` → color, warmth, music, coast
- `american` → achievement, diversity, scale, aspiration
- `west_african` → pattern, color saturation, community, pride

---

## BRAND PRESETS

Defined in `higgsfield/context.ts → BRAND_PRESETS`. Pass `brand:` to auto-apply:

| Key               | Brand               | Tone      | Culture   |
|-------------------|---------------------|-----------|-----------|
| `language-cradle` | Language Cradle     | warm      | jamaican  |
| `876-car-wash`    | 876 Luxury Car Wash | premium   | jamaican  |
| `ferguson-home`   | Ferguson H.O.M.E.   | warm      | jamaican  |
| `bp-couriers`     | BP Couriers         | energetic | jamaican  |
| `aboo-tours`      | Aboo Tours          | warm      | jamaican  |
| `jst`             | J Supreme Tech      | bold      | jamaican  |
| `solidtrust`      | Solid Trust Courier | bold      | jamaican  |

---

## RUN COMMANDS

```bash
# Video (Wan 3.0, default)
node --env-file=.env.local --experimental-strip-types index.ts

# Image (Soul 2)
node --env-file=.env.local --experimental-strip-types index.ts image
```

---

## RULES FOR ALL AGENTS

1. **Never upgrade model** unless the specific use case requires it — cheap models first always
2. **Always pass `brand:`** when generating for a JST client brand
3. **Always pass `platform:`** to get correct aspect ratio — never guess dimensions
4. **Never commit `.env.local`** — it's gitignored, credentials stay server-side
5. **Batch images** using `batchSize: 4` when doing ad creative variants (4 variants = $0.012 total)
6. **Reels/Stories/TikTok** always use `9:16` → `instagram_reels` or `tiktok` platform key
7. **LinkedIn + Twitter hero** always use `16:9` → `linkedin_feed` or `twitter_card`

---

## ⚠️ CSS / STYLING BREAKS — DIAGNOSIS & FIX

**Symptom:** Site loads at `jsupremeconglomerate.online` but is completely unstyled — no layout, no colors, raw plain text.

**Root cause:** Tailwind v3 needs `tailwind.config.ts` to scan files and emit utility classes. Without it, `@tailwind utilities` outputs nothing. The following 4 files MUST be committed to git — if any are missing, Vercel's build produces a ~12KB CSS stub with zero utility classes:

| File | Purpose |
|------|---------|
| `tailwind.config.ts` | Content paths for Tailwind class scanning — CRITICAL |
| `postcss.config.mjs` | Hooks Tailwind into Next.js build via PostCSS |
| `next.config.ts` | Security headers + outputFileTracingRoot |
| `tsconfig.json` | TypeScript `@/*` path aliases |

**Secondary cause:** Even after committing the files, Vercel caches old CSS build artifacts. A new deploy will still serve the broken CSS until a source file changes and busts the cache.

**Quick diagnosis (browser console on live site):**
```js
// Healthy = true, broken = false
[...document.styleSheets].flatMap(s => { try { return [...s.cssRules] } catch(e) { return [] } }).some(r => r.selectorText?.includes('.flex'))
```
Also check: Network tab → CSS file → if under 15KB, it's broken. Healthy is ~100KB+.

**Fix in 3 steps:**
```powershell
# Step 1 — confirm/add missing files (run from C:\Users\jader)
git status "J Supreme Tech/j-supreme-conglomerate/tailwind.config.ts"
# If "??" (untracked), stage and commit all 4:
git add "J Supreme Tech/j-supreme-conglomerate/tailwind.config.ts" `
        "J Supreme Tech/j-supreme-conglomerate/postcss.config.mjs" `
        "J Supreme Tech/j-supreme-conglomerate/next.config.ts" `
        "J Supreme Tech/j-supreme-conglomerate/tsconfig.json"
git commit -m "fix: commit missing build config files"
git push origin main

# Step 2 — bust Vercel's CSS cache (touch globals.css, deploy, revert)
cd "C:\Users\jader\J Supreme Tech\j-supreme-conglomerate"
vercel deploy --prod --scope jordan-sketch-hues-projects

# Step 3 — verify (CSS file must be ~100KB and have .flex)
```

**Why `vercel build --prebuilt` fails on Windows:** Vercel's build creates symlinks in `.vercel/output/functions/` which require elevated privileges. Use `vercel deploy --prod` (Vercel builds server-side) with the cache-bust trick instead.
