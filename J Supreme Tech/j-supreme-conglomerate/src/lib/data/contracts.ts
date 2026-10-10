import { getServiceSupabase } from "@/lib/supabase/admin";
import type { Recurrence } from "@/lib/invoices/recurrence";

export type ContractType = "service" | "retainer";
export type ContractStatus =
  | "draft"
  | "sent"
  | "signed"
  | "active"
  | "terminated"
  | "expired";

export const CONTRACT_TYPE_OPTIONS: { value: ContractType; label: string }[] = [
  { value: "service", label: "Service agreement (project)" },
  { value: "retainer", label: "Retainer (recurring)" },
];

export const CONTRACT_STATUS_OPTIONS: ContractStatus[] = [
  "draft",
  "sent",
  "signed",
  "active",
  "terminated",
  "expired",
];

export type ContractRecord = {
  id: string;
  owner_clerk_id: string;
  client_id: string | null;
  title: string;
  contract_type: ContractType;
  status: ContractStatus;
  company_name: string | null;
  services: string[];
  scope: string | null;
  start_date: string | null;
  end_date: string | null;
  billing_cadence: Recurrence;
  fee_amount: number;
  currency: string;
  payment_terms_days: number;
  late_fee_percent: number | null;
  governing_law: string | null;
  termination_notice_days: number;
  liability_cap: string | null;
  confidentiality: boolean;
  ip_assignment: boolean;
  notes: string | null;
  deposit_amount: number | null;
  valid_until: string | null;
  sign_token: string | null;
  provider_signature: string | null;
  provider_signer_name: string | null;
  provider_signed_at: string | null;
  client_signature: string | null;
  client_signer_name: string | null;
  client_signer_email: string | null;
  client_signed_at: string | null;
  created_at: string;
  updated_at: string;
};

export type ContractListItem = ContractRecord & {
  client_business_name: string | null;
};

const CONTRACT_SELECT =
  "id,owner_clerk_id,client_id,title,contract_type,status,company_name,services,scope,start_date,end_date,billing_cadence,fee_amount,currency,payment_terms_days,late_fee_percent,governing_law,termination_notice_days,liability_cap,confidentiality,ip_assignment,notes,deposit_amount,valid_until,sign_token,provider_signature,provider_signer_name,provider_signed_at,client_signature,client_signer_name,client_signer_email,client_signed_at,created_at,updated_at";

function normalizeType(v: unknown): ContractType {
  return v === "retainer" ? "retainer" : "service";
}
function normalizeStatus(v: unknown): ContractStatus {
  return CONTRACT_STATUS_OPTIONS.includes(v as ContractStatus)
    ? (v as ContractStatus)
    : "draft";
}
function normalizeCadence(v: unknown): Recurrence {
  return v === "weekly" || v === "biweekly" || v === "monthly" || v === "quarterly"
    ? v
    : "none";
}

function mapRow(row: Record<string, unknown>): ContractRecord {
  return {
    id: String(row.id),
    owner_clerk_id: String(row.owner_clerk_id),
    client_id: row.client_id != null ? String(row.client_id) : null,
    title: String(row.title ?? "Untitled agreement"),
    contract_type: normalizeType(row.contract_type),
    status: normalizeStatus(row.status),
    company_name: row.company_name != null ? String(row.company_name) : null,
    services: Array.isArray(row.services)
      ? (row.services as unknown[]).map((v) => String(v))
      : [],
    scope: row.scope != null ? String(row.scope) : null,
    start_date: row.start_date != null ? String(row.start_date) : null,
    end_date: row.end_date != null ? String(row.end_date) : null,
    billing_cadence: normalizeCadence(row.billing_cadence),
    fee_amount: Number(row.fee_amount ?? 0),
    currency: String(row.currency ?? "USD"),
    payment_terms_days: Number(row.payment_terms_days ?? 14),
    late_fee_percent:
      row.late_fee_percent != null ? Number(row.late_fee_percent) : null,
    governing_law: row.governing_law != null ? String(row.governing_law) : null,
    termination_notice_days: Number(row.termination_notice_days ?? 30),
    liability_cap: row.liability_cap != null ? String(row.liability_cap) : null,
    confidentiality: row.confidentiality !== false,
    ip_assignment: row.ip_assignment !== false,
    notes: row.notes != null ? String(row.notes) : null,
    deposit_amount:
      row.deposit_amount != null ? Number(row.deposit_amount) : null,
    valid_until: row.valid_until != null ? String(row.valid_until) : null,
    sign_token: row.sign_token != null ? String(row.sign_token) : null,
    provider_signature:
      row.provider_signature != null ? String(row.provider_signature) : null,
    provider_signer_name:
      row.provider_signer_name != null ? String(row.provider_signer_name) : null,
    provider_signed_at:
      row.provider_signed_at != null ? String(row.provider_signed_at) : null,
    client_signature:
      row.client_signature != null ? String(row.client_signature) : null,
    client_signer_name:
      row.client_signer_name != null ? String(row.client_signer_name) : null,
    client_signer_email:
      row.client_signer_email != null ? String(row.client_signer_email) : null,
    client_signed_at:
      row.client_signed_at != null ? String(row.client_signed_at) : null,
    created_at: String(row.created_at),
    updated_at: String(row.updated_at ?? row.created_at),
  };
}

export type ContractInput = {
  /** Empty string / null = unassigned — attach a client later. */
  client_id?: string | null;
  title: string;
  contract_type?: ContractType;
  status?: ContractStatus;
  company_name?: string | null;
  services?: string[];
  scope?: string | null;
  start_date?: string | null;
  end_date?: string | null;
  billing_cadence?: Recurrence;
  fee_amount?: number | null;
  currency?: string;
  payment_terms_days?: number | null;
  late_fee_percent?: number | null;
  governing_law?: string | null;
  termination_notice_days?: number | null;
  liability_cap?: string | null;
  confidentiality?: boolean;
  ip_assignment?: boolean;
  notes?: string | null;
  deposit_amount?: number | null;
  valid_until?: string | null;
};

export type ContractMutationResult =
  | { ok: true; id: string }
  | { ok: false; error: string };

function buildPayload(ownerClerkId: string, input: ContractInput) {
  const services = (input.services ?? []).map((s) => s.trim()).filter(Boolean);
  const fee =
    input.fee_amount != null && Number.isFinite(input.fee_amount)
      ? Math.round(Math.max(0, input.fee_amount) * 100) / 100
      : 0;
  const deposit =
    input.deposit_amount != null && Number.isFinite(input.deposit_amount) && input.deposit_amount > 0
      ? Math.round(input.deposit_amount * 100) / 100
      : null;
  return {
    owner_clerk_id: ownerClerkId,
    client_id: input.client_id?.trim() || null,
    title: input.title.trim() || "Untitled agreement",
    contract_type: normalizeType(input.contract_type),
    status: normalizeStatus(input.status),
    company_name: input.company_name?.trim() || null,
    services,
    scope: input.scope?.trim() || null,
    start_date: input.start_date?.trim() || null,
    end_date: input.end_date?.trim() || null,
    billing_cadence: normalizeCadence(input.billing_cadence),
    fee_amount: fee,
    currency: (input.currency ?? "USD").trim() || "USD",
    payment_terms_days:
      input.payment_terms_days != null && Number.isFinite(input.payment_terms_days)
        ? Math.max(0, Math.round(input.payment_terms_days))
        : 14,
    late_fee_percent:
      input.late_fee_percent != null && Number.isFinite(input.late_fee_percent)
        ? Math.max(0, input.late_fee_percent)
        : null,
    governing_law: input.governing_law?.trim() || null,
    termination_notice_days:
      input.termination_notice_days != null &&
      Number.isFinite(input.termination_notice_days)
        ? Math.max(0, Math.round(input.termination_notice_days))
        : 30,
    liability_cap: input.liability_cap?.trim() || null,
    confidentiality: input.confidentiality !== false,
    ip_assignment: input.ip_assignment !== false,
    notes: input.notes?.trim() || null,
    deposit_amount: deposit,
    valid_until: input.valid_until?.trim() || null,
  };
}

export async function listContracts(
  ownerClerkId: string,
): Promise<ContractListItem[]> {
  const sb = getServiceSupabase();
  if (!sb) return [];
  try {
    const { data, error } = await sb
      .from("contracts")
      .select(`${CONTRACT_SELECT}, clients(business_name)`)
      .eq("owner_clerk_id", ownerClerkId)
      .order("created_at", { ascending: false });
    if (error || !data) return [];
    return data.map((raw) => {
      const row = raw as Record<string, unknown> & {
        clients?: { business_name?: string } | null;
      };
      return {
        ...mapRow(row),
        client_business_name: row.clients?.business_name ?? null,
      };
    });
  } catch {
    return [];
  }
}

export async function getContract(
  ownerClerkId: string,
  contractId: string,
): Promise<ContractListItem | null> {
  const sb = getServiceSupabase();
  if (!sb) return null;
  try {
    const { data, error } = await sb
      .from("contracts")
      .select(`${CONTRACT_SELECT}, clients(business_name)`)
      .eq("owner_clerk_id", ownerClerkId)
      .eq("id", contractId)
      .maybeSingle();
    if (error || !data) return null;
    const row = data as Record<string, unknown> & {
      clients?: { business_name?: string } | null;
    };
    return {
      ...mapRow(row),
      client_business_name: row.clients?.business_name ?? null,
    };
  } catch {
    return null;
  }
}

export async function createContract(
  ownerClerkId: string,
  input: ContractInput,
): Promise<ContractMutationResult> {
  const sb = getServiceSupabase();
  if (!sb) {
    return {
      ok: false,
      error:
        "Supabase is not configured — set NEXT_PUBLIC_SUPABASE_URL and a service key.",
    };
  }
  if (!input.title?.trim()) {
    return { ok: false, error: "Give the agreement a title." };
  }
  try {
    const { data, error } = await sb
      .from("contracts")
      .insert(buildPayload(ownerClerkId, input))
      .select("id")
      .single();
    if (error || !data) {
      const msg = error?.message ?? "Could not create contract.";
      const hint = /relation|42P01|does not exist/i.test(msg)
        ? " Apply migration supabase/migrations/20260527130000_contracts_and_invoice_category.sql."
        : "";
      return { ok: false, error: `${msg}${hint}` };
    }
    return { ok: true, id: String((data as { id: string }).id) };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Unknown error" };
  }
}

export async function updateContract(
  ownerClerkId: string,
  contractId: string,
  input: ContractInput,
): Promise<ContractMutationResult> {
  const sb = getServiceSupabase();
  if (!sb) return { ok: false, error: "Supabase is not configured." };
  try {
    const { error } = await sb
      .from("contracts")
      .update({ ...buildPayload(ownerClerkId, input), updated_at: new Date().toISOString() })
      .eq("id", contractId)
      .eq("owner_clerk_id", ownerClerkId);
    if (error) return { ok: false, error: error.message };
    return { ok: true, id: contractId };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Unknown error" };
  }
}

/* ------------------------------------------------------------------ */
/* E-signing                                                            */
/* ------------------------------------------------------------------ */

function newSignToken(): string {
  // 32 hex chars — unguessable public-link token.
  return globalThis.crypto.randomUUID().replace(/-/g, "");
}

/** Create (or return the existing) public signing token for a contract. */
export async function ensureSignToken(
  ownerClerkId: string,
  contractId: string,
): Promise<{ ok: true; token: string } | { ok: false; error: string }> {
  const sb = getServiceSupabase();
  if (!sb) return { ok: false, error: "Supabase is not configured." };
  try {
    const { data, error } = await sb
      .from("contracts")
      .select("sign_token")
      .eq("id", contractId)
      .eq("owner_clerk_id", ownerClerkId)
      .maybeSingle();
    if (error || !data) return { ok: false, error: error?.message ?? "Contract not found." };
    const existing = (data as { sign_token: string | null }).sign_token;
    if (existing) return { ok: true, token: existing };
    const token = newSignToken();
    const { error: upErr } = await sb
      .from("contracts")
      .update({ sign_token: token, updated_at: new Date().toISOString() })
      .eq("id", contractId)
      .eq("owner_clerk_id", ownerClerkId);
    if (upErr) return { ok: false, error: upErr.message };
    return { ok: true, token };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Unknown error" };
  }
}

export async function signContractAsProvider(
  ownerClerkId: string,
  contractId: string,
  signature: string,
  signerName: string,
): Promise<ContractMutationResult> {
  const sb = getServiceSupabase();
  if (!sb) return { ok: false, error: "Supabase is not configured." };
  if (!signature.trim()) return { ok: false, error: "Signature is empty." };
  try {
    const { error } = await sb
      .from("contracts")
      .update({
        provider_signature: signature,
        provider_signer_name: signerName.trim() || null,
        provider_signed_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", contractId)
      .eq("owner_clerk_id", ownerClerkId);
    if (error) return { ok: false, error: error.message };
    return { ok: true, id: contractId };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Unknown error" };
  }
}

/** Operator-side client signing (client signs on the operator's device). */
export async function signContractAsClient(
  ownerClerkId: string,
  contractId: string,
  signature: string,
  signerName: string,
): Promise<ContractMutationResult> {
  const sb = getServiceSupabase();
  if (!sb) return { ok: false, error: "Supabase is not configured." };
  if (!signature.trim()) return { ok: false, error: "Signature is empty." };
  try {
    const { error } = await sb
      .from("contracts")
      .update({
        client_signature: signature,
        client_signer_name: signerName.trim() || null,
        client_signed_at: new Date().toISOString(),
        status: "signed",
        updated_at: new Date().toISOString(),
      })
      .eq("id", contractId)
      .eq("owner_clerk_id", ownerClerkId);
    if (error) return { ok: false, error: error.message };
    return { ok: true, id: contractId };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Unknown error" };
  }
}

/** Remove one party's signature (signed in error / re-negotiated). */
export async function clearContractSignature(
  ownerClerkId: string,
  contractId: string,
  party: "provider" | "client",
): Promise<ContractMutationResult> {
  const sb = getServiceSupabase();
  if (!sb) return { ok: false, error: "Supabase is not configured." };
  const patch =
    party === "provider"
      ? {
          provider_signature: null,
          provider_signer_name: null,
          provider_signed_at: null,
        }
      : {
          client_signature: null,
          client_signer_name: null,
          client_signed_at: null,
        };
  try {
    const { error } = await sb
      .from("contracts")
      .update({ ...patch, updated_at: new Date().toISOString() })
      .eq("id", contractId)
      .eq("owner_clerk_id", ownerClerkId);
    if (error) return { ok: false, error: error.message };
    return { ok: true, id: contractId };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Unknown error" };
  }
}

/** Public lookup for /sign/[token] — no owner filter, token is the secret. */
export async function getContractBySignToken(
  token: string,
): Promise<ContractListItem | null> {
  const sb = getServiceSupabase();
  if (!sb || !token.trim()) return null;
  try {
    const { data, error } = await sb
      .from("contracts")
      .select(`${CONTRACT_SELECT}, clients(business_name)`)
      .eq("sign_token", token.trim())
      .maybeSingle();
    if (error || !data) return null;
    const row = data as Record<string, unknown> & {
      clients?: { business_name?: string } | null;
    };
    return {
      ...mapRow(row),
      client_business_name: row.clients?.business_name ?? null,
    };
  } catch {
    return null;
  }
}

/** Store/refresh the client signer's email (used for invites + signed copy). */
export async function setClientSignerEmail(
  ownerClerkId: string,
  contractId: string,
  email: string,
): Promise<ContractMutationResult> {
  const sb = getServiceSupabase();
  if (!sb) return { ok: false, error: "Supabase is not configured." };
  try {
    const { error } = await sb
      .from("contracts")
      .update({
        client_signer_email: email.trim() || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", contractId)
      .eq("owner_clerk_id", ownerClerkId);
    if (error) return { ok: false, error: error.message };
    return { ok: true, id: contractId };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Unknown error" };
  }
}

/** Public client signing via share link. */
export async function signContractByToken(
  token: string,
  signature: string,
  signerName: string,
  signerEmail: string,
): Promise<ContractMutationResult> {
  const sb = getServiceSupabase();
  if (!sb) return { ok: false, error: "Signing is unavailable right now." };
  if (!signature.trim()) return { ok: false, error: "Signature is empty." };
  if (!signerName.trim()) return { ok: false, error: "Enter your full name." };
  if (!/^\S+@\S+\.\S+$/.test(signerEmail.trim())) {
    return { ok: false, error: "Enter a valid email address for your signed copy." };
  }
  const existing = await getContractBySignToken(token);
  if (!existing) return { ok: false, error: "This signing link is invalid." };
  if (existing.client_signature) {
    return { ok: false, error: "This agreement has already been signed." };
  }
  if (existing.status === "terminated" || existing.status === "expired") {
    return { ok: false, error: "This agreement is no longer open for signature." };
  }
  if (existing.valid_until) {
    const cutoff = new Date(`${existing.valid_until}T23:59:59`);
    if (Number.isFinite(cutoff.getTime()) && cutoff.getTime() < Date.now()) {
      return {
        ok: false,
        error: "This offer has expired — contact the provider for updated terms.",
      };
    }
  }
  try {
    const { error } = await sb
      .from("contracts")
      .update({
        client_signature: signature,
        client_signer_name: signerName.trim(),
        client_signer_email: signerEmail.trim(),
        client_signed_at: new Date().toISOString(),
        status: "signed",
        updated_at: new Date().toISOString(),
      })
      .eq("id", existing.id)
      .is("client_signature", null);
    if (error) return { ok: false, error: error.message };
    return { ok: true, id: existing.id };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Unknown error" };
  }
}

export async function deleteContract(
  ownerClerkId: string,
  contractId: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const sb = getServiceSupabase();
  if (!sb) return { ok: false, error: "Supabase is not configured." };
  try {
    const { error } = await sb
      .from("contracts")
      .delete()
      .eq("id", contractId)
      .eq("owner_clerk_id", ownerClerkId);
    if (error) return { ok: false, error: error.message };
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Unknown error" };
  }
}
