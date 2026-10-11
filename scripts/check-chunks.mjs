/**
 * Post-build guard: parses every JS chunk's static imports and reports
 * circular chunk dependencies (which leave ES module bindings `undefined`
 * at runtime — the "Cannot read properties of undefined" class of bugs),
 * plus entry-weight stats.
 *
 * Run: node scripts/check-chunks.mjs
 */
import fs from "node:fs";
import path from "node:path";

const dir = path.resolve("dist/assets");
const files = fs.readdirSync(dir).filter((f) => f.endsWith(".js"));

/** @type {Map<string, Set<string>>} */
const graph = new Map();
const size = new Map();

for (const f of files) {
  const src = fs.readFileSync(path.join(dir, f), "utf8");
  size.set(f, Buffer.byteLength(src));
  const deps = new Set();
  for (const m of src.matchAll(/(?:^|[^\w$])import[^;]{0,400}?from\s*["']\.\/([^"']+)["']/g)) {
    deps.add(m[1]);
  }
  for (const m of src.matchAll(/(?:^|[^\w$])import\s*["']\.\/([^"']+)["']/g)) {
    deps.add(m[1]);
  }
  graph.set(f, deps);
}

// --- cycle detection (Tarjan SCC) -----------------------------------------
let index = 0;
const idx = new Map();
const low = new Map();
const onStack = new Set();
const stack = [];
const sccs = [];

function strongconnect(v) {
  idx.set(v, index);
  low.set(v, index);
  index += 1;
  stack.push(v);
  onStack.add(v);

  for (const w of graph.get(v) ?? []) {
    if (!graph.has(w)) continue;
    if (!idx.has(w)) {
      strongconnect(w);
      low.set(v, Math.min(low.get(v), low.get(w)));
    } else if (onStack.has(w)) {
      low.set(v, Math.min(low.get(v), idx.get(w)));
    }
  }

  if (low.get(v) === idx.get(v)) {
    const scc = [];
    let w;
    do {
      w = stack.pop();
      onStack.delete(w);
      scc.push(w);
    } while (w !== v);
    if (scc.length > 1) sccs.push(scc);
  }
}

for (const v of graph.keys()) if (!idx.has(v)) strongconnect(v);

if (sccs.length) {
  console.error(`\nFAIL: ${sccs.length} circular chunk dependency group(s):`);
  for (const scc of sccs) console.error(`  - ${scc.join("  <->  ")}`);
  process.exit(1);
}
console.log("chunk graph: acyclic  OK");

// --- entry weight ----------------------------------------------------------
const html = fs.readFileSync(path.resolve("dist/index.html"), "utf8");
const entry = html.match(/src="\/(assets\/[^"]+\.js)"/)?.[1];
if (entry) {
  const seen = new Set();
  let total = 0;
  const walk = (name) => {
    if (seen.has(name) || !graph.has(name)) return;
    seen.add(name);
    total += size.get(name) ?? 0;
    for (const d of graph.get(name)) walk(d);
  };
  walk(path.basename(entry));
  console.log(
    `entry-closure JS: ${(total / 1024).toFixed(0)} KB raw across ${seen.size} chunk(s)`
  );
}
console.log(
  `largest chunks: ${[...size.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([f, s]) => `${f} ${(s / 1024).toFixed(0)}KB`)
    .join(", ")}`
);
