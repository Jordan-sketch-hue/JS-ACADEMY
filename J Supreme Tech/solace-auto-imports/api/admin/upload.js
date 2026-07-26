import {
  handleError,
  requireAdmin,
  sendJson,
  serviceClient,
  VEHICLE_IMAGES_BUCKET,
} from '../_supabase.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return sendJson(res, 405, { error: 'Method not allowed.' });
  }

  try {
    await requireAdmin(req);
    const body = req.body || {};
    const filename = String(body.filename || 'vehicle.jpg').replace(/[^\w.-]+/g, '-');
    const contentType = String(body.contentType || 'image/jpeg');
    const data = String(body.data || '');

    if (!data) {
      return sendJson(res, 400, { error: 'Image data is required (base64).' });
    }

    const buffer = Buffer.from(data.replace(/^data:[^;]+;base64,/, ''), 'base64');
    if (buffer.length > 8 * 1024 * 1024) {
      return sendJson(res, 400, { error: 'Image must be under 8 MB.' });
    }

    const path = `${Date.now()}-${filename}`;
    const supabase = serviceClient();
    const { error: uploadError } = await supabase.storage
      .from(VEHICLE_IMAGES_BUCKET)
      .upload(path, buffer, { contentType, upsert: false });

    if (uploadError) {
      const hint =
        uploadError.message?.includes('Bucket not found')
          ? ' Create the vehicle-images bucket in Supabase Storage (public read).'
          : '';
      return sendJson(res, 500, { error: uploadError.message + hint });
    }

    const { data: publicData } = supabase.storage.from(VEHICLE_IMAGES_BUCKET).getPublicUrl(path);
    return sendJson(res, 201, { url: publicData.publicUrl, path });
  } catch (error) {
    return handleError(res, error);
  }
}
