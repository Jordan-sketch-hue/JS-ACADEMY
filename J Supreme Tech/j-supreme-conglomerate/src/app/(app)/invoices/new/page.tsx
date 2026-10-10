import { requireOwnerClerkId } from "@/lib/session";
import { listCrmClients } from "@/lib/data/crm";
import { InvoiceEditor } from "@/components/invoices/invoice-editor";

export default async function NewInvoicePage({
  searchParams,
}: {
  searchParams: Promise<{ clientId?: string }>;
}) {
  const owner = await requireOwnerClerkId();
  const clients = await listCrmClients(owner);
  const params = await searchParams;
  const defaultClientId = params.clientId?.trim() || null;

  return (
    <InvoiceEditor mode="create" clients={clients} defaultClientId={defaultClientId} />
  );
}
