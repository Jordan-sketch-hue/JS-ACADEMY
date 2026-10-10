"use client";

import { useCallback, useEffect, useMemo, useState, useTransition } from "react";
import type { ClientIntakeForm, ClientIntakeSubmission } from "@/lib/data/intake-forms";
import {
  formatIntakeAnswersHumanReadable,
  intakePrimaryFocusFromSubmission,
  intakeProblemPreviewFromSubmission,
} from "@/lib/data/intake-forms";
import {
  createPipelineIntakeFormAction,
  deleteIntakeFormAction,
  deleteIntakeSubmissionAction,
  refreshIntakeSubmissionsAction,
  startWorkflowFromIntakeAction,
  workflowStatusesForSubmissionsAction,
} from "@/app/(app)/pipeline-intake/actions";
import type { WorkflowStatus } from "@/lib/data/project-workflows";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Clipboard,
  FileText,
  Loader2,
  Mail,
  Paperclip,
  Pencil,
  Plus,
  RefreshCcw,
  Trash2,
  Workflow,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { IntakeSubmissionEditDialog } from "@/components/pipeline-intake/intake-submission-edit-dialog";

function buildIntakeUrl(origin: string, token: string) {
  const base = origin.replace(/\/$/, "");
  return `${base}/intake/${token}`;
}

function mailtoHref(title: string, intro: string | null, url: string) {
  const subject = encodeURIComponent(`${title} — quick questions`);
  const body = encodeURIComponent(
    `${intro?.trim() ? `${intro.trim()}\n\n` : ""}Please use this secure link to share details:\n${url}\n\nThank you,`,
  );
  return `mailto:?subject=${subject}&body=${body}`;
}

type SubmissionWorkflowStatus = {
  id: string;
  status: WorkflowStatus;
  title: string;
};

function workflowStatusLabel(status: WorkflowStatus) {
  const labels: Record<WorkflowStatus, string> = {
    discovery: "Discovery",
    planning: "Planning",
    design: "Design",
    build: "Build",
    review: "Review",
    launched: "Launched",
    support: "Support",
  };
  return labels[status] ?? status;
}

export function PipelineIntakeManager({
  initialForms,
  cloudEnabled,
}: {
  initialForms: ClientIntakeForm[];
  cloudEnabled: boolean;
}) {
  const [forms, setForms] = useState<ClientIntakeForm[]>(initialForms);
  const [selectedId, setSelectedId] = useState<string | null>(
    initialForms[0]?.id ?? null,
  );
  const [subs, setSubs] = useState<ClientIntakeSubmission[]>([]);
  const [title, setTitle] = useState("New client intake");
  const [intro, setIntro] = useState(
    "Thanks for taking a moment — a few questions help us prepare before we meet.",
  );
  const [syncCrm, setSyncCrm] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const [loadingSubs, setLoadingSubs] = useState(false);
  const [deleteSubId, setDeleteSubId] = useState<string | null>(null);
  const [deleteFormOpen, setDeleteFormOpen] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [deleteBusy, setDeleteBusy] = useState(false);
  const [detailSubmissionId, setDetailSubmissionId] = useState<string | null>(null);
  const [editSubmissionId, setEditSubmissionId] = useState<string | null>(null);
  const [workflowBySubmissionId, setWorkflowBySubmissionId] = useState<
    Record<string, SubmissionWorkflowStatus>
  >({});
  const [workflowBusyId, setWorkflowBusyId] = useState<string | null>(null);
  const [workflowError, setWorkflowError] = useState<string | null>(null);

  const [tab, setTab] = useState("compose");

  const selected = useMemo(
    () => forms.find((f) => f.id === selectedId) ?? null,
    [forms, selectedId],
  );

  const editingSubmission = useMemo(
    () =>
      editSubmissionId ? subs.find((s) => s.id === editSubmissionId) ?? null : null,
    [editSubmissionId, subs],
  );

  const origin = typeof window !== "undefined" ? window.location.origin : "";

  const copyLink = async () => {
    if (!selected) return;
    const url = buildIntakeUrl(origin || "https://example.com", selected.share_token);
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      /* ignore */
    }
  };

  const loadSubs = useCallback(
    (formId: string) => {
      setLoadingSubs(true);
      startTransition(async () => {
        try {
          const rows = await refreshIntakeSubmissionsAction(formId);
          setSubs(rows);
          if (rows.length) {
            const statuses = await workflowStatusesForSubmissionsAction(rows.map((row) => row.id));
            setWorkflowBySubmissionId(statuses);
          } else {
            setWorkflowBySubmissionId({});
          }
        } finally {
          setLoadingSubs(false);
        }
      });
    },
    [startTransition],
  );

  useEffect(() => {
    if (!selectedId || !cloudEnabled) return;
    loadSubs(selectedId);
  }, [selectedId, cloudEnabled, loadSubs]);

  const confirmDeleteSubmission = async () => {
    if (!selectedId || !deleteSubId) return;
    setDeleteError(null);
    setDeleteBusy(true);
    try {
      const r = await deleteIntakeSubmissionAction(selectedId, deleteSubId);
      if (!r.ok) {
        setDeleteError(r.error);
        return;
      }
      setSubs((prev) => prev.filter((s) => s.id !== deleteSubId));
      setDeleteSubId(null);
    } finally {
      setDeleteBusy(false);
    }
  };

  const confirmDeleteForm = async () => {
    if (!selectedId) return;
    setDeleteError(null);
    setDeleteBusy(true);
    const idToRemove = selectedId;
    try {
      const r = await deleteIntakeFormAction(idToRemove);
      if (!r.ok) {
        setDeleteError(r.error);
        return;
      }
      const nextForms = forms.filter((f) => f.id !== idToRemove);
      setForms(nextForms);
      const nextSel = nextForms[0]?.id ?? null;
      setSelectedId(nextSel);
      if (nextSel) loadSubs(nextSel);
      else setSubs([]);
      if (nextForms.length === 0) setTab("compose");
      setDeleteFormOpen(false);
    } finally {
      setDeleteBusy(false);
    }
  };

  const onCreate = () => {
    setError(null);
    startTransition(async () => {
      const r = await createPipelineIntakeFormAction({
        title,
        intro,
        sync_to_crm: syncCrm,
      });
      if (!r.ok) {
        setError(r.error);
        return;
      }
      setForms((prev) => [r.form, ...prev]);
      setSelectedId(r.form.id);
      setTab("distribute");
    });
  };

  const startWorkflow = (formId: string, submissionId: string) => {
    setWorkflowError(null);
    setWorkflowBusyId(submissionId);
    startTransition(async () => {
      try {
        const r = await startWorkflowFromIntakeAction(formId, submissionId);
        if (!r.ok) {
          setWorkflowError(r.error);
          return;
        }
        setWorkflowBySubmissionId((prev) => ({
          ...prev,
          [submissionId]: {
            id: r.workflow.id,
            status: r.workflow.status,
            title: r.workflow.title,
          },
        }));
      } finally {
        setWorkflowBusyId(null);
      }
    });
  };

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <Dialog open={deleteSubId != null} onOpenChange={(o) => !o && !deleteBusy && setDeleteSubId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete submission?</DialogTitle>
            <DialogDescription>
              This removes the response from your inbox and deletes any uploaded files for this row. This
              cannot be undone.
            </DialogDescription>
          </DialogHeader>
          {deleteError ? (
            <p className="text-sm text-destructive" role="alert">
              {deleteError}
            </p>
          ) : null}
          <DialogFooter>
            <Button type="button" variant="outline" disabled={deleteBusy} onClick={() => setDeleteSubId(null)}>
              Cancel
            </Button>
            <Button type="button" variant="destructive" disabled={deleteBusy} onClick={() => void confirmDeleteSubmission()}>
              {deleteBusy ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting…
                </>
              ) : (
                "Delete"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteFormOpen} onOpenChange={(o) => !o && !deleteBusy && setDeleteFormOpen(false)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete this intake form?</DialogTitle>
            <DialogDescription>
              Deletes <strong className="text-foreground">{selected?.title ?? "this form"}</strong>, its share
              link, every stored response, and all respondent uploads tied to those responses. CRM deals
              already created are not removed.
            </DialogDescription>
          </DialogHeader>
          {deleteError ? (
            <p className="text-sm text-destructive" role="alert">
              {deleteError}
            </p>
          ) : null}
          <DialogFooter>
            <Button type="button" variant="outline" disabled={deleteBusy} onClick={() => setDeleteFormOpen(false)}>
              Cancel
            </Button>
            <Button type="button" variant="destructive" disabled={deleteBusy} onClick={() => void confirmDeleteForm()}>
              {deleteBusy ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting…
                </>
              ) : (
                "Delete form"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={detailSubmissionId != null} onOpenChange={(o) => !o && setDetailSubmissionId(null)}>
        <DialogContent className="max-h-[85vh] max-w-2xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Full intake response</DialogTitle>
            <DialogDescription>
              All answers for this submission, in the same order as the form — including goals and
              problem statement.
            </DialogDescription>
          </DialogHeader>
          {selected && detailSubmissionId ? (
            <pre className="max-h-[60vh] overflow-y-auto whitespace-pre-wrap rounded-md border border-border/60 bg-muted/30 p-4 text-xs leading-relaxed">
              {formatIntakeAnswersHumanReadable(
                selected,
                subs.find((x) => x.id === detailSubmissionId)?.answers ?? {},
              )}
            </pre>
          ) : null}
        </DialogContent>
      </Dialog>

      <IntakeSubmissionEditDialog
        open={editSubmissionId != null}
        onOpenChange={(o) => !o && setEditSubmissionId(null)}
        form={selected}
        submission={editingSubmission}
        cloudEnabled={cloudEnabled}
        onSaved={(s) => {
          setSubs((prev) => prev.map((x) => (x.id === s.id ? s : x)));
        }}
      />
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          CRM → Pipeline intake
        </p>
        <h1 className="font-jarvis text-3xl font-semibold tracking-tight">Intake forms</h1>
        <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground">
          Build a questionnaire with preset sections (contact, company, goals). Share a unique link or
          send it via email — responses are stored, optionally synced to the CRM as a new deal, and you
          get a task + notification for each submission. Jarvis can reference these when you mention{" "}
          <em>pipeline intake</em> in chat.
        </p>
      </div>

      {!cloudEnabled ? (
        <Card className="border-amber-500/40 bg-amber-500/[0.06]">
          <CardHeader>
            <CardTitle className="text-base text-amber-50">Supabase required</CardTitle>
            <CardDescription className="text-amber-50/80">
              Shareable links write to your database. Add{" "}
              <strong className="text-foreground">NEXT_PUBLIC_SUPABASE_URL</strong> and a service key in{" "}
              <strong className="text-foreground">Settings → Integrations</strong>, run the intake SQL
              migration, then redeploy.
            </CardDescription>
          </CardHeader>
        </Card>
      ) : null}

      {cloudEnabled && forms.length > 0 && selected ? (
        <Card className="border-primary/25 bg-primary/[0.07]">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Respondent link</CardTitle>
            <CardDescription>
              Send this URL by email, SMS, or chat — or open <strong className="text-foreground">Share &amp; inbox</strong>{" "}
              for the full list and submission history. Switch the form below if you have several.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {forms.length > 1 ? (
              <div className="space-y-1">
                <Label htmlFor="intake-form-picker" className="text-xs text-muted-foreground">
                  Form
                </Label>
                <select
                  id="intake-form-picker"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  value={selectedId ?? ""}
                  onChange={(e) => {
                    const id = e.target.value;
                    setSelectedId(id);
                    if (id) loadSubs(id);
                  }}
                >
                  {forms.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.title}
                    </option>
                  ))}
                </select>
              </div>
            ) : null}
            <div className="rounded-md border border-dashed border-primary/30 bg-background/50 px-3 py-2 font-mono text-[11px] break-all text-foreground">
              {buildIntakeUrl(
                origin || "https://your-deployment.vercel.app",
                selected.share_token,
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="default" size="sm" onClick={() => void copyLink()}>
                <Clipboard className="mr-2 h-4 w-4" />
                Copy link
              </Button>
              <Button variant="outline" size="sm" asChild>
                <a
                  href={mailtoHref(
                    selected.title,
                    selected.intro,
                    buildIntakeUrl(
                      origin || "https://your-deployment.vercel.app",
                      selected.share_token,
                    ),
                  )}
                >
                  <Mail className="mr-2 h-4 w-4" />
                  Draft email
                </a>
              </Button>
              <Button
                variant="secondary"
                size="sm"
                type="button"
                onClick={() => setTab("distribute")}
              >
                Open inbox ↓
              </Button>
              <Button
                variant="ghost"
                size="sm"
                type="button"
                onClick={() => selectedId && loadSubs(selectedId)}
                disabled={loadingSubs || !selectedId}
              >
                <RefreshCcw className="mr-2 h-4 w-4" />
                Refresh submissions
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : null}

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="compose">New form</TabsTrigger>
          <TabsTrigger value="distribute" disabled={!forms.length}>
            Share &amp; inbox
          </TabsTrigger>
        </TabsList>
        <TabsContent value="compose" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Create intake</CardTitle>
              <CardDescription>
                Each form gets a unique URL. New forms use the current default sections; existing rows keep
                their stored <span className="font-mono text-[11px]">sections</span> JSON until you recreate
                a form.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="intake-title">Form title</Label>
                <Input
                  id="intake-title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  disabled={pending || !cloudEnabled}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="intake-intro">Email / link intro</Label>
                <Textarea
                  id="intake-intro"
                  rows={3}
                  value={intro}
                  onChange={(e) => setIntro(e.target.value)}
                  disabled={pending || !cloudEnabled}
                />
              </div>
              <div className="flex items-center justify-between rounded-lg border border-border/70 px-4 py-3">
                <div className="space-y-1">
                  <p className="text-sm font-medium">Auto-create CRM deal</p>
                  <p className="text-xs text-muted-foreground">
                    Maps answers into a cold pipeline card with full Q&amp;A in notes.
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    id="intake-sync-crm"
                    type="checkbox"
                    className="h-4 w-4 shrink-0 rounded border border-input bg-background accent-primary"
                    checked={syncCrm}
                    onChange={(e) => setSyncCrm(e.target.checked)}
                    disabled={!cloudEnabled}
                    aria-label="Auto-create CRM deal from intake responses"
                  />
                </div>
              </div>
              {error ? (
                <p className="text-sm text-destructive" role="alert">
                  {error}
                </p>
              ) : null}
              <Button onClick={() => void onCreate()} disabled={pending || !cloudEnabled}>
                {pending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving…
                  </>
                ) : (
                  <>
                    <Plus className="mr-2 h-4 w-4" />
                    Generate form
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="distribute" className="space-y-4 pt-4">
          <div className="grid gap-4 lg:grid-cols-[280px_1fr]">
            <Card className="h-fit">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Forms</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {forms.map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => {
                      setSelectedId(f.id);
                      loadSubs(f.id);
                    }}
                    className={
                      f.id === selectedId
                        ? "w-full rounded-lg border border-primary/40 bg-primary/10 px-3 py-2 text-left text-sm"
                        : "w-full rounded-lg border border-transparent px-3 py-2 text-left text-sm hover:bg-muted/40"
                    }
                  >
                    <span className="block font-medium">{f.title}</span>
                    <span className="text-[11px] text-muted-foreground">
                      {f.sync_to_crm ? "CRM sync on" : "CRM sync off"}
                    </span>
                  </button>
                ))}
                {selected && forms.length > 0 ? (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="w-full gap-2 border-destructive/40 text-destructive hover:bg-destructive/10 hover:text-destructive"
                    disabled={!cloudEnabled || deleteBusy}
                    onClick={() => {
                      setDeleteError(null);
                      setDeleteFormOpen(true);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete form &amp; all responses
                  </Button>
                ) : null}
              </CardContent>
            </Card>

            <div className="space-y-4">
              {selected ? (
                <>
                  <Card>
                    <CardHeader className="flex flex-col gap-3 pb-3 sm:flex-row sm:items-start sm:justify-between sm:space-y-0">
                      <div className="space-y-1">
                        <CardTitle className="text-base">Submissions</CardTitle>
                        <CardDescription>
                          Most recent 200 responses. The public link is at the top of this page.
                        </CardDescription>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="shrink-0 self-start"
                        onClick={() => selectedId && loadSubs(selectedId)}
                        disabled={loadingSubs || !selectedId}
                      >
                        <RefreshCcw className="mr-2 h-4 w-4" />
                        Refresh
                      </Button>
                    </CardHeader>
                    <CardContent>
                      {workflowError ? (
                        <p
                          className="mb-3 rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive"
                          role="alert"
                        >
                          {workflowError}
                        </p>
                      ) : null}
                      {!subs.length && !loadingSubs ? (
                        <p className="text-sm text-muted-foreground">
                          No submissions yet — share the link to collect answers. Each response creates a task
                          titled <strong className="text-foreground">[Intake] …</strong>. Uploaded files show in
                          the <strong className="text-foreground">Files</strong> column with download links.
                        </p>
                      ) : (
                        <div className="overflow-x-auto rounded-md border border-border/60">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Received</TableHead>
                              <TableHead>Contact</TableHead>
                              <TableHead>Email</TableHead>
                              <TableHead className="min-w-[120px]">Files</TableHead>
                              <TableHead className="min-w-[100px]">Focus</TableHead>
                              <TableHead className="min-w-[120px]">Workflow</TableHead>
                              <TableHead className="min-w-[200px]">Problem / goal</TableHead>
                              <TableHead className="w-[176px] text-right">Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {subs.map((s) => {
                              const focus = selected
                                ? intakePrimaryFocusFromSubmission(s, selected)
                                : null;
                              const problem = selected
                                ? intakeProblemPreviewFromSubmission(s, selected)
                                : null;
                              const workflowStatus = workflowBySubmissionId[s.id] ?? null;
                              return (
                                <TableRow key={s.id}>
                                  <TableCell className="whitespace-nowrap text-xs text-muted-foreground">
                                    {new Date(s.created_at).toLocaleString()}
                                  </TableCell>
                                  <TableCell className="text-sm">{s.contact_name ?? "—"}</TableCell>
                                  <TableCell className="text-sm">{s.contact_email ?? "—"}</TableCell>
                                  <TableCell className="max-w-[200px] align-top text-xs">
                                    {s.attachmentLinks && s.attachmentLinks.length > 0 ? (
                                      <div className="flex flex-col gap-1">
                                        {s.attachmentLinks.map((a) => (
                                          <a
                                            key={a.storage_path}
                                            href={a.downloadUrl}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="truncate text-primary underline underline-offset-2"
                                          >
                                            <span className="inline-flex items-center gap-0.5">
                                              <Paperclip className="h-3 w-3 shrink-0 opacity-80" />
                                              {a.filename}
                                            </span>
                                          </a>
                                        ))}
                                      </div>
                                    ) : (s.attachments?.length ?? 0) > 0 ? (
                                      <span className="text-muted-foreground" title="Signed links unavailable — check Storage bucket / migration">
                                        {(s.attachments?.length ?? 0)} file(s)
                                      </span>
                                    ) : (
                                      "—"
                                    )}
                                  </TableCell>
                                  <TableCell className="max-w-[140px] align-top text-xs text-muted-foreground">
                                    <span className="line-clamp-3 break-words" title={focus ?? undefined}>
                                      {focus ?? "—"}
                                    </span>
                                  </TableCell>
                                  <TableCell className="align-top text-xs">
                                    {workflowStatus ? (
                                      <div className="flex flex-col items-start gap-1">
                                        <Badge variant={workflowStatus.status === "launched" ? "success" : "outline"}>
                                          {workflowStatusLabel(workflowStatus.status)}
                                        </Badge>
                                        <a
                                          href={`/projects?workflow=${workflowStatus.id}`}
                                          className="text-primary underline underline-offset-2"
                                        >
                                          Open project
                                        </a>
                                      </div>
                                    ) : (
                                      <span className="text-muted-foreground">Not started</span>
                                    )}
                                  </TableCell>
                                  <TableCell className="max-w-[min(28rem,45vw)] align-top text-xs text-foreground/95">
                                    <p
                                      className="line-clamp-5 whitespace-pre-wrap break-words"
                                      title={problem ?? undefined}
                                    >
                                      {problem ?? "—"}
                                    </p>
                                  </TableCell>
                                  <TableCell className="text-right">
                                    <div className="flex justify-end gap-0.5">
                                      <Button
                                        type="button"
                                        variant={workflowStatus ? "secondary" : "ghost"}
                                        size="icon"
                                        className="h-8 w-8 text-muted-foreground"
                                        title={workflowStatus ? "Workflow already started" : "Start workflow"}
                                        disabled={!selected || !cloudEnabled || workflowBusyId === s.id}
                                        onClick={() => selected && startWorkflow(selected.id, s.id)}
                                      >
                                        {workflowBusyId === s.id ? (
                                          <Loader2 className="h-4 w-4 animate-spin" />
                                        ) : (
                                          <Workflow className="h-4 w-4" />
                                        )}
                                        <span className="sr-only">
                                          {workflowStatus ? "Workflow already started" : "Start workflow"}
                                        </span>
                                      </Button>
                                      <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 text-muted-foreground"
                                        title="Edit submission"
                                        disabled={!selected || !cloudEnabled}
                                        onClick={() => setEditSubmissionId(s.id)}
                                      >
                                        <Pencil className="h-4 w-4" />
                                        <span className="sr-only">Edit submission</span>
                                      </Button>
                                      <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 text-muted-foreground"
                                        title="View all answers"
                                        disabled={!selected}
                                        onClick={() => setDetailSubmissionId(s.id)}
                                      >
                                        <FileText className="h-4 w-4" />
                                        <span className="sr-only">View all answers</span>
                                      </Button>
                                      <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                        title="Delete submission"
                                        disabled={!cloudEnabled || deleteBusy}
                                        onClick={() => {
                                          setDeleteError(null);
                                          setDeleteSubId(s.id);
                                        }}
                                      >
                                        <Trash2 className="h-4 w-4" />
                                        <span className="sr-only">Delete submission</span>
                                      </Button>
                                    </div>
                                  </TableCell>
                                </TableRow>
                              );
                            })}
                          </TableBody>
                        </Table>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </>
              ) : (
                <p className="text-sm text-muted-foreground">Create a form first.</p>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <Separator />

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Operator notes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>
            Apply{" "}
            <code className="rounded bg-muted px-1 font-mono text-[11px]">
              20260514200000_client_intake.sql
            </code>{" "}
            for forms/submissions, then{" "}
            <code className="rounded bg-muted px-1 font-mono text-[11px]">
              20260516120000_intake_attachments.sql
            </code>{" "}
            for optional respondent file uploads (column{" "}
            <code className="rounded bg-muted px-1 font-mono text-[11px]">attachments</code> + Storage
            bucket{" "}
            <code className="rounded bg-muted px-1 font-mono text-[11px]">intake-form-files</code>
            ), and{" "}
            <code className="rounded bg-muted px-1 font-mono text-[11px]">
              20260517210000_project_workflows.sql
            </code>{" "}
            for Start Workflow project records and SOP tasks.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
