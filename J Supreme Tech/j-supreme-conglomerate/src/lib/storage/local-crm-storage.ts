import type { CrmClientRecord, CrmLeadRecord } from "@/lib/data/crm-records";

export const LOCAL_CRM_CHANGED = "j-supreme-local-crm-changed";

export type LocalCrmBundle = { clients: CrmClientRecord[]; leads: CrmLeadRecord[] };

export function localCrmStorageKey(ownerId: string) {
  return `j-supreme:crm:v1:${ownerId}`;
}

export function loadLocalCrmBundle(ownerId: string): LocalCrmBundle | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(localCrmStorageKey(ownerId));
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as LocalCrmBundle;
    if (!Array.isArray(parsed?.clients) || !Array.isArray(parsed?.leads)) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function saveLocalCrmBundle(ownerId: string, bundle: LocalCrmBundle) {
  if (typeof window === "undefined") return;
  localStorage.setItem(localCrmStorageKey(ownerId), JSON.stringify(bundle));
  window.dispatchEvent(new Event(LOCAL_CRM_CHANGED));
}

export function mergeCrmDealIntoLocalStorage(
  ownerId: string,
  client: CrmClientRecord,
  lead: CrmLeadRecord,
) {
  const bundle = loadOrSeedLocalCrmBundle(ownerId);
  const clients = [client, ...bundle.clients.filter((c) => c.id !== client.id)];
  const leads = [lead, ...bundle.leads.filter((l) => l.id !== lead.id)];
  saveLocalCrmBundle(ownerId, { clients, leads });
}

export function loadOrSeedLocalCrmBundle(ownerId: string): LocalCrmBundle {
  const existing = loadLocalCrmBundle(ownerId);
  if (existing) return existing;
  const bundle: LocalCrmBundle = { clients: [], leads: [] };
  saveLocalCrmBundle(ownerId, bundle);
  return bundle;
}
