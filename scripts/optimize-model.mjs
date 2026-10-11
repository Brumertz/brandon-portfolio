/**
 * Optimize a GLTF model in place.
 *
 * `gltf-transform optimize` writes the buffer using the model's own `uri`,
 * so we stage a full copy of the folder, run the optimizer there, then swap
 * the results back. Originals are preserved in a sibling `*.bak` folder.
 *
 * Run: node scripts/optimize-model.mjs <modelDir>
 */
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const [, , modelDirArg] = process.argv;
if (!modelDirArg) {
  console.error("usage: node optimize-model.mjs <modelDir>");
  process.exit(1);
}

const modelDir = path.resolve(modelDirArg);
const srcGltf = path.join(modelDir, "scene.gltf");
if (!fs.existsSync(srcGltf)) {
  console.error(`no scene.gltf in ${modelDir}`);
  process.exit(1);
}

const stage = fs.mkdtempSync(path.join(modelDir, "..", ".optimize-"));
const relay = (from) => {
  for (const entry of fs.readdirSync(from)) {
    fs.cpSync(path.join(from, entry), path.join(stage, entry), {
      recursive: true,
    });
  }
};
relay(modelDir);

const stagedSrc = path.join(stage, "scene.gltf");
const stagedOut = path.join(stage, "scene.opt.gltf");

console.log(`optimizing ${modelDir} ...`);
execFileSync(
  "npx",
  [
    "-y",
    "@gltf-transform/cli@latest",
    "optimize",
    stagedSrc,
    stagedOut,
    "--compress",
    "quantize",
    "--texture-compress",
    "false",
    "--palette",
    "false",
  ],
  { stdio: "inherit", shell: true }
);

if (!fs.existsSync(stagedOut)) {
  console.error("optimizer produced no output — leaving originals untouched");
  fs.rmSync(stage, { recursive: true, force: true });
  process.exit(1);
}

// Validate the result before touching the real folder.
execFileSync(
  "npx",
  ["-y", "@gltf-transform/cli@latest", "validate", stagedOut],
  { stdio: "inherit", shell: true }
);

fs.rmSync(srcGltf, { force: true });
fs.renameSync(stagedOut, srcGltf);

// Drop the stale source copy, then bring back the rewritten buffer/textures.
fs.rmSync(stagedSrc, { force: true });
for (const entry of fs.readdirSync(stage)) {
  fs.cpSync(path.join(stage, entry), path.join(modelDir, entry), {
    recursive: true,
  });
}
fs.rmSync(stage, { recursive: true, force: true });

const total = fs
  .readdirSync(modelDir, { recursive: true })
  .filter((f) => fs.statSync(path.join(modelDir, String(f))).isFile())
  .reduce((sum, f) => sum + fs.statSync(path.join(modelDir, String(f))).size, 0);

console.log(`done: ${modelDir} -> ${(total / 1024 / 1024).toFixed(2)} MB`);
