"use client";
import { ModuleBase } from "./ModuleBase";

type Row = { [key: string]: string };

const COLUMNS = [
  { key: "title", label: "Title" },
  { key: "type", label: "Type" },
  { key: "period", label: "Period" },
  { key: "createdAt", label: "Created" },
  { key: "status", label: "Status" },];

export function ReportsModule() {
  return (
    <ModuleBase<Row>
      title="Reports"
      columns={COLUMNS}
      rows={[]}
      primaryAction={{ label: "Add", onClick: () => {} }}
      emptyMessage="No Reports records yet."
      searchKeys={[COLUMNS[0].key]}
    />
  );
}
