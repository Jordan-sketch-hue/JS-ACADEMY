import { getSiteSettings, handleError, requireAdmin, saveSiteSettings, sendJson } from '../_supabase.js';

export default async function handler(req, res) {
  try {
    await requireAdmin(req);

    if (req.method === 'GET') {
      const settings = await getSiteSettings();
      return sendJson(res, 200, { settings });
    }

    if (req.method === 'PUT') {
      const settings = await saveSiteSettings(req.body || {});
      return sendJson(res, 200, { settings });
    }

    return sendJson(res, 405, { error: 'Method not allowed.' });
  } catch (error) {
    return handleError(res, error);
  }
}
