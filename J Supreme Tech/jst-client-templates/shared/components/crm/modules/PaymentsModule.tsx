"use client";
import { ModuleBase } from "./ModuleBase";

type Row = { [key: string]: string };

const COLUMNS = [
  { key: "ref", label: "Ref" },
  { key: "customer", label: "Customer" },
  { key: "amount", label: "Amount" },
  { key: "method", label: "Method" },
  { key: "date", label: "Date" },
  { key: "status", label: "Status" },];

export function PaymentsModule() {
  return (
    <ModuleBase<Row>
      title="Payments"
      columns={COLUMNS}
      rows={[]}
      primaryAction={{ label: "Add", onClick: () => {} }}
      emptyMessage="No Payments records yet."
      searchKeys={[COLUMNS[0].key]}
    />
  );
}
