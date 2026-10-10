"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LeadsBoard } from "@/components/crm/leads-board";
import {
  createCrmDealAction,
  deleteCrmClientAction,
  runClientWorkflowAutomationAction,
  swapClientRosterAction,
  updateClientExtraHyperlinksAction,
  updateClientMarketingAssetLinksAction,
  updateClientRosterFieldsAction,
  updateClientServiceCategoryAction,
  updateLeadStageAction,
} from "@/app/(app)/crm/actions";
import {
  CLIENT_SERVICE_CATEGORIES,
  createDealRecords,
  normalizeServiceCategory,
  type ClientHyperlink,
  type ClientServiceCategory,
  type CrmClientRecord,
  type CrmLeadRecord,
  type CreateCrmDealInput,
} from "@/lib/data/crm-records";
import type { ClientRosterFieldPatch } from "@/lib/data/crm";
import type { ClientIntakeRosterSummary } from "@/lib/data/intake-forms";
import { mergeRosterPatchIntoClient, mergeRosterPatchIntoLead } from "@/lib/crm/roster-merge";
import { datetimeLocalToIso, isoToDatetimeLocal } from "@/lib/crm/roster-datetime";
import type { LeadStage } from "@/lib/data/seed";
import {
  LOCAL_CRM_CHANGED,
  loadLocalCrmBundle,
  loadOrSeedLocalCrmBundle,
  saveLocalCrmBundle,
} from "@/lib/storage/local-crm-storage";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ExpandableTextarea } from "@/components/shared/expandable-textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { summarizeLeadsByStage } from "@/lib/data/workspace-counts";
import { Plus, Trash2, ChevronUp, ChevronDown, Sparkles, Check, X } from "lucide-react";
import { ClientLinkChips } from "@/components/crm/client-link-chips";
import { ClientMediaChips } from "@/components/crm/client-media-chips";
import { ClientSupportDocuments } from "@/components/crm/client-support-documents";
import { CrmRequestIntakeLink } from "@/components/crm/crm-request-intake-link";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const STAGES: LeadStage[] = [
  "cold",
  "warm",
  "negotiation",
  "closed",
  "lost",
];

const EMPTY_INTAKE_SUMMARIES: Record<string, ClientIntakeRosterSummary> = {};

type InlineRosterDraft = {
  business_name: string;
  industry: string;
  service_category: ClientServiceCategory;
  contact_name: string;
  email: string;
  phone: string;
  services_needed: string;
  project_deadline: string;
  budget: string;
  last_follow_up: string;
  next_follow_up: string;
  follow_up_notes: string;
  stage: LeadStage;
};

const INLINE_ROSTER_DRAFT_EMPTY: InlineRosterDraft = {
  business_name: "",
  industry: "",
  service_category: "general",
  contact_name: "",
  email: "",
  phone: "",
  services_needed: "",
  project_deadline: "",
  budget: "",
  last_follow_up: "",
  next_follow_up: "",
  follow_up_notes: "",
  stage: "cold",
};

type Props = {
  ownerId: string;
  persistLocally: boolean;
  initialClients: CrmClientRecord[];
  initialLeads: CrmLeadRecord[];
  initialTab?: "leads" | "clients";
  /** Latest intake submission per client when the form was opened with `?client=` (see {@link batchLatestIntakeSummariesForReferredClients}). */
  intakeSummariesByClientId?: Record<string, ClientIntakeRosterSummary>;
};

function normalizeCrmClient(c: CrmClientRecord): CrmClientRecord {
  return {
    ...c,
    social_links: c.social_links ?? {},
    extra_hyperlinks: c.extra_hyperlinks ?? [],
    marketing_asset_links: c.marketing_asset_links ?? [],
    service_category: normalizeServiceCategory(c.service_category),
    roster_priority:
      c.roster_priority != null ? Number(c.roster_priority) : 0,
    last_follow_up_at: c.last_follow_up_at ?? null,
    next_follow_up_at: c.next_follow_up_at ?? null,
    follow_up_notes: c.follow_up_notes ?? null,
  };
}

export function CrmClient({
  ownerId,
  persistLocally,
  initialClients,
  initialLeads,
  initialTab = "leads",
  intakeSummariesByClientId: intakeSummariesProp,
}: Props) {
  const intakeSummariesByClientId = intakeSummariesProp ?? EMPTY_INTAKE_SUMMARIES;
  const router = useRouter();
  const [crmTab, setCrmTab] = useState<"leads" | "clients">(initialTab);
  const [q, setQ] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [automationBusyClientId, setAutomationBusyClientId] = useState<string | null>(null);
  const [automationError, setAutomationError] = useState<string | null>(null);

  const [clients, setClients] = useState<CrmClientRecord[]>(() =>
    initialClients.map(normalizeCrmClient),
  );
  const [leads, setLeads] = useState<CrmLeadRecord[]>(initialLeads);

  const [biz, setBiz] = useState("");
  const [contactName, setContactName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [industry, setIndustry] = useState("");
  const [website, setWebsite] = useState("");
  const [services, setServices] = useState("");
  const [notes, setNotes] = useState("");
  const [deadline, setDeadline] = useState("");
  const [budget, setBudget] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [instagram, setInstagram] = useState("");
  const [twitter, setTwitter] = useState("");
  const [socialOther, setSocialOther] = useState("");
  const [tagsRaw, setTagsRaw] = useState("");
  const [stage, setStage] = useState<LeadStage>("cold");
  const [lastFollowUpLocal, setLastFollowUpLocal] = useState("");
  const [nextFollowUpLocal, setNextFollowUpLocal] = useState("");
  const [followUpNotesOnly, setFollowUpNotesOnly] = useState("");
  const [extraLinks, setExtraLinks] = useState<ClientHyperlink[]>([]);
  const [mediaAssetLinks, setMediaAssetLinks] = useState<ClientHyperlink[]>(
    [],
  );
  const [serviceCategory, setServiceCategory] =
    useState<ClientServiceCategory>("general");
  const [mediaEditFor, setMediaEditFor] = useState<CrmClientRecord | null>(
    null,
  );
  const [mediaEditRows, setMediaEditRows] = useState<ClientHyperlink[]>([]);
  const [mediaSaving, setMediaSaving] = useState(false);
  const [mediaDialogError, setMediaDialogError] = useState<string | null>(null);
  const [profileLinksEditFor, setProfileLinksEditFor] =
    useState<CrmClientRecord | null>(null);
  const [profileLinksEditRows, setProfileLinksEditRows] = useState<
    ClientHyperlink[]
  >([]);
  const [profileLinksSaving, setProfileLinksSaving] = useState(false);
  const [profileLinksDialogError, setProfileLinksDialogError] = useState<
    string | null
  >(null);

  const [aiFillFor, setAiFillFor] = useState<CrmClientRecord | null>(null);
  const [aiSentence, setAiSentence] = useState("");
  const [aiBusy, setAiBusy] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [aiPreview, setAiPreview] = useState<ClientRosterFieldPatch | null>(null);
  const [aiSource, setAiSource] = useState<string | null>(null);

  const [intakeDetail, setIntakeDetail] = useState<{
    businessName: string;
    summary: ClientIntakeRosterSummary;
  } | null>(null);

  const [deleteConfirmFor, setDeleteConfirmFor] = useState<CrmClientRecord | null>(
    null,
  );
  const [deleteBusy, setDeleteBusy] = useState(false);

  const [inlineDraftOpen, setInlineDraftOpen] = useState(false);
  const [inlineSaving, setInlineSaving] = useState(false);
  const [draft, setDraft] = useState<InlineRosterDraft>({
    ...INLINE_ROSTER_DRAFT_EMPTY,
  });
  const draftRowRef = useRef<HTMLTableRowElement | null>(null);

  useEffect(() => {
    if (persistLocally) return;
    setClients(initialClients.map(normalizeCrmClient));
    setLeads(
      initialLeads.map((l) => ({
        ...l,
        tags: l.tags ?? [],
        last_contacted_at: l.last_contacted_at ?? null,
        next_follow_up_at: l.next_follow_up_at ?? null,
        follow_up_notes: l.follow_up_notes ?? null,
      })),
    );
  }, [persistLocally, initialClients, initialLeads]);

  useEffect(() => {
    if (!persistLocally) return;
    const b = loadOrSeedLocalCrmBundle(ownerId);
    setClients(b.clients.map(normalizeCrmClient));
    setLeads(
      b.leads.map((l) => ({
        ...l,
        last_contacted_at: l.last_contacted_at ?? null,
        next_follow_up_at: l.next_follow_up_at ?? null,
        follow_up_notes: l.follow_up_notes ?? null,
      })),
    );
  }, [persistLocally, ownerId]);

  useEffect(() => {
    if (!persistLocally) return;
    const onExt = () => {
      const b = loadLocalCrmBundle(ownerId);
      if (b) {
        setClients(b.clients.map(normalizeCrmClient));
        setLeads(
          b.leads.map((l) => ({
            ...l,
            last_contacted_at: l.last_contacted_at ?? null,
            next_follow_up_at: l.next_follow_up_at ?? null,
            follow_up_notes: l.follow_up_notes ?? null,
          })),
        );
      }
    };
    window.addEventListener(LOCAL_CRM_CHANGED, onExt);
    return () => window.removeEventListener(LOCAL_CRM_CHANGED, onExt);
  }, [persistLocally, ownerId]);

  useEffect(() => {
    if (!persistLocally) return;
    saveLocalCrmBundle(ownerId, { clients, leads });
  }, [persistLocally, ownerId, clients, leads]);

  useEffect(() => {
    setCrmTab(initialTab);
  }, [initialTab]);

  const leadByClientId = useMemo(() => {
    const m = new Map<string, CrmLeadRecord>();
    for (const l of leads) {
      if (l.client_id) m.set(l.client_id, l);
    }
    return m;
  }, [leads]);

  const clientsById = useMemo(() => {
    const m = new Map<string, CrmClientRecord>();
    for (const c of clients) {
      if (c.id) m.set(c.id, c);
    }
    return m;
  }, [clients]);

  const runClientAutomation = useCallback(
    async (client: CrmClientRecord) => {
      setAutomationError(null);
      setAutomationBusyClientId(client.id);
      try {
        const res = await runClientWorkflowAutomationAction(client.id);
        if (!res.ok) {
          setAutomationError(res.error);
          return;
        }
        router.refresh();
      } finally {
        setAutomationBusyClientId(null);
      }
    },
    [router],
  );

  const leadCounts = useMemo(() => summarizeLeadsByStage(leads), [leads]);

  const rosterOrderedClients = useMemo(() => {
    const s = q.toLowerCase();
    const filtered = clients.filter(
      (c) =>
        !s ||
        c.business_name.toLowerCase().includes(s) ||
        (c.industry ?? "").toLowerCase().includes(s) ||
        (c.email ?? "").toLowerCase().includes(s) ||
        (c.phone ?? "").toLowerCase().includes(s) ||
        (c.services_needed ?? "").toLowerCase().includes(s) ||
        (c.follow_up_notes ?? "").toLowerCase().includes(s) ||
        (c.website ?? "").toLowerCase().includes(s) ||
        (c.service_category ?? "").toLowerCase().includes(s) ||
        Object.values(c.social_links ?? {}).some((v) =>
          v.toLowerCase().includes(s),
        ) ||
        (c.extra_hyperlinks ?? []).some(
          (l) =>
            l.label.toLowerCase().includes(s) ||
            l.url.toLowerCase().includes(s),
        ) ||
        (c.marketing_asset_links ?? []).some(
          (l) =>
            l.label.toLowerCase().includes(s) ||
            l.url.toLowerCase().includes(s),
        ) ||
        (() => {
          const intake = intakeSummariesByClientId[c.id];
          if (!intake) return false;
          const blob = [
            intake.problem ?? "",
            intake.primaryFocus ?? "",
            intake.fullAnswersText ?? "",
            intake.formTitle ?? "",
          ]
            .join("\n")
            .toLowerCase();
          return blob.includes(s);
        })(),
    );
    return [...filtered].sort((a, b) => {
      if (b.roster_priority !== a.roster_priority) {
        return b.roster_priority - a.roster_priority;
      }
      return (a.business_name || "").localeCompare(b.business_name || "");
    });
  }, [clients, q, intakeSummariesByClientId]);

  const filteredClients = rosterOrderedClients;

  const resetForm = () => {
    setBiz("");
    setContactName("");
    setEmail("");
    setPhone("");
    setIndustry("");
    setWebsite("");
    setServices("");
    setNotes("");
    setDeadline("");
    setBudget("");
    setLinkedin("");
    setInstagram("");
    setTwitter("");
    setSocialOther("");
    setTagsRaw("");
    setStage("cold");
    setLastFollowUpLocal("");
    setNextFollowUpLocal("");
    setFollowUpNotesOnly("");
    setExtraLinks([]);
    setMediaAssetLinks([]);
    setServiceCategory("general");
    setFormError(null);
  };

  function buildInput(): CreateCrmDealInput {
    return {
      business_name: biz,
      contact_name: contactName || null,
      email: email || null,
      phone: phone || null,
      industry: industry || null,
      website: website || null,
      notes: notes || null,
      services_needed: services || null,
      project_deadline: deadline || null,
      budget_amount: budget.trim() ? Number(budget) : null,
      social_linkedin: linkedin || null,
      social_instagram: instagram || null,
      social_twitter: twitter || null,
      social_other: socialOther || null,
      stage,
      pipeline_tags: tagsRaw
        .split(/[,;]+/)
        .map((t) => t.trim())
        .filter(Boolean),
      last_follow_up_at: lastFollowUpLocal || null,
      next_follow_up_at: nextFollowUpLocal || null,
      follow_up_notes: followUpNotesOnly || null,
      extra_hyperlinks: extraLinks
        .map((r) => ({
          label: r.label.trim(),
          url: r.url.trim(),
        }))
        .filter((r) => r.label && r.url),
      marketing_asset_links: mediaAssetLinks
        .map((r) => ({
          label: r.label.trim(),
          url: r.url.trim(),
        }))
        .filter((r) => r.label && r.url),
      service_category: serviceCategory,
    };
  }

  const onSubmitDeal = async () => {
    setSaving(true);
    setFormError(null);
    try {
      const input = buildInput();
      if (persistLocally) {
        const minP = clients.length
          ? Math.min(...clients.map((c) => c.roster_priority))
          : 0;
        const built = createDealRecords(ownerId, {
          ...input,
          roster_priority: minP - 1,
        });
        if ("error" in built) {
          setFormError(built.error);
          return;
        }
        setClients((prev) => [...prev, built.client]);
        setLeads((prev) => [built.lead, ...prev]);
        setDialogOpen(false);
        resetForm();
        return;
      }
      const res = await createCrmDealAction(input);
      if (!res.ok) {
        setFormError(res.error);
        return;
      }
      setClients((prev) => [...prev, res.client]);
      setLeads((prev) => [res.lead, ...prev]);
      setDialogOpen(false);
      resetForm();
      router.refresh();
    } finally {
      setSaving(false);
    }
  };

  const onStageChange = useCallback(
    async (leadId: string, next: LeadStage) => {
      if (persistLocally) {
        setLeads((prev) =>
          prev.map((l) =>
            l.id === leadId
              ? { ...l, stage: next, updated_at: new Date().toISOString() }
              : l,
          ),
        );
        return;
      }
      const res = await updateLeadStageAction(leadId, next);
      if (!res.ok) {
        setFormError(res.error);
        return;
      }
      setLeads((prev) =>
        prev.map((l) =>
          l.id === leadId
            ? { ...l, stage: next, updated_at: new Date().toISOString() }
            : l,
        ),
      );
      router.refresh();
    },
    [persistLocally, router],
  );

  const onRosterMove = useCallback(
    async (clientId: string, direction: "up" | "down") => {
      if (persistLocally) {
        setClients((prev) => {
          const sorted = [...prev].sort((a, b) => {
            if (b.roster_priority !== a.roster_priority) {
              return b.roster_priority - a.roster_priority;
            }
            return (a.business_name || "").localeCompare(b.business_name || "");
          });
          const idx = sorted.findIndex((c) => c.id === clientId);
          if (idx < 0) return prev;
          const nIdx = direction === "up" ? idx - 1 : idx + 1;
          if (nIdx < 0 || nIdx >= sorted.length) return prev;
          const a = sorted[idx];
          const b = sorted[nIdx];
          const oldA = a.roster_priority;
          const oldB = b.roster_priority;
          const now = new Date().toISOString();
          if (oldA === oldB) {
            const newA = direction === "up" ? oldB + 1 : oldB - 1;
            return prev.map((c) =>
              c.id === a.id
                ? { ...c, roster_priority: newA, updated_at: now }
                : c,
            );
          }
          return prev.map((c) => {
            if (c.id === a.id) {
              return { ...c, roster_priority: oldB, updated_at: now };
            }
            if (c.id === b.id) {
              return { ...c, roster_priority: oldA, updated_at: now };
            }
            return c;
          });
        });
        return;
      }
      const res = await swapClientRosterAction(clientId, direction);
      if (!res.ok) {
        setFormError(res.error);
        return;
      }
      router.refresh();
    },
    [persistLocally, router],
  );

  const onClientCategoryChange = useCallback(
    async (clientId: string, category: ClientServiceCategory) => {
      if (persistLocally) {
        setClients((prev) =>
          prev.map((c) =>
            c.id === clientId
              ? {
                  ...c,
                  service_category: category,
                  updated_at: new Date().toISOString(),
                }
              : c,
          ),
        );
        return;
      }
      const res = await updateClientServiceCategoryAction(clientId, category);
      if (!res.ok) {
        setFormError(res.error);
        return;
      }
      router.refresh();
    },
    [persistLocally, router],
  );

  const onSaveMediaLinks = async () => {
    if (!mediaEditFor) return;
    setMediaSaving(true);
    setMediaDialogError(null);
    try {
      const cleaned = mediaEditRows
        .map((r) => ({
          label: r.label.trim(),
          url: r.url.trim(),
        }))
        .filter((r) => r.label && r.url);
      if (persistLocally) {
        const now = new Date().toISOString();
        setClients((prev) =>
          prev.map((c) =>
            c.id === mediaEditFor.id
              ? { ...c, marketing_asset_links: cleaned, updated_at: now }
              : c,
          ),
        );
        setMediaEditFor(null);
        return;
      }
      const res = await updateClientMarketingAssetLinksAction(
        mediaEditFor.id,
        cleaned,
      );
      if (!res.ok) {
        setMediaDialogError(res.error);
        return;
      }
      setMediaEditFor(null);
      router.refresh();
    } finally {
      setMediaSaving(false);
    }
  };

  const onSaveProfileExtraLinks = async () => {
    if (!profileLinksEditFor) return;
    setProfileLinksSaving(true);
    setProfileLinksDialogError(null);
    try {
      const cleaned = profileLinksEditRows
        .map((r) => ({
          label: r.label.trim(),
          url: r.url.trim(),
        }))
        .filter((r) => r.label && r.url);
      if (persistLocally) {
        const now = new Date().toISOString();
        setClients((prev) =>
          prev.map((c) =>
            c.id === profileLinksEditFor.id
              ? { ...c, extra_hyperlinks: cleaned, updated_at: now }
              : c,
          ),
        );
        setProfileLinksEditFor(null);
        return;
      }
      const res = await updateClientExtraHyperlinksAction(
        profileLinksEditFor.id,
        cleaned,
      );
      if (!res.ok) {
        setProfileLinksDialogError(res.error);
        return;
      }
      setProfileLinksEditFor(null);
      router.refresh();
    } finally {
      setProfileLinksSaving(false);
    }
  };

  const persistRosterPatch = useCallback(
    async (clientId: string, patch: ClientRosterFieldPatch) => {
      const keys = Object.keys(patch) as (keyof ClientRosterFieldPatch)[];
      if (!keys.length) return;
      if (persistLocally) {
        setClients((prev) =>
          prev.map((c) =>
            c.id === clientId ? mergeRosterPatchIntoClient(c, patch) : c,
          ),
        );
        setLeads((prev) =>
          prev.map((l) =>
            l.client_id === clientId
              ? mergeRosterPatchIntoLead(l, patch)
              : l,
          ),
        );
        return;
      }
      const res = await updateClientRosterFieldsAction(clientId, patch);
      if (!res.ok) {
        setFormError(res.error);
        return;
      }
      router.refresh();
    },
    [persistLocally, router],
  );

  const confirmDeleteClient = useCallback(async () => {
    const target = deleteConfirmFor;
    if (!target) return;
    setDeleteBusy(true);
    setFormError(null);
    try {
      if (!persistLocally) {
        const res = await deleteCrmClientAction(target.id);
        if (!res.ok) {
          setFormError(res.error);
          return;
        }
      }
      setClients((prev) => prev.filter((c) => c.id !== target.id));
      setLeads((prev) => prev.filter((l) => l.client_id !== target.id));
      if (mediaEditFor?.id === target.id) setMediaEditFor(null);
      if (profileLinksEditFor?.id === target.id) setProfileLinksEditFor(null);
      if (aiFillFor?.id === target.id) setAiFillFor(null);
      setDeleteConfirmFor(null);
      if (!persistLocally) router.refresh();
    } finally {
      setDeleteBusy(false);
    }
  }, [
    deleteConfirmFor,
    persistLocally,
    router,
    mediaEditFor?.id,
    profileLinksEditFor?.id,
    aiFillFor?.id,
  ]);

  const onAiParse = async () => {
    if (!aiFillFor) return;
    const sentence = aiSentence.trim();
    if (!sentence) {
      setAiError("Write a sentence describing what to capture.");
      return;
    }
    setAiBusy(true);
    setAiError(null);
    setAiPreview(null);
    setAiSource(null);
    try {
      const r = await fetch("/api/v1/ai/crm-parse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sentence,
          context: { business_name: aiFillFor.business_name },
        }),
      });
      const data = (await r.json()) as {
        ok?: boolean;
        error?: string;
        patch?: ClientRosterFieldPatch;
        source?: string;
        hint?: string | null;
      };
      if (!data.ok) {
        setAiError(data.error ?? "Could not parse.");
        return;
      }
      const patch = data.patch ?? {};
      if (!Object.keys(patch).length) {
        setAiError(
          data.hint ??
            "No fields extracted. Try more detail, or set OPENAI_API_KEY for smarter parsing.",
        );
        return;
      }
      setAiPreview(patch);
      setAiSource(data.source ?? "unknown");
    } catch (e) {
      setAiError(e instanceof Error ? e.message : "Request failed.");
    } finally {
      setAiBusy(false);
    }
  };

  const onAiApply = async () => {
    if (!aiFillFor || !aiPreview || !Object.keys(aiPreview).length) return;
    await persistRosterPatch(aiFillFor.id, aiPreview);
    setAiFillFor(null);
    setAiSentence("");
    setAiPreview(null);
    setAiSource(null);
    setAiError(null);
  };

  const openInlineDraft = useCallback(() => {
    setDraft({ ...INLINE_ROSTER_DRAFT_EMPTY });
    setInlineDraftOpen(true);
    setFormError(null);
    requestAnimationFrame(() => {
      draftRowRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
      const first = draftRowRef.current?.querySelector<HTMLInputElement>(
        "[data-inline-draft-business]",
      );
      first?.focus();
    });
  }, []);

  const cancelInlineDraft = useCallback(() => {
    setInlineDraftOpen(false);
    setDraft({ ...INLINE_ROSTER_DRAFT_EMPTY });
    setFormError(null);
  }, []);

  const submitInlineDraft = async () => {
    const biz = draft.business_name.trim();
    if (!biz) {
      setFormError("Enter a business name, then tap the check to save this row.");
      return;
    }
    const budgetNum = draft.budget.trim()
      ? Number(draft.budget.replace(/[^0-9.]/g, ""))
      : null;
    if (draft.budget.trim() && !Number.isFinite(budgetNum)) {
      setFormError("Budget must be a valid number.");
      return;
    }

    const input: CreateCrmDealInput = {
      business_name: biz,
      contact_name: draft.contact_name.trim() || null,
      email: draft.email.trim() || null,
      phone: draft.phone.trim() || null,
      industry: draft.industry.trim() || null,
      website: null,
      notes: null,
      services_needed: draft.services_needed.trim() || null,
      project_deadline: draft.project_deadline.trim() || null,
      budget_amount: budgetNum,
      social_linkedin: null,
      social_instagram: null,
      social_twitter: null,
      social_other: null,
      stage: draft.stage,
      pipeline_tags: [],
      last_follow_up_at: draft.last_follow_up.trim()
        ? datetimeLocalToIso(draft.last_follow_up)
        : null,
      next_follow_up_at: draft.next_follow_up.trim()
        ? datetimeLocalToIso(draft.next_follow_up)
        : null,
      follow_up_notes: draft.follow_up_notes.trim() || null,
      extra_hyperlinks: [],
      marketing_asset_links: [],
      service_category: draft.service_category,
    };

    setInlineSaving(true);
    setFormError(null);
    try {
      if (persistLocally) {
        const minP = clients.length
          ? Math.min(...clients.map((c) => c.roster_priority))
          : 0;
        const built = createDealRecords(ownerId, {
          ...input,
          roster_priority: minP - 1,
        });
        if ("error" in built) {
          setFormError(built.error);
          return;
        }
        setClients((prev) => [...prev, built.client]);
        setLeads((prev) => [built.lead, ...prev]);
      } else {
        const res = await createCrmDealAction(input);
        if (!res.ok) {
          setFormError(res.error);
          return;
        }
        setClients((prev) => [...prev, res.client]);
        setLeads((prev) => [res.lead, ...prev]);
        router.refresh();
      }
      setDraft({ ...INLINE_ROSTER_DRAFT_EMPTY });
      setInlineDraftOpen(true);
      requestAnimationFrame(() => {
        draftRowRef.current
          ?.querySelector<HTMLInputElement>("[data-inline-draft-business]")
          ?.focus();
      });
    } finally {
      setInlineSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-[1600px] space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">CRM</h1>
          <p className="text-sm text-muted-foreground">
            Edit cells in place (tab out to save). Use <strong className="text-foreground">+ Add roster row</strong> for the same columns without the full form. Sparkles = AI fill — set{" "}
            <code className="rounded bg-muted px-1 text-[11px]">OPENAI_API_KEY</code> on the server for best results.
          </p>
        </div>
        <Button
          type="button"
          className="gap-2"
          onClick={() => {
            resetForm();
            setDialogOpen(true);
          }}
        >
          <Plus className="h-4 w-4" />
          Add client &amp; deal
        </Button>
      </div>

      {formError && !dialogOpen && (
        <p
          role="alert"
          className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive"
        >
          {formError}
        </p>
      )}

      {automationError ? (
        <p
          role="alert"
          className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive"
        >
          {automationError}
        </p>
      ) : null}

      <Tabs
        value={crmTab}
        onValueChange={(v) => setCrmTab(v as "leads" | "clients")}
      >
        <TabsList>
          <TabsTrigger value="leads" className="gap-2">
            Lead pipeline
            <Badge variant="secondary" className="h-5 px-1.5 font-mono text-[10px]">
              {leadCounts.inPipeline}
            </Badge>
            <span className="sr-only">
              {leadCounts.inPipeline} in pipeline, {leadCounts.total} total leads
            </span>
          </TabsTrigger>
          <TabsTrigger value="clients" className="gap-2">
            Client roster
            <Badge variant="outline" className="h-5 px-1.5 font-mono text-[10px]">
              {clients.length}
            </Badge>
          </TabsTrigger>
        </TabsList>
        <TabsContent value="leads" className="mt-6">
          <LeadsBoard leads={leads} clientsById={clientsById} onStageChange={onStageChange} />
        </TabsContent>
        <TabsContent value="clients" className="mt-6 space-y-4">
          <TooltipProvider delayDuration={200}>
            <div className="flex flex-wrap items-center gap-2">
              <Input
                placeholder="Filter clients…"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                className="max-w-sm"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="gap-1 shrink-0"
                onClick={() => openInlineDraft()}
              >
                <Plus className="h-4 w-4" />
                Add roster row
              </Button>
            </div>
            <div className="overflow-x-auto rounded-xl border border-border/60">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[84px] text-center">Order</TableHead>
                  <TableHead className="min-w-[128px]">Category</TableHead>
                  <TableHead>Business</TableHead>
                  <TableHead className="w-[88px]">Bill</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead className="max-w-[220px] min-w-[140px]">
                    Pipeline intake
                  </TableHead>
                  <TableHead>Services</TableHead>
                  <TableHead>Deadline</TableHead>
                  <TableHead className="text-right">Budget</TableHead>
                  <TableHead>Last follow-up</TableHead>
                  <TableHead>Next follow-up</TableHead>
                  <TableHead>Follow-up notes</TableHead>
                  <TableHead>Pipeline</TableHead>
                  <TableHead className="min-w-[140px]">Media &amp; assets</TableHead>
                  <TableHead>Links</TableHead>
                  <TableHead className="w-[52px] text-center"> </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredClients.length === 0 && !inlineDraftOpen ? (
                  <TableRow>
                    <TableCell
                      colSpan={18}
                      className="py-12 text-center text-sm text-muted-foreground"
                    >
                      No clients yet — use{" "}
                      <button
                        type="button"
                        className="font-medium text-primary underline underline-offset-2"
                        onClick={() => openInlineDraft()}
                      >
                        + Add roster row
                      </button>{" "}
                      or &quot;Add client &amp; deal&quot; for the full form.
                    </TableCell>
                  </TableRow>
                ) : null}
                {filteredClients.map((c, rowIndex) => {
                    const lane = c.id ? leadByClientId.get(c.id) : undefined;
                    const lastRow = rowIndex === filteredClients.length - 1;
                    const intake = intakeSummariesByClientId[c.id];
                    const problemLine =
                      intake?.problem?.trim() ||
                      (intake?.fullAnswersText?.trim() ? "Submitted (see full answers)" : "");
                    const tooltipBody =
                      intake?.problem?.trim() ||
                      intake?.fullAnswersText?.trim() ||
                      "No problem statement captured.";
                    return (
                      <TableRow key={c.id}>
                        <TableCell className="align-middle">
                          <div className="flex justify-center gap-0.5">
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 shrink-0"
                              disabled={rowIndex === 0}
                              aria-label="Move client up in roster"
                              onClick={() => void onRosterMove(c.id, "up")}
                            >
                              <ChevronUp className="h-4 w-4" />
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 shrink-0"
                              disabled={lastRow}
                              aria-label="Move client down in roster"
                              onClick={() => void onRosterMove(c.id, "down")}
                            >
                              <ChevronDown className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell className="align-middle">
                          <Select
                            value={c.service_category}
                            onValueChange={(v) =>
                              void onClientCategoryChange(
                                c.id,
                                v as ClientServiceCategory,
                              )
                            }
                          >
                            <SelectTrigger className="h-8 text-xs capitalize">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {CLIENT_SERVICE_CATEGORIES.map((cat) => (
                                <SelectItem key={cat} value={cat} className="capitalize">
                                  {cat}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell className="align-middle">
                          <div className="flex min-w-[140px] flex-col gap-1.5">
                            <div className="flex items-start gap-1">
                              <div className="min-w-0 flex-1 space-y-1">
                                <Input
                                  aria-label="Business name"
                                  className="h-8 text-xs font-medium"
                                  defaultValue={c.business_name}
                                  key={`biz-${c.id}-${c.updated_at}`}
                                  onBlur={(e) => {
                                    const v = e.target.value.trim();
                                    if (!v || v === c.business_name) return;
                                    void persistRosterPatch(c.id, {
                                      business_name: v,
                                    });
                                  }}
                                />
                                <Input
                                  aria-label="Industry"
                                  placeholder="Industry"
                                  className="h-7 text-[11px] text-muted-foreground"
                                  defaultValue={c.industry ?? ""}
                                  key={`ind-${c.id}-${c.industry ?? ""}-${c.updated_at}`}
                                  onBlur={(e) => {
                                    const v = e.target.value.trim();
                                    const next = v || null;
                                    if (next === (c.industry ?? null)) return;
                                    void persistRosterPatch(c.id, {
                                      industry: next,
                                    });
                                  }}
                                />
                              </div>
                              <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                className="h-8 w-8 shrink-0"
                                title="Fill row with AI from a sentence"
                                aria-label="AI fill for this client"
                                onClick={() => {
                                  setAiFillFor(c);
                                  setAiSentence("");
                                  setAiPreview(null);
                                  setAiSource(null);
                                  setAiError(null);
                                }}
                              >
                                <Sparkles className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="align-middle">
                          <div className="flex flex-col gap-1.5">
                            <Button variant="link" size="sm" className="h-auto p-0 text-xs" asChild>
                              <Link href={`/invoices/new?clientId=${encodeURIComponent(c.id)}`}>
                                Invoice
                              </Link>
                            </Button>
                            <CrmRequestIntakeLink clientId={c.id} />
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              className="h-7 justify-start gap-1 px-2 text-[11px]"
                              disabled={automationBusyClientId === c.id}
                              onClick={() => void runClientAutomation(c)}
                              title="Create/update workflow, generate presentation/build package, and attach produced links"
                            >
                              <Sparkles className="h-3 w-3" />
                              {automationBusyClientId === c.id ? "Running..." : "Run automation"}
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell className="max-w-[160px] align-top">
                          <Input
                            aria-label="Contact name"
                            className="h-8 min-w-[120px] text-xs"
                            defaultValue={c.contact_name ?? ""}
                            key={`cn-${c.id}-${c.contact_name ?? ""}-${c.updated_at}`}
                            onBlur={(e) => {
                              const v = e.target.value.trim();
                              const next = v || null;
                              if (next === (c.contact_name ?? null)) return;
                              void persistRosterPatch(c.id, {
                                contact_name: next,
                              });
                            }}
                          />
                        </TableCell>
                        <TableCell className="max-w-[140px] align-top">
                          <Input
                            aria-label="Phone"
                            className="h-8 min-w-[100px] text-xs"
                            defaultValue={c.phone ?? ""}
                            key={`ph-${c.id}-${c.phone ?? ""}-${c.updated_at}`}
                            onBlur={(e) => {
                              const v = e.target.value.trim();
                              const next = v || null;
                              if (next === (c.phone ?? null)) return;
                              void persistRosterPatch(c.id, { phone: next });
                            }}
                          />
                        </TableCell>
                        <TableCell className="max-w-[180px] align-top">
                          <Input
                            aria-label="Email"
                            className="h-8 min-w-[120px] text-xs"
                            defaultValue={c.email ?? ""}
                            key={`em-${c.id}-${c.email ?? ""}-${c.updated_at}`}
                            onBlur={(e) => {
                              const v = e.target.value.trim();
                              const next = v || null;
                              if (next === (c.email ?? null)) return;
                              void persistRosterPatch(c.id, { email: next });
                            }}
                          />
                        </TableCell>
                        <TableCell className="max-w-[220px] align-top text-xs leading-snug">
                          {intake ? (
                            <div className="flex flex-col gap-1.5">
                              {intake.primaryFocus ? (
                                <span className="font-medium text-foreground/90">
                                  {intake.primaryFocus}
                                </span>
                              ) : null}
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <button
                                    type="button"
                                    className="line-clamp-2 w-full rounded-sm text-left text-muted-foreground underline-offset-2 hover:bg-muted/40 hover:text-foreground"
                                    aria-label="Intake problem preview — hover for full text"
                                  >
                                    {problemLine ? (
                                      problemLine.length > 110
                                        ? `${problemLine.slice(0, 109)}…`
                                        : problemLine
                                    ) : (
                                      <span className="text-muted-foreground">Submitted</span>
                                    )}
                                  </button>
                                </TooltipTrigger>
                                <TooltipContent
                                  side="top"
                                  className="max-w-md whitespace-pre-wrap text-xs leading-relaxed"
                                >
                                  {tooltipBody}
                                </TooltipContent>
                              </Tooltip>
                              <Button
                                type="button"
                                variant="link"
                                size="sm"
                                className="h-auto justify-start p-0 text-[11px] text-muted-foreground"
                                onClick={() =>
                                  setIntakeDetail({
                                    businessName: c.business_name,
                                    summary: intake,
                                  })
                                }
                              >
                                Full intake answers
                              </Button>
                              <p className="text-[10px] text-muted-foreground/90">
                                {new Date(intake.submittedAt).toLocaleString(undefined, {
                                  dateStyle: "medium",
                                  timeStyle: "short",
                                })}
                                {intake.formTitle ? ` · ${intake.formTitle}` : ""}
                              </p>
                            </div>
                          ) : (
                            <div className="flex flex-col gap-1 text-muted-foreground">
                              <span>—</span>
                              <span className="text-[10px] leading-snug">
                                No tagged submission. Use Request info (link) so the intake URL
                                includes this client.
                              </span>
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="max-w-[220px] align-top">
                          <ExpandableTextarea
                            expandTitle="Services"
                            expandDescription="Scope, deliverables, and service details for this client."
                            aria-label="Services needed"
                            className="min-h-[56px] resize-y text-xs leading-snug"
                            defaultValue={c.services_needed ?? ""}
                            key={`sv-${c.id}-${c.services_needed ?? ""}-${c.updated_at}`}
                            onBlur={(e) => {
                              const v = e.target.value.trim();
                              const next = v || null;
                              if (next === (c.services_needed ?? null)) return;
                              void persistRosterPatch(c.id, {
                                services_needed: next,
                              });
                            }}
                          />
                        </TableCell>
                        <TableCell className="w-[128px] align-top">
                          <Input
                            aria-label="Project deadline"
                            type="date"
                            className="h-8 text-xs"
                            defaultValue={
                              c.project_deadline
                                ? String(c.project_deadline).slice(0, 10)
                                : ""
                            }
                            key={`dl-${c.id}-${c.project_deadline ?? ""}-${c.updated_at}`}
                            onBlur={(e) => {
                              const v = e.target.value.trim();
                              const next = v || null;
                              if (next === (c.project_deadline ?? null)) return;
                              void persistRosterPatch(c.id, {
                                project_deadline: next,
                              });
                            }}
                          />
                        </TableCell>
                        <TableCell className="max-w-[120px] align-top text-right">
                          <Input
                            aria-label="Budget amount"
                            inputMode="decimal"
                            className="h-8 text-right text-xs tabular-nums"
                            defaultValue={
                              c.budget_amount != null ? String(c.budget_amount) : ""
                            }
                            key={`bd-${c.id}-${c.budget_amount ?? "x"}-${c.updated_at}`}
                            onBlur={(e) => {
                              const raw = e.target.value.trim();
                              const next =
                                raw === "" ? null : Number(raw.replace(/[^0-9.]/g, ""));
                              if (raw !== "" && !Number.isFinite(next)) return;
                              if (next === c.budget_amount) return;
                              void persistRosterPatch(c.id, {
                                budget_amount: next,
                              });
                            }}
                          />
                        </TableCell>
                        <TableCell className="max-w-[160px] align-top">
                          <Input
                            aria-label="Last follow-up"
                            type="datetime-local"
                            className="h-8 text-[11px] leading-none"
                            defaultValue={isoToDatetimeLocal(c.last_follow_up_at)}
                            key={`lf-${c.id}-${c.last_follow_up_at ?? ""}-${c.updated_at}`}
                            onBlur={(e) => {
                              const iso = datetimeLocalToIso(e.target.value);
                              if (iso === (c.last_follow_up_at ?? null)) return;
                              void persistRosterPatch(c.id, {
                                last_follow_up_at: iso,
                              });
                            }}
                          />
                        </TableCell>
                        <TableCell className="max-w-[160px] align-top">
                          <Input
                            aria-label="Next follow-up"
                            type="datetime-local"
                            className="h-8 text-[11px] leading-none text-amber-900 dark:text-amber-100"
                            defaultValue={isoToDatetimeLocal(c.next_follow_up_at)}
                            key={`nf-${c.id}-${c.next_follow_up_at ?? ""}-${c.updated_at}`}
                            onBlur={(e) => {
                              const iso = datetimeLocalToIso(e.target.value);
                              if (iso === (c.next_follow_up_at ?? null)) return;
                              void persistRosterPatch(c.id, {
                                next_follow_up_at: iso,
                              });
                            }}
                          />
                        </TableCell>
                        <TableCell className="max-w-[200px] align-top">
                          <ExpandableTextarea
                            expandTitle="Follow-up notes"
                            expandDescription="Next touch, reminders, and context for this client."
                            aria-label="Follow-up notes"
                            className="min-h-[56px] resize-y text-xs leading-snug"
                            defaultValue={c.follow_up_notes ?? ""}
                            key={`fn-${c.id}-${c.follow_up_notes ?? ""}-${c.updated_at}`}
                            onBlur={(e) => {
                              const v = e.target.value.trim();
                              const next = v || null;
                              if (next === (c.follow_up_notes ?? null)) return;
                              void persistRosterPatch(c.id, {
                                follow_up_notes: next,
                              });
                            }}
                          />
                        </TableCell>
                        <TableCell className="align-top">
                          {lane ? (
                            <Select
                              value={lane.stage}
                              onValueChange={(v) =>
                                void onStageChange(lane.id, v as LeadStage)
                              }
                            >
                              <SelectTrigger className="h-8 w-[130px] text-xs capitalize">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {STAGES.map((s) => (
                                  <SelectItem key={s} value={s} className="capitalize">
                                    {s}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </TableCell>
                        <TableCell className="max-w-[min(220px,32vw)] align-top">
                          <div className="flex flex-col gap-1.5">
                            <ClientMediaChips links={c.marketing_asset_links} />
                            <Button
                              type="button"
                              variant="link"
                              size="sm"
                              className="h-auto justify-start p-0 text-xs text-muted-foreground"
                              onClick={() => {
                                setMediaEditFor(c);
                                setMediaEditRows(
                                  (c.marketing_asset_links ?? []).map((x) => ({
                                    label: x.label,
                                    url: x.url,
                                  })),
                                );
                                setMediaDialogError(null);
                              }}
                            >
                              Media, links &amp; uploads
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell className="max-w-[min(280px,40vw)] align-top">
                          <div className="flex flex-col gap-1.5">
                            <ClientLinkChips client={c} />
                            <Button
                              type="button"
                              variant="link"
                              size="sm"
                              className="h-auto justify-start p-0 text-xs text-muted-foreground"
                              onClick={() => {
                                setProfileLinksEditFor(c);
                                setProfileLinksEditRows(
                                  (c.extra_hyperlinks ?? []).map((x) => ({
                                    label: x.label,
                                    url: x.url,
                                  })),
                                );
                                setProfileLinksDialogError(null);
                              }}
                            >
                              Edit extra links (portfolio, etc.)
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell className="align-middle">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 shrink-0 text-muted-foreground hover:text-destructive"
                            aria-label={`Delete ${c.business_name}`}
                            title="Remove from roster"
                            onClick={() => setDeleteConfirmFor(c)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                {inlineDraftOpen ? (
                  <TableRow
                    ref={draftRowRef}
                    className="border-t-2 border-dashed border-primary/40 bg-primary/[0.07]"
                  >
                    <TableCell className="align-middle">
                      <div className="flex justify-center gap-0.5">
                        <Button
                          type="button"
                          variant="default"
                          size="icon"
                          className="h-8 w-8 shrink-0"
                          title="Save new client row"
                          aria-label="Save new roster row"
                          disabled={inlineSaving}
                          onClick={() => void submitInlineDraft()}
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 shrink-0"
                          title="Cancel"
                          aria-label="Cancel new row"
                          disabled={inlineSaving}
                          onClick={() => cancelInlineDraft()}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell className="align-middle">
                      <Select
                        value={draft.service_category}
                        onValueChange={(v) =>
                          setDraft((d) => ({
                            ...d,
                            service_category: v as ClientServiceCategory,
                          }))
                        }
                      >
                        <SelectTrigger className="h-8 text-xs capitalize">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {CLIENT_SERVICE_CATEGORIES.map((cat) => (
                            <SelectItem key={cat} value={cat} className="capitalize">
                              {cat}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="align-middle">
                      <div className="flex min-w-[140px] flex-col gap-1.5">
                        <div className="flex items-start gap-1">
                          <div className="min-w-0 flex-1 space-y-1">
                            <Input
                              data-inline-draft-business
                              aria-label="New business name"
                              placeholder="Business name *"
                              className="h-8 text-xs font-medium"
                              value={draft.business_name}
                              onChange={(e) =>
                                setDraft((d) => ({
                                  ...d,
                                  business_name: e.target.value,
                                }))
                              }
                              onKeyDown={(e) => {
                                if (e.key === "Enter" && !e.shiftKey) {
                                  e.preventDefault();
                                  void submitInlineDraft();
                                }
                              }}
                            />
                            <Input
                              aria-label="Industry"
                              placeholder="Industry"
                              className="h-7 text-[11px] text-muted-foreground"
                              value={draft.industry}
                              onChange={(e) =>
                                setDraft((d) => ({ ...d, industry: e.target.value }))
                              }
                            />
                          </div>
                          <div
                            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-dashed border-muted-foreground/40 text-[10px] text-muted-foreground"
                            title="Save row first for AI fill"
                          >
                            …
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="align-middle text-xs text-muted-foreground">
                      After save
                    </TableCell>
                    <TableCell className="max-w-[160px] align-top">
                      <Input
                        aria-label="Contact name"
                        className="h-8 min-w-[120px] text-xs"
                        value={draft.contact_name}
                        onChange={(e) =>
                          setDraft((d) => ({ ...d, contact_name: e.target.value }))
                        }
                      />
                    </TableCell>
                    <TableCell className="max-w-[140px] align-top">
                      <Input
                        aria-label="Phone"
                        className="h-8 min-w-[100px] text-xs"
                        value={draft.phone}
                        onChange={(e) =>
                          setDraft((d) => ({ ...d, phone: e.target.value }))
                        }
                      />
                    </TableCell>
                    <TableCell className="max-w-[180px] align-top">
                      <Input
                        aria-label="Email"
                        className="h-8 min-w-[120px] text-xs"
                        type="email"
                        value={draft.email}
                        onChange={(e) =>
                          setDraft((d) => ({ ...d, email: e.target.value }))
                        }
                      />
                    </TableCell>
                    <TableCell className="max-w-[220px] align-top text-xs text-muted-foreground">
                      After save, tagged intake responses appear here.
                    </TableCell>
                    <TableCell className="max-w-[220px] align-top">
                      <ExpandableTextarea
                        expandTitle="Services"
                        expandDescription="Scope, deliverables, and service details for this client."
                        aria-label="Services needed"
                        className="min-h-[56px] resize-y text-xs leading-snug"
                        value={draft.services_needed}
                        onChange={(e) =>
                          setDraft((d) => ({
                            ...d,
                            services_needed: e.target.value,
                          }))
                        }
                      />
                    </TableCell>
                    <TableCell className="w-[128px] align-top">
                      <Input
                        aria-label="Project deadline"
                        type="date"
                        className="h-8 text-xs"
                        value={draft.project_deadline}
                        onChange={(e) =>
                          setDraft((d) => ({
                            ...d,
                            project_deadline: e.target.value,
                          }))
                        }
                      />
                    </TableCell>
                    <TableCell className="max-w-[120px] align-top text-right">
                      <Input
                        aria-label="Budget amount"
                        inputMode="decimal"
                        className="h-8 text-right text-xs tabular-nums"
                        value={draft.budget}
                        onChange={(e) =>
                          setDraft((d) => ({ ...d, budget: e.target.value }))
                        }
                      />
                    </TableCell>
                    <TableCell className="max-w-[160px] align-top">
                      <Input
                        aria-label="Last follow-up"
                        type="datetime-local"
                        className="h-8 text-[11px] leading-none"
                        value={draft.last_follow_up}
                        onChange={(e) =>
                          setDraft((d) => ({
                            ...d,
                            last_follow_up: e.target.value,
                          }))
                        }
                      />
                    </TableCell>
                    <TableCell className="max-w-[160px] align-top">
                      <Input
                        aria-label="Next follow-up"
                        type="datetime-local"
                        className="h-8 text-[11px] leading-none text-amber-900 dark:text-amber-100"
                        value={draft.next_follow_up}
                        onChange={(e) =>
                          setDraft((d) => ({
                            ...d,
                            next_follow_up: e.target.value,
                          }))
                        }
                      />
                    </TableCell>
                    <TableCell className="max-w-[200px] align-top">
                      <ExpandableTextarea
                        expandTitle="Follow-up notes"
                        expandDescription="Next touch, reminders, and context for this client."
                        aria-label="Follow-up notes"
                        className="min-h-[56px] resize-y text-xs leading-snug"
                        value={draft.follow_up_notes}
                        onChange={(e) =>
                          setDraft((d) => ({
                            ...d,
                            follow_up_notes: e.target.value,
                          }))
                        }
                      />
                    </TableCell>
                    <TableCell className="align-top">
                      <Select
                        value={draft.stage}
                        onValueChange={(v) =>
                          setDraft((d) => ({ ...d, stage: v as LeadStage }))
                        }
                      >
                        <SelectTrigger className="h-8 w-[130px] text-xs capitalize">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {STAGES.map((s) => (
                            <SelectItem key={s} value={s} className="capitalize">
                              {s}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="max-w-[min(220px,32vw)] align-top text-xs text-muted-foreground">
                      Save row first, then edit media links &amp; uploads.
                    </TableCell>
                    <TableCell className="max-w-[min(280px,40vw)] align-top text-xs text-muted-foreground">
                      Save row first, then edit profile links.
                    </TableCell>
                    <TableCell className="align-middle" />
                  </TableRow>
                ) : null}
              </TableBody>
            </Table>
            <div className="flex justify-center border-t border-border/50 bg-muted/20 py-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="gap-1 text-muted-foreground"
                onClick={() => openInlineDraft()}
              >
                <Plus className="h-4 w-4" />
                Add roster row
              </Button>
            </div>
            </div>
          </TooltipProvider>
        </TabsContent>
      </Tabs>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>New client &amp; pipeline deal</DialogTitle>
            <DialogDescription>
              Saves a client row and a linked pipeline lead. If inserts fail, apply Supabase migrations through{" "}
              <span className="font-mono text-[10px]">crm_marketing_asset_links</span>,{" "}
              <span className="font-mono text-[10px]">crm_roster_category</span>,{" "}
              <span className="font-mono text-[10px]">crm_extra_hyperlinks</span>,{" "}
              <span className="font-mono text-[10px]">crm_enrichment</span>, and{" "}
              <span className="font-mono text-[10px]">crm_followups</span>.
            </DialogDescription>
          </DialogHeader>
          {formError && (
            <p
              role="alert"
              className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive"
            >
              {formError}
            </p>
          )}
          <div className="grid max-h-[60vh] gap-3 overflow-y-auto py-1 pr-1">
            <div className="grid gap-2">
              <Label htmlFor="crm-biz">Business / project name *</Label>
              <Input
                id="crm-biz"
                value={biz}
                onChange={(e) => setBiz(e.target.value)}
                placeholder="Acme Co — Website rebuild"
              />
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="crm-contact">Contact name</Label>
                <Input
                  id="crm-contact"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  placeholder="Jordan Lee"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="crm-industry">Industry</Label>
                <Input
                  id="crm-industry"
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  placeholder="Fintech"
                />
              </div>
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="crm-email">Email</Label>
                <Input
                  id="crm-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="hello@…"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="crm-phone">Phone</Label>
                <Input
                  id="crm-phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 …"
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label>Service category</Label>
              <Select
                value={serviceCategory}
                onValueChange={(v) =>
                  setServiceCategory(v as ClientServiceCategory)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CLIENT_SERVICE_CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat} className="capitalize">
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-3 rounded-lg border border-border/50 bg-muted/10 p-3">
              <div>
                <p className="text-xs font-semibold text-foreground">Profiles &amp; hyperlinks</p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Website, fixed social fields, and extra labeled URLs (e.g. Instagram page, portfolio).
                </p>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="crm-web">Website</Label>
                <Input
                  id="crm-web"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  placeholder="https://…"
                />
              </div>
              <div className="grid gap-2 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="crm-li">LinkedIn URL</Label>
                  <Input
                    id="crm-li"
                    value={linkedin}
                    onChange={(e) => setLinkedin(e.target.value)}
                    placeholder="https://linkedin.com/in/…"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="crm-ig">Instagram</Label>
                  <Input
                    id="crm-ig"
                    value={instagram}
                    onChange={(e) => setInstagram(e.target.value)}
                    placeholder="@handle or full URL"
                  />
                </div>
              </div>
              <div className="grid gap-2 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="crm-x">X / Twitter</Label>
                  <Input
                    id="crm-x"
                    value={twitter}
                    onChange={(e) => setTwitter(e.target.value)}
                    placeholder="@handle or URL"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="crm-soc-other">Other social</Label>
                  <Input
                    id="crm-soc-other"
                    value={socialOther}
                    onChange={(e) => setSocialOther(e.target.value)}
                    placeholder="YouTube, TikTok handle…"
                  />
                </div>
              </div>
              <div className="space-y-2 border-t border-border/40 pt-3">
                <div className="flex items-center justify-between gap-2">
                  <Label className="text-xs font-medium text-muted-foreground">
                    More links
                  </Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-8 gap-1 text-xs"
                    onClick={() =>
                      setExtraLinks((prev) => [...prev, { label: "", url: "" }])
                    }
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Add link
                  </Button>
                </div>
                {extraLinks.length === 0 ? (
                  <p className="text-xs text-muted-foreground">
                    Optional — add Facebook page, Behance, Cal.com, etc.
                  </p>
                ) : null}
                {extraLinks.map((row, i) => (
                  <div
                    key={i}
                    className="grid gap-2 sm:grid-cols-[1fr_1fr_auto] sm:items-end"
                  >
                    <div className="grid gap-2">
                      <Label className="sr-only" htmlFor={`crm-link-label-${i}`}>
                        Link label
                      </Label>
                      <Input
                        id={`crm-link-label-${i}`}
                        value={row.label}
                        onChange={(e) =>
                          setExtraLinks((p) =>
                            p.map((r, j) =>
                              j === i ? { ...r, label: e.target.value } : r,
                            ),
                          )
                        }
                        placeholder="Label (e.g. Instagram)"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label className="sr-only" htmlFor={`crm-link-url-${i}`}>
                        URL
                      </Label>
                      <Input
                        id={`crm-link-url-${i}`}
                        value={row.url}
                        onChange={(e) =>
                          setExtraLinks((p) =>
                            p.map((r, j) =>
                              j === i ? { ...r, url: e.target.value } : r,
                            ),
                          )
                        }
                        placeholder="https://…"
                      />
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="shrink-0 text-muted-foreground"
                      onClick={() =>
                        setExtraLinks((p) => p.filter((_, j) => j !== i))
                      }
                      aria-label="Remove link row"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-3 rounded-lg border border-border/50 bg-muted/10 p-3">
              <div>
                <p className="text-xs font-semibold text-foreground">
                  Marketing, media &amp; product links
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Link to hosted images, videos, Figma, Drive folders, staging apps — opens in a new tab so the roster stays clean.
                </p>
              </div>
              <div className="flex items-center justify-between gap-2">
                <Label className="text-xs font-medium text-muted-foreground">
                  Asset URLs
                </Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-8 gap-1 text-xs"
                  onClick={() =>
                    setMediaAssetLinks((prev) => [
                      ...prev,
                      { label: "", url: "" },
                    ])
                  }
                >
                  <Plus className="h-3.5 w-3.5" />
                  Add link
                </Button>
              </div>
              {mediaAssetLinks.length === 0 ? (
                <p className="text-xs text-muted-foreground">
                  Optional — e.g. “Hero stills → Dropbox”, “Product video → Vimeo”.
                </p>
              ) : null}
              {mediaAssetLinks.map((row, i) => (
                <div
                  key={i}
                  className="grid gap-2 sm:grid-cols-[1fr_1fr_auto] sm:items-end"
                >
                  <div className="grid gap-2">
                    <Label className="sr-only" htmlFor={`crm-media-label-${i}`}>
                      Label
                    </Label>
                    <Input
                      id={`crm-media-label-${i}`}
                      value={row.label}
                      onChange={(e) =>
                        setMediaAssetLinks((p) =>
                          p.map((r, j) =>
                            j === i ? { ...r, label: e.target.value } : r,
                          ),
                        )
                      }
                      placeholder="Label (e.g. Storyboard PDF)"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label className="sr-only" htmlFor={`crm-media-url-${i}`}>
                      URL
                    </Label>
                    <Input
                      id={`crm-media-url-${i}`}
                      value={row.url}
                      onChange={(e) =>
                        setMediaAssetLinks((p) =>
                          p.map((r, j) =>
                            j === i ? { ...r, url: e.target.value } : r,
                          ),
                        )
                      }
                      placeholder="https://…"
                    />
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="shrink-0 text-muted-foreground"
                    onClick={() =>
                      setMediaAssetLinks((p) => p.filter((_, j) => j !== i))
                    }
                    aria-label="Remove media link row"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="crm-services">Services needed / scope</Label>
              <ExpandableTextarea
                id="crm-services"
                rows={3}
                expandTitle="Services needed / scope"
                expandDescription="Describe deliverables, timeline, and scope for this client."
                value={services}
                onChange={(e) => setServices(e.target.value)}
                placeholder="e.g. Next.js site, brand kit, 6 weeks SLA…"
              />
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="crm-last-fu">Last follow-up</Label>
                <Input
                  id="crm-last-fu"
                  type="datetime-local"
                  value={lastFollowUpLocal}
                  onChange={(e) => setLastFollowUpLocal(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="crm-next-fu">Next follow-up</Label>
                <Input
                  id="crm-next-fu"
                  type="datetime-local"
                  value={nextFollowUpLocal}
                  onChange={(e) => setNextFollowUpLocal(e.target.value)}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="crm-fu-notes">Follow-up notes (next touch)</Label>
              <ExpandableTextarea
                id="crm-fu-notes"
                rows={2}
                expandTitle="Follow-up notes"
                expandDescription="Next touch, reminders, and context for this client."
                value={followUpNotesOnly}
                onChange={(e) => setFollowUpNotesOnly(e.target.value)}
                placeholder="e.g. Send proposal Tuesday, call after holiday…"
              />
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="crm-deadline">Target deadline</Label>
                <Input
                  id="crm-deadline"
                  type="date"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="crm-budget">Project budget (USD)</Label>
                <Input
                  id="crm-budget"
                  inputMode="decimal"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  placeholder="12000"
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="crm-tags">Pipeline tags (comma-separated)</Label>
              <Input
                id="crm-tags"
                value={tagsRaw}
                onChange={(e) => setTagsRaw(e.target.value)}
                placeholder="enterprise, urgent, referral"
              />
            </div>
            <div className="grid gap-2">
              <Label>Starting pipeline stage</Label>
              <Select value={stage} onValueChange={(v) => setStage(v as LeadStage)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STAGES.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="crm-notes">Internal notes</Label>
              <Textarea
                id="crm-notes"
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Decision makers, objections, next step…"
              />
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              type="button"
              disabled={saving || !biz.trim()}
              onClick={() => void onSubmitDeal()}
            >
              {saving ? "Saving…" : "Save client & deal"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={mediaEditFor != null}
        onOpenChange={(open) => {
          if (!open) {
            setMediaEditFor(null);
            setMediaDialogError(null);
          }
        }}
      >
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Media, links &amp; uploads</DialogTitle>
            <DialogDescription>
              {mediaEditFor ? (
                <>
                  <span className="font-medium text-foreground">
                    {mediaEditFor.business_name}
                  </span>
                  . Add outbound URLs and upload logos, decks, PDFs, and briefs stored in Supabase.
                </>
              ) : (
                "Edit outbound links for this client."
              )}
            </DialogDescription>
          </DialogHeader>
          {mediaDialogError ? (
            <p
              role="alert"
              className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive"
            >
              {mediaDialogError}
            </p>
          ) : null}
          {mediaEditFor ? (
            <ClientSupportDocuments
              clientId={mediaEditFor.id}
              uploadsEnabled={!persistLocally}
            />
          ) : null}
          <div className="max-h-[50vh] space-y-3 overflow-y-auto pr-1">
            <p className="text-xs font-medium text-muted-foreground">
              Hosted links (opens in new tab)
            </p>
            <div className="flex justify-end">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-8 gap-1 text-xs"
                onClick={() =>
                  setMediaEditRows((p) => [...p, { label: "", url: "" }])
                }
              >
                <Plus className="h-3.5 w-3.5" />
                Add link
              </Button>
            </div>
            {mediaEditRows.length === 0 ? (
              <p className="text-xs text-muted-foreground">
                No links yet — add a row for each asset or page elsewhere.
              </p>
            ) : null}
            {mediaEditRows.map((row, i) => (
              <div
                key={i}
                className="grid gap-2 sm:grid-cols-[1fr_1fr_auto] sm:items-end"
              >
                <div className="grid gap-2">
                  <Label className="sr-only" htmlFor={`crm-mededit-label-${i}`}>
                    Label
                  </Label>
                  <Input
                    id={`crm-mededit-label-${i}`}
                    value={row.label}
                    onChange={(e) =>
                      setMediaEditRows((p) =>
                        p.map((r, j) =>
                          j === i ? { ...r, label: e.target.value } : r,
                        ),
                      )
                    }
                    placeholder="Label"
                  />
                </div>
                <div className="grid gap-2">
                  <Label className="sr-only" htmlFor={`crm-mededit-url-${i}`}>
                    URL
                  </Label>
                  <Input
                    id={`crm-mededit-url-${i}`}
                    value={row.url}
                    onChange={(e) =>
                      setMediaEditRows((p) =>
                        p.map((r, j) =>
                          j === i ? { ...r, url: e.target.value } : r,
                        ),
                      )
                    }
                    placeholder="https://…"
                  />
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="shrink-0 text-muted-foreground"
                  onClick={() =>
                    setMediaEditRows((p) => p.filter((_, j) => j !== i))
                  }
                  aria-label="Remove row"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setMediaEditFor(null);
                setMediaDialogError(null);
              }}
            >
              Cancel
            </Button>
            <Button
              type="button"
              disabled={mediaSaving}
              onClick={() => void onSaveMediaLinks()}
            >
              {mediaSaving ? "Saving…" : "Save links"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={profileLinksEditFor != null}
        onOpenChange={(open) => {
          if (!open) {
            setProfileLinksEditFor(null);
            setProfileLinksDialogError(null);
          }
        }}
      >
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Extra profile links</DialogTitle>
            <DialogDescription>
              {profileLinksEditFor ? (
                <>
                  <span className="font-medium text-foreground">
                    {profileLinksEditFor.business_name}
                  </span>
                  . Add any number of labeled URLs (portfolio, Cal.com, GitHub,
                  etc.). Website and fixed socials stay on the record from “Add
                  client”; this list is the flexible catch‑all.
                </>
              ) : (
                "Edit labeled links for this client."
              )}
            </DialogDescription>
          </DialogHeader>
          {profileLinksDialogError ? (
            <p
              role="alert"
              className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive"
            >
              {profileLinksDialogError}
            </p>
          ) : null}
          <div className="max-h-[50vh] space-y-3 overflow-y-auto pr-1">
            <div className="flex justify-end">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-8 gap-1 text-xs"
                onClick={() =>
                  setProfileLinksEditRows((p) => [
                    ...p,
                    { label: "", url: "" },
                  ])
                }
              >
                <Plus className="h-3.5 w-3.5" />
                Add link
              </Button>
            </div>
            {profileLinksEditRows.length === 0 ? (
              <p className="text-xs text-muted-foreground">
                No extra links yet — add as many rows as you need.
              </p>
            ) : null}
            {profileLinksEditRows.map((row, i) => (
              <div
                key={i}
                className="grid gap-2 sm:grid-cols-[1fr_1fr_auto] sm:items-end"
              >
                <div className="grid gap-2">
                  <Label
                    className="sr-only"
                    htmlFor={`crm-profilelink-label-${i}`}
                  >
                    Label
                  </Label>
                  <Input
                    id={`crm-profilelink-label-${i}`}
                    value={row.label}
                    onChange={(e) =>
                      setProfileLinksEditRows((p) =>
                        p.map((r, j) =>
                          j === i ? { ...r, label: e.target.value } : r,
                        ),
                      )
                    }
                    placeholder="Label"
                  />
                </div>
                <div className="grid gap-2">
                  <Label className="sr-only" htmlFor={`crm-profilelink-url-${i}`}>
                    URL
                  </Label>
                  <Input
                    id={`crm-profilelink-url-${i}`}
                    value={row.url}
                    onChange={(e) =>
                      setProfileLinksEditRows((p) =>
                        p.map((r, j) =>
                          j === i ? { ...r, url: e.target.value } : r,
                        ),
                      )
                    }
                    placeholder="https://…"
                  />
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="shrink-0 text-muted-foreground"
                  onClick={() =>
                    setProfileLinksEditRows((p) => p.filter((_, j) => j !== i))
                  }
                  aria-label="Remove row"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setProfileLinksEditFor(null);
                setProfileLinksDialogError(null);
              }}
            >
              Cancel
            </Button>
            <Button
              type="button"
              disabled={profileLinksSaving}
              onClick={() => void onSaveProfileExtraLinks()}
            >
              {profileLinksSaving ? "Saving…" : "Save links"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={aiFillFor != null}
        onOpenChange={(open) => {
          if (!open) {
            setAiFillFor(null);
            setAiSentence("");
            setAiPreview(null);
            setAiSource(null);
            setAiError(null);
          }
        }}
      >
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>AI row fill</DialogTitle>
            <DialogDescription>
              Describe updates in plain English. The app maps them to roster fields. With{" "}
              <code className="rounded bg-muted px-1 text-[11px]">OPENAI_API_KEY</code>{" "}
              set on the server, parsing is much smarter; otherwise a light pattern matcher runs.
            </DialogDescription>
          </DialogHeader>
          {aiFillFor ? (
            <p className="text-sm text-muted-foreground">
              Client:{" "}
              <span className="font-medium text-foreground">{aiFillFor.business_name}</span>
            </p>
          ) : null}
          {aiError ? (
            <p role="alert" className="text-sm text-destructive">
              {aiError}
            </p>
          ) : null}
          <Textarea
            rows={4}
            value={aiSentence}
            onChange={(e) => setAiSentence(e.target.value)}
            placeholder='e.g. "Contact is Jane Doe, email jane@acme.com, budget 15k, deadline 2026-06-01, next follow-up Friday 4pm, move to negotiation"'
            className="text-sm"
          />
          {aiPreview && Object.keys(aiPreview).length > 0 ? (
            <div className="rounded-md border border-border/60 bg-muted/20 p-3 text-xs">
              <p className="mb-2 font-medium text-foreground">Preview</p>
              <ul className="space-y-1 text-muted-foreground">
                {Object.entries(aiPreview).map(([k, v]) => (
                  <li key={k}>
                    <span className="font-mono text-foreground">{k}</span>:{" "}
                    {v == null ? "—" : String(v)}
                  </li>
                ))}
              </ul>
              {aiSource ? (
                <p className="mt-2 text-[11px] text-muted-foreground">Source: {aiSource}</p>
              ) : null}
            </div>
          ) : null}
          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => void onAiParse()}
              disabled={aiBusy}
            >
              {aiBusy ? "Parsing…" : "Parse sentence"}
            </Button>
            <Button
              type="button"
              onClick={() => void onAiApply()}
              disabled={
                !aiPreview ||
                !Object.keys(aiPreview).length ||
                aiBusy
              }
            >
              Apply to row
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={intakeDetail != null}
        onOpenChange={(open) => {
          if (!open) setIntakeDetail(null);
        }}
      >
        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Pipeline intake answers</DialogTitle>
            <DialogDescription>
              {intakeDetail ? (
                <>
                  <span className="font-medium text-foreground">{intakeDetail.businessName}</span>
                  {intakeDetail.summary.formTitle ? (
                    <> · form “{intakeDetail.summary.formTitle}”</>
                  ) : null}
                  . Submitted{" "}
                  {new Date(intakeDetail.summary.submittedAt).toLocaleString(undefined, {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                  .
                </>
              ) : (
                "Answers from the client’s tagged intake link."
              )}
            </DialogDescription>
          </DialogHeader>
          {intakeDetail ? (
            <div className="space-y-3 text-sm">
              {intakeDetail.summary.primaryFocus ? (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Primary focus
                  </p>
                  <p className="mt-1 text-foreground">{intakeDetail.summary.primaryFocus}</p>
                </div>
              ) : null}
              {intakeDetail.summary.problem ? (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Problem / goal
                  </p>
                  <p className="mt-1 whitespace-pre-wrap text-foreground">
                    {intakeDetail.summary.problem}
                  </p>
                </div>
              ) : null}
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  All answers
                </p>
                <pre className="mt-2 max-h-[48vh] overflow-auto whitespace-pre-wrap rounded-md border border-border/60 bg-muted/20 p-3 text-xs leading-relaxed text-foreground">
                  {intakeDetail.summary.fullAnswersText}
                </pre>
              </div>
            </div>
          ) : null}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIntakeDetail(null)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={deleteConfirmFor != null}
        onOpenChange={(open) => {
          if (!open && !deleteBusy) setDeleteConfirmFor(null);
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Remove client from roster?</DialogTitle>
            <DialogDescription>
              {deleteConfirmFor ? (
                <>
                  This permanently deletes{" "}
                  <span className="font-medium text-foreground">
                    {deleteConfirmFor.business_name}
                  </span>{" "}
                  and its linked pipeline card. Intake submissions already stored are kept
                  but will no longer appear on this row.
                </>
              ) : (
                "This cannot be undone."
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              disabled={deleteBusy}
              onClick={() => setDeleteConfirmFor(null)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              disabled={deleteBusy}
              onClick={() => void confirmDeleteClient()}
            >
              {deleteBusy ? "Removing…" : "Delete row"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
