"use client";
import { ModuleBase } from "./ModuleBase";

type Row = { [key: string]: string };

const COLUMNS = [
  { key: "ref", label: "Ref" },
  { key: "customer", label: "Customer" },
  { key: "specs", label: "Specs" },
  { key: "estimatedDate", label: "Est. Date" },
  { key: "status", label: "Status" },];

export function CustomOrdersModule() {
  return (
    <ModuleBase<Row>
      title="Custom Orders"
      columns={COLUMNS}
      rows={[]}
      primaryAction={{ label: "Add", onClick: () => {} }}
      emptyMessage="No Custom Orders records yet."
      searchKeys={[COLUMNS[0].key]}
    />
  );
}
