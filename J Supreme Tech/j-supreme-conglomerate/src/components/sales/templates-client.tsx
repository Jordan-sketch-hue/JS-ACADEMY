"use client";

import { useState, useTransition } from "react";
import { FileText, Save } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { SERVICE_LABEL, type SalesTemplate } from "@/lib/sales/types";
import { updateTemplateAction } from "@/app/(app)/sales/actions";

const MERGE_TAGS = [
  "first_name",
  "contact_name",
  "company",
  "industry",
  "country",
  "region",
  "service_line",
  "sender_name",
  "company_name",
  "site_url",
];

function TemplateCard({ t }: { t: SalesTemplate }) {
  const [subject, setSubject] = useState(t.subject);
  const [body, setBody] = useState(t.body_md);
  const [pending, start] = useTransition();
  const [saved, setSaved] = useState(false);
  const dirty = subject !== t.subject || body !== t.body_md;

  return (
    <Card className="space-y-3 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 font-medium">
          {t.name}
          <Badge variant="secondary">step {t.step}</Badge>
          <Badge variant="outline">{SERVICE_LABEL[t.service_focus]}</Badge>
        </div>
        <Button
          size="sm"
          disabled={!dirty || pending}
          onClick={() =>
            start(async () => {
              await updateTemplateAction(t.id, { subject, body_md: body });
              setSaved(true);
              setTimeout(() => setSaved(false), 2000);
            })
          }
        >
          <Save className="mr-1.5 h-4 w-4" /> {saved ? "Saved" : pending ? "Saving…" : "Save"}
        </Button>
      </div>
      <div>
        <label className="text-xs font-medium text-muted-foreground">Subject</label>
        <Input value={subject} onChange={(e) => setSubject(e.target.value)} className="mt-1" />
      </div>
      <div>
        <label className="text-xs font-medium text-muted-foreground">Body</label>
        <Textarea
          rows={10}
          value={body}
          onChange={(e) => setBody(e.target.value)}
          className="mt-1 font-mono text-xs"
        />
      </div>
    </Card>
  );
}

export function TemplatesClient({ templates }: { templates: SalesTemplate[] }) {
  return (
    <div className="mx-auto max-w-3xl space-y-6 p-4 sm:p-6">
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-semibold tracking-tight">
          <FileText className="h-6 w-6" /> Templates
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Every send is wrapped in the branded header/footer + legal footer automatically. Edit the
          copy here.
        </p>
      </div>

      <Card className="p-4">
        <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground/70">
          Merge tags (common identifiers)
        </h2>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {MERGE_TAGS.map((m) => (
            <code key={m} className="rounded bg-muted px-2 py-0.5 text-xs">{`{{${m}}}`}</code>
          ))}
        </div>
      </Card>

      <div className="space-y-4">
        {templates.map((t) => (
          <TemplateCard key={t.id} t={t} />
        ))}
      </div>
    </div>
  );
}
