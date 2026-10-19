import { redirect } from "next/navigation";
import { MessageSquare } from "lucide-react";
import { fetchSmsLogs } from "./actions";
import { SmsClient } from "@/components/sales/sms-client";

export const metadata = { title: "SMS Logs · Sales · J Supreme" };
export const dynamic = "force-dynamic";

export default async function SmsLogsPage() {
  let logs;
  try {
    logs = await fetchSmsLogs(200);
  } catch (e: any) {
    if (e?.message === "Unauthorized") redirect("/sign-in");
    throw e;
  }

  return (
    <div className="space-y-5 p-4 sm:p-6">
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-semibold tracking-tight">
          <MessageSquare className="h-6 w-6" /> SMS Logs
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Every text Kai sent after a call — delivery status and message body.
        </p>
      </div>

      <SmsClient logs={logs} />
    </div>
  );
}