"use client";

import type { ProjectWorkflowWithTasks } from "@/lib/data/project-workflows";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { BrandLogo } from "@/components/brand/brand-logo";
import {
  ExternalLink,
  FileImage,
  FileText,
  FolderOpen,
  GitBranch,
  LayoutDashboard,
  Rocket,
  Sparkles,
} from "lucide-react";

/** Curated client mockups not yet promoted to the project workflows DB. */
const FEATURED_MOCKUPS: Array<{
  id: string;
  name: string;
  tagline: string;
  initials: string;
  accent: string;
  logo?: string;
  tags: string[];
  links: { label: string; url: string }[];
  notes?: string;
}> = [
  {
    id: "language-cradle",
    name: "The Language Cradle · IBLC",
    tagline:
      "Language & Cultural Intelligence Institute · 5-tone theme palette, Global Voice™ programme, intake-form mockups, Lyra annotation system.",
    initials: "LC",
    accent: "from-red-600 via-yellow-500 to-green-600",
    logo: "/brands/language-cradle.webp",
    tags: ["Mockup", "Next.js 16", "IBLC", "Jamaica"],
    links: [
      { label: "Mockup (banner labelled)", url: "https://language-cradle-mockup.vercel.app" },
      { label: "Production (clean)",       url: "https://language-cradle.vercel.app" },
    ],
    notes:
      "Built for Dr. Nadine Boothe-Gooden · IBLC. Includes 5 service pillars (Corporate, Translation, Cultural Intelligence, Online, Academic editing) and the full Global Voice™ programme (6 modules, 3 tiers · $1,500–$5,000).",
  },
];

type AutomationPackage = {
  generatedAt?: string;
  productionStage?: string;
  brandIdentity?: {
    positioning?: string;
    personality?: string[];
    visualDirection?: string[];
    colorSystem?: string[];
  };
  buildPlan?: {
    projectType?: string;
    pages?: string[];
    components?: string[];
    integrations?: string[];
    acceptanceCriteria?: string[];
  };
  codexBuildPrompt?: string;
  presentationOutline?: string[];
  midjourneyPrompts?: string[];
  adobeAssetChecklist?: string[];
  notes?: string[];
};

function automationPackage(workflow: ProjectWorkflowWithTasks): AutomationPackage | null {
  const raw = workflow.brand_brief?.automation;
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return null;
  return raw as AutomationPackage;
}

function workflowLinks(workflow: ProjectWorkflowWithTasks) {
  return [
    { label: "Finished product", url: workflow.deployment_url, icon: Rocket },
    { label: "Preview sample", url: workflow.preview_url, icon: ExternalLink },
    { label: "Presentation / design", url: workflow.design_url, icon: LayoutDashboard },
    { label: "Files / assets", url: workflow.asset_folder_url, icon: FolderOpen },
    { label: "GitHub repo", url: workflow.github_url, icon: GitBranch },
  ].filter((item) => item.url);
}

export function ClientShowcaseClient({
  workflows,
}: {
  workflows: ProjectWorkflowWithTasks[];
}) {
  const ready = workflows.filter((workflow) => {
    const automation = automationPackage(workflow);
    return automation || workflowLinks(workflow).length > 0;
  });

  const finished = workflows.filter((workflow) => workflow.deployment_url).length;
  const presentations = workflows.filter((workflow) => {
    const automation = automationPackage(workflow);
    return workflow.design_url || automation?.presentationOutline?.length;
  }).length;
  const fileSets = workflows.filter((workflow) => {
    const automation = automationPackage(workflow);
    return workflow.asset_folder_url || automation?.adobeAssetChecklist?.length || automation?.midjourneyPrompts?.length;
  }).length;

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Client Showcase
          </p>
          <h1 className="font-jarvis text-3xl font-semibold tracking-tight">
            Finished products, presentation assets, and next moves
          </h1>
          <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground">
            A client-ready command view for live products, preview samples, visual presentation
            direction, file links, and the plan moving forward.
          </p>
        </div>
        <div className="grid grid-cols-3 gap-2 text-right text-xs sm:min-w-[360px]">
          <div className="rounded-lg border border-border/70 bg-muted/20 p-3">
            <p className="text-muted-foreground">Products</p>
            <p className="text-xl font-semibold">{finished}</p>
          </div>
          <div className="rounded-lg border border-border/70 bg-muted/20 p-3">
            <p className="text-muted-foreground">Presentations</p>
            <p className="text-xl font-semibold">{presentations}</p>
          </div>
          <div className="rounded-lg border border-border/70 bg-muted/20 p-3">
            <p className="text-muted-foreground">File sets</p>
            <p className="text-xl font-semibold">{fileSets}</p>
          </div>
        </div>
      </div>

      {/* ────────── Featured external mockups (curated, not DB-driven) ────────── */}
      <div className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          Featured client mockups
        </p>
        <div className="grid gap-3 md:grid-cols-2">
          {FEATURED_MOCKUPS.map((m) => (
            <Card key={m.id} className="overflow-hidden">
              <CardHeader className="gap-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="success">Mockup live</Badge>
                      {m.tags.map((t) => (
                        <Badge key={t} variant="outline">{t}</Badge>
                      ))}
                    </div>
                    <CardTitle className="text-lg">{m.name}</CardTitle>
                    <CardDescription className="max-w-xl">{m.tagline}</CardDescription>
                  </div>
                  <BrandLogo
                    src={m.logo}
                    name={m.name}
                    initials={m.initials}
                    className="h-10 w-10"
                    fallbackClassName={m.accent}
                  />
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-2 sm:grid-cols-2">
                  {m.links.map((link) => (
                    <Button key={link.label} asChild variant="secondary" className="justify-start">
                      <a href={link.url} target="_blank" rel="noreferrer">
                        <ExternalLink className="mr-2 h-4 w-4" />
                        {link.label}
                      </a>
                    </Button>
                  ))}
                </div>
                {m.notes ? (
                  <p className="mt-3 text-xs text-muted-foreground leading-relaxed">{m.notes}</p>
                ) : null}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {!ready.length ? (
        <Card className="border-dashed bg-transparent">
          <CardHeader>
            <CardTitle className="text-base">No DB showcase packages yet</CardTitle>
            <CardDescription>
              Run automation from CRM or Projects. Generated products, presentation notes, image
              directions, and file links will appear here.
            </CardDescription>
          </CardHeader>
        </Card>
      ) : null}

      <div className="space-y-4">
        {ready.map((workflow) => {
          const automation = automationPackage(workflow);
          const links = workflowLinks(workflow);
          const nextPlan = [
            ...(automation?.buildPlan?.acceptanceCriteria ?? []),
            ...(automation?.notes ?? []),
          ];

          return (
            <Card key={workflow.id} className="overflow-hidden">
              <CardHeader className="gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="space-y-2">
                  <div className="flex flex-wrap gap-2">
                    <Badge variant={workflow.deployment_url ? "success" : "outline"}>
                      {workflow.deployment_url ? "Product link ready" : "Package ready"}
                    </Badge>
                    {automation?.productionStage ? (
                      <Badge variant="secondary">{automation.productionStage.replace(/_/g, " ")}</Badge>
                    ) : null}
                    {workflow.service_category ? (
                      <Badge variant="outline">{workflow.service_category}</Badge>
                    ) : null}
                  </div>
                  <CardTitle className="text-xl">{workflow.title}</CardTitle>
                  {automation?.brandIdentity?.positioning ? (
                    <CardDescription className="max-w-3xl">
                      {automation.brandIdentity.positioning}
                    </CardDescription>
                  ) : null}
                </div>
                <Button asChild variant="outline" size="sm">
                  <a href={`/projects?workflow=${workflow.id}`}>
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    Open workflow
                  </a>
                </Button>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
                  {links.length ? (
                    links.map((item) => {
                      const Icon = item.icon;
                      return (
                        <Button key={`${item.label}-${item.url}`} asChild variant="secondary" className="justify-start">
                          <a href={item.url ?? "#"} target="_blank" rel="noreferrer">
                            <Icon className="mr-2 h-4 w-4" />
                            {item.label}
                          </a>
                        </Button>
                      );
                    })
                  ) : (
                    <div className="rounded-lg border border-dashed border-border/70 p-3 text-sm text-muted-foreground md:col-span-2 xl:col-span-5">
                      No external links saved yet. Add design, file, preview, or deployment links in Projects.
                    </div>
                  )}
                </div>

                <div className="grid gap-4 lg:grid-cols-3">
                  <div className="rounded-lg border border-border/70 bg-muted/20 p-4">
                    <div className="mb-3 flex items-center gap-2">
                      <FileText className="h-4 w-4 text-primary" />
                      <h2 className="text-sm font-semibold">Visual presentation</h2>
                    </div>
                    {automation?.presentationOutline?.length ? (
                      <ul className="list-disc space-y-1 pl-4 text-sm text-muted-foreground">
                        {automation.presentationOutline.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        Presentation outline will appear after automation runs.
                      </p>
                    )}
                  </div>

                  <div className="rounded-lg border border-border/70 bg-muted/20 p-4">
                    <div className="mb-3 flex items-center gap-2">
                      <FileImage className="h-4 w-4 text-primary" />
                      <h2 className="text-sm font-semibold">Picture / mockup direction</h2>
                    </div>
                    {automation?.midjourneyPrompts?.length ? (
                      <Textarea
                        readOnly
                        rows={7}
                        value={automation.midjourneyPrompts.join("\n\n")}
                        className="resize-y text-xs leading-relaxed"
                      />
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        Image prompts and mockup direction will appear after automation runs.
                      </p>
                    )}
                  </div>

                  <div className="rounded-lg border border-border/70 bg-muted/20 p-4">
                    <div className="mb-3 flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-primary" />
                      <h2 className="text-sm font-semibold">Moving-forward plan</h2>
                    </div>
                    {nextPlan.length ? (
                      <ul className="list-disc space-y-1 pl-4 text-sm text-muted-foreground">
                        {nextPlan.slice(0, 8).map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        Next actions will appear here once the workflow has a generated package.
                      </p>
                    )}
                  </div>
                </div>

                {automation?.adobeAssetChecklist?.length ? (
                  <div className="rounded-lg border border-border/70 p-4">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                      File-form assets to package
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {automation.adobeAssetChecklist.map((asset) => (
                        <Badge key={asset} variant="outline">
                          {asset}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ) : null}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
