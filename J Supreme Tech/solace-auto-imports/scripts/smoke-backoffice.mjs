import { createClient } from '@supabase/supabase-js';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const env = loadEnv(resolve(root, '.vercel', '.env.production.local'));
const loginPath = resolve(root, 'backoffice-login.txt');

if (!existsSync(loginPath)) {
  throw new Error('Missing backoffice-login.txt for smoke test.');
}

const login = readFileSync(loginPath, 'utf8');
const email = login.match(/Email:\s*(\S+)/)?.[1];
const password = login.match(/Password:\s*(.+)/)?.[1]?.trim();

if (!email || !password) {
  throw new Error('Could not read smoke-test credentials.');
}

const supabase = createClient(
  requireEnv(env, 'NEXT_PUBLIC_SUPABASE_URL'),
  requireEnv(env, 'NEXT_PUBLIC_SUPABASE_ANON_KEY'),
  { auth: { persistSession: false, autoRefreshToken: false } },
);

const { data, error } = await supabase.auth.signInWithPassword({ email, password });
if (error) throw error;

const response = await fetch('https://solace-auto-imports.vercel.app/api/admin/dashboard', {
  headers: { Authorization: `Bearer ${data.session.access_token}` },
});
const body = await response.json().catch(() => ({}));
await supabase.auth.signOut();

if (!response.ok || !body.stats) {
  throw new Error(`Backoffice dashboard failed: ${response.status} ${body.error || 'missing stats'}`);
}

console.log(`Backoffice smoke test OK: ${response.status}, ${body.stats.totalVehicles ?? 0} vehicles`);

function loadEnv(path) {
  const values = {};
  if (!existsSync(path)) return values;

  for (const line of readFileSync(path, 'utf8').split(/\r?\n/)) {
    const match = line.match(/^\s*([^=#]+)=(.*)$/);
    if (!match) continue;
    values[match[1].trim()] = clean(match[2]);
  }
  return values;
}

function clean(value) {
  return String(value || '')
    .replace(/^["']+|["']+$/g, '')
    .replace(/\\r\\n|\\n|\\r/gi, '')
    .replace(/\r?\n/g, '')
    .trim();
}

function requireEnv(env, name) {
  const value = clean(env[name] || process.env[name]);
  if (!value) throw new Error(`Missing ${name}`);
  return value;
}
