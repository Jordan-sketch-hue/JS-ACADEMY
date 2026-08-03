/* ============================================================
   AXIOM · IMPACT ENGINE — knows what it coded, where it lives,
   and what is connected to what.
   Edit X → every part that uses X is flagged as impacted.
   Operator chooses per connected part: change it too, or PROTECT
   it — protection freezes an untouched copy and rewires the
   protected part to the frozen copy, so its behavior stays
   byte-identical while the edit proceeds elsewhere.
   Loaded before app.js; exposes window.AXIOM_IMPACT.
   ============================================================ */

"use strict";

window.AXIOM_IMPACT = (() => {

  const escRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  function findClose(lines, from, re) {
    for (let j = from; j < lines.length; j++) if (re.test(lines[j])) return j;
    return lines.length - 1;
  }

  function findBlockEnd(lines, from) {
    let bal = 0, opened = false;
    for (let j = from; j < lines.length; j++) {
      bal += (lines[j].match(/{/g) || []).length;
      bal -= (lines[j].match(/}/g) || []).length;
      if (bal > 0) opened = true;
      if (opened && bal <= 0) return j;
      if (!opened && j > from) return from; // single-line declaration
    }
    return lines.length - 1;
  }

  /* map the code: every named part, its line range, and its connections */
  function buildCodeMap(code) {
    const lines = code.split("\n");
    const parts = [];
    const seen = new Set();
    const add = (name, start, end) => {
      const key = name + ":" + start;
      if (!seen.has(key)) { seen.add(key); parts.push({ name, start, end }); }
    };

    if (/<!DOCTYPE|<html/i.test(code)) {
      lines.forEach((ln, i) => {
        if (/<style>/i.test(ln)) add("STYLE", i, findClose(lines, i, /<\/style>/i));
        if (/<header[\s>]/i.test(ln)) add("HEADER", i, findClose(lines, i, /<\/header>/i));
        const sec = ln.match(/<section[^>]*>\s*<h2>([^<]+)<\/h2>/i);
        if (sec) add("SECTION:" + sec[1].trim().toUpperCase(), i, findClose(lines, i, /<\/section>/i));
      });
    }
    lines.forEach((ln, i) => {
      const d = ln.match(/^\s*(?:export\s+default\s+)?(?:const|let|var|async\s+function|function)\s+([A-Za-z_$][\w$]{2,})/);
      if (d) add(d[1], i, findBlockEnd(lines, i));
    });

    for (const p of parts) {
      const body = lines.slice(p.start, p.end + 1).join("\n");
      p.uses = parts
        .filter((q) => q !== p && !q.name.includes(":") && new RegExp(`\\b${escRe(q.name)}\\b`).test(body))
        .map((q) => q.name)
        .filter((n) => n !== p.name);
    }
    for (const p of parts) p.usedBy = parts.filter((q) => q.uses.includes(p.name)).map((q) => q.name);
    return { parts, lines };
  }

  function renderMap(code, sel) {
    const el = document.querySelector(sel);
    if (!el) return null;
    if (!code || /^\/\/ generated code appears/.test(code)) { el.textContent = "build something — the map renders here"; return null; }
    const map = buildCodeMap(code);
    el.textContent = map.parts.length
      ? map.parts.map((p) =>
          `${p.name.padEnd(18)} L${String(p.start + 1).padStart(3)}–${p.end + 1}` +
          (p.usedBy.length ? `  ← used by: ${p.usedBy.join(", ")}` : "") +
          (p.uses.length ? `  → uses: ${p.uses.join(", ")}` : "")
        ).join("\n")
      : "no named parts detected in this build";
    return map;
  }

  /* apply an edit to `target`, protecting chosen dependents:
     a FROZEN copy of the original target is inserted and every
     protected dependent is rewired to it — so protected parts
     keep the exact behavior they had before the edit. */
  function applyEdit(map, target, desc, protectNames) {
    const isHTML = /<!DOCTYPE|<html|<section|<header/i.test(map.lines[target.start] || "") || target.name.includes(":") || target.name === "STYLE" || target.name === "HEADER";
    const out = [...map.lines];
    let offset = 0;
    const changed = [];

    if (protectNames.length && !isHTML) {
      const frozenName = `${target.name}_original`;
      const frozen = map.lines
        .slice(target.start, target.end + 1)
        .map((l, idx) => (idx === 0 ? l.replace(new RegExp(`\\b${escRe(target.name)}\\b`), frozenName) : l));
      out.splice(target.start, 0, `// FROZEN copy — keeps ${protectNames.join(", ")} unaffected by this edit`, ...frozen);
      offset = frozen.length + 1;
      for (const depName of protectNames) {
        const dep = map.parts.find((p) => p.name === depName);
        if (!dep) continue;
        const s = dep.start + (dep.start >= target.start ? offset : 0);
        const e = dep.end + (dep.end >= target.start ? offset : 0);
        for (let i = s; i <= e && i < out.length; i++) {
          out[i] = out[i].replace(new RegExp(`\\b${escRe(target.name)}\\b`, "g"), frozenName);
        }
        changed.push(`${depName} → rewired to ${frozenName} (protected, behavior identical)`);
      }
    }

    const markerAt = target.start + offset;
    out.splice(markerAt, 0, isHTML ? `<!-- EDIT HERE: ${desc} -->` : `// EDIT HERE: ${desc}`);
    changed.unshift(`${target.name} → edit marker placed at its location (L${markerAt + 1})`);
    return { code: out.join("\n"), changed };
  }

  return { buildCodeMap, renderMap, applyEdit };
})();
