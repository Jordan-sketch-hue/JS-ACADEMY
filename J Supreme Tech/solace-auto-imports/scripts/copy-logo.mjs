/**
 * Copy client logo.png when available; otherwise rasterize from images/logo.svg.
 * Usage: node scripts/copy-logo.mjs
 */
import { copyFileSync, existsSync, mkdirSync, statSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dest = join(root, 'images', 'logo.png');
const favicon = join(root, 'favicon.ico');
const sources = [
  join(root, 'scripts', 'logo-source.png'),
  join(root, 'logo-source.png'),
  'C:\\Users\\jader\\.cursor\\projects\\empty-window\\assets\\logo.png',
];

mkdirSync(join(root, 'images'), { recursive: true });

// Are we on a deploy/CI build (Vercel) rather than a local run?
const isCI = !!(process.env.VERCEL || process.env.CI || process.env.NOW_BUILDER);

// The committed images/logo.png is the source of truth on a deploy build:
// Vercel's machine doesn't have the local source PNGs, so regenerating there
// can ONLY replace the real client logo with the rasterized-SVG placeholder.
// So on CI keep ANY committed logo regardless of size; locally keep it only if
// it's clearly the real one (the placeholder rasterizes to a small file).
if (existsSync(dest)) {
  const info = statSync(dest);
  if (isCI || info.size > 50_000) {
    copyFileSync(dest, favicon);
    console.log(
      `Keeping committed logo at ${dest} (${info.size} bytes)` +
        (isCI ? ' — CI build, never regenerated.' : '.'),
    );
    console.log('Wrote', favicon);
    process.exit(0);
  }
  console.log(`Committed logo looks like a placeholder (${info.size} bytes); trying real sources.`);
}

for (const src of sources) {
  if (!existsSync(src)) continue;
  copyFileSync(src, dest);
  copyFileSync(dest, favicon);
  const info = statSync(dest);
  console.log('Copied logo from', src);
  console.log('Wrote', dest, `(${info.size} bytes)`);
  console.log('Wrote', favicon);
  process.exit(0);
}

console.log('No client PNG found; rasterizing from images/logo.svg');
const result = spawnSync(process.execPath, ['scripts/rasterize-logo.mjs'], {
  cwd: root,
  stdio: 'inherit',
});
process.exit(result.status ?? 1);
