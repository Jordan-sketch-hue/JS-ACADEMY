"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const VAPID_PUBLIC = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ?? "";

function urlBase64ToUint8Array(base64: string): Uint8Array<ArrayBuffer> {
  const padding = "=".repeat((4 - (base64.length % 4)) % 4);
  const b64 = (base64 + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = atob(b64);
  const buf = new ArrayBuffer(raw.length);
  const view = new Uint8Array(buf);
  for (let i = 0; i < raw.length; i++) view[i] = raw.charCodeAt(i);
  return view;
}

type State = "unsupported" | "denied" | "off" | "on" | "loading";

export function PushNotificationsCard() {
  const [state, setState] = useState<State>("loading");
  const [testSent, setTestSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
      setState("unsupported");
      return;
    }
    if (Notification.permission === "denied") { setState("denied"); return; }
    navigator.serviceWorker.ready.then(async (reg) => {
      const sub = await reg.pushManager.getSubscription();
      setState(sub ? "on" : "off");
    }).catch(() => setState("off"));
  }, []);

  async function enable() {
    setError(null);
    setState("loading");
    try {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") { setState("denied"); return; }

      const reg = await navigator.serviceWorker.ready;
      const existing = await reg.pushManager.getSubscription();
      if (existing) await existing.unsubscribe();
      await new Promise((r) => setTimeout(r, 300));

      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC),
      });

      const res = await fetch("/api/push/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sub.toJSON()),
      });
      if (!res.ok) throw new Error(`subscribe POST ${res.status}`);

      setState("on");
      await sendTest();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to enable");
      setState("off");
    }
  }

  async function disable() {
    setState("loading");
    try {
      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.getSubscription();
      if (sub) await sub.unsubscribe();
      setState("off");
    } catch {
      setState("on");
    }
  }

  async function sendTest() {
    setTestSent(false);
    try {
      await fetch("/api/push/test", { method: "POST" });
      setTestSent(true);
    } catch {}
  }

  const isOn = state === "on";
  const busy = state === "loading";

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Push Notifications</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground">
          {state === "loading" && "Checking status…"}
          {state === "unsupported" && "Not supported in this browser."}
          {state === "denied" && "Blocked — enable in iOS Settings → Notifications → J Supreme."}
          {state === "off" && "Disabled. Toggle on to receive lock-screen alerts."}
          {state === "on" && "Enabled — you will receive lock-screen alerts."}
        </p>
        {error && <p className="text-xs text-destructive">{error}</p>}
        <div className="flex gap-2">
          {(state === "off" || state === "denied") && (
            <Button size="sm" onClick={enable} disabled={busy || state === "denied"}>
              Enable notifications
            </Button>
          )}
          {isOn && (
            <>
              <Button size="sm" variant="outline" onClick={sendTest} disabled={busy}>
                Send test
              </Button>
              <Button size="sm" variant="ghost" onClick={disable} disabled={busy}>
                Disable
              </Button>
            </>
          )}
        </div>
        {testSent && (
          <p className="text-xs text-muted-foreground">Test sent — check your lock screen.</p>
        )}
      </CardContent>
    </Card>
  );
}
