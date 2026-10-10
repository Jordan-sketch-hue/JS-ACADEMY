"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { BillingSnapshot } from "@/components/dashboard/billing-snapshot";
import { formatCurrency, formatPercent } from "@/lib/utils";
import Link from "next/link";
import type { DashboardBundle } from "@/lib/data/seed";
import type { TaskLaneInsight } from "@/lib/data/seed";
import { buildTodoLaneInsights } from "@/lib/data/todo-lanes";
import { useWorkspace } from "@/components/app/workspace-context";
import {
  LOCAL_TASKS_CHANGED,
  loadLocalTaskBundle,
} from "@/lib/storage/local-tasks-storage";
import {
  LOCAL_CRM_CHANGED,
  loadLocalCrmBundle,
} from "@/lib/storage/local-crm-storage";
import type { LeadStage } from "@/lib/data/seed";
import {
  emptyLeadsByStage,
  sumTaskLaneDone,
  sumTaskLaneOpen,
  summarizeLeadsByStage,
  summarizeLeadsByStageRecord,
} from "@/lib/data/workspace-counts";
import {
  ChevronRight,
  LayoutList,
  LineChart,
  ListChecks,
  TrendingUp,
  Users,
} from "lucide-react";

const priorityLabel: Record<number, string> = {
  1: "P1",
  2: "P2",
  3: "P3",
  4: "P4",
};

export function DashboardClient({ data }: { data: DashboardBundle }) {
  const { ownerId, persistLocally } = useWorkspace();
  const [localLanes, setLocalLanes] = useState<TaskLaneInsight[]>([]);
  const [localLeadsByStage, setLocalLeadsByStage] = useState<Record<LeadStage, number>>(
    () => emptyLeadsByStage(),
  );

  useEffect(() => {
    if (!persistLocally) return;
    const refresh = () => {
      const bundle = loadLocalTaskBundle(ownerId);
      if (!bundle) {
        setLocalLanes([]);
        return;
      }
      setLocalLanes(buildTodoLaneInsights(bundle.categories, bundle.todos));
    };
    refresh();
    window.addEventListener(LOCAL_TASKS_CHANGED, refresh);
    return () => window.removeEventListener(LOCAL_TASKS_CHANGED, refresh);
  }, [ownerId, persistLocally]);

  useEffect(() => {
    if (!persistLocally) return;
    const refresh = () => {
      const bundle = loadLocalCrmBundle(ownerId);
      if (!bundle) {
        setLocalLeadsByStage(emptyLeadsByStage());
        return;
      }
      setLocalLeadsByStage(summarizeLeadsByStage(bundle.leads).byStage);
    };
    refresh();
    window.addEventListener(LOCAL_CRM_CHANGED, refresh);
    return () => window.removeEventListener(LOCAL_CRM_CHANGED, refresh);
  }, [ownerId, persistLocally]);

  const taskLanes = persistLocally ? localLanes : data.taskLanes;
  const leadsByStage = persistLocally ? localLeadsByStage : data.leadsByStage;
  const leadCounts = summarizeLeadsByStageRecord(leadsByStage);
  const openTasks = sumTaskLaneOpen(taskLanes);
  const doneTasks = sumTaskLaneDone(taskLanes);
  const totalTasks = openTasks + doneTasks;

  return (
    <div className="mx-auto flex max-w-[1600px] flex-col gap-6">
      {/* Money first — real invoice data */}
      <BillingSnapshot />

      {/* Secondary operating metrics */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Metric
          icon={<ListChecks className="h-4 w-4" />}
          label="Open tasks"
          value={String(openTasks)}
          hint={`${doneTasks} done · ${totalTasks} total`}
          href="/todos"
        />
        <Metric
          icon={<Users className="h-4 w-4" />}
          label="Active clients"
          value={String(data.clients.active)}
          hint={`${leadCounts.inPipeline} in pipeline · ${leadCounts.total} leads`}
          href="/crm?tab=leads"
        />
        <Metric
          icon={<TrendingUp className="h-4 w-4" />}
          label="Net P/L (trading)"
          value={formatCurrency(data.trading.plNet)}
          hint="Rolling aggregate"
          href="/trading"
        />
        <Metric
          icon={<LineChart className="h-4 w-4" />}
          label="Win rate"
          value={formatPercent(data.trading.winRate)}
          hint="Journal-tagged trades"
          href="/trading"
        />
      </div>

      {/* Task lane insights */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.02 }}
      >
        <Card className="border-border/60 bg-card/40 shadow-none backdrop-blur-xl">
          <CardHeader className="pb-3">
            <CardTitle className="flex flex-wrap items-center gap-2 text-base font-medium">
              <LayoutList className="h-4 w-4 text-primary" />
              Task lane insights
              <Badge variant="secondary" className="font-mono text-[10px] font-normal">
                {openTasks} open
              </Badge>
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Workload by lane — <span className="text-foreground">Tech</span>,{" "}
              <span className="text-foreground">Marketing</span>, and{" "}
              <span className="text-foreground">Trading</span>, plus any categories you add on Tasks.
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {taskLanes.length === 0 ? (
              <p className="rounded-lg border border-dashed border-border/60 py-10 text-center text-sm text-muted-foreground">
                No task categories yet.{" "}
                <Link href="/todos" className="font-medium text-primary underline-offset-4 hover:underline">
                  Open Tasks
                </Link>{" "}
                to add your first lane.
              </p>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {taskLanes.map((lane) => {
                  const pct = lane.total ? Math.round((lane.done / lane.total) * 100) : 0;
                  return (
                    <Link
                      key={lane.categoryId}
                      href={`/todos?lane=${encodeURIComponent(lane.categoryId)}`}
                      className="block cursor-pointer rounded-lg border border-border/50 bg-background/30 p-4 transition-colors hover:border-border/80 hover:bg-background/45 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className="h-2.5 w-2.5 shrink-0 rounded-full"
                          style={{ background: lane.color ?? "hsl(var(--primary))" }}
                          aria-hidden
                        />
                        <span className="text-sm font-medium">{lane.name}</span>
                      </div>
                      <p className="mt-2 text-xs text-muted-foreground">
                        <span className="font-medium text-foreground">{lane.open}</span> open ·{" "}
                        <span className="font-medium text-foreground">{lane.done}</span> done
                      </p>
                      <Progress value={pct} className="mt-3 h-1.5" />
                      <p className="mt-1 text-[11px] text-muted-foreground">
                        {lane.total} total · {pct}% complete
                      </p>
                    </Link>
                  );
                })}
              </div>
            )}
            <Link
              href="/todos"
              className="inline-flex text-sm font-medium text-primary hover:underline"
            >
              Manage tasks
            </Link>
          </CardContent>
        </Card>
      </motion.div>

      {/* Project pipeline */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            <Link
              href="/projects"
              className="inline-flex items-center gap-1 rounded-md text-foreground underline-offset-4 transition-colors hover:text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              Project pipeline
              <ChevronRight className="h-3.5 w-3.5 opacity-40" aria-hidden />
            </Link>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {data.pipeline.length === 0 ? (
            <p className="rounded-lg border border-dashed border-border/60 py-10 text-center text-sm text-muted-foreground">
              No active projects in the pipeline yet.
            </p>
          ) : (
            <div className="grid gap-x-6 gap-y-4 lg:grid-cols-2">
              {data.pipeline.map((p) => (
                <Link
                  key={p.id}
                  href="/projects"
                  className="block space-y-2 rounded-lg p-2 transition-colors hover:bg-muted/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-medium leading-tight">{p.name}</p>
                      <p className="text-xs text-muted-foreground">{p.client}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <Badge variant="secondary">{priorityLabel[p.priority]}</Badge>
                      <span className="text-[11px] text-muted-foreground">
                        Due {p.deadline}
                      </span>
                    </div>
                  </div>
                  <Progress value={p.progress} />
                  <Separator className="opacity-60" />
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Client acquisition funnel */}
      <Card>
        <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-2">
          <CardTitle className="text-base">Client acquisition funnel</CardTitle>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="default" className="font-mono text-[10px]">
              {leadCounts.inPipeline} in pipeline
            </Badge>
            <Badge variant="outline" className="font-mono text-[10px]">
              {leadCounts.total} total
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-5">
          {(Object.entries(leadsByStage) as [keyof typeof leadsByStage, number][]).map(
            ([stage, count]) => (
              <Link
                key={stage}
                href="/crm?tab=leads"
                className="block rounded-xl border border-border/60 bg-background/30 p-4 text-center transition-colors hover:border-border hover:bg-background/45 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <p className="text-xs uppercase tracking-widest text-muted-foreground">
                  {stage}
                </p>
                <p className="mt-2 text-3xl font-semibold tabular-nums">{count}</p>
              </Link>
            ),
          )}
        </CardContent>
        <CardContent className="border-t border-border/60 pt-0 text-sm text-muted-foreground">
          {data.clients.active === 0 &&
          leadCounts.total === 0 &&
          Object.values(leadsByStage).every((n) => n === 0) ? (
            <span>Lead and client metrics will appear when you add records.</span>
          ) : (
            <>
              Conversion rate {formatPercent(data.clients.conversionRate)} · Pending
              payments {data.clients.pendingPayments}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function Metric({
  icon,
  label,
  value,
  hint,
  href,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  hint: string;
  href?: string;
}) {
  const card = (
    <Card className="relative h-full overflow-hidden transition-colors">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent" />
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <span className="text-sm text-muted-foreground">{label}</span>
        <span className="text-primary">{icon}</span>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-semibold tracking-tight">{value}</div>
        <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
      </CardContent>
    </Card>
  );

  if (href) {
    return (
      <Link
        href={href}
        className="block rounded-lg transition-colors hover:bg-card/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      >
        {card}
      </Link>
    );
  }

  return card;
}
