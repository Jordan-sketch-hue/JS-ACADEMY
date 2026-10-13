// Generates AI portrait images for the tutor roster via Pollinations.ai (free,
// keyless, no API key — same fallback path Xalvz uses now that Ready Player Me's
// free tier is gone). These are SYNTHETIC personas (fictional AI tutors), not
// photos of real people, so no likeness/copyright exposure.
//
// Dr. Gooden (en-gooden) is EXCLUDED — she's a real person (the founder); her
// slot keeps the illustrated SVG mark until her real photo/voice clone ships.
// Never AI-generate a "photo" of an actual real person.
import { LANGUAGE_TUTORS } from "../lib/curriculum/tutor-roster.ts";
import { mkdirSync, writeFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, "..", "public", "avatars");
mkdirSync(OUT, { recursive: true });

const ETHNICITY = {
  "en-whitmore": "British woman",
  "en-clarke": "British man",
  "en-bennett": "American woman",
  "en-reed": "American man",
  "es-reyes": "Mexican man",
  "es-cruz": "Colombian woman",
  "es-romero": "Argentine man",
  "de-kruger": "German man",
  "de-wagner": "German woman",
  "de-hoffmann": "German man, younger",
  "zh-liwei": "Chinese woman",
  "zh-chenhao": "Chinese man",
  "zh-zhangmei": "Chinese woman",
  "ja-tanaka": "Japanese man",
  "ja-sato": "Japanese woman",
  "ja-yamada": "Japanese man",
  "fr-laurent": "French woman",
  "fr-martin": "French man",
  "fr-dubois": "French woman",
  "en-campbell": "Jamaican woman, warm smile, Caribbean professional",
  "en-morgan": "Jamaican man, confident, Caribbean professional",
};

function promptFor(id) {
  const who = ETHNICITY[id];
  return (
    `professional studio portrait headshot of a ${who}, language tutor, ` +
    `warm genuine smile, business attire, soft gold-toned studio lighting, ` +
    `neutral dark background, shallow depth of field, photorealistic, ` +
    `high quality, centered, shoulders-up`
  );
}

function seedFor(id) {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return h % 1_000_000;
}

async function fetchPortrait(id) {
  const prompt = encodeURIComponent(promptFor(id));
  const url = `https://image.pollinations.ai/prompt/${prompt}?width=512&height=512&seed=${seedFor(id)}&nologo=true&model=flux`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${id}: HTTP ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  writeFileSync(join(OUT, `${id}.jpg`), buf);
  console.log(`✓ ${id} (${buf.length} bytes)`);
}

const ids = Object.values(LANGUAGE_TUTORS)
  .flat()
  .map((t) => t.id)
  .filter((id) => id in ETHNICITY);

for (const id of ids) {
  try {
    await fetchPortrait(id);
  } catch (e) {
    console.error(`✗ ${id}: ${e.message}`);
  }
}
console.log(`Done: ${ids.length} portraits requested.`);
