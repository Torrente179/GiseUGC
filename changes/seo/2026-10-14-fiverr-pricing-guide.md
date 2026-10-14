# Bilingual Fiverr pricing guide

**Status:** Current
**Implemented:** 2026-10-14
**Scope:** New ES/EN resource pages, shared `FIVERR_PRICING` constant, hub + hire-guide links

## Pages

- ES: `/recursos/cuanto-cobra-creadora-ugc/`
- EN: `/en/resources/how-much-does-a-ugc-creator-charge/`

Copy is the approved 2026-10-14 brief. Titles, meta, H1, body, table, FAQs, and hub cards are verbatim. Public brand stays Gisela Saldarriaga / Gisela.UGC. Never GiseUGC.

## Single price source

`FIVERR_PRICING` in `src/data/resource-pages.ts` holds the verification date (`2026-10-14`), every package price, rush range, per-gig day counts, and gig URLs. The page body, meta descriptions, FAQ answers, FAQPage JSON-LD, hire-guide budget FAQ, and hub cards all read from that constant.

**Authority resync:** any change to `FIVERR_PRICING` must be followed by a re-check on Fiverr and a ping to Authority, the same as the `site-proof.ts` rule. Re-check monthly, and any time a gig is edited. Update the constant and the verification date together.

## SEO

- One H1 per page
- Reciprocal hreflang pair; `x-default` points to ES
- Self-canonical
- FAQPage schema matches the visible FAQ word for word
- Exactly one FAQPage per page
- No Offer, Product, or PriceSpecification markup
- Each price links to its Fiverr gig with no `?source=` query
- Spokesperson rows link to both gigs named in the copy
- Both URLs are in `public/sitemap.xml`; IndexNow submits sitemap locs after deploy to main
- Per-page OG images generated the same way as the other registry routes

## Related surfaces

- `/recursos/` and `/en/resources/` say five guides and add a card for this page
- The cómo-contratar / how-to-hire guide links here and adds the approved budget FAQ
- Direct-contact CTAs use `/#contact` and `/en/#contact`. The live homepage target is `id="contact"` on `PageEndStrip` (the rendered footer while `SHOW_SITE_FOOTER` is false)

## How to verify

```
npx vitest run src/data/fiverr-pricing.test.tsx src/data/hub-pages.test.tsx src/lib/sitemap.test.ts
npm run typecheck
```
