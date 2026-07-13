/**
 * TikTok OAuth 2.0 — Authorization Code Flow
 * Scopes required: video.upload, video.publish, user.info.basic
 *
 * Run once to get your tokens:
 *   node tiktok/auth.mjs
 *
 * Opens the TikTok authorization URL in your terminal.
 * Paste the redirect URL after you approve — tokens are saved to .env
 */

import { createServer } from 'http';
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dir = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dir, '..');
const ENV_PATH = join(__dir, '.env');

// Load .env manually (no dotenv dependency needed)
function loadEnv() {
  try {
    const raw = readFileSync(ENV_PATH, 'utf-8');
    for (const line of raw.split('\n')) {
      const [key, ...rest] = line.split('=');
      if (key && !key.startsWith('#') && rest.length) {
        process.env[key.trim()] = rest.join('=').trim();
      }
    }
  } catch {
    console.error('No .env found — copy .env.example to .env and fill in your keys.');
    process.exit(1);
  }
}

function updateEnv(updates) {
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

loadEnv();

const CLIENT_KEY    = process.env.TIKTOK_CLIENT_KEY;
const CLIENT_SECRET = process.env.TIKTOK_CLIENT_SECRET;
const REDIRECT_URI  = process.env.TIKTOK_REDIRECT_URI || 'http://localhost:3000/callback';

if (!CLIENT_KEY || !CLIENT_SECRET) {
  console.error('TIKTOK_CLIENT_KEY and TIKTOK_CLIENT_SECRET must be set in .env');
  process.exit(1);
}

const SCOPES = ['video.upload', 'video.publish', 'user.info.basic'].join(',');

// State for CSRF protection
const state = Math.random().toString(36).slice(2);

const authUrl = new URL('https://www.tiktok.com/v2/auth/authorize/');
authUrl.searchParams.set('client_key', CLIENT_KEY);
authUrl.searchParams.set('scope', SCOPES);
authUrl.searchParams.set('response_type', 'code');
authUrl.searchParams.set('redirect_uri', REDIRECT_URI);
authUrl.searchParams.set('state', state);

console.log('\n──────────────────────────────────────────');
console.log('J Supreme · TikTok OAuth Setup');
console.log('──────────────────────────────────────────');
console.log('\nOpen this URL in your browser:\n');
console.log(authUrl.toString());
console.log('\nAfter approving, you\'ll be redirected to localhost:3000.');
console.log('Waiting for callback...\n');

// Start local callback server
const server = createServer(async (req, res) => {
  const url = new URL(req.url, 'http://localhost:3000');
  const code       = url.searchParams.get('code');
  const returnedState = url.searchParams.get('state');
  const error      = url.searchParams.get('error');

  if (error) {
    res.end(`Authorization failed: ${error}`);
    console.error(`\nAuthorization failed: ${error}`);
    server.close();
    process.exit(1);
  }

  if (returnedState !== state) {
    res.end('State mismatch — possible CSRF. Try again.');
    server.close();
    process.exit(1);
  }

  if (!code) {
    res.end('No code received.');
    return;
  }

  console.log('Authorization code received. Exchanging for tokens...');

  try {
    const tokenRes = await fetch('https://open.tiktokapis.com/v2/oauth/token/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_key:    CLIENT_KEY,
        client_secret: CLIENT_SECRET,
        code,
        grant_type:    'authorization_code',
        redirect_uri:  REDIRECT_URI,
      }),
    });

    const data = await tokenRes.json();

    if (data.error) {
      throw new Error(`${data.error}: ${data.error_description}`);
    }

    const expiry = Date.now() + (data.expires_in * 1000);

    updateEnv({
      TIKTOK_ACCESS_TOKEN:  data.access_token,
      TIKTOK_REFRESH_TOKEN: data.refresh_token,
      TIKTOK_TOKEN_EXPIRY:  String(expiry),
    });

    console.log('\n✓ Tokens saved to .env');
    console.log(`  Access token expires: ${new Date(expiry).toLocaleString()}`);
    console.log(`  Refresh token valid for 365 days\n`);

    res.end('All done! Tokens saved. You can close this window and return to your terminal.');
  } catch (err) {
    res.end(`Token exchange failed: ${err.message}`);
    console.error('\nToken exchange failed:', err.message);
  }

  server.close();
});

const port = new URL(REDIRECT_URI).port || 3000;
server.listen(Number(port), () => {
  console.log(`Callback server listening on port ${port}`);
});
