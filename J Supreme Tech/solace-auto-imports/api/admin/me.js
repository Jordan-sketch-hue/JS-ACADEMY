import { handleError, requireBackofficeUser, sendJson } from '../_supabase.js'

/**
 * Returns the current operator's profile so the SPA can show/hide admin-only UI.
 *
 * Response: { user: { id, email, role, displayName } }
 *   role is 'admin' | 'basic'.
 *
 * Any authenticated back-office user (admin or basic) can call this.
 */
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET')
    return sendJson(res, 405, { error: 'Method not allowed.' })
  }

  try {
    const { user, role, profile } = await requireBackofficeUser(req)
    return sendJson(res, 200, {
      user: {
        id: user.id,
        email: user.email,
        role,
        displayName: profile?.display_name || '',
      },
    })
  } catch (error) {
    return handleError(res, error)
  }
}
