import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Inbox, MessageSquare, Send, Target } from "lucide-react";
import type { OutreachMode, SalesBrand } from "@/lib/sales/types";
import type { BrandSummary } from "@/lib/sales/stats";
import { switchBrandFormAction } from "@/app/(app)/sales/actions";

const MODE_LABEL: Record<OutreachMode, string> = {
  b2b_cold: "B2B cold",
  b2c_optin: "B2C opt-in",
  both: "B2B + B2C",
};

/**
 * The multi-brand command center. One card per brand showing live status and
 * today's numbers; clicking a card switches the active brand (cookie) and lands
 * on its prospect list.
 */
export function SalesOverview({
  brands,
  summaries,
  activeSlug,
}: {
  brands: SalesBrand[];
  summaries: Record<string, BrandSummary>;
  activeSlug: string;
}) {
  const live = brands.filter((b) => b.sending_live).length;
  const totalSent = Object.values(summaries).reduce((a, s) => a + s.sentToday, 0);
  const totalReplies = Object.values(summaries).reduce((a, s) => a + s.replies, 0);
  const totalUnread = Object.values(summaries).reduce((a, s) => a + s.unread, 0);

  return (
    <section className="space-y-3">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Sales Department</h1>
          <p className="text-sm text-muted-foreground">
            {brands.length} brands · {live} live · {totalSent} sent today · {totalReplies} replies · {totalUnread} unread
          </p>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {brands.map((b) => {
          const sum = summaries[b.slug];
          const isActive = b.slug === activeSlug;
          return (
            <form key={b.slug} action={switchBrandFormAction}>
              <input type="hidden" name="slug" value={b.slug} />
              <input type="hidden" name="redirect" value="/sales/prospects" />
              <button type="submit" className="block w-full text-left">
                <Card
                  className="relative overflow-hidden p-4 transition hover:shadow-md"
                  style={{ borderLeft: `4px solid ${b.accent_color}` }}
                >
                  {isActive && (
                    <span className="absolute right-3 top-3 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                      Active
                    </span>
                  )}
                  <div className="flex items-center gap-2">
                    <span
                      className="inline-block h-3 w-3 shrink-0 rounded-full"
                      style={{ background: b.accent_color }}
                    />
                    <span className="font-semibold tracking-tight">{b.name}</span>
                  </div>
                  <div className="mt-2 flex flex-wrap items-center gap-1.5">
                    <Badge variant="secondary" className="text-[10px]">
                      {MODE_LABEL[b.mode]}
                    </Badge>
                    {b.sending_live ? (
                      <Badge className="bg-emerald-600 text-[10px] hover:bg-emerald-600">LIVE</Badge>
                    ) : (
                      <Badge variant="outline" className="text-[10px]">
                        Pending domain
                      </Badge>
                    )}
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Target className="h-3.5 w-3.5" /> {sum?.contactable ?? 0} in queue
                    </span>
                    <span className="flex items-center gap-1">
                      <Send className="h-3.5 w-3.5" /> {sum?.sentToday ?? 0} sent today
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageSquare className="h-3.5 w-3.5" /> {sum?.replies ?? 0} replies
                    </span>
                    <span className="flex items-center gap-1">
                      <Inbox className="h-3.5 w-3.5" /> {sum?.unread ?? 0} unread
                    </span>
                  </div>
                </Card>
              </button>
            </form>
          );
        })}
      </div>
    </section>
  );
}
