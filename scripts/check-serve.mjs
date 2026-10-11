import http from "node:http";
import { readdir } from "node:fs/promises";

const get = (port, pathName, acceptEncoding) =>
  new Promise((resolve) => {
    const req = http.request(
      { host: "localhost", port, path: pathName, method: "GET", headers: { "accept-encoding": acceptEncoding } },
      (res) => {
        let bytes = 0;
        res.on("data", (c) => (bytes += c.length));
        res.on("end", () =>
          resolve(
            `${pathName.padEnd(34)} ${res.statusCode} enc=${String(res.headers["content-encoding"]).padEnd(5)} ` +
              `clen=${String(res.headers["content-length"]).padStart(8)} got=${String(bytes).padStart(8)} ` +
              `cc=${res.headers["cache-control"]}`
          )
        );
      }
    );
    req.on("error", (e) => resolve(`${pathName} ERR ${e.message}`));
    req.end();
  });

const port = Number(process.argv[2]) || 4174;
const assets = await readdir("dist/assets");
const js = assets.find((f) => /^index-.*\.js$/.test(f));
const css = assets.find((f) => f.endsWith(".css"));

console.log(`--- encoding negotiation on :${port} ---`);
for (const p of [
  "/",
  "/desktop_pc/scene.bin",
  "/desktop_pc/scene.gltf",
  "/planet/scene.bin",
  `/assets/${js}`,
  `/assets/${css}`,
  "/fonts/poppins-800-latin.woff2",
  "/about",
  "/logo.svg",
  "/og-image.png",
]) {
  console.log(await get(port, p, "gzip, deflate, br"));
}

console.log("\n--- no compression offered ---");
console.log(await get(port, "/desktop_pc/scene.bin", "identity"));
