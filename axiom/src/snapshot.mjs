/**
 * Copy-on-write protection.
 * When Z must stay unchanged but X changing would touch Z,
 * we freeze a snapshot of Z so the original contract is preserved.
 */

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const SNAPSHOT_DIR_NAME = '.axiom-snapshots';

function snapshotDir(rootDir) {
  return path.join(rootDir, SNAPSHOT_DIR_NAME);
}

function hashFile(filePath) {
  const buf = fs.readFileSync(filePath);
  return crypto.createHash('sha256').update(buf).digest('hex').slice(0, 12);
}

/**
 * Freezes a copy of `file` into the snapshot store.
 * Returns the snapshot path so the caller can reference it.
 */
export function freeze(rootDir, relFile, label = '') {
  const snapDir = snapshotDir(rootDir);
  fs.mkdirSync(snapDir, { recursive: true });

  const srcPath = path.join(rootDir, relFile);
  const hash = hashFile(srcPath);
  const ts = Date.now();
  const safeRel = relFile.replace(/[\\/]/g, '__');
  const snapName = `${safeRel}--${hash}--${ts}${label ? '--' + label : ''}.snap`;
  const snapPath = path.join(snapDir, snapName);

  fs.copyFileSync(srcPath, snapPath);

  // Write a sidecar manifest entry
  const manifest = loadManifest(rootDir);
  manifest.push({ file: relFile, snapshot: snapName, hash, ts, label });
  saveManifest(rootDir, manifest);

  return snapPath;
}

/**
 * Returns all frozen snapshots for a given file, newest first.
 */
export function listFrozen(rootDir, relFile) {
  return loadManifest(rootDir)
    .filter(e => e.file === relFile)
    .sort((a, b) => b.ts - a.ts);
}

/**
 * Restores the latest frozen snapshot of `relFile`.
 */
export function restore(rootDir, relFile) {
  const entries = listFrozen(rootDir, relFile);
  if (!entries.length) throw new Error(`No snapshot found for ${relFile}`);
  const latest = entries[0];
  const snapPath = path.join(snapshotDir(rootDir), latest.snapshot);
  fs.copyFileSync(snapPath, path.join(rootDir, relFile));
  return latest;
}

function manifestPath(rootDir) {
  return path.join(snapshotDir(rootDir), 'manifest.json');
}

function loadManifest(rootDir) {
  const mp = manifestPath(rootDir);
  if (!fs.existsSync(mp)) return [];
  return JSON.parse(fs.readFileSync(mp, 'utf8'));
}

function saveManifest(rootDir, data) {
  fs.writeFileSync(manifestPath(rootDir), JSON.stringify(data, null, 2));
}
