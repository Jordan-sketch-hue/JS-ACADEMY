"use client";
import { ModuleBase } from "./ModuleBase";

type Row = { [key: string]: string };

const COLUMNS = [
  { key: "ref", label: "Ref" },
  { key: "client", label: "Client" },
  { key: "amount", label: "Amount" },
  { key: "expiry", label: "Expires" },
  { key: "status", label: "Status" },];

export function QuotesModule() {
  return (
    <ModuleBase<Row>
      title="Quotes"
      columns={COLUMNS}
      rows={[]}
      primaryAction={{ label: "Add", onClick: () => {} }}
      emptyMessage="No Quotes records yet."
      searchKeys={[COLUMNS[0].key]}
    />
  );
}
