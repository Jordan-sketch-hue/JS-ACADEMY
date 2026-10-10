/** Max upload size (15 MiB); keep in sync with DB check constraint and UX copy. */
export const CLIENT_FILE_MAX_BYTES = 15 * 1024 * 1024;

export const CLIENT_FILE_BUCKET = "crm-client-files";

/** Server-enforced MIME allowlist for CRM uploads. */
export const CLIENT_FILE_ALLOWED_MIMES = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/svg+xml",
  "image/avif",
]);

const EXT_FALLBACK_MIME: Record<string, string> = {
  pdf: "application/pdf",
  doc: "application/msword",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  gif: "image/gif",
  webp: "image/webp",
  svg: "image/svg+xml",
  avif: "image/avif",
};

export function guessMimeFromFilename(name: string): string | null {
  const base = name.replace(/^.*[/\\]/, "").trim().toLowerCase();
  const dot = base.lastIndexOf(".");
  if (dot < 0 || dot === base.length - 1) return null;
  const ext = base.slice(dot + 1).replace(/[^\w.+]/g, "");
  const norm = EXT_FALLBACK_MIME[ext];
  return typeof norm === "string" ? norm : null;
}

export function isAllowedClientFileMime(mime: string): boolean {
  return CLIENT_FILE_ALLOWED_MIMES.has(mime.toLowerCase().trim());
}

export function coerceClientMime(
  reported: string | null | undefined,
  filename: string,
): string | null {
  const trimmed = typeof reported === "string" ? reported.trim().toLowerCase() : "";
  const raw = trimmed.split(";")[0]?.trim().toLowerCase() ?? "";
  if (raw && isAllowedClientFileMime(raw)) return raw;
  return guessMimeFromFilename(filename);
}

export function sanitizeClientOriginalFilename(original: string): string {
  const base = original.replace(/^.*[/\\]/, "").trim().slice(0, 240);
  if (!base) return "upload";
  return base.replace(/[\u0000-\u001f\u007f]/g, "").replace(/\s+/g, " ").trim() || "upload";
}

export function sanitizeClientStorageStem(name: string): string {
  const withoutExt =
    sanitizeClientOriginalFilename(name).replace(/\.[^.]+$/, "") || "file";
  const slug = withoutExt
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9.-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 72);
  return slug.length ? slug : "file";
}
