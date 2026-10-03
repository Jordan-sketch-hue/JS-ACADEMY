import { spawnSync } from "child_process";

const CWD = "C:\\Users\\jader\\J Supreme Tech\\ferguson-law";

// Get the file content BEFORE commit a5b8440 (the parent of that commit)
const r = spawnSync("git", ["show", "a5b8440^:src/app/booking/type-select/page.tsx"], {
  cwd: CWD, encoding: "utf8", shell: true, timeout: 15000
});
if (r.status !== 0) {
  console.error("git show failed:", r.stderr);
  // Try the commit before a5b8440
  const r2 = spawnSync("git", ["log", "--oneline", "-15"], {cwd: CWD, encoding: "utf8", shell: true});
  console.log("Log:\n", r2.stdout);
  process.exit(1);
}
// Print just the MATTER_TYPES array
const src = r.stdout;
const start = src.indexOf("const MATTER_TYPES");
const end = src.indexOf("] as const");
console.log(src.slice(start, end + 20));
