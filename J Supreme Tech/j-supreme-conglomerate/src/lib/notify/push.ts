import webpush from "web-push";
import { getServiceSupabase } from "@/lib/supabase/admin";

const VAPID_PUBLIC = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ?? "";
const VAPID_PRIVATE = process.env.VAPID_PRIVATE_KEY ?? "";
const VAPID_SUBJECT =
  process.env.VAPID_SUBJECT ?? "mailto:ops@jsupremetech.online";

if (VAPID_PUBLIC && VAPID_PRIVATE) {
  webpush.setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC, VAPID_PRIVATE);
}

export interface PushPayload {
  title: string;
  body: string;
  url?: string;
  tag?: string;
  urgent?: boolean;
}

export async function sendPushToAll(payload: PushPayload): Promise<void> {
  if (!VAPID_PUBLIC || !VAPID_PRIVATE) {
    console.warn("[push] VAPID keys not configured — skipping");
    return;
  }
  const sb = getServiceSupabase();
  if (!sb) return;

  const { data: subs, error } = await sb
    .from("push_subscriptions")
    .select("endpoint, subscription")
    .eq("active", true);

  if (error || !subs?.length) return;

  const message = JSON.stringify(payload);

  const results = await Promise.allSettled(
    subs.map((row) =>
      webpush.sendNotification(
        row.subscription as webpush.PushSubscription,
        message
      )
    )
  );

  // Deactivate subscriptions the push service says are gone (410/404).
  const expired: string[] = [];
  for (let i = 0; i < results.length; i++) {
    const r = results[i];
    if (r.status === "rejected") {
      const err = r.reason as { statusCode?: number };
      if (err?.statusCode === 410 || err?.statusCode === 404) {
        expired.push(subs[i].endpoint);
      }
    }
  }

  if (expired.length) {
    await sb
      .from("push_subscriptions")
      .update({ active: false })
      .in("endpoint", expired);
  }
}
