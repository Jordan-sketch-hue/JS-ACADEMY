import { spawnSync } from "child_process";
import { resolve } from "path";
const CWD = "C:\\Users\\jader\\J Supreme Tech\\ferguson-law";
const MSG = resolve("wf-commit-msg.txt");

function run(args) {
  const r = spawnSync(args[0], args.slice(1), { cwd: CWD, encoding: "utf8", shell: true, timeout: 60000 });
  if (r.stdout) process.stdout.write(r.stdout);
  if (r.stderr) process.stderr.write(r.stderr);
  if (r.status !== 0) { console.error("Failed:", args.join(" ")); process.exit(1); }
  return r;
}

run(["git", "add", "src/components/admin/AdminDashboard.tsx"]);
run(["git", "commit", `-F${MSG}`]);
run(["git", "log", "--oneline", "-5"]);
