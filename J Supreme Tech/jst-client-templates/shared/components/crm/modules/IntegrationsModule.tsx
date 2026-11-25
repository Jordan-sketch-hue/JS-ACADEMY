"use client";
import { ModuleBase } from "./ModuleBase";

type Row = { [key: string]: string };

const COLUMNS = [
  { key: "name", label: "Name" },
  { key: "type", label: "Type" },
  { key: "status", label: "Status" },
  { key: "lastSync", label: "Last Sync" },
  { key: "actions", label: "Actions" },];

export function IntegrationsModule() {
  return (
    <ModuleBase<Row>
      title="Integrations"
      columns={COLUMNS}
      rows={[]}
      primaryAction={{ label: "Add", onClick: () => {} }}
      emptyMessage="No Integrations records yet."
      searchKeys={[COLUMNS[0].key]}
    />
  );
}
