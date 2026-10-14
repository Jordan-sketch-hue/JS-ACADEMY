import { Phone } from "lucide-react";
import { fetchCallLogs } from "./actions";
import { CallsClient } from "@/components/sales/calls-client";

export const metadata = { title: "Call Logs · Sales · J Supreme" };
export const dynamic = "force-dynamic";

export default async function CallLogsPage() {
  const logs = await fetchCallLogs(100);

  return (
    <div className="space-y-5 p-4 sm:p-6">
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-semibold tracking-tight">
          <Phone className="h-6 w-6" /> Call Logs
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Review every call Alex made — AI summary, transcript, and one-click follow-up via WhatsApp, email, or SMS.
        </p>
      </div>

      <CallsClient logs={logs} />
    </div>
  );
}
