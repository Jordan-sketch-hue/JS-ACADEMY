"use client";

import { useState, useEffect } from "react";
import { Loader2, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { ProvisioningTarget } from "@/lib/conglomerate-backoffice/types";

type StepResult = {
  target: ProvisioningTarget;
  ok: boolean;
  detail?: string;
  error?: string;
};

const TARGET_LABELS: Record<ProvisioningTarget, string> = {
  "abo-tours": "AbooTours admin (Supabase + aboo_user_profiles)",
  "solid-trust": "Solid Trust admin (Supabase + st_staff)",
  "solace-auto": "Solace back office (Supabase)",
  "bp-courier-payload": "BP Courier Payload (/admin)",
  "language-cradle": "Language Cradle CMS (shared password)",
  ship2door: "Ship 2 Door back office (magic key)",
};

// Targets that mint a per-user email+password login (vs. a single shared secret).
const USER_TARGETS: ProvisioningTarget[] = ["abo-tours", "solid-trust", "solace-auto", "bp-courier-payload"];
const isUserTarget = (t: ProvisioningTarget) => USER_TARGETS.includes(t);
const isKeyless = (t: ProvisioningTarget) => t === "language-cradle" || t === "ship2door";

function generatePassword() {
  const sets = [
    "ABCDEFGHJKLMNPQRSTUVWXYZ",
    "abcdefghijkmnopqrstuvwxyz",
    "23456789",
    "!@#$%&*-_=+?",
  ];
  const all = sets.join("");
  const pick = (s: string) => s[Math.floor(Math.random() * s.length)];
  const chars = sets.map(pick);
  for (let i = 0; i < 12; i++) chars.push(pick(all));
  return chars.sort(() => Math.random() - 0.5).join("");
}

export function CreateCredentialModal({
  open,
  onClose,
  defaultTargets,
  brandName,
}: {
  open: boolean;
  onClose: () => void;
  defaultTargets: ProvisioningTarget[];
  brandName: string;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState(generatePassword);
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [targets, setTargets] = useState<ProvisioningTarget[]>(defaultTargets);
  const [rotate, setRotate] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<StepResult[] | null>(null);

  useEffect(() => {
    if (open) {
      setEmail("");
      setName("");
      setRole("");
      setPassword(generatePassword());
      setTargets(defaultTargets);
      setRotate(false);
      setError(null);
      setResults(null);
    }
  }, [open, defaultTargets]);

  if (!open) return null;

  function toggleTarget(t: ProvisioningTarget) {
    setTargets((prev) => (prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    setResults(null);
    try {
      const res = await fetch("/api/backoffice/credentials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password,
          name: name.trim() || undefined,
          role: role.trim() || undefined,
          targets,
          rotate,
        }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(
          typeof body.error === "string"
            ? body.error
            : "Provisioning failed — check the request and try again.",
        );
        return;
      }
      setResults(body.results as StepResult[]);
    } catch (e2) {
      setError(e2 instanceof Error ? e2.message : "Unknown error");
    } finally {
      setBusy(false);
    }
  }

  const userSelected = targets.some(isUserTarget);
  const keylessSelected = targets.some(isKeyless);
  const needsCreds = userSelected || rotate;
  const allOk = results?.every((r) => r.ok) ?? false;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <Card
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto border-border/70 bg-card shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <CardHeader>
          <div className="flex items-start justify-between gap-2">
            <div>
              <CardTitle className="text-base">Create credential · {brandName}</CardTitle>
              <CardDescription className="text-xs">
                Provisions a working sign-in across the targets below. The password is shown once
                on success — copy it.
              </CardDescription>
            </div>
            <Button variant="ghost" size="icon" className="-mr-2 -mt-2" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {results ? (
            <ResultsView results={results} email={email} password={password} onClose={onClose} ok={allOk} />
          ) : (
            <form onSubmit={submit} className="space-y-4">
              {userSelected ? (
                <Field label="Email">
                  <input
                    type="email"
                    required
                    placeholder="ops@yourcompany.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-md border border-border/70 bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                  />
                </Field>
              ) : null}
              {needsCreds ? (
                <Field
                  label={
                    rotate && !userSelected
                      ? "New shared secret"
                      : rotate
                        ? "Password / new shared secret"
                        : "Password"
                  }
                >
                  <div className="flex gap-2">
                    <input
                      type="text"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="flex-1 rounded-md border border-border/70 bg-background px-3 py-2 font-mono text-sm outline-none focus:border-primary"
                    />
                    <Button type="button" variant="outline" size="sm" onClick={() => setPassword(generatePassword())}>
                      Regenerate
                    </Button>
                  </div>
                  <p className="mt-1 text-[10px] text-muted-foreground">
                    {rotate
                      ? "Becomes the new shared secret for the rotated back office(s). Min 10 chars."
                      : "Auto-generated; edit if you want a memorable one. Min 10 chars."}
                  </p>
                </Field>
              ) : null}
              {userSelected ? (
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Display name (optional)">
                    <input
                      type="text"
                      placeholder="Operator"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full rounded-md border border-border/70 bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                    />
                  </Field>
                  <Field label="Role (optional)">
                    <input
                      type="text"
                      placeholder="owner / admin / dispatcher"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className="w-full rounded-md border border-border/70 bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                    />
                  </Field>
                </div>
              ) : null}
              <Field label="Provision into">
                <div className="space-y-1.5">
                  {(Object.keys(TARGET_LABELS) as ProvisioningTarget[]).map((t) => (
                    <label
                      key={t}
                      className={cn(
                        "flex cursor-pointer items-center gap-2 rounded-md border px-3 py-2 text-sm transition",
                        targets.includes(t)
                          ? "border-primary/40 bg-primary/5"
                          : "border-border/60 bg-background/40 hover:border-border",
                      )}
                    >
                      <input
                        type="checkbox"
                        checked={targets.includes(t)}
                        onChange={() => toggleTarget(t)}
                        className="h-4 w-4 accent-primary"
                      />
                      <span>{TARGET_LABELS[t]}</span>
                    </label>
                  ))}
                </div>
              </Field>
              {keylessSelected ? (
                <label className="flex cursor-pointer items-start gap-2 rounded-md border border-amber-500/40 bg-amber-500/5 px-3 py-2 text-xs">
                  <input
                    type="checkbox"
                    checked={rotate}
                    onChange={(e) => setRotate(e.target.checked)}
                    className="mt-0.5 h-4 w-4 accent-primary"
                  />
                  <span>
                    <span className="font-medium">Rotate the shared secret</span> for the keyless
                    targets (Language Cradle / Ship 2 Door) and redeploy that site. Leave unchecked to
                    just <strong>reveal</strong> the current access. ⚠️ Rotating invalidates the old
                    password / magic link.
                  </span>
                </label>
              ) : null}
              {error ? (
                <p className="rounded-md border border-destructive/30 bg-destructive/10 p-2 text-xs text-destructive">
                  {error}
                </p>
              ) : null}
              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button type="submit" disabled={busy || targets.length === 0}>
                  {busy ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {needsCreds ? "Provisioning…" : "Revealing…"}
                    </>
                  ) : (
                    <>
                      <Plus className="mr-2 h-4 w-4" />
                      {needsCreds ? (rotate ? "Rotate + redeploy" : "Provision") : "Reveal access"}
                    </>
                  )}
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function ResultsView({
  results,
  email,
  password,
  onClose,
  ok,
}: {
  results: StepResult[];
  email: string;
  password: string;
  onClose: () => void;
  ok: boolean;
}) {
  async function copy(text: string) {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      /* ignore */
    }
  }

  return (
    <div className="space-y-3">
      <div
        className={cn(
          "rounded-md border p-3 text-sm",
          ok
            ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
            : "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300",
        )}
      >
        {ok ? "All targets provisioned. Copy the credentials now." : "Some steps failed. Review below."}
      </div>
      <div className="rounded-md border border-border/60 bg-background/40 p-3 text-sm">
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Email</p>
        <p className="mt-0.5 font-mono">{email}</p>
        <p className="mt-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Password</p>
        <p className="mt-0.5 break-all font-mono">{password}</p>
        <div className="mt-2 flex gap-2">
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => copy(`${email}\n${password}`)}
          >
            Copy both
          </Button>
          <Button type="button" size="sm" variant="ghost" onClick={() => copy(password)}>
            Copy password only
          </Button>
        </div>
      </div>
      <ul className="space-y-1.5">
        {results.map((r) => (
          <li
            key={r.target}
            className={cn(
              "rounded-md border px-3 py-2 text-xs",
              r.ok
                ? "border-emerald-500/30 bg-emerald-500/5"
                : "border-destructive/30 bg-destructive/5",
            )}
          >
            <p className="font-semibold">{TARGET_LABELS[r.target]}</p>
            <p className="text-[11px] text-muted-foreground">{r.ok ? r.detail : r.error}</p>
          </li>
        ))}
      </ul>
      <div className="flex justify-end">
        <Button onClick={onClose}>Done</Button>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block space-y-1.5">
      <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
        {label}
      </span>
      {children}
    </label>
  );
}
