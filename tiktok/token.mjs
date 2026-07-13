/**
 * Token manager — auto-refreshes access token when expired.
 * Import getAccessToken() wherever you need a valid token.
 */

import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dir = dirname(fileURLToPath(import.meta.url));
const ENV_PATH = join(__dir, '.env');

export function loadEnv() {
  try {
    const raw = readFileSync(ENV_PATH, 'utf-8');
    for (const line of raw.split('\n')) {
      const [key, ...rest] = line.split('=');
      if (key && !key.startsWith('#') && rest.length) {
        process.env[key.trim()] = rest.join('=').trim();
      }
    }
  } catch {
    console.error('.env not found. Run auth.mjs first.');
    process.exit(1);
  }
}

export function updateEnv(updates) {
  let raw = '';
  try { raw = readFileSync(ENV_PATH, 'utf-8'); } catch { raw = ''; }
  for (const [key, value] of Object.entries(updates)) {
    const regex = new RegExp(`^${key}=.*$`, 'm');
    const line = `${key}=${value}`;
    if (regex.test(raw)) {
      raw = raw.replace(regex, line);
    } else {
      raw += `\n${line}`;
    }
  }
  writeFileSync(ENV_PATH, raw);
}

export async function getAccessToken() {
  loadEnv();

  const {
    TIKTOK_ACCESS_TOKEN:  accessToken,
    TIKTOK_REFRESH_TOKEN: refreshToken,
    TIKTOK_TOKEN_EXPIRY:  expiryStr,
    TIKTOK_CLIENT_KEY:    clientKey,
    TIKTOK_CLIENT_SECRET: clientSecret,
  } = process.env;

  if (!accessToken || !refreshToken) {
    throw new Error('No tokens found. Run: node tiktok/auth.mjs');
  }

  const expiry = Number(expiryStr) || 0;
  const isExpired = Date.now() >= expiry - 60_000; // refresh 1 min early

  if (!isExpired) return accessToken;

  console.log('Access token expired — refreshing...');

  const res = await fetch('https://open.tiktokapis.com/v2/oauth/token/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_key:    clientKey,
      client_secret: clientSecret,
      grant_type:    'refresh_token',
      refresh_token: refreshToken,
    }),
  });

  const data = await res.json();
  if (data.error) throw new Error(`Token refresh failed: ${data.error_description}`);

  const newExpiry = Date.now() + (data.expires_in * 1000);
  updateEnv({
    TIKTOK_ACCESS_TOKEN:  data.access_token,
    TIKTOK_REFRESH_TOKEN: data.refresh_token || refreshToken,
    TIKTOK_TOKEN_EXPIRY:  String(newExpiry),
  });

  console.log('Token refreshed.');
  return data.access_token;
}
