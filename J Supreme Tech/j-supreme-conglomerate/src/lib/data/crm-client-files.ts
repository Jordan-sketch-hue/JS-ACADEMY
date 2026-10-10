import { randomUUID } from "crypto";
import type { SupabaseClient } from "@supabase/supabase-js";
import { getServiceSupabase } from "@/lib/supabase/admin";
import {
  CLIENT_FILE_BUCKET,
  CLIENT_FILE_MAX_BYTES,
  coerceClientMime,
  isAllowedClientFileMime,
  sanitizeClientOriginalFilename,
  sanitizeClientStorageStem,
} from "@/lib/crm/client-file-rules";

export type ClientFileUploadResult =
  | { ok: true; file: ListedClientFile }
  | { ok: false; error: string };

export type ListedClientFile = {
  id: string;
  filename: string;
  mimeType: string;
  byteSize: number;
  createdAt: string;
  /** Short-lived HTTPS URL (authenticated API only issues this response). */
  downloadUrl: string;
};

async function fetchOwnedClientRow(
  sb: SupabaseClient,
  ownerClerkId: string,
  clientId: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const { data, error } = await sb
    .from("clients")
    .select("id")
    .eq("id", clientId)
    .eq("owner_clerk_id", ownerClerkId)
    .maybeSingle();
  if (error) return { ok: false, error: error.message };
  if (!data?.id) return { ok: false, error: "Client not found." };
  return { ok: true };
}

function buildStoragePath(
  ownerClerkId: string,
  clientId: string,
  stem: string,
  ext: string,
): string {
  const safeOwner = ownerClerkId.replace(/[/\\]+/g, "_").slice(0, 120);
  const safeClient = clientId.replace(/[^a-f0-9-]/gi, "").slice(0, 40);
  const suffix = ext ? `.${ext.replace(/[^a-z0-9.]/gi, "").slice(0, 8)}` : "";
  return `${safeOwner}/${safeClient}/${randomUUID()}_${stem}${suffix}`;
}

function extFromFilename(name: string): string {
  const base = name.replace(/^.*[/\\]/, "");
  const dot = base.lastIndexOf(".");
  if (dot < 0 || dot === base.length - 1) return "";
  return base.slice(dot + 1).toLowerCase().replace(/[^a-z0-9]/g, "");
}

async function attachSignedUrls(
  sb: SupabaseClient,
  rows: Array<{
    id: string;
    filename: string;
    mime_type: string;
    byte_size: number;
    storage_path: string;
    created_at: string;
  }>,
): Promise<ListedClientFile[]> {
  const out: ListedClientFile[] = [];
  for (const row of rows) {
    const { data, error } = await sb.storage
      .from(CLIENT_FILE_BUCKET)
      .createSignedUrl(row.storage_path, 3600);
    if (error || !data?.signedUrl) continue;
    out.push({
      id: row.id,
      filename: row.filename,
      mimeType: row.mime_type,
      byteSize: row.byte_size,
      createdAt: row.created_at,
      downloadUrl: data.signedUrl,
    });
  }
  return out;
}

export async function listClientUploadsForOwner(
  ownerClerkId: string,
  clientId: string,
): Promise<{ ok: true; files: ListedClientFile[] } | { ok: false; error: string }> {
  const sb = getServiceSupabase();
  if (!sb) return { ok: false, error: "Supabase is not configured." };
  const owns = await fetchOwnedClientRow(sb, ownerClerkId, clientId);
  if (!owns.ok) return owns;

  const { data, error } = await sb
    .from("client_files")
    .select("id, filename, mime_type, byte_size, storage_path, created_at")
    .eq("owner_clerk_id", ownerClerkId)
    .eq("client_id", clientId)
    .order("created_at", { ascending: false });
  if (error) return { ok: false, error: error.message };

  const files = await attachSignedUrls(sb, data ?? []);
  return { ok: true, files };
}

export async function uploadClientFileForOwner(params: {
  ownerClerkId: string;
  clientId: string;
  declaredMime: string | null | undefined;
  originalFilename: string;
  buffer: Uint8Array;
}): Promise<ClientFileUploadResult> {
  const sb = getServiceSupabase();
  if (!sb) return { ok: false, error: "Supabase is not configured." };

  const owns = await fetchOwnedClientRow(sb, params.ownerClerkId, params.clientId);
  if (!owns.ok) return owns;

  const filename = sanitizeClientOriginalFilename(params.originalFilename || "upload");
  const mime =
    coerceClientMime(params.declaredMime, filename) ??
    coerceClientMime(null, filename);
  if (!mime || !isAllowedClientFileMime(mime)) {
    return {
      ok: false,
      error:
        "This file type is not accepted. Allowed: PDF, Word (.doc/.docx), and common images (JPEG, PNG, GIF, WebP, SVG).",
    };
  }
  if (params.buffer.byteLength <= 0) {
    return { ok: false, error: "Empty file." };
  }
  if (params.buffer.byteLength > CLIENT_FILE_MAX_BYTES) {
    return { ok: false, error: "File exceeds 15 MB limit." };
  }

  const ext = extFromFilename(filename);
  const stem = sanitizeClientStorageStem(filename);
  const storagePath = buildStoragePath(
    params.ownerClerkId,
    params.clientId,
    stem,
    ext,
  );

  const up = await sb.storage
    .from(CLIENT_FILE_BUCKET)
    .upload(storagePath, params.buffer, { contentType: mime, upsert: false });

  if (up.error) {
    return { ok: false, error: up.error.message || "Could not upload file." };
  }

  const insertRow = {
    client_id: params.clientId,
    owner_clerk_id: params.ownerClerkId,
    storage_path: storagePath,
    filename,
    mime_type: mime,
    byte_size: params.buffer.byteLength,
  };

  const { data: row, error: insErr } = await sb
    .from("client_files")
    .insert(insertRow)
    .select("id, filename, mime_type, byte_size, storage_path, created_at")
    .single();

  if (insErr || !row) {
    await sb.storage.from(CLIENT_FILE_BUCKET).remove([storagePath]).catch(() => {});
    return { ok: false, error: insErr?.message ?? "Could not save file metadata." };
  }

  const { data: sign, error: signErr } = await sb.storage
    .from(CLIENT_FILE_BUCKET)
    .createSignedUrl(row.storage_path as string, 3600);

  if (signErr || !sign?.signedUrl) {
    return {
      ok: false,
      error:
        signErr?.message ??
        "Uploaded but could not issue a download link — check Storage bucket configuration.",
    };
  }

  return {
    ok: true,
    file: {
      id: row.id as string,
      filename: row.filename as string,
      mimeType: row.mime_type as string,
      byteSize: Number(row.byte_size),
      createdAt: row.created_at as string,
      downloadUrl: sign.signedUrl,
    },
  };
}

export async function deleteClientFileForOwner(
  ownerClerkId: string,
  clientId: string,
  fileId: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const sb = getServiceSupabase();
  if (!sb) return { ok: false, error: "Supabase is not configured." };

  const owns = await fetchOwnedClientRow(sb, ownerClerkId, clientId);
  if (!owns.ok) return owns;

  const { data: row, error: qErr } = await sb
    .from("client_files")
    .select("storage_path")
    .eq("id", fileId)
    .eq("owner_clerk_id", ownerClerkId)
    .eq("client_id", clientId)
    .maybeSingle();

  if (qErr) return { ok: false, error: qErr.message };
  if (!row?.storage_path) return { ok: false, error: "File not found." };

  const path = row.storage_path as string;

  const { error: dErr } = await sb
    .from("client_files")
    .delete()
    .eq("id", fileId)
    .eq("owner_clerk_id", ownerClerkId)
    .eq("client_id", clientId);
  if (dErr) return { ok: false, error: dErr.message };

  await sb.storage.from(CLIENT_FILE_BUCKET).remove([path]).catch(() => {});

  return { ok: true };
}
