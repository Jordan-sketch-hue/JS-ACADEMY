import { getServiceSupabase } from "@/lib/supabase/admin";

/**
 * The operator's saved ("set") signature — applied with one click whenever
 * the operator signs a contract as Provider. signature_data is a serialized
 * SignatureValue (see lib/contracts/signature.ts).
 */
export type SignatureSettings = {
  owner_clerk_id: string;
  signer_name: string;
  signer_title: string | null;
  signature_data: string;
  updated_at: string;
};

export async function getSignatureSettings(
  ownerClerkId: string,
): Promise<SignatureSettings | null> {
  const sb = getServiceSupabase();
  if (!sb) return null;
  try {
    const { data, error } = await sb
      .from("signature_settings")
      .select("owner_clerk_id,signer_name,signer_title,signature_data,updated_at")
      .eq("owner_clerk_id", ownerClerkId)
      .maybeSingle();
    if (error || !data) return null;
    const row = data as Record<string, unknown>;
    return {
      owner_clerk_id: String(row.owner_clerk_id),
      signer_name: String(row.signer_name ?? ""),
      signer_title: row.signer_title != null ? String(row.signer_title) : null,
      signature_data: String(row.signature_data ?? ""),
      updated_at: String(row.updated_at ?? ""),
    };
  } catch {
    return null;
  }
}

export async function saveSignatureSettings(
  ownerClerkId: string,
  input: { signer_name: string; signer_title?: string | null; signature_data: string },
): Promise<{ ok: true } | { ok: false; error: string }> {
  const sb = getServiceSupabase();
  if (!sb) return { ok: false, error: "Supabase is not configured." };
  if (!input.signer_name.trim()) {
    return { ok: false, error: "Enter the signer name." };
  }
  if (!input.signature_data.trim()) {
    return { ok: false, error: "Create a signature first." };
  }
  try {
    const { error } = await sb.from("signature_settings").upsert(
      {
        owner_clerk_id: ownerClerkId,
        signer_name: input.signer_name.trim(),
        signer_title: input.signer_title?.trim() || null,
        signature_data: input.signature_data,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "owner_clerk_id" },
    );
    if (error) return { ok: false, error: error.message };
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Unknown error" };
  }
}
