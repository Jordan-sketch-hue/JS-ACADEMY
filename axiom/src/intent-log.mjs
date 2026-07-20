/**
 * Intent log: records WHAT was asked, WHERE the code lives,
 * and WHAT the expected result was — per file.
 * This is how AXIOM remembers "why does Z exist and what contract does it fulfill."
 */

import fs from 'fs';
import path from 'path';

const LOG_FILE = '.axiom-intent.json';

function logPath(rootDir) {
  return path.join(rootDir, LOG_FILE);
}

function load(rootDir) {
  const lp = logPath(rootDir);
  if (!fs.existsSync(lp)) return {};
  return JSON.parse(fs.readFileSync(lp, 'utf8'));
}

function save(rootDir, data) {
  fs.writeFileSync(logPath(rootDir), JSON.stringify(data, null, 2));
}

/**
 * Record intent for a file.
 * intent: { prompt: string, expectedResult: string, codedBy: string }
 */
export function record(rootDir, relFile, intent) {
  const data = load(rootDir);
  data[relFile] = data[relFile] || [];
  data[relFile].push({ ...intent, ts: Date.now() });
  save(rootDir, data);
}

/**
 * Get the full intent history for a file (newest last).
 */
export function getHistory(rootDir, relFile) {
  const data = load(rootDir);
  return data[relFile] || [];
}

/**
 * Get the latest intent entry for a file.
 */
export function getLatest(rootDir, relFile) {
  const history = getHistory(rootDir, relFile);
  return history[history.length - 1] || null;
}

/**
 * Returns a summary of all tracked files and their latest intents.
 */
export function summary(rootDir) {
  const data = load(rootDir);
  return Object.entries(data).map(([file, entries]) => ({
    file,
    latest: entries[entries.length - 1],
    totalVersions: entries.length,
  }));
}
