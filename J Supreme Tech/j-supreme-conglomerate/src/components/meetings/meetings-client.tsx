"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import {
  CalendarClock,
  CalendarPlus,
  Check,
  Copy,
  Download,
  Mail,
  MapPin,
  Pencil,
  Phone,
  Plus,
  RotateCcw,
  Trash2,
  Video,
  X,
  type LucideIcon,
} from "lucide-react";
import type {
  Meeting,
  MeetingInput,
  MeetingStatus,
  MeetingType,
} from "@/lib/data/meetings";
import {
  buildICS,
  googleCalendarUrl,
  icsFileName,
  mailtoInvite,
  MEETING_TYPE_META,
} from "@/lib/meetings/invite";
import {
  createLocalMeeting,
  loadLocalMeetings,
  removeLocalMeeting,
  updateLocalMeeting,
} from "@/lib/meetings/local-store";
import {
  createMeetingAction,
  deleteMeetingAction,
  setMeetingStatusAction,
  updateMeetingAction,
} from "@/app/(app)/meetings/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { CountSummary } from "@/components/shared/count-summary";
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

type ClientOption = { id: string; name: string; email: string | null };

type Props = {
  ownerId: string;
  persistLocally: boolean;
  initialMeetings: Meeting[];
  clients: ClientOption[];
};

const TYPE_ICON: Record<MeetingType, LucideIcon> = {
  call: Phone,
  zoom: Video,
  meet: Video,
  in_person: MapPin,
};

const TYPE_ACCENT: Record<MeetingType, string> = {
  call: "from-emerald-500 to-teal-600",
  zoom: "from-sky-500 to-blue-600",
  meet: "from-violet-500 to-indigo-600",
  in_person: "from-amber-500 to-orange-600",
};

const STATUS_BADGE: Record<MeetingStatus, { label: string; className: string }> = {
  scheduled: { label: "Scheduled", className: "" },
  completed: {
    label: "Completed",
    className: "border-emerald-500/40 text-emerald-600 dark:text-emerald-300",
  },
  canceled: {
    label: "Canceled",
    className: "border-rose-500/40 text-rose-600 line-through dark:text-rose-300",
  },
};

const DURATIONS = [15, 30, 45, 60, 90, 120];

type FormState = {
  id: string | null;
  title: string;
  meeting_type: MeetingType;
  startLocal: string;
  duration_min: number;
  client_id: string;
  client_name: string;
  client_email: string;
  location: string;
  notes: string;
};

function toLocalInput(isoOrNow: string): string {
  const d = new Date(isoOrNow);
  const local = new Date(d.getTime() - d.getTimezoneOffset() * 60_000);
  return local.toISOString().slice(0, 16);
}

function defaultStartLocal(): string {
  const d = new Date();
  d.setMinutes(0, 0, 0);
  d.setHours(d.getHours() + 1);
  return toLocalInput(d.toISOString());
}

function emptyForm(): FormState {
  return {
    id: null,
    title: "",
    meeting_type: "call",
    startLocal: defaultStartLocal(),
    duration_min: 30,
    client_id: "",
    client_name: "",
    client_email: "",
    location: "",
    notes: "",
  };
}

function formFromMeeting(m: Meeting): FormState {
  return {
    id: m.id,
    title: m.title,
    meeting_type: m.meeting_type,
    startLocal: toLocalInput(m.starts_at),
    duration_min: m.duration_min,
    client_id: m.client_id ?? "",
    client_name: m.client_name ?? "",
    client_email: m.client_email ?? "",
    location: m.location ?? "",
    notes: m.notes ?? "",
  };
}

function isLink(s: string | null): boolean {
  return !!s && /^https?:\/\//i.test(s);
}

function formatWhen(iso: string): string {
  return new Date(iso).toLocaleString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function MeetingsClient({
  ownerId,
  persistLocally,
  initialMeetings,
  clients,
}: Props) {
  const [meetings, setMeetings] = useState<Meeting[]>(initialMeetings);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [error, setError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  // In browser-only mode the server has no durable store, so hydrate from localStorage.
  useEffect(() => {
    if (persistLocally) setMeetings(loadLocalMeetings(ownerId));
  }, [persistLocally, ownerId]);

  const now = Date.now();

  const { upcoming, past } = useMemo(() => {
    const up: Meeting[] = [];
    const pa: Meeting[] = [];
    for (const m of meetings) {
      const end = new Date(m.starts_at).getTime() + m.duration_min * 60_000;
      if (m.status === "scheduled" && end >= now) up.push(m);
      else pa.push(m);
    }
    up.sort((a, b) => a.starts_at.localeCompare(b.starts_at));
    pa.sort((a, b) => b.starts_at.localeCompare(a.starts_at));
    return { upcoming: up, past: pa };
  }, [meetings, now]);

  const weekCount = useMemo(() => {
    const end = now + 7 * 24 * 60 * 60 * 1000;
    return upcoming.filter((m) => {
      const t = new Date(m.starts_at).getTime();
      return t >= now && t <= end;
    }).length;
  }, [upcoming, now]);

  function upsertLocalState(m: Meeting) {
    setMeetings((prev) => {
      const idx = prev.findIndex((x) => x.id === m.id);
      if (idx === -1) return [...prev, m];
      const next = prev.slice();
      next[idx] = m;
      return next;
    });
  }

  function openCreate() {
    setForm(emptyForm());
    setError(null);
    setOpen(true);
  }

  function openEdit(m: Meeting) {
    setForm(formFromMeeting(m));
    setError(null);
    setOpen(true);
  }

  function pickClient(value: string) {
    if (value === "none") {
      setForm((f) => ({ ...f, client_id: "" }));
      return;
    }
    const c = clients.find((x) => x.id === value);
    setForm((f) => ({
      ...f,
      client_id: value,
      client_name: c?.name ?? f.client_name,
      client_email: c?.email ?? f.client_email,
    }));
  }

  function submit() {
    setError(null);
    if (!form.startLocal) {
      setError("Pick a date and time.");
      return;
    }
    const input: MeetingInput = {
      title: form.title,
      meeting_type: form.meeting_type,
      starts_at: new Date(form.startLocal).toISOString(),
      duration_min: form.duration_min,
      client_id: form.client_id || null,
      client_name: form.client_name,
      client_email: form.client_email,
      location: form.location,
      notes: form.notes,
    };

    startTransition(async () => {
      if (persistLocally) {
        const m = form.id
          ? updateLocalMeeting(ownerId, form.id, input)
          : createLocalMeeting(ownerId, input);
        if (!m) {
          setError("Could not save the meeting on this device.");
          return;
        }
        upsertLocalState(m);
        setOpen(false);
        return;
      }
      const res = form.id
        ? await updateMeetingAction(form.id, input)
        : await createMeetingAction(input);
      if (!res.ok) {
        setError(res.error);
        return;
      }
      upsertLocalState(res.meeting);
      setOpen(false);
    });
  }

  function changeStatus(m: Meeting, status: MeetingStatus) {
    startTransition(async () => {
      if (persistLocally) {
        const updated = updateLocalMeeting(ownerId, m.id, { status });
        if (updated) upsertLocalState(updated);
        return;
      }
      const res = await setMeetingStatusAction(m.id, status);
      if (res.ok) upsertLocalState(res.meeting);
      else setError(res.error);
    });
  }

  function remove(m: Meeting) {
    if (!window.confirm(`Delete "${m.title}"? This cannot be undone.`)) return;
    startTransition(async () => {
      if (persistLocally) {
        if (removeLocalMeeting(ownerId, m.id)) {
          setMeetings((prev) => prev.filter((x) => x.id !== m.id));
        }
        return;
      }
      const res = await deleteMeetingAction(m.id);
      if (res.ok) setMeetings((prev) => prev.filter((x) => x.id !== m.id));
      else setError(res.error);
    });
  }

  function downloadIcs(m: Meeting) {
    const blob = new Blob([buildICS(m)], {
      type: "text/calendar;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = icsFileName(m);
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  async function copyJoin(m: Meeting) {
    if (!m.location) return;
    try {
      await navigator.clipboard.writeText(m.location);
      setCopiedId(m.id);
      setTimeout(() => setCopiedId((c) => (c === m.id ? null : c)), 1500);
    } catch {
      /* clipboard blocked — ignore */
    }
  }

  const typeMeta = MEETING_TYPE_META[form.meeting_type];

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-4 sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-semibold tracking-tight">
            <CalendarClock className="h-6 w-6 text-primary" />
            Client meetings
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Schedule phone calls, Zoom &amp; Meet links, or in-person sessions —
            then send a calendar invite in one click.
          </p>
        </div>
        <Button onClick={openCreate} className="gap-2 self-start sm:self-auto">
          <Plus className="h-4 w-4" />
          Schedule meeting
        </Button>
      </div>

      <CountSummary
        items={[
          { label: "upcoming", value: upcoming.length, emphasis: true },
          { label: "next 7 days", value: weekCount },
          { label: "total", value: meetings.length },
        ]}
      />

      {error && (
        <div className="flex items-start justify-between gap-3 rounded-lg border border-rose-500/40 bg-rose-500/10 px-3 py-2 text-sm text-rose-700 dark:text-rose-300">
          <span>{error}</span>
          <button onClick={() => setError(null)} aria-label="Dismiss">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      <section className="space-y-3">
        <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground/70">
          Upcoming
        </h2>
        {upcoming.length === 0 ? (
          <Card className="border-dashed bg-card/40">
            <CardContent className="flex flex-col items-center gap-3 py-10 text-center">
              <CalendarClock className="h-8 w-8 text-muted-foreground/50" />
              <p className="text-sm text-muted-foreground">
                No upcoming meetings. Schedule your first booking to send an
                invite.
              </p>
              <Button variant="outline" onClick={openCreate} className="gap-2">
                <Plus className="h-4 w-4" />
                Schedule meeting
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-3">
            {upcoming.map((m) => (
              <MeetingRow
                key={m.id}
                meeting={m}
                copied={copiedId === m.id}
                pending={isPending}
                onEdit={() => openEdit(m)}
                onStatus={(s) => changeStatus(m, s)}
                onDelete={() => remove(m)}
                onIcs={() => downloadIcs(m)}
                onCopy={() => copyJoin(m)}
              />
            ))}
          </div>
        )}
      </section>

      {past.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground/70">
            Past &amp; archived
          </h2>
          <div className="grid gap-3">
            {past.map((m) => (
              <MeetingRow
                key={m.id}
                meeting={m}
                copied={copiedId === m.id}
                pending={isPending}
                muted
                onEdit={() => openEdit(m)}
                onStatus={(s) => changeStatus(m, s)}
                onDelete={() => remove(m)}
                onIcs={() => downloadIcs(m)}
                onCopy={() => copyJoin(m)}
              />
            ))}
          </div>
        </section>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {form.id ? "Edit meeting" : "Schedule meeting"}
            </DialogTitle>
            <DialogDescription>
              {persistLocally
                ? "Saved to this browser until Supabase is connected."
                : "Saved to your workspace database."}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-2">
            <div className="grid gap-2">
              <Label htmlFor="m-title">Title</Label>
              <Input
                id="m-title"
                value={form.title}
                placeholder="Discovery call · website mockup"
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-2">
                <Label>Type</Label>
                <Select
                  value={form.meeting_type}
                  onValueChange={(v) =>
                    setForm((f) => ({ ...f, meeting_type: v as MeetingType }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {(Object.keys(MEETING_TYPE_META) as MeetingType[]).map((t) => (
                      <SelectItem key={t} value={t}>
                        {MEETING_TYPE_META[t].label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>Duration</Label>
                <Select
                  value={String(form.duration_min)}
                  onValueChange={(v) =>
                    setForm((f) => ({ ...f, duration_min: Number(v) }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {DURATIONS.map((d) => (
                      <SelectItem key={d} value={String(d)}>
                        {d} min
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="m-start">Date &amp; time</Label>
              <Input
                id="m-start"
                type="datetime-local"
                value={form.startLocal}
                onChange={(e) =>
                  setForm((f) => ({ ...f, startLocal: e.target.value }))
                }
              />
            </div>

            {clients.length > 0 && (
              <div className="grid gap-2">
                <Label>Link to CRM client (optional)</Label>
                <Select
                  value={form.client_id || "none"}
                  onValueChange={pickClient}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="None" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    {clients.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-2">
                <Label htmlFor="m-name">Client / attendee</Label>
                <Input
                  id="m-name"
                  value={form.client_name}
                  placeholder="Jane Doe"
                  onChange={(e) =>
                    setForm((f) => ({ ...f, client_name: e.target.value }))
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="m-email">Email</Label>
                <Input
                  id="m-email"
                  type="email"
                  value={form.client_email}
                  placeholder="jane@email.com"
                  onChange={(e) =>
                    setForm((f) => ({ ...f, client_email: e.target.value }))
                  }
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="m-location">{typeMeta.locationLabel}</Label>
              <Input
                id="m-location"
                value={form.location}
                placeholder={typeMeta.locationHint}
                onChange={(e) =>
                  setForm((f) => ({ ...f, location: e.target.value }))
                }
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="m-notes">Notes (optional)</Label>
              <Textarea
                id="m-notes"
                value={form.notes}
                rows={3}
                placeholder="Agenda, prep, links…"
                onChange={(e) =>
                  setForm((f) => ({ ...f, notes: e.target.value }))
                }
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={submit} disabled={isPending} className="gap-2">
              {form.id ? "Save changes" : "Schedule"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

type RowProps = {
  meeting: Meeting;
  copied: boolean;
  pending: boolean;
  muted?: boolean;
  onEdit: () => void;
  onStatus: (s: MeetingStatus) => void;
  onDelete: () => void;
  onIcs: () => void;
  onCopy: () => void;
};

function MeetingRow({
  meeting: m,
  copied,
  pending,
  muted,
  onEdit,
  onStatus,
  onDelete,
  onIcs,
  onCopy,
}: RowProps) {
  const meta = MEETING_TYPE_META[m.meeting_type];
  const Icon = TYPE_ICON[m.meeting_type];
  const status = STATUS_BADGE[m.status];

  return (
    <Card className={cn("bg-card/50", muted && "opacity-80")}>
      <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-start">
        <div
          className={cn(
            "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-white shadow-sm",
            TYPE_ACCENT[m.meeting_type],
          )}
        >
          <Icon className="h-5 w-5" />
        </div>

        <div className="min-w-0 flex-1 space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-medium leading-tight">{m.title}</p>
            <Badge variant="outline" className="text-[10px]">
              {meta.short}
            </Badge>
            {m.status !== "scheduled" && (
              <Badge variant="outline" className={cn("text-[10px]", status.className)}>
                {status.label}
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground">
            {formatWhen(m.starts_at)} · {m.duration_min} min
          </p>
          {(m.client_name || m.client_email) && (
            <p className="truncate text-xs text-muted-foreground">
              {[m.client_name, m.client_email].filter(Boolean).join(" · ")}
            </p>
          )}
          {m.location && (
            <p className="truncate text-xs">
              <span className="text-muted-foreground">{meta.locationLabel}: </span>
              {isLink(m.location) ? (
                <a
                  href={m.location}
                  target="_blank"
                  rel="noreferrer"
                  className="text-primary underline-offset-2 hover:underline"
                >
                  {m.location}
                </a>
              ) : (
                <span className="text-foreground/90">{m.location}</span>
              )}
            </p>
          )}
          {m.notes && (
            <p className="line-clamp-2 text-xs text-muted-foreground/90">{m.notes}</p>
          )}

          <div className="flex flex-wrap items-center gap-1.5 pt-2">
            <Button
              size="sm"
              variant="secondary"
              className="h-7 gap-1.5 text-xs"
              asChild
            >
              <a href={mailtoInvite(m)}>
                <Mail className="h-3.5 w-3.5" />
                Send invite
              </a>
            </Button>
            <Button size="sm" variant="ghost" className="h-7 gap-1.5 text-xs" asChild>
              <a href={googleCalendarUrl(m)} target="_blank" rel="noreferrer">
                <CalendarPlus className="h-3.5 w-3.5" />
                Google
              </a>
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="h-7 gap-1.5 text-xs"
              onClick={onIcs}
            >
              <Download className="h-3.5 w-3.5" />
              .ics
            </Button>
            {m.location && (
              <Button
                size="sm"
                variant="ghost"
                className="h-7 gap-1.5 text-xs"
                onClick={onCopy}
              >
                {copied ? (
                  <Check className="h-3.5 w-3.5 text-emerald-500" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )}
                {copied ? "Copied" : "Copy link"}
              </Button>
            )}
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-1 self-start">
          {m.status === "scheduled" ? (
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 text-emerald-600 dark:text-emerald-400"
              title="Mark completed"
              disabled={pending}
              onClick={() => onStatus("completed")}
            >
              <Check className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8"
              title="Reopen (mark scheduled)"
              disabled={pending}
              onClick={() => onStatus("scheduled")}
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          )}
          {m.status !== "canceled" && (
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 text-rose-500"
              title="Cancel meeting"
              disabled={pending}
              onClick={() => onStatus("canceled")}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8"
            title="Edit"
            onClick={onEdit}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8 text-muted-foreground hover:text-rose-500"
            title="Delete"
            disabled={pending}
            onClick={onDelete}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
