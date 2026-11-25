"use client";
import { ModuleBase } from "./ModuleBase";

type Row = { [key: string]: string };

const COLUMNS = [
  { key: "name", label: "Name" },
  { key: "email", label: "Email" },
  { key: "phone", label: "Phone" },
  { key: "since", label: "Since" },
  { key: "totalSpend", label: "Total Spend" },];

export function CustomersModule() {
  return (
    <ModuleBase<Row>
      title="Customers"
      columns={COLUMNS}
      rows={[]}
      primaryAction={{ label: "Add", onClick: () => {} }}
      emptyMessage="No Customers records yet."
      searchKeys={[COLUMNS[0].key]}
    />
  );
}
