import { requireBrandTenant } from "@/lib/sales/active-brand";
import { listEmails } from "@/lib/sales/emails";
import { EmailsClient } from "@/components/sales/emails-client";

export const metadata = { title: "Emails · Sales · J Supreme" };
export const dynamic = "force-dynamic";

export default async function SalesEmailsPage() {
  const owner = await requireBrandTenant();
  const emails = await listEmails(owner, 300);
  return <EmailsClient emails={emails} />;
}
