/**
 * Deterministic keyword/regex parsing for quick actions in the AI panel.
 * Jarvis tries these before falling back to full chat (OpenAI).
 */

import type { CreateCrmDealInput } from "@/lib/data/crm-records";
import { tryParseCrmQuickAdd } from "@/lib/ai/parse-crm-quick-action";

export type ParsedAiCommand =
  | {
      kind: "todo";
      title: string;
      laneHint?: "tech" | "marketing" | "trading";
      notes?: string | null;
      due_date?: string | null;
    }
  | { kind: "reminder"; body: string }
  | { kind: "assign"; title: string; assigneeHint?: string }
  | { kind: "crm_add"; input: CreateCrmDealInput };

const REMIND = /^\s*remind(?:\s+me)?(?:\s+to)?\s*[:\-–]?\s*(.+)$/i;
const ADD_TASK = /^\s*(?:add|create)\s+(?:a\s+)?task\s*[:\-–]?\s*(.+)$/i;
const NEW_TASK = /^\s*new\s+task\s*[:\-–]?\s*(.+)$/i;
const TODO_LINE = /^\s*todo\s*[:\-–]?\s*(.+)$/i;
const SHORT_TASK = /^\s*t\s*[:\-–]\s*(.+)$/i;
const PLAIN_TASK = /^\s*task\s*[:\-–]?\s*(.+)$/i;
const HASHTAG_TASK = /^\s*#\s*task\s*[:\-–]?\s*(.+)$/i;
const ASSIGN_TO = /^\s*assign\s+to\s+([^:]+)\s*[:\-–]\s*(.+)$/i;
const ASSIGN = /^\s*assign\s*[:\-–]?\s*(.+)$/i;
const LANE_TASK =
  /^\s*\[\s*(tech|marketing|trading)\s*\]\s*[:\-–]?\s*(.+)$/i;

export function parseAiUserMessageForIntent(raw: string): ParsedAiCommand | null {
  const text = raw.trim();
  if (!text) return null;

  const crm = tryParseCrmQuickAdd(text);
  if (crm) {
    return { kind: "crm_add", input: crm };
  }

  const lane = text.match(LANE_TASK);
  if (lane?.[1] && lane[2]?.trim()) {
    const hint = lane[1].toLowerCase() as "tech" | "marketing" | "trading";
    return { kind: "todo", title: lane[2].trim(), laneHint: hint };
  }

  const remind = text.match(REMIND);
  if (remind?.[1]?.trim()) {
    return { kind: "reminder", body: remind[1].trim() };
  }

  const task = text.match(ADD_TASK);
  if (task?.[1]?.trim()) {
    return { kind: "todo", title: task[1].trim() };
  }

  const newTask = text.match(NEW_TASK);
  if (newTask?.[1]?.trim()) {
    return { kind: "todo", title: newTask[1].trim() };
  }

  const todoLine = text.match(TODO_LINE);
  if (todoLine?.[1]?.trim()) {
    return { kind: "todo", title: todoLine[1].trim() };
  }

  const shortTask = text.match(SHORT_TASK);
  if (shortTask?.[1]?.trim()) {
    return { kind: "todo", title: shortTask[1].trim() };
  }

  const plain = text.match(PLAIN_TASK) ?? text.match(HASHTAG_TASK);
  if (plain?.[1]?.trim()) {
    return { kind: "todo", title: plain[1].trim() };
  }

  const assignNamed = text.match(ASSIGN_TO);
  if (assignNamed?.[1]?.trim() && assignNamed[2]?.trim()) {
    return {
      kind: "assign",
      assigneeHint: assignNamed[1].trim(),
      title: assignNamed[2].trim(),
    };
  }

  const assign = text.match(ASSIGN);
  if (assign?.[1]?.trim()) {
    return { kind: "assign", title: assign[1].trim() };
  }

  return null;
}
