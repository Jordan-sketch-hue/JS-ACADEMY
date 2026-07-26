/**
 * Create or refresh a backoffice login and print a one-time setup link.
 * Supabase may not deliver email unless custom SMTP is configured — use the printed URL.
 *
 * Usage:
 *   node scripts/provision-backoffice-user.mjs jordanmorrisr@gmail.com
 *   node scripts/provision-backoffice-user.mjs jordanmorrisr@gmail.com --recovery
 *   node scripts/provision-backoffice-user.mjs jordanmorrisr@gmail.com --set-password
 */
import { createClient } from '@supabase/supabase-js';
import { randomBytes } from 'node:crypto';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

loadEnvFile(resolve(root, '.vercel', '.env.production.local'));
loadEnvFile(resolve(root, '.env.local'));
loadEnvFile(resolve(root, '.env'));

const email = (process.argv[2] || '').trim().toLowerCase();
const forceRecovery = process.argv.includes('--recovery');
const setPasswordMode = process.argv.includes('--set-password');
const passwordFlagIndex = process.argv.indexOf('--set-password');
const customPassword =
  passwordFlagIndex >= 0 ? cleanEnv(process.argv[passwordFlagIndex + 1]) : '';

if (!email || !email.includes('@')) {
  console.error(
    'Usage: node scripts/provision-backoffice-user.mjs <email> [--recovery|--set-password [password]]',
  );
  process.exit(1);
}

const url = requireSupabaseUrl();
const serviceKey = requireEnv('SUPABASE_SERVICE_ROLE_KEY');

const supabase = createClient(url, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const redirectTo = (
  cleanEnv(process.env.SOLACE_AUTH_REDIRECT_URL) ||
  'https://solace-auto-imports.vercel.app/admin'
).replace(/\/$/, '');

const existing = await findUserByEmail(supabase, email);

if (setPasswordMode) {
  const password = customPassword && !customPassword.startsWith('--') ? customPassword : randomPassword();
  if (password.length < 12) {
    console.error('Password must be at least 12 characters.');
    process.exit(1);
  }
  if (existing) {
    const { error } = await supabase.auth.admin.updateUserById(existing.id, { password });
    if (error) {
      console.error('Could not set password:', error.message);
      process.exit(1);
    }
  } else {
    const { error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });
    if (error) {
      console.error('Could not create user:', error.message);
      process.exit(1);
    }
  }
  const loginFile = resolve(root, 'backoffice-login.txt');
  const loginText = [
    'Solace Auto Imports — backoffice login',
    '',
    `Email:    ${email}`,
    `Password: ${password}`,
    '',
    'Admin URL: https://solace-auto-imports.vercel.app/admin',
    '',
    'Delete this file after you sign in.',
  ].join('\n');
  writeFileSync(loginFile, loginText, 'utf8');

  console.log('');
  console.log('='.repeat(72));
  console.log('BACKOFFICE LOGIN READY (no email link needed)');
  console.log('='.repeat(72));
  console.log(`Email:    ${email}`);
  console.log(`Password: ${password}`);
  console.log('');
  console.log(`Also saved to: ${loginFile}`);
  console.log('Sign in now: https://solace-auto-imports.vercel.app/admin');
  console.log('='.repeat(72));
  console.log('');
  process.exit(0);
}

// Prefer recovery — invite tokens expire fast and Site URL may have been localhost.
const linkType = forceRecovery || existing ? 'recovery' : 'invite';

const { data, error } = await supabase.auth.admin.generateLink({
  type: linkType,
  email,
  options: { redirectTo },
});

if (error) {
  console.error(`generateLink (${linkType}) failed:`, error.message);
  if (/redirect/i.test(error.message)) {
    console.error(
      'Add this URL in Supabase → Authentication → URL Configuration → Redirect URLs:',
    );
    console.error(`  ${redirectTo}`);
  }
  process.exit(1);
}

let actionLink = data?.properties?.action_link;
if (!actionLink) {
  console.error('No action link returned. Check Supabase Auth settings for this project.');
  process.exit(1);
}

if (/localhost/i.test(actionLink)) {
  console.warn('');
  console.warn('WARNING: Supabase returned a localhost redirect. Fix in Dashboard first:');
  console.warn('  Authentication → URL Configuration');
  console.warn('  Site URL: https://solace-auto-imports.vercel.app');
  console.warn('  Redirect URLs: https://solace-auto-imports.vercel.app/admin');
  console.warn('');
  actionLink = actionLink.replace(
    /redirect_to=[^&]*/i,
    `redirect_to=${encodeURIComponent(redirectTo)}`,
  );
}

console.log('');
console.log('='.repeat(72));
console.log(linkType === 'invite' ? 'NEW BACKOFFICE USER' : 'PASSWORD SETUP / RESET');
console.log('='.repeat(72));
console.log(`Email:    ${email}`);
console.log(`Status:   ${existing ? 'account already exists — recovery link' : 'invite link (new account)'}`);
console.log('');
console.log('OPEN THIS LINK IN YOUR BROWSER (copy the full line):');
console.log('');
console.log(actionLink);
console.log('');
console.log('Supabase may also email this link — check spam. If nothing arrives, the URL above still works.');
console.log('After you set a password, sign in at /admin with this same email.');
console.log('='.repeat(72));
console.log('');

async function findUserByEmail(client, targetEmail) {
  let page = 1;
  const perPage = 1000;
  while (page < 20) {
    const { data, error } = await client.auth.admin.listUsers({ page, perPage });
    if (error) throw error;
    const hit = data.users.find((user) => user.email?.toLowerCase() === targetEmail);
    if (hit) return hit;
    if (data.users.length < perPage) break;
    page += 1;
  }
  return null;
}

function loadEnvFile(path) {
  if (!existsSync(path)) return;
  const text = readFileSync(path, 'utf8');
  for (const line of text.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const value = trimmed.slice(eq + 1).trim();
    const cleaned = cleanEnv(value);
    if (cleaned) process.env[key] = cleaned;
  }
}

function cleanEnv(value) {
  return String(value || '')
    .replace(/^["']+|["']+$/g, '')
    .replace(/\\r\\n|\\n|\\r/gi, '')
    .replace(/\r?\n/g, '')
    .trim();
}

function requireEnv(name) {
  const value = cleanEnv(process.env[name]);
  if (!value) {
    console.error(`Missing ${name}.`);
    console.error('Run:  npx vercel env pull .vercel\\.env.production.local --environment=production');
    console.error('Then run this script again.');
    process.exit(1);
  }
  return value;
}

function requireSupabaseUrl() {
  const value = requireEnv('NEXT_PUBLIC_SUPABASE_URL');
  try {
    const parsed = new URL(value);
    if (!/^https?:$/i.test(parsed.protocol)) throw new Error('not http(s)');
    return parsed.origin;
  } catch {
    console.error('NEXT_PUBLIC_SUPABASE_URL is not a valid URL after cleaning.');
    console.error('Pull fresh env from Vercel, or set it in .env.local without extra quotes or \\r\\n.');
    process.exit(1);
  }
}

function randomPassword() {
  const raw = randomBytes(12).toString('base64url');
  return `Solace-${raw}!`;
}
