import "server-only";

import type { ParsedAiCommand } from "@/components/app/ai-command-parser";
import type { Todo } from "@/lib/data/todos";
import { getServiceSupabase } from "@/lib/supabase/admin";
import {
  createReminderNotification,
  createTodo,
  listTodoCategories,
} from "@/lib/data/todos";
import { createCrmDeal } from "@/lib/data/crm";
import { createDealRecords, withCrmDealNameFallback } from "@/lib/data/crm-records";
import type { CrmClientRecord, CrmLeadRecord } from "@/lib/data/crm-records";

export type AiCommandResult =
  | {
      ok: true;
      summary: string;
      detail?: {
        id?: string;
        todo?: Todo;
        client?: CrmClientRecord;
        lead?: CrmLeadRecord;
        localCrm?: { client: CrmClientRecord; lead: CrmLeadRecord };
      };
    }
  | { ok: false; summary: string };

async function categoryIdForLane(
  ownerClerkId: string,
  lane: "tech" | "marketing" | "trading",
): Promise<string | null> {
  const { categories } = await listTodoCategories(ownerClerkId);
  const hit = categories.find((c) => c.name.toLowerCase() === lane);
  return hit?.id ?? null;
}

export async function executeDeterministicAiCommand(
  ownerClerkId: string,
  cmd: ParsedAiCommand,
): Promise<AiCommandResult> {
  const defaultLane = async () => {
    if (!getServiceSupabase()) return null;
    const { categories: cats } = await listTodoCategories(ownerClerkId);
    return cats.find((c) => c.name === "Tech")?.id ?? cats[0]?.id ?? null;
  };

  const taskCategoryId = async () => {
    if (cmd.kind !== "todo") return null;
    if (cmd.laneHint) {
      const id = await categoryIdForLane(ownerClerkId, cmd.laneHint);
      if (id) return id;
    }
    return defaultLane();
  };

  switch (cmd.kind) {
    case "todo": {
      const r = await createTodo(ownerClerkId, {
        title: cmd.title.trim() || "New task",
        notes: cmd.notes?.trim() || null,
        due_date: cmd.due_date?.trim() || null,
        priority: 2,
        category_id: await taskCategoryId(),
      });
      if (!r.ok) return { ok: false, summary: r.error };
      return {
        ok: true,
        summary: cmd.laneHint
          ? `Task in **${cmd.laneHint}** lane: “${r.todo.title}”.`
          : `Task created: “${r.todo.title}”.`,
        detail: { id: r.todo.id, todo: r.todo },
      };
    }
    case "reminder": {
      const row = await createReminderNotification(ownerClerkId, cmd.body);
      if (!row) return { ok: false, summary: "Could not save reminder." };
      return { ok: true, summary: "Reminder saved to your notifications.", detail: { id: row.id } };
    }
    case "assign": {
      const notes = cmd.assigneeHint
        ? `Assignee (from message): ${cmd.assigneeHint}`
        : "Created from assign intent.";
      const r = await createTodo(ownerClerkId, {
        title: `[Assign] ${cmd.title}`,
        notes,
        priority: 2,
        category_id: await defaultLane(),
      });
      if (!r.ok) return { ok: false, summary: r.error };
      return {
        ok: true,
        summary: `Assignment captured as task: “${r.todo.title}”.`,
        detail: { id: r.todo.id, todo: r.todo },
      };
    }
    case "crm_add": {
      const dealInput = withCrmDealNameFallback(cmd.input);
      const cloud = await createCrmDeal(ownerClerkId, dealInput);
      if (cloud.ok) {
        return {
          ok: true,
          summary: `CRM: **${cloud.client.business_name}** added (${cloud.lead.stage} pipeline). Open **CRM** to edit details.`,
          detail: { client: cloud.client, lead: cloud.lead },
        };
      }
      const msg = cloud.error;
      if (/Supabase is not configured|not configured on the server/i.test(msg)) {
        const built = createDealRecords(ownerClerkId, dealInput);
        if ("error" in built) return { ok: false, summary: built.error };
        return {
          ok: true,
          summary: `CRM (local): **${built.client.business_name}** saved in this browser. Cloud CRM off — data shows when you open **CRM**.`,
          detail: { localCrm: { client: built.client, lead: built.lead } },
        };
      }
      return { ok: false, summary: msg };
    }
    default:
      return { ok: false, summary: "Unknown command." };
  }
}
