"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth, useUser } from "@clerk/nextjs";
import type {
  BackofficeAuthKind,
  BackofficeBrand,
  ProvisioningTarget,
} from "@/lib/conglomerate-backoffice/types";
import {
  buildClerkSatelliteHandoffUrl,
  resolvePanelHref,
} from "@/lib/conglomerate-backoffice/clerk-sso";
import { CONGLOMERATE_BACKOFFICE_REGISTRY } from "@/lib/conglomerate-backoffice/registry";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BrandLogo } from "@/components/brand/brand-logo";
import {
  Check,
  Copy,
  ExternalLink,
  Globe,
  KeyRound,
  LayoutDashboard,
  Plus,
  Shield,
} from "lucide-react";
import { OperatorsRoster } from "@/components/backoffice/architect-credentials-card";
import type { OperatorIdentity } from "@/lib/conglomerate-backoffice/architect";
import type { ExternalAccess } from "@/lib/conglomerate-backoffice/external-access";
import { CreateCredentialModal } from "@/components/backoffice/create-credential-modal";

const authLabels: Record<BackofficeAuthKind, string> = {
  clerk: "Clerk",
  supabase: "Supabase",
  payload: "Payload CMS",
  key: "Magic link",
  password: "Shared password",
  none: "Public",
};

function authBadgeVariant(auth: BackofficeAuthKind) {
  if (auth === "clerk") return "default";
  if (auth === "supabase" || auth === "key" || auth === "password") return "secondary";
  return "outline";
}

function PanelMeta({
  label,
  auth,
  description,
}: {
  label: string;
  auth: BackofficeAuthKind;
  description?: string;
}) {
  return (
    <div className="min-w-0 flex-1">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm font-medium">{label}</span>
        <Badge variant={authBadgeVariant(auth)} className="text-[10px] font-normal">
          {authLabels[auth]}
        </Badge>
      </div>
      {description ? (
        <p className="mt-0.5 text-[11px] text-muted-foreground">{description}</p>
      ) : null}
    </div>
  );
}

function SecretReveal({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false);
  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    } catch {
      /* clipboard may be blocked */
    }
  }
  return (
    <div className="mt-2 flex items-center gap-1.5 rounded-md border border-border/60 bg-background/50 px-2 py-1.5">
      <div className="min-w-0 flex-1">
        <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          {label}
        </p>
        <p className="mt-0.5 truncate font-mono text-xs">{value}</p>
      </div>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="h-7 w-7"
        onClick={copy}
        aria-label={`Copy ${label.toLowerCase()}`}
      >
        {copied ? (
          <Check className="h-3.5 w-3.5 text-emerald-500" />
        ) : (
          <Copy className="h-3.5 w-3.5" />
        )}
      </Button>
    </div>
  );
}

function BrandCard({
  brand,
  onProvision,
  externalAccess,
  clerkEnabled,
}: {
  brand: BackofficeBrand;
  onProvision?: (brand: BackofficeBrand) => void;
  externalAccess?: ExternalAccess;
  clerkEnabled?: boolean;
}) {
  const isInternal = brand.id === "j-supreme-conglomerate";
  const provisionable = !isInternal && (brand.provisioningTargets?.length ?? 0) > 0;

  return (
    <Card className="border-border/60 bg-card/50">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-start gap-2.5">
            {brand.logo ? <BrandLogo src={brand.logo} name={brand.name} className="h-9 w-9" /> : null}
            <CardTitle className="text-lg leading-snug">{brand.name}</CardTitle>
          </div>
          {brand.clerkShared ? (
            <Shield className="h-4 w-4 shrink-0 text-primary" aria-hidden />
          ) : null}
        </div>
        {brand.tagline ? (
          <CardDescription className="text-xs">{brand.tagline}</CardDescription>
        ) : null}
        {brand.clerkShared ? (
          <Badge className="mt-1 w-fit text-[10px] font-normal">Clerk SSO</Badge>
        ) : null}
      </CardHeader>
      <CardContent className="space-y-3 pt-0">
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" className="gap-1.5 text-xs" asChild>
            <a href={brand.websiteUrl} target="_blank" rel="noopener noreferrer">
              <Globe className="h-3.5 w-3.5" />
              Website
              <ExternalLink className="h-3 w-3 opacity-60" />
            </a>
          </Button>
          {brand.vercelProjectName ? (
            <Badge variant="outline" className="text-[10px] font-normal">
              {brand.vercelProjectName}
            </Badge>
          ) : null}
          {provisionable && onProvision ? (
            <Button
              size="sm"
              variant="secondary"
              className="ml-auto gap-1.5 text-xs"
              onClick={() => onProvision(brand)}
            >
              <Plus className="h-3.5 w-3.5" />
              Credential
            </Button>
          ) : null}
        </div>
        <ul className="space-y-2">
          {brand.panels.map((panel) => {
            const absolute = resolvePanelHref(panel.href);
            const useClerkHandoff =
              brand.clerkShared && panel.auth === "clerk" && !isInternal;
            let openUrl = useClerkHandoff
              ? buildClerkSatelliteHandoffUrl(absolute)
              : absolute;
            // Ship 2 Door panels open authenticated via a capability key.
            if (brand.id === "ship2door" && externalAccess) {
              if (panel.href.endsWith("/back-office")) openUrl = externalAccess.ship2doorMagicLink;
              else if (panel.href.endsWith("/portal")) openUrl = externalAccess.ship2doorPortalLink;
            }
            // Language Cradle CMS uses one shared password (no per-user accounts).
            const sharedPassword =
              brand.id === "language-cradle" && panel.auth === "password"
                ? externalAccess?.languageCradlePassword
                : undefined;

            if (isInternal && panel.href.startsWith("/")) {
              return (
                <li
                  key={panel.label}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border/50 bg-muted/20 px-3 py-2"
                >
                  <PanelMeta label={panel.label} auth={panel.auth} description={panel.description} />
                  <Button size="sm" className="text-xs" asChild>
                    <Link href={panel.href}>
                      <LayoutDashboard className="mr-1.5 h-3.5 w-3.5" />
                      Open
                    </Link>
                  </Button>
                </li>
              );
            }

            return (
              <li
                key={panel.label}
                className="rounded-lg border border-border/50 bg-muted/20 px-3 py-2"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <PanelMeta label={panel.label} auth={panel.auth} description={panel.description} />
                  <Button size="sm" className="gap-1 text-xs" asChild>
                    <a href={openUrl} target="_blank" rel="noopener noreferrer">
                      {panel.auth === "clerk" && brand.clerkShared ? (
                        <KeyRound className="h-3.5 w-3.5" />
                      ) : (
                        <ExternalLink className="h-3.5 w-3.5" />
                      )}
                      {panel.auth === "clerk"
                        ? "Back office"
                        : panel.auth === "key"
                          ? "Open (signed in)"
                          : "Open"}
                    </a>
                  </Button>
                </div>
                {sharedPassword ? (
                  <SecretReveal label="CMS password" value={sharedPassword} />
                ) : null}
              </li>
            );
          })}
        </ul>
        {brand.clerkShared && !isInternal && clerkEnabled ? <ClerkReuseHint /> : null}
      </CardContent>
    </Card>
  );
}

/** The Clerk-session hint at the bottom of a brand card (Clerk-only). */
function ClerkReuseHint() {
  const { isSignedIn } = useAuth();
  if (!isSignedIn) return null;
  return (
    <p className="text-[11px] text-muted-foreground">
      Clerk-protected pages reuse your CRM session when the satellite domain is configured.
    </p>
  );
}

/** Session status card — only mounted when Clerk is configured. */
function ClerkSessionCard() {
  const { isSignedIn, isLoaded } = useAuth();
  const { user } = useUser();
  if (!isLoaded) return null;
  return (
    <Card className="border-border/60 bg-card/50">
      <CardContent className="flex h-full flex-wrap items-center gap-3 py-4 text-sm">
        <KeyRound className="h-5 w-5 shrink-0 text-primary" />
        {isSignedIn ? (
          <span>
            Signed in as{" "}
            <strong className="font-medium">
              {user?.primaryEmailAddress?.emailAddress ?? user?.username ?? "operator"}
            </strong>
            . Clerk-backed back offices reuse this session on their domains.
          </span>
        ) : (
          <span className="flex flex-wrap items-center gap-1">
            Sign in on this app first, then open Clerk-backed back offices.
            <Button variant="link" className="h-auto px-1 text-sm" asChild>
              <Link href="/sign-in">Sign in</Link>
            </Button>
          </span>
        )}
      </CardContent>
    </Card>
  );
}

/**
 * Wraps the session card so the Clerk hooks are only ever called when Clerk is
 * configured. In no-Clerk dev/preview mode we render a static note instead —
 * otherwise useUser()/useAuth() throw (no <ClerkProvider/>).
 */
function OperatorSessionCard({ clerkEnabled }: { clerkEnabled: boolean }) {
  if (!clerkEnabled) {
    return (
      <Card className="border-border/60 bg-card/50">
        <CardContent className="flex h-full flex-wrap items-center gap-3 py-4 text-sm text-muted-foreground">
          <KeyRound className="h-5 w-5 shrink-0 text-primary" />
          <span>
            Copy a credential set on the left, then open any back office below. (CRM sign-in is
            handled by Clerk in production.)
          </span>
        </CardContent>
      </Card>
    );
  }
  return <ClerkSessionCard />;
}

export function ConglomerateBackofficeHub({
  operators,
  operatorsNote,
  externalAccess,
  clerkEnabled,
}: {
  operators: OperatorIdentity[];
  operatorsNote?: string;
  externalAccess?: ExternalAccess;
  clerkEnabled?: boolean;
}) {
  const [provisionFor, setProvisionFor] = useState<BackofficeBrand | null>(null);

  return (
    <div className="mx-auto max-w-5xl space-y-6 pb-12">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Back office</h1>
        <p className="max-w-2xl text-sm text-muted-foreground">
          One place to open every operations console and provision new operator credentials. The
          three operator accounts below all work on every external back office linked here.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <OperatorsRoster operators={operators} note={operatorsNote} />

        <OperatorSessionCard clerkEnabled={!!clerkEnabled} />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {CONGLOMERATE_BACKOFFICE_REGISTRY.map((brand) => (
          <BrandCard
            key={brand.id}
            brand={brand}
            onProvision={setProvisionFor}
            externalAccess={externalAccess}
            clerkEnabled={clerkEnabled}
          />
        ))}
      </div>

      <Card className="border-dashed">
        <CardHeader>
          <CardTitle className="text-base">Provisioning notes</CardTitle>
          <CardDescription className="text-xs">
            How the &ldquo;+ Credential&rdquo; button creates accounts end-to-end.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 text-xs text-muted-foreground">
          <ul className="list-disc space-y-1.5 pl-4">
            <li>
              <strong>AbooTours + Solace</strong> share one Supabase project — a single
              auth.users row works for both. AbooTours also gets an <code>abo_admins</code> row;
              Solace also needs the email added to <code>SOLACE_ADMIN_EMAILS</code> on Vercel
              (manual step, the modal reminds you).
            </li>
            <li>
              <strong>BP Courier Payload</strong> creates a <code>courier.users</code> row with a
              PBKDF2 hash (Payload&apos;s own format) so the /admin login accepts the password.
            </li>
            <li>
              <strong>BP Courier Clerk pages</strong> (/dispatch, /shipments…) use the same Clerk
              app as this CRM. Have the operator sign up here once, then set{" "}
              <code>publicMetadata.role = &quot;admin&quot;</code> in the Clerk Dashboard.
            </li>
            <li>
              All passwords are shown <strong>once</strong> right after creation — copy them into
              your secret manager. They are not persisted anywhere on this app.
            </li>
          </ul>
        </CardContent>
      </Card>

      <CreateCredentialModal
        open={provisionFor !== null}
        onClose={() => setProvisionFor(null)}
        defaultTargets={(provisionFor?.provisioningTargets ?? []) as ProvisioningTarget[]}
        brandName={provisionFor?.name ?? ""}
      />
    </div>
  );
}
