import { getSiteSettings, handleError, sendJson, serviceClient, vehicleFromRow } from './_supabase.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return sendJson(res, 405, { error: 'Method not allowed.' });
  }

  try {
    const supabase = serviceClient();
    const settings = await getSiteSettings();
    const id = typeof req.query?.id === 'string' ? req.query.id.trim() : '';

    let query = supabase
      .from('solace_vehicles')
      .select('*')
      .neq('status', 'Hidden')
      .order('featured', { ascending: false })
      .order('date_added', { ascending: false });

    if (settings.hideSoldOnPublic) {
      query = query.neq('status', 'Sold');
    }
    if (id) {
      // Single-vehicle lookup powers /vehicle.html?id=…
      query = query.eq('id', id).limit(1);
    }

    const { data, error } = await query;
    if (error) throw error;
    return sendJson(res, 200, { cars: (data || []).map(vehicleFromRow) });
  } catch (error) {
    return handleError(res, error);
  }
}
