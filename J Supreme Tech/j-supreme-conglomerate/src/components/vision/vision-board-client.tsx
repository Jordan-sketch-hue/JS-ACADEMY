"use client";

import { useEffect, useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
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
import {
  HORIZON_LABELS,
  STATUS_LABELS,
  VISION_HORIZON_VALUES,
  VISION_PILLARS,
  VISION_STATUS_VALUES,
  computeVisionStats,
  sortVisions,
  type VisionHorizon,
  type VisionInput,
  type VisionItem,
  type VisionStatus,
} from "@/lib/vision/types";
import {
  createLocalVision,
  loadLocalVisions,
  removeLocalVision,
  updateLocalVision,
} from "@/lib/vision/local-store";
import {
  createVisionAction,
  deleteVisionAction,
  updateVisionAction,
} from "@/app/(app)/vision/actions";
import {
  Boxes,
  Compass,
  Crown,
  Globe2,
  Heart,
  Minus,
  Pencil,
  Pin,
  PinOff,
  Plus,
  Rocket,
  Sparkles,
  Target,
  Trash2,
  Trophy,
  Users,
  Wallet,
  type LucideIcon,
} from "lucide-react";

const PILLAR_ICON: Record<string, LucideIcon> = {
  "Empire & Revenue": Crown,
  "Products & Platforms": Boxes,
  "Brand & Reach": Globe2,
  "Team & Culture": Users,
  "Wealth & Freedom": Wallet,
  "Legacy & Impact": Heart,
};

const STATUS_ICON: Record<VisionStatus, LucideIcon> = {
  vision: Sparkles,
  active: Rocket,
  achieved: Trophy,
};

const EMPTY_FORM = {
  title: "",
  description: "",
  pillar: VISION_PILLARS[0] as string,
  horizon: "3y" as VisionHorizon,
  metric: "",
  status: "vision" as VisionStatus,
  progress: 0,
  pinned: false,
};
type FormState = typeof EMPTY_FORM;

function pillarIcon(pillar: string): LucideIcon {
  return PILLAR_ICON[pillar] ?? Target;
}

export function VisionBoardClient({
  ownerId,
  persistLocally,
  initialItems,
}: {
  ownerId: string;
  persistLocally: boolean;
  initialItems: VisionItem[];
}) {
  const [items, setItems] = useState<VisionItem[]>(initialItems);
  const [pillarFilter, setPillarFilter] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<VisionStatus | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<VisionItem | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // In local-save mode the server passes an empty list; hydrate (and seed) from
  // the browser store on mount.
  useEffect(() => {
    if (persistLocally) setItems(loadLocalVisions(ownerId));
  }, [persistLocally, ownerId]);

  const stats = useMemo(() => computeVisionStats(items), [items]);

  const pillarCounts = useMemo(() => {
    const m: Record<string, number> = {};
    items.forEach((i) => (m[i.pillar] = (m[i.pillar] ?? 0) + 1));
    return m;
  }, [items]);

  const pinned = useMemo(() => items.filter((i) => i.pinned), [items]);

  const filtered = useMemo(() => {
    return sortVisions(
      items.filter((i) => {
        if (pillarFilter && i.pillar !== pillarFilter) return false;
        if (statusFilter && i.status !== statusFilter) return false;
        return true;
      }),
    );
  }, [items, pillarFilter, statusFilter]);

  // ── persistence helpers (branch on mode) ──────────────────────────────────
  function applyLocal(next: VisionItem) {
    setItems((prev) => {
      const i = prev.findIndex((x) => x.id === next.id);
      if (i === -1) return [...prev, next];
      const copy = prev.slice();
      copy[i] = next;
      return copy;
    });
  }

  async function persistCreate(input: VisionInput) {
    if (persistLocally) {
      const item = createLocalVision(ownerId, input);
      if (item) applyLocal(item);
      return item != null;
    }
    const res = await createVisionAction(input);
    if (res.ok) applyLocal(res.item);
    else setError(res.error);
    return res.ok;
  }

  async function persistUpdate(id: string, patch: VisionInput) {
    // optimistic
    setItems((prev) =>
      prev.map((x) => (x.id === id ? { ...x, ...patch } as VisionItem : x)),
    );
    if (persistLocally) {
      const item = updateLocalVision(ownerId, id, patch);
      if (item) applyLocal(item);
      return;
    }
    const res = await updateVisionAction(id, patch);
    if (res.ok) applyLocal(res.item);
    else setError(res.error);
  }

  async function persistDelete(id: string) {
    setItems((prev) => prev.filter((x) => x.id !== id));
    if (persistLocally) {
      removeLocalVision(ownerId, id);
      return;
    }
    const res = await deleteVisionAction(id);
    if (!res.ok) setError(res.error);
  }

  // ── dialog handlers ───────────────────────────────────────────────────────
  function openAdd() {
    setEditing(null);
    setForm({ ...EMPTY_FORM, pillar: pillarFilter ?? VISION_PILLARS[0] });
    setError(null);
    setDialogOpen(true);
  }

  function openEdit(item: VisionItem) {
    setEditing(item);
    setForm({
      title: item.title,
      description: item.description ?? "",
      pillar: item.pillar,
      horizon: item.horizon,
      metric: item.metric ?? "",
      status: item.status,
      progress: item.progress,
      pinned: item.pinned,
    });
    setError(null);
    setDialogOpen(true);
  }

  async function submitForm() {
    if (!form.title.trim()) {
      setError("Give the vision a title.");
      return;
    }
    setBusy(true);
    setError(null);
    const input: VisionInput = {
      title: form.title,
      description: form.description,
      pillar: form.pillar,
      horizon: form.horizon,
      metric: form.metric,
      status: form.status,
      progress: form.progress,
      pinned: form.pinned,
    };
    const ok = editing ? (await persistUpdate(editing.id, input), true) : await persistCreate(input);
    setBusy(false);
    if (ok) setDialogOpen(false);
  }

  function cycleStatus(item: VisionItem) {
    const order: VisionStatus[] = ["vision", "active", "achieved"];
    const next = order[(order.indexOf(item.status) + 1) % order.length];
    const patch: VisionInput = { status: next };
    if (next === "achieved") patch.progress = 100;
    persistUpdate(item.id, patch);
  }

  function nudge(item: VisionItem, delta: number) {
    const progress = Math.min(100, Math.max(0, item.progress + delta));
    const patch: VisionInput = { progress };
    if (progress === 100 && item.status !== "achieved") patch.status = "achieved";
    if (progress < 100 && item.status === "achieved") patch.status = "active";
    persistUpdate(item.id, patch);
  }

  return (
    <div className="space-y-6 pb-16">
      {/* North-star hero */}
      <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-gradient-to-br from-primary/[0.08] via-card to-accent/[0.06] p-6 sm:p-8">
        <div className="pointer-events-none absolute -right-10 -top-10 opacity-[0.06]">
          <Compass className="h-44 w-44" />
        </div>
        <div className="relative space-y-3">
          <div className="inline-flex items-center gap-2 text-muted-foreground">
            <Compass className="h-4 w-4" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.22em]">North Star</span>
          </div>
          <h1 className="max-w-3xl text-2xl font-semibold leading-tight tracking-tight sm:text-3xl">
            Build the J Supreme group into the Caribbean&apos;s defining tech company —
            and earn the freedom that comes with it.
          </h1>
          <p className="max-w-2xl text-sm text-muted-foreground">
            The goals below are the map. Pin the ones that matter most, move them as you make
            progress, and add your own anytime.
          </p>
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <Button onClick={openAdd} className="gap-1.5">
              <Plus className="h-4 w-4" /> Add a vision
            </Button>
            <StatChip label="Visions" value={stats.total} />
            <StatChip label="In motion" value={stats.active} />
            <StatChip label="Achieved" value={stats.achieved} />
            <div className="flex items-center gap-2 rounded-full border border-border/60 bg-background/40 px-3 py-1">
              <span className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                Momentum
              </span>
              <div className="h-1.5 w-20 overflow-hidden rounded-full bg-secondary/80">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-primary to-accent transition-all"
                  style={{ width: `${stats.momentum}%` }}
                />
              </div>
              <span className="text-xs font-semibold tabular-nums">{stats.momentum}%</span>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="flex items-center justify-between gap-3 rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          <span>{error}</span>
          <button onClick={() => setError(null)} className="text-xs underline">
            dismiss
          </button>
        </div>
      )}

      {/* Pinned / North-star strip */}
      {pinned.length > 0 && (
        <section className="space-y-2">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Pin className="h-3.5 w-3.5" />
            <span className="text-[11px] font-bold uppercase tracking-[0.18em]">Pinned</span>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {sortVisions(pinned).map((item) => (
              <VisionCard
                key={item.id}
                item={item}
                featured
                onEdit={() => openEdit(item)}
                onDelete={() => persistDelete(item.id)}
                onTogglePin={() => persistUpdate(item.id, { pinned: !item.pinned })}
                onCycleStatus={() => cycleStatus(item)}
                onNudge={(d) => nudge(item, d)}
              />
            ))}
          </div>
        </section>
      )}

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-1.5">
        <FilterChip active={!pillarFilter && !statusFilter} onClick={() => { setPillarFilter(null); setStatusFilter(null); }}>
          All
        </FilterChip>
        {VISION_PILLARS.map((p) => {
          const Icon = pillarIcon(p);
          return (
            <FilterChip
              key={p}
              active={pillarFilter === p}
              onClick={() => setPillarFilter(pillarFilter === p ? null : p)}
            >
              <Icon className="h-3.5 w-3.5" />
              {p}
              <span className="opacity-50">{pillarCounts[p] ?? 0}</span>
            </FilterChip>
          );
        })}
        <span className="mx-1 h-4 w-px bg-border" />
        {VISION_STATUS_VALUES.map((s) => (
          <FilterChip
            key={s}
            active={statusFilter === s}
            onClick={() => setStatusFilter(statusFilter === s ? null : s)}
          >
            {STATUS_LABELS[s]}
          </FilterChip>
        ))}
      </div>

      {/* Board */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-border/70 py-16 text-center text-muted-foreground">
          <Target className="h-10 w-10 opacity-30" />
          <p className="text-sm">
            {items.length === 0
              ? "Your board is empty. Add your first vision."
              : "No visions match this filter."}
          </p>
          <Button variant="outline" size="sm" onClick={openAdd} className="gap-1.5">
            <Plus className="h-4 w-4" /> Add a vision
          </Button>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((item) => (
            <VisionCard
              key={item.id}
              item={item}
              onEdit={() => openEdit(item)}
              onDelete={() => persistDelete(item.id)}
              onTogglePin={() => persistUpdate(item.id, { pinned: !item.pinned })}
              onCycleStatus={() => cycleStatus(item)}
              onNudge={(d) => nudge(item, d)}
            />
          ))}
        </div>
      )}

      {/* Add / edit dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit vision" : "Add a vision"}</DialogTitle>
            <DialogDescription>
              What are you building toward? Make it specific enough to know when you&apos;ve hit it.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="v-title">Vision</Label>
              <Input
                id="v-title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="e.g. J$1,000,000+ per month, recurring"
                autoFocus
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="v-desc">Why it matters (optional)</Label>
              <Textarea
                id="v-desc"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="The story behind the number."
                rows={2}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Pillar</Label>
                <Select value={form.pillar} onValueChange={(v) => setForm({ ...form, pillar: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {VISION_PILLARS.map((p) => (
                      <SelectItem key={p} value={p}>
                        {p}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Horizon</Label>
                <Select
                  value={form.horizon}
                  onValueChange={(v) => setForm({ ...form, horizon: v as VisionHorizon })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {VISION_HORIZON_VALUES.map((h) => (
                      <SelectItem key={h} value={h}>
                        {HORIZON_LABELS[h]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="v-metric">Target metric (optional)</Label>
                <Input
                  id="v-metric"
                  value={form.metric}
                  onChange={(e) => setForm({ ...form, metric: e.target.value })}
                  placeholder="J$1M MRR"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Status</Label>
                <Select
                  value={form.status}
                  onValueChange={(v) => setForm({ ...form, status: v as VisionStatus })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {VISION_STATUS_VALUES.map((s) => (
                      <SelectItem key={s} value={s}>
                        {STATUS_LABELS[s]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="v-progress">Progress — {form.progress}%</Label>
              <input
                id="v-progress"
                type="range"
                min={0}
                max={100}
                step={5}
                value={form.progress}
                onChange={(e) => setForm({ ...form, progress: Number(e.target.value) })}
                className="w-full accent-[hsl(var(--primary))]"
              />
            </div>

            <button
              type="button"
              onClick={() => setForm({ ...form, pinned: !form.pinned })}
              className={cn(
                "flex w-full items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors",
                form.pinned
                  ? "border-primary/40 bg-primary/10 text-primary"
                  : "border-border text-muted-foreground hover:bg-muted/40",
              )}
            >
              {form.pinned ? <Pin className="h-4 w-4" /> : <PinOff className="h-4 w-4" />}
              {form.pinned ? "Pinned to North Star" : "Pin to North Star"}
            </button>
          </div>

          <DialogFooter>
            <Button variant="ghost" onClick={() => setDialogOpen(false)} disabled={busy}>
              Cancel
            </Button>
            <Button onClick={submitForm} disabled={busy}>
              {busy ? "Saving…" : editing ? "Save changes" : "Add vision"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ── sub-components ────────────────────────────────────────────────────────────

function StatChip({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center gap-1.5 rounded-full border border-border/60 bg-background/40 px-3 py-1">
      <span className="text-sm font-semibold tabular-nums">{value}</span>
      <span className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </span>
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs transition-colors",
        active
          ? "border-primary bg-primary/15 font-medium text-primary"
          : "border-border text-muted-foreground hover:bg-muted/40 hover:text-foreground",
      )}
    >
      {children}
    </button>
  );
}

function VisionCard({
  item,
  featured = false,
  onEdit,
  onDelete,
  onTogglePin,
  onCycleStatus,
  onNudge,
}: {
  item: VisionItem;
  featured?: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onTogglePin: () => void;
  onCycleStatus: () => void;
  onNudge: (delta: number) => void;
}) {
  const PillarIcon = pillarIcon(item.pillar);
  const StatusIcon = STATUS_ICON[item.status];
  const achieved = item.status === "achieved";

  return (
    <Card
      className={cn(
        "group flex flex-col transition-all hover:border-primary/40",
        featured && "border-primary/30 ring-1 ring-inset ring-primary/10",
        achieved && "bg-primary/[0.04]",
      )}
    >
      <CardContent className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <PillarIcon className="h-3.5 w-3.5" />
            <span className="text-[10px] font-semibold uppercase tracking-[0.14em]">
              {item.pillar}
            </span>
          </div>
          <button
            type="button"
            onClick={onTogglePin}
            aria-label={item.pinned ? "Unpin" : "Pin"}
            className={cn(
              "shrink-0 transition-colors",
              item.pinned
                ? "text-primary"
                : "text-muted-foreground/40 opacity-0 hover:text-foreground group-hover:opacity-100",
            )}
          >
            {item.pinned ? <Pin className="h-4 w-4" /> : <PinOff className="h-4 w-4" />}
          </button>
        </div>

        <h3
          className={cn(
            "text-sm font-semibold leading-snug",
            achieved && "text-primary",
          )}
        >
          {item.title}
        </h3>

        {item.description && (
          <p className="text-xs leading-relaxed text-muted-foreground">{item.description}</p>
        )}

        <div className="flex flex-wrap items-center gap-1.5">
          <Badge variant="outline" className="h-5 gap-1 px-1.5 text-[10px]">
            {HORIZON_LABELS[item.horizon]}
          </Badge>
          {item.metric && (
            <Badge variant="secondary" className="h-5 gap-1 px-1.5 text-[10px]">
              <Target className="h-3 w-3" /> {item.metric}
            </Badge>
          )}
        </div>

        {/* progress */}
        <div className="mt-auto space-y-1.5 pt-1">
          <div className="flex items-center justify-between text-[11px] text-muted-foreground">
            <span>{achieved ? "Done" : "Progress"}</span>
            <span className="font-semibold tabular-nums text-foreground">{item.progress}%</span>
          </div>
          <Progress value={item.progress} className="h-1.5" />
        </div>

        {/* footer actions */}
        <div className="flex items-center justify-between gap-1 border-t border-border/50 pt-2.5">
          <button
            type="button"
            onClick={onCycleStatus}
            title="Click to change status"
            className={cn(
              "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium transition-colors",
              achieved
                ? "bg-primary/15 text-primary"
                : "bg-muted/60 text-muted-foreground hover:bg-muted",
            )}
          >
            <StatusIcon className="h-3 w-3" />
            {STATUS_LABELS[item.status]}
          </button>

          <div className="flex items-center gap-0.5">
            {!achieved && (
              <>
                <IconBtn label="Decrease progress" onClick={() => onNudge(-10)}>
                  <Minus className="h-3.5 w-3.5" />
                </IconBtn>
                <IconBtn label="Increase progress" onClick={() => onNudge(10)}>
                  <Plus className="h-3.5 w-3.5" />
                </IconBtn>
              </>
            )}
            <IconBtn label="Edit" onClick={onEdit}>
              <Pencil className="h-3.5 w-3.5" />
            </IconBtn>
            <IconBtn label="Delete" onClick={onDelete} danger>
              <Trash2 className="h-3.5 w-3.5" />
            </IconBtn>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function IconBtn({
  label,
  onClick,
  danger = false,
  children,
}: {
  label: string;
  onClick: () => void;
  danger?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className={cn(
        "rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted/60",
        danger ? "hover:text-destructive" : "hover:text-foreground",
      )}
    >
      {children}
    </button>
  );
}
