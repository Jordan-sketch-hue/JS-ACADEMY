"use client";
import { ModuleBase } from "./ModuleBase";

type Row = { [key: string]: string };

const COLUMNS = [
  { key: "trackingNo", label: "Tracking #" },
  { key: "customer", label: "Customer" },
  { key: "address", label: "Address" },
  { key: "scheduled", label: "Scheduled" },
  { key: "status", label: "Status" },];

export function DeliveriesModule() {
  return (
    <ModuleBase<Row>
      title="Deliveries"
      columns={COLUMNS}
      rows={[]}
      primaryAction={{ label: "Add", onClick: () => {} }}
      emptyMessage="No Deliveries records yet."
      searchKeys={[COLUMNS[0].key]}
    />
  );
}
