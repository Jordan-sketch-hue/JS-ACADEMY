"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, CalendarCheck, CalendarPlus, Clock, Globe } from "lucide-react";
import type { OpenDay } from "@/lib/booking/slots";
import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type Props = {
  enabled: boolean;
  title: string;
  description: string | null;
  timezone: string;
  durationMin: number;
  typeLabel: string;
  days: OpenDay[];
};

type Result = { googleUrl: string; whenLabel: string };

export function BookingPublic({
  enabled,
  title,
  description,
  timezone,
  durationMin,
  typeLabel,
  days,
}: Props) {
  const router = useRouter();
  const [dayIdx, setDayIdx] = useState(0);
  const [slotIso, setSlotIso] = useState<string | null>(null);
  const [slotLabel, setSlotLabel] = useState<string>("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<Result | null>(null);

  const day = days[dayIdx];
  const hasSlots = enabled && days.length > 0;

  function pickSlot(iso: string, label: string) {
    setSlotIso(iso);
    setSlotLabel(`${day.label}, ${label}`);
    setError(null);
  }

  async function submit() {
    if (!slotIso) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ startIso: slotIso, name, email, notes }),
      });
      const data = await res.json();
      if (data.ok) {
        setResult({ googleUrl: data.googleUrl, whenLabel: slotLabel });
      } else {
        setError(data.error || "Could not complete the booking.");
        if (/no longer available/i.test(data.error || "")) {
          router.refresh();
          setSlotIso(null);
        }
      }
    } catch {
      setError("Network error — please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex min-h-svh items-center justify-center bg-muted/30 p-4">
      <div className="w-full max-w-md">
        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
          {/* Brand header */}
          <div className="flex items-center gap-3 border-b border-border bg-foreground px-5 py-4 text-background">
            <Logo className="h-8 w-8 shrink-0" />
            <div className="leading-tight">
              <div className="text-[10px] font-medium uppercase tracking-[0.2em] opacity-60">
                J Supreme Conglomerate
              </div>
              <div className="text-sm font-semibold">{title}</div>
            </div>
          </div>

          <div className="p-5">
            {result ? (
              <div className="space-y-4 py-4 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                  <CalendarCheck className="h-7 w-7" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold">You&apos;re booked!</h2>
                  <p className="mt-1 text-sm text-muted-foreground">{result.whenLabel}</p>
                </div>
                <p className="text-sm text-muted-foreground">
                  A confirmation + calendar invite is on its way to{" "}
                  <span className="font-medium text-foreground">{email}</span>.
                </p>
                <Button asChild className="w-full gap-2">
                  <a href={result.googleUrl} target="_blank" rel="noreferrer">
                    <CalendarPlus className="h-4 w-4" />
                    Add to Google Calendar
                  </a>
                </Button>
              </div>
            ) : !hasSlots ? (
              <div className="space-y-2 py-8 text-center">
                <Clock className="mx-auto h-8 w-8 text-muted-foreground/50" />
                <p className="text-sm text-muted-foreground">
                  {enabled
                    ? "No open times right now. Please check back soon."
                    : "Online booking is currently closed."}
                </p>
              </div>
            ) : slotIso ? (
              /* Confirm step */
              <div className="space-y-4">
                <button
                  onClick={() => setSlotIso(null)}
                  className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  Back to times
                </button>
                <div className="rounded-lg border border-border bg-muted/40 p-3 text-sm">
                  <div className="font-medium">{slotLabel}</div>
                  <div className="text-xs text-muted-foreground">
                    {durationMin}-min {typeLabel.toLowerCase()} · {timezone}
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="bk-name">Your name</Label>
                  <Input id="bk-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Jane Doe" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="bk-email">Email</Label>
                  <Input id="bk-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="jane@email.com" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="bk-notes">Anything we should know? (optional)</Label>
                  <Textarea id="bk-notes" rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} />
                </div>
                {error && <p className="text-sm text-rose-500">{error}</p>}
                <Button onClick={submit} disabled={busy || !name.trim() || !email.trim()} className="w-full">
                  {busy ? "Booking…" : "Confirm booking"}
                </Button>
              </div>
            ) : (
              /* Pick step */
              <div className="space-y-4">
                <p className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
                  <Clock className="h-3.5 w-3.5" />
                  {durationMin}-min {typeLabel.toLowerCase()}
                  <span className="mx-1">·</span>
                  <Globe className="h-3.5 w-3.5" />
                  {timezone}
                </p>
                {description && (
                  <p className="text-center text-sm text-muted-foreground">{description}</p>
                )}

                {/* Day selector */}
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {days.map((d, i) => (
                    <button
                      key={d.date}
                      onClick={() => setDayIdx(i)}
                      className={cn(
                        "shrink-0 rounded-lg border px-3 py-2 text-center text-xs transition-colors",
                        i === dayIdx
                          ? "border-primary bg-primary/10 font-medium text-primary"
                          : "border-border text-muted-foreground hover:bg-muted/50",
                      )}
                    >
                      <div>{d.label.split(",")[0]}</div>
                      <div className="text-[11px] opacity-80">{d.label.split(",")[1]}</div>
                      <div className="mt-0.5 text-[10px] opacity-70">{d.slots.length} open</div>
                    </button>
                  ))}
                </div>

                {/* Slots */}
                <div className="grid max-h-72 grid-cols-3 gap-2 overflow-y-auto">
                  {day?.slots.map((s) => (
                    <button
                      key={s.iso}
                      onClick={() => pickSlot(s.iso, s.label)}
                      className="rounded-lg border border-border py-2 text-sm transition-colors hover:border-primary hover:bg-primary/5"
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        <p className="mt-3 text-center text-[11px] text-muted-foreground">
          Powered by J Supreme Conglomerate
        </p>
      </div>
    </div>
  );
}
