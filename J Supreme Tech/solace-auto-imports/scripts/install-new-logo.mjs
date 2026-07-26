/**
 * Convert client-provided JPEG logo to PNG + favicon sizes.
 * Usage: node scripts/install-new-logo.mjs "<path-to-jpeg>"
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const src = process.argv[2];
if (!src || !existsSync(src)) {
  console.error('Pass an existing JPEG/PNG path');
  process.exit(1);
}

const buf = readFileSync(src);

const logo512 = await sharp(buf).resize(512, 512, { fit: 'cover' }).png({ compressionLevel: 9 }).toBuffer();
writeFileSync(resolve(root, 'images', 'logo.png'), logo512);

const favicon = await sharp(buf).resize(32, 32, { fit: 'cover' }).png().toBuffer();
writeFileSync(resolve(root, 'favicon.png'), favicon);

if (!existsSync(resolve(root, 'assets'))) mkdirSync(resolve(root, 'assets'), { recursive: true });
writeFileSync(resolve(root, 'assets', 'app-icon-192.png'), await sharp(buf).resize(192, 192, { fit: 'cover' }).png().toBuffer());
writeFileSync(resolve(root, 'assets', 'app-icon-512.png'), await sharp(buf).resize(512, 512, { fit: 'cover' }).png().toBuffer());

console.log('logo.png:        ', logo512.length, 'bytes (512x512)');
console.log('favicon.png:     32x32');
console.log('app-icon-192.png: 192x192');
console.log('app-icon-512.png: 512x512');
