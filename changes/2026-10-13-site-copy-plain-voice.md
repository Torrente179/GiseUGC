# Site Copy — Plain First-Person Rewrite (ES + EN)

**Status:** Live on main
**Implemented:** 2026-10-13
**Scope:** Every visible string on the site in both languages, the static entry
HTML shells, `public/llms*.txt`, and the build scripts that keep shells in sync.

## Why

The user reported that the copy read as AI-written in English and as a poor
translation in Spanish. They were shown three sample voices (conversational,
professional-direct, warm-personal) on the same three passages and **chose A,
conversational**: Gisela speaking in first person, plain words, Spanish in
neutral Latin American register with *tú*.

## What changed

- **Copy sources rewritten:** `src/locales/{es,en}/translation.json`,
  `src/data/{service,vertical,resource,hub,legal}-pages.ts`,
  `src/lib/service-inner-argument.ts`, `src/data/portfolio-clips.ts`,
  `scripts/nuevos-seo-overrides.json` (English clip titles), plus hardcoded
  labels in components (`ServicesMarquee`, `FAQ`, `NotFound`, etc.).
- **Claims removed:** unsourced stats ("up to 4x more clicks", "highest-converting
  format"), price ranges in the guides, and FAQ answers that contradicted the
  real terms. Facts the copy now states everywhere:
  - delivery 3 to 5 business days after product + confirmed brief;
  - 1 to 2 revision rounds, reshoots quoted separately;
  - organic use included, paid-ads use needs a separate license;
  - English from the client's script, up to 65 words per video;
  - 28+ brands and 9+ years in journalism; page copy never types the Fiverr
    rating or review count, it reads `SITE_PROOF` (4.7/177 today). The two
    `llms*.txt` files state them literally and must be updated with it.
- **Privacy policy correction:** it described an on-site form with "local
  validation". The site has no form (removed 2026-06-14), so the summary item,
  the section 2 note and the retention bullet now say so.
- **`llms-full.txt` / `llms.txt`:** same cleanup, third person (they are written
  for AI systems), aligned to the facts above.
- **Kept from the parallel SEO work** (`643f58a`, `b6b9461`): the exact
  bilingüe / cómo-contratar link anchors in the fashion, tech and wellness
  intros and the services/verticals hub leads, the pinned tech and fashion FAQ
  questions, and one FAQPage per route (the shell scripts strip FAQPage; it
  lives in PageSeo). The 43 OG cards whose H1 changed were re-rendered by
  `npm run build`.
- **Dates:** every `CONTENT_DATES` family, both legal pages' updated/effective
  labels, the sitemap `lastmod`s, home JSON-LD `dateModified` and both `llms`
  `Last-Updated` lines moved to 2026-10-13.

Typography choices made during the rewrite (not set by the user): no em or en
dashes in copy, and ’ for apostrophes in both languages.

## Static shells are generated, not hand-edited

All service, vertical, resource, hub and legal entry HTML now takes its copy
from `src/data/*.ts` through `scripts/lib/load-ts-module.mjs` (esbuild bundles
the data module in memory) and `scripts/lib/entry-html.mjs` (in-place element
rewrites; every helper throws if its element is missing). `prebuild` runs
`service → boot-shells → resource → hub → vertical → legal`; each script is
idempotent. To regenerate by hand without running the video catalog step:

```bash
npm run service:entrypoints && npm run service:boot-shells && npm run resource:entrypoints && npm run hub:entrypoints && npm run vertical:entrypoints && npm run legal:entrypoints
```

What matters for production: prerender replaces `#root`, so only `<head>`
(title, meta, JSON-LD) and anything **outside** `#root` ships. The resource
shells' FAQ `<noscript>` sits outside `#root`, which is why
`sync-resource-entrypoint-meta.mjs` now rebuilds the whole article placeholder
and that `<noscript>` from `resource-pages.ts`. It had been shipping the old
accent-less FAQ, including a "150 to 500 dollars" price.

Inside `#root` (dev-only), the service and vertical side panels now come from
`sectionIntroTitle` / `sectionIntroText` / `deliverablesTitle`; the tagline under
the H1 is dropped because the rendered pages have none. Legal panels use
`tocTitle`, `audienceNote` and the section titles. Still hand-written, and
dev-only: the legal `<noscript>` summaries and the two home shells' `#root`
placeholders. The home noscript FAQ was regenerated once from
`translation.json`, so it will drift if the FAQ changes.

## Verified

- `npm run typecheck`, `npm run lint` (0 errors), `npm test` 254/255 (see below).
- `npm run build` end to end (prebuild, OG cards, prerender of all 46 routes); copy read back from
  `dist/` for home (ES/EN), a service, a vertical, a guide and the privacy page.
- All six sync scripts produce identical output on a second run. They also
  agree with the OG writer: the hub template now includes `og:image:type` and
  `twitter:image:alt`, which the writer otherwise re-added on every build.
- Known unrelated failure: `src/lib/og-image.test.ts` "writes longest-H1
  snapshots" writes to `/opt/cursor/artifacts/screenshots` and fails with
  EACCES outside the environment that wrote it. Its assertions pass.
