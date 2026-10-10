import { MessagesSquare } from "lucide-react";
import { ScriptsClient } from "@/components/scripts/scripts-client";

export const dynamic = "force-dynamic";

const FLOW = [
  "Ad / slide-up",
  "First reply",
  "Qualify",
  "Free mockup",
  "Pricing",
  "Close",
  "Follow-up",
];

export default function ScriptsPage() {
  return (
    <div className="space-y-6 pb-12">
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 text-muted-foreground">
          <MessagesSquare className="h-5 w-5" />
          <span className="text-xs font-medium uppercase tracking-[0.2em]">Sales & Lead Intake</span>
        </div>
        <h1 className="text-3xl font-semibold tracking-tight">Scripts</h1>
        <p className="max-w-2xl text-muted-foreground">
          Copy-paste replies for turning ad responses into booked clients. Someone slides up on the
          story asking for more info — open this, grab the right line, capture the lead. Every quote
          matches the live JST checkout. Tap <span className="font-medium text-foreground">Copy</span>,
          swap the <span className="font-medium text-foreground">[brackets]</span>, send.
        </p>
      </div>

      {/* Funnel flow strip */}
      <div className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
        {FLOW.map((step, i) => (
          <span key={step} className="flex items-center gap-1.5">
            <span className="rounded-full border border-border/60 bg-muted/30 px-2.5 py-1 font-medium text-foreground/80">
              {step}
            </span>
            {i < FLOW.length - 1 && <span className="opacity-40">→</span>}
          </span>
        ))}
      </div>

      <ScriptsClient />
    </div>
  );
}
