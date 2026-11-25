"use client";
import { ModuleBase } from "./ModuleBase";

type Row = { [key: string]: string };

const COLUMNS = [
  { key: "serial", label: "Serial" },
  { key: "product", label: "Product" },
  { key: "customer", label: "Customer" },
  { key: "expiry", label: "Expires" },
  { key: "status", label: "Status" },];

export function WarrantiesModule() {
  return (
    <ModuleBase<Row>
      title="Warranties"
      columns={COLUMNS}
      rows={[]}
      primaryAction={{ label: "Add", onClick: () => {} }}
      emptyMessage="No Warranties records yet."
      searchKeys={[COLUMNS[0].key]}
    />
  );
}
