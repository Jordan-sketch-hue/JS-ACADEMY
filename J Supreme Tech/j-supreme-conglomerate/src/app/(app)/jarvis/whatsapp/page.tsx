import { WhatsappDashboard } from "@/components/jarvis/whatsapp/whatsapp-dashboard";

export const dynamic = "force-dynamic";

/**
 * WhatsApp reader — per-client update cards extracted from the WhatsApp Business
 * inbox by the Railway linked-device bot. Access is gated by the (app) layout +
 * operator middleware; data is fetched client-side from
 * /api/v1/jarvis/whatsapp/updates so the page itself can never hang.
 */
export default function WhatsappPage() {
  return <WhatsappDashboard />;
}
