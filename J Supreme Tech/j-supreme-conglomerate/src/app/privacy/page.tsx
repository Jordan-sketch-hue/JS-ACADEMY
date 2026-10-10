/**
 * Public Privacy Policy — required for Meta App Review (the app's Privacy Policy URL).
 * Public route: added to middleware's isPublicRoute matcher.
 */
export const metadata = {
  title: "Privacy Policy · J Supreme Conglomerate",
  description:
    "How J Supreme Conglomerate collects, uses, and protects data, including data accessed through Meta (Facebook & Instagram) integrations.",
};

const UPDATED = "June 11, 2026";
const CONTACT_EMAIL = "global.jsuprememarketing@gmail.com";

export default function PrivacyPolicyPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-3xl font-bold tracking-tight">Privacy Policy</h1>
      <p className="mt-2 text-sm text-muted-foreground">Last updated: {UPDATED}</p>

      <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
        <p>
          This Privacy Policy explains how <strong>J Supreme Conglomerate</strong> (&ldquo;we&rdquo;,
          &ldquo;us&rdquo;, the &ldquo;Service&rdquo;), operated by J Supreme, collects, uses, stores, and
          protects information — including data accessed through connected{" "}
          <strong>Meta platforms (Facebook and Instagram)</strong> when you link those accounts to the Service.
          By using the Service or connecting a Meta account, you agree to this policy.
        </p>

        <h2>Who this applies to</h2>
        <p>
          The Service is a private operator workspace used by J Supreme to manage its own and its clients&rsquo;
          marketing, scheduling, and publishing. It is not a consumer product offered to the general public.
        </p>

        <h2>Information we collect</h2>
        <ul>
          <li>
            <strong>Account &amp; sign-in data</strong> — your identifier from our authentication provider
            (Clerk) used to scope your data to you.
          </li>
          <li>
            <strong>Content you create</strong> — scheduled posts, captions, media URLs, campaigns, and
            calendar entries you enter into the Service.
          </li>
          <li>
            <strong>Meta connection data</strong> — when you connect Facebook/Instagram, we receive and store:
            the IDs and names of the Facebook Pages, Instagram Business accounts, and ad accounts you grant
            access to, and the access tokens needed to act on your behalf.
          </li>
        </ul>

        <h2>How we use Meta data</h2>
        <p>We use data accessed via Meta APIs solely to provide features you explicitly request:</p>
        <ul>
          <li>
            <strong>Discover your assets</strong> (<code>pages_show_list</code>,{" "}
            <code>pages_read_engagement</code>, <code>instagram_basic</code>) — to list the Pages and Instagram
            accounts you can publish to.
          </li>
          <li>
            <strong>Publish content you schedule</strong> (<code>pages_manage_posts</code>,{" "}
            <code>instagram_content_publish</code>) — to post the exact content you create and schedule, at the
            time you choose. We never post without your scheduled instruction.
          </li>
          <li>
            <strong>Manage advertising you operate</strong> (<code>ads_read</code>,{" "}
            <code>ads_management</code>, <code>business_management</code>) — to read and manage ad campaigns on
            ad accounts you connect.
          </li>
        </ul>
        <p>
          We do <strong>not</strong> sell your data, use it for advertising profiling, or share Meta-derived
          data with third parties. Meta data is used only to operate the features above.
        </p>

        <h2>How tokens are protected</h2>
        <p>
          Access tokens are encrypted at rest using AES-256-GCM and are only decrypted server-side at the moment
          a publishing or management action you scheduled is performed. Tokens are never exposed to the browser
          or to any client-side code.
        </p>

        <h2>Data storage &amp; retention</h2>
        <p>
          Data is stored in our managed database (Supabase) with row-level security restricting access to our
          server. We retain connection and content data while your account/connection is active and delete it on
          request or when you disconnect an account.
        </p>

        <h2>Your choices &amp; data deletion</h2>
        <ul>
          <li>
            <strong>Disconnect anytime</strong> — removing a connected Meta account from the Service deletes its
            stored tokens and connection record.
          </li>
          <li>
            <strong>Revoke from Meta</strong> — you can remove this app&rsquo;s access at any time via{" "}
            <a href="https://www.facebook.com/settings?tab=business_tools" target="_blank" rel="noreferrer">
              Facebook Settings → Business Integrations
            </a>
            .
          </li>
          <li>
            <strong>Request deletion</strong> — email{" "}
            <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> and we will delete all data associated with
            your account, including tokens and stored Meta data, within 30 days.
          </li>
        </ul>

        <h2>Changes to this policy</h2>
        <p>
          We may update this policy; material changes will be reflected by the &ldquo;Last updated&rdquo; date
          above.
        </p>

        <h2>Contact</h2>
        <p>
          Questions or data requests: <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
        </p>
      </div>
    </main>
  );
}
