/**
 * Writes SETUP-RESULT.json via Supabase Admin REST API (no npm deps beyond fetch).
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const REDIRECT = 'https://solace-auto-imports.vercel.app/admin';
const ARCHITECT_EMAIL = 'jordanmorrisr@gmail.com';
const PASSWORD = 'Solace-Jader-2026!7K';

loadEnv(resolve(root, '.vercel', '.env.production.local'));

const url = clean(process.env.NEXT_PUBLIC_SUPABASE_URL);
const anonKey = clean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
const serviceKey = clean(process.env.SUPABASE_SERVICE_ROLE_KEY);

const result = {
  website: 'https://solace-auto-imports.vercel.app',
  backofficeLogin: 'https://solace-auto-imports.vercel.app/admin',
  architectEmail: ARCHITECT_EMAIL,
  architectPassword: PASSWORD,
  businessAdminEmail: 'solaceimports@gmail.com',
  recoveryLink: null,
  signInTest: 'pending',
};

const headers = {
  Authorization: `Bearer ${serviceKey}`,
  apikey: anonKey,
  'Content-Type': 'application/json',
};

const listRes = await fetch(`${url}/auth/v1/admin/users?page=1&per_page=1000`, { headers });
const listJson = await listRes.json();
let user = listJson.users?.find((u) => u.email?.toLowerCase() === ARCHITECT_EMAIL);

if (user) {
  await fetch(`${url}/auth/v1/admin/users/${user.id}`, {
    method: 'PUT',
    headers,
    body: JSON.stringify({ password: PASSWORD, email_confirm: true }),
  });
} else {
  const createRes = await fetch(`${url}/auth/v1/admin/users`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ email: ARCHITECT_EMAIL, password: PASSWORD, email_confirm: true }),
  });
  const createJson = await createRes.json();
  if (!createRes.ok) {
    result.error = createJson.msg || createJson.message || JSON.stringify(createJson);
    writeFileSync(resolve(root, 'SETUP-RESULT.json'), JSON.stringify(result, null, 2));
    process.exit(1);
  }
  user = createJson;
}

const linkRes = await fetch(`${url}/auth/v1/admin/generate_link`, {
  method: 'POST',
  headers,
  body: JSON.stringify({
    type: 'recovery',
    email: ARCHITECT_EMAIL,
    options: { redirect_to: REDIRECT },
  }),
});
const linkJson = await linkRes.json();
if (linkRes.ok && linkJson.action_link) {
  result.recoveryLink = linkJson.action_link.replace(
    /redirect_to=[^&]*/i,
    `redirect_to=${encodeURIComponent(REDIRECT)}`,
  );
}

const signRes = await fetch(`${url}/auth/v1/token?grant_type=password`, {
  method: 'POST',
  headers: { apikey: anonKey, 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: ARCHITECT_EMAIL, password: PASSWORD }),
});
result.signInTest = signRes.ok ? 'ok' : `failed: ${(await signRes.json()).error_description || signRes.status}`;

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

function loadEnv(path) {
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
    process.env[key] = clean(val);
  }
}

function clean(v) {
  return String(v || '').replace(/^["']+|["']+$/g, '').replace(/\\r\\n|\\n|\\r/gi, '').replace(/\r?\n/g, '').trim();
}
