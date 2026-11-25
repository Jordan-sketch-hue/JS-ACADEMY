/**
 * ModuleBase — shared scaffold for all 24 CRM modules.
 * Each module renders a header, action bar, and data table using its own column defs.
 */
"use client";

import { useState } from "react";

export interface Column<T> {
  key: keyof T;
  label: string;
  render?: (val: T[keyof T], row: T) => React.ReactNode;
  width?: string;
}

interface Props<T extends Record<string, unknown>> {
  title: string;
  columns: Column<T>[];
  rows: T[];
  primaryAction?: { label: string; onClick: () => void };
  emptyMessage?: string;
  searchKeys?: (keyof T)[];
}

export function ModuleBase<T extends Record<string, unknown>>({
  title,
  columns,
  rows,
  primaryAction,
  emptyMessage = "No records yet.",
  searchKeys = [],
}: Props<T>) {
  const [query, setQuery] = useState("");

  const filtered = query.trim()
    ? rows.filter(row =>
        searchKeys.some(k => String(row[k] ?? "").toLowerCase().includes(query.toLowerCase()))
      )
    : rows;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-base font-bold text-[var(--text-primary)]">{title}</h2>
        <div className="flex items-center gap-3">
          {searchKeys.length > 0 && (
            <input
              type="search"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search…"
              className="w-48 rounded-[var(--radius)] border border-[var(--border)] bg-[var(--bg)] px-3 py-1.5 text-xs text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent)] transition-colors"
            />
          )}
          {primaryAction && (
            <button
              onClick={primaryAction.onClick}
              className="rounded-[var(--radius)] bg-[var(--accent)] px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-white hover:opacity-90 transition-opacity"
            >
              {primaryAction.label}
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-[var(--radius-lg)] border border-[var(--border)] overflow-auto">
        {filtered.length === 0 ? (
          <p className="p-8 text-center text-sm text-[var(--text-muted)]">{emptyMessage}</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="border-b border-[var(--border)] bg-[var(--bg-surface)]">
              <tr>
                {columns.map(col => (
                  <th
                    key={String(col.key)}
                    className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]"
                    style={col.width ? { width: col.width } : undefined}
                  >
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((row, i) => (
                <tr key={i} className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--bg-surface)] transition-colors">
                  {columns.map(col => (
                    <td key={String(col.key)} className="px-4 py-3 text-xs text-[var(--text-primary)]">
                      {col.render ? col.render(row[col.key], row) : String(row[col.key] ?? "—")}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
