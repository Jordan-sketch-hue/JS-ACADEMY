import { spawnSync } from "child_process";

const CWD = "C:\\Users\\jader\\J Supreme Tech\\ferguson-law";

function run(args, timeout = 300000) {
  console.log("$", args.join(" "));
  const r = spawnSync(args[0], args.slice(1), { cwd: CWD, encoding: "utf8", shell: true, timeout });
  if (r.stdout) process.stdout.write(r.stdout);
  if (r.stderr) process.stderr.write(r.stderr);
  if (r.status !== 0) { console.error("Exit", r.status); process.exit(1); }
  return r.stdout?.trim() ?? "";
}

// Pull latest
run(["git", "pull", "origin", "main"]);

// Deploy
const deployOut = run(["vercel", "deploy", "--prod", "--scope", "team_OvCeLYYttwt9SMpreFi8Fns5"], 300000);

// Extract deployment URL
const urlMatch = deployOut.match(/https:\/\/[a-z0-9\-\.]+\.vercel\.app/g);
const deployUrl = urlMatch ? urlMatch[urlMatch.length - 1] : null;

if (deployUrl) {
  console.log("\nDeployment URL:", deployUrl);
  run(["vercel", "alias", "set", deployUrl, "ferguson-law.vercel.app", "--scope", "team_OvCeLYYttwt9SMpreFi8Fns5"]);
  console.log("\nAliased to ferguson-law.vercel.app");
} else {
  console.error("Could not parse deployment URL from output");
  process.exit(1);
}
