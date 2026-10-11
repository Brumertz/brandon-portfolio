import { lazy, Suspense, useEffect, useState } from "react";

import { useLocale } from "../i18n";

const ComputersCanvas = lazy(() => import("./canvas/Computers"));

/**
 * Delays the hero's 3D scene until the hero text has actually been painted.
 *
 * The model is ~1 MB (scene.bin + 43 textures) and is not needed for anything
 * the visitor reads: the greeting, the subtitle and the whole nav are plain
 * DOM. Requesting it immediately put those megabytes inside the window LCP is
 * measured over, where they are treated as render-blocking work competing with
 * the `<h1>` — Lighthouse modelled LCP at 4.1 s purely because of them.
 *
 * The gate is `fonts.ready` (the `<h1>` is now laid out in Poppins, so what
 * paints is the final text rather than a fallback swap) followed by two
 * animation frames (the browser has committed that layout to screen) and a
 * short settle, so the fetch starts comfortably after the LCP paint instead of
 * racing it. Until then the `<Suspense>` fallback renders an empty box exactly
 * as it did while the chunk was in flight.
 */
const MOUNT_AFTER_PAINT_MS = 400;
const useMountAfterPaint = () => {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const afterPaint = () =>
      requestAnimationFrame(() =>
        requestAnimationFrame(() => {
          if (cancelled) return;
          window.setTimeout(() => !cancelled && setReady(true), MOUNT_AFTER_PAINT_MS);
        })
      );

    // `fonts.ready` is the signal that matters: it is what decides whether the
    // LCP element paints in Poppins or in the fallback face.
    if (document.fonts?.ready) document.fonts.ready.then(afterPaint, afterPaint);
    else afterPaint();

    return () => {
      cancelled = true;
    };
  }, []);

  return ready;
};

const Hero = () => {
  const { content } = useLocale();
  const { hero } = content;
  const showCanvas = useMountAfterPaint();

  return (
    <section className="relative w-full h-screen mx-auto">
      <div className="absolute inset-0 top-[90px] max-w-7xl mx-auto flex px-6 sm:px-10 flex-row items-start gap-5">
        <div className="flex flex-col items-center justify-center mt-5">
          <div className="w-5 h-5 rounded-full bg-[#915eff]" />
          <div className="w-1 sm:h-80 h-40 violet-gradient" />
        </div>
        <div className="mt-2">
          <h1 className="hero-head">
            {hero.greeting}{" "}
            <span className="text-[#915eff]">{hero.name}</span>
          </h1>
          <p className="hero-sub mt-2">
            {hero.subtitle[0]} <br className="sm:block hidden" />
            {hero.subtitle[1]}
          </p>
        </div>
      </div>

      <div className="hero-canvas w-full h-full">
        <Suspense fallback={<div className="w-full h-full" />}>
          {showCanvas && <ComputersCanvas />}
        </Suspense>
      </div>

      <div className="absolute xs:bottom-10 bottom-14 w-full flex justify-center items-center">
        <a href="#about" aria-label={hero.scrollHint}>
          <div
            className="w-[35px] h-[64px] rounded-3xl flex justify-center items-start p-2"
            style={{ border: "2px solid var(--color-secondary)" }}
          >
            <div
              className="hero-scroll-dot w-3 h-3 rounded-full mb-1"
              style={{ backgroundColor: "var(--color-secondary)" }}
            />
          </div>
        </a>
      </div>
    </section>
  );
};

export default Hero;
