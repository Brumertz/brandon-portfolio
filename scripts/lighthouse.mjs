/**
 * Lighthouse run against the built site (uses the system Edge binary).
 *
 * Scores are gated so this can be used as a release check:
 *   node scripts/lighthouse.mjs [url] [--no-gate]
 *
 * Targets: Perf >= 80, A11y >= 95, SEO >= 95, Best Practices >= 90.
 */
import fs from "node:fs";
import path from "node:path";

const args = process.argv.slice(2);
const gate = !args.includes("--no-gate");
const url = args.find((a) => !a.startsWith("--")) || "http://localhost:4173/";

const EDGE =
  process.env.EDGE_PATH ||
  [
    "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
    "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
  ].find((p) => fs.existsSync(p));
if (!EDGE) throw new Error("Edge executable not found");

const { default: lighthouse } = await import("lighthouse");
const chrome = await import("chrome-launcher");

// Default to the real GPU: forcing SwiftShader (software WebGL) makes the
// driver burn ~97% of main-thread time in Lighthouse's unattributed "other"
// bucket, which produces numbers no real user will ever see. Pass
// GL_MODE=swiftshader only to compare against a GPU-less environment.
const glMode = process.env.GL_MODE || "hardware";
const chromeFlags =
  glMode === "swiftshader"
    ? ["--headless=new", "--no-sandbox", "--use-gl=swiftshader", "--enable-unsafe-swiftshader"]
    : [
        "--headless=new",
        "--no-sandbox",
        "--enable-gpu",
        "--enable-unsafe-swiftshader",
        "--use-angle=default",
        "--ignore-gpu-blocklist",
      ];

// The launcher has to be kept alive until the report is in hand: discarding it
// after reading `.port` leaves Chrome running with an inherited stdout pipe,
// and the caller then blocks forever waiting for that pipe to close.
const chromeApp = await chrome.launch({ chromePath: EDGE, chromeFlags });
let lhr;
try {
  ({ lhr } = await lighthouse(url, {
    port: chromeApp.port,
    output: "json",
    logLevel: "error",
  }));
} finally {
  // chrome-launcher's kill() has returned void across versions — don't assume a promise.
  try {
    await chromeApp.kill();
  } catch {
    /* best effort */
  }
}

const summary = Object.fromEntries(
  ["performance", "accessibility", "best-practices", "seo"].map((k) => [
    k,
    Math.round((lhr.categories[k]?.score ?? 0) * 100),
  ])
);
const metrics = {
  fcp: lhr.audits["first-contentful-paint"]?.displayValue,
  lcp: lhr.audits["largest-contentful-paint"]?.displayValue,
  tbt: lhr.audits["total-blocking-time"]?.displayValue,
  cls: lhr.audits["cumulative-layout-shift"]?.displayValue,
  si: lhr.audits["speed-index"]?.displayValue,
  totalByteWeight: lhr.audits["total-byte-weight"]?.displayValue,
  mainThread: lhr.audits["mainthread-work-breakdown"]?.displayValue,
  // "other" is where WebGL driver work lands — a huge value here usually
  // means the browser fell back to software rendering (SwiftShader).
  mainThreadOther: lhr.audits["mainthread-work-breakdown"]?.details?.items?.find(
    (i) => i.group === "other"
  )?.duration,
  glMode,
};

console.log(JSON.stringify({ url, summary, metrics }, null, 2));

const outDir = path.resolve("lighthouse-output");
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, "report.json"), JSON.stringify(lhr));

const THRESHOLDS = {
  performance: 80,
  accessibility: 95,
  "best-practices": 90,
  seo: 95,
};

let failed = false;
for (const [k, min] of Object.entries(THRESHOLDS)) {
  if (summary[k] < min) {
    console.error(`FAIL ${k}: ${summary[k]} < ${min}`);
    failed = true;
  }
}
if (gate && failed) process.exit(1);
console.log("lighthouse thresholds: OK");
