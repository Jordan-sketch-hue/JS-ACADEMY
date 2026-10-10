import { requireOwnerClerkId } from "@/lib/session";
import { isSupabasePersistenceEnabled } from "@/lib/env/storage-mode";
import { listIntakeForms } from "@/lib/data/intake-forms";
import { PipelineIntakeManager } from "@/components/pipeline-intake/pipeline-intake-manager";

export const dynamic = "force-dynamic";

export default async function PipelineIntakePage() {
  const owner = await requireOwnerClerkId();
  const cloud = isSupabasePersistenceEnabled();
  const forms = cloud ? await listIntakeForms(owner) : [];
  return (
    <PipelineIntakeManager
      initialForms={forms}
      cloudEnabled={cloud}
    />
  );
}
