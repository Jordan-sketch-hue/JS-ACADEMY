"use client";

import { useMemo, useState, useTransition } from "react";
import {
  runProjectWorkflowAutomationAction,
  updateProjectWorkflowLinksAction,
} from "@/app/(app)/projects/actions";
import type {
  ProjectWorkflowWithTasks,
  WorkflowStatus,
} from "@/lib/data/project-workflows";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ExternalLink, GitBranch, LayoutDashboard, Link2, Loader2, Rocket, Sparkles } from "lucide-react";

const STATUS_OPTIONS: Array<{ value: WorkflowStatus; label: string }> = [
  { value: "discovery", label: "Discovery" },
  { value: "planning", label: "Planning" },
  { value: "design", label: "Design" },
  { value: "build", label: "Build" },
  { value: "review", label: "Review" },
  { value: "launched", label: "Launched" },
  { value: "support", label: "Support" },
];

type LinkState = {
  deployment_url: string;
  preview_url: string;
  github_url: string;
  design_url: string;
  asset_folder_url: string;
  status: WorkflowStatus;
};

type AutomationPackage = {
  generatedAt?: string;
  mode?: string;
  productionStage?: string;
  brandIdentity?: {
    positioning?: string;
    personality?: string[];
    visualDirection?: string[];
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

function linkStateFromWorkflow(workflow: ProjectWorkflowWithTasks): LinkState {
  return {
    deployment_url: workflow.deployment_url ?? "",
    preview_url: workflow.preview_url ?? "",
    github_url: workflow.github_url ?? "",
    design_url: workflow.design_url ?? "",
    asset_folder_url: workflow.asset_folder_url ?? "",
    status: workflow.status,
  };
}

function statusBadgeVariant(status: WorkflowStatus) {
  if (status === "launched") return "success" as const;
  if (status === "review" || status === "support") return "warning" as const;
  return "outline" as const;
}

function publicLinks(workflow: ProjectWorkflowWithTasks) {
  return [
    { label: "Live", url: workflow.deployment_url, icon: ExternalLink },
    { label: "Preview", url: workflow.preview_url, icon: Rocket },
    { label: "GitHub", url: workflow.github_url, icon: GitBranch },
    { label: "Design", url: workflow.design_url, icon: LayoutDashboard },
    { label: "Assets", url: workflow.asset_folder_url, icon: Link2 },
  ].filter((item) => item.url);
}

function automationPackage(workflow: ProjectWorkflowWithTasks): AutomationPackage | null {
  const raw = workflow.brand_brief?.automation;
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return null;
  return raw as AutomationPackage;
}

export function ProjectsClient({
  initialWorkflows,
}: {
  initialWorkflows: ProjectWorkflowWithTasks[];
}) {
  const [workflows, setWorkflows] = useState(initialWorkflows);
  const [forms, setForms] = useState<Record<string, LinkState>>(() =>
    Object.fromEntries(initialWorkflows.map((w) => [w.id, linkStateFromWorkflow(w)])),
  );
  const [savingId, setSavingId] = useState<string | null>(null);
  const [automationBusyId, setAutomationBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const totalTasks = useMemo(
    () => workflows.reduce((sum, workflow) => sum + workflow.tasks.length, 0),
    [workflows],
  );

  const saveWorkflow = (workflow: ProjectWorkflowWithTasks) => {
    const state = forms[workflow.id];
    if (!state) return;
    setError(null);
    setSavingId(workflow.id);
    startTransition(async () => {
      try {
        const r = await updateProjectWorkflowLinksAction(workflow.id, state);
        if (!r.ok) {
          setError(r.error);
          return;
        }
        setWorkflows((prev) =>
          prev.map((item) => (item.id === workflow.id ? { ...item, ...r.workflow } : item)),
        );
      } finally {
        setSavingId(null);
      }
    });
  };

  const runAutomation = (workflow: ProjectWorkflowWithTasks) => {
    setError(null);
    setAutomationBusyId(workflow.id);
    startTransition(async () => {
      try {
        const r = await runProjectWorkflowAutomationAction(workflow.id);
        if (!r.ok) {
          setError(r.error);
          return;
        }
        setWorkflows((prev) =>
          prev.map((item) => (item.id === workflow.id ? { ...item, ...r.workflow } : item)),
        );
        setForms((prev) => ({
          ...prev,
          [workflow.id]: {
            ...(prev[workflow.id] ?? linkStateFromWorkflow(workflow)),
            deployment_url: r.workflow.deployment_url ?? "",
            preview_url: r.workflow.preview_url ?? "",
            github_url: r.workflow.github_url ?? "",
            design_url: r.workflow.design_url ?? "",
            asset_folder_url: r.workflow.asset_folder_url ?? "",
            status: r.workflow.status,
          },
        }));
      } finally {
        setAutomationBusyId(null);
      }
    });
  };

  const updateField = (workflowId: string, patch: Partial<LinkState>) => {
    setForms((prev) => ({
      ...prev,
      [workflowId]: {
        ...(prev[workflowId] ?? {
          deployment_url: "",
          preview_url: "",
          github_url: "",
          design_url: "",
          asset_folder_url: "",
          status: "discovery",
        }),
        ...patch,
      },
    }));
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Intake workflows
          </p>
          <h1 className="font-jarvis text-3xl font-semibold tracking-tight">Projects</h1>
          <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground">
            Workflows started from intake responses appear here with SOP task plans, project status,
            and link fields for deployed work, repositories, design files, and client assets.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-2 text-right text-xs sm:min-w-[220px]">
          <div className="rounded-lg border border-border/70 bg-muted/20 p-3">
            <p className="text-muted-foreground">Workflows</p>
            <p className="text-xl font-semibold">{workflows.length}</p>
          </div>
          <div className="rounded-lg border border-border/70 bg-muted/20 p-3">
            <p className="text-muted-foreground">SOP tasks</p>
            <p className="text-xl font-semibold">{totalTasks}</p>
          </div>
        </div>
      </div>

      {error ? (
        <Card className="border-destructive/40 bg-destructive/10">
          <CardContent className="py-3 text-sm text-destructive">{error}</CardContent>
        </Card>
      ) : null}

      {!workflows.length ? (
        <Card className="border-dashed bg-transparent">
          <CardHeader className="text-center">
            <CardTitle className="text-base">No project workflows yet</CardTitle>
            <CardDescription>
              Open Pipeline intake, choose a submission, then press Start Workflow.
            </CardDescription>
          </CardHeader>
        </Card>
      ) : null}

      <div className="space-y-4">
        {workflows.map((workflow) => {
          const state = forms[workflow.id] ?? linkStateFromWorkflow(workflow);
          const links = publicLinks(workflow);
          const automation = automationPackage(workflow);
          const phaseMap = new Map<string, typeof workflow.tasks>();
          for (const task of workflow.tasks) {
            const list = phaseMap.get(task.phase) ?? [];
            list.push(task);
            phaseMap.set(task.phase, list);
          }

          return (
            <Card key={workflow.id} className="overflow-hidden">
              <CardHeader className="gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant={statusBadgeVariant(workflow.status)}>
                      {STATUS_OPTIONS.find((s) => s.value === workflow.status)?.label ?? workflow.status}
                    </Badge>
                    {workflow.service_category ? (
                      <Badge variant="secondary">{workflow.service_category}</Badge>
                    ) : null}
                  </div>
                  <CardTitle className="text-xl">{workflow.title}</CardTitle>
                  <CardDescription>
                    Started {workflow.created_at ? new Date(workflow.created_at).toLocaleString() : "recently"}
                  </CardDescription>
                </div>
                {links.length ? (
                  <div className="flex flex-wrap gap-2 lg:justify-end">
                    {links.map((item) => {
                      const Icon = item.icon;
                      return (
                        <Button key={item.label} asChild variant="outline" size="sm">
                          <a href={item.url ?? "#"} target="_blank" rel="noreferrer">
                            <Icon className="mr-2 h-4 w-4" />
                            {item.label}
                          </a>
                        </Button>
                      );
                    })}
                  </div>
                ) : null}
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 lg:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)]">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Client brief</Label>
                      <Textarea
                        value={workflow.project_brief ?? "No intake brief stored."}
                        readOnly
                        rows={8}
                        className="resize-y text-xs leading-relaxed"
                      />
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between gap-3">
                        <Label>SOP task plan</Label>
                        <span className="text-xs text-muted-foreground">{workflow.tasks.length} tasks</span>
                      </div>
                      <div className="grid gap-3 md:grid-cols-2">
                        {Array.from(phaseMap.entries()).map(([phase, tasks]) => (
                          <div key={phase} className="rounded-lg border border-border/70 bg-muted/20 p-3">
                            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                              {phase}
                            </p>
                            <div className="space-y-2">
                              {tasks.map((task) => (
                                <div key={task.id} className="rounded-md border border-border/50 bg-background/50 p-2">
                                  <p className="text-sm font-medium">{task.title}</p>
                                  {task.description ? (
                                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                                      {task.description}
                                    </p>
                                  ) : null}
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4 rounded-lg border border-border/70 bg-muted/20 p-4">
                    <div className="space-y-1">
                      <h2 className="text-sm font-semibold">Project links and status</h2>
                      <p className="text-xs leading-relaxed text-muted-foreground">
                        Add client-ready links as work moves from design to deployment.
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label>Status</Label>
                      <Select
                        value={state.status}
                        onValueChange={(value) => updateField(workflow.id, { status: value as WorkflowStatus })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {STATUS_OPTIONS.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    {[
                      ["deployment_url", "Live deployment URL"],
                      ["preview_url", "Preview / staging URL"],
                      ["github_url", "GitHub repository"],
                      ["design_url", "Adobe / design file"],
                      ["asset_folder_url", "Asset folder / client files"],
                    ].map(([key, label]) => (
                      <div key={key} className="space-y-2">
                        <Label htmlFor={`${workflow.id}-${key}`}>{label}</Label>
                        <Input
                          id={`${workflow.id}-${key}`}
                          type="url"
                          placeholder="https://"
                          value={state[key as keyof LinkState]}
                          onChange={(e) =>
                            updateField(workflow.id, {
                              [key]: e.target.value,
                            } as Partial<LinkState>)
                          }
                        />
                      </div>
                    ))}
                    <Button
                      type="button"
                      className="w-full"
                      disabled={pending && savingId === workflow.id}
                      onClick={() => saveWorkflow(workflow)}
                    >
                      {pending && savingId === workflow.id ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Saving
                        </>
                      ) : (
                        "Save workflow"
                      )}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full"
                      disabled={pending && automationBusyId === workflow.id}
                      onClick={() => runAutomation(workflow)}
                    >
                      {pending && automationBusyId === workflow.id ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Running automation
                        </>
                      ) : (
                        <>
                          <Sparkles className="mr-2 h-4 w-4" />
                          Run automation
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                {automation ? (
                  <div className="grid gap-4 lg:grid-cols-2">
                    <div className="rounded-lg border border-primary/25 bg-primary/[0.05] p-4">
                      <div className="mb-3 flex flex-wrap items-center gap-2">
                        <Badge variant="secondary">Automation package</Badge>
                        {automation.mode ? <Badge variant="outline">{automation.mode}</Badge> : null}
                        {automation.productionStage ? (
                          <Badge variant={automation.productionStage === "deployed" ? "success" : "warning"}>
                            {automation.productionStage.replace(/_/g, " ")}
                          </Badge>
                        ) : null}
                      </div>
                      <div className="space-y-3 text-sm">
                        {automation.brandIdentity?.positioning ? (
                          <p className="leading-relaxed text-muted-foreground">
                            {automation.brandIdentity.positioning}
                          </p>
                        ) : null}
                        {automation.buildPlan?.pages?.length ? (
                          <div>
                            <p className="mb-1 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                              Pages / screens
                            </p>
                            <p>{automation.buildPlan.pages.join(" / ")}</p>
                          </div>
                        ) : null}
                        {automation.presentationOutline?.length ? (
                          <div>
                            <p className="mb-1 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                              Presentation flow
                            </p>
                            <ul className="list-disc space-y-1 pl-4 text-muted-foreground">
                              {automation.presentationOutline.map((item) => (
                                <li key={item}>{item}</li>
                              ))}
                            </ul>
                          </div>
                        ) : null}
                      </div>
                    </div>
                    <div className="space-y-4">
                      {automation.codexBuildPrompt ? (
                        <div className="space-y-2">
                          <Label>Codex build prompt</Label>
                          <Textarea
                            readOnly
                            rows={8}
                            value={automation.codexBuildPrompt}
                            className="resize-y text-xs leading-relaxed"
                          />
                        </div>
                      ) : null}
                      {automation.midjourneyPrompts?.length ? (
                        <div className="space-y-2">
                          <Label>Midjourney image direction</Label>
                          <Textarea
                            readOnly
                            rows={5}
                            value={automation.midjourneyPrompts.join("\n\n")}
                            className="resize-y text-xs leading-relaxed"
                          />
                        </div>
                      ) : null}
                      {automation.notes?.length ? (
                        <div className="rounded-lg border border-border/70 bg-muted/20 p-3 text-xs leading-relaxed text-muted-foreground">
                          {automation.notes.join(" ")}
                        </div>
                      ) : null}
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
