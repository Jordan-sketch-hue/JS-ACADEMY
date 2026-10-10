"use client";

import { useState, useTransition } from "react";
import { Save, Settings as SettingsIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  REGION_LABEL,
  REGIONS,
  SERVICE_FOCUSES,
  SERVICE_LABEL,
  type Region,
  type SalesSettings,
  type ServiceFocus,
} from "@/lib/sales/types";
import { updateSalesSettingsAction } from "@/app/(app)/sales/actions";

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-sm font-medium">{label}</label>
      {hint && <p className="mb-1 text-xs text-muted-foreground">{hint}</p>}
      {children}
    </div>
  );
}

export function SettingsClient({
  settings,
  resendConfigured,
  hunterConfigured,
}: {
  settings: SalesSettings;
  resendConfigured: boolean;
  hunterConfigured: boolean;
}) {
  const [s, setS] = useState<SalesSettings>(settings);
  const [pending, start] = useTransition();
  const [saved, setSaved] = useState(false);

  function set<K extends keyof SalesSettings>(k: K, v: SalesSettings[K]) {
    setS((prev) => ({ ...prev, [k]: v }));
  }
  function toggleRegion(r: Region) {
    set("regions", s.regions.includes(r) ? s.regions.filter((x) => x !== r) : [...s.regions, r]);
  }
  function toggleFocus(f: ServiceFocus) {
    set(
      "service_focus",
      s.service_focus.includes(f) ? s.service_focus.filter((x) => x !== f) : [...s.service_focus, f],
    );
  }

  function save() {
    start(async () => {
      await updateSalesSettingsAction({
        sending_enabled: s.sending_enabled,
        daily_target: Number(s.daily_target),
        warmup_enabled: s.warmup_enabled,
        from_name: s.from_name,
        from_email: s.from_email,
        reply_to: s.reply_to,
        bcc_email: s.bcc_email,
        company_name: s.company_name,
        postal_address: s.postal_address,
        regions: s.regions,
        service_focus: s.service_focus,
        min_email_confidence: Number(s.min_email_confidence),
        hunter_daily_cap: Number(s.hunter_daily_cap),
        calendar_url: s.calendar_url,
        site_url: s.site_url,
        portfolio_url: s.portfolio_url,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    });
  }

  return (
    <div className="mx-auto max-w-3xl space-y-5 p-4 sm:p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-semibold tracking-tight">
            <SettingsIcon className="h-6 w-6" /> Sales Settings
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">Master controls for the outreach engine.</p>
        </div>
        <Button onClick={save} disabled={pending}>
          <Save className="mr-1.5 h-4 w-4" /> {saved ? "Saved" : pending ? "Saving…" : "Save"}
        </Button>
      </div>

      <div className="flex flex-wrap gap-2 text-xs">
        <Badge variant={resendConfigured ? "default" : "secondary"}>
          Resend {resendConfigured ? "✓ configured" : "— not set"}
        </Badge>
        <Badge variant={hunterConfigured ? "default" : "secondary"}>
          Hunter {hunterConfigured ? "✓ configured" : "— not set"}
        </Badge>
      </div>

      {/* Master switch */}
      <Card className="flex items-center justify-between p-4">
        <div>
          <div className="font-medium">Automatic sending</div>
          <div className="text-xs text-muted-foreground">
            Master switch. When on, the cron sources + sends up to your daily target.
          </div>
        </div>
        <Button
          variant={s.sending_enabled ? "default" : "outline"}
          onClick={() => set("sending_enabled", !s.sending_enabled)}
        >
          {s.sending_enabled ? "ON" : "OFF"}
        </Button>
      </Card>

      <Card className="grid gap-4 p-4 sm:grid-cols-2">
        <Field label="Daily target" hint="Steady-state emails/day (after warm-up).">
          <Input
            type="number"
            value={s.daily_target}
            onChange={(e) => set("daily_target", Number(e.target.value))}
          />
        </Field>
        <Field label="Warm-up ramp" hint="Protects a new domain for ~2 weeks.">
          <Button
            variant={s.warmup_enabled ? "default" : "outline"}
            onClick={() => set("warmup_enabled", !s.warmup_enabled)}
            className="w-full"
          >
            {s.warmup_enabled ? "Enabled" : "Disabled"}
          </Button>
        </Field>
        <Field label="From name">
          <Input value={s.from_name} onChange={(e) => set("from_name", e.target.value)} />
        </Field>
        <Field label="From email" hint="Must be on a Resend-verified domain.">
          <Input value={s.from_email} onChange={(e) => set("from_email", e.target.value)} />
        </Field>
        <Field label="Reply-to">
          <Input value={s.reply_to} onChange={(e) => set("reply_to", e.target.value)} />
        </Field>
        <Field label="BCC (you)" hint="Copied on every send so you can reply from Gmail.">
          <Input value={s.bcc_email} onChange={(e) => set("bcc_email", e.target.value)} />
        </Field>
        <Field label="Calendar / booking URL" hint="Powers the CTA button.">
          <Input
            value={s.calendar_url ?? ""}
            onChange={(e) => set("calendar_url", e.target.value)}
            placeholder="https://…"
          />
        </Field>
        <Field label="Website URL">
          <Input value={s.site_url} onChange={(e) => set("site_url", e.target.value)} />
        </Field>
        <Field label="Portfolio URL" hint="Linked in every email — 'See our portfolio of recent work'.">
          <Input value={s.portfolio_url} onChange={(e) => set("portfolio_url", e.target.value)} />
        </Field>
      </Card>

      <Card className="space-y-3 p-4">
        <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground/70">
          Legal identity (required on every email)
        </h2>
        <Field label="Company name">
          <Input value={s.company_name} onChange={(e) => set("company_name", e.target.value)} />
        </Field>
        <Field
          label="Physical postal address"
          hint="CAN-SPAM/PECR require a real mailing address in the footer. Use your registered business address."
        >
          <Textarea
            rows={2}
            value={s.postal_address}
            onChange={(e) => set("postal_address", e.target.value)}
          />
        </Field>
      </Card>

      <Card className="space-y-3 p-4">
        <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground/70">
          Targeting
        </h2>
        <Field label="Regions">
          <div className="flex flex-wrap gap-2">
            {REGIONS.map((r) => (
              <Button
                key={r}
                size="sm"
                variant={s.regions.includes(r) ? "default" : "outline"}
                onClick={() => toggleRegion(r)}
              >
                {REGION_LABEL[r]}
              </Button>
            ))}
          </div>
        </Field>
        <Field label="Services offered">
          <div className="flex flex-wrap gap-2">
            {SERVICE_FOCUSES.map((f) => (
              <Button
                key={f}
                size="sm"
                variant={s.service_focus.includes(f) ? "default" : "outline"}
                onClick={() => toggleFocus(f)}
              >
                {SERVICE_LABEL[f]}
              </Button>
            ))}
          </div>
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Min email confidence" hint="Only email Hunter results ≥ this (0-100).">
            <Input
              type="number"
              value={s.min_email_confidence}
              onChange={(e) => set("min_email_confidence", Number(e.target.value))}
            />
          </Field>
          <Field label="Hunter daily request cap" hint="Bounds API usage per day.">
            <Input
              type="number"
              value={s.hunter_daily_cap}
              onChange={(e) => set("hunter_daily_cap", Number(e.target.value))}
            />
          </Field>
        </div>
      </Card>
    </div>
  );
}
