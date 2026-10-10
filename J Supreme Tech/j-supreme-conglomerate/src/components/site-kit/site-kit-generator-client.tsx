"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ExternalLink, Loader2, Package, Rocket } from "lucide-react";
import type { SiteKitKind } from "@/lib/site-kit/types";

export type SiteKitPrefill = {
  projectName?: string;
  tagline?: string;
  description?: string;
  primaryColor?: string;
  baseUrl?: string;
  logoUrl?: string;
  contactEmail?: string;
};

export function SiteKitGeneratorClient({
  deployEnabled = false,
  initialClientId,
  initialFromClient,
}: {
  deployEnabled?: boolean;
  initialClientId?: string;
  initialFromClient?: SiteKitPrefill;
}) {
  const [kitKind, setKitKind] = useState<SiteKitKind>("website");
  const [projectName, setProjectName] = useState(initialFromClient?.projectName ?? "");
  const [tagline, setTagline] = useState(initialFromClient?.tagline ?? "");
  const [description, setDescription] = useState(initialFromClient?.description ?? "");
  const [primaryColor, setPrimaryColor] = useState(
    initialFromClient?.primaryColor ?? "#38bdf8",
  );
  const [baseUrl, setBaseUrl] = useState(initialFromClient?.baseUrl ?? "");
  const [logoUrl, setLogoUrl] = useState(initialFromClient?.logoUrl ?? "");
  const [contactEmail, setContactEmail] = useState(initialFromClient?.contactEmail ?? "");
  const [crmClientId, setCrmClientId] = useState(initialClientId ?? "");
  const [attachToClient, setAttachToClient] = useState(Boolean(initialClientId));
  const [busy, setBusy] = useState(false);
  const [busyDeploy, setBusyDeploy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deployUrl, setDeployUrl] = useState<string | null>(null);
  const [deployMeta, setDeployMeta] = useState<string | null>(null);

  const payload = () => ({
    kitKind,
    projectName: projectName.trim(),
    tagline: tagline.trim() || undefined,
    description: description.trim() || undefined,
    primaryColor: primaryColor.trim() || undefined,
    baseUrl: baseUrl.trim() || undefined,
    logoUrl: logoUrl.trim() || undefined,
    contactEmail: contactEmail.trim() || undefined,
  });

  const download = async () => {
    setError(null);
    setDeployMeta(null);
    setBusy(true);
    try {
      const res = await fetch("/api/v1/site-kit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload()),
      });
      if (!res.ok) {
        const j = (await res.json().catch(() => ({}))) as { error?: string };
        setError(j.error ?? `Request failed (${res.status})`);
        return;
      }
      const blob = await res.blob();
      const cd = res.headers.get("Content-Disposition");
      let name = "site-kit.zip";
      const m = cd?.match(/filename="([^"]+)"/);
      if (m?.[1]) name = m[1];
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = name;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Download failed");
    } finally {
      setBusy(false);
    }
  };

  const deploy = async () => {
    setError(null);
    setDeployMeta(null);
    setDeployUrl(null);
    setBusyDeploy(true);
    try {
      const res = await fetch("/api/v1/site-kit/deploy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...payload(),
          clientId: crmClientId.trim() || undefined,
          attachToClient: attachToClient && Boolean(crmClientId.trim()),
        }),
      });
      const j = (await res.json().catch(() => ({}))) as {
        error?: string;
        deploymentUrl?: string;
        crmLinkSaved?: boolean;
        crmLinkError?: string;
      };
      if (!res.ok) {
        setError(j.error ?? `Deploy failed (${res.status})`);
        return;
      }
      if (j.deploymentUrl) {
        setDeployUrl(j.deploymentUrl);
        const parts: string[] = [];
        if (j.crmLinkSaved) parts.push("Link saved to CRM client profile.");
        if (j.crmLinkError) parts.push(j.crmLinkError);
        setDeployMeta(parts.length ? parts.join(" ") : null);
      } else {
        setError("Deploy succeeded but no URL was returned.");
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Deploy failed");
    } finally {
      setBusyDeploy(false);
    }
  };

  const disableActions = !projectName.trim();
  const deployDisabled = disableActions || kitKind !== "website";

  return (
    <div className="mx-auto max-w-3xl space-y-8 pb-12">
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          Deliverables
        </p>
        <h1 className="font-jarvis text-3xl font-semibold tracking-tight flex items-center gap-2">
          <Package className="h-8 w-8 text-primary" />
          Client site kit
        </h1>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Turn intake-style details into a downloadable <strong className="text-foreground">ZIP</strong>{" "}
          you can hand off or deploy: multi-page <strong className="text-foreground">HTML5</strong> +{" "}
          <strong className="text-foreground">ES modules</strong> +{" "}
          <strong className="text-foreground">Tailwind</strong>, or a{" "}
          <strong className="text-foreground">React + Vite + TypeScript</strong> app — plus{" "}
          <strong className="text-foreground">JSON</strong> (package.json, vercel.json),{" "}
          <strong className="text-foreground">SVG</strong> favicon, <strong className="text-foreground">XML</strong>{" "}
          sitemap, and <strong className="text-foreground">robots.txt</strong>. A plain-text{" "}
          <span className="font-mono text-[11px]">BUILD-RUBRIC.txt</span> explains the stack.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Project details</CardTitle>
          <CardDescription>Paste what you collected from the client or intake form.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Deliverable type</Label>
            <Select value={kitKind} onValueChange={(v) => setKitKind(v as SiteKitKind)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="website">Static website (HTML5 + ESM + Tailwind CDN)</SelectItem>
                <SelectItem value="react-app">React app (Vite + TS + Tailwind + ES modules)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="sk-name">Project / brand name *</Label>
            <Input
              id="sk-name"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="Acme Co"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="sk-tag">Tagline</Label>
            <Input
              id="sk-tag"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              placeholder="Short hero line"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="sk-desc">About / problem / scope</Label>
            <Textarea
              id="sk-desc"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What they do, what they want fixed, positioning…"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="sk-color">Brand color (hex)</Label>
              <Input
                id="sk-color"
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
                placeholder="#0ea5e9"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sk-base">Live site URL (for sitemap)</Label>
              <Input
                id="sk-base"
                value={baseUrl}
                onChange={(e) => setBaseUrl(e.target.value)}
                placeholder="https://www.client.com"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="sk-logo">Logo image URL (optional)</Label>
            <Input
              id="sk-logo"
              value={logoUrl}
              onChange={(e) => setLogoUrl(e.target.value)}
              placeholder="https://…"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="sk-email">Contact email</Label>
            <Input
              id="sk-email"
              type="email"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              placeholder="hello@client.com"
            />
          </div>

          {deployEnabled ? (
            <div className="rounded-lg border border-border/80 bg-muted/30 p-4 space-y-3">
              <p className="text-sm font-medium text-foreground">Deploy to Vercel</p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                One-click upload of the <strong className="text-foreground">static website</strong> kit only.
                The token stays on the server; preview or production URL opens as soon as the deployment is ready.
              </p>
              <div className="space-y-2">
                <Label htmlFor="sk-crm-client">CRM client id (optional)</Label>
                <Input
                  id="sk-crm-client"
                  value={crmClientId}
                  onChange={(e) => setCrmClientId(e.target.value)}
                  placeholder="UUID from roster — use ?clientId= on this page to prefill"
                  className="font-mono text-xs"
                />
              </div>
              <label className="flex items-start gap-2 text-sm cursor-pointer select-none">
                <input
                  type="checkbox"
                  className="mt-1 h-4 w-4 rounded border border-input"
                  checked={attachToClient}
                  onChange={(e) => setAttachToClient(e.target.checked)}
                  disabled={!crmClientId.trim()}
                />
                <span className="text-muted-foreground">
                  Append deployment link to the client&apos;s profile links (
                  <span className="font-mono text-[11px]">extra_hyperlinks</span>, merge — no wipe)
                </span>
              </label>
            </div>
          ) : null}

          {error ? (
            <p className="text-sm text-destructive" role="alert">
              {error}
            </p>
          ) : null}

          {deployUrl ? (
            <div className="rounded-lg border border-primary/30 bg-primary/5 p-3 text-sm space-y-2">
              <p className="font-medium text-foreground">Live deployment</p>
              <a
                href={deployUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-primary underline-offset-4 hover:underline break-all"
              >
                {deployUrl}
                <ExternalLink className="h-3.5 w-3.5 shrink-0" />
              </a>
              {deployMeta ? (
                <p className="text-xs text-muted-foreground leading-relaxed">{deployMeta}</p>
              ) : null}
            </div>
          ) : null}

          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Button
              type="button"
              size="lg"
              className="w-full sm:w-auto"
              disabled={busy || disableActions}
              onClick={() => void download()}
            >
              {busy ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Building ZIP…
                </>
              ) : (
                <>
                  <Package className="mr-2 h-4 w-4" />
                  Download site kit (.zip)
                </>
              )}
            </Button>

            {deployEnabled ? (
              <Button
                type="button"
                size="lg"
                variant="secondary"
                className="w-full sm:w-auto"
                disabled={busyDeploy || deployDisabled}
                onClick={() => void deploy()}
              >
                {busyDeploy ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Deploying…
                  </>
                ) : (
                  <>
                    <Rocket className="mr-2 h-4 w-4" />
                    Deploy static site to Vercel
                  </>
                )}
              </Button>
            ) : null}
          </div>

          {kitKind !== "website" && deployEnabled ? (
            <p className="text-xs text-muted-foreground">
              Switch to the static website kit to enable one-click deploy, or download the React kit as a ZIP.
            </p>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}
