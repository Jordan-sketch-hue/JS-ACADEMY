import { AngelDashboard } from "@/components/jarvis/angel/angel-dashboard";

export const dynamic = "force-dynamic";

/**
 * Angel — the client-inbox triage dashboard. Access is gated by the (app) layout
 * + operator middleware; the dashboard fetches its data client-side from
 * /api/v1/jarvis/angel/inbox so the page itself can never hang.
 */
export default function AngelPage() {
  return <AngelDashboard />;
}
