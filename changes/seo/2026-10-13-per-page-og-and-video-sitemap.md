# Per-page OG images + curated video sitemap

**Status:** Current
**Implemented:** 2026-10-13
**Scope:** Build-time OG cards, shared Fiverr proof line, curated video sitemap

## Proof sync

Single source: `src/data/site-proof.ts`.

OG proof line is one build-time switch, `OG_PROOF_LINE_MODE`:

- `exact` (default): `4.7/5 · 177 reseñas en Fiverr` / `4.7/5 · 177 reviews on Fiverr`, interpolated from `SITE_PROOF` and checked before each build
- `none`: `Creadora UGC bilingüe · Fiverr` / `Bilingual UGC creator · Fiverr`

The owner picks the mode. Do not rewrite the strings in the renderer.

**Authority resync:** any change to `fiverrRating` or `fiverrReviewCount` must also trigger a resync of the off-site bios (Fiverr, LinkedIn, and the directories paste pack). Those surfaces are owned by the Authority team.

## OG images

`src/lib/og-image-render.ts` runs during `vite build` (`gisela-seo-artifacts`).

- One 1200×630 JPEG per PAGE_REGISTRY route (48, ES+EN, after the 2026-10-14 pricing guide)
- Filename `/og/<slug>.<content-hash>.jpg`
- Copy: that page’s H1 + the configured proof line
- Fonts: bundled TTF at `public/fonts/og/` (Cormorant Garamond + DM Sans). No network fetch. Glyphs include ñ, accented vowels, ¿, and ·
- Portrait: existing `public/og-image-es-en-20260219.jpg` only
- Layout: font-size step-down from 56px to a 18px minimum, max 3 lines. If an H1 still overflows, the **build fails**
- File size: JPEG, fail the build if any card is over 150 KB
- Fallback shared image is used **only** when a route has no H1. Render errors fail the build
- Tags: absolute `https` `og:image`, `og:image:type=image/jpeg`, `og:image:width/height/alt`, `twitter:card=summary_large_image`, `twitter:image`. Alt is the locale H1
- Brand on the card: Gisela Saldarriaga / Gisela.UGC — never GiseUGC

Manifest: `src/data/og-image-manifest.json`. `PageSeo` and the static shells read it.

## Video sitemap

`public/sitemap-video.xml` is generated from the **curated** homepage VideoObject set:

| clipId | Best page | ES title (from existing JSON-LD) |
| --- | --- | --- |
| 1 | `/` + `/en/` | Resena de Estilo de Vida |
| 2 | `/` + `/en/` | Portavoz de Marca |
| 4 | `/` + `/en/` | Resena de Suplemento de Creatina |
| 7 | `/` + `/en/` | Resena de Servicios IA |

Each distinct clip is listed once per locale, on that best page. Service/vertical proof clips and decorative catalog clips (including id 9) are excluded from the sitemap. VideoObject JSON-LD stays on every page that shows the clip.

Each sitemap entry copies existing fields only:

- `loc` (the page)
- unique `video:thumbnail_loc` (R2 poster, never the OG image)
- `video:title`, `video:description`
- `video:content_loc` (R2 main MP4)
- `video:publication_date` (`uploadDate` from the homepage VideoObject)
- `video:duration` in **seconds** when duration data exists

A selected entry missing a required field fails the build. XML is escaped. Local / non-Vercel builds HEAD every content and thumbnail URL as Googlebot and check `media.giselasaldarriaga.com/robots.txt` for a Googlebot block. **Vercel builds skip that live probe** (`VERCEL=1`) so a missing egress path cannot fail the deploy. Run `npm run seo:check-video-urls` from a networked machine.

`robots.txt` has `Sitemap: …/sitemap-video.xml`. IndexNow still pings `sitemap.xml` locs only — not the video sitemap.

## How to verify

```
npx vitest run src/lib/og-image.test.ts src/lib/video-sitemap.test.tsx
npm run typecheck
npm run build
npm run seo:check-video-urls
```
