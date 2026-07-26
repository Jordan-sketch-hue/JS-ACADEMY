import { handleError, requireAdmin, sendJson, serviceClient, vehicleFromRow, vehicleToRow } from '../_supabase.js';

export default async function handler(req, res) {
  try {
    await requireAdmin(req);
    const supabase = serviceClient();

    if (req.method === 'GET') {
      const { data, error } = await supabase
        .from('solace_vehicles')
        .select('*')
        .order('date_added', { ascending: false });
      if (error) throw error;
      return sendJson(res, 200, { cars: (data || []).map(vehicleFromRow) });
    }

    if (req.method === 'POST') {
      const row = vehicleToRow(req.body || {});
      if (!row.id || !row.make || !row.model || !row.year) {
        return sendJson(res, 400, { error: 'Vehicle ID, make, model, and year are required.' });
      }
      const { data, error } = await supabase
        .from('solace_vehicles')
        .insert(row)
        .select('*')
        .single();
      if (error) throw error;
      return sendJson(res, 201, { car: vehicleFromRow(data) });
    }

    if (req.method === 'PUT') {
      const row = vehicleToRow(req.body || {});
      if (!row.id) return sendJson(res, 400, { error: 'Vehicle ID is required.' });
      const { data, error } = await supabase
        .from('solace_vehicles')
        .update(row)
        .eq('id', row.id)
        .select('*')
        .single();
      if (error) throw error;
      return sendJson(res, 200, { car: vehicleFromRow(data) });
    }

    if (req.method === 'DELETE') {
      const id = String(req.query.id || '').trim();
      if (!id) return sendJson(res, 400, { error: 'Vehicle ID is required.' });
      const { error } = await supabase.from('solace_vehicles').delete().eq('id', id);
      if (error) throw error;
      return sendJson(res, 200, { ok: true });
    }

    return sendJson(res, 405, { error: 'Method not allowed.' });
  } catch (error) {
    return handleError(res, error);
  }
}
