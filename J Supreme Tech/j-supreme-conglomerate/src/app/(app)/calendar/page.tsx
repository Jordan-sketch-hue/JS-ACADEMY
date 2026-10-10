import { CalendarDays, ExternalLink } from "lucide-react";
import { EconomicCalendar } from "@/components/markets/economic-calendar";

export const metadata = { title: "Economic Calendar · J Supreme Conglomerate" };

export default function EconomicCalendarPage() {
  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 text-muted-foreground">
            <CalendarDays className="h-5 w-5" />
            <span className="text-xs font-medium uppercase tracking-[0.2em]">Markets · Calendar</span>
          </div>
          <h1 className="text-3xl font-semibold tracking-tight">Economic Calendar</h1>
          <p className="max-w-2xl text-muted-foreground">
            High-impact forex and macro events — actual, forecast and previous, in real time. Filtered to
            the major economies that move the markets you trade.
          </p>
        </div>
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <a
            href="https://www.myfxbook.com/forex-economic-calendar"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 rounded-full border border-border px-3 py-1 transition-colors hover:bg-muted/50 hover:text-foreground"
          >
            Myfxbook <ExternalLink className="h-3 w-3" />
          </a>
          <a
            href="https://www.forexfactory.com/calendar"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 rounded-full border border-border px-3 py-1 transition-colors hover:bg-muted/50 hover:text-foreground"
          >
            Forex Factory <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-border/70 bg-card/60 p-1">
        <EconomicCalendar height={760} />
      </div>

      <p className="text-xs leading-relaxed text-muted-foreground/60">
        Calendar data is provided by TradingView and is for informational and educational purposes only —
        not financial advice. Forex Factory and Myfxbook block third-party embedding, so their calendars
        are linked above for cross-reference.
      </p>
    </div>
  );
}
