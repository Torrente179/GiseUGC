# Routine SEO: one vertical H1, YouTube in llms, hire-intent titles

**Status:** Current for this pass  
**Implemented:** 2026-10-13  
**Stacked on:** `ba62143` (plain-voice copy rewrite)

Public brand stays Gisela Saldarriaga / Gisela.UGC. Juan's body copy is
unchanged except the one beauty closing sentence below. Never GiseUGC.

## 1. One H1 on every vertical page (ES and EN)

`VerticalLandingPage.tsx` used to emit two H1s, one per viewport shell:

- mobile overlay `h1.stm-hero-title`
- desktop editorial `h1.st-hero-title`

Crawlers see both shells. The desktop `.st-hero-title` stays the H1. The
mobile overlay is a `<p class="stm-hero-title">` with the same CSS (the
`h1.stm-hero-title` color guard in `templates.css` now targets the class, not
the tag). No `aria-hidden` on the mobile title: on a phone that line is the
visible heading, and the desktop H1 is `display: none`.

Applies to all five verticals × both locales, including beauty.

Verify: `npx vitest run src/data/faq-schema-and-links.test.tsx` — each
vertical × locale has exactly one `<h1 class="st-hero-title">`.

## 2. YouTube on the llms profile lists

`public/llms.txt` and `public/llms-full.txt` Contact and Profiles now include
the same URL as Person `sameAs` on both homepages:

`https://www.youtube.com/@GiselaSaldarriaga`

There is no EN-only llms file. `Last-Updated` stays `2026-10-13` (already
aligned with `CONTENT_DATES.home`).

## 3. Beauty money-page sentence (verbatim)

Appended to beauty `sectionIntroText` only (the “why UGC works in beauty”
paragraph). That field is what moda/tech/lifestyle already use: the mobile
quote below the FAQ and the desktop pullquote. `heroSummary` is a different
sentence and was not touched.

ES, after “Por eso el UGC funciona tan bien en belleza.”:

> Si quieres contratar una [creadora UGC de belleza en español e inglés](/servicios/creadora-ugc-bilingue/), mira primero [cómo contratar una creadora UGC bilingüe](/recursos/como-contratar-creadora-ugc/).

EN, after “That’s why UGC works so well in beauty.”:

> If you want to hire a [bilingual beauty UGC creator](/en/services/bilingual-ugc-creator/), start with [how to hire a bilingual UGC creator](/en/resources/how-to-hire-ugc-creator/).

Anchors differ from moda/tech/lifestyle on purpose. Locked in
`faq-schema-and-links.test.tsx` (`LINKED_VERTICALS` now includes `beauty-ugc`).

## 4. Titles and hub descriptions

`<title>`, `og:title`, `twitter:title`, and WebPage JSON-LD `name` all read
`metaTitle` (shells via the entrypoint sync scripts; React via `PageSeo`).

| Page | Title |
| --- | --- |
| `/servicios/creadora-ugc-bilingue/` | Contrata una creadora UGC bilingüe \| Gisela Saldarriaga |
| `/en/services/bilingual-ugc-creator/` | Hire a bilingual UGC creator (ES+EN) \| Gisela Saldarriaga |
| `/recursos/como-contratar-creadora-ugc/` | Cómo contratar una creadora UGC bilingüe \| Gisela Saldarriaga |
| `/en/resources/how-to-hire-ugc-creator/` | How to hire a bilingual UGC creator \| Gisela Saldarriaga |
| `/servicios/` | Servicios de contenido UGC en español e inglés \| Gisela Saldarriaga |
| `/en/services/` | UGC content services in Spanish and English \| Gisela Saldarriaga |

Hub descriptions (also og/twitter description):

- `/servicios/`: Contrata a tu creadora UGC bilingüe en Medellín. Grabo anuncios, demos, reseñas y videos de portavoz en español e inglés para EE. UU., España y LatAm.
- `/en/services/`: Hire me as your bilingual UGC creator in Medellín. I make ads, demos, reviews, and spokesperson videos in Spanish and English for the US, Spain, and LatAm.

OG JPEGs are hashed from each route’s **H1** (`heroTitle`), not `metaTitle`.
None of the H1s in this pass changed, so the OG manifest was not regenerated.

## 5. Duplicate JSON-LD @ids — skipped

Service and vertical boot shells still ship a head JSON-LD graph (`WebPage`,
`BreadcrumbList`, `Service`) whose `@id`s (`#webpage`, `#breadcrumb`,
`#service`) also appear in the `PageSeo` `data-route-schema` block. Prerender
already strips a second `FAQPage` from the boot graph; the remaining `@id`
overlap is real.

Parsed on `/verticales/ugc-beauty/` (representative):

- PageSeo route graph: unique `@id`s (WebPage, Breadcrumb, Service, FAQPage,
  plus one `@id` per proof `VideoObject`)
- Boot-shell graph: the three `#webpage` / `#breadcrumb` / `#service` ids,
  all of which also exist in PageSeo
- Combined document (what a production crawl of the prerendered HTML sees):
  those three `@id`s appear in two blocks

Not collapsed in this pass. The two graphs are **not** identical: boot
`serviceType` is a fixed English label on some shells, PageSeo uses
`page.navLabel`; PageSeo also carries `audience`, provider `@id`, FAQPage, and
VideoObjects. Dropping either block would change schema content. The existing
FAQPage strip in `scripts/prerender.mjs` stays.

Asserted in `faq-schema-and-links.test.tsx`: each PageSeo graph has unique
`@id`s; the boot graph’s `@id`s are a subset of the route graph.

## 6. IndexNow on `ba62143`

Workflow run [38359465479](https://github.com/Torrente179/GiseUGC/actions/runs/38359465479)
on `main` for `ba621431e90f52676adf1fb9d57c32e08ec1bec5`: **success**
(`completed` / `success`, push, 2026-10-13).

## Files

- `src/components/VerticalLandingPage.tsx`
- `src/styles/templates.css`
- `src/data/vertical-pages.ts`
- `src/data/service-pages.ts`
- `src/data/resource-pages.ts`
- `src/data/hub-pages.ts`
- `public/llms.txt`, `public/llms-full.txt`
- `src/data/faq-schema-and-links.test.tsx`
- `src/data/seo-hardening.test.ts`
- entry HTML regenerated by `service:entrypoints`, `resource:entrypoints`,
  `hub:entrypoints` (titles/descriptions only; vertical copy is in the React
  tree, not the boot H1)

## How to verify

```
npx vitest run src/data/faq-schema-and-links.test.tsx src/data/seo-hardening.test.ts src/data/hub-pages.test.tsx src/data/service-inner-argument.test.tsx
npm run typecheck
npm run lint
```

After deploy, no-JS fetch of each ES `/verticales/ugc-*` (and EN twins) should
contain exactly one `<h1>`. Beauty intros should contain the two hire links.
The six titles and two descriptions above should match `<title>` /
`og:title` / `twitter:title` / `meta name="description"`. `llms.txt` should
list YouTube.
