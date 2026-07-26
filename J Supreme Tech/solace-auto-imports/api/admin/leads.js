import {
  handleError,
  leadFromRow,
  LEAD_STATUSES,
  normalizeLeadStatus,
  requireAdmin,
  sendJson,
  serviceClient,
} from '../_supabase.js';

export default async function handler(req, res) {
  try {
    await requireAdmin(req);
    const supabase = serviceClient();

    if (req.method === 'GET') {
      const { data, error } = await supabase
        .from('solace_leads')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return sendJson(res, 200, { leads: (data || []).map(leadFromRow) });
    }

    if (req.method === 'PUT') {
      const id = String(req.body?.id || '').trim();
      if (!id) return sendJson(res, 400, { error: 'Lead ID is required.' });

      const updates = {};
      if (req.body?.status !== undefined) {
        const status = normalizeLeadStatus(req.body.status);
        if (!status) {
          return sendJson(res, 400, {
            error: `Status must be one of: ${LEAD_STATUSES.join(', ')}.`,
          });
        }
        updates.status = status;
      }
      if (req.body?.adminNotes !== undefined) {
        updates.admin_notes = String(req.body.adminNotes || '').trim();
      }
      if (!Object.keys(updates).length) {
        return sendJson(res, 400, { error: 'Nothing to update.' });
      }

      const { data, error } = await supabase
        .from('solace_leads')
        .update(updates)
        .eq('id', id)
        .select('*')
        .single();
      if (error) throw error;
      return sendJson(res, 200, { lead: leadFromRow(data) });
    }

    return sendJson(res, 405, { error: 'Method not allowed.' });
  } catch (error) {
    return handleError(res, error);
  }
}
