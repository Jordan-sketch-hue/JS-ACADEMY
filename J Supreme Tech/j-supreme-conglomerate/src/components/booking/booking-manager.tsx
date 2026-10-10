"use client";

import { useState, useTransition } from "react";
import { Check, Copy, Link2, Pencil, Power, ExternalLink } from "lucide-react";
import type { BookingSettings } from "@/lib/booking/slots";
import { WEEKDAYS } from "@/lib/booking/slots";
import type { MeetingType } from "@/lib/data/meetings";
import { MEETING_TYPE_META } from "@/lib/meetings/invite";
import { saveBookingSettingsAction } from "@/app/(app)/meetings/booking-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

type DayState = { enabled: boolean; start: string; end: string };
const DURATIONS = [15, 30, 45, 60, 90];
const TZ_OPTIONS = [
  "America/Jamaica",
  "America/New_York",
  "America/Chicago",
  "America/Los_Angeles",
  "America/Toronto",
  "Europe/London",
];

function daysFromSettings(s: BookingSettings): DayState[] {
  const out: DayState[] = Array.from({ length: 7 }, () => ({
    enabled: false,
    start: "09:00",
    end: "17:00",
  }));
  for (const r of s.availability) {
    if (r.day >= 0 && r.day <= 6) out[r.day] = { enabled: true, start: r.start, end: r.end };
  }
  return out;
}

export function BookingManager({
  publicUrl,
  initialSettings,
}: {
  publicUrl: string;
  initialSettings: BookingSettings;
}) {
  const [settings, setSettings] = useState(initialSettings);
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  // editable form state (hydrated when dialog opens)
  const [form, setForm] = useState(() => ({
    title: settings.title,
    description: settings.description ?? "",
    timezone: settings.timezone,
    duration_min: settings.duration_min,
    meeting_type: settings.meeting_type,
    location: settings.location ?? "",
    advance_days: settings.advance_days,
    min_notice_hours: settings.min_notice_hours,
    days: daysFromSettings(settings),
  }));

  function openEditor() {
    setForm({
      title: settings.title,
      description: settings.description ?? "",
      timezone: settings.timezone,
      duration_min: settings.duration_min,
      meeting_type: settings.meeting_type,
      location: settings.location ?? "",
      advance_days: settings.advance_days,
      min_notice_hours: settings.min_notice_hours,
      days: daysFromSettings(settings),
    });
    setError(null);
    setOpen(true);
  }

  function copyLink() {
    navigator.clipboard.writeText(publicUrl).then(
      () => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      },
      () => {},
    );
  }

  function toggleEnabled() {
    setError(null);
    startTransition(async () => {
      const res = await saveBookingSettingsAction({ enabled: !settings.enabled });
      if (res.ok) setSettings(res.settings);
      else setError(res.error);
    });
  }

  function setDay(i: number, patch: Partial<DayState>) {
    setForm((f) => {
      const days = f.days.slice();
      days[i] = { ...days[i], ...patch };
      return { ...f, days };
    });
  }

  function save() {
    setError(null);
    const availability = form.days
      .map((d, i) => ({ day: i, start: d.start, end: d.end, enabled: d.enabled }))
      .filter((d) => d.enabled && d.start < d.end)
      .map(({ day, start, end }) => ({ day, start, end }));

    startTransition(async () => {
      const res = await saveBookingSettingsAction({
        title: form.title,
        description: form.description,
        timezone: form.timezone,
        duration_min: form.duration_min,
        meeting_type: form.meeting_type,
        location: form.location,
        advance_days: form.advance_days,
        min_notice_hours: form.min_notice_hours,
        availability,
      });
      if (res.ok) {
        setSettings(res.settings);
        setOpen(false);
      } else {
        setError(res.error);
      }
    });
  }

  const activeDays = settings.availability.length;

  return (
    <Card className="border-primary/20 bg-primary/[0.03]">
      <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0 space-y-1.5">
          <div className="flex items-center gap-2">
            <Link2 className="h-4 w-4 text-primary" />
            <span className="text-sm font-semibold">Public booking link</span>
            <Badge
              variant="outline"
              className={cn(
                "text-[10px]",
                settings.enabled
                  ? "border-emerald-500/40 text-emerald-600 dark:text-emerald-300"
                  : "border-muted-foreground/40 text-muted-foreground",
              )}
            >
              {settings.enabled ? "Live" : "Off"}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <code className="truncate rounded bg-muted px-2 py-1 text-xs">{publicUrl}</code>
            <Button size="icon" variant="ghost" className="h-7 w-7 shrink-0" onClick={copyLink} title="Copy link">
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
            </Button>
            <Button size="icon" variant="ghost" className="h-7 w-7 shrink-0" asChild title="Open">
              <a href={publicUrl} target="_blank" rel="noreferrer">
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            {activeDays > 0
              ? `${activeDays} day${activeDays === 1 ? "" : "s"}/week open · ${settings.duration_min}-min ${MEETING_TYPE_META[settings.meeting_type].label.toLowerCase()} · ${settings.timezone}`
              : "No availability set yet — edit to open slots."}
          </p>
          {error && <p className="text-xs text-rose-500">{error}</p>}
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <Button variant="outline" size="sm" className="gap-1.5" onClick={toggleEnabled} disabled={isPending}>
            <Power className="h-3.5 w-3.5" />
            {settings.enabled ? "Turn off" : "Turn on"}
          </Button>
          <Button size="sm" className="gap-1.5" onClick={openEditor}>
            <Pencil className="h-3.5 w-3.5" />
            Edit availability
          </Button>
        </div>
      </CardContent>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Booking availability</DialogTitle>
            <DialogDescription>
              Control what clients see at your public booking link.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-2">
            <div className="grid gap-2">
              <Label htmlFor="b-title">Page title</Label>
              <Input id="b-title" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="b-desc">Description</Label>
              <Textarea id="b-desc" rows={2} value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-2">
                <Label>Meeting type</Label>
                <Select value={form.meeting_type} onValueChange={(v) => setForm((f) => ({ ...f, meeting_type: v as MeetingType }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {(Object.keys(MEETING_TYPE_META) as MeetingType[]).map((t) => (
                      <SelectItem key={t} value={t}>{MEETING_TYPE_META[t].label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>Slot length</Label>
                <Select value={String(form.duration_min)} onValueChange={(v) => setForm((f) => ({ ...f, duration_min: Number(v) }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {DURATIONS.map((d) => <SelectItem key={d} value={String(d)}>{d} min</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="b-loc">{MEETING_TYPE_META[form.meeting_type].locationLabel} (shown after booking)</Label>
              <Input id="b-loc" value={form.location} placeholder={MEETING_TYPE_META[form.meeting_type].locationHint} onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))} />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-2">
                <Label>Timezone</Label>
                <Select value={form.timezone} onValueChange={(v) => setForm((f) => ({ ...f, timezone: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {TZ_OPTIONS.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="grid gap-2">
                  <Label htmlFor="b-adv">Book ahead</Label>
                  <Input id="b-adv" type="number" min={1} max={120} value={form.advance_days} onChange={(e) => setForm((f) => ({ ...f, advance_days: Number(e.target.value) }))} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="b-notice">Notice (h)</Label>
                  <Input id="b-notice" type="number" min={0} max={720} value={form.min_notice_hours} onChange={(e) => setForm((f) => ({ ...f, min_notice_hours: Number(e.target.value) }))} />
                </div>
              </div>
            </div>

            <div className="grid gap-2">
              <Label>Weekly hours</Label>
              <div className="space-y-1.5">
                {form.days.map((d, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <label className="flex w-20 shrink-0 cursor-pointer items-center gap-2">
                      <input type="checkbox" checked={d.enabled} onChange={(e) => setDay(i, { enabled: e.target.checked })} className="h-4 w-4 accent-primary" />
                      <span className="text-sm">{WEEKDAYS[i]}</span>
                    </label>
                    <Input type="time" value={d.start} disabled={!d.enabled} onChange={(e) => setDay(i, { start: e.target.value })} className="h-8" />
                    <span className="text-muted-foreground">–</span>
                    <Input type="time" value={d.end} disabled={!d.enabled} onChange={(e) => setDay(i, { end: e.target.value })} className="h-8" />
                  </div>
                ))}
              </div>
            </div>

            {error && (
              <p className="rounded-md border border-rose-500/40 bg-rose-500/10 px-3 py-2 text-sm text-rose-600 dark:text-rose-300">
                {error}
              </p>
            )}
          </div>

          <DialogFooter>
            <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={save} disabled={isPending}>Save availability</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
