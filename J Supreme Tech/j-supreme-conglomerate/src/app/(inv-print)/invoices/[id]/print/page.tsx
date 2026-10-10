import { notFound } from "next/navigation";
import { requireOwnerClerkId } from "@/lib/session";
import { getInvoiceWithLines } from "@/lib/data/invoices";
import { InvoicePrintView } from "@/components/invoices/invoice-print-view";

export default async function InvoicePrintRoute({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const owner = await requireOwnerClerkId();
  const { id } = await params;
  const bundle = await getInvoiceWithLines(owner, id);
  if (!bundle) notFound();
  return <InvoicePrintView bundle={bundle} />;
}
