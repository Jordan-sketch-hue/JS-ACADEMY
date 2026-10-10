import { requireOwnerClerkId } from "@/lib/session";
import { loadBudgetWorkspace } from "@/lib/data/budget";
import { BudgetClient } from "@/components/budget/budget-client";
import { seedStatementBudgetAction } from "./actions";

export const metadata = {
  title: "Budget · J Supreme Conglomerate",
};

export default async function BudgetPage() {
  const owner = await requireOwnerClerkId();
  let workspace = await loadBudgetWorkspace(owner);

  // Auto-seed from bank statements on first visit (no user action required)
  if (workspace.accounts.length === 0) {
    await seedStatementBudgetAction();
    workspace = await loadBudgetWorkspace(owner);
  }

  return <BudgetClient initialWorkspace={workspace} />;
}
