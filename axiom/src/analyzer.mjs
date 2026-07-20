/**
 * Core impact analyzer.
 * Given: the file being changed + the full dependency graph,
 * produces a structured impact report with protection recommendations.
 */

import { getImpacted } from './graph.mjs';
import { getLatest } from './intent-log.mjs';
import { listFrozen } from './snapshot.mjs';
import path from 'path';

export function analyze({ changedFile, rootDir, dependents, intentData }) {
  const impacted = getImpacted(changedFile, dependents);

  const items = impacted.map(file => {
    const intent = getLatest(rootDir, file);
    const frozen = listFrozen(rootDir, file);
    return {
      file,
      hasIntent: !!intent,
      prompt: intent?.prompt || null,
      expectedResult: intent?.expectedResult || null,
      alreadyFrozen: frozen.length > 0,
      frozenCount: frozen.length,
      // risk: HIGH if it has a recorded contract, MEDIUM otherwise
      risk: intent ? 'HIGH' : 'MEDIUM',
    };
  });

  return {
    changedFile,
    impactedCount: items.length,
    items,
    // Files with a recorded expected-result contract are "protected candidates"
    protectionCandidates: items.filter(i => i.risk === 'HIGH').map(i => i.file),
  };
}

export function formatReport(report) {
  const lines = [];
  lines.push(`\n━━━ AXIOM IMPACT ANALYSIS ━━━`);
  lines.push(`Changing: ${report.changedFile}`);
  lines.push(`Affected files: ${report.impactedCount}`);

  if (!report.impactedCount) {
    lines.push(`✓ No downstream dependencies detected. Safe to edit.`);
    return lines.join('\n');
  }

  lines.push('');
  for (const item of report.items) {
    const risk = item.risk === 'HIGH' ? '⚠ HIGH RISK' : '• MEDIUM';
    lines.push(`  ${risk}  →  ${item.file}`);
    if (item.prompt) lines.push(`         Asked for: "${item.prompt}"`);
    if (item.expectedResult) lines.push(`         Expected:  "${item.expectedResult}"`);
    if (item.alreadyFrozen) lines.push(`         (snapshot exists — ${item.frozenCount} frozen copy(s))`);
  }

  if (report.protectionCandidates.length) {
    lines.push('');
    lines.push(`  ┌─ Protection candidates (have recorded contracts):`);
    for (const f of report.protectionCandidates) {
      lines.push(`  │   ${f}`);
    }
    lines.push(`  └─ Run: axiom protect <file> to freeze a copy-on-write snapshot.`);
  }

  lines.push(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  return lines.join('\n');
}
