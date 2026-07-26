import { handleError, requireAdmin, sendJson, serviceClient } from '../_supabase.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return sendJson(res, 405, { error: 'Method not allowed.' });
  }

  try {
    await requireAdmin(req);
    const supabase = serviceClient();

    const [vehiclesRes, leadsRes] = await Promise.all([
      supabase.from('solace_vehicles').select('status, featured'),
      supabase.from('solace_leads').select('status, source'),
    ]);

    if (vehiclesRes.error) throw vehiclesRes.error;
    if (leadsRes.error) throw leadsRes.error;

    const vehicles = vehiclesRes.data || [];
    const leads = leadsRes.data || [];

    const stats = {
      totalVehicles: vehicles.length,
      availableVehicles: vehicles.filter((v) => v.status === 'Available').length,
      soldVehicles: vehicles.filter((v) => v.status === 'Sold').length,
      featuredVehicles: vehicles.filter((v) => v.featured).length,
      newInquiries: leads.filter((l) => l.status === 'new').length,
      sourcingRequests: leads.filter((l) => /source/i.test(l.source || '')).length,
      openLeads: leads.filter((l) => l.status !== 'closed').length,
    };

    return sendJson(res, 200, { stats });
  } catch (error) {
    return handleError(res, error);
  }
}
