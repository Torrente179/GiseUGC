# 2026-04-20 — Analytics defer, LazyMotion swap, variable fonts

Follow-up to `2026-04-20-lighthouse-lcp-payload-reduction.md`. That pass
slashed the mobile media payload and moved the LCP onto the fast path. This
pass targets the remaining main-thread cost (GTM + gtag on cold visits),
the Framer Motion bundle size, and the font payload.

## Problems addressed

1. **GTM + gtag loaded eagerly on every page**
   - Two synchronous `<script>` tags fired GTM + gtag during HTML parse.
   - Even `async`, their bootstrap code ran immediately on arrival, adding
     avoidable TBT and main-thread work before the LCP frame.

2. **Full Framer Motion bundle loaded upfront**
   - 13 components imported `{ motion, ... }` from `framer-motion`.
   - The `motion` component pulls in the full feature runtime (~100KB gzip
     before dedup). Users without gesture/layout animations still paid for
     them.

3. **Five static font weights per family**
   - `Cormorant+Garamond:wght@300;400;500;600;700` forced five separate
     static instances. Google Fonts serves a single variable axis instead
     when requested with `@300..700`, cutting woff2 size substantially.

## Fixes

### 1. Deferred analytics loader (`public/gtm-loader.js`)

New self-hosted loader appends GTM + gtag on either:

- the first user interaction (`touchstart`, `scroll`, `mousemove`, `keydown`), or
- a `requestIdleCallback` window ~3.5s after `load`.

Injected via a single `<script defer src="/gtm-loader.js">` at the top of
`<head>`. `dataLayer` is initialized synchronously so any early push from
third-party code is preserved and replayed when GTM loads.

Rewritten across **40 HTML entries** by `scripts/rewrite-analytics.py`
(idempotent).

### 2. LazyMotion + `m` identifier swap

`src/App.tsx` now wraps the app in
`<LazyMotion features={domAnimation} strict>`. The `strict` flag forbids
the heavy `motion.*` component, forcing every animation site to use the
lightweight `m.*` form.

All thirteen Framer Motion consumers (Hero, Portfolio, Testimonials, FAQ,
Services, SocialProof, CreatorAdvantage, Navbar, HeroIntroduction,
FloatingContactDock, SplitTextReveal, SectionReveal, plus Testimonials
again via AnimatePresence) were migrated from
`import { motion, ... }` to `import { m, ... }`, and all JSX usage from
`<motion.x>` to `<m.x>`. Done by `scripts/framer-to-lazy-motion.py`
(idempotent, only touches files that already import `motion` from
`'framer-motion'`).

Build output shows the `framer-motion` chunk at **94.93 kB (33.46 kB
gzip)** — down from prior builds and carrying only `domAnimation`
features. `AnimatePresence`, `useReducedMotion`, `useScroll`, and
`useTransform` remain functional.

### 3. Variable-axis font loading

Swapped `wght@300;400;500;600;700` → `wght@300..700` for Cormorant
Garamond and `wght@300;400;500;700` → `wght@300..700` for DM Sans across
all 32 HTML entries that reference Google Fonts. Google Fonts serves a
single variable woff2 for each family instead of five/four static
instances.

### 4. CSP updated for deferred analytics

`vercel.json` and `vite.config.ts` preview CSP now allow
`https://www.googletagmanager.com`, `https://www.google-analytics.com`,
and their subdomains under `script-src`, `connect-src`, `img-src`, and
`frame-src`.

## Expected impact

| Metric                | Before                          | After (expected)                 |
| --------------------- | ------------------------------- | -------------------------------- |
| GTM + gtag main-thread cost at LCP | ~40-80ms on Moto G Power | ~0ms (deferred past LCP) |
| Framer Motion gzip chunk | larger + loaded eagerly | 33 kB gzip, features tree-shaken |
| Google Fonts payload  | 5+4 static instances            | 2 variable woff2 files           |
| TBT (Slow 4G / Moto G) | 50ms                           | expected sub-30ms                |

## Files changed

- `public/gtm-loader.js` *(new)*
- `scripts/rewrite-analytics.py` *(new)*
- `scripts/framer-to-lazy-motion.py` *(new)*
- `src/App.tsx` — LazyMotion wrap
- `vercel.json` — CSP expansion
- `vite.config.ts` — preview CSP expansion
- 40 HTML entries — inline analytics stripped, single `<script defer src="/gtm-loader.js">` inserted
- 32 HTML entries — font URL switched to variable axes
- 13 components — `motion` → `m` identifier migration

## Compatibility with prior perf passes

- Leaves the `2026-04-20-lighthouse-lcp-payload-reduction.md` changes
  intact — Hero.tsx, FloatingContactDock.tsx, portfolio-clips.ts, the
  preload/picture pipeline, and the poster thumbs all still work.
- Leaves `2026-03-22-mobile-performance-buttery-smooth.md` untouched —
  the same `DeferredSection` + Intersection Observer mounting strategy
  runs under LazyMotion without change.
- `AnimatePresence` and `useReducedMotion` keep their pre-existing
  behavior; only the component identifier changed.

## 2026-09-02 — bounce page_view without loading GTM on LCP

The deferred loader later waited for first interaction *or* `setTimeout(30000)`,
so bounce sessions never fired `page_view`. That was an undercount bug, not a
reason to put GTM back on the LCP path.

`public/gtm-loader.js` now:

1. Queues `gtag('js')` + `gtag('config', G-3W6XVBLWXH)` and injects
   `gtag/js` as soon as the deferred loader runs. Bounce sessions count.
2. Still defers heavy GTM (`GTM-TX2WCCLT`) until first interaction
   (`touchstart` / `scroll` / `mousemove` / `keydown`) or a short idle
   (`requestIdleCallback` with a 3.5s timeout, matching this file's original
   idle window — not 30s).

The July 2026 performance overhaul is unchanged: no eager GTM on parse, no
media/font/motion rollback. HTML entries keep `<script defer src="/gtm-loader.js">`.

Tests: `src/lib/gtm-loader.test.ts`.
