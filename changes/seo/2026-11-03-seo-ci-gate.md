# SEO crawl-trust CI gate

**Status:** Current for the sitemap HTML gate  
**Implemented:** 2026-11-03  
**Scope:** Test, GitHub Actions workflow, and this note. No site copy, layout, or schema changes.

## Why this file exists

Two crawl-trust bugs already shipped in prerendered HTML:

1. **Zero-value stats.** `ManifestoChapter` count-up used to leave Googlebot with `0 marcas` / `0%` / empty `.mf-value` in the first HTML snapshot. The numerals now come from `src/data/site-proof.ts` (`28+`, `177`, `4.7`, `ES+EN`) and must be in that snapshot. Homepage hero rail (`.feed-hero__rail-value`) and reel-phone proof chips use the same source.
2. **Duplicate H2s (#29).** Service landings mount both viewport shells. Before `1c553f2`, crawlers saw every section title twice (14 `<h2>` / 7 unique). Desktop keeps the real `<h2>` tags; mobile titles are `<p>`. See `2026-10-19-service-page-duplicate-h2.md`.

Unit tests (`src/data/crawl-trust.test.tsx`, `src/data/service-inner-argument.test.tsx`) render React in Node. They do not fetch the 36 sitemap URLs or the built `dist/` HTML. This gate does.

Architecture pointer: `architecture/08-build-deployment.md` (SEO crawl-trust CI gate).

## What it checks

`e2e/seo-crawl-trust.spec.ts` loads every `<loc>` in the sitemap (36 ES+EN URLs from `public/sitemap.xml` or `dist/sitemap.xml`) and inspects the **raw** response body. Playwright uses `request.get()` only — no `page.goto`, no JS.

| Check | Fail when |
| --- | --- |
| `h1` | Not exactly one `<h1>` |
| `h2` | Any repeated `<h2>` text after whitespace normalisation |
| `stats` | Placeholder or empty proof numerals **in the real stat markup**: `.mf-card` / `.mf-value`, `.feed-hero__rail-item` / `.feed-hero__rail-value` (skips the contact `<button>`), and `.reel-phone__action` chips whose aria-label is a proof line. Patterns: `0 marcas`, `0 vistas`, `0 brands`, `0 views`, `0%`, `0`, `0+`, `0.0`, empty values. A legitimate `(0)` on the Fiverr 2-star bar, or CSS `0%` widths, is out of scope. |
| `faq` | Any FAQPage `Question.name` or `acceptedAnswer.text` missing from visible page text (tags stripped from the answer; whitespace normalised). Inline `<a>` / `<strong>` wrappers are removed without injecting a space, so `creadora UGC.</a>` still matches `creadora UGC.` |
| `aggregateRating` | Any `AggregateRating` whose `ratingValue` / `reviewCount` (and `bestRating` / `worstRating` when present) do not match `SITE_PROOF` / `FIVERR_AGGREGATE_RATING` in `src/data/site-proof.ts` (`4.7` / `177` / `5` / `1`) |
| `hreflang` | Missing self-referencing hreflang, missing reciprocal es/en pair, missing `x-default` (this site uses it; it is the ES URL), hreflang target not in the sitemap or not HTTP 200, or `link[rel=canonical]` ≠ the page's own sitemap URL |
| `giseugc` | The string `GiseUGC` (any case) anywhere in the HTML except `https://github.com/Torrente179/GiseUGC` |

When the gate is pointed at a local preview, public `https://www.giselasaldarriaga.com/...` locs are rewritten to the local origin for fetching and 200 checks. Canonical and hreflang *values* in the HTML stay on the public origin and are compared to the sitemap loc, not to `localhost`.

## How to run it locally

```bash
# Against current production (default if dist/ is not built)
npm ci
npx playwright install --with-deps chromium
npm run test:seo:prod
# or
BASE_URL=https://www.giselasaldarriaga.com npm run test:seo

# Against a local prerender (what CI does on pull_request)
SEO_SKIP_VIDEO_HEAD=1 npm run build
npm run test:seo
```

`npm run test:seo` serves `dist/` with `vite preview` on `127.0.0.1:4173` when that folder exists and `BASE_URL` is unset. `npm test` (Vitest) does **not** run this gate.

On this machine (2026-11-04) the crawl itself was ~2–3s for all 36 URLs. Playwright overhead brought the command to ~4s. A cold local prerender (`SEO_SKIP_VIDEO_HEAD=1 npm run build`) was ~25s. The PR CI job also installs Chromium, so the local job is roughly one to two minutes.

## Workflow

`.github/workflows/seo-gate.yml`

| Event | Local `dist/` crawl | Production crawl |
| --- | --- | --- |
| `pull_request` | Yes (preferred; Vercel previews are behind Deployment Protection) | No |
| `push` to `main` | Yes | Yes (waits for the Vercel production deploy, fail-soft) |
| `workflow_dispatch` | Yes | Yes |

The local job sets `SEO_SKIP_VIDEO_HEAD=1` so the build does not HEAD R2. That live probe stays on `npm run seo:check-video-urls`.

## Pending: Vercel preview bypass

Vercel Deployment Protection blocks unauthenticated preview fetches. The test already sends

- `x-vercel-protection-bypass`
- `x-vercel-set-bypass-cookie: samesitenone`

when `VERCEL_AUTOMATION_BYPASS_SECRET` is set. The workflow job that would point `BASE_URL` at a preview URL is commented in `seo-gate.yml`. **The secret is pending from Juan Pablo.** Do not enable the preview hook until that Actions secret exists.

## If today's site fails

Do not change site code, layout, copy, or schema to make this gate green. List the failures on the PR; fix them in a separate change. Tune a check only after confirming a false positive (for example a legitimate `0` outside the proof markup).
