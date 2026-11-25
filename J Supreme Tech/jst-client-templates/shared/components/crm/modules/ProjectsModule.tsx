"use client";
import { ModuleBase } from "./ModuleBase";

type Row = { [key: string]: string };

const COLUMNS = [
  { key: "name", label: "Name" },
  { key: "client", label: "Client" },
  { key: "startDate", label: "Start" },
  { key: "deadline", label: "Deadline" },
  { key: "status", label: "Status" },];

export function ProjectsModule() {
  return (
    <ModuleBase<Row>
      title="Projects"
      columns={COLUMNS}
      rows={[]}
      primaryAction={{ label: "Add", onClick: () => {} }}
      emptyMessage="No Projects records yet."
      searchKeys={[COLUMNS[0].key]}
    />
  );
}
