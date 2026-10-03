import { spawnSync } from "child_process";
import { resolve } from "path";

const CWD = "C:\\Users\\jader\\J Supreme Tech\\ferguson-law";
const MSG = resolve("revert-msg.txt");

function run(args) {
  const r = spawnSync(args[0], args.slice(1), { cwd: CWD, encoding: "utf8", shell: true, timeout: 30000 });
  if (r.stdout) process.stdout.write(r.stdout);
  if (r.stderr) process.stderr.write(r.stderr);
  if (r.status !== 0) { console.error("Failed:", args.join(" ")); process.exit(1); }
  return r;
}

run(["git", "add", "src/app/booking/type-select/page.tsx", "src/app/booking/page.tsx"]);
run(["git", "commit", `-F${MSG}`]);
run(["git", "log", "--oneline", "-7"]);
