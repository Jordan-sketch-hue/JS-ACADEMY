import { Layers } from "lucide-react";
import { WebToolsetClient } from "@/components/web-toolset/web-toolset-client";

export const dynamic = "force-dynamic";

export default function WebToolsetPage() {
  return (
    <div className="space-y-6 pb-12">
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 text-muted-foreground">
          <Layers className="h-5 w-5" />
          <span className="text-xs font-medium uppercase tracking-[0.2em]">Design & Dev</span>
        </div>
        <h1 className="text-3xl font-semibold tracking-tight">Website Toolset</h1>
        <p className="text-muted-foreground">
          Visual design system reference, integration map, and curated resources — everything needed
          to ship consistent, on-brand work across sites, apps, social, client portals, and email.
        </p>
      </div>
      <WebToolsetClient />
    </div>
  );
}
