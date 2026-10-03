import { spawnSync } from "child_process";
const CWD = "C:\\Users\\jader\\J Supreme Tech\\ferguson-law";
const r = spawnSync("npx", ["tsc", "--noEmit"], { cwd: CWD, encoding: "utf8", shell: true, timeout: 120000 });
if (r.stdout) process.stdout.write(r.stdout);
if (r.stderr) process.stderr.write(r.stderr);
console.log("Exit:", r.status);
