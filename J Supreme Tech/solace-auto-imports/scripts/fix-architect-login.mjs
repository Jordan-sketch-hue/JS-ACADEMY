/**
 * Diagnose and repair architect login (password + email confirmed + sign-in test).
 */
import { createClient } from '@supabase/supabase-js';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

loadEnvFile(resolve(root, '.vercel', '.env.production.local'));
loadEnvFile(resolve(root, '.env.local'));
loadEnvFile(resolve(root, '.env'));

const email = (process.argv[2] || 'jordanmorrisr@gmail.com').trim().toLowerCase();
const password = cleanEnv(process.argv[3] || 'Solace-Jader-2026!7K');

const url = requireSupabaseUrl();
const anonKey = requireEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY');
const serviceKey = requireEnv('SUPABASE_SERVICE_ROLE_KEY');

const admin = createClient(url, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});
const publicClient = createClient(url, anonKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const matches = await listAllUsers(admin, email);
console.log(`Supabase project: ${url}`);
console.log(`Users matching ${email}: ${matches.length}`);

if (!matches.length) {
  console.log('No user found — creating...');
  const { data, error } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });
  if (error) {
    console.error('createUser failed:', error.message);
    process.exit(1);
  }
  matches.push(data.user);
} else {
  for (const user of matches) {
    console.log(`Fixing user id=${user.id} confirmed=${user.email_confirmed_at ? 'yes' : 'no'}`);
    const { error } = await admin.auth.admin.updateUserById(user.id, {
      password,
      email_confirm: true,
    });
    if (error) {
      console.error(`updateUserById failed for ${user.id}:`, error.message);
      process.exit(1);
    }
  }
}

let { error: signInError } = await publicClient.auth.signInWithPassword({
  email,
  password,
});

if (signInError) {
  console.warn('First sign-in test failed — recreating user...');
  for (const user of matches) {
    await admin.auth.admin.deleteUser(user.id);
  }
  const { error: createError } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });
  if (createError) {
    console.error('Recreate failed:', createError.message);
    process.exit(1);
  }
  const retry = await publicClient.auth.signInWithPassword({ email, password });
  signInError = retry.error;
}

if (signInError) {
  console.error('');
  console.error('SIGN-IN TEST FAILED:', signInError.message);
  console.error('Open Supabase → Authentication → Users and check this email manually.');
  process.exit(1);
}

await publicClient.auth.signOut();

await publicClient.auth.signOut();

const loginFile = resolve(root, 'backoffice-login.txt');
writeFileSync(
  loginFile,
  [
    'Solace Auto Imports — backoffice login (verified)',
    '',
    `Email:    ${email}`,
    `Password: ${password}`,
    '',
    'Admin URL: https://solace-auto-imports.vercel.app/admin',
    '',
    'Sign-in test against Supabase: OK',
  ].join('\n'),
  'utf8',
);

console.log('');
console.log('='.repeat(72));
console.log('LOGIN VERIFIED — use these on https://solace-auto-imports.vercel.app/admin');
console.log('='.repeat(72));
console.log(`Email:    ${email}`);
console.log(`Password: ${password}`);
console.log('='.repeat(72));
console.log('');

async function listAllUsers(client, targetEmail) {
  const hits = [];
  let page = 1;
  while (page < 20) {
    const { data, error } = await client.auth.admin.listUsers({ page, perPage: 1000 });
    if (error) throw error;
    for (const user of data.users) {
      if (user.email?.toLowerCase() === targetEmail) hits.push(user);
    }
    if (data.users.length < 1000) break;
    page += 1;
  }
  return hits;
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
    const cleaned = cleanEnv(trimmed.slice(eq + 1).trim());
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
    console.error(`Missing ${name}`);
    process.exit(1);
  }
  return value;
}

function requireSupabaseUrl() {
  const value = requireEnv('NEXT_PUBLIC_SUPABASE_URL');
  return new URL(value).origin;
}
