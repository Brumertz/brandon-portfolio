#!/usr/bin/env node
/**
 * Regenerate the self-hosted Poppins woff2 files in public/fonts.
 *
 * Poppins is vendored rather than pulled from Google Fonts so the browser can
 * start downloading it at HTML-parse time (see the preloads in index.html and
 * the @font-face block in src/index.css). Google serves versioned files —
 * currently /s/poppins/v24/ — so this script pins the version it fetched and
 * prints it: bump VERSION below only after re-running and confirming the CSS
 * in src/index.css still matches the downloaded set.
 *
 * Weights are not hardcoded here on purpose: the script reads them out of the
 * @font-face rules in src/index.css, so adding a weight to that file is the
 * single source of truth. Subsets are limited to latin + latin-ext, which is
 * everything EN/ES needs (U+0000-00FF covers ñ á é í ó ú ü ¿ ¡).
 *
 * Usage:  node scripts/fetch-fonts.mjs
 */
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const OUT_DIR = path.resolve("public/fonts");
const CSS_FILE = path.resolve("src/index.css");
const VERSION = "v24";
// Google only returns woff2 to browsers that advertise woff2 support.
const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36";

const SUBSETS = [
  { id: "latin", range: "U+0000-00FF" },
  { id: "latinext", range: "U+0100-02BA" },
];

// Weights referenced anywhere in the stylesheet — includes non-@font-face uses
// such as `font-weight: 800` on .hero-head, so a missing file gets caught.
const usedWeights = new Set();
const css = await readFile(CSS_FILE, "utf8");
for (const m of css.matchAll(/font-weight:\s*(\d+)/g)) usedWeights.add(Number(m[1]));
for (const m of css.matchAll(/font-weight:\s*(\d{3});[\s\S]{0,200}?url\(\/fonts\/poppins-(\d{3})-/g)) {
  if (Number(m[1]) !== Number(m[2])) {
    console.error(
      `MISMATCH in src/index.css: @font-face declares font-weight ${m[1]} but the file is poppins-${m[2]}-*.woff2`
    );
    process.exitCode = 1;
  }
}

const declared = [...new Set([...css.matchAll(/font-weight:\s*(\d+);\s*\n\s*font-display/g)].map((m) => Number(m[1])))]
  .sort((a, b) => a - b);
if (!declared.length) {
  console.error("No @font-face font-weight declarations found in src/index.css");
  process.exit(1);
}

const missing = [...usedWeights].filter((w) => !declared.includes(w)).sort((a, b) => a - b);
if (missing.length) {
  console.log(
    `note: stylesheet uses weight(s) ${missing.join(", ")} that have no @font-face block ` +
      `(the browser will fall back to the nearest available weight).`
  );
}

await mkdir(OUT_DIR, { recursive: true });

let total = 0;
let downloaded = 0;

for (const weight of declared) {
  const url = `https://fonts.googleapis.com/css2?family=Poppins:wght@${weight}&display=swap`;
  const res = await fetch(url, { headers: { "user-agent": UA } });
  if (!res.ok) throw new Error(`CSS fetch failed for weight ${weight}: ${res.status}`);
  const body = await res.text();

  // Google emits one @font-face block per subset; each block carries its
  // unicode-range right after the src url.
  const blocks = body.match(/@font-face\s*{[^}]+}/g) || [];
  for (const block of blocks) {
    const weightInBlock = Number(block.match(/font-weight:\s*(\d+)/)?.[1]);
    const src = block.match(/url\((\S+?)\)\s*format\('woff2'\)/)?.[1];
    const range = block.match(/unicode-range:\s*([^;]+);/)?.[1] || "";
    if (weightInBlock !== weight || !src) continue;

    const subset = SUBSETS.find((s) => range.includes(s.range));
    if (!subset) continue;

    const name = `poppins-${weight}-${subset.id}.woff2`;
    const file = path.join(OUT_DIR, name);
    const bin = await fetch(src, { headers: { "user-agent": UA } });
    if (!bin.ok) throw new Error(`Font fetch failed ${name}: ${bin.status}`);
    const buf = Buffer.from(await bin.arrayBuffer());
    await writeFile(file, buf);
    total += buf.length;
    downloaded += 1;
    console.log(`  ${name.padEnd(26)} ${(buf.length / 1024).toFixed(1)} KB`);
  }
  // Pace the requests so Google does not throttle a bulk pull.
  await new Promise((r) => setTimeout(r, 150));
}

console.log(
  `\n${downloaded} files, ${(total / 1024).toFixed(1)} KB -> public/fonts (Poppins ${VERSION})`
);
if (downloaded !== declared.length * SUBSETS.length) {
  console.warn(
    `WARNING: expected ${declared.length * SUBSETS.length} files for weights [${declared.join(", ")}], got ${downloaded}.`
  );
  process.exitCode = 1;
}
console.log(
  "Now verify src/index.css @font-face rules and the preloads in index.html still list the same weights."
);
