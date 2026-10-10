import { isSupabasePersistenceEnabled } from "@/lib/env/storage-mode";
import { requireOwnerClerkId } from "@/lib/session";
import { listCrmClients, listCrmLeads } from "@/lib/data/crm";
import { batchLatestIntakeSummariesForReferredClients } from "@/lib/data/intake-forms";
import { CrmClient } from "@/components/crm/crm-client";

export default async function CrmPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const owner = await requireOwnerClerkId();
  const persistLocally = !isSupabasePersistenceEnabled();
  const params = await searchParams;
  const initialTab = params.tab === "clients" ? "clients" : "leads";

  const [initialClients, initialLeads] = await Promise.all([
    listCrmClients(owner),
    listCrmLeads(owner),
  ]);

  const intakeSummariesByClientId = persistLocally
    ? {}
    : await batchLatestIntakeSummariesForReferredClients(
        owner,
        initialClients.map((c) => c.id),
      );

  return (
    <CrmClient
      ownerId={owner}
      persistLocally={persistLocally}
      initialClients={initialClients}
      initialLeads={initialLeads}
      initialTab={initialTab}
      intakeSummariesByClientId={intakeSummariesByClientId}
    />
  );
}
