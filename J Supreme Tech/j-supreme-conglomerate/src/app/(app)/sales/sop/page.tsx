import { ClipboardCheck } from "lucide-react";
import { Card } from "@/components/ui/card";

export const metadata = { title: "Sales SOP · J Supreme" };

function H({ children }: { children: React.ReactNode }) {
  return <h2 className="mt-7 text-lg font-semibold tracking-tight">{children}</h2>;
}
function P({ children }: { children: React.ReactNode }) {
  return <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{children}</p>;
}
function LI({ children }: { children: React.ReactNode }) {
  return <li className="text-sm leading-relaxed text-muted-foreground">{children}</li>;
}

export default function SalesSopPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-4 p-4 sm:p-6">
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-semibold tracking-tight">
          <ClipboardCheck className="h-6 w-6" /> Sales Department — SOP &amp; Architecture
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          How the automated outreach engine works, end to end, and how to operate it.
        </p>
      </div>

      <Card className="p-6">
        <H>1. What it does</H>
        <P>
          A fully-automatic B2B sales engine. Every day it (a) sources real, verified business
          contacts via Hunter across four regions — Jamaica, the Caribbean, Europe, and the Americas
          — (b) drafts a personalised, branded email pitching J Supreme tech &amp; marketing and
          asking for the prospect&apos;s budget, (c) sends it from a dedicated outreach subdomain via
          Resend, BCCing you, (d) captures replies into the in-app Inbox and stops follow-ups, and
          (e) enforces legal compliance on every message.
        </P>

        <H>2. Daily flow</H>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <LI>
            <strong>Cron tick</strong> (every 20 min, 8am–5pm Jamaica) hits{" "}
            <code>/api/cron/sales-engine</code>.
          </LI>
          <LI>
            <strong>Source:</strong> if the prospect pool is thin, Hunter discovers companies by
            region and resolves one verified contact per domain (≥ confidence threshold).
          </LI>
          <LI>
            <strong>Select:</strong> round-robin across enabled regions so every market is touched,
            highest fit-score first. Due follow-ups go before new cold sends.
          </LI>
          <LI>
            <strong>Render:</strong> template + merge tags → branded header/footer + legal footer.
          </LI>
          <LI>
            <strong>Send:</strong> via Resend with one-click List-Unsubscribe headers, BCC to you.
            Paced in small batches per tick (not a burst) to protect deliverability.
          </LI>
          <LI>
            <strong>Track:</strong> Resend webhooks update delivered/opened/bounced/complained;
            bounces &amp; complaints auto-suppress.
          </LI>
        </ul>

        <H>3. The warm-up ramp</H>
        <P>
          A brand-new sending domain that suddenly emits 50 cold emails/day looks like spam and gets
          throttled. The engine ramps: ~10/day for 3 days, 20, 30, 40, then your full target around
          day 14. Steady-state hits your 50/day. Toggle in Settings once the domain has a track
          record.
        </P>

        <H>4. Legal compliance (non-optional, built into code)</H>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <LI>Truthful from-name, subject, and sender identity on every email.</LI>
          <LI>Your physical postal address in every footer (CAN-SPAM / PECR). Set it in Settings.</LI>
          <LI>
            One-click unsubscribe (RFC 8058 header + footer link). Opt-outs are honoured instantly
            and permanently via the suppression list — checked before every send.
          </LI>
          <LI>Only verified business addresses; nothing is ever invented or scraped deceptively.</LI>
          <LI>EU sends include a legitimate-interest note; disable the Europe region to opt out.</LI>
          <LI>Bounces &amp; spam complaints auto-suppress to protect the domain.</LI>
        </ul>

        <H>5. One-time setup checklist</H>
        <ol className="mt-2 list-decimal space-y-1 pl-5">
          <LI>
            <strong>Verify the sending domain.</strong> Add <code>go.jsupremetech.online</code> in
            Resend → add the SPF, DKIM &amp; DMARC DNS records it shows to Namecheap. (Records &amp;
            walkthrough are in the repo SOP doc.)
          </LI>
          <LI>
            <strong>Set Vercel env vars</strong> on the conglomerate project:
            <code> RESEND_API_KEY</code>, <code>SALES_OUTREACH_FROM=sales@go.jsupremetech.online</code>,
            <code> SALES_REPLY_TO</code>, <code>HUNTER_API_KEY</code>,
            <code> SALES_WEBHOOK_SECRET</code>, <code>SALES_UNSUBSCRIBE_SECRET</code>,
            <code> NEXT_PUBLIC_APP_URL=https://jsupremeconglomerate.online</code>.
          </LI>
          <LI>
            <strong>Add Resend webhooks</strong> → events to
            <code> /api/sales/events?key=SECRET</code>; inbound to
            <code> /api/sales/inbound?key=SECRET</code> (point the subdomain MX at Resend for in-app
            replies).
          </LI>
          <LI>
            <strong>Set your postal address</strong> in Settings (legal requirement) and your
            booking/calendar URL for the CTA.
          </LI>
        </ol>
        <P>
          Until the domain is verified the engine still <em>collects</em> prospects — sending begins
          automatically the moment Resend + the from-address are live. Nothing else to flip.
        </P>

        <H>6. Operating it day to day</H>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <LI>
            <strong>Dashboard:</strong> today&apos;s count vs. ceiling, opens, replies, bounces, and
            the &quot;Run engine now&quot; button for an immediate tick.
          </LI>
          <LI>
            <strong>Prospects:</strong> the live cold-email sheet — filter by region, import your own
            lists, suppress/disqualify anyone.
          </LI>
          <LI>
            <strong>Inbox:</strong> reply to interested prospects in-app (sends from your outreach
            address, BCCs you). Replies also reach your Gmail thread directly.
          </LI>
          <LI>
            <strong>Campaigns:</strong> pause/activate a whole region in one click.
          </LI>
          <LI>
            <strong>Templates:</strong> edit the copy; the branded shell + legal footer are applied
            automatically.
          </LI>
          <LI>
            <strong>Settings:</strong> master on/off, target, identity, regions, services, caps.
          </LI>
        </ul>

        <H>7. Data model</H>
        <P>
          Eight <code>sales_*</code> tables on the conglomerate Supabase project: settings,
          prospects, campaigns, templates, emails (outbox + log), messages (inbox), suppressions,
          events. All operator-only via the service role.
        </P>
      </Card>
    </div>
  );
}
