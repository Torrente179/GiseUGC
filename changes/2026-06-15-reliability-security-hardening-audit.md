# Reliability + security hardening — repo audit follow-up (June 15, 2026)

A non-visual hardening pass. The brief: run a principal-level audit of the repo,
then implement the safe, high-leverage fixes and ship them. No change to what
visitors see — every change is plumbing (tests, CI, types), a safety improvement
(error boundaries), or removal of code that wasn't doing anything.

**Commit:** `5d54ef6` — `chore: reliability + security hardening (audit milestones 0–1)`
(24 files, +3428 / −979). Pushed to `origin/main` → Vercel prod deploy.

---

## Why this happened

The audit graded the repo **C+**: strong production hardening (CSP/HSTS headers,
code-splitting, deferred mounting, SEO) undermined by three things — **zero
automated safety net**, **no error boundaries** (one throw blanked the route),
and a handful of **dead/duplicated code + dependency** issues. The home page had
been rewritten ~5× in a week (see `2026-06-14-home-redesign-arc-overview.md`)
with nothing guarding against regressions.

The full audit document (Repo Map, severity-rated findings, strategy, task plan)
lives in the plan file, not the repo.

---

## What changed (live)

### Milestone 0 — Safety net (there was none)
- **Error boundaries** — new `src/components/ErrorBoundary.tsx` (class). Wraps
  `<AppRoutes>` in `App.tsx` (catch-all) and each deferred/lazy home section in
  `Index.tsx` in `silent` mode (a failed section disappears + logs to Vercel
  Analytics instead of white-screening the page).
- **Vitest + RTL harness** — `vitest.config.ts`, `src/test/setup.ts`. Scripts
  `npm test`, `npm run test:watch`, `npm run typecheck`.
- **53 tests** on the durable core:
  - `src/lib/locale-path.test.ts` — locale resolution, path normalization, every
    route entry resolves + round-trips `es`↔`en`.
  - `src/data/data-integrity.test.ts` — every `featuredExamples.clipId` and
    `relatedServiceIds` reference resolves against the merged clip/service sets.
  - `src/components/ErrorBoundary.test.tsx`.
- **CI** — `.github/workflows/ci.yml` runs typecheck + test + lint on PR/push to
  `main`. Build is excluded (prebuild needs the R2 media manifest; Vercel covers
  prod). Lint started non-blocking, then made **blocking** once clean.

### Security / dependencies
- **react-router-dom 6.27 → 6.30.4** — patches the XSS-via-open-redirect
  advisory (the one runtime-exploitable vuln).
- **vitest → v4** — clears a dev-only "UI server" critical; **typescript-eslint
  realigned** (8.11 → 8.61) after `npm audit fix` bumped eslint to 9.39 and broke
  the linter. The lint gate caught it.
- **Removed unused deps**: `@emailjs/browser`, `@tanstack/react-query`,
  `i18next-http-backend`. Deleted `bun.lockb` (standardize on npm). Removed their
  now-dead `manualChunks` entries in `vite.config.ts`.
- `npm audit`: **8 high + 1 introduced critical → 3 high, 0 critical, 0 moderate.**
  Remaining 3 are non-exploitable in context (`@chenglou/pretext` DoS only bites
  attacker-controlled text; here it animates fixed copy) or dev/build tooling
  needing a major `vite@8` jump — documented, deferred.

### Type safety
- **`strictNullChecks` enabled** in `tsconfig.app.json`. Only one fix needed
  (`SectionReveal.tsx` framer-motion `Variants` typing) — the code was already
  largely null-safe in practice.

### Cleanup
- **Removed the orphaned contact form** (`src/components/Contact.tsx`). It was a
  placebo (`setTimeout` → "message sent" toast, sent nothing) **and was already
  unmounted** — the form was taken off the live page back in `253c98b`; the file
  just lingered. Contact is WhatsApp/Fiverr/Instagram + footer by design.
- **De-duplicated the landing pages** — `useScrollReveal` + `RevealSection` were
  byte-identical in 3 files. Extracted to `src/hooks/use-scroll-reveal.ts` +
  `src/components/motion/RevealSection.tsx`; `ServiceLandingPage`,
  `VerticalLandingPage`, `ResourcePage` now import them. ~120 lines removed, zero
  behavior change.
- Fixed 2 vendored shadcn empty-interface lint errors (`ui/command.tsx`,
  `ui/textarea.tsx`).

### Docs
- Added a **README** (setup, build pipeline, testing/CI, deploy, env). There was
  none — onboarding relied on reading code + the `changes/` logs.

---

## What did NOT change (deferred, with reasons)

| Item | Why deferred |
|------|--------------|
| Decompose `Portfolio.tsx` (1,682 L / 105 hooks) | Gesture physics, daily-bucket shuffle, multi-tier video preload, theater — zero component-test coverage; needs real-device QA. A blind rewrite-to-prod is the wrong risk. |
| Full `Service`/`Vertical` landing-page merge | SEO-critical JSON-LD + mobile/desktop branching; needs SEO-output diffing + visual parity QA. |
| Theater-state / schema-builder extraction | SEO-critical + stateful; belongs with the landing-page merge above. |
| Video-failure telemetry | `AdaptiveVideo`/`LazyVideo` already degrade to the poster image (the "blank player" concern was overstated). Clean terminal-vs-expected error detection is risky in critical playback code — the normal HLS→mp4 fallback fires an *expected* `error` event. |

An honest correction: the audit first flagged the contact form as a **critical**
"losing leads" bug. Closer inspection showed it wasn't live — so the real fix was
deleting dead code, not stopping active lead loss.

---

## Files touched

New: `ErrorBoundary.tsx` (+ test), `motion/RevealSection.tsx`,
`hooks/use-scroll-reveal.ts`, `lib/locale-path.test.ts`,
`data/data-integrity.test.ts`, `test/setup.ts`, `vitest.config.ts`,
`.github/workflows/ci.yml`, `README.md`.
Modified: `App.tsx`, `pages/Index.tsx`, `tsconfig.app.json`, `vite.config.ts`,
`package.json`/`package-lock.json`, the 3 landing pages, `motion/SectionReveal.tsx`,
`ui/command.tsx`, `ui/textarea.tsx`.
Deleted: `src/components/Contact.tsx`, `bun.lockb`.

## Verification

typecheck (strictNullChecks) ✓ · eslint 0 errors ✓ · 53/53 tests ✓ · browser
smoke test of the home + a service landing page (zero console errors) ✓.
