import { getSiteSettings, handleError, sendJson } from './_supabase.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return sendJson(res, 405, { error: 'Method not allowed.' });
  }

  try {
    const settings = await getSiteSettings();
    return sendJson(res, 200, { settings });
  } catch (error) {
    return handleError(res, error);
  }
}
