import "server-only";
import { getServiceSupabase } from "@/lib/supabase/admin";
import type { SalesTemplate, ServiceFocus } from "@/lib/sales/types";

/**
 * Built-in starter templates. Kept short (cold emails convert best at 50-125
 * words), personalised through {{merge}} tags, single clear ask = budget.
 */
export const DEFAULT_TEMPLATES: {
  name: string;
  step: number;
  service_focus: ServiceFocus;
  subject: string;
  body_md: string;
  is_default: boolean;
}[] = [
  {
    name: "Tech — initial",
    step: 1,
    service_focus: "tech",
    is_default: true,
    subject: "Quick idea for {{company}}",
    body_md: `Hi {{first_name}},

I'm {{sender_name}} at {{company_name}} — we build custom software, web apps and automation for teams in {{country}}, and a few things on {{company}}'s side looked like quick wins.

We've shipped booking systems, customer portals, internal dashboards and AI workflows for businesses across {{industry}}. Most start small and scale once they see the ROI.

If it's useful, tell me your rough budget and what's slowing you down right now — I'll come back with a scoped plan and a fixed price, no obligation.

Worth a short call?`,
  },
  {
    name: "Marketing — initial",
    step: 1,
    service_focus: "marketing",
    is_default: true,
    subject: "Growing {{company}} in {{country}}",
    body_md: `Hi {{first_name}},

I'm {{sender_name}} at {{company_name}} — we run marketing, branding and growth campaigns for businesses in {{country}}, and I had a couple of ideas for {{company}}.

We handle the full stack: brand, content, paid social, and the landing pages/funnels that actually convert the traffic. We tailor it to your market and your numbers.

Tell me your monthly budget and the one growth goal that matters most this quarter — I'll send back a campaign plan built around it.

Open to a quick chat?`,
  },
  {
    name: "Tech + Marketing — initial",
    step: 1,
    service_focus: "both",
    is_default: true,
    subject: "Helping {{company}} build + grow",
    body_md: `Hi {{first_name}},

I'm {{sender_name}}, founder of {{company_name}}. We do two things for businesses in {{country}}: build the tech (web apps, portals, automation) and drive the growth (branding, content, paid campaigns).

For a company in {{industry}}, that usually means a sharper site, a system that saves your team hours, and a marketing engine pointed at real revenue.

If you tell me your budget and your biggest priority right now, I'll come back with a clear, scoped plan and a price. No pressure either way.

Would a 15-minute call help?`,
  },
  {
    name: "Follow-up 1 — gentle bump",
    step: 2,
    service_focus: "both",
    is_default: true,
    subject: "Re: helping {{company}}",
    body_md: `Hi {{first_name}},

Floating this back up in case it got buried. Even a rough budget range tells me whether we're a fit — and if we're not, I'll point you in the right direction anyway.

Happy to share a couple of examples relevant to {{industry}} if that's easier than a call.`,
  },
  {
    name: "Follow-up 2 — close the loop",
    step: 3,
    service_focus: "both",
    is_default: true,
    subject: "Should I close your file, {{first_name}}?",
    body_md: `Hi {{first_name}},

I don't want to crowd your inbox — this is my last note. If growing or modernising {{company}} is on the radar this year, just reply with a number and I'll take it from there.

If now isn't the time, no problem at all. Wishing you and the {{company}} team well either way.`,
  },
];

export async function listTemplates(owner: string): Promise<SalesTemplate[]> {
  const sb = getServiceSupabase();
  if (!sb) return [];
  const { data } = await sb
    .from("sales_templates")
    .select("*")
    .eq("owner_clerk_id", owner)
    .order("step", { ascending: true })
    .order("created_at", { ascending: true });
  return (data ?? []) as SalesTemplate[];
}

export async function updateTemplate(
  owner: string,
  id: string,
  patch: Partial<SalesTemplate>,
): Promise<{ ok: boolean }> {
  const sb = getServiceSupabase();
  if (!sb) return { ok: false };
  const { owner_clerk_id: _o, id: _i, ...rest } = patch;
  void _o;
  void _i;
  await sb
    .from("sales_templates")
    .update({ ...rest, updated_at: new Date().toISOString() })
    .eq("owner_clerk_id", owner)
    .eq("id", id);
  return { ok: true };
}

/** Pick the best matching template for a prospect's service focus + step. */
export function pickTemplate(
  templates: SalesTemplate[],
  serviceFocus: ServiceFocus,
  step: number,
): SalesTemplate | null {
  const atStep = templates.filter((t) => t.step === step);
  return (
    atStep.find((t) => t.service_focus === serviceFocus) ||
    atStep.find((t) => t.service_focus === "both") ||
    atStep[0] ||
    null
  );
}
