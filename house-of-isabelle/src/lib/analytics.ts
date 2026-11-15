/**
 * Analytics Integration
 * - Meta Pixel (client-side fbq events)
 * - Meta Conversions API (server-side, deduplication via event_id)
 * - Google Analytics 4 (client-side gtag + Measurement Protocol server-side)
 * - Google Shopping feed utility
 *
 * Deduplication: every event carries a unique event_id.
 * Client fires fbq("track", ..., {eventID: id})
 * Server fires CAPI with the same event_id — Meta deduplicates automatically.
 */

import { v4 as uuidv4 } from "uuid";
import type { MetaPixelEvent, GA4PurchaseEvent } from "@/types";

const META_PIXEL_ID   = process.env.NEXT_PUBLIC_META_PIXEL_ID       ?? "";
const CAPI_TOKEN      = process.env.META_CONVERSIONS_API_TOKEN       ?? "";
const GA4_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID ?? "";
const GA4_API_SECRET  = process.env.GA4_API_SECRET                   ?? "";

// ============================================================
// SERVER-SIDE: Meta Conversions API
// ============================================================

/** Fire a Meta Conversions API Purchase event (server-side) */
export async function sendMetaConversionsEvent(params: {
  eventName: string;
  eventId: string;
  eventTime?: number;
  value?: number;    // USD
  currency?: string;
  contentIds?: string[];
  numItems?: number;
  userEmail?: string;
  userPhone?: string;
  clientIp?: string;
  userAgent?: string;
  sourceUrl?: string;
}): Promise<void> {
  if (!META_PIXEL_ID || !CAPI_TOKEN) return;

  const userData: Record<string, string> = {};
  if (params.userEmail) {
    // Hash PII per Meta requirements
    const { createHash } = await import("crypto");
    userData.em = createHash("sha256").update(params.userEmail.toLowerCase().trim()).digest("hex");
  }
  if (params.userPhone) {
    const { createHash } = await import("crypto");
    userData.ph = createHash("sha256").update(params.userPhone.replace(/\D/g, "")).digest("hex");
  }
  if (params.clientIp)  userData.client_ip_address = params.clientIp;
  if (params.userAgent) userData.client_user_agent  = params.userAgent;

  const event: Record<string, unknown> = {
    event_name:  params.eventName,
    event_id:    params.eventId,
    event_time:  params.eventTime ?? Math.floor(Date.now() / 1000),
    action_source: "website",
    user_data:   userData,
  };

  if (params.sourceUrl) event.event_source_url = params.sourceUrl;

  if (params.value !== undefined) {
    event.custom_data = {
      value:        params.value,
      currency:     params.currency ?? "USD",
      content_ids:  params.contentIds ?? [],
      num_items:    params.numItems ?? 0,
    };
  }

  const res = await fetch(
    `https://graph.facebook.com/v19.0/${META_PIXEL_ID}/events?access_token=${CAPI_TOKEN}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data: [event] }),
    }
  );

  if (!res.ok) {
    const err = await res.text();
    console.error(`[capi] event failed: ${res.status} — ${err}`);
  }
}

/** Fire GA4 Measurement Protocol event (server-side) */
export async function sendGA4Event(params: {
  clientId: string;   // anonymised browser client_id from cookie
  eventName: string;
  params: Record<string, unknown>;
}): Promise<void> {
  if (!GA4_MEASUREMENT_ID || !GA4_API_SECRET) return;

  const res = await fetch(
    `https://www.google-analytics.com/mp/collect?measurement_id=${GA4_MEASUREMENT_ID}&api_secret=${GA4_API_SECRET}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        client_id: params.clientId,
        events: [{ name: params.eventName, params: params.params }],
      }),
    }
  );

  if (!res.ok) {
    console.error(`[ga4-mp] event failed: ${res.status}`);
  }
}

/** Fire a GA4 purchase event from the server (after confirmed payment) */
export async function sendGA4Purchase(
  clientId: string,
  event: GA4PurchaseEvent
): Promise<void> {
  await sendGA4Event({
    clientId,
    eventName: "purchase",
    params: {
      transaction_id: event.transactionId,
      value:          event.value / 100,  // JMD cents → dollars
      currency:       "JMD",
      items:          event.items,
    },
  });
}

// ============================================================
// CLIENT-SIDE HELPERS (called from browser components)
// These return script snippets / fbq call strings for use in layout.tsx
// ============================================================

export function getMetaPixelInitScript(): string {
  if (!META_PIXEL_ID) return "";
  return `
    !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
    n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
    document,'script','https://connect.facebook.net/en_US/fbevents.js');
    fbq('init','${META_PIXEL_ID}');
    fbq('track','PageView');
  `.trim();
}

export function getGA4InitScript(): string {
  if (!GA4_MEASUREMENT_ID) return "";
  return `
    window.dataLayer=window.dataLayer||[];
    function gtag(){dataLayer.push(arguments);}
    gtag('js',new Date());
    gtag('config','${GA4_MEASUREMENT_ID}',{send_page_view:true});
  `.trim();
}

/** Generates a unique event ID for deduplication */
export function newEventId(): string {
  return uuidv4();
}

// ============================================================
// GOOGLE SHOPPING FEED
// ============================================================

/** Converts JMD cents to dollar string for shopping feed */
export function jmdCentsToFeedPrice(cents: number): string {
  return `${(cents / 100).toFixed(2)} JMD`;
}
