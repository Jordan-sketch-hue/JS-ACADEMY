import { sendLeadEmails } from './_email.js';
import { handleError, leadToRow, sendJson, serviceClient } from './_supabase.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return sendJson(res, 405, { error: 'Method not allowed.' });
  }

  try {
    const lead = leadToRow(req.body || {});
    if (!lead.name || !lead.phone || !lead.message) {
      return sendJson(res, 400, { error: 'Name, phone, and message are required.' });
    }

    const { data, error } = await serviceClient()
      .from('solace_leads')
      .insert(lead)
      .select('*')
      .single();

    if (error) throw error;
    sendLeadEmails(data).catch((emailError) => console.error(emailError));
    return sendJson(res, 201, { lead: data });
  } catch (error) {
    return handleError(res, error);
  }
}
