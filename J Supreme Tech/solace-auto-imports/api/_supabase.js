import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = env('NEXT_PUBLIC_SUPABASE_URL');
const SUPABASE_ANON_KEY = env('NEXT_PUBLIC_SUPABASE_ANON_KEY');
const SUPABASE_SERVICE_ROLE_KEY = env('SUPABASE_SERVICE_ROLE_KEY');

export function publicConfig() {
  return {
    supabaseUrl: SUPABASE_URL || '',
    supabaseAnonKey: SUPABASE_ANON_KEY || '',
    adminConfigured: Boolean(SUPABASE_URL && SUPABASE_ANON_KEY && SUPABASE_SERVICE_ROLE_KEY),
  };
}

export function serviceClient() {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('Supabase service connection is not configured.');
  }
  return createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false },
  });
}

function authClient() {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    throw new Error('Supabase auth connection is not configured.');
  }
  return createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: { persistSession: false },
  });
}

function parseEmailList(...names) {
  const emails = new Set();
  for (const name of names) {
    for (const part of env(name).split(/[,;\s]+/)) {
      const email = part.trim().toLowerCase();
      if (email) emails.add(email);
    }
  }
  return [...emails];
}

/** Client/business operators (Solace inbox). */
export function adminEmails() {
  return parseEmailList('SOLACE_ADMIN_EMAILS');
}

/** Site architect / agency access — separate login from the Solace business admin. */
export function architectEmails() {
  return parseEmailList('SOLACE_ARCHITECT_EMAILS');
}

export function backofficeEmails() {
  return [...new Set([...adminEmails(), ...architectEmails()])];
}

function env(name) {
  return String(process.env[name] || '')
    .replace(/^["']+|["']+$/g, '')
    .replace(/\\r\\n|\\n|\\r/gi, '')
    .replace(/\r?\n/g, '')
    .trim();
}

/**
 * Authenticate the incoming Bearer token and resolve the caller's backoffice role.
 *
 * Authorisation order:
 *  1. Token must be valid (Supabase Auth).
 *  2. If a profile row exists in solace_user_profiles → its `role` wins.
 *  3. Else if the email is in SOLACE_ADMIN_EMAILS / SOLACE_ARCHITECT_EMAILS env allow-list
 *     → auto-provision an `admin` profile row (bootstrap path so the very first sign-in
 *     can manage users without manual SQL).
 *  4. Else → 403.
 *
 * Returns: { user, role, profile } where role is 'admin' | 'basic'.
 */
export async function requireBackofficeUser(req) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : '';
  if (!token) {
    const error = new Error('Missing admin token.');
    error.statusCode = 401;
    throw error;
  }

  const { data, error } = await authClient().auth.getUser(token);
  if (error || !data?.user?.email) {
    const authError = new Error('Invalid admin session.');
    authError.statusCode = 401;
    throw authError;
  }
  const user = data.user;
  const email = user.email.toLowerCase();

  const supabase = serviceClient();

  // Look up role from profiles table.
  const { data: existing, error: lookupError } = await supabase
    .from('solace_user_profiles')
    .select('user_id, email, display_name, role, created_at, updated_at')
    .eq('user_id', user.id)
    .maybeSingle();
  if (lookupError) throw lookupError;

  if (existing) {
    return { user, role: existing.role, profile: existing };
  }

  // Bootstrap path — env allow-list grants admin and auto-creates the profile.
  const envAllowed = backofficeEmails();
  if (envAllowed.includes(email)) {
    const { data: created, error: insertError } = await supabase
      .from('solace_user_profiles')
      .insert({
        user_id: user.id,
        email: user.email,
        display_name: user.user_metadata?.full_name || null,
        role: 'admin',
      })
      .select('user_id, email, display_name, role, created_at, updated_at')
      .single();
    if (insertError) throw insertError;
    return { user, role: 'admin', profile: created };
  }

  const accessError = new Error('This user is not allowed to manage Solace Auto Imports.');
  accessError.statusCode = 403;
  throw accessError;
}

/** Admin-only routes. Throws 403 if the role is not `admin`. */
export async function requireAdmin(req) {
  const ctx = await requireBackofficeUser(req);
  if (ctx.role !== 'admin') {
    const error = new Error('Admin role required.');
    error.statusCode = 403;
    throw error;
  }
  return ctx.user;
}

export function sendJson(res, status, body) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(body));
}

export function handleError(res, error) {
  const status = error.statusCode || 500;
  sendJson(res, status, {
    error: status === 500 ? 'Server error.' : error.message,
  });
}

export function vehicleFromRow(row) {
  return {
    id: row.id,
    make: row.make,
    model: row.model,
    year: row.year,
    type: row.type,
    transmission: row.transmission,
    fuel: row.fuel,
    color: row.color,
    mileageKm: row.mileage_km,
    priceDisplay: row.price_display,
    priceJMD: row.price_jmd,
    status: row.status,
    featured: row.featured,
    dateAdded: row.date_added,
    images: row.images || [],
    condition: row.condition,
    location: row.location,
    description: row.description,
  };
}

export function vehicleToRow(input) {
  return {
    id: cleanText(input.id),
    make: cleanText(input.make),
    model: cleanText(input.model),
    year: numberOrNull(input.year),
    type: cleanText(input.type),
    transmission: cleanText(input.transmission),
    fuel: cleanText(input.fuel),
    color: cleanText(input.color),
    mileage_km: numberOrNull(input.mileageKm),
    price_display: cleanText(input.priceDisplay),
    price_jmd: numberOrNull(input.priceJMD),
    status: cleanText(input.status) || 'Available',
    featured: Boolean(input.featured),
    date_added: cleanText(input.dateAdded) || new Date().toISOString().slice(0, 10),
    images: Array.isArray(input.images) ? input.images.map(cleanText).filter(Boolean) : [],
    condition: cleanText(input.condition),
    location: cleanText(input.location),
    description: cleanText(input.description),
  };
}

export const VEHICLE_IMAGES_BUCKET = 'vehicle-images';

export const LEAD_STATUSES = ['new', 'contacted', 'in_progress', 'closed'];

export function leadFromRow(row) {
  return {
    id: row.id,
    name: row.name,
    phone: row.phone,
    email: row.email,
    interest: row.interest,
    vehicleId: row.vehicle_id,
    message: row.message,
    source: row.source,
    status: row.status,
    adminNotes: row.admin_notes || '',
    payload: row.payload || {},
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function leadToRow(input) {
  const row = {
    name: cleanText(input.name),
    phone: cleanText(input.phone),
    email: cleanText(input.email),
    interest: cleanText(input.interest),
    vehicle_id: cleanText(input.vehicleId),
    message: cleanText(input.message),
    source: cleanText(input.source) || 'website',
    status: normalizeLeadStatus(input.status) || 'new',
    payload: input.payload && typeof input.payload === 'object' ? input.payload : {},
  };
  if (input.adminNotes !== undefined) {
    row.admin_notes = cleanText(input.adminNotes);
  }
  return row;
}

export function normalizeLeadStatus(status) {
  const value = String(status || '').trim().toLowerCase().replace(/\s+/g, '_');
  if (value === 'in progress') return 'in_progress';
  return LEAD_STATUSES.includes(value) ? value : null;
}

const DEFAULT_SITE_SETTINGS = {
  phone: '(876) 456-6976',
  whatsapp: '18764566976',
  email: 'solaceimports@gmail.com',
  instagram: 'https://www.instagram.com/solaceautoimports',
  address: 'Westmoreland, Jamaica',
  heroTitle: 'We Import | We Sell | We Source',
  heroSubtitle: 'Certified Used Car Dealer',
  heroTagline: 'Quality vehicles imported and sourced for Jamaica. Browse our latest arrivals or tell us exactly what you\'re looking for.',
  ctaPrimary: 'View Inventory',
  ctaSecondary: 'Call Us',
  hideSoldOnPublic: false,
};

export async function getSiteSettings() {
  const supabase = serviceClient();
  const { data, error } = await supabase
    .from('solace_settings')
    .select('value')
    .eq('key', 'site')
    .maybeSingle();
  if (error) throw error;
  return { ...DEFAULT_SITE_SETTINGS, ...(data?.value || {}) };
}

export async function saveSiteSettings(input) {
  const supabase = serviceClient();
  const current = await getSiteSettings();
  const value = {
    ...current,
    phone: cleanText(input.phone) ?? current.phone,
    whatsapp: cleanText(input.whatsapp) ?? current.whatsapp,
    email: cleanText(input.email) ?? current.email,
    instagram: cleanText(input.instagram) ?? current.instagram,
    address: cleanText(input.address) ?? current.address,
    heroTitle: cleanText(input.heroTitle) ?? current.heroTitle,
    heroSubtitle: cleanText(input.heroSubtitle) ?? current.heroSubtitle,
    heroTagline: cleanText(input.heroTagline) ?? current.heroTagline,
    ctaPrimary: cleanText(input.ctaPrimary) ?? current.ctaPrimary,
    ctaSecondary: cleanText(input.ctaSecondary) ?? current.ctaSecondary,
    hideSoldOnPublic: input.hideSoldOnPublic !== undefined ? Boolean(input.hideSoldOnPublic) : current.hideSoldOnPublic,
  };
  const { data, error } = await supabase
    .from('solace_settings')
    .upsert({ key: 'site', value, updated_at: new Date().toISOString() })
    .select('value')
    .single();
  if (error) throw error;
  return { ...DEFAULT_SITE_SETTINGS, ...(data?.value || {}) };
}

function cleanText(value) {
  return typeof value === 'string' ? value.trim() : value ?? null;
}

function numberOrNull(value) {
  if (value === '' || value === null || value === undefined) return null;
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}
