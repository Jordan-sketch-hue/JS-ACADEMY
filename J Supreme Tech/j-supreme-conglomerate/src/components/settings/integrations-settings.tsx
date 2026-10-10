"use client";

import { useCallback, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Copy, ExternalLink } from "lucide-react";
import Link from "next/link";

const ENV_BLOCK = `# Supabase — Project Settings → API
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# Optional: stable owner id for your user in Postgres (defaults if unset)
# OS_OWNER_ID=your-stable-id

# Dev only: bypass (never in production)
# OS_DEV_AUTH_BYPASS=true
# OS_DEV_USER_ID=local-dev-user`;

function CopyRow({ label, value }: { label: string; value: string }) {
  const [done, setDone] = useState(false);
  const copy = useCallback(() => {
    void navigator.clipboard.writeText(value).then(() => {
      setDone(true);
      setTimeout(() => setDone(false), 2000);
    });
  }, [value]);

  return (
    <div className="flex flex-col gap-1 rounded-lg border border-border/60 bg-background/30 px-3 py-2 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="font-mono text-xs font-medium text-foreground">{label}</p>
        <p className="text-[11px] text-muted-foreground">Paste in Vercel → Env</p>
      </div>
      <Button variant="ghost" size="sm" className="shrink-0 gap-1" onClick={copy}>
        {done ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
        {done ? "Copied" : "Copy name"}
      </Button>
    </div>
  );
}

export function IntegrationsSettings() {
  const [blockDone, setBlockDone] = useState(false);
  const copyBlock = () => {
    void navigator.clipboard.writeText(ENV_BLOCK).then(() => {
      setBlockDone(true);
      setTimeout(() => setBlockDone(false), 2000);
    });
  };

  return (
    <div id="integrations" className="scroll-mt-24 space-y-6">
      <Card className="border-primary/25 bg-primary/[0.06]">
        <CardHeader>
          <CardTitle className="text-base">Where your data is saved</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p>
            <strong className="text-foreground">Closing a browser tab does not delete your data</strong> when the app is
            connected to Supabase: tasks, CRM records, and other entries live in Postgres under your account id.
          </p>
          <p>
            <strong className="text-foreground">Without Supabase env vars</strong>, tasks are still saved in{" "}
            <strong className="text-foreground">this browser</strong> (localStorage) so they survive refresh. Add{" "}
            <strong className="text-foreground">NEXT_PUBLIC_SUPABASE_URL</strong> and{" "}
            <strong className="text-foreground">SUPABASE_SERVICE_ROLE_KEY</strong> below (then redeploy) to sync data
            across devices and back up to Postgres; other modules (CRM, projects) still need Supabase for cloud data.
          </p>
        </CardContent>
      </Card>

      <Card className="border-amber-500/25 bg-amber-500/[0.06]">
        <CardHeader>
          <CardTitle className="text-base text-amber-100">Single-user access</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>
            This workspace is built for <strong className="text-foreground">one primary user</strong>. There is no hosted
            login provider: the app uses a stable owner id from env (or a built-in default) so you can use the dashboard
            without third-party auth keys.
          </p>
          <p>
            Set <strong className="text-foreground">OS_OWNER_ID</strong> in production if you want a specific stable id for
            rows in Supabase; otherwise the default id is used.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">1. Vercel environment variables</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-muted-foreground">
          <ol className="list-inside list-decimal space-y-2">
            <li>
              Open your project in the{" "}
              <a
                href="https://vercel.com/dashboard"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-primary underline"
              >
                Vercel dashboard <ExternalLink className="inline h-3 w-3" />
              </a>
            </li>
            <li>
              <strong className="text-foreground">Settings → Environment Variables</strong>
            </li>
            <li>Add each name below for <strong className="text-foreground">Production</strong> (and Preview if you want).</li>
            <li>
              <strong className="text-foreground">Redeploy</strong> the latest deployment (Deployments → … → Redeploy).
            </li>
          </ol>
          <div className="grid gap-2 sm:grid-cols-2">
            <CopyRow label="NEXT_PUBLIC_SUPABASE_URL" value="NEXT_PUBLIC_SUPABASE_URL" />
            <CopyRow label="SUPABASE_SERVICE_ROLE_KEY" value="SUPABASE_SERVICE_ROLE_KEY" />
            <CopyRow label="OS_OWNER_ID" value="OS_OWNER_ID" />
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" size="sm" className="gap-1" onClick={copyBlock}>
              {blockDone ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              {blockDone ? "Copied template" : "Copy .env template"}
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link href="/dashboard">Open dashboard</Link>
            </Button>
          </div>
          <pre className="max-h-48 overflow-auto rounded-lg border border-border/60 bg-muted/20 p-3 text-[11px] leading-relaxed text-muted-foreground">
            {ENV_BLOCK}
          </pre>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">2. Supabase</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>
            In{" "}
            <a
              href="https://supabase.com/dashboard"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline"
            >
              Supabase
            </a>
            , open <strong className="text-foreground">Project Settings → API</strong>. Use the project URL and{" "}
            <strong className="text-foreground">service_role</strong> key (server-only; never expose in client code).
          </p>
          <p>Run SQL migrations from <code className="rounded bg-muted px-1">supabase/migrations</code> in the SQL editor or CLI.</p>
        </CardContent>
      </Card>
    </div>
  );
}
