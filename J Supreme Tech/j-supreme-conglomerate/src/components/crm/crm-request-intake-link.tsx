"use client";

import { useCallback, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
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
import { Clipboard } from "lucide-react";

type IntakeFormOption = {
  id: string;
  title: string;
  share_token: string;
};

function buildIntakeDeepLink(origin: string, shareToken: string, clientId: string) {
  const base = origin.replace(/\/$/, "");
  return `${base}/intake/${encodeURIComponent(shareToken)}?client=${encodeURIComponent(clientId)}`;
}

export function CrmRequestIntakeLink({ clientId }: { clientId: string }) {
  const [busy, setBusy] = useState(false);
  const [hint, setHint] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [pickerForms, setPickerForms] = useState<IntakeFormOption[]>([]);
  const [pickedToken, setPickedToken] = useState<string | null>(null);

  const origin = useMemo(
    () => (typeof window !== "undefined" ? window.location.origin : ""),
    [],
  );

  const copyLink = useCallback(
    async (shareToken: string, openTab: boolean) => {
      if (!origin) return;
      const url = buildIntakeDeepLink(origin, shareToken, clientId);
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2400);
      if (openTab) window.open(url, "_blank", "noopener,noreferrer");
    },
    [origin, clientId],
  );

  const onRequestClick = async () => {
    setHint(null);
    setCopied(false);
    setBusy(true);
    try {
      const res = await fetch("/api/v1/intake/forms");
      const data = (await res.json()) as {
        forms?: IntakeFormOption[];
        error?: string;
      };
      if (!res.ok) {
        setHint(data.error ?? "Could not load intake forms.");
        return;
      }
      const list = data.forms ?? [];
      if (!list.length) {
        setHint("No shareable intake yet — create one under Pipeline intake first.");
        return;
      }
      if (!origin) return;
      if (list.length === 1) {
        await copyLink(list[0].share_token, true);
        return;
      }
      setPickerForms(list);
      setPickedToken(list[0]?.share_token ?? null);
      setPickerOpen(true);
    } finally {
      setBusy(false);
    }
  };

  const onConfirmPick = async () => {
    if (!pickedToken) return;
    setPickerOpen(false);
    await copyLink(pickedToken, true);
  };

  return (
    <div className="flex min-w-[7rem] flex-col gap-1">
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="h-auto justify-start gap-1 px-2 py-1 text-[11px] leading-snug"
        disabled={busy}
        onClick={() => void onRequestClick()}
      >
        <Clipboard className="h-3.5 w-3.5 shrink-0 opacity-70" aria-hidden />
        {busy ? "Loading…" : "Request info (link)"}
      </Button>
      {hint ? (
        <p className="text-[10px] leading-snug text-amber-700 dark:text-amber-300" role="status">
          {hint}
        </p>
      ) : null}
      {copied && !hint ? (
        <p className="text-[10px] text-muted-foreground" role="status">
          Copied
        </p>
      ) : null}

      <Dialog open={pickerOpen} onOpenChange={setPickerOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Choose intake form</DialogTitle>
            <DialogDescription>
              Copies a link that tags this roster client on submit. Opens the form in a new tab.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2 py-1">
            <Select
              value={pickedToken ?? undefined}
              onValueChange={(v) => setPickedToken(v)}
            >
              <SelectTrigger aria-label="Intake form">
                <SelectValue placeholder="Pick a form" />
              </SelectTrigger>
              <SelectContent>
                {pickerForms.map((f) => (
                  <SelectItem key={f.id} value={f.share_token}>
                    {f.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={() => setPickerOpen(false)}>
              Cancel
            </Button>
            <Button
              type="button"
              disabled={!pickedToken}
              onClick={() => void onConfirmPick()}
            >
              Copy link &amp; open
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
