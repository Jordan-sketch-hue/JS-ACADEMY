import Link from "next/link";
import { notFound } from "next/navigation";
import { requireOwnerClerkId } from "@/lib/session";
import { getInvoiceWithLines } from "@/lib/data/invoices";
import { listCrmClients } from "@/lib/data/crm";
import { InvoiceEditor } from "@/components/invoices/invoice-editor";

export default async function InvoiceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const owner = await requireOwnerClerkId();
  const { id } = await params;
  const bundle = await getInvoiceWithLines(owner, id);
  if (!bundle) {
    notFound();
  }
  const clients = await listCrmClients(owner);

  return <InvoiceEditor mode="edit" clients={clients} bundle={bundle} />;
}
