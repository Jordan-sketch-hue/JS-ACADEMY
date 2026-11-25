"use client";
import { ModuleBase } from "./ModuleBase";

type Row = { [key: string]: string };

const COLUMNS = [
  { key: "jobNo", label: "Job #" },
  { key: "vehicle", label: "Vehicle" },
  { key: "service", label: "Service" },
  { key: "mechanic", label: "Mechanic" },
  { key: "status", label: "Status" },];

export function JobCardsModule() {
  return (
    <ModuleBase<Row>
      title="Job Cards"
      columns={COLUMNS}
      rows={[]}
      primaryAction={{ label: "Add", onClick: () => {} }}
      emptyMessage="No Job Cards records yet."
      searchKeys={[COLUMNS[0].key]}
    />
  );
}
