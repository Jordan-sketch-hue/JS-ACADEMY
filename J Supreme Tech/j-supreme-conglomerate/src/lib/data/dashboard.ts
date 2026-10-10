import { getServiceSupabase } from "@/lib/supabase/admin";
import { seedDashboardBundle, type DashboardBundle } from "@/lib/data/seed";
import { getTodoLaneInsights } from "@/lib/data/todos";

export async function loadDashboardBundle(
  ownerClerkId: string,
): Promise<DashboardBundle> {
  const base = seedDashboardBundle(ownerClerkId);
  const sb = getServiceSupabase();
  if (!sb) {
    const taskLanes = await getTodoLaneInsights(ownerClerkId);
    return { ...base, taskLanes };
  }

  try {
    const [taskLanes, clientsC, leadsC, projectsRes, tradesRes] = await Promise.all([
      getTodoLaneInsights(ownerClerkId),
      sb
        .from("clients")
        .select("id", { count: "exact", head: true })
        .eq("owner_clerk_id", ownerClerkId),
      sb.from("leads").select("stage").eq("owner_clerk_id", ownerClerkId),
      sb
        .from("projects")
        .select("id,name,progress,deadline,status,priority,client_id")
        .eq("owner_clerk_id", ownerClerkId)
        .order("updated_at", { ascending: false })
        .limit(6),
      sb
        .from("trades")
        .select("pnl,flow_kind")
        .eq("owner_clerk_id", ownerClerkId)
        .or("flow_kind.is.null,flow_kind.eq.market")
        .not("pnl", "is", null),
    ]);

    const clientCount = clientsC.count ?? base.clients.active;
    const leadRows = leadsC.data ?? [];
    const leadsByStage = { ...base.leadsByStage };
    if (leadRows.length) {
      (Object.keys(leadsByStage) as (keyof typeof leadsByStage)[]).forEach(
        (k) => {
          leadsByStage[k] = 0;
        },
      );
      for (const row of leadRows) {
        const s = row.stage as keyof typeof leadsByStage;
        if (s in leadsByStage) leadsByStage[s] += 1;
      }
    }

    const newLeadsCount = leadRows.length;

    let pl = base.trading.plNet;
    let wins = 0;
    let total = 0;
    if (tradesRes.data?.length) {
      total = tradesRes.data.length;
      wins = tradesRes.data.filter((t) => (t.pnl ?? 0) > 0).length;
      pl = tradesRes.data.reduce((a, t) => a + (t.pnl ?? 0), 0);
    }

    const pipeline =
      projectsRes.data?.map((p) => ({
        id: p.id,
        name: p.name,
        client: p.client_id ? "Linked client" : "—",
        progress: p.progress ?? 0,
        deadline: p.deadline ?? "—",
        priority: (p.priority ?? 2) as 1 | 2 | 3 | 4,
        status: p.status ?? "in_progress",
      })) ?? base.pipeline;

    return {
      ...base,
      clients: {
        ...base.clients,
        active: clientCount || base.clients.active,
        newLeads: newLeadsCount,
      },
      trading: {
        ...base.trading,
        plNet: pl,
        winRate: total ? wins / total : base.trading.winRate,
      },
      leadsByStage: leadRows.length ? leadsByStage : base.leadsByStage,
      pipeline: pipeline.length ? pipeline : base.pipeline,
      taskLanes,
    };
  } catch {
    return { ...base, taskLanes: [] };
  }
}
