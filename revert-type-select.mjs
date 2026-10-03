import { spawnSync, execFileSync } from "child_process";
import { writeFileSync } from "fs";

const CWD = "C:\\Users\\jader\\J Supreme Tech\\ferguson-law";
const TARGET = `${CWD}\\src\\app\\booking\\type-select\\page.tsx`;

// Get the original file content from commit 8118ebe (last commit before a5b8440)
const r = spawnSync("git", ["show", "8118ebe:src/app/booking/type-select/page.tsx"], {
  cwd: CWD, encoding: "utf8", shell: true, timeout: 15000
});
if (r.status !== 0) { console.error("git show failed:", r.stderr); process.exit(1); }

const original = r.stdout;
writeFileSync(TARGET, original, "utf8");
console.log("✓ type-select/page.tsx reverted to pre-a5b8440 state");

// Show the MATTER_TYPES in the restored file
const start = original.indexOf("const MATTER_TYPES");
const end = original.indexOf("] as const");
console.log("\nRestored MATTER_TYPES:\n" + original.slice(start, end + 15));
