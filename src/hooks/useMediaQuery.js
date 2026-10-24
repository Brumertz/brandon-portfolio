import { useSyncExternalStore } from "react";

/**
 * Reactive `matchMedia(query).matches`.
 *
 * Unlike the one-shot `IS_TOUCH` constant — which is fine for traits that
 * never change within a session (a phone stays a phone) — viewport-derived
 * queries must track window resizing, rotation and DevTools' responsive mode,
 * so the value is subscribed to instead of read once at module load.
 *
 * `getServerSnapshot` returns false: this app is client-rendered only, and
 * the default must match the first client read to avoid a tearing warning.
 */
export default function useMediaQuery(query) {
  return useSyncExternalStore(
    (onChange) => {
      const mediaQuery = window.matchMedia(query);
      mediaQuery.addEventListener("change", onChange);
      return () => mediaQuery.removeEventListener("change", onChange);
    },
    () => window.matchMedia(query).matches,
    () => false
  );
}
