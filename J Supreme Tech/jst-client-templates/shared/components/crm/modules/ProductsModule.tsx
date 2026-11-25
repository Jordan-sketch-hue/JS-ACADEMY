"use client";
import { ModuleBase } from "./ModuleBase";

type Row = { [key: string]: string };

const COLUMNS = [
  { key: "name", label: "Name" },
  { key: "sku", label: "SKU" },
  { key: "price", label: "Price" },
  { key: "stock", label: "Stock" },
  { key: "category", label: "Category" },];

export function ProductsModule() {
  return (
    <ModuleBase<Row>
      title="Products"
      columns={COLUMNS}
      rows={[]}
      primaryAction={{ label: "Add", onClick: () => {} }}
      emptyMessage="No Products records yet."
      searchKeys={[COLUMNS[0].key]}
    />
  );
}
