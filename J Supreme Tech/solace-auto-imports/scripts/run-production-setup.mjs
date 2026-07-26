/**
 * Production setup: auth fix, recovery link, optional storage bucket SQL note.
 * Writes SETUP-RESULT.json (no secrets except password you chose).
 *
 * Usage:
 *   node scripts/run-production-setup.mjs
 */
import { createClient } from '@supabase/supabase-js';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { randomBytes } from 'node:crypto';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const REDIRECT = 'https://solace-auto-imports.vercel.app/admin/login';
const ARCHITECT_EMAIL = 'jordanmorrisr@gmail.com';
const PASSWORD = process.argv[2] || 'Solace-Jader-2026!7K';

loadEnvFile(resolve(root, '.vercel', '.env.production.local'));
loadEnvFile(resolve(root, '.env.local'));

const url = cleanEnv(process.env.NEXT_PUBLIC_SUPABASE_URL);
const anonKey = cleanEnv(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
const serviceKey = cleanEnv(process.env.SUPABASE_SERVICE_ROLE_KEY);

const result = {
  website: 'https://solace-auto-imports.vercel.app',
  backofficeLogin: 'https://solace-auto-imports.vercel.app/admin/login',
  architectEmail: ARCHITECT_EMAIL,
  architectPassword: PASSWORD,
  businessAdminEmail: 'solaceimports@gmail.com',
  supabaseProject: url,
  recoveryLink: null,
  signInTest: 'pending',
  siteUrlFix: 'Set Supabase Auth → URL Configuration → Site URL to https://solace-auto-imports.vercel.app and add Redirect URL https://solace-auto-imports.vercel.app/admin/login',
  sqlFiles: [
    'supabase/migrations/20260519170000_solace_auto_imports.sql',
    'supabase/migrations/20260519180000_backoffice_v2.sql',
    'supabase/migrations/20260519180100_solace_storage_bucket.sql',
  ],
};

if (!url || !serviceKey || !anonKey) {
  result.error = 'Missing Supabase env. Run: npx vercel env pull .vercel/.env.production.local --environment=production';
  writeFileSync(resolve(root, 'SETUP-RESULT.json'), JSON.stringify(result, null, 2));
  console.error(result.error);
  process.exit(1);
}

const admin = createClient(url, serviceKey, { auth: { persistSession: false } });
const pub = createClient(url, anonKey, { auth: { persistSession: false } });

let user = null;
const { data: listed } = await admin.auth.admin.listUsers({ page: 1, perPage: 1000 });
user = listed?.users?.find((u) => u.email?.toLowerCase() === ARCHITECT_EMAIL);

if (user) {
  await admin.auth.admin.updateUserById(user.id, { password: PASSWORD, email_confirm: true });
} else {
  const { data, error } = await admin.auth.admin.createUser({
    email: ARCHITECT_EMAIL,
    password: PASSWORD,
    email_confirm: true,
  });
  if (error) {
    result.error = error.message;
    writeFileSync(resolve(root, 'SETUP-RESULT.json'), JSON.stringify(result, null, 2));
    process.exit(1);
  }
  user = data.user;
}

const { data: linkData, error: linkErr } = await admin.auth.admin.generateLink({
  type: 'recovery',
  email: ARCHITECT_EMAIL,
  options: { redirectTo: REDIRECT },
});

if (!linkErr && linkData?.properties?.action_link) {
  let link = linkData.properties.action_link;
  if (/localhost/i.test(link)) {
    link = link.replace(/redirect_to=[^&]*/i, `redirect_to=${encodeURIComponent(REDIRECT)}`);
  }
  result.recoveryLink = link;
}

const { error: signErr } = await pub.auth.signInWithPassword({
  email: ARCHITECT_EMAIL,
  password: PASSWORD,
});
result.signInTest = signErr ? `failed: ${signErr.message}` : 'ok';
await pub.auth.signOut();

writeFileSync(resolve(root, 'SETUP-RESULT.json'), JSON.stringify(result, null, 2));
writeFileSync(
  resolve(root, 'backoffice-login.txt'),
  [
    'Solace Auto Imports — PRODUCTION LOGIN',
    '',
    `Website:     ${result.website}`,
    `Backoffice:  ${result.backofficeLogin}`,
    '',
    `Architect email:    ${ARCHITECT_EMAIL}`,
    `Architect password: ${PASSWORD}`,
    '',
    result.recoveryLink ? `Recovery link (one-time):\n${result.recoveryLink}` : '',
    '',
    `Business admin: solaceimports@gmail.com (use Send password reset on login page)`,
    '',
    `Sign-in test: ${result.signInTest}`,
  ].join('\n'),
);

console.log(JSON.stringify(result, null, 2));

function loadEnvFile(path) {
  if (!existsSync(path)) return;
  for (const line of readFileSync(path, 'utf8').split(/\r?\n/)) {
    const t = line.trim();
    if (!t || t.startsWith('#')) continue;
    const eq = t.indexOf('=');
    if (eq === -1) continue;
    const key = t.slice(0, eq).trim();
    let val = t.slice(eq + 1).trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    process.env[key] = cleanEnv(val);
  }
}

function cleanEnv(v) {
  return String(v || '').replace(/^["']+|["']+$/g, '').replace(/\\r\\n|\\n|\\r/gi, '').replace(/\r?\n/g, '').trim();
}
