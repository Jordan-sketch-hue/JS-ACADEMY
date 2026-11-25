"use client";
import { ModuleBase } from "./ModuleBase";

type Row = { [key: string]: string };

const COLUMNS = [
  { key: "section", label: "Section" },
  { key: "value", label: "Value" },
  { key: "lastUpdated", label: "Updated" },
  { key: "status", label: "Status" },];

export function BusinessProfileModule() {
  return (
    <ModuleBase<Row>
      title="Business Profile"
      columns={COLUMNS}
      rows={[]}
      primaryAction={{ label: "Add", onClick: () => {} }}
      emptyMessage="No Business Profile records yet."
      searchKeys={[COLUMNS[0].key]}
    />
  );
}
