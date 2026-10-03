import { spawnSync } from "child_process";
const CWD = "C:\\Users\\jader\\J Supreme Tech\\ferguson-law";

// Show what a5b8440 actually changed in the booking pages
const r = spawnSync("git", ["show", "a5b8440", "--stat"], {cwd: CWD, encoding: "utf8", shell: true});
console.log("=== STAT ===\n", r.stdout);

const r2 = spawnSync("git", ["log", "--oneline", "8118ebe^..a5b8440^", "--", "src/app/booking/type-select/page.tsx"], {cwd: CWD, encoding: "utf8", shell: true});
console.log("=== commits that touched type-select BEFORE a5b8440 ===\n", r2.stdout || "(none)");

// Check when the 7 new types were first added to type-select
const r3 = spawnSync("git", ["log", "--oneline", "--follow", "--", "src/app/booking/type-select/page.tsx"], {cwd: CWD, encoding: "utf8", shell: true});
console.log("=== All commits touching type-select ===\n", r3.stdout);
