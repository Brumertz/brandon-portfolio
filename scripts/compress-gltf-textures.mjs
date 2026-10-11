/**
 * Compress GLTF texture atlases in place.
 *
 * glTF 2.0 core only permits `image/jpeg` and `image/png` (WebP needs the
 * EXT_texture_webp extension, which the loader does not declare), so:
 *   - opaque -> JPEG q82
 *   - alpha  -> indexed (palette) PNG
 * Resizes to `maxSize` first; rewrites `uri` + `mimeType` in the .gltf and
 * deletes the originals.
 *
 * Run: node scripts/compress-gltf-textures.mjs <gltfPath> [maxSize]
 */
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const [, , gltfArg, sizeArg, qualityArg] = process.argv;
if (!gltfArg) {
  console.error("usage: node compress-gltf-textures.mjs <scene.gltf> [maxSize] [quality]");
  process.exit(1);
}

const gltfPath = path.resolve(gltfArg);
const maxSize = Number(sizeArg) || 1024;
const quality = Number(qualityArg) || 88;
const baseDir = path.dirname(gltfPath);

const gltf = JSON.parse(fs.readFileSync(gltfPath, "utf8"));
const images = gltf.images ?? [];

let before = 0;
let after = 0;

for (const image of images) {
  if (!image.uri || image.uri.startsWith("data:")) continue;

  const filePath = path.join(baseDir, decodeURIComponent(image.uri));
  if (!fs.existsSync(filePath)) {
    console.warn(`  skip (missing): ${image.uri}`);
    continue;
  }

  const inputSize = fs.statSync(filePath).size;
  before += inputSize;

  const pipeline = sharp(filePath);
  const meta = await pipeline.metadata();

  // Keep the aspect ratio, never upscale.
  const scale = Math.min(1, maxSize / Math.max(meta.width, meta.height));
  const width = Math.round(meta.width * scale);
  const height = Math.round(meta.height * scale);

  const hasAlpha = meta.hasAlpha;
  const ext = hasAlpha ? "png" : "jpg";
  const mimeType = hasAlpha ? "image/png" : "image/jpeg";
  const newPath = filePath.replace(/\.[^.]+$/, `.${ext}`);

  const out = hasAlpha
    ? pipeline.resize(width, height).png({ palette: true, quality: 90, compressionLevel: 9 })
    : pipeline.resize(width, height).jpeg({ quality, mozjpeg: true });

  // `toFile` refuses to overwrite its own input when the extension changes
  // only, but refuses on identical paths — write to a temp then move.
  const tmpPath = `${newPath}.tmp`;
  await out.toFile(tmpPath);
  if (fs.existsSync(newPath) && newPath !== filePath) fs.unlinkSync(newPath);
  fs.renameSync(tmpPath, newPath);

  const outputSize = fs.statSync(newPath).size;
  after += outputSize;

  if (newPath !== filePath) {
    fs.unlinkSync(filePath);
    image.uri = image.uri.replace(/\.[^.]+$/, `.${ext}`);
  }
  image.mimeType = mimeType;

  console.log(
    `  ${path.basename(filePath)} -> ${path.basename(newPath)}  ` +
      `${meta.width}x${meta.height} -> ${width}x${height}  ` +
      `${(inputSize / 1024).toFixed(0)}KB -> ${(outputSize / 1024).toFixed(0)}KB`
  );
}

fs.writeFileSync(gltfPath, JSON.stringify(gltf));
console.log(
  `\n${gltfPath}: ${(before / 1024 / 1024).toFixed(2)}MB -> ${(after / 1024 / 1024).toFixed(2)}MB`
);
