import { isSupabasePersistenceEnabled } from "@/lib/env/storage-mode";
import { requireOwnerClerkId } from "@/lib/session";
import { listVisionItems } from "@/lib/data/vision";
import type { VisionItem } from "@/lib/vision/types";
import { VisionBoardClient } from "@/components/vision/vision-board-client";

export const dynamic = "force-dynamic";

export default async function VisionPage() {
  const owner = await requireOwnerClerkId();
  const persistLocally = !isSupabasePersistenceEnabled();

  // In local-save mode the client seeds + hydrates from the browser store.
  const initialItems: VisionItem[] = persistLocally ? [] : await listVisionItems(owner);

  return (
    <VisionBoardClient
      ownerId={owner}
      persistLocally={persistLocally}
      initialItems={initialItems}
    />
  );
}
