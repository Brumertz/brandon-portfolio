import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// Manual-chunk strategy. Anything beyond `vendor`/`motion` risks a circular
// chunk graph: manualChunks bypasses Rollup's cycle-avoidance, and a cycle
// leaves the React namespace `undefined` at runtime (blank page). Always run
// `npm run check:chunks` after changing this.
//   none | vendor | three-vendor   (default: vendor — verified acyclic)
const MODE = process.env.CHUNK_MODE || "vendor";

const VENDOR =
  /node_modules\/(react|react-dom|scheduler|react-router|react-router-dom|react-is)\//;

/** react + everything three.js/react-three needs, in one eager-safe chunk. */
function manualChunks(id) {
  if (MODE === "none") return undefined;

  if (MODE === "vendor") {
    if (VENDOR.test(id)) return "vendor";
    if (id.includes("node_modules/framer-motion/")) return "motion";
    return undefined;
  }

  // three-vendor: keep the react runtime eagerly cached, push the whole
  // three.js stack (which must not be split away from it) into one chunk.
  if (VENDOR.test(id)) return "vendor";
  if (
    id.includes("node_modules/three/") ||
    id.includes("node_modules/three-stdlib/") ||
    id.includes("node_modules/@react-three/") ||
    id.includes("node_modules/@react-spring/") ||
    id.includes("node_modules/@use-gesture/") ||
    id.includes("node_modules/zustand/") ||
    id.includes("node_modules/meshoptimizer/") ||
    id.includes("node_modules/maath/")
  ) {
    return "three-stack";
  }
  if (id.includes("node_modules/framer-motion/")) return "motion";
  return undefined;
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    chunkSizeWarningLimit: 1000, // three.js alone is ~690 kB minified (177 kB gzip)
    rollupOptions: MODE === "none" ? {} : { output: { manualChunks } },
  },
});
