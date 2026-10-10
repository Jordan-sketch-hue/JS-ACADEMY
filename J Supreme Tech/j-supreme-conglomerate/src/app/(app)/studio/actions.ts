"use server";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";
import type { StudioTemplate, StudioLayout } from "@/lib/studio/types";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** Service-role client, or null when env isn't present (e.g. local dev). */
function adminClient(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_SECRET_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } });
}

type Row = {
  id: string;
  key: string;
  name: string;
  category: string;
  layout: string;
  ratio: string;
  fields: StudioTemplate["fields"];
  is_builtin: boolean;
  owner: string | null;
  updated_at: string;
};

function rowToTemplate(r: Row): StudioTemplate {
  return {
    id: r.id,
    key: r.key,
    name: r.name,
    category: r.category,
    layout: r.layout as StudioLayout,
    ratio: r.ratio,
    fields: r.fields ?? {},
    isBuiltin: r.is_builtin,
    owner: r.owner,
    updatedAt: r.updated_at,
  };
}

/** Saved (non-seed) templates. Returns [] if the DB isn't reachable. */
export async function listSavedTemplates(): Promise<StudioTemplate[]> {
  const supabase = adminClient();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("studio_templates")
    .select("*")
    .order("updated_at", { ascending: false });
  if (error || !data) return [];
  return (data as Row[]).map(rowToTemplate);
}

export type SaveInput = {
  id?: string; // present + uuid → update existing; otherwise insert new
  key: string;
  name: string;
  category?: string;
  layout: StudioLayout;
  ratio: string;
  fields: StudioTemplate["fields"];
  owner?: string | null;
};

export async function saveTemplate(
  input: SaveInput,
): Promise<{ ok: boolean; id?: string; error?: string }> {
  const supabase = adminClient();
  if (!supabase) {
    return { ok: false, error: "Saving needs the Supabase service key (set on Vercel)." };
  }

  const base = {
    key: input.key,
    name: input.name.trim() || "Untitled template",
    category: input.category ?? "service-ad",
    layout: input.layout,
    ratio: input.ratio,
    fields: input.fields ?? {},
    is_builtin: false,
    owner: input.owner ?? null,
  };

  if (input.id && UUID_RE.test(input.id)) {
    const { data, error } = await supabase
      .from("studio_templates")
      .update({ ...base, updated_at: new Date().toISOString() })
      .eq("id", input.id)
      .select("id")
      .maybeSingle();
    if (error) return { ok: false, error: error.message };
    revalidatePath("/studio");
    return { ok: true, id: data?.id ?? input.id };
  }

  const { data, error } = await supabase
    .from("studio_templates")
    .insert(base)
    .select("id")
    .single();
  if (error) return { ok: false, error: error.message };
  revalidatePath("/studio");
  return { ok: true, id: data.id };
}

export async function deleteTemplate(id: string): Promise<{ ok: boolean; error?: string }> {
  const supabase = adminClient();
  if (!supabase) return { ok: false, error: "Delete needs the Supabase service key." };
  if (!UUID_RE.test(id)) return { ok: false, error: "Only saved templates can be deleted." };
  const { error } = await supabase.from("studio_templates").delete().eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/studio");
  return { ok: true };
}
