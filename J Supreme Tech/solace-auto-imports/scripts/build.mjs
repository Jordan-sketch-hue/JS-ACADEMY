import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');

// ─── Cache buster — every deploy gets a fresh version stamped into every
//     admin JS/CSS URL so browsers never serve stale bundles ─────────────
const BUILD_ID = Date.now().toString(36);
const CACHE_BUST_FILES = [
  // Admin SPA
  { path: 'admin/index.html', kind: 'html' },
  { path: 'admin/js/app.js', kind: 'js' },
  { path: 'admin/js/api.js', kind: 'js' },
  // Public site HTML — bumps src/js/* URLs so phones load fresh JS each deploy
  { path: 'index.html', kind: 'html' },
  { path: 'inventory.html', kind: 'html' },
  { path: 'vehicle.html', kind: 'html' },
  { path: 'about.html', kind: 'html' },
  { path: 'services.html', kind: 'html' },
  { path: 'contact.html', kind: 'html' },
  { path: 'source-vehicle.html', kind: 'html' },
  { path: '404.html', kind: 'html' },
];
for (const { path, kind } of CACHE_BUST_FILES) {
  const file = resolve(root, path);
  if (!existsSync(file)) continue;
  let src = readFileSync(file, 'utf8');
  // Bump any /admin/js/* or /admin/css/* references
  src = src.replace(
    /(["'\(`])(\/admin\/(?:js|css)\/[^"'`?)\s]+\.(?:js|css))(?:\?v=[A-Za-z0-9_-]+)?/g,
    (_, q, asset) => `${q}${asset}?v=${BUILD_ID}`,
  );
  // Bump any src/js/* or src/css/* references on public pages
  src = src.replace(
    /(["'\(`])(src\/(?:js|css)\/[^"'`?)\s]+\.(?:js|css))(?:\?v=[A-Za-z0-9_-]+)?/g,
    (_, q, asset) => `${q}${asset}?v=${BUILD_ID}`,
  );
  // Bump ES-module imports inside JS files
  src = src.replace(
    /(from\s+["'`])(\.\/[^"'`?]+\.js)(?:\?v=[A-Za-z0-9_-]+)?(["'`])/g,
    (_, p, mod, e) => `${p}${mod}?v=${BUILD_ID}${e}`,
  );
  // Bump the logo cache-buster on public pages too — otherwise the
  // immutable Cache-Control on /images/* means stale logos never refresh
  // even after we replace logo.png in the repo. Matches relative paths
  // (`images/logo.png`) and absolute URLs in JSON-LD (`https://.../images/logo.png`).
  src = src.replace(
    /((?:https?:\/\/[^"'`\s]*?\/)?images\/logo\.png)(?:\?v=[A-Za-z0-9_-]+)?/g,
    (_, asset) => `${asset}?v=${BUILD_ID}`,
  );
  writeFileSync(file, src);
  console.log(`Cache-busted ${path} → v=${BUILD_ID}`);
}

const logoResult = spawnSync(process.execPath, ['scripts/copy-logo.mjs'], {
  cwd: root,
  stdio: 'inherit',
});

if ((logoResult.status ?? 1) !== 0) {
  process.exit(logoResult.status ?? 1);
}

const adminShell = resolve(root, 'admin', 'index.html');
const adminRoutes = [
  'admin/dashboard.html',
  'admin/vehicles.html',
  'admin/vehicles/new.html',
  'admin/leads.html',
  'admin/users.html',
  'admin/settings.html',
  'backoffice.html',
  'backoffice/login.html',
  'backoffice/dashboard.html',
  'backoffice/vehicles.html',
  'backoffice/vehicles/new.html',
  'backoffice/leads.html',
  'backoffice/users.html',
  'backoffice/settings.html',
];

for (const route of adminRoutes) {
  const target = resolve(root, route);
  const targetDir = dirname(target);
  if (!existsSync(targetDir)) mkdirSync(targetDir, { recursive: true });
  copyFileSync(adminShell, target);
}

console.log(`Admin route fallbacks generated: ${adminRoutes.length}`);
