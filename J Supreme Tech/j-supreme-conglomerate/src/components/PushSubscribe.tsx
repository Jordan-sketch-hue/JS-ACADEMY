"use client";

import { useEffect, useRef } from "react";

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

/** Compare the stored applicationServerKey against the expected VAPID bytes. */
function vapidKeyMatches(
  stored: ArrayBuffer | null | undefined,
  expected: Uint8Array<ArrayBuffer>
): boolean {
  if (!stored) return false;
  const view = new Uint8Array(stored);
  if (view.length !== expected.length) return false;
  for (let i = 0; i < view.length; i++) if (view[i] !== expected[i]) return false;
  return true;
}

async function postSubscription(sub: PushSubscription) {
  const res = await fetch("/api/push/subscribe", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(sub.toJSON()),
  });
  if (!res.ok) throw new Error(`subscribe POST ${res.status}`);
}

/**
 * Invisible component — mounts once in the app layout.
 *
 * iOS-safe strategy:
 *  1. Read Notification.permission as a SYNC property — never call
 *     requestPermission() here. On iOS, calling requestPermission() outside
 *     a user-gesture context hangs indefinitely even when already 'granted'.
 *     If permission is 'default' (never asked), bail out — the button-based
 *     flow (user tap) must handle first-time grants on iOS.
 *  2. Compare the existing subscription's applicationServerKey bytes directly
 *     against the current VAPID key. More reliable than localStorage — works
 *     even after a device restore or profile wipe.
 *  3. If the key mismatches: unsubscribe, wait 300 ms (iOS APNs needs this
 *     gap before it will accept a new subscription from the same origin),
 *     then subscribe with the new key.
 *  4. Always re-POST the live subscription to keep the DB in sync (handles
 *     server-side DB wipes, etc.).
 */
export function PushSubscribe() {
  const done = useRef(false);

  useEffect(() => {
    if (done.current || !VAPID_PUBLIC) return;
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) return;
    done.current = true;

    async function syncSubscription() {
      try {
        // iOS: read permission as a sync property — do NOT await requestPermission()
        // outside a user gesture or it will hang forever.
        const permState = Notification.permission;
        if (permState !== "granted") {
          // 'denied' → nothing to do.
          // 'default' → first-time grant requires a user gesture; the explicit
          //   subscribe button in the UI handles that path.
          console.log("[push] permission not granted, skipping auto-subscribe");
          return;
        }

        const reg = await navigator.serviceWorker.ready;
        const existing = await reg.pushManager.getSubscription();
        const expectedKey = urlBase64ToUint8Array(VAPID_PUBLIC);

        if (existing) {
          if (vapidKeyMatches(existing.options.applicationServerKey, expectedKey)) {
            // Key matches — just keep the DB record fresh.
            await postSubscription(existing);
            console.log("[push] synced existing subscription");
            return;
          }
          // VAPID key rotated — existing subscription is dead.
          // Unsubscribe first, then wait for iOS APNs to process the removal
          // before subscribing again (immediate re-subscribe throws AbortError).
          console.log("[push] VAPID key mismatch — rotating subscription");
          await existing.unsubscribe();
          await new Promise((r) => setTimeout(r, 300));
        }

        // Create a fresh subscription with the current VAPID key.
        // Safe to call without a user gesture because permission is 'granted'.
        const sub = await reg.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: expectedKey,
        });

        await postSubscription(sub);
        console.log("[push] new subscription registered");
      } catch (err) {
        console.warn("[push] syncSubscription failed:", err);
      }
    }

    void syncSubscription();
  }, []);

  return null;
}
