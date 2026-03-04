# FAQ Frontend Section

**Date:** 2026-03-04
**Commit:** 677bc89
**Type:** Feature

## Summary

Added a visible FAQ accordion section to the frontend, combining the existing SEO-optimized FAQ content (from the 2026-03-04 audit) with the user's 10 client-facing FAQ items based on real client questions.

---

## Changes

### New Files
- **`src/components/FAQ.tsx`** — New section component with Radix UI Accordion

### Modified Files
- `src/pages/Index.tsx` — Lazy-imported FAQSection, added between Testimonials and ServicesMarquee
- `public/locales/es/translation.json` — Replaced `faq.items` with 10 merged Spanish Q&As
- `public/locales/en/translation.json` — Replaced `faq.items` with 10 merged English Q&As
- `index.html` — Updated FAQPage JSON-LD schema (15 bilingual entries) and noscript FAQ block
- `public/llms.txt` — Updated FAQ section with 9 answer-first entries for AI citation

---

## FAQ Component Details

**File:** `src/components/FAQ.tsx`

- `studio-section bg-muted/30` background (visual break from adjacent sections)
- `studio-container` for consistent max-width and padding
- Framer Motion `staggerContainer` + `revealUp` for header entrance animation
- `SplitTextReveal` for the section title
- `studio-rule` gradient divider
- Radix UI `Accordion` (type="single" collapsible) — existing `@/components/ui/accordion`
- Data-driven via `t('faq.items', { returnObjects: true })` for bilingual support
- `faq-answer` class on each `AccordionItem` — matches Speakable CSS selector in JSON-LD schema
- `useReducedMotion()` respected for accessibility
- Lazy-loaded with `min-h-[640px]` fallback placeholder

---

## Merged FAQ Content (10 Items)

| # | Question | Source |
|---|---------|--------|
| 1 | ¿Qué es el UGC y cómo puede ayudar a mi marca? | Merge |
| 2 | ¿Qué tipos de contenido UGC creas? | Merge |
| 3 | ¿Publicas el contenido en tus redes sociales? | **NEW** (client's) |
| 4 | ¿Cómo funciona el proceso de trabajo? | Client (7 steps) |
| 5 | ¿Cuánto cuesta el contenido UGC? | Client |
| 6 | ¿Incluyes revisiones en el servicio? | **NEW** (client's) |
| 7 | ¿Cuánto tiempo tarda la entrega? | Client (3–5 business days) |
| 8 | ¿Qué derechos de uso obtiene la marca? | **NEW** (client's) |
| 9 | ¿Trabajas con marcas internacionales? | Merge |
| 10 | ¿En qué idiomas trabajas? | Client (ES unlimited; EN max 65 words + script) |

### Key New Information Added
- **Content ownership:** Content stays with brand, not published on creator's channels
- **Revisions:** 1–2 rounds included; major changes may cost extra
- **Delivery time:** Specific 3–5 business days (from product receipt + brief confirmation)
- **Usage rights:** Organic posts included; paid ads require separate paid license
- **Language detail:** Spanish: unlimited, no script needed; English: max 65 words, script required

---

## Schema & SEO Updates

- FAQPage JSON-LD now has **15 bilingual Q&As** (ES + EN pairs for key questions)
- `noscript` FAQ block updated with all 14 bilingual entries for AI crawler coverage
- `llms.txt` FAQ section updated with 9 answer-first entries
- `faq-answer` CSS class on accordion items matches existing Speakable specification in schema
