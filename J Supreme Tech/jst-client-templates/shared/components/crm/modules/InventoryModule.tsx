"use client";
import { ModuleBase } from "./ModuleBase";

type Row = { [key: string]: string };

const COLUMNS = [
  { key: "name", label: "Name" },
  { key: "sku", label: "SKU" },
  { key: "qty", label: "Qty" },
  { key: "reorderAt", label: "Reorder At" },
  { key: "location", label: "Location" },];

export function InventoryModule() {
  return (
    <ModuleBase<Row>
      title="Inventory"
      columns={COLUMNS}
      rows={[]}
      primaryAction={{ label: "Add", onClick: () => {} }}
      emptyMessage="No Inventory records yet."
      searchKeys={[COLUMNS[0].key]}
    />
  );
}
