export type SopStep = {
  text: string;
  cmd?: string;
  note?: string;
  link?: { label: string; url: string };
};

export type SopLink = { label: string; url: string };

export type Sop = {
  id: string;
  title: string;
  category: string;
  tags: string[];
  summary: string;
  steps: SopStep[];
  links?: SopLink[];
  updated: string;
};

export const SOP_CATEGORIES = [
  "Web Projects",
  "Mobile Apps",
  "Client Onboarding",
  "Marketing & Creative",
  "Design & Brand",
  "Business Operations",
  "Infrastructure & DevOps",
  "Email & Communication",
  "Security & Compliance",
] as const;

export const SOPS: Sop[] = [
  // ─── WEB PROJECTS ────────────────────────────────────────────────────
  {
    id: "web-new-project",
    title: "New Web Project Setup",
    category: "Web Projects",
    tags: ["nextjs", "tailwind", "vercel", "scaffold"],
    summary: "Bootstrap a production-ready Next.js 16 + Tailwind v4 project and wire it to Vercel.",
    steps: [
      {
        text: "Scaffold the project",
        cmd: "npx create-next-app@latest <name> --typescript --tailwind --app --src-dir",
        note: "Use --src-dir for the src/app structure every JST project uses.",
      },
      {
        text: "Install Recharts for any data dashboards",
        cmd: "npm install recharts",
      },
      {
        text: "Tailwind v4: replace tailwind.config.ts with CSS-first config — add @import 'tailwindcss' to globals.css and wrap base resets in @layer base.",
        note: "Gotcha: omitting @layer base on CSS resets silently overrides Tailwind utilities (invisible sidebar text).",
      },
      {
        text: "Create standard folder structure: src/lib/data/, src/components/ui/, src/components/<feature>/, src/app/(app)/",
      },
      {
        text: "Link to Vercel under jordan-sketch-hue-projects scope",
        cmd: "vercel link",
      },
      {
        text: "First deploy",
        cmd: "vercel --prod",
        note: "Always run from the REAL project folder, not a junction symlink — Vercel does not follow symlinks for builds.",
      },
      {
        text: "Set env vars — NEVER use Write-Output in PS 5.1 as it adds BOM",
        cmd: "cmd /c echo VALUE | vercel env add VAR_NAME production",
        note: "PS 5.1 gotcha: Write-Output strings carry ETS properties → BOM → Vercel env parsing breaks.",
      },
      {
        text: "Confirm deploy is live and check Vercel dashboard for error logs.",
      },
    ],
    links: [
      { label: "Next.js 16 docs", url: "https://nextjs.org/docs" },
      { label: "Tailwind v4 upgrade", url: "https://tailwindcss.com/docs/upgrade-guide" },
      { label: "Vercel deployment", url: "https://vercel.com/docs/deployments" },
    ],
    updated: "2026-06-12",
  },
  {
    id: "web-domain-connection",
    title: "Domain Connection (Namecheap → Vercel)",
    category: "Web Projects",
    tags: ["namecheap", "vercel", "dns", "domain"],
    summary: "Connect a Namecheap domain to a live Vercel project with A + CNAME records.",
    steps: [
      {
        text: "Add domain to Vercel project",
        cmd: "vercel domains add yourdomain.com",
      },
      {
        text: "In Namecheap Advanced DNS, add A record: Host @, Value 76.76.21.21",
      },
      {
        text: "Add CNAME record: Host www, Value cname.vercel-dns.com",
      },
      {
        text: "Set yourdomain.com as Production Domain in Vercel → Settings → Domains.",
      },
      {
        text: "Wait for SSL provisioning (2–10 min). Check Vercel dashboard for green certificate status.",
      },
      {
        text: "Automate Namecheap AngularJS Advanced DNS changes via Claude-in-Chrome if doing multiple records.",
        note: "CDP mouse/screenshot can freeze — reload (reloadWithDebugInfo) to clear. Delete needs trash icon → Yes click on Namecheap's own UI.",
      },
    ],
    links: [
      { label: "Vercel custom domains", url: "https://vercel.com/docs/projects/domains" },
    ],
    updated: "2026-06-12",
  },
  {
    id: "web-supabase-integration",
    title: "Supabase Integration",
    category: "Web Projects",
    tags: ["supabase", "database", "auth", "rls"],
    summary: "Wire a Next.js project to Supabase — tables, RLS, and SSR auth.",
    steps: [
      {
        text: "Install Supabase SSR packages",
        cmd: "npm install @supabase/supabase-js @supabase/ssr",
      },
      {
        text: "Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local and Vercel env vars.",
      },
      {
        text: "Shared projects: ibtadbwtrxglujkzqofs = mobile-auth (bp/lc/aboo/nexpro/trella sign-in); ciggiwpztuxkmbaccrlp = live client data (MoverGuy mg_* + LC CMS lc_*). Don't put demo auth on the live-data project.",
      },
      {
        text: "Create tables with snake_case prefix per client (e.g. bp_bookings, mg_leads, st_orders).",
      },
      {
        text: "Enable RLS on every table. Add policies for authenticated and anon roles.",
      },
      {
        text: "Create server-side Supabase client in src/lib/supabase/server.ts using createServerClient.",
      },
      {
        text: "NEVER run vercel env pull — it writes .env.production.local with EMPTY Sensitive values that shadow .env.local in prod builds and cause server 500s.",
        note: "If you already ran it, rename the .production.local file immediately.",
      },
    ],
    links: [
      { label: "Supabase Next.js SSR guide", url: "https://supabase.com/docs/guides/auth/server-side/nextjs" },
      { label: "Row Level Security", url: "https://supabase.com/docs/guides/auth/row-level-security" },
    ],
    updated: "2026-06-12",
  },
  {
    id: "web-pwa-removal",
    title: "PWA Auto-Popup Removal",
    category: "Web Projects",
    tags: ["pwa", "manifest", "install"],
    summary: "Remove the auto-open PWA install prompt — idempotent codemod for all 17 web projects.",
    steps: [
      {
        text: "Run the fleet-wide codemod",
        cmd: "node 'J Supreme Tech/_build/fix-pwa-popup.mjs'",
        note: "Codemod is idempotent — safe to re-run.",
      },
      {
        text: "Rule: the install button must HIDE when the app is already installed. NEVER re-add auto-open popup.",
      },
      {
        text: "If a project introduces a new PWA install component, audit it before deploy — the auto-popup was removed across all 17 projects 2026-06-10.",
      },
    ],
    updated: "2026-06-12",
  },
  {
    id: "web-vercel-deploy-checklist",
    title: "Deploy Checklist (pre-production)",
    category: "Web Projects",
    tags: ["deploy", "checklist", "vercel", "qa"],
    summary: "Run through this before any production push.",
    steps: [
      { text: "Confirm real logo is in use (logo.jpg or logo.png from client). Never use SVG approximations that blur or misrepresent the brand." },
      { text: "Run type-check", cmd: "npx tsc --noEmit" },
      { text: "Run lint", cmd: "npm run lint" },
      { text: "Check no PWA auto-popup is wired." },
      { text: "Check all NEXT_PUBLIC_ env vars are set in Vercel for the target environment." },
      { text: "Confirm recharts formatter callbacks have (v: any) signature — TypeScript will complain otherwise." },
      { text: "Check next.config.ts: in Next 16, the eslint key is invalid — remove it or move to .eslintrc." },
      { text: "Deploy with vercel --prod from the real folder (not a junction).", cmd: "vercel --prod" },
      { text: "Smoke test: open the production URL; confirm nav, forms, and data load correctly." },
      { text: "Check Vercel runtime logs for any 500s in the first 5 minutes post-deploy." },
    ],
    links: [
      { label: "Vercel deployment checklist", url: "https://vercel.com/docs/deployments" },
    ],
    updated: "2026-06-12",
  },

  // ─── MOBILE APPS ─────────────────────────────────────────────────────
  {
    id: "mobile-new-expo-app",
    title: "New Expo App Setup",
    category: "Mobile Apps",
    tags: ["expo", "eas", "nativewind", "typescript"],
    summary: "Bootstrap a new Expo SDK 54 + Expo Router + NativeWind mobile app.",
    steps: [
      {
        text: "Clone from solidtrust-courier-mobile as base scaffold (cleanest starting point).",
        cmd: "cp -r projects/solidtrust-courier-mobile projects/<new-app>",
      },
      {
        text: "Update app.json: name, slug, bundle ID (com.<brand>.app), version 1.0.0.",
      },
      { text: "Update eas.json: change projectId and update build profiles." },
      {
        text: "Register new EAS project",
        cmd: "eas project:create",
        note: "EAS account is @xalvz.",
      },
      { text: "Update package.json name, reset lockfile." },
      { text: "Wire Supabase auth if needed — use ibtadbwtrxglujkzqofs (mobile-auth project)." },
      {
        text: "Add guest mode (bp.guest.v1 pattern): Clerk-layered guest writes → Supabase bp_guest_bookings. Required for App Store review.",
      },
      { text: "Test locally with Expo Go or custom dev client.", cmd: "npx expo start" },
    ],
    links: [
      { label: "Expo SDK 54 changelog", url: "https://expo.dev/changelog/sdk-54" },
      { label: "NativeWind v4 docs", url: "https://www.nativewind.dev/v4/overview" },
    ],
    updated: "2026-06-12",
  },
  {
    id: "mobile-eas-ios",
    title: "EAS Build & Submit — iOS",
    category: "Mobile Apps",
    tags: ["eas", "ios", "app-store", "testflight"],
    summary: "Build and submit an iOS app to TestFlight non-interactively.",
    steps: [
      {
        text: "First build MUST be interactive for Apple 2FA — do it once",
        cmd: "eas build --platform ios --profile production",
      },
      {
        text: "Subsequent builds are non-interactive + auto-submit",
        cmd: "eas build --platform ios --profile production --auto-submit --non-interactive",
      },
      { text: "Apple account: team B26C7G57HH, ASC API key GGF2G69XJ5 (AuthKey_GGF2G69XJ5.p8 in projects root)." },
      {
        text: "Check build state via ASC API: processingState=VALID means live.",
        link: { label: "ASC API", url: "https://developer.apple.com/documentation/appstoreconnectapi" },
      },
      { text: "Compare git HEAD vs latest build commit before shipping to avoid stale builds." },
      { text: "App Store screenshots: run _mobile-launch-audit/_build/shoot.cjs (iPhone 1290×2796, iPad 2048×2732).", cmd: "node _mobile-launch-audit/_build/shoot.cjs" },
    ],
    links: [
      { label: "EAS Submit docs", url: "https://docs.expo.dev/submit/ios/" },
    ],
    updated: "2026-06-12",
  },
  {
    id: "mobile-eas-android",
    title: "EAS Build & Submit — Android",
    category: "Mobile Apps",
    tags: ["eas", "android", "play-store", "aab"],
    summary: "Build AAB and upload to Google Play Console.",
    steps: [
      {
        text: "Build Android production AAB",
        cmd: "eas build --platform android --profile production",
      },
      {
        text: "First upload to Play Console must be manual (internal testing track). Download AAB from Expo build dashboard.",
      },
      {
        text: "Play Console 'unexpected error' fix: verify you're on the correct app ID in the URL. Wrong app ID = rotating hex error codes at 5% load.",
      },
      { text: "Play Console account: 'J Supreme Apps'." },
      {
        text: "After first manual upload, subsequent builds can use EAS Submit",
        cmd: "eas submit --platform android",
      },
    ],
    links: [
      { label: "EAS Submit Android", url: "https://docs.expo.dev/submit/android/" },
    ],
    updated: "2026-06-12",
  },

  // ─── CLIENT ONBOARDING ────────────────────────────────────────────────
  {
    id: "client-onboarding",
    title: "Client Onboarding Workflow",
    category: "Client Onboarding",
    tags: ["client", "crm", "intake", "contract"],
    summary: "From first contact to signed contract and project kickoff.",
    steps: [
      { text: "Log lead in CRM — set pipeline stage to 'Prospecting'." },
      { text: "Send intake form via /intake/<token> link or pipeline-intake page." },
      { text: "Brief call — capture brand, goals, timeline, budget in CRM notes." },
      { text: "Create project in /projects with budget, milestones, timeline." },
      { text: "Generate and send contract via /contracts. Client signs at /sign/<token>." },
      { text: "Send deposit invoice via /invoices (WiPay if card payment, else bank/cash)." },
      { text: "Move CRM stage to 'Active'. Add client to Back Office hub." },
      { text: "Gather brand assets: logo (must be the REAL logo file, not a placeholder), colors, fonts." },
      { text: "Kick off build workflow." },
    ],
    updated: "2026-06-12",
  },
  {
    id: "client-handoff",
    title: "Client Site Handoff",
    category: "Client Onboarding",
    tags: ["handoff", "client", "deploy", "docs"],
    summary: "Final handoff checklist after a client site is deployed.",
    steps: [
      { text: "Deploy to production Vercel URL." },
      { text: "Connect custom domain (Namecheap → Vercel A/CNAME records)." },
      { text: "Email client: login credentials, admin URL, support contact." },
      { text: "If CMS: walk through admin panel. Email admin login via notifications@jsupremeconglomerate.online (Resend)." },
      { text: "Update CRM: stage → 'Completed'. Log live URL in media links." },
      { text: "Add site to Vercel Sites hub and Back Office sidebar in j-supreme-conglomerate." },
      { text: "Invoice final balance." },
      { text: "Request Google Review / testimonial." },
    ],
    updated: "2026-06-12",
  },

  // ─── MARKETING & CREATIVE ─────────────────────────────────────────────
  {
    id: "social-media-missing-business-profile",
    title: "Social Media — Missing Business Profile: Fix & Workarounds",
    category: "Marketing & Creative",
    tags: ["instagram", "facebook", "meta", "tiktok", "linkedin", "youtube", "business-profile", "professional-account", "fix"],
    summary: "Team access, analytics, and scheduling all require a Business/Professional profile. Here's how to diagnose which account type you have and convert it on every platform — plus workarounds when you're stuck.",
    steps: [
      // ── DIAGNOSE FIRST ────────────────────────────────────────────────
      {
        text: "DIAGNOSE — Before touching anything, confirm what type of account exists. Personal accounts look identical to business accounts to an outside visitor. You must be logged into the account to see the account type in Settings.",
      },
      // ── INSTAGRAM ─────────────────────────────────────────────────────
      {
        text: "INSTAGRAM — Check: go to Profile → ☰ Menu → Settings and privacy → Account type and tools. If it says 'Switch to Professional Account', you are on a Personal account. If it shows 'Switch back to Personal', you are already a Creator or Business account.",
      },
      {
        text: "INSTAGRAM — Fix: tap 'Switch to Professional Account' → choose Creator (individual / influencer) or Business (brand / company) → select category → done. This is instant and reversible.",
        note: "Hiccup: Instagram may ask you to connect a Facebook Page. If the client has no Facebook Page yet, tap 'Skip' — you can connect it later. You do NOT need a Page to complete the conversion.",
      },
      {
        text: "INSTAGRAM — After converting: go to Settings → Account type and tools → Linked accounts and connect the Facebook Page. This is required for Meta Business Suite delegation and running ads.",
        note: "Hiccup: the Facebook Page must be OWNED BY THE SAME FACEBOOK ACCOUNT that is also logged into Instagram. If they're under different Facebook accounts you'll get a 'No Pages found' error — fix by moving the Page to the correct Facebook account first.",
      },
      {
        text: "INSTAGRAM — Workaround if they refuse to convert: you cannot add team access at all. Only workaround is credential sharing + giving them the 2FA backup codes. Frame the conversion as a non-negotiable for professional management.",
      },
      // ── FACEBOOK ──────────────────────────────────────────────────────
      {
        text: "FACEBOOK — Check: a Facebook Page is separate from a personal Facebook profile. If the client only has a personal profile (their name, not a business name), there is no Page — you must create one.",
      },
      {
        text: "FACEBOOK — Fix (create a Page): logged into the client's personal Facebook → click the + icon (top right) → Page → enter Page name, category, description → Create. The personal profile becomes the Page owner.",
        note: "Hiccup: the Page category matters for features. Choose 'Local business or place', 'Brand', or the most accurate category. You can change it after but mismatched categories affect discoverability.",
      },
      {
        text: "FACEBOOK — After creating the Page: add it to Meta Business Suite (business.facebook.com → Settings → Pages → Add → Add a Page). Now you can add team members via Business Suite → People.",
        note: "Hiccup: if Meta Business Suite says 'You don't have permission to add this Page', the Page owner (personal FB account) needs to do the Business Suite setup themselves first and then invite you as an admin.",
      },
      {
        text: "FACEBOOK — Workaround if no Page and client won't create one: you can manage limited things from the personal profile (posts, DMs) but you CANNOT run ads, view analytics properly, or add team members. Creating a Page is the only real fix.",
      },
      // ── TIKTOK ────────────────────────────────────────────────────────
      {
        text: "TIKTOK — Check: go to Profile → ☰ Menu → Settings and privacy → Account → Switch to Business Account. If this option appears, you're on a Personal account. If it says 'Switch to Personal Account', you're already on a Business account.",
      },
      {
        text: "TIKTOK — Fix: tap 'Switch to Business Account' → select a business category → done. This is free and instant.",
        note: "Hiccup: after switching to Business, the account loses access to many commercial/licensed sounds and songs in the sound library. Creator accounts retain more music rights. For brands posting original audio or voiceover content this is fine. For accounts that rely on trending audio → stay on Creator or accept the limitation.",
      },
      {
        text: "TIKTOK — After converting to Business: log into TikTok Business Center (business.tiktok.com) → Settings → Assets → TikTok Accounts → connect the account. Now you can invite team members.",
        note: "Hiccup: Business Center and the TikTok app are separate logins. The account must be connected to the Business Center from within the Business Center — not just being a Business account on the app is not enough.",
      },
      {
        text: "TIKTOK — Workaround if client won't switch to Business: credential sharing only. No other delegation option exists for non-Business TikTok accounts.",
      },
      // ── LINKEDIN ──────────────────────────────────────────────────────
      {
        text: "LINKEDIN — Check: go to linkedin.com/company — if the brand doesn't appear, no Company Page exists. The client may only have a personal LinkedIn profile. These are completely separate and you cannot post 'as a company' from a personal profile.",
      },
      {
        text: "LINKEDIN — Fix (create a Company Page): logged into the client's personal LinkedIn → click Work (top right grid) → Create a Company Page → select Page type (Company / Showcase / Educational Institution) → fill name, LinkedIn URL, industry, size → Create Page.",
        note: "Hiccup: LinkedIn requires the account to have at least 10 connections and a verified email address to create a Page. If the client's LinkedIn profile is new or sparse, they may get a 'you are not eligible' error. Fix: add connections and verify email first.",
      },
      {
        text: "LINKEDIN — After creating the Page: the creator is automatically Super Admin. Now go to Page → Admin tools → Manage admins → Add admin to invite team members (requires 1st-degree connection — see Social Media Access SOP).",
      },
      {
        text: "LINKEDIN — Workaround if client won't create a Company Page: you can only post from their personal profile, which has no admin delegation. Not suitable for brand management. Frame a Company Page as mandatory.",
      },
      // ── YOUTUBE ───────────────────────────────────────────────────────
      {
        text: "YOUTUBE — Check: go to myaccount.google.com → Brand Accounts. If the YouTube channel is under 'Brand Accounts', team delegation is available. If it's directly tied to a personal Google account (name = the Google account name), it is a personal channel with no delegation.",
      },
      {
        text: "YOUTUBE — Fix (convert personal channel to Brand Account): go to youtube.com/account_advanced → Move channel to a Brand Account → select 'Create a new Brand Account' or move to an existing one. The channel content, subscribers, and URL are preserved.",
        note: "Hiccup: this is a one-way operation for the URL — after moving, the personal Google account can still manage it, but the channel is now owned by the Brand Account. Confirm the client is OK with this before proceeding.",
      },
      {
        text: "YOUTUBE — After moving to a Brand Account: go to myaccount.google.com → Brand Accounts → Manage → Manage permissions → Invite new users. Now team members can be added without sharing the Google password.",
        note: "Hiccup: the invitee must have a Google/Gmail account. YouTube has no role for non-Google users.",
      },
      {
        text: "YOUTUBE — Workaround if client won't convert: credential sharing only. Log in via Chrome incognito to avoid session conflicts. Note: Google accounts trigger security alerts for logins from new devices/locations — owner must approve from their phone.",
      },
      // ── META BUSINESS SUITE NOT SHOWING THE ACCOUNT ───────────────────
      {
        text: "META BUSINESS SUITE — 'I can't see the Page/Instagram in Business Suite': the account may not be claimed yet. Go to business.facebook.com → Settings → Pages → Add a Page → enter the Page name. The Page admin must approve the claim.",
        note: "Hiccup: if another Business Manager already claimed the Page, you'll see 'This Page has already been claimed'. You must either request access from that Business Manager or the Page admin must remove it from the old BM first under business.facebook.com → Settings → Pages → Remove.",
      },
      {
        text: "META BUSINESS SUITE — Page claimed by a former agency/employee: the current Page admin (Facebook personal account with Admin role on the Page) goes to business.facebook.com → Settings → Pages → finds the Page → Removes it from that Business Manager. Then you can claim it in yours.",
        note: "Hiccup: if the former agency was the ONLY admin on the Page, the client may have lost access entirely. Recovery path: go to the Facebook Page → About → Page Transparency → see the Page creation date and original admin. Use Facebook's 'Request access to Page' feature and escalate via Facebook Business Support if needed.",
      },
    ],
    links: [
      { label: "Instagram: switch to Professional", url: "https://help.instagram.com/502981923235522" },
      { label: "Facebook: create a Page", url: "https://www.facebook.com/pages/create" },
      { label: "TikTok: Business Account switch", url: "https://ads.tiktok.com/help/article/switching-to-a-business-account" },
      { label: "LinkedIn: create a Company Page", url: "https://www.linkedin.com/help/linkedin/answer/a543852" },
      { label: "YouTube: move to Brand Account", url: "https://support.google.com/youtube/answer/2897336" },
    ],
    updated: "2026-06-13",
  },
  {
    id: "social-media-access",
    title: "Social Media Access — Granting & Removing",
    category: "Marketing & Creative",
    tags: ["instagram", "facebook", "meta", "tiktok", "linkedin", "youtube", "twitter", "x", "access", "team", "social"],
    summary: "All methods for granting team or agency access to client social media accounts, plus every hiccup you will hit.",
    steps: [
      // ── META (Facebook + Instagram) ──────────────────────────────────
      {
        text: "META — Go to Meta Business Suite (business.facebook.com) → Settings (gear icon) → People → Add People. Enter the person's work email and assign them to the Page and/or Ad Account.",
        note: "Hiccup: invitee must accept via email within 30 days — the invite expires silently. If they don't get it, check spam and resend from Business Settings → Pending Requests.",
      },
      {
        text: "META — Set the Page role: Admin (full control), Editor (posts + messaging, no settings), Moderator (comments + DMs only), Advertiser (ad creation only), Analyst (view insights only). Only give Admin when truly needed.",
        note: "Hiccup: 'Add People' sometimes refuses if the invitee's Facebook account is too new or lacks phone verification. Ask them to verify their account first, then retry.",
      },
      {
        text: "META — To grant Instagram access: the Instagram Professional Account must be connected to the Facebook Page. Then under Business Settings → Instagram Accounts → assign the person. They log into Instagram via their own Facebook.",
        note: "Hiccup: if the IG account is NOT connected to a Page (personal IG), you cannot use Business Suite access — you must share credentials directly or convert the IG to a Professional Account and link it.",
      },
      {
        text: "META — For Ad Account access specifically: Business Settings → Ad Accounts → select account → Add People → assign role (Advertiser or Admin). This is separate from Page access.",
        note: "Hiccup: a person can have Page Editor access but zero Ad Account access — both must be assigned explicitly.",
      },
      {
        text: "META — If the client uses legacy Facebook Page Roles (not Business Suite): go to the Facebook Page → Settings → Page Roles → Add a Person. They must be a Facebook friend OR you type their email.",
        note: "Hiccup: 'not finding the person' usually means they're not a Facebook friend AND the email they typed doesn't match an exact Facebook account. Ask for the email address on their FB profile.",
      },
      {
        text: "META — Two-Factor Authentication block: if the client's account has 2FA and someone new logs in from a new IP, Facebook will lock them out. The account owner must approve the login from their trusted device or temporarily add a trusted phone number for the new person.",
        note: "Hiccup: this is the #1 lockout cause. Always use Business Suite role assignment (so no shared password is needed) rather than direct credential sharing.",
      },
      // ── TIKTOK ────────────────────────────────────────────────────────
      {
        text: "TIKTOK — Business/Brand accounts: go to TikTok Business Center (business.tiktok.com) → Settings → Members → Invite Member. Enter their email and assign a role (Admin, Operator, Analyst).",
        note: "Hiccup: TikTok Business Center access only works for Business Accounts and TikTok Ads accounts. A personal creator account has NO delegation — credentials must be shared directly.",
      },
      {
        text: "TIKTOK — Creator accounts (no Business Center): share login credentials + the backup code for 2FA. Ask the client to temporarily disable 2FA or add the person's phone as a trusted device before handing over.",
        note: "Hiccup: TikTok aggressively flags logins from new devices/IPs — expect an OTP to the registered phone number before the first login. The account owner must be on standby.",
      },
      {
        text: "TIKTOK — After new login from a different IP, TikTok may require re-verification every 7–30 days. This is expected; it's not a sign the account was compromised.",
      },
      // ── TWITTER / X ───────────────────────────────────────────────────
      {
        text: "TWITTER/X — Native team access: if the account has X Premium (formerly Twitter Blue/Pro), use TweetDeck (x.com/i/tweetdeck) → Accounts → Add Account and authorize a team member. They manage the account without knowing the password.",
        note: "Hiccup: TweetDeck team access requires X Premium ($8–22/mo). Without it, you MUST share credentials.",
      },
      {
        text: "TWITTER/X — Without Premium: share username + password + 2FA backup codes. Ask the client to set 2FA to 'Authentication App' (not SMS) and share the backup code so the team isn't locked waiting for the client's phone.",
        note: "Hiccup: X's SMS 2FA was discontinued for non-Premium users. If 2FA is still set to SMS and the client loses access to that number, recovery is a long X support process.",
      },
      {
        text: "TWITTER/X — New login from a different device will trigger an email confirmation to the registered email. The account holder must click 'Yes, this was me' within the window or the login is blocked.",
        note: "Hiccup: if the client's recovery email is an old/unused address, this is a hard blocker. Fix: update X account email before granting team access.",
      },
      // ── LINKEDIN ──────────────────────────────────────────────────────
      {
        text: "LINKEDIN — Go to the LinkedIn Page (company page, not personal profile) → Admin tools → Manage admins → Add admin. Enter the person's name — they MUST be a 1st-degree LinkedIn connection of the current Super Admin.",
        note: "Hiccup: if they're not a 1st-degree connection, the search won't find them. Current admin must send a connection request first, wait for acceptance, then add.",
      },
      {
        text: "LINKEDIN — Roles: Super Admin (full control + billing), Content Admin (posts + analytics), Curator (content suggestions only), Analyst (analytics only), Sponsored Content Poster (ads). Use Content Admin for most team members.",
      },
      {
        text: "LINKEDIN — Personal profiles cannot be 'shared'. LinkedIn only allows role-based delegation on Pages. Never share LinkedIn personal login credentials — it violates ToS and risks permanent profile suspension.",
        note: "Hiccup: clients often confuse their LinkedIn personal profile with their LinkedIn Page. Confirm which one needs access — if it's a personal profile, there is NO official delegation method.",
      },
      // ── YOUTUBE ───────────────────────────────────────────────────────
      {
        text: "YOUTUBE — Brand Account (most business channels): go to myaccount.google.com → Brand Accounts → Manage → Manage permissions → Invite new users. Enter their Gmail. Roles: Owner (full), Manager (most things), Communications Manager (community posts only).",
        note: "Hiccup: both people need a Google/Gmail account. If the invitee doesn't have Gmail, they must create one — there's no email-address invitation for non-Google accounts.",
      },
      {
        text: "YOUTUBE — YouTube Studio access (for a personal channel not on a Brand Account): go to youtube.com/advanced_settings → Channel managers → Add or remove managers — same as Brand Account flow.",
        note: "Hiccup: invitee must accept the invite from their own Google account. Invite sits in their Google Account notifications, not email. Tell them to check myaccount.google.com → Brand Accounts.",
      },
      {
        text: "YOUTUBE — 2FA (Google account security): new logins trigger Google's security check. The account owner may receive a phone prompt asking 'Is this you?'. Owner must approve from their trusted device.",
        note: "Hiccup: if the account has advanced security (Google Advanced Protection), new device logins require a physical security key. Work with the client to add the manager's device as trusted before sharing access.",
      },
      // ── INSTAGRAM DIRECT (standalone) ─────────────────────────────────
      {
        text: "INSTAGRAM DIRECT (no Meta Business Suite) — For small/personal accounts: go to Instagram Settings → Account → Passwords → Share with / Supervised accounts is NOT a feature — you must share credentials. Enable 2FA via Auth App and share the backup codes.",
        note: "Hiccup: Instagram direct logins from new IPs or devices trigger a 6-digit code to the registered phone/email every single time. The account owner must be reachable to relay that code immediately. This is the biggest pain point for agencies.",
      },
      // ── REMOVING ACCESS ────────────────────────────────────────────────
      {
        text: "REMOVING ACCESS — Meta: Business Settings → People → find the person → Remove from all assets. For legacy Page roles: Facebook Page → Settings → Page Roles → Edit → Remove.",
        note: "Always remove access when a team member leaves before changing the password — removal via Business Suite is cleaner and does not affect other admins.",
      },
      {
        text: "REMOVING ACCESS — Change the account password after removing access from any platform where credentials were shared directly (Twitter/X creator TikTok, IG direct). Also regenerate 2FA backup codes so old codes are voided.",
      },
      // ── UNIVERSAL HICCUPS ──────────────────────────────────────────────
      {
        text: "UNIVERSAL HICCUP — 'I didn't get the invite': check spam folder first. If it never arrived, the email used may not match the account. Resend and confirm the exact email address on the platform profile.",
      },
      {
        text: "UNIVERSAL HICCUP — IP/Location block: platforms flag logins from new countries/cities. If you're granting access to someone in a different region from the account's usual location, expect a verification step. Have the account owner on WhatsApp to relay the code immediately.",
      },
      {
        text: "UNIVERSAL HICCUP — Account recovery email/phone is outdated: if the client can't receive 2FA codes because the phone number changed, start the platform's account recovery process BEFORE attempting to add team members. Recovery can take 1–7 days.",
      },
    ],
    links: [
      { label: "Meta Business Suite", url: "https://business.facebook.com" },
      { label: "TikTok Business Center", url: "https://business.tiktok.com" },
      { label: "LinkedIn Page Admin", url: "https://www.linkedin.com/help/linkedin/answer/a547885" },
      { label: "YouTube Brand Account Permissions", url: "https://support.google.com/youtube/answer/4628007" },
    ],
    updated: "2026-06-13",
  },
  {
    id: "marketing-ig-creatives",
    title: "IG Ad Creative Generation (HTML → PNG)",
    category: "Marketing & Creative",
    tags: ["instagram", "creative", "puppeteer", "ads"],
    summary: "Generate social media ad images using HTML templates + headless Chrome.",
    steps: [
      { text: "Write HTML template with inline SVG and brand variables." },
      { text: "Use puppeteer-core (not puppeteer) with global Chrome install to render at 1080×1080 (feed) or 1080×1920 (story).", note: "old generate-creatives.js relies on uninstalled puppeteer+react-icons — use puppeteer-core + inline SVG instead." },
      { text: "Run generation script from _build/ folder:", cmd: "node _build/gen.mjs" },
      { text: "Output to organized subfolders: posts/, stories/, covers/, flyer/." },
      { text: "Add preview image to deliverable folder for client preview." },
      { text: "Log campaign on /marketing board with asset count." },
    ],
    links: [
      { label: "Puppeteer-core docs", url: "https://pptr.dev/" },
      { label: "IG ad specs", url: "https://www.facebook.com/business/help/980593475366490" },
    ],
    updated: "2026-06-12",
  },
  {
    id: "marketing-campaign-creation",
    title: "Marketing Campaign Creation",
    category: "Marketing & Creative",
    tags: ["campaign", "marketing", "social", "plan"],
    summary: "End-to-end workflow for building a marketing campaign.",
    steps: [
      { text: "Define campaign brief: brand, goal, audience, timeline, budget." },
      { text: "Write 90-day strategy doc (Word: marketing-plan.docx, PDF export)." },
      { text: "Generate brand-aligned ad creatives (see IG Ad Creative SOP)." },
      { text: "Create content calendar: Mon→Sun narrative arc for each week." },
      { text: "Add to /marketing board in conglomerate — set campaign ID, asset count, narrative." },
      { text: "Log the campaign in the marketing-campaigns/plans.ts data file." },
      { text: "Deliver to client via OneDrive Desktop sync folder (not email attachment).", note: "Gmail MCP is draft-only and cannot attach files. Use OneDrive Desktop sync." },
    ],
    updated: "2026-06-12",
  },
  {
    id: "marketing-reel-video",
    title: "Reel / Video Creation",
    category: "Marketing & Creative",
    tags: ["video", "reel", "ffmpeg", "remotion"],
    summary: "Data-driven reel creation using Remotion or ffmpeg.",
    steps: [
      { text: "Use Remotion reels-studio at J Supreme Tech/reels-studio for data-driven reels.", cmd: "cd 'J Supreme Tech/reels-studio' && npm run render" },
      { text: "For fast ffmpeg edits: concat, overlay text, add captions (faster-whisper auto-captions).", cmd: "ffmpeg -i input.mp4 ..." },
      { text: "For auto-captions: run faster-whisper on audio, export SRT, burn into video with ffmpeg subtitles filter." },
      { text: "ElevenLabs voices: configure per-tutor in lib/voice-cast.json (Creator tier, key set)." },
      { text: "Export at 1080×1920 for Reels/Stories, 1080×1080 for Feed." },
      { text: "Tools on PATH: ffmpeg 8.1.1, ImageMagick Q16-HDRI, Inkscape 1.4.4, yt-dlp, sharp-cli." },
    ],
    links: [
      { label: "Remotion docs", url: "https://www.remotion.dev/docs/" },
      { label: "FFmpeg docs", url: "https://ffmpeg.org/documentation.html" },
    ],
    updated: "2026-06-12",
  },

  // ─── DESIGN & BRAND ──────────────────────────────────────────────────
  {
    id: "design-brand-system",
    title: "Brand System Creation",
    category: "Design & Brand",
    tags: ["brand", "logo", "colors", "typography"],
    summary: "Define and document a client brand system from scratch.",
    steps: [
      { text: "Gather source files from client: logo (vector preferred), color palette, any existing assets." },
      { text: "If no logo: create SVG in Inkscape or as React SVG component. Never use placeholder SVGs as finals." },
      { text: "Convert logo to transparent PNG: ImageMagick black-bg knock → transparent.", cmd: "magick logo.jpg -fuzz 5% -transparent black -trim logo-transparent.png" },
      { text: "Define color tokens: primary, accent, background, foreground, muted. Add to globals.css as CSS vars." },
      { text: "Typography: pick from Space Grotesk (headers), Inter (body), JetBrains Mono (code) for JST-adjacent projects — or source from client brand guide." },
      { text: "JST brand = pure mono B&W (NO color accent). Match everywhere.", note: "NO violet on JST brand. Source = jsupremetech.online. Kit in J Supreme Tech/_brand/." },
      { text: "Document brand kit in _brand/ folder. Add preview image." },
    ],
    links: [
      { label: "Google Fonts", url: "https://fonts.google.com/" },
      { label: "Coolors palette gen", url: "https://coolors.co/" },
    ],
    updated: "2026-06-12",
  },
  {
    id: "design-logo-handling",
    title: "Logo Handling Rules",
    category: "Design & Brand",
    tags: ["logo", "assets", "images"],
    summary: "How to correctly handle client logos across all projects.",
    steps: [
      { text: "Always use the REAL logo file: /public/logo.jpg or logo.png. The bundled SVG approximations are wrong and will misrepresent the brand." },
      { text: "Courier App: use /logo-white.jpg (white bg) and /logo-black.jpg (dark bg surface). The SVG approximations blend incorrectly." },
      { text: "To use on dark backgrounds: knock out background with ImageMagick or feColorMatrix SVG filter." },
      { text: "Preserve logo.png on Vercel builds (copy-logo.mjs must not rasterize the SVG placeholder over the real client logo)." },
      { text: "Language Cradle hero: Germany flag portrait must be a noticeably dark-skinned Black exec (light bg so he survives the black band). Use Unsplash + approved Pexels blazer man." },
      { text: "For new filenames after logo swap: use versioned names (logo-v2.jpg) to dodge browser/Vercel cache." },
    ],
    updated: "2026-06-12",
  },

  // ─── BUSINESS OPERATIONS ─────────────────────────────────────────────
  {
    id: "ops-invoice-workflow",
    title: "Invoice Workflow",
    category: "Business Operations",
    tags: ["invoice", "payment", "wipay", "resend"],
    summary: "Create, send, and track a client invoice.",
    steps: [
      { text: "Create invoice at /invoices/new — fill client, line items, due date." },
      { text: "For WiPay card payment: set up WiPay hosted-page integration (endpoint, hash = md5(tx+origTotal+key), sandbox 1234567890/'123')." },
      { text: "Send invoice link to client via Resend from notifications@jsupremeconglomerate.online." },
      { text: "WiPay effective fee: 4.83%. Factor into pricing or quote net." },
      { text: "Mark paid in /invoices once confirmed. Update CRM stage." },
      { text: "WiPay account: 1831565843 (env-configured)." },
    ],
    links: [
      { label: "WiPay Jamaica developer docs", url: "https://wipay.com.jm/developer" },
    ],
    updated: "2026-06-12",
  },
  {
    id: "ops-crm-management",
    title: "CRM Management",
    category: "Business Operations",
    tags: ["crm", "leads", "pipeline", "clients"],
    summary: "Keep the CRM current and pipeline clean.",
    steps: [
      { text: "One row per account in /crm. Use pipeline stage to track truthfully." },
      { text: "Log every meaningful client interaction in notes with date." },
      { text: "AI row fill: describe multiple fields in one sentence → sparkles button auto-parses." },
      { text: "Set Next Follow-Up date so nothing goes cold." },
      { text: "Archive (don't delete) lost leads — they reactivate." },
      { text: "Weekly review: filter by stage, update pipeline, identify stuck deals." },
    ],
    updated: "2026-06-12",
  },
  {
    id: "ops-project-management",
    title: "Project Management",
    category: "Business Operations",
    tags: ["projects", "milestones", "budget", "timeline"],
    summary: "Manage active client projects end-to-end.",
    steps: [
      { text: "Create project in /projects: client, budget, milestone dates, status." },
      { text: "Break into milestones: Brief, Design, Build, QA, Deploy, Handoff." },
      { text: "Track time against budget. Log blockers in project notes." },
      { text: "Run EOD report at /reports — brief daily summary of what shipped." },
      { text: "For large builds: use Site Launch Tower checklist for pre-launch audit.", link: { label: "Site Launch Tower", url: "/jarvis?tab=launch" } },
    ],
    updated: "2026-06-12",
  },

  // ─── INFRASTRUCTURE & DEVOPS ──────────────────────────────────────────
  {
    id: "infra-vercel-project-setup",
    title: "Vercel Project Setup",
    category: "Infrastructure & DevOps",
    tags: ["vercel", "project", "deploy", "env"],
    summary: "Link a local Next.js project to Vercel and configure for production.",
    steps: [
      { text: "Link project", cmd: "vercel link", note: "Select scope jordan-sketch-hue-projects." },
      { text: "Confirm framework is set to Next.js in project settings." },
      { text: "Set environment variables in Vercel dashboard (not via env pull)." },
      {
        text: "Production domain: set custom domain, verify DNS propagation.",
      },
      {
        text: "Enable Vercel Speed Insights and Analytics in project settings for real-user monitoring.",
      },
      {
        text: "⚠️ Do NOT run vercel env pull — writes .env.production.local with EMPTY Sensitive values that shadow .env.local and break server-side auth (hung Supabase sign-in, server 500s).",
      },
    ],
    links: [
      { label: "Vercel project settings", url: "https://vercel.com/docs/projects/overview" },
    ],
    updated: "2026-06-12",
  },
  {
    id: "infra-supabase-project-setup",
    title: "Supabase Project Setup",
    category: "Infrastructure & DevOps",
    tags: ["supabase", "database", "rls", "tables"],
    summary: "Create a new Supabase project with correct RLS and table conventions.",
    steps: [
      { text: "Create project in Supabase dashboard. Region: us-east-1 (closest to Jamaica)." },
      { text: "Enable email confirmation ON by default." },
      { text: "Tables: prefix with client abbreviation (bp_, mg_, st_, lc_, etc.)." },
      { text: "Enable RLS on ALL tables — never ship a table without RLS policies." },
      { text: "Add anon + authenticated policies as needed for public vs private data." },
      { text: "Copy SUPABASE_URL and SUPABASE_ANON_KEY to project .env.local and Vercel env vars." },
      { text: "For auth: use ibtadbwtrxglujkzqofs (mobile-auth) for mobile apps. Use ciggiwpztuxkmbaccrlp (live-data) for CMS/transactional data." },
      { text: "Generate TypeScript types after schema is set:", cmd: "supabase gen types typescript --project-id <id> > src/lib/supabase/types.ts" },
    ],
    links: [
      { label: "Supabase RLS docs", url: "https://supabase.com/docs/guides/auth/row-level-security" },
    ],
    updated: "2026-06-12",
  },
  {
    id: "infra-env-vars",
    title: "Environment Variable Management",
    category: "Infrastructure & DevOps",
    tags: ["env", "vercel", "secrets", "config"],
    summary: "Correctly set and manage environment variables across local and Vercel.",
    steps: [
      { text: "Local dev: put all vars in .env.local. Add .env.local to .gitignore." },
      {
        text: "Add to Vercel via dashboard or CLI. NEVER use Write-Output in PS 5.1 — BOM breaks parsing.",
        cmd: "cmd /c echo VALUE | vercel env add VAR_NAME production",
      },
      { text: "For sensitive vars (API keys, DB passwords): set as 'Sensitive' in Vercel — they appear empty in env pull." },
      { text: "⚠️ vercel env pull gotcha: creates .env.production.local with empty Sensitive values. These SHADOW .env.local and break auth. Rename or delete immediately after pull." },
      { text: "For local prod preview: use node --env-file=.env.local instead of relying on env pull." },
      { text: "Required vars for most JST projects: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, CLERK_PUBLISHABLE_KEY, CLERK_SECRET_KEY, RESEND_API_KEY, WIPAY_ACCOUNT_NO." },
    ],
    updated: "2026-06-12",
  },

  // ─── EMAIL & COMMUNICATION ────────────────────────────────────────────
  {
    id: "email-resend-setup",
    title: "Resend Transactional Email Setup",
    category: "Email & Communication",
    tags: ["resend", "email", "transactional", "notifications"],
    summary: "Wire Resend email to any JST project.",
    steps: [
      { text: "API key: stored in RESEND_API_KEY env var (Vercel + .env.local)." },
      { text: "Add RESEND_API_KEY to .env.local and Vercel env vars." },
      { text: "Verified sending domains: jsupremeconglomerate.online, solidtrustservices.com, thecleanserja.com." },
      { text: "Default from address: notifications@jsupremeconglomerate.online. Marketing: marketing@jsupremeconglomerate.online." },
      { text: "To send to any external inbox, you MUST send FROM a verified domain (not onboarding@resend.dev which only delivers to jordanmorrisr@gmail.com)." },
      { text: "Send via REST API (no npm dep needed):", note: "PS 5.1: read HTML body with [System.IO.File]::ReadAllText(path), NOT Get-Content -Raw (ETS properties break JSON → Resend 422)." },
      {
        text: "Fire-and-forget: the shared key is send-only (GET /emails returns 403). Don't try to poll delivery status.",
      },
      {
        text: "Resend MCP tools use a DIFFERENT, INVALID key — ignore them. Use REST API directly.",
      },
    ],
    links: [
      { label: "Resend REST API", url: "https://resend.com/docs/api-reference/emails/send-email" },
    ],
    updated: "2026-06-12",
  },
  {
    id: "email-client-communications",
    title: "Client Communication Flow",
    category: "Email & Communication",
    tags: ["email", "whatsapp", "client", "resend"],
    summary: "How to communicate with clients and deliver assets.",
    steps: [
      { text: "Primary contact: phone/WhatsApp (658) 218-2282, email global.jsuprememarketing@gmail.com." },
      { text: "Transactional emails (invoices, credentials, plans): send via Resend from notifications@jsupremeconglomerate.online." },
      { text: "Marketing emails: marketing@jsupremeconglomerate.online with reply_to = client address." },
      { text: "Gmail MCP is draft-only — cannot send or attach files. Use Resend for send path." },
      { text: "Deliver large assets (Word/PPT/PDFs) via OneDrive Desktop sync (Desktop\\<Client> folders sync automatically)." },
      { text: "JST contact on all marketing collateral: (658) 218-2282 + global.jsuprememarketing@gmail.com." },
    ],
    updated: "2026-06-12",
  },

  // ─── SECURITY & COMPLIANCE ────────────────────────────────────────────
  {
    id: "security-api-keys",
    title: "API Key & Secrets Management",
    category: "Security & Compliance",
    tags: ["security", "api-keys", "secrets", "compliance"],
    summary: "Keep credentials safe across all JST projects.",
    steps: [
      { text: "NEVER commit .env.local or any file containing API keys. Verify .gitignore covers .env*." },
      { text: "If a key is ever exposed in git history, revoke it immediately in the provider dashboard and rotate." },
      { text: "Supabase: use anon key for client-side, service_role key for server-side only (never expose in browser)." },
      { text: "Clerk: CLERK_SECRET_KEY is server-only. NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY is safe for client." },
      { text: "Operator credentials (architect/ops/support@jsupreme.cloud): rotate ALL stores simultaneously (Supabase auth, Payload, Clerk, file) or they desync." },
      { text: "Back-office probes (health-* endpoints) must not be touched — they are monitored." },
    ],
    updated: "2026-06-12",
  },
  {
    id: "security-site-legal",
    title: "Site Legal & Analytics Checklist",
    category: "Security & Compliance",
    tags: ["legal", "privacy", "analytics", "og"],
    summary: "Every public site must pass this before launch.",
    steps: [
      { text: "Add Privacy Policy page. Link in footer." },
      { text: "Add Terms of Service page. Link in footer." },
      { text: "Wire Google Analytics or Vercel Analytics." },
      { text: "Set OG image (opengraph-image.tsx or public/og.jpg) for social sharing." },
      { text: "Add sitemap.xml (Next.js app/sitemap.ts)." },
      { text: "Add robots.txt (allow all or block as needed)." },
      { text: "Check WCAG contrast ratios — use Vercel preview_eval + canvas for audit if screenshots time out." },
    ],
    updated: "2026-06-12",
  },
];
