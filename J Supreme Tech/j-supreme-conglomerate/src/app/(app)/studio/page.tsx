import { StudioClient } from "@/components/studio/studio-client";
import { SEED_TEMPLATES } from "@/lib/studio/seed-templates";
import { listSavedTemplates } from "@/app/(app)/studio/actions";

export const dynamic = "force-dynamic";

export default async function StudioPage() {
  const saved = await listSavedTemplates().catch(() => []);
  // Note: no web-font <link> on purpose — the canvas uses OS fonts (Montserrat
  // if installed, else Segoe UI) so the live preview and the offline PNG export
  // render identically. See doExport() in studio-client.
  return <StudioClient seeds={SEED_TEMPLATES} saved={saved} operator={null} />;
}
