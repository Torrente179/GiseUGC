# GEO copy on bilingual service + how-to-hire pages

**Status:** Current  
**Shipped:** 2026-08-31  
**Stacked on:** crawl-trust branch `cursor/seo-crawl-trust-7421` (PR #4). This pass does not rewrite homepage counters, JSON-LD, `llms.txt`, `llms-full.txt`, sitemap, robots, analytics, or hub routes (`/servicios/`, `/verticales/`, `/recursos/` and EN twins).

## What shipped

Visible, crawlable proof copy on the four live money pages, using the same 28+ / 4.8 / 173 figures PR #4 made the homepage tell. Fiverr is linked as `https://www.fiverr.com/gisela_sm` with no query string. Public brand in this copy is Gisela Saldarriaga / Gisela.UGC.

### Bilingual UGC service pages

Routes:

- `/servicios/creadora-ugc-bilingue/`
- `/en/services/bilingual-ugc-creator/`

Inserts:

1. After “Qué resuelve este servicio” / “What this service solves” (including the markets list), before “Qué puedes pedir” / “What you can request”: the canonical ES/EN fact block, with `gisela_sm` linked to the Fiverr profile.
2. One extra FAQ only:
   - ES: ¿Cómo trabajas el inglés? → guion + tope de 65 palabras por video.
   - EN: How do you work in English? → script + 65-word cap per video.

H1, reels, and existing FAQ answers are unchanged.

### How-to-hire resource pages

Routes:

- `/recursos/como-contratar-creadora-ugc/`
- `/en/resources/how-to-hire-ugc-creator/`

Inserts:

1. In “Dónde encontrar creadoras UGC profesionales” / “Where to find professional UGC creators”, immediately after the Billo/Insense/JoinBrands sentence: Fiverr as a direct verified-review channel, Gisela Saldarriaga as `gisela_sm` (4.8/5, 173).
2. New H2 before the final CTA: “Un perfil que puedes evaluar ahora” / “A profile you can evaluate now”, with the fact block plus a text link to the bilingual service page.

No new resource URLs and no blog post.

## Files

Content source (the four pages):

- `src/data/service-pages.ts` — `bilingual-ugc-creator` ES/EN `geoFact` + English-cap FAQ
- `src/data/resource-pages.ts` — `how-to-hire-ugc-creator` ES/EN Fiverr sentence + profile subsection

Minimum wiring so that copy is visible HTML (not comments) and `gisela_sm` is a real `<a>`:

- `src/components/ServiceLandingPage.tsx` — render optional `geoFact` after the markets list
- `src/components/ResourcePage.tsx` — render `[label](href)` tokens inside article paragraphs
- `src/lib/inline-copy-links.tsx` — shared parser; internal paths use `<Link>`, `https://` uses `<a>`
- `src/styles/templates.css` — underline treatment for those in-body links

## What this did not touch

- Homepage manifesto counters / `AnimatedCounter` / `src/data/site-proof.ts`
- Homepage JSON-LD, `PageSeo` graphs, `CONTENT_DATES`
- `public/llms.txt`, `public/llms-full.txt`, `public/sitemap.xml`, `public/robots.txt`
- Hub routes and architecture/routing
- Production rebuild / prerender. Vercel builds `main`; this lands as source.

## How to verify

1. `npx vitest run src/data/geo-copy.test.tsx src/lib/inline-copy-links.test.ts` — SSR-renders the four pages from source (the same tree `scripts/prerender.mjs` uses) and asserts the fact block, query-free Fiverr href, 65-word FAQ, and hire-guide inserts.
2. Do **not** expect the committed boot-shell HTML to already contain this copy. Those shells are last prerendered snapshots; Vercel’s `vite build` + prerender will bake the new paragraphs on deploy. This pass does not run a production rebuild.
3. After deploy, a no-JS fetch of the four URLs should show the fact block and `href="https://www.fiverr.com/gisela_sm"`.
