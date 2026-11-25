"use client";
import { ModuleBase } from "./ModuleBase";

type Row = { [key: string]: string };

const COLUMNS = [
  { key: "eventName", label: "Event" },
  { key: "client", label: "Client" },
  { key: "date", label: "Date" },
  { key: "guests", label: "Guests" },
  { key: "status", label: "Status" },];

export function EventBookingsModule() {
  return (
    <ModuleBase<Row>
      title="Event Bookings"
      columns={COLUMNS}
      rows={[]}
      primaryAction={{ label: "Add", onClick: () => {} }}
      emptyMessage="No Event Bookings records yet."
      searchKeys={[COLUMNS[0].key]}
    />
  );
}
