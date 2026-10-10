import { Newspaper } from "lucide-react";
import { DailyBriefClient } from "@/components/daily-brief/daily-brief-client";

export const dynamic = "force-dynamic";

export default function DailyBriefPage() {
  return (
    <div className="space-y-6 pb-12">
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 text-muted-foreground">
          <Newspaper className="h-5 w-5" />
          <span className="text-xs font-medium uppercase tracking-[0.2em]">Morning brief</span>
        </div>
        <h1 className="text-3xl font-semibold tracking-tight">Daily Brief</h1>
        <p className="text-muted-foreground">
          Your morning operations checklist, standing gotchas, quick navigation, and curated reads —
          plus a one-click email send to keep you in the loop anywhere.
        </p>
      </div>
      <DailyBriefClient />
    </div>
  );
}
