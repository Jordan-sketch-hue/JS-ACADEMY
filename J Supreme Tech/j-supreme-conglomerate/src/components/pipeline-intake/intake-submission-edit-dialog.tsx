"use client";

import { useEffect, useState } from "react";
import type { ClientIntakeForm, ClientIntakeSubmission } from "@/lib/data/intake-forms";
import { updateIntakeSubmissionAction } from "@/app/(app)/pipeline-intake/actions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { Loader2 } from "lucide-react";

function emptyAnswersForForm(form: ClientIntakeForm): Record<string, string> {
  const m: Record<string, string> = {};
  for (const s of form.sections) {
    for (const f of s.fields) {
      m[f.id] = "";
    }
  }
  return m;
}

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  form: ClientIntakeForm | null;
  submission: ClientIntakeSubmission | null;
  cloudEnabled: boolean;
  onSaved: (submission: ClientIntakeSubmission) => void;
};

export function IntakeSubmissionEditDialog({
  open,
  onOpenChange,
  form,
  submission,
  cloudEnabled,
  onSaved,
}: Props) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open && form && submission) {
      setAnswers({ ...emptyAnswersForForm(form), ...submission.answers });
      setError(null);
    }
  }, [open, form, submission]);

  const setField = (id: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  };

  const save = async () => {
    if (!form || !submission || !cloudEnabled) return;
    setError(null);
    setSaving(true);
    try {
      const r = await updateIntakeSubmissionAction(form.id, submission.id, answers);
      if (!r.ok) {
        setError(r.error);
        return;
      }
      onSaved(r.submission);
      onOpenChange(false);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !saving && onOpenChange(o)}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit submission</DialogTitle>
          <DialogDescription>
            Update stored answers for this response. Validation matches the live form (required fields,
            email format). Uploaded files are not changed here.
          </DialogDescription>
        </DialogHeader>

        {form && submission ? (
          <div className="space-y-4">
            <p className="text-xs text-muted-foreground">
              Received {new Date(submission.created_at).toLocaleString()} · ID{" "}
              <span className="font-mono">{submission.id.slice(0, 8)}…</span>
            </p>
            {error ? (
              <p className="text-sm text-destructive" role="alert">
                {error}
              </p>
            ) : null}
            <div className="space-y-4">
              {form.sections.map((section) => (
                <Card key={section.id} className="border-border/70 bg-card/50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">{section.title}</CardTitle>
                    {section.description ? (
                      <CardDescription>{section.description}</CardDescription>
                    ) : null}
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {section.fields.map((field) => (
                      <div key={field.id} className="space-y-2">
                        <Label htmlFor={`edit-${field.id}`}>
                          {field.label}
                          {field.required ? <span className="text-destructive"> *</span> : null}
                        </Label>
                        {field.type === "textarea" ? (
                          <Textarea
                            id={`edit-${field.id}`}
                            placeholder={field.placeholder}
                            value={answers[field.id] ?? ""}
                            onChange={(e) => setField(field.id, e.target.value)}
                            rows={4}
                            disabled={saving}
                          />
                        ) : field.type === "select" && field.options?.length ? (
                          <Select
                            value={answers[field.id]?.trim() ? answers[field.id] : "__none__"}
                            onValueChange={(v) =>
                              setField(field.id, v === "__none__" ? "" : v)
                            }
                            disabled={saving}
                          >
                            <SelectTrigger id={`edit-${field.id}`}>
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
                            id={`edit-${field.id}`}
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
                            disabled={saving}
                          />
                        )}
                      </div>
                    ))}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ) : null}

        <DialogFooter>
          <Button type="button" variant="outline" disabled={saving} onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            type="button"
            disabled={saving || !cloudEnabled || !form || !submission}
            onClick={() => void save()}
          >
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving…
              </>
            ) : (
              "Save changes"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
