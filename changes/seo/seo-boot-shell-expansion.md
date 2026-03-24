# SEO Boot Shell Expansion (Phase 1)

## Summary
Expanded the static boot shell content inside service page `<div id="root">` from ~313 words to ~1,500 words per page. This makes deliverables, best-fit/not-fit criteria, and process steps visible to non-JS crawlers and AI search fetchers (OAI-SearchBot, PerplexityBot, ClaudeBot) that do simple HTTP fetches without rendering JavaScript.

## What changed

### 1. Boot shell expansion (visible HTML inside `<div id="root">`)
Added a new `<section class="boot-expanded">` inside the boot shell containing:
- Section intro (title + text)
- Deliverables (4 items with title + description as `<dl>`)
- Best-fit items (3 bullet points)
- Not-fit items (3 bullet points)
- Process steps (4 numbered steps as `<ol>`)

This content is styled with inline CSS (`boot-expanded`, `boot-section-heading`, `boot-subsection-heading`, `boot-dl`, `boot-fit-list`, `boot-process`) and will be replaced by React on hydration.

### 2. Noscript expansion
Added the same content sections inside the existing `<noscript><article>` block, before the FAQ noscript content. Marked with `<!-- SERVICE-EXPANDED-NOSCRIPT -->` comments.

### 3. Word count impact

| Page | Before | After |
|---|---|---|
| Spanish service pages | ~313 words | ~1,481-1,670 words |
| English service pages | ~313 words | ~1,443-1,604 words |

## Files modified
- All 16 service page HTML entrypoints (8 ES + 8 EN)
- New script: `scripts/expand-boot-shells.mjs`

## Verification
1. `npm run build` passes: all 24 HTML entrypoints compile
2. Raw HTML word counts verified above 1,400 for all service pages
3. Content matches `src/data/service-pages.ts` runtime data exactly
4. Boot shell styles are inline and self-contained
5. React hydration replaces boot shell content on load (no visual regression)
