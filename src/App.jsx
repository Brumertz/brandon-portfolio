import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { BrowserRouter } from "react-router-dom";

import ErrorBoundary from "./components/ErrorBoundary";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import useInView from "./hooks/useInView";
import { LocaleProvider } from "./i18n";

const StarsCanvas = lazy(() => import("./components/canvas/Stars"));

/**
 * Mounts the background star field only once the contact area is near the
 * viewport, so the third WebGL context isn't created on initial load.
 */
const DeferredStars = () => {
  const [hostRef, visible] = useInView({ rootMargin: "600px", lingerMs: 800 });

  return (
    <div ref={hostRef} className="absolute inset-0 z-[-1]">
      {visible && (
        <Suspense fallback={<div className="absolute inset-0" />}>
          <StarsCanvas />
        </Suspense>
      )}
    </div>
  );
};

/**
 * Every section below the hero, in document order.
 *
 * Plain dynamic imports rather than `lazy()` + one `<Suspense>`: a shared
 * Suspense boundary resolves all of them together on first load, producing one
 * large main-thread task. Mounting on demand keeps the initial commit down to
 * Navbar + Hero.
 *
 * `hash` is the id the section exposes to anchors (set by `SectionWrapper`, not
 * these `id` keys) — it lets a nav link find *which* section to mount.
 */
const SECTIONS = [
  { id: "about", hash: "about", load: () => import("./components/About") },
  { id: "experience", hash: "work", load: () => import("./components/Experience") },
  { id: "tech", hash: "tech", load: () => import("./components/Tech") },
  { id: "services", hash: "services", load: () => import("./components/Services") },
  { id: "works", hash: "projects", load: () => import("./components/Works") },
  {
    id: "contact",
    hash: "contact",
    load: async () => {
      const [contactMod, footerMod] = await Promise.all([
        import("./components/Contact"),
        import("./components/Footer"),
      ]);
      const ContactComp = contactMod.default;
      const FooterComp = footerMod.default;
      const ContactWithFooter = () => (
        <>
          <ContactComp />
          <FooterComp />
        </>
      );
      return { default: ContactWithFooter };
    },
    boxed: true,
  },
];

/** How far past the bottom of the viewport a section may be and still be
 *  allowed in — 0.5 screens of lead, so the chunk has time to arrive before
 *  its content would scroll into view (and stays well clear of the viewport,
 *  which keeps the insertion shift-free).
 *
 *  It is deliberately > 1 viewport rather than < 1: the hero is exactly
 *  100vh, so a threshold inside the viewport can never be met while the page
 *  is still one screen tall — the browser cannot scroll, the sentinel can
 *  never approach, and nothing would ever mount. A threshold past the fold
 *  means the first evaluate() on load is satisfied by the very first section
 *  (mounting exactly one, since only one step is taken per evaluation), which
 *  is what makes the page growable in the first place. */
const LEAD_VIEWS = 0.5;
const APPROACH_PX = () => window.innerHeight * (1 + LEAD_VIEWS);

const Section = ({ spec }) => {
  const [Comp, setComp] = useState(null);

  useEffect(() => {
    let alive = true;
    spec.load().then(
      (mod) => {
        if (alive) setComp(() => mod.default);
      },
      (err) => console.error(`[sections] failed to load ${spec.id}`, err)
    );
    return () => {
      alive = false;
    };
  }, [spec]);

  // While the chunk is in flight, render an invisible placeholder that keeps
  // the sentinel from jumping upward (which would immediately trigger the next
  // section's mount before the user has scrolled at all).
  if (!Comp)
    return <div style={{ minHeight: "1px", width: "100%" }} aria-hidden="true" />;

  const node = <Comp />;

  if (!spec.boxed) return node;
  return (
    <div className="relative z-0 w-full">
      {node}
      <DeferredStars />
    </div>
  );
};

const nextPaint = () =>
  new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));

/**
 * Waits until the document stops changing height between frames.
 *
 * Mounting a section commits its DOM, its lazy children (three.js canvases,
 * suspending images) and its fonts over several frames. Starting the smooth
 * scroll in that window — which is what happened before — makes Chrome
 * animate against a layout that keeps moving: it coalesces the queued scroll
 * updates, the page advances in two or three visible jumps instead of one
 * pass, and it has to nudge the position again once everything settles.
 *
 * Returning once three consecutive frames report the same height means the
 * animation starts from a stable target. The round budget keeps a pathological
 * case from stalling the navigation.
 */
const settleLayout = async () => {
  let last = document.documentElement?.scrollHeight ?? 0;
  let stable = 0;
  for (let i = 0; i < 20 && stable < 3; i++) {
    await nextPaint();
    const h = document.documentElement.scrollHeight;
    stable = h === last ? stable + 1 : 0;
    last = h;
  }
};

/** Scrolls to `#id` once the section owning it exists, retrying briefly
 *  because a forced mount still has to fetch its chunk first. */
const scrollWhenReady = async (id) => {
  for (let i = 0; i < 80; i++) {
    if (document.getElementById(id)) {
      await settleLayout();
      // Re-query: the commit may have replaced the node we looked at.
      const el = document.getElementById(id);
      if (!el) return false;
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      return true;
    }
    await new Promise((r) => setTimeout(r, 50));
  }
  return false;
};

const Sections = () => {
  const [count, setCount] = useState(0);
  const sentinelRef = useRef(null);
  const remaining = count < SECTIONS.length;

  // Progressively mount on approach, one section per scroll frame.
  //
  // The sentinel sits immediately after the last mounted section, so reading
  // its position is enough: once a section lands, the sentinel is pushed back
  // below the threshold and nothing else can mount until the user scrolls
  // again. Evaluating on scroll only (not on every render) is what makes the
  // one-at-a-time behaviour hold — a section whose chunk is still in flight
  // cannot trigger a cascade.
  useEffect(() => {
    let frame = 0;
    const evaluate = () => {
      frame = 0;
      const node = sentinelRef.current;
      if (!node) return;
      if (node.getBoundingClientRect().top < APPROACH_PX()) {
        setCount((c) => (c < SECTIONS.length ? c + 1 : c));
      }
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(evaluate);
    };

    // Defer the very first evaluation to the next paint so the Hero is
    // committed to the screen before anything below it is mounted.
    // Running it synchronously caused a layout shift on load because React
    // mounted `About` before the browser had rendered the Hero section,
    // producing the visible flash / page cut on initial load.
    frame = requestAnimationFrame(evaluate);

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  // In-page anchors (`#about`, `#work`, …) have nothing to scroll to while
  // their section is unmounted — the native jump would silently do nothing.
  //
  // Mount only the sections *up to* the target, never all of them. Forcing all
  // in grew the document thousands of px in one frame and the smooth scroll
  // then swept across sections whose chunks hadn't arrived (visible stutter).
  // Stopping at the target pins the scroll position instead.
  useEffect(() => {
    const mountThrough = (id) => {
      const index = SECTIONS.findIndex((s) => s.hash === id);
      if (index === -1) return false;
      setCount((c) => Math.max(c, index + 1));
      scrollWhenReady(id);
      return true;
    };

    const onClick = (event) => {
      const anchor = event.target?.closest?.('a[href^="#"]');
      if (!anchor) return;
      const id = anchor.getAttribute("href").slice(1);
      if (!id || document.getElementById(id)) return;
      if (!mountThrough(id)) return;
      event.preventDefault();
    };
    const onHashChange = () => {
      const id = window.location.hash.slice(1);
      if (!id || document.getElementById(id)) return;
      mountThrough(id);
    };

    document.addEventListener("click", onClick);
    window.addEventListener("hashchange", onHashChange);
    if (window.location.hash.slice(1)) onHashChange();
    return () => {
      document.removeEventListener("click", onClick);
      window.removeEventListener("hashchange", onHashChange);
    };
  }, []);

  return (
    <>
      {SECTIONS.slice(0, count).map((spec) => (
        <Section key={spec.id} spec={spec} />
      ))}
      {remaining && <div ref={sentinelRef} className="w-full" aria-hidden="true" />}
    </>
  );
};

const App = () => {
  return (
    <LocaleProvider>
      <BrowserRouter>
        <ErrorBoundary>
          <div className="relative z-0 bg-[#050816] w-full min-h-screen">
            <div className="hero-pattern bg-cover bg-no-repeat bg-center w-full">
              <Navbar />
              <Hero />
            </div>
            <Sections />
          </div>
        </ErrorBoundary>
      </BrowserRouter>
    </LocaleProvider>
  );
};

export default App;
