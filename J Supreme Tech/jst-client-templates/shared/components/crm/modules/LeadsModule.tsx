"use client";
import { ModuleBase } from "./ModuleBase";

type Row = { [key: string]: string };

const COLUMNS = [
  { key: "name", label: "Name" },
  { key: "email", label: "Email" },
  { key: "source", label: "Source" },
  { key: "status", label: "Status" },
  { key: "score", label: "Score" },];

export function LeadsModule() {
  return (
    <ModuleBase<Row>
      title="Leads"
      columns={COLUMNS}
      rows={[]}
      primaryAction={{ label: "Add", onClick: () => {} }}
      emptyMessage="No Leads records yet."
      searchKeys={[COLUMNS[0].key]}
    />
  );
}
