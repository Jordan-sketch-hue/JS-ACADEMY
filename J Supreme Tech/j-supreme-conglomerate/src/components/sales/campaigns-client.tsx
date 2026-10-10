"use client";

import { useTransition } from "react";
import { Megaphone, Pause, Play } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { REGION_LABEL, SERVICE_LABEL, type Region, type SalesCampaign } from "@/lib/sales/types";
import { setCampaignStatusAction } from "@/app/(app)/sales/actions";

export function CampaignsClient({ campaigns }: { campaigns: SalesCampaign[] }) {
  const [pending, start] = useTransition();
  return (
    <div className="mx-auto max-w-4xl space-y-6 p-4 sm:p-6">
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-semibold tracking-tight">
          <Megaphone className="h-6 w-6" /> Campaigns
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          One outreach campaign per region. Pause any region instantly — paused campaigns stop
          sending but keep their prospects.
        </p>
      </div>

      <div className="space-y-2">
        {campaigns.length === 0 && (
          <Card className="p-8 text-center text-sm text-muted-foreground">
            Campaigns seed automatically on first load.
          </Card>
        )}
        {campaigns.map((c) => {
          const active = c.status === "active";
          return (
            <Card key={c.id} className="flex items-center justify-between gap-3 p-4">
              <div>
                <div className="flex items-center gap-2 font-medium">
                  {c.name}
                  <Badge variant={active ? "default" : "secondary"}>{c.status}</Badge>
                </div>
                <div className="mt-0.5 text-xs text-muted-foreground">
                  {c.region === "all" ? "All regions" : REGION_LABEL[c.region as Region]} ·{" "}
                  {SERVICE_LABEL[c.service_focus]} · up to {c.daily_cap}/day · {c.max_steps}-step
                  sequence ({c.followup_days}-day gaps)
                </div>
              </div>
              <Button
                size="sm"
                variant={active ? "outline" : "default"}
                disabled={pending}
                onClick={() =>
                  start(() =>
                    setCampaignStatusAction(c.id, active ? "paused" : "active").then(() => {}),
                  )
                }
              >
                {active ? (
                  <>
                    <Pause className="mr-1.5 h-4 w-4" /> Pause
                  </>
                ) : (
                  <>
                    <Play className="mr-1.5 h-4 w-4" /> Activate
                  </>
                )}
              </Button>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
