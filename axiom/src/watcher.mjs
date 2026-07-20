/**
 * File watcher: detects real edits, triggers impact analysis automatically,
 * then prompts the user: "Change Z too?" or "Protect Z?" before letting the
 * edit propagate downstream.
 */

import fs from 'fs';
import path from 'path';
import readline from 'readline';
import { buildGraph } from './graph.mjs';
import { analyze, formatReport } from './analyzer.mjs';
import { freeze } from './snapshot.mjs';

function ask(rl, question) {
  return new Promise(resolve => rl.question(question, resolve));
}

export async function watch(rootDir) {
  console.log(`\nAXIOM watching: ${rootDir}`);
  console.log('Any file save → impact report + protection prompt.\n');

  let { deps, dependents } = buildGraph(rootDir);

  // Rebuild graph every 30s to catch new files
  setInterval(() => {
    try { ({ deps, dependents } = buildGraph(rootDir)); } catch {}
  }, 30_000);

  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  const debounce = new Map();

  fs.watch(rootDir, { recursive: true }, async (event, filename) => {
    if (!filename) return;
    const rel = filename.replace(/\\/g, '/');
    if (rel.startsWith('.axiom') || rel.includes('node_modules')) return;

    clearTimeout(debounce.get(rel));
    debounce.set(rel, setTimeout(async () => {
      const report = analyze({ changedFile: rel, rootDir, dependents });
      if (!report.impactedCount) return;

      console.log(formatReport(report));

      for (const candidate of report.protectionCandidates) {
        const answer = await ask(rl,
          `\n  Z="${candidate}" has a recorded contract. Protect it (freeze copy)? [y/n/skip]: `
        );
        const a = answer.trim().toLowerCase();
        if (a === 'y') {
          const snapPath = freeze(rootDir, candidate, 'auto-protect');
          console.log(`  ✓ Frozen: ${path.relative(rootDir, snapPath)}`);
        } else if (a === 'skip') {
          console.log(`  Skipped all remaining candidates.`);
          break;
        } else {
          console.log(`  Z unchanged — no snapshot created.`);
        }
      }
    }, 300));
  });
}
