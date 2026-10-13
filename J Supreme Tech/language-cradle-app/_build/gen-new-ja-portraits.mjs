import { mkdirSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, "..", "public", "avatars");
mkdirSync(OUT, { recursive: true });

const NEW_TUTORS = {
  "en-campbell": "Jamaican woman, warm smile, Caribbean professional",
  "en-morgan": "Jamaican man, confident, Caribbean professional",
};

function promptFor(id) {
  const who = NEW_TUTORS[id];
  return `professional studio portrait headshot of a ${who}, language tutor, warm genuine smile, business attire, soft gold-toned studio lighting, neutral dark background, shallow depth of field, photorealistic, high quality, centered, shoulders-up`;
}

function seedFor(id) {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return h % 1_000_000;
}

for (const id of Object.keys(NEW_TUTORS)) {
  const prompt = encodeURIComponent(promptFor(id));
  const url = `https://image.pollinations.ai/prompt/${prompt}?width=512&height=512&seed=${seedFor(id)}&nologo=true&model=flux`;
  console.log(`Fetching ${id}...`);
  const res = await fetch(url);
  if (!res.ok) { console.error(`x ${id}: HTTP ${res.status}`); continue; }
  const buf = Buffer.from(await res.arrayBuffer());
  writeFileSync(join(OUT, `${id}.jpg`), buf);
  console.log(`done ${id} (${buf.length} bytes)`);
}
