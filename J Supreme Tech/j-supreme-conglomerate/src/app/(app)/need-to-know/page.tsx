import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { WorkspaceContextExporter } from "@/components/app/workspace-context-exporter";
import { BookOpen, Lightbulb, Sparkles, Terminal } from "lucide-react";

export const dynamic = "force-dynamic";

export default function NeedToKnowPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-8 pb-12">
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 text-muted-foreground">
          <BookOpen className="h-5 w-5" />
          <span className="text-xs font-medium uppercase tracking-[0.2em]">Playbook</span>
        </div>
        <h1 className="text-3xl font-semibold tracking-tight">Need to know &amp; tips</h1>
        <p className="text-muted-foreground">
          How to get the most from this workspace — CRM, money, trading data, creative work with{" "}
          <strong className="text-foreground">Adobe</strong>, and the built-in AI — without drowning in tools.
        </p>
      </div>

      <Card className="border-amber-500/30 bg-amber-500/[0.06]">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base text-amber-100">
            <Lightbulb className="h-4 w-4" /> API keys &amp; safety
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>
            Put <strong className="text-foreground">OPENAI_API_KEY</strong> only in server environment variables
            (e.g. Vercel → Settings → Environment Variables). Never paste keys into chat, client code, or public
            repos.
          </p>
          <p>
            If a key was ever exposed, <strong className="text-foreground">revoke it in the OpenAI dashboard</strong>{" "}
            and create a new one.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Terminal className="h-4 w-4 text-primary" /> Cursor &amp; ChatGPT (workspace snapshot)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p>
            <strong className="text-foreground">Cursor does not automatically log into your site.</strong> The safe
            pattern is: export a <strong className="text-foreground">Markdown snapshot</strong> of your Supabase-backed
            CRM + tasks, paste it into Cursor/ChatGPT, then ask for builds, copy, or code. That keeps secrets off the
            client and avoids “bypassing” auth — you stay explicit about what context you share.
          </p>
          <WorkspaceContextExporter />
          <p className="text-xs">
            Optional lock for scripts: set <strong className="text-foreground">WORKSPACE_CONTEXT_SECRET</strong> on the
            server. Then machine callers use{" "}
            <code className="rounded bg-muted px-1 py-0.5 font-mono text-[11px]">
              GET /api/v1/workspace-context
            </code>{" "}
            with{" "}
            <code className="rounded bg-muted px-1 py-0.5 font-mono text-[11px]">
              Authorization: Bearer …
            </code>
            . Buttons above still work from this signed-in page via a server action.
          </p>
          <p className="text-xs">
            Starter brand downloads (SVG) live on{" "}
            <Link href="/assets" className="text-primary underline">
              Creative assets
            </Link>
            .
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Daily operating rhythm</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <ul className="list-inside list-disc space-y-1">
            <li>
              <strong className="text-foreground">Morning:</strong>{" "}
              <Link href="/dashboard" className="text-primary underline">
                Dashboard
              </Link>{" "}
              for a snapshot; skim Tasks for due items.
            </li>
            <li>
              <strong className="text-foreground">Sales:</strong>{" "}
              <Link href="/crm" className="text-primary underline">
                CRM roster
              </Link>{" "}
              — edit cells inline, use <strong className="text-foreground">+ Add roster row</strong> for fast
              entry, sparkles for AI-assisted parsing from a sentence.
            </li>
            <li>
              <strong className="text-foreground">Money:</strong>{" "}
              <Link href="/invoices" className="text-primary underline">
                Invoices
              </Link>{" "}
              — draft → send → paid; tie to clients from CRM when possible.
            </li>
            <li>
              <strong className="text-foreground">Markets:</strong>{" "}
              <Link href="/trading" className="text-primary underline">
                Trading
              </Link>{" "}
              after your MT5 bridge runs so P/L, deposits, and withdrawals stay separated.
            </li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">CRM: scale without a heavy CRM tax</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <ul className="list-inside list-disc space-y-1">
            <li>
              One row per account; use <strong className="text-foreground">pipeline stage</strong> on the linked lead
              so the board stays honest.
            </li>
            <li>
              Use <strong className="text-foreground">next follow-up</strong> + notes so the table becomes your source
              of truth.
            </li>
            <li>
              AI row fill: describe multiple fields in one sentence; review the preview before applying.
            </li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Adobe Creative Cloud — practical scale tips</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <ul className="list-inside list-disc space-y-1">
            <li>
              <strong className="text-foreground">Libraries</strong> across PS / AI / ID for colors, type, and logos —
              one update propagates.
            </li>
            <li>
              <strong className="text-foreground">Templates &amp; presets</strong> for recurring deliverables
              (social sizes, lower-thirds, export settings).
            </li>
            <li>
              <strong className="text-foreground">Premiere / AE:</strong> nest sequences, use adjustment layers, batch
              export through Media Encoder for volume.
            </li>
            <li>
              Link finished assets from CRM <strong className="text-foreground">media &amp; product links</strong> so
              roster rows stay lightweight.
            </li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Sparkles className="h-4 w-4 text-primary" /> Jarvis AI (panel)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p>
            Open with <kbd className="rounded border px-1 font-mono text-[11px]">⌘⇧A</kbd> /{" "}
            <kbd className="rounded border px-1 font-mono text-[11px]">Ctrl+Shift+A</kbd>.
          </p>
          <ul className="list-inside list-disc space-y-1">
            <li>
              <strong className="text-foreground">Quick actions</strong> (before full chat):{" "}
              <em>add task: …</em>, <em>new task: …</em>, <em>todo: …</em>, <em>t: …</em>, <em>task: …</em>,{" "}
              <em># task: …</em>, <em>[tech|marketing|trading] …</em>, <em>add client …</em> (colon optional),{" "}
              <em>crm …</em>, <em>remind me to …</em>.
            </li>
            <li>
              With <strong className="text-foreground">OPENAI_API_KEY</strong> on the server, unmatched messages fall
              back to <strong className="text-foreground">natural-language chat</strong> with context about this app.
            </li>
            <li>
              CRM sparkles use <strong className="text-foreground">/api/v1/ai/crm-parse</strong> (same key).
            </li>
          </ul>
          <Button variant="outline" size="sm" className="gap-1" asChild>
            <Link href="/ai-workflows">Browse AI workflow ideas</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
