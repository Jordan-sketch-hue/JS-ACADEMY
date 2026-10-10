import { JarvisHub } from "@/components/jarvis/jarvis-hub";

export const dynamic = "force-dynamic";

/**
 * The Jarvis hub renders instantly from the static capability registry
 * (lib/jarvis/hub-data.ts). The slow part — probing every site live — is
 * fetched lazily inside the Site Launch Tower tab via /api/v1/jarvis/hub,
 * so this page can never hang or render empty.
 */
export default function JarvisPage() {
  return <JarvisHub />;
}
