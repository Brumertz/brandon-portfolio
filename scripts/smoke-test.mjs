/**
 * Headless smoke test: loads the built site in Edge, records console/page
 * errors, exercises the language toggle, and writes screenshots.
 *
 * Run: node scripts/smoke-test.mjs [baseUrl]
 */
import fs from "node:fs";
import path from "node:path";
import puppeteer from "puppeteer-core";

const BASE = process.argv[2] || "http://localhost:4173/";
const EDGE =
  process.env.EDGE_PATH ||
  [
    "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
    "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
  ].find((p) => fs.existsSync(p));

if (!EDGE) throw new Error("Edge executable not found");

const outDir = path.resolve("smoke-output");
fs.mkdirSync(outDir, { recursive: true });

const browser = await puppeteer.launch({
  executablePath: EDGE,
  headless: true,
  args: [
    "--no-sandbox",
    "--disable-gpu",
    "--use-gl=swiftshader",
    "--enable-unsafe-swiftshader",
    "--window-size=1440,900",
  ],
});

const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });

const errors = [];
const warnings = [];
const mountCosts = [];
let phase = "initial-load";
const note = (msg) => errors.push(`[${phase}] ${msg}`);
page.on("console", (msg) => {
  const text = msg.text();
  if (text.startsWith("[mount-cost]")) mountCosts.push(text.replace("[mount-cost] ", ""));
  else if (msg.type() === "error") note(`console: ${text}`);
  else if (msg.type() === "warning" && /webgl context|CONTEXT_LOST/i.test(text))
    warnings.push(`[${phase}] ${text}`);
});
page.on("pageerror", (err) => note(`pageerror: ${err.message}\n${err.stack || ""}`));
page.on("requestfailed", (req) =>
  errors.push(`requestfailed: ${req.url()} — ${req.failure()?.errorText}`)
);

console.log(`loading ${BASE}`);
await page.goto(BASE, { waitUntil: "domcontentloaded", timeout: 90000 });
await new Promise((r) => setTimeout(r, 9000));

const probe = await page.evaluate(() => ({
  lang: document.documentElement.lang,
  title: document.title,
  rootChildren: document.getElementById("root")?.childElementCount ?? -1,
  sections: [...document.querySelectorAll(".hash-span")].map((s) => s.id),
  headings: [...document.querySelectorAll(".section-head")].map(
    (h) => h.textContent.trim()
  ),
  nav: [...document.querySelectorAll("nav ul a")].map((a) => a.textContent.trim()),
  email: document.body.innerText.includes("brtz.designs@gmail.com"),
  phone: document.body.innerText.includes("+61 406 771 491"),
  location: document.body.innerText.includes("Perth, Australia"),
  github: !!document.querySelector('a[href="https://github.com/Brumertz"]'),
  linkedin: !!document.querySelector(
    'a[href*="linkedin.com/in/brandon-morales-cordoba"]'
  ),
  whatsapp: !!document.querySelector('a[href*="wa.me/61406771491"]'),
  liveLinks: [...document.querySelectorAll('a[href="https://bsindcare.com"]')].length,
  canvases: document.querySelectorAll("canvas").length,
}));

console.log("EN:", JSON.stringify(probe, null, 2));
await page.screenshot({ path: path.join(outDir, "en-desktop.png") });

// Scroll the whole page so deferred sections and lazy canvases mount.
// Recompute the document height each step: mounted sections grow it.
console.log("phase: scrolling");
phase = "scrolling";
let peakCanvases = 0;
const countCanvases = async () => {
  const n = await page.evaluate(() => document.querySelectorAll("canvas").length);
  if (n > peakCanvases) peakCanvases = n;
};
for (let y = 0, i = 0; i < 80; i++, y += 700) {
  const height = await page.evaluate(() => document.body.scrollHeight);
  if (y > height) break;
  await page.evaluate((yy) => window.scrollTo(0, yy), y);
  await new Promise((r) => setTimeout(r, 350));
  await countCanvases();
}
// One final bottom-of-page pass so the last section (footer) is approached.
await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
await new Promise((r) => setTimeout(r, 800));
await countCanvases();

// Sections mount one per scroll step, and the document grows as each lands, so
// keep driving it to the bottom until all six headings exist.
for (let pass = 0; pass < 8; pass++) {
  const n = await page.evaluate(() => document.querySelectorAll(".section-head").length);
  if (n >= 6) break;
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await new Promise((r) => setTimeout(r, 600));
  await countCanvases();
}
await page.evaluate(() => window.scrollTo(0, 0));
// Let lingering canvases release, and keep sampling on the way back.
for (let i = 0; i < 8; i++) {
  await countCanvases();
  await new Promise((r) => setTimeout(r, 400));
}
await new Promise((r) => setTimeout(r, 3000));
phase = "post-scroll";
console.log(`peak live WebGL canvases: ${peakCanvases} (browser cap is 16)`);

const afterScroll = await page.evaluate(() => ({
  canvases: document.querySelectorAll("canvas").length,
  scrollHeight: document.body.scrollHeight,
  headings: [...document.querySelectorAll(".section-head")].map((h) => h.textContent.trim()),
  email: document.body.innerText.includes("brtz.designs@gmail.com"),
  phone: document.body.innerText.includes("+61 406 771 491"),
  location: document.body.innerText.includes("Perth, Australia"),
  github: !!document.querySelector('a[href="https://github.com/Brumertz"]'),
  linkedin: !!document.querySelector(
    'a[href*="linkedin.com/in/brandon-morales-cordoba"]'
  ),
  whatsapp: !!document.querySelector('a[href*="wa.me/61406771491"]'),
  liveLinks: [...document.querySelectorAll('a[href="https://bsindcare.com"]')].length,
}));
console.log("after scroll:", JSON.stringify(afterScroll));

// Language toggle -> ES
phase = "language-toggle";
const toggled = await page.evaluate(() => {
  const btns = [...document.querySelectorAll("nav button")];
  const es = btns.find((b) => b.textContent.trim() === "ES");
  if (!es) return false;
  es.click();
  return true;
});
await new Promise((r) => setTimeout(r, 2500));

const esProbe = await page.evaluate(() => ({
  lang: document.documentElement.lang,
  title: document.title,
  headings: [...document.querySelectorAll(".section-head")].map(
    (h) => h.textContent.trim()
  ),
  nav: [...document.querySelectorAll("nav ul a")].map((a) => a.textContent.trim()),
}));
console.log("ES toggle applied:", toggled);
console.log("ES:", JSON.stringify(esProbe, null, 2));
await page.screenshot({ path: path.join(outDir, "es-desktop.png") });

// Mobile viewport
await page.setViewport({ width: 390, height: 844, isMobile: true });
await new Promise((r) => setTimeout(r, 1500));
await page.screenshot({ path: path.join(outDir, "es-mobile.png") });

// --- assertions: fail the run if any of these regress ----------------------
const failures = [];
const expect = (cond, label) => {
  if (!cond) failures.push(label);
};

expect(probe.rootChildren >= 1, "app did not render into #root");
// Below-fold sections are deferred until they are approached: exactly one (the
// first, which is what makes the document growable) may be present on a cold
// load, and the rest must not.
expect(
  probe.headings.length <= 1,
  `too many sections mounted at load (deferral regressed): ${JSON.stringify(probe.headings)}`
);
expect(
  afterScroll.headings.length === 6,
  `expected 6 section headings after scrolling, got ${afterScroll.headings.length}: ${JSON.stringify(afterScroll.headings)}`
);
expect(afterScroll.email, "business email missing");
expect(afterScroll.phone, "business phone missing");
expect(afterScroll.location, "business location missing");
expect(afterScroll.github, "GitHub link missing");
expect(afterScroll.linkedin, "LinkedIn link missing");
expect(afterScroll.whatsapp, "WhatsApp CTA (wa.me/61406771491) missing");
expect(afterScroll.liveLinks >= 1, "live client-site link missing");
expect(probe.canvases <= 1, `expected <=1 WebGL canvas at load, got ${probe.canvases}`);
expect(peakCanvases <= 16, `peak ${peakCanvases} WebGL canvases exceeds the 16-context cap`);
expect(esProbe.lang === "es", "language toggle did not switch to ES");
expect(
  esProbe.headings.includes("Contacto."),
  `ES headings did not translate: ${JSON.stringify(esProbe.headings)}`
);

await browser.close();

if (failures.length) {
  console.log(`\n--- ${failures.length} FAILED assertion(s) ---`);
  failures.forEach((f) => console.log(`  - ${f}`));
  process.exitCode = 1;
} else {
  console.log("\nall assertions passed");
}

// Aggregate the per-section mount costs reported by <Profiler>.
if (mountCosts.length) {
  const totals = new Map();
  for (const line of mountCosts) {
    const [id, , ms] = line.split(" ");
    totals.set(id, (totals.get(id) || 0) + Number.parseFloat(ms));
  }
  console.log("\n--- section mount cost (real ms, unthrottled) ---");
  [...totals.entries()]
    .sort((a, b) => b[1] - a[1])
    .forEach(([id, ms]) => console.log(`  ${id.padEnd(12)} ${ms.toFixed(1)}ms`));
}

// The pre-existing THREE bounding-sphere warning predates this work (verified
// against pristine assets) and does not affect rendering — allowlist it so
// everything else fails the check.
const KNOWN_BENIGN = [/Computed radius is NaN/];

const uniq = [...new Set(errors)].filter((e) => !KNOWN_BENIGN.some((re) => re.test(e)));
const benign = [...new Set(errors)].length - uniq.length;
if (benign) console.log(`\n(${benign} known-benign warning(s) suppressed)`);
if (uniq.length) {
  console.log(`\n--- ${uniq.length} error(s) ---`);
  uniq.forEach((e) => console.log(e));
  process.exitCode = 1;
} else {
  console.log("\nno unexpected console/page errors");
}
const uniqWarnings = [...new Set(warnings)];
if (uniqWarnings.length) {
  console.log(`--- ${uniqWarnings.length} WebGL context warning(s) ---`);
  uniqWarnings.forEach((w) => console.log(w));
  process.exitCode = 1;
}
