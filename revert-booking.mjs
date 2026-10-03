import { spawnSync } from "child_process";
import { writeFileSync } from "fs";

const CWD = "C:\\Users\\jader\\J Supreme Tech\\ferguson-law";

// Revert booking/page.tsx too
const r = spawnSync("git", ["show", "8118ebe:src/app/booking/page.tsx"], {
  cwd: CWD, encoding: "utf8", shell: true, timeout: 15000
});
if (r.status !== 0) { console.error("booking/page.tsx git show failed:", r.stderr); process.exit(1); }

writeFileSync(`${CWD}\\src\\app\\booking\\page.tsx`, r.stdout, "utf8");
console.log("✓ booking/page.tsx reverted");

// Print what MATTER_TYPE_LABELS looks like now
const src = r.stdout;
const start = src.indexOf("MATTER_TYPE_LABELS");
const end = src.indexOf("}", start) + 1;
if (start !== -1) console.log("\nMATTER_TYPE_LABELS:\n" + src.slice(start, end + 100).slice(0, 500));
