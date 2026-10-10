"use client";

import { useMemo, useState } from "react";
import {
  withPublicSupplementalSection,
  type IntakeSection,
} from "@/lib/data/intake-forms";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Loader2, Paperclip, Sparkles, X } from "lucide-react";
import { CLIENT_FILE_MAX_BYTES } from "@/lib/crm/client-file-rules";
import { INTAKE_MAX_FILES_PER_SUBMISSION } from "@/lib/data/intake-attachments";

export type PublicIntakeInitial = {
  title: string;
  intro: string | null;
  sections: IntakeSection[];
};

const MULTI_SELECT_SEPARATOR = " | ";

function isMultiSelectField(label: string) {
  const normalized = label.toLowerCase();
  return (
    normalized.includes("main thing") ||
    normalized.includes("main things") ||
    normalized.includes("primary focus") ||
    normalized.includes("want help with")
  );
}

function selectedMultiValues(value: string) {
  return value
    .split(MULTI_SELECT_SEPARATOR)
    .map((item) => item.trim())
    .filter(Boolean);
}

export function PublicIntakeForm({
  shareToken,
  initial,
  referredClientId,
}: {
  shareToken: string;
  initial: PublicIntakeInitial;
  referredClientId?: string;
}) {
  const displaySections = useMemo(
    () => withPublicSupplementalSection(initial.sections),
    [initial.sections],
  );

  const initialAnswers = useMemo(() => {
    const m: Record<string, string> = {};
    for (const s of displaySections) {
      for (const f of s.fields) {
        m[f.id] = "";
      }
    }
    return m;
  }, [displaySections]);

  const [answers, setAnswers] = useState<Record<string, string>>(initialAnswers);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [submitWarning, setSubmitWarning] = useState<string | null>(null);

  const maxMb = Math.floor(CLIENT_FILE_MAX_BYTES / (1024 * 1024));

  const setField = (id: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  };

  const toggleMultiField = (id: string, option: string) => {
    setAnswers((prev) => {
      const selected = new Set(selectedMultiValues(prev[id] ?? ""));
      if (selected.has(option)) {
        selected.delete(option);
      } else {
        selected.add(option);
      }
      return { ...prev, [id]: Array.from(selected).join(MULTI_SELECT_SEPARATOR) };
    });
  };

  const submit = async () => {
    setSending(true);
    setError(null);
    setSubmitWarning(null);
    try {
      const fd = new FormData();
      fd.set("answers", JSON.stringify(answers));
      if (referredClientId?.trim()) {
        fd.set("referred_client_id", referredClientId.trim());
        fd.set("referred_client_id_source", "query");
      }
      for (const f of files) {
        fd.append("files", f);
      }
      const res = await fetch(`/api/v1/intake/${encodeURIComponent(shareToken)}`, {
        method: "POST",
        body: fd,
      });
      const json = (await res.json().catch(() => ({}))) as {
        error?: string;
        ok?: boolean;
        warning?: string;
      };
      if (!res.ok) {
        setError(typeof json.error === "string" ? json.error : `Request failed (${res.status})`);
        return;
      }
      if (typeof json.warning === "string" && json.warning.trim()) {
        setSubmitWarning(json.warning.trim());
      }
      setDone(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Network error");
    } finally {
      setSending(false);
    }
  };

  if (done) {
    return (
      <Card className="border-emerald-500/30 bg-emerald-500/[0.06]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-emerald-100">
            <CheckCircle2 className="h-5 w-5" />
            Received — thank you
          </CardTitle>
          <CardDescription className="text-emerald-50/80">
            Your answers were saved{files.length ? ` (and ${files.length} file${files.length > 1 ? "s" : ""} if uploads succeeded)` : ""}. The team will follow up using the contact details you provided.
          </CardDescription>
          {submitWarning ? (
            <p className="text-sm text-amber-200/95" role="status">
              {submitWarning}
            </p>
          ) : null}
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      <div className="space-y-2 text-center">
        <div className="inline-flex items-center justify-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
          <Sparkles className="h-3.5 w-3.5" />
          Secure intake
        </div>
        <h1 className="font-jarvis text-2xl font-semibold tracking-tight sm:text-3xl">
          {initial.title}
        </h1>
        {initial.intro ? (
          <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
            {initial.intro}
          </p>
        ) : (
          <p className="text-sm text-muted-foreground">
            A few structured questions so we can prepare before we talk.
          </p>
        )}
        <p className="text-sm text-muted-foreground">
          You can attach supporting files once you’ve answered the questions (optional uploads near
          Submit).
        </p>
      </div>

      <div className="space-y-6">
        {displaySections.map((section, sectionIndex) => (
          <Card key={section.id} className="border-border/70 bg-card/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">
                <span className="mr-2 text-xs font-medium text-muted-foreground">
                  Step {sectionIndex + 1}
                </span>
                {section.title}
              </CardTitle>
              {section.description ? (
                <CardDescription>{section.description}</CardDescription>
              ) : null}
            </CardHeader>
            <CardContent className="space-y-4">
              {section.fields.map((field) => (
                <div key={field.id} className="space-y-2">
                  <Label htmlFor={field.id}>
                    {field.label}
                    {field.required ? (
                      <span className="text-destructive"> *</span>
                    ) : null}
                  </Label>
                  {field.type === "textarea" ? (
                    <Textarea
                      id={field.id}
                      placeholder={field.placeholder}
                      value={answers[field.id] ?? ""}
                      onChange={(e) => setField(field.id, e.target.value)}
                      rows={4}
                      disabled={sending}
                    />
                  ) : field.type === "select" && field.options?.length && isMultiSelectField(field.label) ? (
                    <div id={field.id} className="space-y-2 rounded-md border border-border/70 bg-background/50 p-3">
                      <p className="text-xs text-muted-foreground">
                        Choose all that apply.
                      </p>
                      <div className="grid gap-2 sm:grid-cols-2">
                        {field.options.map((opt) => {
                          const checked = selectedMultiValues(answers[field.id] ?? "").includes(opt);
                          return (
                            <label
                              key={opt}
                              className="flex items-start gap-2 rounded-md border border-border/50 bg-card/50 px-3 py-2 text-sm hover:bg-muted/30"
                            >
                              <input
                                type="checkbox"
                                className="mt-0.5 h-4 w-4 shrink-0 rounded border border-input bg-background accent-primary"
                                checked={checked}
                                disabled={sending}
                                onChange={() => toggleMultiField(field.id, opt)}
                              />
                              <span>{opt}</span>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  ) : field.type === "select" && field.options?.length ? (
                    <Select
                      value={answers[field.id] || "__none__"}
                      onValueChange={(v) =>
                        setField(field.id, v === "__none__" ? "" : v)
                      }
                      disabled={sending}
                    >
                      <SelectTrigger id={field.id}>
                        <SelectValue placeholder={field.placeholder ?? "Choose…"} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="__none__">—</SelectItem>
                        {field.options.map((opt) => (
                          <SelectItem key={opt} value={opt}>
                            {opt}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <Input
                      id={field.id}
                      type={
                        field.type === "email"
                          ? "email"
                          : field.type === "phone"
                            ? "tel"
                            : "text"
                      }
                      placeholder={field.placeholder}
                      value={answers[field.id] ?? ""}
                      onChange={(e) => setField(field.id, e.target.value)}
                      disabled={sending}
                      autoComplete="on"
                    />
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-dashed border-border/70 bg-muted/10">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base">
            <Paperclip className="h-4 w-4 shrink-0 text-primary" aria-hidden />
            Supporting files (optional)
          </CardTitle>
          <CardDescription>
            Logos, brand PDFs, or briefs — up to {INTAKE_MAX_FILES_PER_SUBMISSION} files, {maxMb}
            MB each (PDF, Word, JPEG/PNG/WebP/GIF/SVG).
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Input
            type="file"
            multiple
            aria-label="Attach files"
            accept=".pdf,.doc,.docx,image/jpeg,image/png,image/gif,image/webp,image/svg+xml"
            disabled={sending || files.length >= INTAKE_MAX_FILES_PER_SUBMISSION}
            onChange={(e) => {
              const next = [...files];
              const list = e.target.files;
              if (!list?.length) return;
              setError(null);
              for (let i = 0; i < list.length; i++) {
                const f = list.item(i);
                if (!f) continue;
                if (next.length >= INTAKE_MAX_FILES_PER_SUBMISSION) break;
                if (f.size > CLIENT_FILE_MAX_BYTES) {
                  setError(`“${f.name}” is too large (max ${maxMb} MB per file).`);
                  continue;
                }
                next.push(f);
              }
              setFiles(next);
              e.target.value = "";
            }}
          />
          {files.length > 0 ? (
            <ul className="space-y-1.5 text-sm" aria-label="Files to upload">
              {files.map((f, idx) => (
                <li
                  key={`${f.name}-${idx}`}
                  className="flex items-center gap-2 rounded-md border border-border/50 bg-background/50 px-2 py-1.5"
                >
                  <span className="min-w-0 flex-1 truncate font-medium">{f.name}</span>
                  <span className="shrink-0 text-xs text-muted-foreground">
                    {(f.size / 1024).toFixed(0)} KB
                  </span>
                  <button
                    type="button"
                    className="shrink-0 rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
                    aria-label={`Remove ${f.name}`}
                    disabled={sending}
                    onClick={() => setFiles((prev) => prev.filter((_, i) => i !== idx))}
                  >
                    <X className="h-4 w-4" />
                  </button>
                </li>
              ))}
            </ul>
          ) : null}
        </CardContent>
      </Card>

      {error ? (
        <p className="text-center text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : null}

      <Button
        className="w-full"
        size="lg"
        onClick={() => void submit()}
        disabled={sending}
      >
        {sending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Sending…
          </>
        ) : files.length > 0 ? (
          `Submit responses (${files.length} file${files.length > 1 ? "s" : ""})`
        ) : (
          "Submit responses"
        )}
      </Button>

      <p className="text-center text-[11px] text-muted-foreground">
        Powered by J Supreme workspace intake — do not share this link publicly unless you trust
        recipients.
      </p>
    </div>
  );
}
