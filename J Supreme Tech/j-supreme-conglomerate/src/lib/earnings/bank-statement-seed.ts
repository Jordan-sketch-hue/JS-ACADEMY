/**
 * Bank-statement derived income jobs — NCB 874520241 + Scotia 935609
 * Period: Apr 2026 – Jul 2026 (earliest statement to present)
 * All amounts in JMD (native). Self-transfers between accounts excluded.
 */

import type { Job } from "@/lib/earnings/income";

function jid(suffix: string): string {
  return `stmt_${suffix}`;
}

export const BANK_STATEMENT_JOBS: Job[] = [
  /* ── APRIL 2026 ── NCB 874520241 ─────────────────────── */
  {
    id: jid("ncb_apr_deriv"),
    client: "Deriv",
    project: "Trading payouts — April",
    category: "Trading",
    amount: 57642.81,
    currency: "JMD",
    date: "2026-04-30",
    status: "paid",
    incomeGroup: "Other",
    notes: "11 Deriv credit entries across April (NCB statement verified)",
  },
  {
    id: jid("ncb_apr_external"),
    client: "Client Credits",
    project: "CRTR / RTGS inflows — April",
    category: "Tech",
    amount: 105035.19,
    currency: "JMD",
    date: "2026-04-30",
    status: "paid",
    incomeGroup: "Tech",
    notes: "External CRTR/RTGS credits April (total credits 186,178 minus 23,500 Scotia self-transfer, minus 57,642.81 Deriv)",
  },

  /* ── MAY 2026 ── NCB 874520241 ───────────────────────── */
  {
    id: jid("ncb_may_deriv"),
    client: "Deriv",
    project: "Trading payouts — May",
    category: "Trading",
    amount: 22649.41,
    currency: "JMD",
    date: "2026-05-31",
    status: "paid",
    incomeGroup: "Other",
    notes: "Deriv credit entries across May (NCB statement verified)",
  },
  {
    id: jid("ncb_may_janique"),
    client: "Janique Morris",
    project: "Personal transfer — May",
    category: "Other",
    amount: 100000.00,
    currency: "JMD",
    date: "2026-05-31",
    status: "paid",
    incomeGroup: "Other",
    notes: "Single RTGS credit from Janique Morris (NCB May statement)",
  },
  {
    id: jid("ncb_may_external"),
    client: "Client Credits",
    project: "CRTR / RTGS inflows — May",
    category: "Tech",
    amount: 16529.39,
    currency: "JMD",
    date: "2026-05-31",
    status: "paid",
    incomeGroup: "Tech",
    notes: "Remaining external credits May (199,428.80 total minus 60,250 Scotia self-transfers, minus 22,649.41 Deriv, minus 100,000 Janique)",
  },

  /* ── JUNE 2026 ── NCB 874520241 ──────────────────────── */
  {
    id: jid("ncb_jun_deriv"),
    client: "Deriv",
    project: "Trading payouts — June",
    category: "Trading",
    amount: 20318.28,
    currency: "JMD",
    date: "2026-06-30",
    status: "paid",
    incomeGroup: "Other",
    notes: "Deriv credit entries across June (NCB statement verified)",
  },
  {
    id: jid("ncb_jun_external"),
    client: "Client Credits",
    project: "CRTR / RTGS inflows — June",
    category: "Tech",
    amount: 129072.53,
    currency: "JMD",
    date: "2026-06-30",
    status: "paid",
    incomeGroup: "Tech",
    notes: "External CRTR/RTGS credits June (174,390.81 total minus 25,000 Scotia self-transfer, minus 20,318.28 Deriv)",
  },

  /* ── SCOTIA 935609 · Apr 5 – May 5 2026 ──────────────── */
  {
    id: jid("sco_apr_deposits"),
    client: "Client Credits",
    project: "Scotia deposits — Apr 5–May 5",
    category: "Tech",
    amount: 35000.00,
    currency: "JMD",
    date: "2026-04-30",
    status: "paid",
    incomeGroup: "Tech",
    notes: "Net Scotia deposits Apr5–May5 (35,000 total; self-transfers to NCB already deducted on NCB side)",
  },

  /* ── SCOTIA 935609 · May 5 – Jun 5 2026 ──────────────── */
  {
    id: jid("sco_may_mujahid"),
    client: "Mujahid Dawes / DGM Investments",
    project: "Recurring payments — May–Jun",
    category: "Marketing",
    amount: 56000.00,
    currency: "JMD",
    date: "2026-05-31",
    status: "paid",
    incomeGroup: "Marketing",
    notes: "Multiple small recurring payments from Mujahid Dawes (DGM Investments) across May–Jun on Scotia statement",
  },
  {
    id: jid("sco_may_external"),
    client: "Client Credits",
    project: "Scotia external inflows — May 5–Jun 5",
    category: "Tech",
    amount: 113007.67,
    currency: "JMD",
    date: "2026-05-31",
    status: "paid",
    incomeGroup: "Tech",
    notes: "Remaining Scotia deposits May5–Jun5 (274,007.67 total minus ~105,000 NCB self-transfers, minus 56,000 Mujahid)",
  },

  /* ── SCOTIA 935609 · Jun 5 – Jul 5 2026 ──────────────── */
  {
    id: jid("sco_jun_external"),
    client: "Client Credits",
    project: "Scotia external inflows — Jun 5–Jul 5",
    category: "Tech",
    amount: 40001.52,
    currency: "JMD",
    date: "2026-06-30",
    status: "paid",
    incomeGroup: "Tech",
    notes: "Scotia deposits Jun5–Jul5 (65,001.52 total minus 25,000 NCB self-transfer)",
  },
];
