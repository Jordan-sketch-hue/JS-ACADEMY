/**
 * E-signature value shared by contracts (provider + client) and the
 * operator's saved signature. Stored in the DB as a JSON string so a
 * signature is portable across the editor, the public signing page,
 * and print/PDF output.
 *
 *   typed  — rendered in the script font (--font-signature)
 *   drawn  — PNG data-URL captured from the signature pad
 */
export type SignatureValue =
  | { kind: "typed"; name: string }
  | { kind: "drawn"; dataUrl: string };

export function parseSignature(raw: string | null | undefined): SignatureValue | null {
  if (!raw?.trim()) return null;
  try {
    const v = JSON.parse(raw) as Partial<SignatureValue> & { kind?: string };
    if (v.kind === "typed" && typeof (v as { name?: unknown }).name === "string") {
      const name = (v as { name: string }).name.trim();
      return name ? { kind: "typed", name } : null;
    }
    if (
      v.kind === "drawn" &&
      typeof (v as { dataUrl?: unknown }).dataUrl === "string" &&
      (v as { dataUrl: string }).dataUrl.startsWith("data:image/")
    ) {
      return { kind: "drawn", dataUrl: (v as { dataUrl: string }).dataUrl };
    }
    return null;
  } catch {
    // Legacy/plain-text fallback: treat as a typed name.
    const name = raw.trim();
    return name && !name.startsWith("{") ? { kind: "typed", name } : null;
  }
}

export function serializeSignature(v: SignatureValue): string {
  return JSON.stringify(v);
}
