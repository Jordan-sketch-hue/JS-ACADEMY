"use client";
import { ModuleBase } from "./ModuleBase";

type Row = { [key: string]: string };

const COLUMNS = [
  { key: "jobNo", label: "Job #" },
  { key: "product", label: "Product" },
  { key: "qty", label: "Qty" },
  { key: "startDate", label: "Start Date" },
  { key: "status", label: "Status" },];

export function ProductionJobsModule() {
  return (
    <ModuleBase<Row>
      title="Production Jobs"
      columns={COLUMNS}
      rows={[]}
      primaryAction={{ label: "Add", onClick: () => {} }}
      emptyMessage="No Production Jobs records yet."
      searchKeys={[COLUMNS[0].key]}
    />
  );
}
