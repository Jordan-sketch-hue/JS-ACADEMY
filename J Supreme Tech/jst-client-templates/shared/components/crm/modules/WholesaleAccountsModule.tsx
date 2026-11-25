"use client";
import { ModuleBase } from "./ModuleBase";

type Row = { [key: string]: string };

const COLUMNS = [
  { key: "company", label: "Company" },
  { key: "contact", label: "Contact" },
  { key: "email", label: "Email" },
  { key: "creditLimit", label: "Credit Limit" },
  { key: "status", label: "Status" },];

export function WholesaleAccountsModule() {
  return (
    <ModuleBase<Row>
      title="Wholesale Accounts"
      columns={COLUMNS}
      rows={[]}
      primaryAction={{ label: "Add", onClick: () => {} }}
      emptyMessage="No Wholesale Accounts records yet."
      searchKeys={[COLUMNS[0].key]}
    />
  );
}
