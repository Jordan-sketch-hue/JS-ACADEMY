"use client";
import { ModuleBase } from "./ModuleBase";

type Row = { [key: string]: string };

const COLUMNS = [
  { key: "poNo", label: "PO #" },
  { key: "supplier", label: "Supplier" },
  { key: "amount", label: "Amount" },
  { key: "deliveryDate", label: "Delivery" },
  { key: "status", label: "Status" },];

export function PurchaseOrdersModule() {
  return (
    <ModuleBase<Row>
      title="Purchase Orders"
      columns={COLUMNS}
      rows={[]}
      primaryAction={{ label: "Add", onClick: () => {} }}
      emptyMessage="No Purchase Orders records yet."
      searchKeys={[COLUMNS[0].key]}
    />
  );
}
