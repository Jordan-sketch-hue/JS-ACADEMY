/**
 * shared/lib/lp-config.ts — Landing page type registry.
 *
 * 20 LP types, each with default sections, conversion goal, and schema type.
 */

export type LPType =
  | "lead-gen" | "product-launch" | "event" | "booking" | "offer"
  | "coming-soon" | "waitlist" | "webinar" | "free-resource" | "case-study"
  | "about" | "portfolio" | "pricing" | "faq" | "contact"
  | "referral" | "giveaway" | "quiz" | "survey" | "thank-you";

export interface LPTypeConfig {
  label: string;
  goal: string;
  defaultSections: string[];
  schemaType?: string;
}

export const LP_TYPE_CONFIG: Record<LPType, LPTypeConfig> = {
  "lead-gen":        { label: "Lead Generation",     goal: "capture_lead",    defaultSections: ["hero","benefits","lead-form","social-proof"] },
  "product-launch":  { label: "Product Launch",      goal: "purchase",        defaultSections: ["hero","features","gallery","pricing","cta"] },
  "event":           { label: "Event Registration",  goal: "register",        defaultSections: ["hero","event-details","speakers","booking"] },
  "booking":         { label: "Booking Page",        goal: "book",            defaultSections: ["hero","services","booking-widget","faq"] },
  "offer":           { label: "Special Offer",       goal: "purchase",        defaultSections: ["hero","offer-details","countdown","cta"] },
  "coming-soon":     { label: "Coming Soon",         goal: "waitlist",        defaultSections: ["hero","countdown","waitlist-form"] },
  "waitlist":        { label: "Waitlist",            goal: "waitlist",        defaultSections: ["hero","benefits","waitlist-form","social-proof"] },
  "webinar":         { label: "Webinar Registration",goal: "register",        defaultSections: ["hero","agenda","speakers","booking"] },
  "free-resource":   { label: "Free Resource",       goal: "capture_lead",    defaultSections: ["hero","resource-preview","lead-form"] },
  "case-study":      { label: "Case Study",          goal: "read",            defaultSections: ["hero","challenge","solution","results"] },
  "about":           { label: "About Page",          goal: "trust",           defaultSections: ["hero","story","team","values","cta"] },
  "portfolio":       { label: "Portfolio",           goal: "enquire",         defaultSections: ["hero","portfolio-grid","testimonials","contact"] },
  "pricing":         { label: "Pricing Page",        goal: "purchase",        defaultSections: ["hero","pricing-table","faq","cta"] },
  "faq":             { label: "FAQ Page",            goal: "support",         defaultSections: ["hero","faq-list","contact"] },
  "contact":         { label: "Contact Page",        goal: "contact",         defaultSections: ["hero","contact-form","map","hours"] },
  "referral":        { label: "Referral Page",       goal: "refer",           defaultSections: ["hero","benefits","referral-form"] },
  "giveaway":        { label: "Giveaway",            goal: "enter",           defaultSections: ["hero","prize-details","entry-form","rules"] },
  "quiz":            { label: "Quiz Funnel",         goal: "capture_lead",    defaultSections: ["hero","quiz","results","cta"] },
  "survey":          { label: "Survey Page",         goal: "respond",         defaultSections: ["hero","survey","thank-you"] },
  "thank-you":       { label: "Thank You Page",      goal: "retain",          defaultSections: ["hero","next-steps","social-share"] },
};

/** Supabase row shape for lp_pages table */
export interface LPPage {
  id: string;
  slug: string;
  tenant_id: string;
  lp_type: LPType;
  title: string;
  headline: string;
  subline?: string;
  cta_label?: string;
  cta_href?: string;
  og_image?: string;
  variant?: "a" | "b";
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  config?: Record<string, unknown>;
  published: boolean;
  created_at: string;
  updated_at: string;
}
