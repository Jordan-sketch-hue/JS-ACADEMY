import { spawnSync } from "child_process";

const CWD = "C:\\Users\\jader\\J Supreme Tech\\ferguson-law";

function run(args) {
  const r = spawnSync(args[0], args.slice(1), { cwd: CWD, encoding: "utf8", shell: true, timeout: 30000 });
  if (r.stdout) process.stdout.write(r.stdout);
  if (r.stderr) process.stderr.write(r.stderr);
  return r.status;
}

run(["git", "add", "AGENT-STATUS.md"]);
run(["git", "commit", "-F", "C:\\Users\\jader\\.claude\\worktrees\\jsupremtech-mobile-hero-audit-6b2684\\status-msg.txt"]);
run(["git", "log", "--oneline", "-7"]);
