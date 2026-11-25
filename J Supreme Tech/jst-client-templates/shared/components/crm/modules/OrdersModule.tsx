"use client";
import { ModuleBase } from "./ModuleBase";

type Row = { [key: string]: string };

const COLUMNS = [
  { key: "orderId", label: "Order #" },
  { key: "customer", label: "Customer" },
  { key: "items", label: "Items" },
  { key: "total", label: "Total" },
  { key: "status", label: "Status" },];

export function OrdersModule() {
  return (
    <ModuleBase<Row>
      title="Orders"
      columns={COLUMNS}
      rows={[]}
      primaryAction={{ label: "Add", onClick: () => {} }}
      emptyMessage="No Orders records yet."
      searchKeys={[COLUMNS[0].key]}
    />
  );
}
