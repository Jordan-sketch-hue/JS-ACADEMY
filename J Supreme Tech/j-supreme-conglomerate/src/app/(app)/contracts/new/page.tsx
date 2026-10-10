import { requireOwnerClerkId } from "@/lib/session";
import { listCrmClients } from "@/lib/data/crm";
import { getInvoiceWithLines } from "@/lib/data/invoices";
import { isRecurring } from "@/lib/invoices/recurrence";
import { ContractEditor } from "@/components/contracts/contract-editor";
import type { ContractListItem } from "@/lib/data/contracts";

export default async function NewContractPage({
  searchParams,
}: {
  searchParams: Promise<{ clientId?: string; fromInvoice?: string }>;
}) {
  const owner = await requireOwnerClerkId();
  const clients = await listCrmClients(owner);
  const params = await searchParams;
  let defaultClientId = params.clientId?.trim() || null;

  // Pre-fill from an invoice ("draft contract from invoice").
  let prefill: Partial<ContractListItem> | undefined;
  if (params.fromInvoice) {
    const bundle = await getInvoiceWithLines(owner, params.fromInvoice);
    if (bundle) {
      const inv = bundle.invoice;
      const services = inv.services_rendered ?? [];
      const fee =
        inv.total_project_amount != null && inv.total_project_amount > 0
          ? inv.total_project_amount
          : inv.amount;
      prefill = {
        client_id: inv.client_id,
        company_name: inv.company_name,
        services,
        title: services.length
          ? `${services.join(" · ")} — agreement`
          : `Service agreement (${inv.number})`,
        contract_type: isRecurring(inv.recurrence) ? "retainer" : "service",
        billing_cadence: isRecurring(inv.recurrence) ? inv.recurrence : "none",
        fee_amount: fee,
        currency: inv.currency,
        scope: inv.notes,
        start_date: inv.issued_at,
      };
      if (inv.client_id) defaultClientId = inv.client_id;
    }
  }

  return (
    <ContractEditor
      mode="create"
      clients={clients}
      defaultClientId={defaultClientId}
      prefill={prefill}
    />
  );
}
