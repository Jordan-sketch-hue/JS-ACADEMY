"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { fetchWorkspaceContextMarkdown } from "@/actions/workspace-context-export";
import { Loader2 } from "lucide-react";

export function WorkspaceContextExporter() {
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const run = async (mode: "copy" | "download") => {
    setBusy(true);
    setNotice(null);
    try {
      const res = await fetchWorkspaceContextMarkdown();
      if (!res.ok) {
        setNotice(res.error);
        return;
      }
      if (mode === "copy") {
        await navigator.clipboard.writeText(res.markdown);
        setNotice("Copied Markdown to your clipboard — paste into Cursor or ChatGPT.");
        return;
      }
      const blob = new Blob([res.markdown], { type: "text/markdown;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `j-supreme-workspace-${new Date().toISOString().slice(0, 10)}.md`;
      a.click();
      URL.revokeObjectURL(url);
      setNotice("Download started (.md). Keep this file private if it contains client data.");
    } catch (e) {
      setNotice(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        <Button type="button" size="sm" disabled={busy} onClick={() => void run("copy")}>
          {busy ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Copy snapshot
        </Button>
        <Button type="button" size="sm" variant="secondary" disabled={busy} onClick={() => void run("download")}>
          Download .md
        </Button>
      </div>
      {notice ? <p className="text-xs text-muted-foreground">{notice}</p> : null}
      <p className="text-xs text-muted-foreground">
        This uses your live Supabase-backed roster and tasks (same scope as the rest of the signed-in app). It never embeds API keys.
      </p>
    </div>
  );
}
