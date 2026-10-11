#!/usr/bin/env node
/**
 * Preview/verification static server with real content compression.
 *
 * Why this exists instead of `vite preview`:
 *
 *   `vite preview` serves every byte raw. Lighthouse then charges the site for
 *   3 MB of uncompressed transfer and reports `uses-text-compression` as a
 *   899 KB failure — almost all of it `scene.bin` (754 KB) + `scene.gltf`
 *   (145 KB), plus the JS/CSS/font payloads. Every real host (Netlify, Vercel,
 *   Cloudflare, nginx) applies gzip/brotli, so `vite preview` measures a
 *   deployment nobody actually runs.
 *
 *   This server pre-compresses `dist/` at startup and negotiates
 *   `Content-Encoding`, i.e. it behaves like the production host. Treat its
 *   Lighthouse output as the number that matters; still ship the `gzip`/`brotli`
 *   config as an explicit requirement in the deployment README.
 *
 * Usage:
 *   node scripts/serve.mjs [port]        # default 4173, serves ./dist
 *
 * It also sets the caching headers a host would: hashed files under /assets
 * are immutable for a year, everything else revalidates.
 */
import { createServer } from "node:http";
import { createReadStream, watch } from "node:fs";
import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";
import zlib from "node:zlib";
import { promisify } from "node:util";

const gzipAsync = promisify(zlib.gzip);
const brotliAsync = promisify(zlib.brotliCompress);

const ROOT = path.resolve(process.cwd(), "dist");
const PORT = Number(process.argv[2]) || 4173;

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".map": "application/json; charset=utf-8",
  ".webmanifest": "application/manifest+json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".ico": "image/x-icon",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
  ".woff2": "font/woff2",
  ".gltf": "model/gltf+json; charset=utf-8",
  ".bin": "application/octet-stream",
  ".glb": "model/gltf-binary",
};

/** Extensions worth compressing. woff2/webp/png are already compressed. */
const COMPRESSIBLE = new Set([
  ".html",
  ".js",
  ".mjs",
  ".css",
  ".json",
  ".map",
  ".svg",
  ".txt",
  ".xml",
  ".webmanifest",
  ".gltf",
  ".bin",
]);

const walk = async (dir) => {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await walk(full)));
    else out.push(full);
  }
  return out;
};

const makeEntry = async (file) => {
  const ext = path.extname(file).toLowerCase();
  const raw = await readFile(file);
  const info = await stat(file);
  const entry = {
    raw,
    file,
    type: MIME[ext] || "application/octet-stream",
    etag: `"${info.size.toString(16)}-${Math.floor(info.mtimeMs).toString(16)}"`,
    mtime: info.mtimeMs,
  };
  if (COMPRESSIBLE.has(ext) && raw.length > 1024) {
    // Brotli is materially better than gzip on the glTF JSON/BIN pair, which
    // is where most of the remaining bytes live.
    [entry.br, entry.gz] = await Promise.all([
      brotliAsync(raw, {
        params: {
          [zlib.constants.BROTLI_PARAM_QUALITY]: 6,
          [zlib.constants.BROTLI_PARAM_SIZE_HINT]: raw.length,
        },
      }),
      gzipAsync(raw, { level: 9 }),
    ]);
  }
  return entry;
};

/** @type {Map<string, {raw: Buffer, file: string, br?: Buffer, gz?: Buffer, type: string, etag: string, mtime: number}>}
 *  Rebuilt into a fresh map and swapped in only once it is known complete —
 *  clearing first would leave the server with nothing while Vite is still
 *  writing `dist/`. */
let assets = new Map();
let manifestMtime = 0;

const build = async () => {
  const next = new Map();
  const files = await walk(ROOT);
  await Promise.all(
    files.map(async (file) => {
      const key = "/" + path.relative(ROOT, file).split(path.sep).join("/");
      try {
        next.set(key, await makeEntry(file));
      } catch (err) {
        // The file can disappear between readdir and read while Vite is
        // mid-build; skipping it lets the next build pick it up.
        if (err.code !== "ENOENT") throw err;
      }
    })
  );

  const total = [...next.values()].reduce((n, a) => n + a.raw.length, 0);
  const saved = [...next.values()].reduce(
    (n, a) => n + (a.br ? a.raw.length - a.br.length : 0),
    0
  );

  // Vite deletes dist/index.html part-way through a build and fs.watch fires
  // on that intermediate state. A missing manifest means "not finished yet",
  // not "broken": keep serving the previous complete snapshot and let the
  // watcher pick the real build up on its next event.
  try {
    const mtime = (await stat(path.join(ROOT, "index.html"))).mtimeMs;
    assets = next;
    manifestMtime = mtime;
  } catch {
    console.warn("dist/index.html missing — build still in progress, keeping the current snapshot.");
    return false;
  }

  console.log(
    `dist: ${assets.size} files, ${(total / 1024 / 1024).toFixed(2)} MB` +
      (saved ? `, brotli saves ${(saved / 1024 / 1024).toFixed(2)} MB` : "")
  );
  return true;
};

/**
 * Serve a freshly built `dist/` without needing a server restart.
 *
 * Vite rewrites every hashed filename on rebuild, and this server keys its
 * in-memory map by path — so a stale map would serve the previous build under
 * the previous HTML and silently invalidate every measurement taken after it.
 *
 * `fs.watch` normally gets there first; this is the safety net for watchers
 * that do not fire (network drives, editors that replace rather than write).
 * It only ever costs time when a build really has landed, which is exactly
 * when waiting is the correct behaviour.
 */
const refresh = async (pathname) => {
  if (rebuilding) {
    await rebuilding;
    return assets.get(pathname);
  }
  try {
    const mtime = (await stat(path.join(ROOT, "index.html"))).mtimeMs;
    if (mtime !== manifestMtime) {
      await scheduleRebuild();
      return assets.get(pathname);
    }
    const existing = assets.get(pathname);
    if (existing) {
      const info = await stat(existing.file);
      if (info.mtimeMs !== existing.mtime) {
        const entry = await makeEntry(existing.file);
        assets.set(pathname, entry);
        return entry;
      }
      return existing;
    }
  } catch {
    // dist can vanish for a moment mid-rebuild — fall through and serve 404.
  }
  return undefined;
};

const pickEncoding = (entry, accept) => {
  if (!entry.br) return null;
  if (/\bbr\b/.test(accept)) return { enc: "br", body: entry.br };
  if (/\bgzip\b/.test(accept)) return { enc: "gzip", body: entry.gz };
  return null;
};

await build();

// Rebuild in the background instead of inline on the next request.
//
// Checking the manifest mtime inside the request handler is correct but it
// makes the *first* document request after a `npm run build` pay for the whole
// re-read + re-compression of dist/ — a ~200 ms TTFB that lands squarely on the
// Lighthouse server-response-time and FCP scores. Watching for the change lets
// the work happen between the build and the measurement instead.
let rebuilding = null;
let dirty = false;
const scheduleRebuild = () => {
  // Events that land while a rebuild is already running would otherwise be
  // dropped, leaving the server parked on a partial snapshot.
  if (rebuilding) {
    dirty = true;
    return rebuilding;
  }
  rebuilding = (async () => {
    // Debounce: a single Vite build emits a burst of events, and one of them
    // arrives while index.html is absent (see build()).
    await new Promise((r) => setTimeout(r, 150));
    try {
      await build();
    } catch (err) {
      console.warn(`rebuild skipped: ${err.message}`);
    } finally {
      rebuilding = null;
      if (dirty) {
        dirty = false;
        scheduleRebuild();
      }
    }
  })();
  return rebuilding;
};

try {
  watch(ROOT, { recursive: true }, () => {
    scheduleRebuild();
  });
} catch (err) {
  console.warn(`fs.watch unavailable (${err.code || err.message}); falling back to per-request check.`);
}

if (!assets.has("/index.html")) {
  console.error("No dist/index.html — run `npm run build` first.");
  process.exit(1);
}

const server = createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host || "localhost"}`);
  const pathname = decodeURIComponent(url.pathname);

  await refresh(pathname);

  // /some/path -> /some/path/index.html, else SPA fallback for client routes
  const entry =
    assets.get(pathname) ||
    assets.get(pathname.replace(/\/$/, "") + "/index.html") ||
    ((req.method === "GET" || req.method === "HEAD") && !path.extname(pathname)
      ? assets.get("/index.html")
      : undefined);

  if (!entry) {
    res.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
    res.end("404 Not Found");
    return;
  }

  const headers = {
    "content-type": entry.type,
    etag: entry.etag,
    "last-modified": new Date(entry.mtime).toUTCString(),
    // Hashed build assets are safe to pin forever; html must revalidate or a
    // deploy will keep serving the old entry chunk. Fonts are served from
    // /fonts with stable names, so they revalidate too but are allowed to sit
    // in the HTTP cache for a week to avoid a round trip on repeat visits.
    "cache-control": pathname.startsWith("/assets/")
      ? "public, max-age=31536000, immutable"
      : pathname.startsWith("/fonts/")
        ? "public, max-age=604800"
        : "no-cache",
  };

  if (req.headers["if-none-match"] === entry.etag) {
    res.writeHead(304, headers);
    res.end();
    return;
  }

  const picked = pickEncoding(entry, req.headers["accept-encoding"] || "");
  if (picked) {
    headers["content-encoding"] = picked.enc;
    headers["vary"] = "accept-encoding";
    headers["content-length"] = String(picked.body.length);
    res.writeHead(200, headers);
    if (req.method === "HEAD") res.end();
    else res.end(picked.body);
    return;
  }

  headers["content-length"] = String(entry.raw.length);
  res.writeHead(200, headers);
  if (req.method === "HEAD") res.end();
  else createReadStream(entry.file).pipe(res);
});

server.listen(PORT, () => {
  console.log(`preview: http://localhost:${PORT}/`);
});
