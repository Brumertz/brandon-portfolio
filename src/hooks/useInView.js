import { useEffect, useRef, useState } from "react";

/**
 * Tracks whether an element is near the viewport, with optional *linger*.
 *
 * `inView` stays true for `lingerMs` after the element leaves the viewport.
 * That delay is not cosmetic — it exists because tearing a react-three-fiber
 * `<Canvas>` down while it is still initialising throws:
 *
 *   r3f's `onCreated` does `events.connect(rootRef.current)` with no null
 *   guard, and React can detach the container ref before the passive effect
 *   that calls it has run. The result is
 *   "Cannot read properties of null (reading 'addEventListener')".
 *
 * React only replays that effect within a frame or two of mount, so waiting
 * ~800ms after an element has been out of view makes the race unreachable in
 * practice instead of merely unlikely.
 *
 * @param {object} [options]
 * @param {string} [options.rootMargin="200px"]  How early to count as "in view".
 * @param {number} [options.lingerMs=0]          Keep `inView` true after leaving.
 * @returns {[React.RefObject<HTMLElement>, boolean]}
 */
export default function useInView({ rootMargin = "200px", lingerMs = 0 } = {}) {
  const ref = useRef(null);
  const [intersecting, setIntersecting] = useState(false);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;

    // No IntersectionObserver (very old browsers): treat as visible so the
    // content still renders instead of leaving a placeholder forever.
    if (typeof IntersectionObserver === "undefined") {
      setIntersecting(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          setIntersecting(entry.isIntersecting);
        }
      },
      { rootMargin }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [rootMargin]);

  useEffect(() => {
    if (intersecting) {
      setInView(true);
      return undefined;
    }
    if (!inView) return undefined;
    const timer = setTimeout(() => setInView(false), lingerMs);
    return () => clearTimeout(timer);
  }, [intersecting, inView, lingerMs]);

  return [ref, inView];
}
