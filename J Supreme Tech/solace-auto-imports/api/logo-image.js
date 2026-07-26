import { readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const pngPath = join(root, 'images', 'logo.png');
const svgPath = join(root, 'images', 'logo.svg');

async function renderLogo(size) {
  if (existsSync(pngPath)) {
    return sharp(readFileSync(pngPath)).resize(size, size, { fit: 'cover' }).png().toBuffer();
  }
  if (!existsSync(svgPath)) {
    throw new Error('Missing logo assets');
  }
  return sharp(readFileSync(svgPath)).resize(size, size, { fit: 'cover' }).png().toBuffer();
}

export default async function handler(req, res) {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.statusCode = 405;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'Method not allowed.' }));
    return;
  }

  const raw = Number.parseInt(String(req.query?.size || '512'), 10);
  const size = Number.isFinite(raw) ? Math.min(512, Math.max(16, raw)) : 512;

  try {
    const body = await renderLogo(size);
    res.statusCode = 200;
    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    if (req.method === 'HEAD') {
      res.end();
      return;
    }
    res.end(body);
  } catch {
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'Logo unavailable.' }));
  }
}
