import { requireBrandTenant } from "@/lib/sales/active-brand";
import { listInboxThreads } from "@/lib/sales/messages";
import { InboxClient } from "@/components/sales/inbox-client";

export const metadata = { title: "Inbox · Sales · J Supreme" };
export const dynamic = "force-dynamic";

export default async function InboxPage() {
  const owner = await requireBrandTenant();
  const threads = await listInboxThreads(owner, 400);
  return <InboxClient threads={threads} />;
}
