/**
 * Angel — human-takeover detection ("don't talk over Jordan").
 *
 * Angel only ever looked at INBOUND client messages to decide whether to auto-
 * reply. It had no idea when the owner was personally handling a chat — so if a
 * client messaged while Jordan was mid-reply in the IG/Messenger app, Angel could
 * fire its own auto-reply on top of his. This module is the missing signal.
 *
 * How we tell "Jordan replied" apart from "Angel replied": every outbound message
 * comes back from Meta as `fromClient = false`, so the only way to distinguish the
 * two is to remember what Angel itself sent. `addAngelSend` stamps a fingerprint
 * of each Angel send onto the thread's `meta.angel_sent` ring buffer. Any outbound
 * message whose fingerprint ISN'T in that set was typed by a human → Jordan.
 *
 * Detection is layered so it works no matter how the message reaches us:
 *  - the 5-min cron poll surfaces Jordan's manual replies as outbound messages;
 *  - the webhook `message_echoes` event (when subscribed) fires in real time;
 *  - either path stamps `meta.human_takeover_at`, which survives even if the raw
 *    message rows haven't been stored yet.
 *
 * While a takeover is "active" (within COOLDOWN of Jordan's last manual reply),
 * Angel suppresses auto-sends, follow-ups, and seen-hooks on that thread. It still
 * drafts a suggestion into the queue — that's invisible to the client and handy
 * for Jordan — it just never sends on its own.
 */
import type { AngelMessage } from "./types";

/** Outbound texts to remember per thread (cap the ring buffer so meta stays small). */
const ANGEL_SENT_CAP = 12;

/**
 * How long after Jordan's last manual reply Angel stays hands-off on that thread.
 * Tunable via ANGEL_TAKEOVER_COOLDOWN_MIN; defaults to 15 minutes (Jordan's pick) —
 * long enough to cover a back-and-forth, short enough that Angel resumes once he
 * steps away. Setting the env to 0 disables the cooldown guard entirely (not
 * recommended).
 */
export function cooldownMs(): number {
  const min = Number(process.env.ANGEL_TAKEOVER_COOLDOWN_MIN);
  const safe = Number.isFinite(min) && min >= 0 ? min : 15;
  return safe * 60 * 1000;
}

/** Normalize a message body to a stable fingerprint for round-trip matching. */
export function fingerprint(text: string | null | undefined): string {
  return (text ?? "").toLowerCase().replace(/\s+/g, " ").trim();
}

type MetaBag = Record<string, unknown> | null | undefined;

function angelFingerprints(meta: MetaBag): Set<string> {
  const arr = (meta as Record<string, unknown> | null)?.angel_sent;
  return new Set(Array.isArray(arr) ? (arr as unknown[]).map((v) => String(v)) : []);
}

/**
 * Return `meta` with `text`'s fingerprint appended to the Angel-sent ring buffer.
 * Call this for every successful Angel send so the send can never be mistaken for
 * a human reply on the next sync.
 */
export function addAngelSend(meta: MetaBag, text: string): Record<string, unknown> {
  const base = (meta as Record<string, unknown> | null) ?? {};
  const fp = fingerprint(text);
  if (!fp) return base;
  const prev = (Array.isArray(base.angel_sent) ? (base.angel_sent as unknown[]).map(String) : []).filter(
    (v) => v !== fp,
  );
  prev.push(fp);
  return { ...base, angel_sent: prev.slice(-ANGEL_SENT_CAP) };
}

/**
 * Newest outbound message that Angel did NOT send (i.e. a human/Jordan reply),
 * as epoch ms — or null if there's no such message in the supplied list.
 */
export function newestHumanOutboundMs(messages: AngelMessage[], meta: MetaBag): number | null {
  const mine = angelFingerprints(meta);
  let newest: number | null = null;
  for (const m of messages) {
    if (m.fromClient) continue; // inbound — that's the client, not the owner
    const body = m.body?.trim();
    if (!body) continue; // attachments / reactions carry no text to fingerprint
    if (mine.has(fingerprint(body))) continue; // Angel's own send
    const ts = m.createdTime ? Date.parse(m.createdTime) : NaN;
    if (!Number.isNaN(ts)) newest = Math.max(newest ?? 0, ts);
  }
  return newest;
}

/**
 * Is the owner actively handling this thread right now? True when Jordan's most
 * recent manual reply — found either in the live message list OR in a previously
 * stamped `meta.human_takeover_at` — falls inside the cooldown window.
 */
export function humanTakeoverActive(opts: {
  messages?: AngelMessage[];
  meta?: MetaBag;
  now?: number;
}): boolean {
  const now = opts.now ?? Date.now();
  const window = cooldownMs();
  if (window <= 0) return false;

  const stamped =
    typeof (opts.meta as Record<string, unknown> | null)?.human_takeover_at === "string"
      ? Date.parse(String((opts.meta as Record<string, unknown>).human_takeover_at))
      : NaN;
  if (!Number.isNaN(stamped) && now - stamped < window) return true;

  const live = opts.messages ? newestHumanOutboundMs(opts.messages, opts.meta) : null;
  return live != null && now - live < window;
}
