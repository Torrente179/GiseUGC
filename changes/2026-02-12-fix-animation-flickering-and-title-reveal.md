# Fix animation flickering and restore title reveals

## Problem
- The title under "UGC Creativo" was not loading on desktop
- Various animations across the site were flickering/stuttering instead of being buttery smooth

## Root Causes

### Title not showing
The `SplitTextReveal` component replaced `whileInView` with `animateOnMount` (defaulting to `false`), which passed `initial={undefined}` as an explicit prop. This blocked framer-motion variant propagation from parent motion containers, leaving words stuck invisible at `y: 112%, opacity: 0`.

### Flickering animations
CSS `transition-all` on elements that also use framer-motion `whileHover`/`whileTap` caused both systems to fight over the `transform` property on every frame. The `btn-press` utility's `transition-transform` directly conflicted with framer-motion's `whileTap`.

## Changes

### `src/components/motion/SplitTextReveal.tsx`
- Restored `initial="hidden"` + `whileInView="visible"` with `viewport={{ once: true, amount: 0.15 }}`
- Lower `amount` threshold (0.15 vs old 0.45) triggers earlier and more reliably
- Removed `will-change-transform` from individual word spans (too many compositing layers)
- Removed broken `animateOnMount` prop; restored `once` and `amount` props

### `src/components/Hero.tsx`
- Removed `btn-press` class from primary CTA button (framer-motion `whileTap` handles tap animation)

### `src/components/Portfolio.tsx`
- Removed `btn-press` class from collage CTA button
- Collage clips: `transition-all` → `transition-[top,left,right,width,transform,opacity]`

### `src/components/Services.tsx`
- Service cards: `transition-all` → `transition-[border-color,box-shadow]` (framer-motion handles transform)

### `src/index.css`
- `.btn-primary-nordic`: `transition-all` → `transition-[color,background-color,border-color,box-shadow]`
- `.btn-secondary-nordic`: `transition-all` → `transition-[color,background-color,border-color]`
- `.hero-chip`: `transition-all` → `transition-[border-color,background-color,color,box-shadow]`
- `.cafe-card`: `transition-all` → `transition-[border-color,box-shadow]`
- `.hover-grow` / `.hover-lift`: `transition-all` → `transition-transform`

## Principle
CSS handles color/shadow/border transitions; framer-motion has exclusive control over `transform`. No more two animation systems fighting over the same property on the same frame.
