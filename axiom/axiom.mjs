#!/usr/bin/env node
/**
 * AXIOM — Dependency Impact Analysis CLI
 *
 * Commands:
 *   axiom scan [dir]              — build + print the dependency graph
 *   axiom impact <file> [dir]     — show what's affected if <file> changes
 *   axiom record <file> [dir]     — record intent (prompt + expected result) for a file
 *   axiom protect <file> [dir]    — freeze a copy-on-write snapshot of a file
 *   axiom restore <file> [dir]    — restore latest snapshot of a file
 *   axiom history <file> [dir]    — show intent history for a file
 *   axiom summary [dir]           — list all tracked files and their intents
 *   axiom watch [dir]             — live watch: auto-analyze on every save
 */

import path from 'path';
import readline from 'readline';
import { buildGraph } from './src/graph.mjs';
import { analyze, formatReport } from './src/analyzer.mjs';
import { freeze, restore, listFrozen } from './src/snapshot.mjs';
import { record, getHistory, summary } from './src/intent-log.mjs';
import { watch } from './src/watcher.mjs';

const [,, cmd, ...rest] = process.argv;
const rootDir = path.resolve(rest[1] || rest[0]?.startsWith('.') ? rest[1] || '.' : rest[0] || '.');

function rl() {
  return readline.createInterface({ input: process.stdin, output: process.stdout });
}
function ask(iface, q) {
  return new Promise(r => iface.question(q, r));
}

async function main() {
  switch (cmd) {
    case 'scan': {
      const { deps, dependents } = buildGraph(rootDir);
      console.log('\n── Dependencies (imports) ──');
      for (const [file, set] of Object.entries(deps)) {
        if (set.size) console.log(`  ${file}\n    → ${[...set].join('\n    → ')}`);
      }
      console.log('\n── Dependents (imported by) ──');
      for (const [file, set] of Object.entries(dependents)) {
        if (set.size) console.log(`  ${file}\n    ← ${[...set].join('\n    ← ')}`);
      }
      break;
    }

    case 'impact': {
      const file = rest[0];
      if (!file) { console.error('Usage: axiom impact <file> [dir]'); process.exit(1); }
      const { dependents } = buildGraph(rootDir);
      const report = analyze({ changedFile: file, rootDir, dependents });
      console.log(formatReport(report));
      break;
    }

    case 'record': {
      const file = rest[0];
      if (!file) { console.error('Usage: axiom record <file> [dir]'); process.exit(1); }
      const iface = rl();
      const prompt = await ask(iface, 'What was asked / the prompt? ');
      const expectedResult = await ask(iface, 'What is the expected result this code produces? ');
      iface.close();
      record(rootDir, file, { prompt, expectedResult, codedBy: 'user' });
      console.log(`✓ Intent recorded for ${file}`);
      break;
    }

    case 'protect': {
      const file = rest[0];
      if (!file) { console.error('Usage: axiom protect <file> [dir]'); process.exit(1); }
      const snapPath = freeze(rootDir, file, 'manual');
      console.log(`✓ Frozen snapshot: ${snapPath}`);
      break;
    }

    case 'restore': {
      const file = rest[0];
      if (!file) { console.error('Usage: axiom restore <file> [dir]'); process.exit(1); }
      const entry = restore(rootDir, file);
      console.log(`✓ Restored ${file} from snapshot taken at ${new Date(entry.ts).toISOString()}`);
      break;
    }

    case 'history': {
      const file = rest[0];
      if (!file) { console.error('Usage: axiom history <file> [dir]'); process.exit(1); }
      const history = getHistory(rootDir, file);
      if (!history.length) { console.log('No intent history recorded.'); break; }
      for (const entry of history) {
        console.log(`\n[${new Date(entry.ts).toISOString()}]`);
        console.log(`  Asked: ${entry.prompt}`);
        console.log(`  Expected: ${entry.expectedResult}`);
      }
      break;
    }

    case 'summary': {
      const items = summary(rootDir);
      if (!items.length) { console.log('No intent records found.'); break; }
      console.log('\n── Tracked files ──');
      for (const { file, latest, totalVersions } of items) {
        console.log(`\n  ${file}  (${totalVersions} version(s))`);
        console.log(`    Last asked:    ${latest.prompt}`);
        console.log(`    Last expected: ${latest.expectedResult}`);
      }
      break;
    }

    case 'watch': {
      await watch(rootDir);
      break; // runs forever
    }

    default:
      console.log(`
AXIOM — Dependency Impact Analysis

  axiom scan [dir]             print full dependency graph
  axiom impact <file> [dir]    show impact of editing a file
  axiom record <file> [dir]    record intent (prompt + expected result)
  axiom protect <file> [dir]   freeze copy-on-write snapshot
  axiom restore <file> [dir]   restore latest frozen snapshot
  axiom history <file> [dir]   show intent history
  axiom summary [dir]          list all tracked files
  axiom watch [dir]            live watch + auto impact warnings
      `);
  }
}

main().catch(e => { console.error(e.message); process.exit(1); });
