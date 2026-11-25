"use client";
import { ModuleBase } from "./ModuleBase";

type Row = { [key: string]: string };

const COLUMNS = [
  { key: "orderId", label: "Order #" },
  { key: "table", label: "Table" },
  { key: "items", label: "Items" },
  { key: "placed", label: "Placed" },
  { key: "status", label: "Status" },];

export function KitchenOrdersModule() {
  return (
    <ModuleBase<Row>
      title="Kitchen Orders"
      columns={COLUMNS}
      rows={[]}
      primaryAction={{ label: "Add", onClick: () => {} }}
      emptyMessage="No Kitchen Orders records yet."
      searchKeys={[COLUMNS[0].key]}
    />
  );
}
