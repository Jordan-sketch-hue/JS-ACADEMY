"use client";
import { ModuleBase } from "./ModuleBase";

type Row = { [key: string]: string };

const COLUMNS = [
  { key: "guest", label: "Guest" },
  { key: "party", label: "Party" },
  { key: "date", label: "Date" },
  { key: "time", label: "Time" },
  { key: "table", label: "Table" },
  { key: "status", label: "Status" },];

export function ReservationsModule() {
  return (
    <ModuleBase<Row>
      title="Reservations"
      columns={COLUMNS}
      rows={[]}
      primaryAction={{ label: "Add", onClick: () => {} }}
      emptyMessage="No Reservations records yet."
      searchKeys={[COLUMNS[0].key]}
    />
  );
}
