"use strict";
const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");

const SCRIPT_DIR = __dirname;
const SRC =
  process.env.LOGO_SRC ||
  "C:\\Users\\jader\\.cursor\\projects\\empty-window\\assets\\logo.png";
const DEST_IMG =
  process.env.LOGO_DEST_IMG ||
  "C:\\Users\\jader\\J Supreme Tech\\solace-auto-imports\\images\\logo.png";
const DEST_ICO =
  process.env.LOGO_DEST_ICO ||
  "C:\\Users\\jader\\J Supreme Tech\\solace-auto-imports\\favicon.ico";

const RESULT = path.join(SCRIPT_DIR, "logo-copy-result.txt");
const DEPLOY_LOG = path.join(SCRIPT_DIR, "vercel-deploy-out.txt");
const CURL_LOG = path.join(SCRIPT_DIR, "curl-logo-headers.txt");

function appendLines(lines) {
  fs.appendFileSync(RESULT, lines.join("\n") + "\n", "utf8");
}

try {
  fs.mkdirSync(path.dirname(DEST_IMG), { recursive: true });
  fs.copyFileSync(SRC, DEST_IMG);
  fs.copyFileSync(SRC, DEST_ICO);
  const st = fs.statSync(DEST_IMG);
  fs.writeFileSync(RESULT, `OK ${st.size}\n`, "utf8");

  const deploy = spawnSync(
    "npx",
    ["vercel", "--prod", "--yes"],
    {
      cwd: "C:\\Users\\jader\\J Supreme Tech\\solace-auto-imports",
      encoding: "utf8",
      shell: true,
      env: process.env,
      maxBuffer: 10 * 1024 * 1024,
    }
  );
  const deployBody =
    (deploy.stdout || "") +
    (deploy.stderr ? "\n---stderr---\n" + deploy.stderr : "");
  fs.writeFileSync(
    DEPLOY_LOG,
    `exit=${deploy.status ?? deploy.signal}\n${deployBody}`,
    "utf8"
  );

  const curl = spawnSync(
    "curl.exe",
    ["-I", "https://solace-auto-imports.vercel.app/images/logo.png"],
    { encoding: "utf8", shell: false, maxBuffer: 1024 * 1024 }
  );
  fs.writeFileSync(
    CURL_LOG,
    `exit=${curl.status ?? curl.signal}\n${curl.stdout || ""}${curl.stderr || ""}`,
    "utf8"
  );

  appendLines([
    `deploy_exit=${deploy.status ?? deploy.signal}`,
    `curl_exit=${curl.status ?? curl.signal}`,
  ]);
} catch (e) {
  fs.writeFileSync(RESULT, `FAIL ${e.message}\n`, "utf8");
  process.exitCode = 1;
}
