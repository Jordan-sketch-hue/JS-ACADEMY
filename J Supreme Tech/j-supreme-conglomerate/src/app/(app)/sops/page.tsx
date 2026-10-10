import { ClipboardCheck } from "lucide-react";
import { SopsClient } from "@/components/sops/sops-client";

export const dynamic = "force-dynamic";

export default function SopsPage() {
  return (
    <div className="space-y-6 pb-12">
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 text-muted-foreground">
          <ClipboardCheck className="h-5 w-5" />
          <span className="text-xs font-medium uppercase tracking-[0.2em]">Standard Operating Procedures</span>
        </div>
        <h1 className="text-3xl font-semibold tracking-tight">SOPs</h1>
        <p className="text-muted-foreground">
          Every recurring workflow — web builds, mobile apps, client onboarding, marketing, infra, and ops — in one searchable reference.
          Check off procedures as you go.
        </p>
      </div>
      <SopsClient />
    </div>
  );
}
