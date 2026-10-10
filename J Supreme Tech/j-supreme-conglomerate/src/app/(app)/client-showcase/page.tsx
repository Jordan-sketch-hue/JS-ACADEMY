import { ClientShowcaseClient } from "@/components/showcase/client-showcase-client";
import { listProjectWorkflows } from "@/lib/data/project-workflows";
import { requireOwnerClerkId } from "@/lib/session";

export default async function ClientShowcasePage() {
  const owner = await requireOwnerClerkId();
  const workflows = await listProjectWorkflows(owner);
  return <ClientShowcaseClient workflows={workflows} />;
}
