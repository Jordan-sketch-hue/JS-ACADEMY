import { getServiceSupabase } from "@/lib/supabase/admin";
import type { LeadStage } from "@/lib/data/seed";
import {
  createDealRecords,
  leadToCard,
  parseExtraHyperlinks,
  parseSocial,
  normalizeServiceCategory,
  sanitizeMarketingAssetLinks,
  type CreateCrmDealInput,
  type CrmClientRecord,
  type CrmLeadRecord,
} from "@/lib/data/crm-records";

export type {
  ClientHyperlink,
  ClientServiceCategory,
  CreateCrmDealInput,
  CrmClientRecord,
  CrmLeadRecord,
  LeadCardView,
} from "@/lib/data/crm-records";

export { leadToCard } from "@/lib/data/crm-records";

const CLIENT_SELECT =
  "id,owner_clerk_id,business_name,contact_name,email,phone,industry,website,notes,social_links,extra_hyperlinks,marketing_asset_links,service_category,roster_priority,services_needed,budget_amount,project_deadline,last_follow_up_at,next_follow_up_at,follow_up_notes,created_at,updated_at";

type ClientsTableRow = Record<string, unknown> & {
  id: string;
  owner_clerk_id: string;
  business_name: string;
  contact_name: string | null;
  email: string | null;
  phone: string | null;
  industry: string | null;
  website: string | null;
  notes: string | null;
  social_links: unknown;
  services_needed: string | null;
  budget_amount: unknown;
  project_deadline: string | null;
  last_follow_up_at: string | null;
  next_follow_up_at: string | null;
  follow_up_notes: string | null;
  created_at: string;
  updated_at: string;
};

function mapClientsTableRow(row: ClientsTableRow): CrmClientRecord {
  return {
    id: row.id,
    owner_clerk_id: row.owner_clerk_id,
    business_name: row.business_name,
    contact_name: row.contact_name,
    email: row.email,
    phone: row.phone,
    industry: row.industry,
    website: row.website,
    notes: row.notes,
    social_links: parseSocial(row.social_links),
    extra_hyperlinks: parseExtraHyperlinks(row.extra_hyperlinks),
    marketing_asset_links: parseExtraHyperlinks(
      (row as { marketing_asset_links?: unknown }).marketing_asset_links,
    ),
    service_category: normalizeServiceCategory(row.service_category),
    roster_priority:
      row.roster_priority != null ? Number(row.roster_priority) : 0,
    services_needed: row.services_needed,
    budget_amount:
      row.budget_amount != null ? Number(row.budget_amount) : null,
    project_deadline: row.project_deadline ?? null,
    last_follow_up_at: row.last_follow_up_at ?? null,
    next_follow_up_at: row.next_follow_up_at ?? null,
    follow_up_notes: row.follow_up_notes ?? null,
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

async function computeNextRosterPriority(
  sb: NonNullable<ReturnType<typeof getServiceSupabase>>,
  ownerClerkId: string,
): Promise<number> {
  const { data, error } = await sb
    .from("clients")
    .select("roster_priority")
    .eq("owner_clerk_id", ownerClerkId)
    .order("roster_priority", { ascending: true })
    .limit(1);
  if (error || !data?.length) return 0;
  const min = Number(
    (data[0] as { roster_priority?: unknown }).roster_priority ?? 0,
  );
  return min - 1;
}

export async function listCrmClients(ownerClerkId: string): Promise<CrmClientRecord[]> {
  const sb = getServiceSupabase();
  if (!sb) return [];
  try {
    const { data, error } = await sb
      .from("clients")
      .select(CLIENT_SELECT)
      .eq("owner_clerk_id", ownerClerkId)
      .order("roster_priority", { ascending: false })
      .order("business_name", { ascending: true });
    if (error) return [];
    return (data ?? []).map((row) =>
      mapClientsTableRow(row as ClientsTableRow),
    );
  } catch {
    return [];
  }
}

export async function getCrmClientById(
  ownerClerkId: string,
  clientId: string,
): Promise<CrmClientRecord | null> {
  const sb = getServiceSupabase();
  if (!sb) return null;
  try {
    const { data, error } = await sb
      .from("clients")
      .select(CLIENT_SELECT)
      .eq("id", clientId)
      .eq("owner_clerk_id", ownerClerkId)
      .maybeSingle();
    if (error || !data) return null;
    return mapClientsTableRow(data as ClientsTableRow);
  } catch {
    return null;
  }
}

function normalizeUrlForDedupe(raw: string): string {
  const s = raw.trim();
  try {
    const u = new URL(s);
    u.hash = "";
    const path = u.pathname.replace(/\/$/, "") || "";
    return `${u.protocol}//${u.host.toLowerCase()}${path}`;
  } catch {
    return s.replace(/\/$/, "");
  }
}

export type AppendClientDeployedSiteLinkResult =
  | { ok: true }
  | { ok: false; error: string };

/** Append a labeled deployment URL to `clients.extra_hyperlinks` without removing existing rows. */
export async function appendClientDeployedSiteLink(
  ownerClerkId: string,
  clientId: string,
  link: { label: string; url: string },
): Promise<AppendClientDeployedSiteLinkResult> {
  const client = await getCrmClientById(ownerClerkId, clientId);
  if (!client) return { ok: false, error: "Client not found." };
  const label = link.label.trim();
  const url = link.url.trim();
  if (!label || !url) return { ok: false, error: "Link label and URL are required." };

  const key = normalizeUrlForDedupe(url);
  const existing = client.extra_hyperlinks;
  if (existing.some((h) => normalizeUrlForDedupe(h.url) === key)) {
    return { ok: true };
  }
  return updateClientExtraHyperlinks(ownerClerkId, clientId, [
    ...existing,
    { label, url },
  ]);
}

export async function listCrmLeads(ownerClerkId: string): Promise<CrmLeadRecord[]> {
  const sb = getServiceSupabase();
  if (!sb) return [];
  try {
    const { data, error } = await sb
      .from("leads")
      .select(
        "id,owner_clerk_id,client_id,company,contact_name,email,phone,estimated_value,stage,tags,last_contacted_at,next_follow_up_at,follow_up_notes,created_at,updated_at",
      )
      .eq("owner_clerk_id", ownerClerkId)
      .order("updated_at", { ascending: false });
    if (error) return [];
    return (data ?? []).map((row) => ({
      ...row,
      stage: row.stage as LeadStage,
      tags: Array.isArray(row.tags) ? (row.tags as string[]) : [],
      estimated_value:
        row.estimated_value != null ? Number(row.estimated_value) : null,
      last_contacted_at: row.last_contacted_at ?? null,
      next_follow_up_at: row.next_follow_up_at ?? null,
      follow_up_notes: row.follow_up_notes ?? null,
    })) as CrmLeadRecord[];
  } catch {
    return [];
  }
}

export type CreateCrmDealResult =
  | { ok: true; client: CrmClientRecord; lead: CrmLeadRecord }
  | { ok: false; error: string };

export async function createCrmDeal(
  ownerClerkId: string,
  input: CreateCrmDealInput,
): Promise<CreateCrmDealResult> {
  const built = createDealRecords(ownerClerkId, input);
  if ("error" in built) return { ok: false, error: built.error };

  const sb = getServiceSupabase();
  if (!sb) {
    return {
      ok: false,
      error: "Supabase is not configured on the server — use browser-only CRM or set NEXT_PUBLIC_SUPABASE_URL and a service key.",
    };
  }

  const {
    client: draftClient,
    lead: draftLead,
  } = built;

  try {
    const rosterPriority = await computeNextRosterPriority(sb, ownerClerkId);
    const { data: clientRow, error: cErr } = await sb
      .from("clients")
      .insert({
        owner_clerk_id: ownerClerkId,
        business_name: draftClient.business_name,
        contact_name: draftClient.contact_name,
        email: draftClient.email,
        phone: draftClient.phone,
        industry: draftClient.industry,
        website: draftClient.website,
        notes: draftClient.notes,
        social_links: draftClient.social_links,
        extra_hyperlinks: draftClient.extra_hyperlinks,
        marketing_asset_links: draftClient.marketing_asset_links,
        service_category: draftClient.service_category,
        roster_priority: rosterPriority,
        services_needed: draftClient.services_needed,
        budget_amount: draftClient.budget_amount,
        project_deadline: draftClient.project_deadline,
        last_follow_up_at: draftClient.last_follow_up_at,
        next_follow_up_at: draftClient.next_follow_up_at,
        follow_up_notes: draftClient.follow_up_notes,
      })
      .select(CLIENT_SELECT)
      .single();

    if (cErr || !clientRow) {
      const msg = cErr?.message ?? "Could not save client.";
      const hint = /column|schema|42703|does not exist/i.test(msg)
        ? " Run supabase/migrations in the SQL editor (crm_marketing_asset_links, crm_roster_category, crm_enrichment, crm_followups, crm_extra_hyperlinks)."
        : "";
      return { ok: false, error: `${msg}${hint}` };
    }

    const client = mapClientsTableRow(clientRow as ClientsTableRow);

    const { data: leadRow, error: lErr } = await sb
      .from("leads")
      .insert({
        owner_clerk_id: ownerClerkId,
        client_id: client.id,
        company: draftLead.company,
        contact_name: draftLead.contact_name,
        email: draftLead.email,
        phone: draftLead.phone,
        estimated_value: draftLead.estimated_value,
        stage: draftLead.stage,
        tags: draftLead.tags.length ? draftLead.tags : [],
        last_contacted_at: draftLead.last_contacted_at,
        next_follow_up_at: draftLead.next_follow_up_at,
        follow_up_notes: draftLead.follow_up_notes,
      })
      .select(
        "id,owner_clerk_id,client_id,company,contact_name,email,phone,estimated_value,stage,tags,last_contacted_at,next_follow_up_at,follow_up_notes,created_at,updated_at",
      )
      .single();

    if (lErr || !leadRow) {
      return {
        ok: false,
        error: `${lErr?.message ?? "Could not save pipeline card."} Apply migrations so leads.client_id and new client columns exist.`,
      };
    }

    const lead: CrmLeadRecord = {
      ...leadRow,
      stage: leadRow.stage as LeadStage,
      tags: Array.isArray(leadRow.tags) ? (leadRow.tags as string[]) : [],
      estimated_value:
        leadRow.estimated_value != null ? Number(leadRow.estimated_value) : null,
      last_contacted_at: leadRow.last_contacted_at ?? null,
      next_follow_up_at: leadRow.next_follow_up_at ?? null,
      follow_up_notes: leadRow.follow_up_notes ?? null,
    };

    return { ok: true, client, lead };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return { ok: false, error: msg };
  }
}

export type UpdateLeadStageResult = { ok: true } | { ok: false; error: string };

export async function updateLeadStage(
  ownerClerkId: string,
  leadId: string,
  stage: LeadStage,
): Promise<UpdateLeadStageResult> {
  const sb = getServiceSupabase();
  if (!sb) {
    return { ok: false, error: "Supabase is not configured." };
  }
  try {
    const { error } = await sb
      .from("leads")
      .update({ stage, updated_at: new Date().toISOString() })
      .eq("id", leadId)
      .eq("owner_clerk_id", ownerClerkId);
    if (error) return { ok: false, error: error.message };
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Unknown error" };
  }
}

export type SwapClientRosterResult = { ok: true } | { ok: false; error: string };

export async function swapClientRosterWithNeighbor(
  ownerClerkId: string,
  clientId: string,
  direction: "up" | "down",
): Promise<SwapClientRosterResult> {
  const ordered = await listCrmClients(ownerClerkId);
  const idx = ordered.findIndex((c) => c.id === clientId);
  if (idx < 0) return { ok: false, error: "Client not found." };
  const nIdx = direction === "up" ? idx - 1 : idx + 1;
  if (nIdx < 0 || nIdx >= ordered.length) {
    return { ok: false, error: "Cannot move this row further." };
  }
  const a = ordered[idx];
  const b = ordered[nIdx];
  const sb = getServiceSupabase();
  if (!sb) return { ok: false, error: "Supabase is not configured." };
  const now = new Date().toISOString();
  const oldA = a.roster_priority;
  const oldB = b.roster_priority;

  if (oldA === oldB) {
    const newA = direction === "up" ? oldB + 1 : oldB - 1;
    const { error } = await sb
      .from("clients")
      .update({ roster_priority: newA, updated_at: now })
      .eq("id", a.id)
      .eq("owner_clerk_id", ownerClerkId);
    if (error) return { ok: false, error: error.message };
    return { ok: true };
  }

  const { error: e1 } = await sb
    .from("clients")
    .update({ roster_priority: oldB, updated_at: now })
    .eq("id", a.id)
    .eq("owner_clerk_id", ownerClerkId);
  if (e1) return { ok: false, error: e1.message };
  const { error: e2 } = await sb
    .from("clients")
    .update({ roster_priority: oldA, updated_at: now })
    .eq("id", b.id)
    .eq("owner_clerk_id", ownerClerkId);
  if (e2) return { ok: false, error: e2.message };
  return { ok: true };
}

export type DeleteCrmClientResult = { ok: true } | { ok: false; error: string };

/** Removes the client row and any pipeline lead linked by `client_id` (same owner). */
export async function deleteCrmClient(
  ownerClerkId: string,
  clientId: string,
): Promise<DeleteCrmClientResult> {
  const sb = getServiceSupabase();
  if (!sb) return { ok: false, error: "Supabase is not configured." };
  try {
    const { data: row, error: fetchErr } = await sb
      .from("clients")
      .select("id")
      .eq("id", clientId)
      .eq("owner_clerk_id", ownerClerkId)
      .maybeSingle();
    if (fetchErr) return { ok: false, error: fetchErr.message };
    if (!row) return { ok: false, error: "Client not found." };

    const { error: leadErr } = await sb
      .from("leads")
      .delete()
      .eq("client_id", clientId)
      .eq("owner_clerk_id", ownerClerkId);
    if (leadErr) return { ok: false, error: leadErr.message };

    const { error: clientErr } = await sb
      .from("clients")
      .delete()
      .eq("id", clientId)
      .eq("owner_clerk_id", ownerClerkId);
    if (clientErr) return { ok: false, error: clientErr.message };

    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Unknown error" };
  }
}

export type UpdateClientServiceCategoryResult =
  | { ok: true }
  | { ok: false; error: string };

export async function updateClientServiceCategory(
  ownerClerkId: string,
  clientId: string,
  category: unknown,
): Promise<UpdateClientServiceCategoryResult> {
  const sb = getServiceSupabase();
  if (!sb) return { ok: false, error: "Supabase is not configured." };
  const cat = normalizeServiceCategory(category);
  try {
    const { error } = await sb
      .from("clients")
      .update({ service_category: cat, updated_at: new Date().toISOString() })
      .eq("id", clientId)
      .eq("owner_clerk_id", ownerClerkId);
    if (error) return { ok: false, error: error.message };
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Unknown error" };
  }
}

export type UpdateClientMarketingAssetLinksResult =
  | { ok: true }
  | { ok: false; error: string };

export async function updateClientMarketingAssetLinks(
  ownerClerkId: string,
  clientId: string,
  raw: { label?: string | null; url?: string | null }[],
): Promise<UpdateClientMarketingAssetLinksResult> {
  const sb = getServiceSupabase();
  if (!sb) return { ok: false, error: "Supabase is not configured." };
  const links = sanitizeMarketingAssetLinks(raw);
  try {
    const { error } = await sb
      .from("clients")
      .update({
        marketing_asset_links: links,
        updated_at: new Date().toISOString(),
      })
      .eq("id", clientId)
      .eq("owner_clerk_id", ownerClerkId);
    if (error) return { ok: false, error: error.message };
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Unknown error" };
  }
}

export type UpdateClientExtraHyperlinksResult =
  | { ok: true }
  | { ok: false; error: string };

/** Labeled profile URLs (stored in `clients.extra_hyperlinks`; shown with website/socials). */
export async function updateClientExtraHyperlinks(
  ownerClerkId: string,
  clientId: string,
  raw: { label?: string | null; url?: string | null }[],
): Promise<UpdateClientExtraHyperlinksResult> {
  const sb = getServiceSupabase();
  if (!sb) return { ok: false, error: "Supabase is not configured." };
  const links = sanitizeMarketingAssetLinks(raw);
  try {
    const { error } = await sb
      .from("clients")
      .update({
        extra_hyperlinks: links,
        updated_at: new Date().toISOString(),
      })
      .eq("id", clientId)
      .eq("owner_clerk_id", ownerClerkId);
    if (error) return { ok: false, error: error.message };
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Unknown error" };
  }
}

/** Partial updates for the client roster grid (and linked lead when present). */
export type ClientRosterFieldPatch = {
  business_name?: string;
  contact_name?: string | null;
  email?: string | null;
  phone?: string | null;
  industry?: string | null;
  services_needed?: string | null;
  budget_amount?: number | null;
  project_deadline?: string | null;
  last_follow_up_at?: string | null;
  next_follow_up_at?: string | null;
  follow_up_notes?: string | null;
  pipeline_stage?: LeadStage;
};

export type UpdateClientRosterFieldsResult =
  | { ok: true }
  | { ok: false; error: string };

export async function updateClientRosterFields(
  ownerClerkId: string,
  clientId: string,
  patch: ClientRosterFieldPatch,
): Promise<UpdateClientRosterFieldsResult> {
  const sb = getServiceSupabase();
  if (!sb) return { ok: false, error: "Supabase is not configured." };

  const keys = Object.keys(patch) as (keyof ClientRosterFieldPatch)[];
  if (keys.length === 0) return { ok: true };

  if (patch.business_name !== undefined && !String(patch.business_name).trim()) {
    return { ok: false, error: "Business name cannot be empty." };
  }

  const now = new Date().toISOString();
  const clientUpdate: Record<string, unknown> = { updated_at: now };

  if (patch.business_name !== undefined) {
    clientUpdate.business_name = String(patch.business_name).trim();
  }
  if (patch.contact_name !== undefined) {
    clientUpdate.contact_name =
      patch.contact_name && String(patch.contact_name).trim()
        ? String(patch.contact_name).trim()
        : null;
  }
  if (patch.email !== undefined) {
    const e = String(patch.email ?? "").trim();
    clientUpdate.email = e || null;
  }
  if (patch.phone !== undefined) {
    const p = String(patch.phone ?? "").trim();
    clientUpdate.phone = p || null;
  }
  if (patch.industry !== undefined) {
    const i = String(patch.industry ?? "").trim();
    clientUpdate.industry = i || null;
  }
  if (patch.services_needed !== undefined) {
    const s = String(patch.services_needed ?? "").trim();
    clientUpdate.services_needed = s || null;
  }
  if (patch.budget_amount !== undefined) {
    clientUpdate.budget_amount = patch.budget_amount;
  }
  if (patch.project_deadline !== undefined) {
    const d = String(patch.project_deadline ?? "").trim();
    clientUpdate.project_deadline = d || null;
  }
  if (patch.last_follow_up_at !== undefined) {
    clientUpdate.last_follow_up_at = patch.last_follow_up_at;
  }
  if (patch.next_follow_up_at !== undefined) {
    clientUpdate.next_follow_up_at = patch.next_follow_up_at;
  }
  if (patch.follow_up_notes !== undefined) {
    const n = String(patch.follow_up_notes ?? "").trim();
    clientUpdate.follow_up_notes = n || null;
  }

  try {
    const { error: cErr } = await sb
      .from("clients")
      .update(clientUpdate)
      .eq("id", clientId)
      .eq("owner_clerk_id", ownerClerkId);
    if (cErr) return { ok: false, error: cErr.message };

    const { data: leadRow, error: lFetchErr } = await sb
      .from("leads")
      .select("id")
      .eq("client_id", clientId)
      .eq("owner_clerk_id", ownerClerkId)
      .maybeSingle();

    if (lFetchErr || !leadRow?.id) {
      return { ok: true };
    }

    const leadId = leadRow.id as string;
    const leadUpdate: Record<string, unknown> = { updated_at: now };

    if (patch.business_name !== undefined) {
      leadUpdate.company = String(patch.business_name).trim();
    }
    if (patch.contact_name !== undefined) {
      leadUpdate.contact_name =
        patch.contact_name && String(patch.contact_name).trim()
          ? String(patch.contact_name).trim()
          : null;
    }
    if (patch.email !== undefined) {
      const e = String(patch.email ?? "").trim();
      leadUpdate.email = e || null;
    }
    if (patch.phone !== undefined) {
      const p = String(patch.phone ?? "").trim();
      leadUpdate.phone = p || null;
    }
    if (patch.follow_up_notes !== undefined) {
      const n = String(patch.follow_up_notes ?? "").trim();
      leadUpdate.follow_up_notes = n || null;
    }
    if (patch.next_follow_up_at !== undefined) {
      leadUpdate.next_follow_up_at = patch.next_follow_up_at;
    }
    if (patch.last_follow_up_at !== undefined) {
      leadUpdate.last_contacted_at = patch.last_follow_up_at;
    }
    if (patch.pipeline_stage !== undefined) {
      leadUpdate.stage = patch.pipeline_stage;
    }

    const { error: lErr } = await sb
      .from("leads")
      .update(leadUpdate)
      .eq("id", leadId)
      .eq("owner_clerk_id", ownerClerkId);
    if (lErr) return { ok: false, error: lErr.message };

    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Unknown error" };
  }
}
