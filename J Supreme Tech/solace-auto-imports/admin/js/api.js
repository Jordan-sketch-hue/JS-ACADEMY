/**
 * Central admin API client — all protected routes use Bearer token.
 * Handles 401/403 redirect to login and user-visible toasts.
 */
import { toast } from './toast.js?v=mqbi8stn';

let supabase = null;
let session = null;
let onSessionLost = () => {};

export function setSessionHandlers(handlers) {
  onSessionLost = handlers.onSessionLost || onSessionLost;
}

export async function initSupabase() {
  const config = await publicFetch('/api/config');
  if (!config.supabaseUrl || !config.supabaseAnonKey) {
    throw new Error('Supabase is not configured for this project.');
  }
  const { createClient } = await import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm');
  supabase = createClient(config.supabaseUrl, config.supabaseAnonKey);
  const { data } = await supabase.auth.getSession();
  session = data.session;
  supabase.auth.onAuthStateChange((_event, newSession) => {
    session = newSession;
  });
  return { supabase, session, adminConfigured: config.adminConfigured };
}

export function getSupabase() {
  return supabase;
}

export function getSession() {
  return session;
}

export function setSession(next) {
  session = next;
}

export async function signIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  session = data.session;
  return session;
}

export async function signOut() {
  await supabase?.auth.signOut();
  session = null;
}

export async function resetPassword(email) {
  const redirectTo = `${window.location.origin}/admin/login`;
  const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });
  if (error) throw error;
}

/** Public GET — no auth header */
export async function publicFetch(url, options = {}) {
  return request(url, { ...options, auth: false });
}

/** Admin API — always sends Authorization Bearer */
export async function adminFetch(url, options = {}) {
  return request(url, { ...options, auth: true });
}

async function request(url, options = {}) {
  const headers = { ...(options.headers || {}) };
  const isJsonBody = options.body && typeof options.body === 'string';
  if (isJsonBody && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

  if (options.auth !== false) {
    if (!session?.access_token) {
      handleAuthFailure('Session expired. Please sign in again.');
      throw new ApiError('Session expired.', 401);
    }
    headers.Authorization = `Bearer ${session.access_token}`;
  }

  let res;
  try {
    res = await fetch(url, { ...options, headers });
  } catch {
    toast('Network error. Check your connection.', 'error');
    throw new ApiError('Network error.', 0);
  }

  const data = await res.json().catch(() => ({}));

  if (res.status === 401 || res.status === 403) {
    handleAuthFailure(data.error || 'Access denied.');
    throw new ApiError(data.error || 'Unauthorized.', res.status);
  }

  if (res.status >= 500) {
    toast(data.error || 'Server error.', 'error');
    throw new ApiError(data.error || 'Server error.', res.status);
  }

  if (!res.ok) {
    const message = data.error || `Request failed (${res.status}).`;
    throw new ApiError(message, res.status);
  }

  return data;
}

function handleAuthFailure(message) {
  toast(message, 'error');
  session = null;
  onSessionLost();
}

export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

// ─── Typed API helpers (match server JSON contract) ───

export const api = {
  config: () => publicFetch('/api/config'),
  dashboard: () => adminFetch('/api/admin/dashboard'),
  me: () => adminFetch('/api/admin/me'),
  users: {
    list: () => adminFetch('/api/admin/users'),
    create: (input) =>
      adminFetch('/api/admin/users', { method: 'POST', body: JSON.stringify(input) }),
    update: (id, patch) =>
      adminFetch(`/api/admin/users?id=${encodeURIComponent(id)}`, {
        method: 'PATCH',
        body: JSON.stringify(patch),
      }),
    remove: (id) =>
      adminFetch(`/api/admin/users?id=${encodeURIComponent(id)}`, { method: 'DELETE' }),
  },
  vehicles: {
    list: () => adminFetch('/api/admin/vehicles'),
    create: (car) => adminFetch('/api/admin/vehicles', { method: 'POST', body: JSON.stringify(car) }),
    update: (car) => adminFetch('/api/admin/vehicles', { method: 'PUT', body: JSON.stringify(car) }),
    remove: (id) => adminFetch(`/api/admin/vehicles?id=${encodeURIComponent(id)}`, { method: 'DELETE' }),
  },
  leads: {
    list: () => adminFetch('/api/admin/leads'),
    update: (payload) => adminFetch('/api/admin/leads', { method: 'PUT', body: JSON.stringify(payload) }),
  },
  settings: {
    get: () => adminFetch('/api/admin/settings'),
    save: (settings) => adminFetch('/api/admin/settings', { method: 'PUT', body: JSON.stringify(settings) }),
  },
  /**
   * Upload a media file (image or video).
   *
   * Strategy:
   *   1. Try direct-to-Supabase from the authed browser (no Vercel body cap,
   *      so big videos work). Returns instantly on success.
   *   2. If the browser blocks the request (ad-blocker, Brave shields,
   *      corporate network, etc.) the SDK throws a "Failed to fetch" error.
   *      Fall back to the server-side /api/admin/upload route — that hits
   *      a Vercel function on our own domain, which adblockers don't touch.
   *      Body is capped at ~4.5 MB so the fallback works for normal photos
   *      but not full-size videos (uncommon on locked-down networks anyway).
   */
  upload: async (file) => {
    const contentType = file.type || 'application/octet-stream';
    const mediaType = contentType.startsWith('video/') ? 'video' : 'image';

    // ── Path 1: direct-to-Supabase ─────────────────────────────────────
    if (supabase && session?.access_token) {
      const ext = (file.name.split('.').pop() || 'bin').toLowerCase().replace(/[^a-z0-9]+/g, '');
      const safeBase = file.name.replace(/\.[^.]+$/, '').replace(/[^\w.-]+/g, '-').slice(0, 60);
      const path = `${Date.now()}-${safeBase || 'media'}.${ext}`;

      try {
        const { error } = await supabase.storage
          .from('vehicle-images')
          .upload(path, file, { contentType, upsert: false, cacheControl: '31536000' });
        if (!error) {
          const { data: pub } = supabase.storage.from('vehicle-images').getPublicUrl(path);
          return { url: pub.publicUrl, path, contentType, mediaType, via: 'direct' };
        }
        // Supabase SDK error — fall through to server fallback only if it
        // looks like a network/CDN block, not a real validation rejection.
        const msg = (error.message || '').toLowerCase();
        const networkLike = /fetch|network|failed|timeout|blocked/i.test(msg);
        if (!networkLike) {
          throw new ApiError(error.message || 'Upload failed.', Number(error.statusCode) || 500);
        }
      } catch (err) {
        // TypeError "Failed to fetch" lands here.
        if (err instanceof ApiError) throw err;
        // else fall through to server fallback
      }
    }

    // ── Path 2: server-side fallback for blocked browsers ──────────────
    if (file.size > 4 * 1024 * 1024) {
      throw new ApiError(
        'Direct upload was blocked (ad-blocker or network filter) and the file is too large for the fallback. ' +
        'Disable shields / ad-blockers for solaceautoimportsltd.com, or pick a smaller photo.',
        413,
      );
    }
    const base64 = await fileToBase64(file);
    const result = await adminFetch('/api/admin/upload', {
      method: 'POST',
      body: JSON.stringify({ filename: file.name, contentType, data: base64 }),
    });
    return { url: result.url, path: result.path, contentType, mediaType, via: 'fallback' };
  },
};

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, (char) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;',
  }[char]));
}

export function formatStatus(status) {
  return String(status || '').replace(/_/g, ' ');
}

export function statusBadgeClass(status) {
  const key = String(status || '').toLowerCase().replace(/\s+/g, '_');
  return `badge badge-${key}`;
}
