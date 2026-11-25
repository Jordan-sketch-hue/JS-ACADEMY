"use client";
import { ModuleBase } from "./ModuleBase";

type Row = { [key: string]: string };

const COLUMNS = [
  { key: "title", label: "Title" },
  { key: "assignee", label: "Assignee" },
  { key: "priority", label: "Priority" },
  { key: "due", label: "Due" },
  { key: "status", label: "Status" },];

export function TasksModule() {
  return (
    <ModuleBase<Row>
      title="Tasks"
      columns={COLUMNS}
      rows={[]}
      primaryAction={{ label: "Add", onClick: () => {} }}
      emptyMessage="No Tasks records yet."
      searchKeys={[COLUMNS[0].key]}
    />
  );
}
