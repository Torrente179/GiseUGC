# Hero identity block redesign — grouped, app-profile structure

**Date:** 2026-06-11
**Commit:** `5ab600b`

## Problem

The hero text stack read as five undifferentiated rows: avatar + label, name, subtitle, two identical stacked pills (both with arrows, both calling to action), orphaned proof line. Even spacing throughout meant nothing grouped or led. User feedback: "I do not like the way it is displayed right now, like nothing."

Specific structural issues:
1. **Role label led before the name** — a tiny label above a massive heading inverts natural reading order for a brand.
2. **Avatar was redundant noise** — a 40×40 headshot circle on mobile, where Gisela is already visible in the reel card above her.
3. **Two CTAs, same visual weight** — both `btn-surface-nordic--lg` with `ArrowDownRight` + full width on mobile. No primary action, just competition.
4. **Proof row was orphaned** — `+28 marcas` sat after the buttons with a vertical pipe separator. No visual connection to anything; read as a footnote.

## What changed (`src/components/Hero.tsx`)

### Identity group: name leads, role becomes byline

- `<h1>` moved to the top of the content block (was second, after the avatar+label row)
- Bottom margin tightened: `mb-6 max-md:mb-4` → `mb-3 md:mb-4` — name and byline now read as a single group
- Avatar `<img>` element removed entirely — no `max-md:hidden`, just gone
- Role label: was `section-label text-foreground/70` (generic caps tracking, medium weight). Now a dedicated byline row: a 7px-wide teal hairline (`h-px w-7 bg-primary/90`) + `text-[10px] tracking-prestige font-bold text-foreground/60` — editorial, not generic

### Subtitle spacing

- `mb-8 max-md:mb-5 text-lg max-md:text-base leading-snug` → `mb-7 md:mb-9 text-[0.95rem] md:text-xl leading-relaxed md:leading-snug text-foreground/75`
- Slightly looser leading on mobile for readability at the smaller size

### One primary CTA; Contactar joins inline on desktop

- CTA container: was `flex-col gap-3 sm:flex-row sm:items-center mb-9` (stacked, two full-width pills on mobile)
- Now: `flex items-center gap-3` — single row, no column wrap
- Primary button: `max-md:w-full` (full width on mobile only, natural width on desktop)
- Contactar: `max-md:hidden` — invisible on mobile, joins inline next to the primary on desktop (no arrow on it)

### Footer strip: proof + secondary CTA as one composed row

- Old proof row: `flex items-center gap-3.5 text-foreground/65` — inline pipe-separated `+28 marcas | caption`, detached
- New footer strip: `mt-6 md:mt-9 border-t border-foreground/15 pt-4 md:pt-5` — hairline rule creates intentional separation
- Proof block is stacked (value over caption) rather than inline, giving the number more weight: `font-serif text-[1.45rem] md:text-2xl font-bold leading-none`
- On mobile, a quiet Contactar pill (`rounded-full border border-foreground/25 px-5 h-11`) fills the right side of the strip — balances the row, gives the secondary CTA a natural home, and maintains the `max-md:pr-14` clearance for the floating contact bubble

## Verified

- 390×844 mobile: name → byline grouped; ONE full-width primary button; footer strip hairline; Contactar pill on the right; no avatar
- 1280×800 desktop: big name + teal-dash byline; primary + Contactar inline; hairline footer with stacked proof
- `tsc --noEmit` clean, eslint clean

## Files

- `src/components/Hero.tsx`
