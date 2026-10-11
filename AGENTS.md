# AGENTS.md

## Project Overview

Personal 3D portfolio site (single-page app) for Brandon Brumertz / BrtzDesigns.
Front-end only — no backend. React 18 + Vite 6, Three.js scenes via react-three-fiber,
bilingual content (EN/ES) with a hand-rolled i18n layer, contact form via EmailJS.

Performance is the defining concern of this codebase: aggressive lazy mounting,
WebGL context budgeting, and automated QA (smoke test + Lighthouse) are all in
place to keep LCP/CLS at bay. Preserve these mechanisms when editing.

## Commands

```bash
npm run dev        # Vite dev server
npm run build      # production build + check-chunks (always run before pushing)
npm run verify     # build + check-chunks + smoke-test (full QA gate)
npm run lint       # ESLint 9 (flat config)
npm run preview    # serve dist/ on :4173
npm run lighthouse # Lighthouse audit against the preview server
```

- `npm run verify` is the pre-push gate — run it after any change to `App.jsx`,
  `vite.config.js`, or anything under `components/canvas/`.
- The smoke test (`scripts/smoke-test.mjs`) uses `puppeteer-core` against local
  **Edge**; it fails if Edge isn't found at the standard Windows paths.
- `CHUNK_MODE=none|vendor|three-vendor` overrides the chunking strategy
  (default `vendor`). See below.

## Architecture

```
src/
├── App.jsx          # lazy section mounting + scroll sentinel logic
├── components/      # one file per section (Navbar, Hero, About, …)
│   └── canvas/      # Three.js scenes: Computers, Earth, Stars, Ball
├── constants/       # static data (social links, contact info)
├── hooks/           # useInView (IntersectionObserver wrapper)
├── hoc/             # SectionWrapper (animated title + section id)
├── i18n/            # en.js, es.js + LocaleProvider / useLocale
└── utils/           # Framer Motion variants (motion.js)
```

- **Sections mount progressively**: `App.jsx` keeps an ordered `SECTIONS` list
  and mounts one section per scroll step via a sentinel div. Don't switch this
  to eager mounting — it would blow up the initial bundle and LCP.
- **Anchors** (`#about`, `#work`, …) are handled manually: clicking an anchor
  for an unmounted section forces-mounts everything up to it, then smooth-scrolls
  after `settleLayout()` stabilizes the document height.
- **WebGL budget**: browsers cap live contexts at 16. `Stars` and `Earth`
  canvases mount/unmount via `useInView` (with `lingerMs` so a canvas is never
  torn down mid-init). Keep the total number of simultaneous canvases minimal.
- **Hero canvas** mounts only after `document.fonts.ready` + 2 RAFs + 400ms
  (`useMountAfterPaint` in `Hero.jsx`) so the ~1 MB glTF model stays out of
  the LCP window.

## Conventions

- **i18n**: every user-facing string lives in `src/i18n/en.js` and `es.js`.
  Components read them via `useLocale()` → `content`. Never hardcode strings in
  components; add to both locale files. The locale also drives `<html lang>`,
  `document.title` and the meta description.
- **Styling**: Tailwind CSS v4 (utility classes inline) + a few custom classes
  in `src/styles.css` / `src/index.css`. Palette: `#915eff` accent on `#050816`.
- **Comments**: this codebase documents *why*, not *what* — long-form comments
  explaining perf trade-offs are the norm. Match that style; don't strip them.
- **JSX only** (no TypeScript). ESLint has `react/no-unknown-property` off for
  react-three-fiber props and `react/prop-types` off.
- **Chunking**: `vite.config.js` splits `vendor` (React) and `motion`
  (framer-motion) manually. A cyclic chunk graph blanks the page — after
  touching chunks, run `npm run check:chunks`.

## Gotchas

- Deleting or renaming a `SECTIONS` entry in `App.jsx` breaks anchor navigation;
  the `hash` key must match the `id` rendered by `SectionWrapper`.
- `.env` is required for the contact form:
  `VITE_EMAILJS_SERVICE_ID`, `VITE_EMAILJS_TEMPLATE_ID`, `VITE_EMAILJS_PUBLIC_KEY`.
- `dist/`, `smoke-output/` and `lighthouse-output/` are gitignored build/test
  artifacts — never commit them.
- `TEST_RESULTS.md` at the repo root is a historical bug-fix/Lighthouse record;
  keep it intact.
