/**
 * Session-wide WebGL context-budget guard.
 *
 * Browsers cap the number of live WebGL contexts (16 on Chrome, ~8 on iOS
 * Safari) and, when the cap is hit, they kill the OLDEST context — on a phone
 * that is the hero desk, which is exactly the failure the static-sphere
 * fallback in Tech.jsx exists to prevent.
 *
 * The cap cannot be queried: no API exposes it and it differs per browser and
 * per device class. The only signal the browser *does* provide is
 * `webglcontextlost` itself, so this store observes that event (capture phase
 * on `window`, since the event does not bubble) and flips a flag for the rest
 * of the session. Consumers re-render their ball cells as static CSS spheres,
 * which releases ~9 contexts in one step and lets the older, more important
 * one (the hero) restore.
 *
 * Observing is side-effect free: three.js' own `webglcontextlost` handler
 * calls `preventDefault()` on the canvas, so restoration stays possible, and
 * this listener never cancels anything itself.
 */
let exceeded = false;
const listeners = new Set();

const markExceeded = () => {
  if (exceeded) return;
  exceeded = true;
  // Iterate over a copy: a listener may unsubscribe in reaction to the flip.
  [...listeners].forEach((listener) => listener());
};

if (typeof window !== "undefined") {
  // Attached eagerly at module evaluation (this module is imported by the
  // hero chunk), so a loss is recorded even if no ball cell is mounted yet.
  window.addEventListener("webglcontextlost", markExceeded, true);
}

export const subscribeBudget = (listener) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

export const isBudgetExceeded = () => exceeded;
