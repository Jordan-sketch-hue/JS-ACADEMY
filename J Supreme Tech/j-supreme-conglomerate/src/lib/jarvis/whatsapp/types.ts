/** Shared types + display metadata for the WhatsApp reader surface. */

export type WaCategory =
  | "payment"
  | "order"
  | "shipment"
  | "scheduling"
  | "inquiry"
  | "support"
  | "personal"
  | "spam"
  | "general";

export type WaThreadRow = {
  id: string;
  chat_id: string;
  chat_name: string | null;
  phone: string | null;
  is_group: boolean;
  last_message_text: string | null;
  last_message_at: string | null;
  last_message_from_me: boolean;
  message_count: number;
  category: WaCategory | null;
  priority: "high" | "medium" | "low" | null;
  summary: string | null;
  action_needed: string | null;
  needs_reply: boolean;
  triage_engine: string | null;
  extracted_at: string | null;
  status: "open" | "done" | "dismissed";
  meta: Record<string, unknown>;
  created_at: string;
  updated_at: string;
};

export type WaSettingsRow = {
  id: string;
  paused: boolean;
  capture_mode: "all_business" | "action_money_shipping" | "urgent_only";
  skip_groups: boolean;
  linked: boolean;
  device_label: string | null;
  last_qr_at: string | null;
  last_event_at: string | null;
  last_note: string | null;
  autoreply_enabled: boolean;
  client_allowlist: Record<string, string>;
  updated_at: string;
};

export const CATEGORY_META: Record<WaCategory, { label: string; emoji: string }> = {
  payment: { label: "Payment", emoji: "💵" },
  order: { label: "Order", emoji: "🧾" },
  shipment: { label: "Shipment", emoji: "📦" },
  scheduling: { label: "Scheduling", emoji: "📅" },
  inquiry: { label: "Inquiry", emoji: "❓" },
  support: { label: "Support", emoji: "🛠" },
  personal: { label: "Personal", emoji: "💬" },
  spam: { label: "Spam / scam", emoji: "🚩" },
  general: { label: "General", emoji: "•" },
};

export const CATEGORY_ORDER: WaCategory[] = [
  "support",
  "payment",
  "shipment",
  "order",
  "scheduling",
  "inquiry",
  "spam",
  "personal",
  "general",
];
