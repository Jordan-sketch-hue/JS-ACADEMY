"use client";

import { RotateCcw } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

/**
 * Iframes the local MT5 cockpit. The `version` state is appended to the src as a
 * cache-busting query and is used as the iframe `key` so React fully re-mounts
 * the element on reload — this is the only way to force a frame refresh when
 * the underlying URL hasn't changed (Chrome ignores location.reload() across
 * origins).
 */
export function Mt5DashboardIframe({ url }: { url: string }) {
  const [version, setVersion] = useState(0);
  const [lastReload, setLastReload] = useState<string>("");

  useEffect(() => {
    setLastReload(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
  }, [version]);

  const reload = useCallback(() => {
    setVersion((v) => v + 1);
  }, []);

  const src = version > 0 ? `${url}?v=${version}` : url;

  return (
    <Card className="relative overflow-hidden p-0">
      <div className="absolute right-3 top-3 z-10 flex items-center gap-2">
        {lastReload ? (
          <span className="rounded-md border border-border/60 bg-background/80 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground backdrop-blur-sm">
            Reloaded {lastReload}
          </span>
        ) : null}
        <Button
          size="sm"
          variant="secondary"
          onClick={reload}
          className="gap-1.5 border border-border/60 bg-background/80 backdrop-blur-sm"
        >
          <RotateCcw className="h-3.5 w-3.5" /> Reload
        </Button>
      </div>
      <iframe
        key={version}
        src={src}
        title="MT5 Markups dashboard"
        className="h-[82vh] w-full border-0"
      />
    </Card>
  );
}
