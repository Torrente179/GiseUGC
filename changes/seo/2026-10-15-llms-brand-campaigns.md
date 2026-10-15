# Routine SEO: 28+ brand campaigns on llms.txt

**Status:** Current for this pass  
**Implemented:** 2026-10-15  
**Stacked on:** `a59bb13` (portfolio tablet layout)

Public brand stays Gisela Saldarriaga / Gisela.UGC. Never GiseUGC.

## What

`public/llms.txt` and `public/llms-full.txt` said `28+ active brand campaigns`.
The live site proof line (service/hire pages) is `28+ brand campaigns` /
`28+ campañas de marca`. Drop "active" so the AI profile matches that wording.
No Spanish llms file exists, so there was no ES string to change. No other
llms wording moved.

Exact proof line (same in both files):

> 28+ brand campaigns across fashion, beauty, tech, and lifestyle

## Dates

`Last-Updated` in both llms files is `2026-10-15`. That field is locked to
`CONTENT_DATES.home` / `LLMS_LAST_UPDATED`, so home moved with it. Homepage
boot-shell `dateModified` (`index.html`, `en/index.html`) and the two home
sitemap lastmods follow. Other `CONTENT_DATES` families stay as they were
(hubs/resources `2026-10-14`; services/verticals/legal `2026-10-13`).

## GEO prompt baseline

The hire-intent prompt set that should cite these facts is committed at
`changes/2026-10-15-geo-prompt-baseline.md` (documentation only; no site
copy).

## Files

- `public/llms.txt`, `public/llms-full.txt`
- `src/data/content-dates.ts`
- `index.html`, `en/index.html`
- `public/sitemap.xml`
- `src/data/crawl-trust.test.tsx`
- `changes/2026-10-15-geo-prompt-baseline.md`

Architecture unchanged.

## How to verify

```
npx vitest run src/data/crawl-trust.test.tsx src/lib/sitemap.test.ts src/data/seo-hardening.test.ts
```

After deploy, `https://www.giselasaldarriaga.com/llms.txt` and
`/llms-full.txt` should contain `28+ brand campaigns` (not `28+ active brand
campaigns`) and `Last-Updated: 2026-10-15`.
