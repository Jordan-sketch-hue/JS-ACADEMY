/**
 * scripts-data.ts — J Supreme's sales / lead-intake script library.
 *
 * Copy-paste-ready DM, comment, WhatsApp, voice-note and email scripts for
 * turning ad responses ("more info?" slide-ups) into captured, qualified,
 * closed — and expanded — leads. Covers the full funnel: ad → first reply →
 * qualify → mockup → price → objections → close → onboard → follow-up → upsell.
 *
 * Pricing anchors below are pulled from the LIVE source of truth on the JST
 * website (src/lib/serviceOffers.ts + jstPricing.ts) so a DM quote always
 * matches the WiPay checkout. If you change a price there, update it here too.
 *
 *   Custom builds (one-time, JMD):  Websites from J$55,000 · Branding from
 *   J$25,000 · Apps from J$90,000 · Stores from J$130,000.
 *   Social media marketing (monthly): J$30,000 / J$55,000 / J$80,000.
 *   Ready-made (Supreme Suite, monthly): from J$8,500/mo, 3-day free trial.
 *   US$1 ≈ J$157  (J$55,000 ≈ US$350 · J$8,500 ≈ US$54).
 *
 * Brand contact (stamp on closes / legitimacy replies):
 *   Site: jsupremetech.online · WhatsApp: (658) 218-2282
 *   Email: global.jsuprememarketing@gmail.com
 */

export type ScriptVariant = {
  /** Short tone label, e.g. "Short", "Warm", "Direct". */
  label: string;
  text: string;
};

export type Script = {
  id: string;
  title: string;
  category: string;
  /** Where to use it: "Instagram DM", "IG Comment", "WhatsApp", "Email", etc. */
  channel: string;
  /** One line — when to fire this script. */
  when: string;
  /** Primary, paste-ready copy. Use [Name], [business], [date], [link] as fill-ins. */
  body: string;
  /** Optional alternate tones for the same moment. */
  variants?: ScriptVariant[];
  /** Optional coaching note — the "why this works". */
  tip?: string;
  tags: string[];
};

export const SCRIPT_CATEGORIES = [
  "Ad & Auto-Reply",
  "Slide-Up / First Reply",
  "Vertical Openers",
  "Qualify the Lead",
  "What We Offer",
  "Free Mockup Hook",
  "Ready-Made Systems",
  "Pricing & Packages",
  "Budget Conversations",
  "Objections",
  "Close & Book",
  "Follow-Up",
  "Comment Replies",
] as const;

export const SCRIPTS_UPDATED = "2026-06-14";

export const SCRIPTS: Script[] = [
  // ─── AD & AUTO-REPLY ──────────────────────────────────────────────────
  {
    id: "ad-cta",
    title: "Story / Ad CTA line",
    category: "Ad & Auto-Reply",
    channel: "Story sticker / ad caption",
    when: "Put this on the ad itself to trigger slide-ups.",
    body: `Reply "INFO" or slide up 👆 and I'll send you a FREE mockup for your business.`,
    tip: "A specific, low-effort CTA (one word, free thing) out-pulls 'DM us' every time. The free mockup is the bait — everything downstream is the hook.",
    tags: ["cta", "ad", "story", "hook"],
  },
  {
    id: "ad-autoreply",
    title: "DM Auto-Reply (keyword: INFO)",
    category: "Ad & Auto-Reply",
    channel: "Instagram DM (automation)",
    when: "Set as your IG auto-reply for the keyword 'INFO'.",
    body: `Hey! 🙌 Thanks for reaching J Supreme. Drop your business name + what you do and a real human will send you a FREE mockup shortly. 👀`,
    tip: "Auto-replies get ~3 seconds of attention — lead with a warm hook + the single capture ask, and save the menu/pricing for the human reply once they answer. The automation opens the door; ALWAYS follow up personally within a few hours to close it.",
    tags: ["auto-reply", "automation", "keyword", "capture"],
  },
  {
    id: "ad-pinned",
    title: "Pinned comment on the ad",
    category: "Ad & Auto-Reply",
    channel: "IG Comment (pinned)",
    when: "Pin this on the ad post so every viewer sees the offer.",
    body: `Want one for YOUR business? Comment "INFO" or DM us — free mockup, no obligation. 🔗 jsupremetech.online`,
    tags: ["comment", "pinned", "ad", "cta"],
  },

  // ─── SLIDE-UP / FIRST REPLY ───────────────────────────────────────────
  {
    id: "first-allinone",
    title: "The Slide-Up Catch-All (start here)",
    category: "Slide-Up / First Reply",
    channel: "Instagram DM",
    when: "Someone slides up / DMs 'more info?' on the ad.",
    body: `Hey [Name] 🙌 Thanks for reaching out!

We're a one-stop studio — custom websites, apps & branding, all 100% owned by you — plus ready-made systems you can rent monthly.

Tell me a bit about your business and I'll send a free mockup + the best fit for you. 👀`,
    variants: [
      {
        label: "Short",
        text: `Hey [Name]! 🙌 We build custom sites, apps & branding (you own it all) and rent ready-made systems monthly. What's your business? I'll send a free mockup + the best fit.`,
      },
      {
        label: "Direct",
        text: `Hey [Name] — appreciate you reaching out. Quick one so I point you right: what do you do, and are you after a custom build or a ready-made system? I'll send a free mockup either way.`,
      },
    ],
    tip: "This is your default reply to ANY 'more info?'. It does 4 jobs in 3 lines: greets, says what we do, drops the free-mockup hook, and ends on a question that captures the lead. Always end on a question.",
    tags: ["opener", "slide-up", "catch-all", "capture", "mockup"],
  },
  {
    id: "first-warm",
    title: "Warm + personal opener",
    category: "Slide-Up / First Reply",
    channel: "Instagram DM",
    when: "Friendlier audience / referral / repeat follower.",
    body: `Heyy [Name], so glad you slid up! 🤝

Real quick — what's the name of your business and what are you trying to get done online?

Once I know that I'll put together a free mockup and show you exactly how we'd build it out.`,
    tags: ["opener", "warm", "capture"],
  },
  {
    id: "first-emoji",
    title: "Reply to an emoji / reaction",
    category: "Slide-Up / First Reply",
    channel: "Instagram DM",
    when: "They reacted to the story with 🔥/👀/❤️ but no words.",
    body: `Appreciate the love! 🔥 That's the kind of custom work we build.

Want a free mockup for your business? Drop the name + what you do and I'll get started.`,
    tags: ["opener", "reaction", "low-effort", "mockup"],
  },
  {
    id: "first-cold",
    title: "Cold outreach opener (you DM them)",
    category: "Slide-Up / First Reply",
    channel: "Instagram DM",
    when: "You're reaching out first to a business you'd like to work with.",
    body: `Hi [Name] — really like what you're doing with [business] 👏

I run J Supreme, a studio that builds custom websites, apps & branding (you own everything we make).

I'd love to mock up a free homepage concept for [business] — mind if I send it over?`,
    tip: "Lead with a SPECIFIC compliment about their actual business or it reads as spam. Ask permission before pitching — 'mind if I send it?' gets a yes that opens the conversation.",
    tags: ["cold", "outreach", "permission", "mockup"],
  },
  {
    id: "add-story-sticker",
    title: "Reply to a Story question-sticker answer",
    category: "Slide-Up / First Reply",
    channel: "Instagram DM",
    when: "They typed an answer into your ad Story's question-sticker.",
    body: `Thanks for tapping in on the story 🙌 — appreciate that!

So I point you right — what's [business] and what do you need most: a website, app, branding, or a ready-made system? I'll send a free mockup once I know.`,
    variants: [
      {
        label: "They named a need",
        text: `Love your answer on the story 👀 — "[their answer]" is exactly our lane. Drop your business name + a colour/vibe you like and I'll send a free mockup of how we'd build it.`,
      },
      {
        label: "Vague answer",
        text: `Thanks for tapping in on the story 🙌 Quick one so I point you right — what's the business and what are you trying to get done online? Free mockup on me once I know.`,
      },
    ],
    tip: "A question-sticker tap is warmer than a cold slide-up — they already raised a hand. Reference the exact sticker interaction so it reads as a real human noticing (not a copy-paste), then route straight to the free-mockup capture. Mirror their answer back if they gave one, to build instant rapport.",
    tags: ["opener", "story", "question-sticker", "instagram", "top-of-funnel", "mockup"],
  },
  {
    id: "add-story-poll",
    title: "Reply to a poll / quiz tap",
    category: "Slide-Up / First Reply",
    channel: "Instagram DM",
    when: "They tapped a poll or quiz option on your ad Story (e.g. 'Need a site? Yes / Not yet').",
    body: `You tapped "[their option]" on my poll 👀 — figured I'd reach out.

What do you do? If it's a fit I'll mock up a free concept for [business] so you can actually see it before deciding. No obligation.`,
    variants: [
      {
        label: "Tapped 'Yes / I need one'",
        text: `You voted you need one 🙌 Tell me the business + what you do and I'll design a free homepage mockup — if you love it we build it, if not no stress.`,
      },
      {
        label: "Tapped 'Not yet / maybe'",
        text: `Saw your poll tap — no rush at all 🙂 When you're ready to get [business] online I'll do a free mockup so the decision's easy. What do you do, out of curiosity?`,
      },
    ],
    tip: "Poll/quiz taps are pure top-of-funnel volume — and even a 'not yet' tap is a warm contact worth banking. Open low-pressure, reference the specific option they tapped so it feels personal, and convert straight to the free-mockup ask (or a soft follow-up hold for the 'not yet' crowd).",
    tags: ["opener", "story", "poll", "quiz", "instagram", "low-effort", "mockup"],
  },
  {
    id: "add-bio-link-warm",
    title: "Came from the bio link / 'saw your site'",
    category: "Slide-Up / First Reply",
    channel: "Instagram DM / WhatsApp",
    when: "They mention they browsed jsupremetech.online or came through the bio link.",
    body: `Glad you checked out the site, [Name]! 🙌 So you've already got a feel for the quality.

What caught your eye for [business] — a website, an app, branding, or a ready-made system? Tell me and I'll send a free mockup tailored to you.`,
    variants: [
      {
        label: "They asked 'is your site / work real?'",
        text: `100% real 🙌 that's all our actual client work at jsupremetech.online — courier apps, booking sites, online stores, full brands. So you're already up to speed: what are you looking to build for [business]? I'll send the right option.`,
      },
      {
        label: "Straight to mockup",
        text: `Appreciate you browsing the site! You've seen the standard 🔥 Want me to design a free mockup at that level for [business]? Just drop the business name + a vibe you like.`,
      },
    ],
    tip: "A bio-link lead has already passed the 'who are you' stage — DON'T re-explain the whole studio. Acknowledge they've browsed, skip the pitch, and jump straight to scoping + the mockup. Over-explaining a warm lead cools it.",
    tags: ["opener", "bio-link", "website-first", "warm-lead", "down-funnel"],
  },
  {
    id: "add-referral-intake",
    title: "'My friend [X] told me about you' (+ ask for one)",
    category: "Slide-Up / First Reply",
    channel: "WhatsApp / Instagram DM",
    when: "Inbound referral — a past/current client sent them (variant flips it to asking a happy client).",
    body: `Ayy, [referrer] is the best 🙌 Glad they sent you my way, [Name].

So I can do for you what we did for them — what's [business] and what are you trying to get done? I'll send a free mockup to get us started.`,
    variants: [
      {
        label: "Name the work",
        text: `Love that [referrer] put you on! 🤝 We built their [site/app/brand] — happy to bring that same energy to [business]. What do you need most? Free mockup on me to kick it off.`,
      },
      {
        label: "Ask a happy client (outbound)",
        text: `Hey [Name]! 🙌 Really glad you're happy with [their project]. Quick ask — know any other business owner who could use a site, app or branding? Send them my way (or their @) and I'll take great care of them, free mockup and all 🙏`,
      },
    ],
    tip: "Referrals are the cheapest, highest-trust lead source. For inbound, name-drop the referrer and the work you did for them to inherit that trust instantly. The outbound variant flips it — ask happy clients for the intro while they're glowing; that's where most referrals actually come from.",
    tags: ["referral", "word-of-mouth", "intake", "trust", "outbound"],
  },
  {
    id: "add-diaspora-usd",
    title: "Overseas / diaspora lead (USD + remote trust)",
    category: "Slide-Up / First Reply",
    channel: "Instagram DM / WhatsApp / Email",
    when: "Lead is abroad (diaspora or global B2B) and unsure about working with a Jamaica studio remotely.",
    body: `Wherever you are, we've got you 🌍 We work with clients across the US, UK, Canada and the Caribbean — everything's remote over WhatsApp/email, you approve each stage, and you pay securely by card in US$ (a Launch site is about US$350).

You own 100% of what we build. Tell me about [business] and I'll send a free mockup — timezone's no issue.`,
    variants: [
      {
        label: "Short",
        text: `Welcome from [country]! 🌍 We build remotely for clients worldwide — secure card payment in US$, you approve every step, you own it all. What's the business? Free mockup on me.`,
      },
      {
        label: "Timezone / how we work",
        text: `Different timezones is no issue — we keep everything in WhatsApp/email so you reply when it suits you, and you approve each stage online before paying. What's your time zone? Happy to mock something up so you see how smooth it runs.`,
      },
    ],
    tip: "Diaspora and global B2B pay in USD but need remote-trust reassurance first: how we work across timezones, that paying a JA studio by card is safe, and that they own everything. Quote the USD anchor (US$350 ≈ J$55,000) so the price feels concrete in their currency. The free mockup still does the closing.",
    tags: ["diaspora", "usd", "international", "remote", "trust", "b2b"],
  },

  // ─── VERTICAL OPENERS ─────────────────────────────────────────────────
  {
    id: "add-vertical-pack",
    title: "Industry-specific first replies (vertical pack)",
    category: "Vertical Openers",
    channel: "Instagram DM / WhatsApp",
    when: "You know their industry — name the exact pain + the exact system instead of a generic pitch. Fire the matching variant.",
    body: `Saw you run [business] 🙌 We build for [industry] all the time — I know the exact setup you need.

Send me your business name and I'll put together a free mockup of how it'd look for you. (Use a variant below for the specific trade.)`,
    variants: [
      {
        label: "Real estate",
        text: `Real estate? 🏠 A listings site with search + lead capture + a simple CRM so no enquiry slips through — all yours, no monthly platform fees. Want a free mockup of your listings page for [business]?`,
      },
      {
        label: "School / academy",
        text: `School or academy? 🎓 Online enrolment + payments + a student portal so sign-ups and fees stop living in WhatsApp. Want a free mockup for [business]?`,
      },
      {
        label: "Clothing / retail",
        text: `Clothing or retail? 🛍️ A proper online store you OWN — cart, checkout, card payments, inventory (no per-sale platform cut). Stores from J$130,000. Want a free mockup of your shop first?`,
      },
    ],
    tip: "Generic openers convert far worse than 'I know your exact pain.' Naming the trade AND the specific system signals you've done it before — half the trust battle. Keep your own private list of which live build to reference per vertical. Quote 'from J$X' only if they ask.",
    tags: ["opener", "vertical", "industry", "niche", "mockup"],
  },
  {
    id: "add-vertical-courier",
    title: "Courier / delivery first reply",
    category: "Vertical Openers",
    channel: "Instagram DM / WhatsApp",
    when: "Lead runs a courier, delivery or dispatch business.",
    body: `Courier business? 📦 The two things that bleed you are bookings buried in WhatsApp and customers calling "where's my package?" all day.

We build a booking + live-tracking app so orders come in clean and customers track themselves. Want a free mockup with [business]'s name + colours on it, [Name]?`,
    variants: [
      {
        label: "Ready-made angle",
        text: `Courier? Instead of a full build, we've got a ready-made booking + dispatch system you can switch on this week — 3-day free trial, from J$8,500/mo. Want me to spin one up so you can click around?`,
      },
      {
        label: "Short",
        text: `Courier business? We build the booking + tracking app so you stop running dispatch out of WhatsApp. Free mockup with your branding — want it? 📦`,
      },
    ],
    tip: "Name the exact pain (WhatsApp chaos + 'where's my package?' calls) before the solution — the lead feels seen. The ready-made variant routes a fast/budget-conscious courier to a switch-on system instead of a full build.",
    tags: ["opener", "vertical", "courier", "delivery", "tracking", "booking", "mockup"],
  },
  {
    id: "add-vertical-salon",
    title: "Salon / beauty first reply",
    category: "Vertical Openers",
    channel: "Instagram DM / WhatsApp",
    when: "Lead runs a salon, spa, barber, nails or beauty business.",
    body: `Salon/beauty? 💅 No-shows and back-to-back DMs to book are the killers.

We set you up with online booking + deposits so clients book themselves and put money down to hold the slot — no more empty chairs. Free mockup with your vibe + colours, [Name]?`,
    variants: [
      {
        label: "Ready-made angle",
        text: `Beauty business? Ready-made booking system with deposits to kill no-shows — clients book 24/7, you stop replying to DMs all day. 3-day free trial, from J$8,500/mo. Want it switched on?`,
      },
      {
        label: "Short",
        text: `Salon? Online booking + deposits so clients hold their own slots and no-shows drop. Free mockup with your colours — want one? 💅`,
      },
    ],
    tip: "'Deposits to stop no-shows' is the magic phrase for beauty — it ties the system directly to money they're currently losing. Lead with the loss, not the feature.",
    tags: ["opener", "vertical", "salon", "beauty", "booking", "deposits", "no-shows", "mockup"],
  },
  {
    id: "add-vertical-restaurant",
    title: "Restaurant / food first reply",
    category: "Vertical Openers",
    channel: "Instagram DM / WhatsApp",
    when: "Lead runs a restaurant, takeout, pizza shop or food business.",
    body: `Food business? 🍕 Taking orders by DM and phone is slow, and you're paying delivery apps a cut on every plate.

We build you your own online ordering + a clean site so customers order direct and you keep the margin. Want a free mockup of your menu page, [Name]?`,
    variants: [
      {
        label: "Store angle",
        text: `Restaurant? Your own ordering store means no per-order cut to the delivery apps. Starter Store J$130,000, you own it fully. Want a free mockup of how your menu would look?`,
      },
      {
        label: "Short",
        text: `Food spot? Your own online ordering = keep the margin the delivery apps take. Free mockup of your menu page — want it? 🍕`,
      },
    ],
    tip: "The wedge for restaurants is margin: their own ordering page means no cut to the aggregators. Frame it as money they keep, not money they spend.",
    tags: ["opener", "vertical", "restaurant", "food", "ordering", "store", "mockup"],
  },
  {
    id: "add-vertical-tours",
    title: "Tours / transfers first reply",
    category: "Vertical Openers",
    channel: "Instagram DM / WhatsApp",
    when: "Lead runs tours, transfers, excursions or an experiences business.",
    body: `Tours & transfers? 🌴 Tourists want to book and pay before they land — if you're only on WhatsApp you're losing the ones who want it instant.

We build a booking site that takes card (local J$ + global US$) so overseas guests book in seconds. Want a free mockup for [business], [Name]?`,
    variants: [
      {
        label: "Listings / marketplace angle",
        text: `Tours? Beyond a booking site, we can get you set up to take card from diaspora/overseas guests and look world-class doing it. What tours do you run? I'll send a free mockup + a plan.`,
      },
      {
        label: "Short",
        text: `Tours/transfers? A booking site that takes card from overseas guests before they land beats WhatsApp-only every time. Free mockup — want it? 🌴`,
      },
    ],
    tip: "For tourism, lead on capturing the OVERSEAS guest who wants to pay instantly in USD — that's revenue WhatsApp-only operators leave on the table. The deposit-taking booking site is the hook.",
    tags: ["opener", "vertical", "tours", "transfers", "tourism", "booking", "payments", "mockup"],
  },
  {
    id: "add-vertical-mover",
    title: "Movers / storage first reply",
    category: "Vertical Openers",
    channel: "Instagram DM / WhatsApp",
    when: "Lead runs a moving, relocation or storage company.",
    body: `Moving company? 🚚 If quotes and bookings live in your phone, jobs slip and follow-ups get forgotten.

We build a booking + quote system and a mover/warehouse CRM so every job, crew and customer is tracked in one place. Want a free mockup for [business]?`,
    variants: [
      {
        label: "Ready-made angle",
        text: `Movers? We've got a ready-made mover/warehouse CRM — quotes, jobs, crews and customers in one dashboard. 3-day free trial, from J$8,500/mo. Want me to set it up so you can try it?`,
      },
    ],
    tip: "For movers the CRM is the hook, not the website — they lose money to missed follow-ups, not to a weak homepage. Lead with the operational pain.",
    tags: ["opener", "vertical", "movers", "storage", "crm", "booking", "mockup"],
  },
  {
    id: "add-vertical-freight",
    title: "Freight / package forwarding first reply",
    category: "Vertical Openers",
    channel: "Instagram DM / WhatsApp",
    when: "Lead runs freight, shipping or a USA-to-JA package-forwarding business.",
    body: `Shipping / package forwarding? 📦 New shippers need to trust you, and existing ones keep asking "where's my package?"

We build a customer portal for tracking + pre-alerts + invoices, plus a site that builds trust. Want a free mockup of your tracking dashboard for [business]?`,
    variants: [
      {
        label: "Short",
        text: `Freight/forwarding? Customer portal for tracking + pre-alerts, plus a site that wins new shippers' trust. Free mockup of your tracking dashboard — want it? 📦`,
      },
    ],
    tip: "For forwarding, the two wedges are TRUST (new shippers) and self-serve TRACKING (kills the constant status DMs). Name both — that's the operator's daily reality.",
    tags: ["opener", "vertical", "freight", "forwarding", "shipping", "tracking", "portal", "mockup"],
  },

  // ─── QUALIFY THE LEAD ─────────────────────────────────────────────────
  {
    id: "qual-3q",
    title: "The 3-question qualifier",
    category: "Qualify the Lead",
    channel: "Instagram DM",
    when: "They've replied — now capture the details you need to quote.",
    body: `Love it 🙌 Three quick things so I can tailor this for you:

1) What's the business + industry?
2) What do you need most — website, app, branding, or a ready-made system?
3) When are you hoping to launch?

Answer those and I'll come back with a plan + a free mockup.`,
    tip: "Ask TIMELINE, not budget, first. Timeline reveals how serious they are without scaring them off — budget lands easier once they've seen value.",
    tags: ["qualify", "discovery", "capture", "questions"],
  },
  {
    id: "qual-budget",
    title: "Asking budget without killing it",
    category: "Qualify the Lead",
    channel: "Instagram DM",
    when: "They're engaged and you need to gauge spend.",
    body: `To point you to the right option — do you have a rough budget in mind, or want me to show you a few tiers so you can pick what fits? Either way works 👍`,
    tip: "Offering 'or I'll show you tiers' removes the pressure of naming a number. Most people pick the tiers — and then self-select.",
    tags: ["qualify", "budget", "tiers"],
  },
  {
    id: "qual-current",
    title: "What do they have now",
    category: "Qualify the Lead",
    channel: "Instagram DM",
    when: "You want to scope by reviewing their current setup.",
    body: `Got it! Do you already have a website/socials I can look at, or are we starting fresh?

Send me whatever you've got and I'll tell you exactly what I'd improve. 🔍`,
    tags: ["qualify", "audit", "discovery"],
  },
  {
    id: "qual-contact",
    title: "Capture their contact",
    category: "Qualify the Lead",
    channel: "Instagram DM",
    when: "Lead is warm — move them off IG before the algorithm buries the thread.",
    body: `Perfect — what's the best WhatsApp number or email to send the mockup + details to? I'll keep everything in one place for you. 📲`,
    tip: "IG DMs get buried and aren't searchable. Get a WhatsApp/email early so you own the follow-up channel and can log them in the CRM / Pipeline intake.",
    tags: ["qualify", "contact", "whatsapp", "handoff"],
  },
  {
    id: "add-voicenote-offer",
    title: "Offer to break it down by voice note",
    category: "Qualify the Lead",
    channel: "WhatsApp",
    when: "Lots of back-and-forth, or the lead seems unsure — switch to voice.",
    body: `Honestly might be easier if I send you a quick voice note breaking down your options for [business] — clearer than a wall of text 🎙️ Cool?

Give me 2 mins and I'll walk you through it.`,
    variants: [
      {
        label: "After they ask a big question",
        text: `Good question 🙌 Mind if I send a quick voice note? Easier to explain the pricing + how it'd work for [business] in 30 seconds than to type it all. One sec…`,
      },
      {
        label: "Invite theirs",
        text: `If it's easier for you, just drop me a voice note with what you need for [business] — I'll listen and come back with a plan + a free mockup. Whatever's easiest 👍`,
      },
    ],
    tip: "WhatsApp-first Jamaican culture runs on voice notes — they carry tone, warmth and authority text can't, and lift reply rates fast. Always ask 'cool?' first so it's invited, not intrusive, keep the note under ~90 seconds, and end on a question. A voice note also instantly proves there's a real human behind the account.",
    tags: ["voice-note", "whatsapp", "trust", "qualify", "human", "jamaica"],
  },
  {
    id: "add-voicenote-script",
    title: "Voice note: what to SAY (60-sec discovery + close)",
    category: "Qualify the Lead",
    channel: "WhatsApp (voice note — read aloud)",
    when: "They said yes to a voice note — here's the spoken script to record.",
    body: `Hey [Name], thanks again for reaching out — quick voice note so this is easy.

So J Supreme is basically one studio for your whole digital presence — custom websites, apps and branding, and the big thing is you own all of it, no rented templates.

For [business], the move is usually one of two things: a clean custom build that's 100% yours, from J$55,000 for a site — or if you want to move fast and keep it light, a ready-made system you switch on monthly with a 3-day free trial.

Here's what I'd love to do — send me your business name and a colour or vibe you like, and I'll put together a free mockup so you can see it before you spend a dollar. Sound good? Just reply here and I'll get started.`,
    variants: [
      {
        label: "Shorter (~30 sec)",
        text: `Hey [Name]! Quick one — J Supreme builds custom sites, apps and branding that you 100% own, plus ready-made systems you can rent monthly with a free trial. For [business] I'd love to send you a free mockup first so you can see the quality. Just drop your business name and a vibe you like and I'll start on it. Cool?`,
      },
    ],
    tip: "Write what to SAY, not type — natural, warm, one breath per idea. End on a single clear ask ('reply here'). The spoken close converts because tone carries the confidence text can't. Keep it under a minute.",
    tags: ["voice-note", "script", "whatsapp", "spoken", "close", "mockup"],
  },

  // ─── WHAT WE OFFER ────────────────────────────────────────────────────
  {
    id: "offer-menu",
    title: "The full menu (question-first)",
    category: "What We Offer",
    channel: "Instagram DM",
    when: "They ask 'what do you guys do?'",
    body: `Easier if I point you straight to it — are you after a website, an app, branding, or a system that runs your bookings/customers? I'll send a free mockup for whichever 👀

(Everything we build is 100% yours — no rented templates, no lock-in.)`,
    tip: "A question-first reply beats a brochure of bullets — it creates momentum toward capture instead of making the lead self-diagnose. Keep the ownership/no-lock-in differentiator, and end on an answerable question.",
    tags: ["offer", "menu", "services", "question-first"],
  },
  {
    id: "offer-onestudio",
    title: "One-studio pitch (the ad's promise)",
    category: "What We Offer",
    channel: "Instagram DM",
    when: "Reinforcing the 'one studio for your whole digital presence' angle.",
    body: `For [business] that means one team does the logo, the site AND the content — handed to you, owned by you, no juggling 5 freelancers.

Send me your business name + a vibe you like and I'll show you exactly what it'd look like, free. 🙌`,
    tip: "Tie the positioning to the lead's OWN business and a concrete free-mockup capture — abstract values copy doesn't convert, a next step does.",
    tags: ["offer", "positioning", "one-studio", "capture"],
  },
  {
    id: "offer-owned",
    title: "'Is it really mine?' — ownership",
    category: "What We Offer",
    channel: "Instagram DM",
    when: "They ask whether they own it / will pay rent forever.",
    body: `100%. When we're done you own the site, the code, the domain, the files — everything.

No monthly rent to keep it online (unless you choose one of our ready-made systems). It's yours to keep, sell, or hand to another dev. 🔑`,
    tip: "Ownership is a real differentiator vs Wix/Shopify/agencies that rent you a template. Lean on it.",
    tags: ["offer", "ownership", "differentiator"],
  },
  {
    id: "add-social-retainer",
    title: "Sell monthly social media management",
    category: "What We Offer",
    channel: "Instagram DM / WhatsApp",
    when: "They post inconsistently, have a site but no traffic, or ask 'do you run socials too?'",
    body: `Building it is step one — keeping it active is where the sales come from 📈 We run your socials monthly: content, captions, posting + growth, done-for-you.

Starter J$30,000/mo · Plus J$55,000/mo (most popular) · Elite J$80,000/mo. Want me to put together a sample week of content for [business]?`,
    variants: [
      {
        label: "After a build",
        text: `Now the site's live, want it actually seen? We run your socials monthly — content + posting + growth — from J$30,000/mo. Most clients pair it with the build so momentum doesn't die. Want a free sample week for [business]?`,
      },
      {
        label: "They post inconsistently",
        text: `Noticed posting's a bit on-and-off (it happens — you're busy running the business 🙂). That's exactly what our monthly management is for, from J$30,000/mo. Want me to take it off your plate with a sample week first?`,
      },
    ],
    tip: "Social media management is the highest-LTV, recurring product and is easy to under-sell. Lead with the outcome ('keeping it active is what brings sales'), quote the canonical tiers, and use a free 'sample week/post' as the mockup-equivalent hook so value is concrete before the monthly price lands. Always offer it after any build.",
    tags: ["social-media", "marketing", "retainer", "monthly", "recurring-revenue", "pricing", "upsell"],
  },

  // ─── FREE MOCKUP HOOK ─────────────────────────────────────────────────
  {
    id: "mock-offer",
    title: "Offer the free mockup",
    category: "Free Mockup Hook",
    channel: "Instagram DM",
    when: "Convert a 'maybe' into a 'show me'.",
    body: `Tell you what — send me your business name, what you do, and any colours/vibe you like, and I'll design a FREE mockup of your homepage.

No charge, no obligation. If you love it, we build it. Deal? 🤝`,
    tip: "The free mockup is your strongest hook. The 3 inputs you ask for (name, what they do, vibe) are exactly what you need to start — so a yes here gives you a real lead AND your brief.",
    tags: ["mockup", "free", "hook", "capture"],
  },
  {
    id: "mock-deliver",
    title: "Delivering the mockup",
    category: "Free Mockup Hook",
    channel: "Instagram DM / WhatsApp",
    when: "Sending the finished mockup over.",
    body: `Here's the first concept for [business] 👀 [attach]

This is just v1 — we tweak colours, copy and layout till it's perfect. Want me to send the full package + pricing so you can see how we'd finish it?`,
    tags: ["mockup", "deliver", "transition-to-price"],
  },
  {
    id: "mock-template",
    title: "Fast-track option (custom Launch / ready-made)",
    category: "Free Mockup Hook",
    channel: "Instagram DM",
    when: "They want to move fast / smaller budget.",
    body: `If you need it live fast, our Launch site is custom but quick — about 7-day delivery, still 100% yours (no template lock-in). Or a ready-made Supreme Suite system can switch on this week from J$8,500/mo, 3-day free trial.

Want me to send options for [industry]? 🎨`,
    tip: "Never offer 'a template' — it contradicts the studio's core 'custom, 100% owned, no lock-in' promise. Route fast/budget leads to the real fast-track: the quick custom Launch tier OR a Supreme Suite system, and keep ownership explicit.",
    tags: ["fast", "launch", "ready-made", "speed"],
  },

  // ─── READY-MADE SYSTEMS ───────────────────────────────────────────────
  {
    id: "ready-pitch",
    title: "Ready-made systems pitch",
    category: "Ready-Made Systems",
    channel: "Instagram DM",
    when: "They'd rather not build from scratch / want it now.",
    body: `If you'd rather not build from scratch, we've got ready-made systems you can switch on this week 👇

Booking systems, mover/warehouse CRMs, loyalty, AI chat & more — from J$8,500/mo (about US$54), 3-day free trial, cancel anytime.

Want me to spin up a free trial for you?`,
    tip: "Ready-made = recurring revenue + a fast yes. Lead with the free trial, not the price. 'Want me to spin one up?' beats 'it costs X.'",
    tags: ["ready-made", "subscription", "supreme-suite", "trial"],
  },
  {
    id: "ready-trial",
    title: "Free trial close",
    category: "Ready-Made Systems",
    channel: "Instagram DM / WhatsApp",
    when: "They're curious about a ready-made system.",
    body: `I can set you up with a 3-day free trial right now — you'll have a live, branded system to click around in today.

If it fits, you keep it from J$8,500/mo; if not, no charge. Want me to start it? ⚡`,
    tags: ["ready-made", "trial", "close"],
  },
  {
    id: "ready-which",
    title: "Which system fits",
    category: "Ready-Made Systems",
    channel: "Instagram DM",
    when: "Match them to the right pre-built system.",
    body: `Quick one — what's the main thing you want it to handle? Bookings, deliveries, inventory, customers, or payments?

I'll match you to the right ready-made system and send a demo link. 🔗`,
    tags: ["ready-made", "qualify", "demo"],
  },
  {
    id: "add-suite-crosssell",
    title: "Supreme Suite cross-sell (they only asked about a website)",
    category: "Ready-Made Systems",
    channel: "Instagram DM / WhatsApp",
    when: "Lead asked about a website — add a ready-made system as the day-one revenue layer.",
    body: `Quick add-on idea for [business] 👇 Once your site's live, most clients bolt on a ready-made system so the site actually WORKS — online bookings, a loyalty/punch card, or an AI chat that answers customers 24/7.

It's switch-on monthly from J$8,500/mo with a 3-day free trial. Want me to start a free trial alongside your mockup so you see both?`,
    variants: [
      {
        label: "Bookings angle",
        text: `One thing that pairs great with your new site for [business]: a ready-made booking system so customers reserve + pay themselves, no back-and-forth. 3-day free trial, then from J$8,500/mo. Want me to switch it on so you can test it free?`,
      },
      {
        label: "Soft, future-tense",
        text: `Love it — let's get the site sorted first 🙌 Just so it's on your radar: when you're ready, we've got ready-made systems (bookings, loyalty, AI chat) from J$8,500/mo, free 3-day trial. No rush — site first.`,
      },
    ],
    tip: "A website is a one-time sale; a Suite system is recurring LTV. Cross-sell it as the thing that makes the site DO something (book, retain, answer) rather than a separate product. Lead with the free trial, not the price — a trial is a near-frictionless yes.",
    tags: ["upsell", "cross-sell", "supreme-suite", "ready-made", "trial", "recurring", "website-lead"],
  },

  // ─── PRICING & PACKAGES ───────────────────────────────────────────────
  {
    id: "price-howmuch",
    title: "'How much?' (holding reply)",
    category: "Pricing & Packages",
    channel: "Instagram DM",
    when: "They ask price before you know what they need.",
    body: `Great question 👍 Branding starts at J$25,000, sites at J$55,000, apps at J$90,000 — all one-time and you own it outright.

Tell me what you're after + your business name and I'll send an exact number plus a free mockup.`,
    tip: "Give a tight, real range (matching the live checkout) instead of a vague 'it depends' — a price-sensitive lead reads vagueness as dodging. Anchor with the real low numbers, then capture so the exact quote lands in context.",
    tags: ["pricing", "holding", "anchor"],
  },
  {
    id: "price-website",
    title: "Website pricing",
    category: "Pricing & Packages",
    channel: "Instagram DM",
    when: "They want website numbers.",
    body: `Websites run three tiers:

• Launch — J$55,000 · up to 5 pages, 7-day delivery
• Business — J$110,000 · up to 12 pages, CMS + SEO ⭐ most popular
• Enterprise — J$160,000 · store/bookings + admin + 12-mo support

All one-time, and you own it. Want me to recommend one for [business]?`,
    tags: ["pricing", "website"],
  },
  {
    id: "price-branding",
    title: "Branding pricing",
    category: "Pricing & Packages",
    channel: "Instagram DM",
    when: "They want logo / brand numbers.",
    body: `Branding:

• Logo & Essentials — J$25,000
• Brand Kit — J$60,000 · full identity + templates ⭐
• Brand + Web Launch — J$110,000 · brand + a live site

You own every file. Which level were you thinking?`,
    tags: ["pricing", "branding", "logo"],
  },
  {
    id: "price-app",
    title: "App pricing",
    category: "Pricing & Packages",
    channel: "Instagram DM",
    when: "They want app numbers.",
    body: `Apps:

• Web App (installs from a link) — J$90,000
• Native (App Store + Play Store) — J$160,000 ⭐
• Web + Native bundle — J$240,000

Store submission handled, admin panel included. What's the app for?`,
    tags: ["pricing", "app", "mobile"],
  },
  {
    id: "price-payment",
    title: "Payment options",
    category: "Pricing & Packages",
    channel: "Instagram DM",
    when: "They ask how they'd pay / want a plan.",
    body: `We take card online — local J$ or global US$ — and most projects are a deposit to start + balance on milestones. Ready-made systems are simple monthly.

Want me to send a secure payment link once you pick a package? 💳`,
    tags: ["pricing", "payment", "wipay", "deposit"],
  },

  // ─── BUDGET CONVERSATIONS ─────────────────────────────────────────────
  {
    id: "budget-graceful-ask",
    title: "Ask budget gracefully (after value is shown)",
    category: "Budget Conversations",
    channel: "Instagram DM / WhatsApp",
    when: "They're engaged and you've shown value (mockup/plan) — now you need a real number to scope.",
    body: `So I scope [business] right and don't waste your time pricing the wrong thing — what kind of budget are you working with for this? Even a rough ballpark helps me match the package to it 👍

No wrong answer — I build at every level.`,
    variants: [
      {
        label: "Softest (range, not a number)",
        text: `Quick one so I point you right — are we thinking more in the J$50k range, the J$100k+ range, or 'show me everything'? I'll tailor the plan to whatever it is, no judgement 🙂`,
      },
      {
        label: "Reason-first",
        text: `I can build [business] a lot of ways — lean and fast or full and loaded. To save you time, what's the rough budget you'd be comfortable with? Then I only show you options that actually fit.`,
      },
    ],
    tip: "Goes deeper than qual-budget by always pairing the question with a REASON ('so I don't waste your time') — that reframes it from nosy to helpful. Ask only after value is on the table, and add 'no wrong answer / I build at every level' so a small number isn't embarrassing. The range-bucket variant is easiest to answer.",
    tags: ["budget", "discovery", "graceful", "ballpark", "qualify"],
  },
  {
    id: "budget-tier-anchor",
    title: "Anchor with 3 tiers so they self-select",
    category: "Budget Conversations",
    channel: "Instagram DM / WhatsApp",
    when: "They want options or won't name a budget — lay out good-better-best and let them point.",
    body: `Here's the simplest way to see it for [business] — three levels, you pick what fits 👇

• Lean — Launch site J$55,000 · clean, custom, live in ~7 days
• Most popular — Business site J$110,000 · more pages, CMS + SEO ⭐
• Full — Enterprise J$160,000 · store/bookings + admin + support

All one-time, all 100% yours. Which one feels like you?`,
    variants: [
      {
        label: "Branding tiers",
        text: `Three levels for [business] 👇 Logo & Essentials J$25,000 · Brand Kit J$60,000 (full identity ⭐) · Brand + Web Launch J$110,000 (brand + a live site). You own every file. Which feels right?`,
      },
      {
        label: "Custom vs monthly",
        text: `Two routes for [business]: own it outright (Launch site J$55,000, one-time) or run light monthly (ready-made system from J$8,500/mo, 3-day free trial). Which fits how you'd rather pay — one-time or monthly?`,
      },
    ],
    tip: "Three tiers beat one price: a lone number is a yes/no, three options turn 'do I buy?' into 'which do I pick?' Always put the target package in the MIDDLE and label it 'most popular' so the anchors on either side make it feel sensible. Ending on 'which feels like you?' makes them self-select. All numbers match the live checkout.",
    tags: ["budget", "anchor", "tiers", "self-select", "pricing", "good-better-best"],
  },
  {
    id: "budget-tight-reroute",
    title: "'Money tight right now' — re-route, don't discount",
    category: "Budget Conversations",
    channel: "WhatsApp / Instagram DM",
    when: "Lead loves it but says cash is tight at the moment.",
    body: `Totally get it, [Name] — cashflow's real 🙏 Good news is you don't need the full amount to get going. We can start you on a ready-made system from J$8,500/mo (3-day free trial, so it's $0 to try), OR do the custom build in stages so you pay as money comes in.

Want me to show you the lightest way to get [business] moving this month?`,
    variants: [
      {
        label: "Short",
        text: `I hear you 🙏 You don't need it all up front — a ready-made system runs from J$8,500/mo (free 3-day trial), or we phase the custom build so you pay as you go. Want the lightest option for [business]?`,
      },
      {
        label: "Lead with the free trial",
        text: `No stress, [Name] — let's not spend a dollar yet. I'll start you on a 3-day free trial of a ready-made system so [business] is live this week, and we sort the bigger build whenever cash frees up. Cool?`,
      },
    ],
    tip: "'Money tight' is rarely a no — it's 'not the whole thing today.' Never discount; shrink the first step. Lead with the zero-cost free trial so the immediate ask is $0, and keep the custom build alive as a phased option. Always close on a yes/no that moves them forward this month.",
    tags: ["budget", "cashflow", "money-tight", "re-route", "free-trial", "phasing"],
  },
  {
    id: "budget-phase-it",
    title: "Phase the build across months (full vision, spread out)",
    category: "Budget Conversations",
    channel: "WhatsApp / Instagram DM",
    when: "They love the full scope but the total is heavier than this month's cashflow allows.",
    body: `Don't shelve the whole vision over timing 🙌 We can phase it — build [business] in stages so each piece is live and earning before we start the next.

E.g. Phase 1: a Launch site (J$55,000) now → Phase 2: an online store (Store Starter J$130,000) next → Phase 3: the app once it's paying for itself. Same full plan, spread out. Want me to map your phases?`,
    variants: [
      {
        label: "Build-funds-build",
        text: `Smart play: launch the piece that brings money in first, then let that revenue fund Phase 2 — you're never fronting the whole thing at once. What's the ONE thing [business] needs live first? I'll scope Phase 1 to today's budget.`,
      },
      {
        label: "Store-first",
        text: `Let's start where the money comes in: get your store live first (Store Starter J$130,000) so it's earning, then layer the app and branding after. I'll map a 3-phase plan for [business] — want it?`,
      },
    ],
    tip: "Phasing protects the FULL rate and just re-times it — you never discount, you sequence. Anchor Phase 1 on the piece that earns fastest (store/booking) so later phases self-fund, and it locks in a multi-project client instead of losing the whole deal.",
    tags: ["budget", "phasing", "cashflow", "stages", "build-funds-build", "protect-rate"],
  },
  {
    id: "budget-rescope-smaller",
    title: "Re-scope to a smaller package (not a discount)",
    category: "Budget Conversations",
    channel: "WhatsApp / Instagram DM",
    when: "They ask for a lower price on a specific package — trim scope, hold the rate.",
    body: `I can't drop the rate (that just means cutting corners and you'd feel it) — but I can right-size the scope to your number 👍

Do we really need 12 pages on day one, or can we launch lean — a sharp Launch site (J$55,000, up to 5 pages) — and add pages as [business] grows? Same standard, essentials first. What's the one thing it MUST do on day one?`,
    variants: [
      {
        label: "Branding-first",
        text: `If the full brand + web is a lot right now, start with just Logo & Essentials at J$25,000 to look legit immediately, then layer the full Brand Kit / site when you're ready. Want the logo first?`,
      },
      {
        label: "Store: starter vs growth",
        text: `Instead of Growth (J$240,000), start on Store Starter (J$130,000) — fewer bells, same clean store you own, and we upgrade to Growth features once sales are rolling. Want the Starter scope?`,
      },
    ],
    tip: "When asked to lower a price, move the SCOPE not the rate — fewer pages/features at a real lower tier protects margin and the quality promise. 'Same standard, essentials first' lets them say yes without feeling downgraded, and 'what must it do day one?' finds the lean v1 while seeding the phase-two upsell.",
    tags: ["budget", "re-scope", "scope-trim", "hold-rate", "phasing", "margin"],
  },
  {
    id: "budget-milestone-schedule",
    title: "Spell out the milestone payment schedule",
    category: "Budget Conversations",
    channel: "WhatsApp / Instagram DM",
    when: "They like deposit + milestones in principle but want to see the actual split before committing.",
    body: `Here's exactly how it'd break down for [package] so there's no surprise 👇

• Deposit to start + lock your slot
• Next portion at design approval
• Balance at launch (when it's live and you're happy)

You approve each stage before that payment — never paying ahead of work you've seen. Want me to send the schedule for [business]?`,
    variants: [
      {
        label: "Three even-ish thirds",
        text: `Simple split for [package]: roughly a third to start, a third at design approval, a third at launch. You sign off each stage before paying it. Want me to lock your start date?`,
      },
      {
        label: "Lighter deposit, weighted to launch",
        text: `We can keep the deposit light to start and weight the bigger payments toward launch — once you're already seeing it come together. Want me to lay out that schedule for [business]?`,
      },
    ],
    tip: "Vague 'deposit + milestones' stalls; a concrete 3-stage schedule closes. Tie each payment to an approval the client controls so it reads as protection, not risk — same full price, just shown as a timeline. Never offer pay-on-completion (kills your cashflow).",
    tags: ["budget", "milestones", "payment-schedule", "deposit", "cashflow", "close"],
  },
  {
    id: "budget-biweekly-retainer",
    title: "Biweekly billing for social / retainer",
    category: "Budget Conversations",
    channel: "Instagram DM / WhatsApp",
    when: "They want monthly social management but a full month upfront feels heavy.",
    body: `If a full month at once is a lot, we can bill it biweekly 👍 Starter at J$15,000 every two weeks is the same J$30,000/mo tier — just lines up nicer with how money comes in.

Same content, same posting, same growth. Want me to start [business] on the biweekly Starter?`,
    variants: [
      {
        label: "Match your pay cycle",
        text: `We can sync billing to your cash cycle — biweekly instead of monthly (J$15,000 every two weeks = the J$30,000/mo Starter). Easier to manage, same service. Want me to set it up?`,
      },
      {
        label: "Start small, step up",
        text: `Start biweekly on Starter (J$15,000 / 2 weeks) and once it's clearly paying off we step you up to Plus (J$55,000/mo). Grow the spend as the results grow. Sound good?`,
      },
    ],
    tip: "Biweekly is a cashflow re-timing, NOT a discount — J$15,000 biweekly is exactly the J$30,000/mo rate, and it matches Jamaican pay cycles. It protects recurring MRR. Only quote the canonical monthly tiers; biweekly is just that number split in two.",
    tags: ["budget", "retainer", "biweekly", "social-media", "monthly", "cashflow"],
  },
  {
    id: "budget-roi-reframe",
    title: "Reframe cost as what it earns / saves",
    category: "Budget Conversations",
    channel: "WhatsApp / Instagram DM",
    when: "They frame the price as a cost/expense rather than the tool that brings money in.",
    body: `Think of it less as a cost and more as the tool that brings the money in 💡 A site/app for [business] works 24/7 — it books, sells and answers while you sleep. Most clients earn the [package] back from the first few extra customers it captures.

What's one customer worth to you on average? I'll show you how fast it pays for itself.`,
    variants: [
      {
        label: "Cost of staying as-is",
        text: `Real talk — the question isn't just what a site costs, it's what NOT having one costs [business]: the customer who searched you, found nothing, and booked someone else. A J$55,000 build you own forever fixes that for good. Want me to show how?`,
      },
      {
        label: "vs the platform's cut",
        text: `Right now the delivery apps / platforms take a cut on every sale — your own store (Store Starter J$130,000) is one-time and that margin stays yours. A few months of saved fees and it's paid for itself. Want me to mock up your shop free?`,
      },
    ],
    tip: "When budget is really a value-perception issue, shift from 'what it costs' to 'what it earns or saves.' Asking 'what's one customer worth?' makes them do the payback math themselves — far more persuasive than you asserting it. Never quantify revenue for them; let their number sell it. Defends the full price by raising value, not cutting price.",
    tags: ["budget", "roi", "reframe", "value", "investment", "cost-of-inaction"],
  },
  {
    id: "budget-after-payday",
    title: "'After my next pay / when money comes in'",
    category: "Budget Conversations",
    channel: "WhatsApp / Instagram DM",
    when: "They want it but are waiting on a paycheck, contract, or cash to land.",
    body: `Makes sense — let's line it up so you're ready the second it lands 🙌 I'll do your free mockup NOW (costs nothing) so the design's locked, and we only start the deposit when your pay comes in. What date are you working with?

That way no momentum lost — you say go, we move.`,
    variants: [
      {
        label: "Lock a date",
        text: `Easy — when's payday roughly? I'll pencil your slot for that week and send the free mockup now so you've already got something to love. Deposit only when the money's in 👍`,
      },
      {
        label: "Seasonal / after the rush",
        text: `Smart to plan around your season 🙂 But the best time to have it built is BEFORE the rush, so it's working when money's flowing, not after. We can build now in stages and have [business] ready for [season]. Free mockup first so it's set to switch on?`,
      },
    ],
    tip: "A future-pay or seasonal lead is high-intent but easy to lose to drift. Capture a DATE and deliver the free mockup immediately — that keeps them emotionally invested and gives you a logged follow-up trigger. Never let 'when money comes in' end the thread without a date and a next touch.",
    tags: ["budget", "payday", "seasonal", "future-pay", "capture", "mockup"],
  },

  // ─── OBJECTIONS ───────────────────────────────────────────────────────
  {
    id: "obj-expensive",
    title: "'Too expensive'",
    category: "Objections",
    channel: "Instagram DM",
    when: "Price is the blocker.",
    body: `Totally fair 🙏 That's exactly why we do ready-made systems from J$8,500/mo and payment plans on custom builds — so you launch now and pay as you grow.

Want me to show you the option that fits your budget instead of the full build?`,
    tip: "Don't discount — re-route. Offer the lower-commitment path (monthly / payment plan) so the yes stays alive without devaluing the work.",
    tags: ["objection", "price", "budget"],
  },
  {
    id: "obj-think",
    title: "'Let me think about it'",
    category: "Objections",
    channel: "Instagram DM",
    when: "They go non-committal.",
    body: `Of course — no pressure at all 🙌

Want me to send that free mockup so you've got something real to look at while you decide? Way easier to say yes to something you can see.`,
    tip: "'Let me think' usually means 'I can't picture it yet.' Counter with the free mockup — give them the thing to react to instead of an abstract decision.",
    tags: ["objection", "stall", "mockup"],
  },
  {
    id: "obj-examples",
    title: "'Do you have examples / proof?'",
    category: "Objections",
    channel: "Instagram DM",
    when: "They want to see your track record.",
    body: `Absolutely 👇 Here's our work: jsupremetech.online

We've built courier apps, booking sites, online stores, full CRMs and brands. Tell me your industry and I'll send the closest example we've done.`,
    tags: ["objection", "proof", "portfolio"],
  },
  {
    id: "obj-trust",
    title: "'How do I know you'll deliver?'",
    category: "Objections",
    channel: "Instagram DM",
    when: "Trust / risk objection.",
    body: `Fair question 🤝 That's why we start with a free mockup (you see the quality first), then a small deposit, then milestone payments — you're never paying for work you haven't seen.

And you own everything as we go.`,
    tags: ["objection", "trust", "risk", "milestones"],
  },
  {
    id: "obj-diy",
    title: "'I can use Wix / Canva myself'",
    category: "Objections",
    channel: "Instagram DM",
    when: "They think they'll DIY it.",
    body: `Totally — Canva's great for a flyer 🙂 The difference is when you want it to actually book customers without you babysitting it, that's us: custom, built to convert, handed over done.

And if budget's tight, we've got ready-made systems from J$8,500/mo. Want me to mock one up so you can compare?`,
    tip: "Acknowledge + redirect rather than just defending custom — the budget-conscious DIYer is exactly who converts to a ready-made system. Never talk down to them.",
    tags: ["objection", "diy", "differentiator"],
  },
  {
    id: "add-deposit-reassure",
    title: "'Can I pay the full thing after it's done?'",
    category: "Objections",
    channel: "WhatsApp / Instagram DM",
    when: "Lead balks at paying a deposit before seeing finished work, or asks to pay only on completion.",
    body: `Totally understand — paying before you see finished work takes trust 🤝 The deposit isn't us walking off with your money; it locks your slot and start date, and covers your mockup + setup.

From there you pay on milestones — you approve each stage before the next payment, and you own everything as we go. Want me to lock [date]?`,
    variants: [
      {
        label: "Milestone framing",
        text: `Fair 🙏 Here's how we de-risk it: free mockup → small deposit to start → you approve each stage before the next payment. The deposit just holds your slot — everything after is pay-as-you-approve. Want me to lock [date]?`,
      },
      {
        label: "Mockup-first",
        text: `I get it. That's exactly why we do a FREE mockup first — you see our quality at zero risk. Then a small deposit just reserves your slot, and the rest is milestone by milestone. Want the mockup first so the deposit's an easy yes?`,
      },
    ],
    tip: "In Jamaica this is a top close-killer — a trust + cashflow issue, not a price one. Reframe the deposit from 'risky prepayment' to 'a slot reservation,' and make milestones the safety net ('you only ever pay for work you've already seen'). The free mockup is your proof-of-quality lever before any money moves — never drop to pay-on-completion, which kills your cashflow.",
    tags: ["objection", "deposit", "trust", "milestones", "cashflow", "close"],
  },
  {
    id: "add-timeline-urgency",
    title: "'How fast?' / 'I need it by [date]'",
    category: "Objections",
    channel: "WhatsApp / Instagram DM",
    when: "They ask delivery speed or have a hard deadline (event, launch, grant).",
    body: `Faster than most expect ⚡ A Launch site can be live in about 7 days, branding even quicker, and a ready-made system can be switched on this week.

Got a hard date like [date]? Tell me and I'll build the timeline backwards from it — and the sooner we lock your slot, the safer we hit it. Want me to send it?`,
    variants: [
      {
        label: "Hard deadline named",
        text: `If [date] is firm we can make it — but slots fill, so the sooner we start the safer it is. Lock the deposit this week and I'll commit to first draft by [date]. Want me to send the link?`,
      },
      {
        label: "Need it NOW",
        text: `If you need something live ASAP, the fastest route is a ready-made system — branded and switched on this week, 3-day free trial — and we build the custom version behind it. Which fits your timing better?`,
      },
    ],
    tip: "A deadline is buying intent in disguise — lean into it. Quote the honest 7-day Launch anchor, then turn the deadline into urgency to lock a slot now. If 'now' truly means now, route to a ready-made system as the instant bridge.",
    tags: ["objection", "timeline", "urgency", "deadline", "speed", "close"],
  },
  {
    id: "add-legit-check",
    title: "'Is this a real / legit business?'",
    category: "Objections",
    channel: "Instagram DM / WhatsApp",
    when: "A cold lead questions whether you're a real company before engaging.",
    body: `100% real 🤝 We're J Supreme — a Jamaica-based studio that's built live courier apps, booking sites, online stores, CRMs and full brands. See the work: jsupremetech.online

Reach a human anytime on WhatsApp (658) 218-2282 or global.jsuprememarketing@gmail.com. Tell me your industry and I'll send a live example we've shipped.`,
    variants: [
      {
        label: "Short + contact",
        text: `Yep, fully real 🙌 J Supreme — JA-based studio, live sites + apps you can click through at jsupremetech.online, reachable on WhatsApp (658) 218-2282. Want me to send an example in your industry?`,
      },
      {
        label: "Lead with proof",
        text: `Fair to check 👍 We're a real studio with live client sites you can visit right now — the portfolio's at jsupremetech.online. Tell me your industry and I'll send a real one we built so you can judge for yourself.`,
      },
    ],
    tip: "Before the delivery-risk worry (obj-trust) comes the legitimacy worry: am I even talking to a real company? Establish it fast — named studio, live portfolio link, a real WhatsApp number, and an offer to show shipped work in their industry. Concrete proof of real, named launches beats any reassurance line.",
    tags: ["objection", "legitimacy", "trust", "proof", "portfolio", "cold"],
  },

  // ─── CLOSE & BOOK ─────────────────────────────────────────────────────
  {
    id: "close-book",
    title: "Book a quick call",
    category: "Close & Book",
    channel: "Instagram DM / WhatsApp",
    when: "Lead is warm — move to a call.",
    body: `Easiest next step — let's do a quick 10-min call so I can hear the vision and quote you properly.

Grab a time here: jsupremeconglomerate.online/book — or just tell me what works and I'll lock it in. 📞`,
    tags: ["close", "call", "booking"],
  },
  {
    id: "close-deposit",
    title: "Close to deposit",
    category: "Close & Book",
    channel: "Instagram DM / WhatsApp",
    when: "They've picked a package — lock it in.",
    body: `Sounds like [package] is the move 🙌

To lock your slot I'll send a secure deposit link — once that's in we start [this week] and you'll have the first draft by [date]. Want me to send it?`,
    tip: "Assume the sale: 'Want me to send it?' is a yes/no that moves money, not a 'do you want to proceed?' that invites a stall.",
    tags: ["close", "deposit", "payment"],
  },
  {
    id: "close-recap",
    title: "Recap & confirm",
    category: "Close & Book",
    channel: "Instagram DM / WhatsApp",
    when: "Lock the agreement before sending the link.",
    body: `Perfect — here's the plan: [package] for [business], [price], first draft by [date].

I'll send the payment link + a 2-min intake form now. Anything you want to add before we start? ✅`,
    tags: ["close", "recap", "intake"],
  },
  {
    id: "close-link",
    title: "Send the links (contact card)",
    category: "Close & Book",
    channel: "Instagram DM / WhatsApp",
    when: "Hand off everything in one tidy message.",
    body: `Here's everything in one place 👇

🔗 Work + packages: jsupremetech.online
💬 WhatsApp: (658) 218-2282
📧 global.jsuprememarketing@gmail.com

Reply here or message me on WhatsApp and we'll get moving!`,
    tags: ["close", "contact", "handoff"],
  },
  {
    id: "add-proposal-esign",
    title: "'Send me a proposal / quote in writing'",
    category: "Close & Book",
    channel: "WhatsApp / Email",
    when: "A serious or B2B lead wants something formal before committing.",
    body: `Happy to 📄 I'll put together a one-page proposal for [business] — scope, package, price and timeline — plus a simple e-sign agreement so it's all official.

What's the best email to send it to, and is there a date you're working toward? You'll have it within 24 hours.`,
    variants: [
      {
        label: "Direct",
        text: `Of course. I'll send a clean one-page proposal (scope, timeline, price) + an e-sign agreement so everything's on paper. Best email to send it to? You'll have it within 24 hrs, and once you sign + the deposit's in we start.`,
      },
      {
        label: "USD / overseas B2B",
        text: `Happy to put it in writing 📄 Full scope, timeline and a fixed US$ price, plus an e-sign agreement so we're locked in cleanly across borders. What's the best email, and is anyone on your side I should cc?`,
      },
    ],
    tip: "A formal ask = a serious buyer, and B2B leads need paper to move it internally. Saying yes fast + naming a 24h turnaround + mentioning the e-sign agreement signals you're a real operation and closes the legitimacy gap at the same time. Always capture the email here — it's a stronger channel than IG.",
    tags: ["close", "proposal", "quote", "e-sign", "contract", "b2b"],
  },
  {
    id: "add-asset-collect",
    title: "'What info do you need from me?'",
    category: "Close & Book",
    channel: "WhatsApp",
    when: "They've said yes — collect the brief conversationally without losing momentum.",
    body: `Easy — just a few things to start 👇 1) your logo (or say 'design one'), 2) 4–6 photos you like (or we'll source clean ones), 3) a line on what you do + any colours you love, 4) your domain (or I'll sort one).

Drop whatever you have right here — anything missing, we'll fill in. No need to be perfect.`,
    variants: [
      {
        label: "Won't fill a form",
        text: `No form needed — just voice note or type me: business name, what you do, colours/vibe you like, and send any logo/photos you have. That's literally all I need to start today 🙌`,
      },
    ],
    tip: "The yes-to-start handoff stalls more projects than price does. Collect the brief conversationally so a missing logo doesn't freeze everything — 'drop what you have, we fill the rest' keeps momentum. The '(or I'll sort one)' outs on every item remove every excuse to delay.",
    tags: ["close", "onboarding", "asset-collection", "handoff", "brief"],
  },

  // ─── FOLLOW-UP ────────────────────────────────────────────────────────
  {
    id: "fu-noreply",
    title: "No reply (24–48h)",
    category: "Follow-Up",
    channel: "Instagram DM",
    when: "They went quiet after the first reply.",
    body: `Hey [Name] — just circling back 🙂 Still happy to put together that free mockup for [business] whenever you're ready. Want me to go ahead?`,
    tip: "Most sales are made on follow-ups 2–5. A light, helpful nudge (not 'just checking in') keeps it alive without being pushy.",
    tags: ["follow-up", "nudge"],
  },
  {
    id: "fu-mockup-sent",
    title: "After mockup, no reply",
    category: "Follow-Up",
    channel: "Instagram DM / WhatsApp",
    when: "You sent the mockup and heard nothing.",
    body: `Hey [Name]! Did you get a chance to look at the mockup? 👀 Easy to tweak anything you didn't love — just say the word and I'll adjust it.`,
    tags: ["follow-up", "mockup"],
  },
  {
    id: "fu-ghost",
    title: "Last touch (soft breakup)",
    category: "Follow-Up",
    channel: "Instagram DM",
    when: "Several follow-ups, still nothing — leave the door open.",
    body: `No worries if now's not the right time, [Name] 🙏

I'll leave the free-mockup offer open — whenever you're ready to get [business] online, just message me here. Wishing you a great one!`,
    tip: "The 'breakup' message often gets a reply precisely because it removes pressure. Always end warm so the door stays open.",
    tags: ["follow-up", "breakup", "closeout"],
  },
  {
    id: "fu-aftercall",
    title: "After a call",
    category: "Follow-Up",
    channel: "WhatsApp / Email",
    when: "Recap and send the next step after a call.",
    body: `Great talking, [Name]! 🙌

As promised: [recap of what we agreed]. Here's the payment link + intake form to kick off: [link].

Any questions, I'm right here.`,
    tags: ["follow-up", "post-call", "recap"],
  },
  {
    id: "add-price-ghost",
    title: "Saw the price, went quiet",
    category: "Follow-Up",
    channel: "WhatsApp / Instagram DM",
    when: "Lead went silent right after you sent a number.",
    body: `Hey [Name] — no pressure on the number 🙂 Most people pause on the price, not the work. We start with a deposit and split the rest across milestones, so it's never one big hit.

Want me to send the free mockup so you can see exactly what [business] gets before you decide anything?`,
    variants: [
      {
        label: "Value re-anchor",
        text: `Hey [Name] 👋 Quick thought — that's a one-time build you own forever, not a monthly bill. Spread over milestones it's far lighter than it looks. Want the plan + a free mockup so you see exactly what you're getting?`,
      },
      {
        label: "Soft + monthly route",
        text: `Still here whenever you're ready, [Name] 🙌 If the one-time feels like a lot right now, we also have a ready-made version from J$8,500/mo with a 3-day free trial. Want me to spin that up instead?`,
      },
    ],
    tip: "The #1 drop-off is silence after a quote — they froze on the number, not the value. NEVER re-send the price or ask 'did you see my message?' Re-anchor on (a) how they pay it (deposit + milestones kills the lump-sum fear) and (b) the free mockup so the price has something tangible to sit beside. Always end on a yes/no question.",
    tags: ["follow-up", "price-ghosting", "silence", "payment-plan", "re-anchor"],
  },
  {
    id: "add-reactivate-dormant",
    title: "Reactivate a cold lead (30–90 day)",
    category: "Follow-Up",
    channel: "WhatsApp / Instagram DM",
    when: "A lead went fully cold months ago — re-open with a fresh reason, not 'still interested?'",
    body: `Hey [Name], been a minute! 👋 We just launched a [site/app/system] for a business like [business] and it came out clean — made me think of you.

Still want to get [business] online this [season/quarter]? I'll do a fresh free mockup, no strings.`,
    variants: [
      {
        label: "Seasonal hook",
        text: `Hey [Name]! With [Christmas / summer / back-to-school] coming, now's the perfect window to get [business] looking sharp online and ready for the rush. Want me to put together a quick free mockup?`,
      },
      {
        label: "New-offer hook",
        text: `[Name] 👋 We've added ready-made systems you can switch on this week from J$8,500/mo (3-day free trial) — way faster than when we last spoke. Want me to spin one up for [business]?`,
      },
    ],
    tip: "This is a different job from the soft breakup (fu-ghost): it's a longer-horizon re-open weeks/months later and needs a genuinely NEW reason to reply. 'We just launched X for a business like yours' is the strongest because it's social proof + relevance in one line. A season or a new product (the ready-made tier) also work — never 'just checking in.'",
    tags: ["follow-up", "reactivation", "dormant", "cold-lead", "seasonal", "social-proof"],
  },
  {
    id: "add-postdelivery-upsell",
    title: "Post-launch upsell / cross-sell",
    category: "Follow-Up",
    channel: "WhatsApp / Instagram DM",
    when: "A project just shipped — open the expansion loop while satisfaction is peak.",
    body: `[business] is live and looking 🔥 Now the fun part — making it work harder for you. Most clients add one of these next:
• A matching app so customers buy/book from their phone
• Monthly social management to keep it growing (from J$30,000/mo)
• A ready-made system (bookings, loyalty, AI chat) on a free 3-day trial

Want me to recommend the best next move for you?`,
    variants: [
      {
        label: "Site → app",
        text: `Love how the site turned out 🙌 A lot of clients add a matching app next so customers book/order from their phone — Web App from J$90,000 or native (App Store + Play) J$160,000. Want me to mock up how yours would look?`,
      },
      {
        label: "Branding → web/social",
        text: `Your new brand looks sharp 🔥 Want to put it to work? We can launch a matching site (from J$55,000) or run your socials monthly so the whole world sees it. Which sounds better?`,
      },
      {
        label: "Build → Supreme Suite",
        text: `Now you're set up — want to automate the busywork? A ready-made system (bookings, loyalty, AI chat) switches on this week, 3-day free trial, from J$8,500/mo. Want me to spin one up?`,
      },
    ],
    tip: "The funnel shouldn't end at delivery — a just-shipped client is your warmest possible buyer and trusts you now. Time the upsell to the win ('it's live and looking 🔥'), offer one logical next step, and frame it as making their existing investment work harder. Lead with the free mockup/trial again so the next yes is as low-friction as the first.",
    tags: ["follow-up", "upsell", "cross-sell", "post-delivery", "expansion", "supreme-suite"],
  },
  {
    id: "add-milestone-update",
    title: "In-project progress update / approval nudge",
    category: "Follow-Up",
    channel: "WhatsApp",
    when: "Mid-build — keep a paid client warm and get the approval that unlocks the next milestone.",
    body: `Update on [business] 👀 [Here's the first draft / homepage / your logo concepts] — [attach].

Take a look when you get a sec and let me know what to tweak. Once you give the thumbs up I'll move straight into [next milestone] 🙌`,
    variants: [
      {
        label: "Quick approval ask",
        text: `Quick one, [Name] — need your thumbs up on [the design/copy] to keep us on schedule for [date]. Anything to change, or are we good to move to the next stage? ✅`,
      },
      {
        label: "Reassure (gone quiet mid-build)",
        text: `Hey [Name], all good on my end — [business] is coming along nicely 🔥 Whenever you've had a look at the last draft, just say the word and I'll push to the next milestone. No rush, just keeping you in the loop.`,
      },
    ],
    tip: "The library was intake-and-close only; nothing kept a PAID client warm mid-build. Regular 'here's progress / quick approval' touches protect the deposit-to-completion conversion, prevent post-payment ghosting, and set up the referral and upsell at delivery.",
    tags: ["follow-up", "nurture", "milestone", "in-project", "approval", "retention"],
  },

  // ─── COMMENT REPLIES ──────────────────────────────────────────────────
  {
    id: "cmt-price",
    title: "Public comment: 'price?'",
    category: "Comment Replies",
    channel: "IG Comment",
    when: "Someone asks price in the comments.",
    body: `Just sent you a DM with all the details 📩 — check your inbox!`,
    tip: "Never post prices in public comments — reply short, push to DM, then pitch privately. Reply publicly anyway so other viewers see you're responsive.",
    tags: ["comment", "price", "dm-push"],
  },
  {
    id: "cmt-interested",
    title: "Public comment: 'interested / info'",
    category: "Comment Replies",
    channel: "IG Comment",
    when: "Someone comments interest.",
    body: `Love it 🙌 Just DM'd you — if it lands in your requests, shoot us "INFO" here or on WhatsApp (658) 218-2282 and we'll send your free mockup.`,
    tip: "'Dropping into your DMs' is an unverifiable promise that often fails — IG filters DMs from non-followers into requests. Give the lead a public action (comment INFO / WhatsApp us) so they pull toward you even if the DM is hidden.",
    tags: ["comment", "interest", "dm-push", "fallback"],
  },
  {
    id: "cmt-tag",
    title: "Someone tags a friend",
    category: "Comment Replies",
    channel: "IG Comment",
    when: "A user tags someone who might need it.",
    body: `👀 Looks like [tagged] might need this! DM us "INFO" and we'll send over a free mockup.`,
    tags: ["comment", "tag", "referral"],
  },
];
