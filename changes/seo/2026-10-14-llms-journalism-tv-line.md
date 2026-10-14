# Routine SEO: journalism/TV line on llms.txt

**Status:** Current for this pass  
**Implemented:** 2026-10-14  
**Stacked on:** `e12e8f9` (glass contact chrome)

Public brand stays Gisela Saldarriaga / Gisela.UGC. Never GiseUGC.

## What

`public/llms.txt` was missing the homepage H1 fact (9 years as a journalist)
and the hero lead fact (comes from television). One short line, worded only
from those live homepage strings and the existing llms-full journalism notes.
No channel names.

Exact line (same in both files, after the summary blockquote):

> 9 years of experience as a journalist and comes from television.

The summary line `Bilingual UGC creator…` is unchanged.

## Dates

`Last-Updated` in both llms files is `2026-10-14`. That field is locked to
`CONTENT_DATES.home` / `LLMS_LAST_UPDATED`, so home moved with it. Homepage
boot-shell `dateModified` (`index.html`, `en/index.html`) and the two home
sitemap lastmods follow. Other `CONTENT_DATES` families stay `2026-10-13`.

## Files

- `public/llms.txt`, `public/llms-full.txt`
- `src/data/content-dates.ts`
- `index.html`, `en/index.html`
- `public/sitemap.xml`
- `src/data/crawl-trust.test.tsx`

Architecture unchanged.

## How to verify

```
npx vitest run src/data/crawl-trust.test.tsx src/lib/sitemap.test.ts src/data/seo-hardening.test.ts
```

After deploy, `https://www.giselasaldarriaga.com/llms.txt` and
`/llms-full.txt` should contain the line above and `Last-Updated: 2026-10-14`.
