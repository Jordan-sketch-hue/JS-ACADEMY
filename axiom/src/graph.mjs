/**
 * Dependency graph: parses a project and builds a bidirectional map of
 * "who imports whom" so we can answer "if X changes, what else is affected?"
 */

import fs from 'fs';
import path from 'path';

const IMPORT_RE = /(?:import\s+.*?\s+from\s+|require\s*\(\s*)['"]([^'"]+)['"]/g;

function resolveImport(fromFile, importPath, rootDir) {
  if (importPath.startsWith('.')) {
    const dir = path.dirname(fromFile);
    let resolved = path.resolve(dir, importPath);
    for (const ext of ['', '.js', '.mjs', '.ts', '.jsx', '.tsx']) {
      const candidate = resolved + ext;
      if (fs.existsSync(candidate)) return path.relative(rootDir, candidate);
    }
    // could be a directory index
    for (const ext of ['.js', '.mjs', '.ts']) {
      const candidate = path.join(resolved, 'index' + ext);
      if (fs.existsSync(candidate)) return path.relative(rootDir, candidate);
    }
  }
  return null; // external package — not tracked
}

function collectFiles(dir, exts = ['.js', '.mjs', '.ts', '.jsx', '.tsx']) {
  const results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith('.') || entry.name === 'node_modules') continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) results.push(...collectFiles(full, exts));
    else if (exts.includes(path.extname(entry.name))) results.push(full);
  }
  return results;
}

export function buildGraph(rootDir) {
  const files = collectFiles(rootDir);
  // deps[file] = Set of files IT imports
  // dependents[file] = Set of files that import IT
  const deps = {};
  const dependents = {};

  for (const file of files) {
    const rel = path.relative(rootDir, file);
    deps[rel] = deps[rel] || new Set();
    dependents[rel] = dependents[rel] || new Set();
  }

  for (const file of files) {
    const rel = path.relative(rootDir, file);
    const src = fs.readFileSync(file, 'utf8');
    let m;
    IMPORT_RE.lastIndex = 0;
    while ((m = IMPORT_RE.exec(src)) !== null) {
      const target = resolveImport(file, m[1], rootDir);
      if (target) {
        deps[rel] = deps[rel] || new Set();
        deps[rel].add(target);
        dependents[target] = dependents[target] || new Set();
        dependents[target].add(rel);
      }
    }
  }

  return { deps, dependents };
}

/**
 * Returns every file transitively affected if `changedFile` is modified.
 * changedFile must be relative to rootDir.
 */
export function getImpacted(changedFile, dependents) {
  const visited = new Set();
  const queue = [changedFile];
  while (queue.length) {
    const cur = queue.shift();
    if (visited.has(cur)) continue;
    visited.add(cur);
    for (const dep of (dependents[cur] || [])) {
      if (!visited.has(dep)) queue.push(dep);
    }
  }
  visited.delete(changedFile); // the changed file itself isn't "impacted"
  return [...visited];
}
