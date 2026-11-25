"use client";
import { ModuleBase } from "./ModuleBase";

type Row = { [key: string]: string };

const COLUMNS = [
  { key: "name", label: "Name" },
  { key: "contact", label: "Contact" },
  { key: "email", label: "Email" },
  { key: "category", label: "Category" },
  { key: "status", label: "Status" },];

export function SuppliersModule() {
  return (
    <ModuleBase<Row>
      title="Suppliers"
      columns={COLUMNS}
      rows={[]}
      primaryAction={{ label: "Add", onClick: () => {} }}
      emptyMessage="No Suppliers records yet."
      searchKeys={[COLUMNS[0].key]}
    />
  );
}
