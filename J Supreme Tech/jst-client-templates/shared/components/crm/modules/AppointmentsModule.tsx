"use client";
import { ModuleBase } from "./ModuleBase";

type Row = { [key: string]: string };

const COLUMNS = [
  { key: "client", label: "Client" },
  { key: "service", label: "Service" },
  { key: "date", label: "Date" },
  { key: "time", label: "Time" },
  { key: "status", label: "Status" },];

export function AppointmentsModule() {
  return (
    <ModuleBase<Row>
      title="Appointments"
      columns={COLUMNS}
      rows={[]}
      primaryAction={{ label: "Add", onClick: () => {} }}
      emptyMessage="No Appointments records yet."
      searchKeys={[COLUMNS[0].key]}
    />
  );
}
