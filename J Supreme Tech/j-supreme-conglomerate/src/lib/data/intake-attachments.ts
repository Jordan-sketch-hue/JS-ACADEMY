import { randomUUID } from "crypto";
import type { SupabaseClient } from "@supabase/supabase-js";
import {
  CLIENT_FILE_MAX_BYTES,
  coerceClientMime,
  isAllowedClientFileMime,
  sanitizeClientOriginalFilename,
  sanitizeClientStorageStem,
} from "@/lib/crm/client-file-rules";

export const INTAKE_FILE_BUCKET = "intake-form-files";

/** Keep uploads bounded for anonymous intake (same size cap as CRM files). */
export const INTAKE_MAX_FILES_PER_SUBMISSION = 5;

export type IntakeAttachmentMeta = {
  storage_path: string;
  filename: string;
  mime_type: string;
  byte_size: number;
};

function extFromFilename(name: string): string {
  const base = name.replace(/^.*[/\\]/, "");
  const dot = base.lastIndexOf(".");
  if (dot < 0 || dot === base.length - 1) return "";
  return base.slice(dot + 1).toLowerCase().replace(/[^a-z0-9]/g, "");
}

function buildIntakeStoragePath(
  ownerClerkId: string,
  formId: string,
  submissionId: string,
  originalFilename: string,
  mime: string,
): string {
  const safeOwner = ownerClerkId.replace(/[/\\]+/g, "_").slice(0, 120);
  const safeForm = formId.replace(/[^a-f0-9-]/gi, "").slice(0, 40);
  const safeSub = submissionId.replace(/[^a-f0-9-]/gi, "").slice(0, 40);
  const stem = sanitizeClientStorageStem(originalFilename);
  let ext = extFromFilename(originalFilename);
  if (!ext && mime.includes("pdf")) ext = "pdf";
  if (!ext && mime.includes("word")) ext = "docx";
  if (!ext && mime.includes("jpeg")) ext = "jpg";
  if (!ext && mime.includes("png")) ext = "png";
  const suffix = ext ? `.${ext.replace(/[^a-z0-9.]/gi, "").slice(0, 8)}` : "";
  return `${safeOwner}/${safeForm}/${safeSub}/${randomUUID()}_${stem}${suffix}`;
}

export async function uploadIntakeSubmissionFiles(
  sb: SupabaseClient,
  params: {
    ownerClerkId: string;
    formId: string;
    submissionId: string;
    parts: Array<{ filename: string; declaredMime: string | null | undefined; buffer: Buffer }>;
  },
): Promise<
  { ok: true; attachments: IntakeAttachmentMeta[] } | { ok: false; error: string }
> {
  if (params.parts.length > INTAKE_MAX_FILES_PER_SUBMISSION) {
    return {
      ok: false,
      error: `You can attach at most ${INTAKE_MAX_FILES_PER_SUBMISSION} files.`,
    };
  }

  const attachments: IntakeAttachmentMeta[] = [];

  for (const part of params.parts) {
    if (part.buffer.length === 0) continue;
    if (part.buffer.length > CLIENT_FILE_MAX_BYTES) {
      return {
        ok: false,
        error: `“${sanitizeClientOriginalFilename(part.filename)}” exceeds the ${Math.floor(CLIENT_FILE_MAX_BYTES / (1024 * 1024))} MB limit.`,
      };
    }
    const mime = coerceClientMime(part.declaredMime ?? null, part.filename);
    if (!mime || !isAllowedClientFileMime(mime)) {
      return {
        ok: false,
        error: `File type not allowed: ${sanitizeClientOriginalFilename(part.filename)}. Use PDF, Word, or common images.`,
      };
    }

    const storagePath = buildIntakeStoragePath(
      params.ownerClerkId,
      params.formId,
      params.submissionId,
      part.filename,
      mime,
    );

    const { error: upErr } = await sb.storage
      .from(INTAKE_FILE_BUCKET)
      .upload(storagePath, part.buffer, { contentType: mime, upsert: false });

    if (upErr) {
      return { ok: false, error: upErr.message };
    }

    attachments.push({
      storage_path: storagePath,
      filename: sanitizeClientOriginalFilename(part.filename),
      mime_type: mime,
      byte_size: part.buffer.length,
    });
  }

  return { ok: true, attachments };
}

export function parseAttachmentsColumn(raw: unknown): IntakeAttachmentMeta[] {
  if (!Array.isArray(raw)) return [];
  const out: IntakeAttachmentMeta[] = [];
  for (const item of raw) {
    if (!item || typeof item !== "object") continue;
    const o = item as Record<string, unknown>;
    const storage_path = typeof o.storage_path === "string" ? o.storage_path : "";
    const filename = typeof o.filename === "string" ? o.filename : "";
    const mime_type = typeof o.mime_type === "string" ? o.mime_type : "";
    const byte_size = typeof o.byte_size === "number" ? o.byte_size : Number(o.byte_size);
    if (!storage_path || !filename) continue;
    if (!Number.isFinite(byte_size) || byte_size <= 0) continue;
    out.push({ storage_path, filename, mime_type, byte_size });
  }
  return out;
}

export async function signIntakeAttachments(
  sb: SupabaseClient,
  attachments: IntakeAttachmentMeta[],
): Promise<Array<IntakeAttachmentMeta & { downloadUrl: string }>> {
  const out: Array<IntakeAttachmentMeta & { downloadUrl: string }> = [];
  for (const a of attachments) {
    const { data, error } = await sb.storage
      .from(INTAKE_FILE_BUCKET)
      .createSignedUrl(a.storage_path, 3600);
    if (error || !data?.signedUrl) continue;
    out.push({ ...a, downloadUrl: data.signedUrl });
  }
  return out;
}
