import { handleError, requireAdmin, sendJson, serviceClient } from '../_supabase.js'

/**
 * Manage Solace back-office users.
 *
 * GET    /api/admin/users           → list profiles (admin only)
 * POST   /api/admin/users           → { email, password, role, displayName }
 * PATCH  /api/admin/users?id=<uuid> → { role?, displayName?, password? }
 * DELETE /api/admin/users?id=<uuid> → remove auth user + cascaded profile
 *
 * Frontend ↔ backend contract:
 *   Response shape:  { user: User } | { users: User[] } | { ok: true }
 *   User shape:      { id, email, role, displayName, createdAt, updatedAt, lastSignInAt? }
 *   Errors:          { error: string }  with appropriate 4xx / 5xx status
 */

const VALID_ROLES = new Set(['admin', 'basic'])

export default async function handler(req, res) {
  try {
    const adminUser = await requireAdmin(req)
    const supabase = serviceClient()

    if (req.method === 'GET') return list(res, supabase)
    if (req.method === 'POST') return create(req, res, supabase)
    if (req.method === 'PATCH') return update(req, res, supabase, adminUser)
    if (req.method === 'DELETE') return remove(req, res, supabase, adminUser)

    res.setHeader('Allow', 'GET, POST, PATCH, DELETE')
    return sendJson(res, 405, { error: 'Method not allowed.' })
  } catch (error) {
    return handleError(res, error)
  }
}

// ───── handlers ─────────────────────────────────────────────────────────────

async function list(res, supabase) {
  const { data: profiles, error } = await supabase
    .from('solace_user_profiles')
    .select('user_id, email, display_name, role, created_at, updated_at')
    .order('created_at', { ascending: false })
  if (error) throw error

  // Fold in last-sign-in metadata from auth.users via admin API (best-effort).
  const enriched = await Promise.all(
    profiles.map(async (p) => {
      const { data } = await supabase.auth.admin.getUserById(p.user_id)
      return profileToDto(p, data?.user)
    }),
  )

  return sendJson(res, 200, { users: enriched })
}

async function create(req, res, supabase) {
  const body = req.body || {}
  const email = cleanEmail(body.email)
  const password = String(body.password ?? '')
  const role = body.role ?? 'basic'
  const displayName = cleanText(body.displayName)

  if (!email) return sendJson(res, 400, { error: 'Email is required.' })
  if (password.length < 8)
    return sendJson(res, 400, { error: 'Password must be at least 8 characters.' })
  if (!VALID_ROLES.has(role)) return sendJson(res, 400, { error: 'Invalid role.' })

  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: displayName ? { full_name: displayName } : undefined,
  })
  if (authError) {
    if (/already.*registered/i.test(authError.message)) {
      return sendJson(res, 409, { error: 'A user with that email already exists.' })
    }
    throw authError
  }

  const { data: profile, error: profileError } = await supabase
    .from('solace_user_profiles')
    .insert({
      user_id: authData.user.id,
      email,
      display_name: displayName,
      role,
    })
    .select('user_id, email, display_name, role, created_at, updated_at')
    .single()

  if (profileError) {
    // Roll back the auth user so we don't leave an orphan account.
    await supabase.auth.admin.deleteUser(authData.user.id).catch(() => {})
    throw profileError
  }

  return sendJson(res, 201, { user: profileToDto(profile, authData.user) })
}

async function update(req, res, supabase, adminUser) {
  const userId = String(req.query?.id || '').trim()
  if (!userId) return sendJson(res, 400, { error: 'User id is required.' })

  const body = req.body || {}
  const patch = {}
  if (body.role !== undefined) {
    if (!VALID_ROLES.has(body.role)) return sendJson(res, 400, { error: 'Invalid role.' })
    if (userId === adminUser.id && body.role !== 'admin') {
      return sendJson(res, 400, { error: 'You cannot demote yourself.' })
    }
    patch.role = body.role
  }
  if (body.displayName !== undefined) patch.display_name = cleanText(body.displayName)

  let profile = null
  if (Object.keys(patch).length) {
    const { data, error } = await supabase
      .from('solace_user_profiles')
      .update(patch)
      .eq('user_id', userId)
      .select('user_id, email, display_name, role, created_at, updated_at')
      .single()
    if (error) throw error
    profile = data
  }

  if (body.password !== undefined) {
    const password = String(body.password)
    if (password.length < 8)
      return sendJson(res, 400, { error: 'Password must be at least 8 characters.' })
    const { error } = await supabase.auth.admin.updateUserById(userId, { password })
    if (error) throw error
  }

  if (!profile) {
    const { data } = await supabase
      .from('solace_user_profiles')
      .select('user_id, email, display_name, role, created_at, updated_at')
      .eq('user_id', userId)
      .single()
    profile = data
  }

  const { data: auth } = await supabase.auth.admin.getUserById(userId)
  return sendJson(res, 200, { user: profileToDto(profile, auth?.user) })
}

async function remove(req, res, supabase, adminUser) {
  const userId = String(req.query?.id || '').trim()
  if (!userId) return sendJson(res, 400, { error: 'User id is required.' })
  if (userId === adminUser.id) {
    return sendJson(res, 400, { error: 'You cannot delete your own account.' })
  }

  // ON DELETE CASCADE on solace_user_profiles drops the profile when the auth user goes.
  const { error } = await supabase.auth.admin.deleteUser(userId)
  if (error) throw error

  return sendJson(res, 200, { ok: true })
}

// ───── helpers ──────────────────────────────────────────────────────────────

function profileToDto(profile, authUser) {
  if (!profile) return null
  return {
    id: profile.user_id,
    email: profile.email,
    displayName: profile.display_name || '',
    role: profile.role,
    createdAt: profile.created_at,
    updatedAt: profile.updated_at,
    lastSignInAt: authUser?.last_sign_in_at || null,
  }
}

function cleanText(value) {
  if (value === null || value === undefined) return null
  const text = String(value).trim()
  return text ? text : null
}

function cleanEmail(value) {
  const text = cleanText(value)
  return text ? text.toLowerCase() : null
}

