/**
 * Rasterize images/logo.svg → logo.png + favicon sizes (requires sharp).
 * Usage: node scripts/rasterize-logo.mjs
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const svgPath = resolve(root, 'images', 'logo.svg');

if (!existsSync(svgPath)) {
  console.error('Missing images/logo.svg');
  process.exit(1);
}

let sharp;
try {
  sharp = (await import('sharp')).default;
} catch {
  console.error('Install sharp first: npm install sharp --save-dev');
  process.exit(1);
}

const svg = readFileSync(svgPath);

mkdirSync(resolve(root, 'images'), { recursive: true });
mkdirSync(resolve(root, 'assets'), { recursive: true });

const logo512 = await sharp(svg).resize(512, 512, { fit: 'cover' }).png().toBuffer();
const favicon32 = await sharp(svg).resize(32, 32, { fit: 'cover' }).png().toBuffer();
writeFileSync(resolve(root, 'images', 'logo.png'), logo512);
writeFileSync(resolve(root, 'favicon.png'), favicon32);
writeFileSync(resolve(root, 'favicon.ico'), favicon32);
writeFileSync(resolve(root, 'assets', 'app-icon-192.png'), await sharp(svg).resize(192, 192, { fit: 'cover' }).png().toBuffer());
writeFileSync(resolve(root, 'assets', 'app-icon-512.png'), await sharp(svg).resize(512, 512, { fit: 'cover' }).png().toBuffer());

console.log('Wrote images/logo.png, favicon.png, favicon.ico, assets/app-icon-192.png, assets/app-icon-512.png');
