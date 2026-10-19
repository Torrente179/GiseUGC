# Guide answer blocks and homepage FAQ links

**Status:** Current
**Implemented:** 2026-10-19
**Scope:** Direct-answer paragraphs on the four hire/pricing guide pages; homepage FAQ sentences that point at those guides; schema/visible parity for those answers

Public brand stays Gisela Saldarriaga / Gisela.UGC. Never GiseUGC. No facts invented.

## 1. Answer blocks on the four guide pages

Pages:

- `/recursos/como-contratar-creadora-ugc/`
- `/en/resources/how-to-hire-ugc-creator/`
- `/recursos/cuanto-cobra-creadora-ugc/`
- `/en/resources/how-much-does-a-ugc-creator-charge/`

Each block is one paragraph **directly under the H1, above the existing lead**. The lead is unchanged except for the pricing-guide trim in section B below. There is still exactly one H1.

Copy is the 2026-10-19 Landing Content spec, with numerals interpolated from the live constants:

| Figure | Source |
|---|---|
| `$40`, `$120`, `$25`, `$75`, `$20` | `FIVERR_PRICING` in `src/data/resource-pages.ts` (`ugc.basic`, `ugc.premium`, `spokesperson.words65`, `spokesperson.words260`, `voiceover`) |
| `4.7` / `177` | `SITE_PROOF.fiverrRating` / `SITE_PROOF.fiverrReviewCount` in `src/data/site-proof.ts` (same source as `FIVERR_AGGREGATE_RATING`) |

`GUIDE_ANSWER_BLOCKS` in `resource-pages.ts` is the string source. `getResourcePageContent` injects `answerBlock` for those two resource ids. `ResourcePage` renders it as `<p class="gd-answer">`. The resource entrypoint sync writes the same paragraph into the boot shells so it is in the prerendered HTML, not client-only.

**Not in schema.** The blocks are body copy only. They are not added to FAQPage or any other JSON-LD. Resource FAQPage still mirrors the page FAQ word for word via `visibleInlineCopy`.

## 2. Homepage FAQ links (`/` and `/en/`, `#faq`)

The rest of each answer is unchanged. One (process) or two (cost) sentences are appended from `src/data/homepage-faq.ts`, which reads the existing `faq.items` in `src/locales/*/translation.json` and appends:

**Process**

- ES: `Si es tu primera vez, lee mi guía sobre [cómo contratar una creadora UGC](/recursos/como-contratar-creadora-ugc/).`
- EN: `If it's your first time, read my guide on [how to hire a UGC creator](/en/resources/how-to-hire-ugc-creator/).`

**Cost (A — replaces the spec's single link sentence)**

Keep `Depende…` / `It depends…`, then append:

- ES: `Mis paquetes UGC en Fiverr empiezan en $40. Mis precios publicados en Fiverr están en [cuánto cobra una creadora UGC](/recursos/cuanto-cobra-creadora-ugc/).`
- EN: `My UGC packages on Fiverr start at $40. My published Fiverr prices are in [how much a UGC creator charges](/en/resources/how-much-does-a-ugc-creator-charge/).`

`$40` is `FIVERR_PRICING.ugc.basic.price`, not a hardcoded numeral in the sentence builder.

`FAQ.tsx` renders those items with `InlineCopy`, so the anchors are real internal links. Visible text and FAQPage `acceptedAnswer.text` both come from `getHomepageFaqItems` / `getHomepageFaqSchemaItems`. Schema uses `visibleInlineCopy` (anchor text as plain text), the same builder resource FAQPage already uses.

### Schema decision (overrides the spec's section 5 flag)

The spec asked to keep the new sentence out of homepage `acceptedAnswer.text`. The build instruction overrides that: **homepage FAQPage `acceptedAnswer.text` must match the visible answer word for word**, including the new sentence. The two cost questions, which were visible but missing from the boot FAQPage, are added to the schema set so the four linked answers can be asserted. The other historically omitted homepage questions stay out of schema.

`Index` emits that FAQPage through `PageSeo` (`data-route-schema`). Prerender keeps it and strips the boot-shell FAQPage, so production has one homepage FAQPage. The boot graphs in `index.html` / `en/index.html` are updated to the same four answers so the source shells cannot drift.

## B. Pricing guide leads

The opening identification clause is removed; the next clause is already capitalized; nothing else in the lead changed.

**ES before:** `Soy Gisela Saldarriaga, creadora UGC bilingüe en Medellín. Si quieres saber cuánto cuesta un video UGC antes de escribirme, aquí tienes mis precios publicados en Fiverr. …`

**ES after:** `Si quieres saber cuánto cuesta un video UGC antes de escribirme, aquí tienes mis precios publicados en Fiverr. …`

**EN before:** `I'm Gisela Saldarriaga, a bilingual UGC creator based in Medellín. If you want to know what a UGC video costs before you message me, these are my published Fiverr prices. …`

**EN after:** `If you want to know what a UGC video costs before you message me, these are my published Fiverr prices. …`

Grammatically intact, so the cut shipped. That opening clause did **not** appear in the pricing FAQ, FAQPage JSON-LD, or meta descriptions (`PRICING_META` still starts with "Mis paquetes UGC en Fiverr empiezan en $40" / "My UGC packages on Fiverr start at $40"). Those surfaces were left alone. The name still appears in the new answer block directly above the lead.

**Content-owner edit (same day):** drop the remaining $40 sentence from the two pricing leads only.

- ES removed: `Mis paquetes UGC en Fiverr empiezan en $40 por un video en español.`
- EN removed: `My UGC packages on Fiverr start at $40 for one video in Spanish.`

Leads now start `Si quieres saber cuánto cuesta un video UGC antes de escribirme, aquí tienes mis precios publicados en Fiverr. Los proyectos personalizados…` / `If you want to know what a UGC video costs before you message me, these are my published Fiverr prices. Custom and direct projects…`

The exact sentences do not appear in pricing FAQ, FAQPage JSON-LD, or meta. Close relatives were left alone: `PRICING_META` (`…empiezan en $40.` / `…start at $40.`), the pricing-page FAQ (`…por un video vertical en español de 30 segundos` / `…for one vertical 30-second video in Spanish`), and the hire-guide budget FAQ (`…por un video en español (precio de octubre de 2026)` / `…for one video in Spanish (October 2026 price)`). The answer blocks above the H1 still name the $40 start.

## Dates

Visible copy changed on the homepage FAQ and the resource guides, so `CONTENT_DATES.home` and `CONTENT_DATES.resources` moved to `2026-10-19`. Sitemap lastmod and llms `Last-Updated` follow those constants (sitemap via `writeSitemapFile` during `vite build`; llms `Last-Updated` is locked to `CONTENT_DATES.home`). Dates were not hand-edited independently of `CONTENT_DATES`.

## Files touched

- `src/data/resource-pages.ts` — `GUIDE_ANSWER_BLOCKS`, `answerBlock`, pricing-lead trim
- `src/data/homepage-faq.ts` — homepage FAQ composition + FAQPage builder
- `src/data/site-proof.ts` — unchanged; rating/count source for the hire blocks
- `src/data/content-dates.ts` — home + resources `2026-10-19`
- `src/components/ResourcePage.tsx` — render `answerBlock` under the H1
- `src/components/FAQ.tsx` — `InlineCopy` + `getHomepageFaqItems`
- `src/pages/Index.tsx` — emit homepage FAQPage from the same items
- `src/styles/guide.css` — `.gd-answer`
- `scripts/sync-resource-entrypoint-meta.mjs` — boot-shell paragraph between H1 and lead
- `index.html`, `en/index.html` — boot FAQPage + noscript answers + `dateModified`
- resource entrypoint shells under `recursos/` and `en/resources/` (generated)
- `public/llms.txt`, `public/llms-full.txt` — `Last-Updated` from `CONTENT_DATES.home`
- `public/sitemap.xml` — generated from `CONTENT_DATES`
- `src/data/guide-answer-blocks.test.tsx`
- `src/data/content-dates.test.ts`, `src/data/crawl-trust.test.tsx`

`architecture/05-seo-i18n-static-entrypoints.md` was not updated: no new routes, no prerender/entrypoint inventory change. The resource shell body template gained one optional paragraph from existing page data.

## How to verify

```
npx vitest run src/data/guide-answer-blocks.test.tsx src/data/fiverr-pricing.test.tsx src/data/faq-schema-and-links.test.tsx src/lib/sitemap.test.ts
npm run typecheck
```
