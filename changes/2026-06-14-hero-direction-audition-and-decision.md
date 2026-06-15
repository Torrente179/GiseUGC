# Hero direction audition (B / C / A) — kept "Muro de trabajo" (B)

**Date:** 2026-06-14
**Outcome:** the live hero stays **B · Muro de trabajo** (commit `bc37c57`).
Directions **C · Cartelera** and **A · Portada** were built in full on the dev
server, reviewed, and **reverted** (never committed). Their complete specs +
source live in this doc so either can be reconstructed verbatim.

## Why this session exists

After B shipped (`bc37c57`, the reel-wall hero + free-scroll gallery), the user
wanted to audition the other two hero concepts from the original mockup round
(presented via the `visualize` widget + AskUserQuestion back when B was chosen):

- **A · Portada** — editorial split: bold identity left, one large reel right.
- **B · Muro de trabajo** — full-bleed wall of reels. ← shipped first, **kept**.
- **C · Cartelera** — billboard name on top, a band of large reels, footer.

Sequence: built C ("Nah, not too good"), built A ("Nop"), decided to **keep B**.

## Constraints held constant across all three

- Hero is force-dark (`.dark` on `[data-hero-viewport]`), independent of the
  global theme — the boot shell assumes a dark hero.
- **Mobile is identical in all three** — the approved `HeroStoryStack` + poster
  type stack; only the desktop branch changes.
- Desktop motion is **GSAP-powered**, idle-loaded via `whenIdle` + gated by
  `shouldEnableRichMotion()` (≥768px, fine pointer, no reduced motion); three.js
  is NOT used in the hero (a shader behind full media wouldn't show — reserved
  for the future Finale). Each direction's hook pauses offscreen/hidden and
  `ctx.revert()`s on unmount.
- **Gallery and Services were never touched** during the audition.
- Reuses across all three: `dc-name-a/-b` (name lockup), `dc-pitch`,
  `dc-credits`, `dc-cta-primary/-ghost`, the `hero-cascade-item` / `hero-line`
  entrance, and `useMagnetic` on the primary CTA.

---

## B · Muro de trabajo — KEPT (live, `bc37c57`)

Full detail in `changes/2026-06-13-muro-de-trabajo-hero-free-scroll-gallery.md`.
In one line: 5 edge-to-edge columns of reel **posters** drifting on `yPercent`
(seamless doubled list), name lockup + CTAs over a diagonal scrim; GSAP
(`use-hero-wall.ts`) does per-column drift + pointer parallax + velocity-aware
speed-up. Files: `src/hooks/use-hero-wall.ts`, `.dc-wall*` in `index.css`.

---

## C · Cartelera — REVERTED

**Layout (desktop, `.dc-cartelera`, flex column, 100svh):**
- Top (`.dc-cartelera-head`): teal eyebrow ("Creadora UGC bilingüe — Medellín,
  CO") + the billboard name lockup.
- Middle (`.dc-cartelera-band-wrap`, `flex:1`, `perspective:1500px`): a centered
  row (`.dc-cartelera-band`) of **5** large 9:16 reels (`.dc-cartelera-reel`,
  `height: clamp(15rem,40svh,24rem)`); the center one `.is-featured`
  (`46svh`, teal border, **plays video** via `AdaptiveVideo` priority `hero`,
  `Nº 01` chip), the other four are posters.
- Bottom (`.dc-cartelera-foot`): pitch + CTAs + credits.
- Background (`.dc-cartelera-bg`): warm-ebony radial gradient + a faint blurred
  reel (`opacity .12`, `blur(30px)`) so it never reads flat black.

**Bug fixed:** the CTA cluster was initially bottom-right and collided with the
site-wide floating contact dock (also bottom-right, `~946–1408px`). Fix: moved
the whole foot to a single left column (pitch → CTAs → credits), clear of the
dock. (General rule: **hero CTAs must avoid the bottom-right** — the dock owns it.)

**Motion — `src/hooks/use-hero-cartelera.ts`:**
```ts
import { useEffect, type RefObject } from 'react';
import { loadGsap, shouldEnableRichMotion, whenIdle } from '@/lib/motion/gsap-core';

export const useHeroCartelera = (rootRef: RefObject<HTMLElement>, enabled: boolean) => {
  useEffect(() => {
    if (!enabled || !shouldEnableRichMotion()) return;
    let cancelled = false;
    let cleanup: (() => void) | undefined;
    const cancelIdle = whenIdle(async () => {
      const { gsap } = await loadGsap();
      const root = rootRef.current;
      if (cancelled || !root) return;
      const band = root.querySelector<HTMLElement>('[data-cartelera-band]');
      const inners = Array.from(root.querySelectorAll<HTMLElement>('[data-cartelera-inner]'));
      if (!band || inners.length === 0) return;
      const ctx = gsap.context(() => {
        const mid = (inners.length - 1) / 2;
        inners.forEach((inner, i) => {
          gsap.to(inner, { yPercent: -2.4 - (i % 3), duration: 3.4 + i * 0.5,
            ease: 'sine.inOut', yoyo: true, repeat: -1 });
        });
        const setX = inners.map((inner) => gsap.quickTo(inner, 'x', { duration: 0.7, ease: 'power3' }));
        const setRy = gsap.quickTo(band, 'rotationY', { duration: 0.8, ease: 'power3' });
        let raf = 0, px = 0;
        const onPointerMove = (e: PointerEvent) => {
          px = (e.clientX / window.innerWidth) * 2 - 1;
          if (raf === 0) raf = requestAnimationFrame(() => {
            raf = 0; setRy(px * 4);
            inners.forEach((_, i) => setX[i](px * (8 + Math.abs(i - mid) * 7)));
          });
        };
        window.addEventListener('pointermove', onPointerMove, { passive: true });
        const tweens = gsap.getTweensOf(inners);
        const io = new IntersectionObserver(([en]) => tweens.forEach((tw) =>
          tw.paused(!en.isIntersecting || document.hidden)), { rootMargin: '120px 0px' });
        io.observe(band);
        const onVis = () => tweens.forEach((tw) => tw.paused(document.hidden));
        document.addEventListener('visibilitychange', onVis);
        cleanup = () => {
          window.removeEventListener('pointermove', onPointerMove);
          document.removeEventListener('visibilitychange', onVis);
          if (raf) cancelAnimationFrame(raf); io.disconnect();
        };
      }, root);
      const prev = cleanup; cleanup = () => { prev?.(); ctx.revert(); };
    });
    return () => { cancelled = true; cancelIdle(); cleanup?.(); };
  }, [rootRef, enabled]);
};
```
Float lives on `[data-cartelera-inner]` (CSS never transforms it), so the
`hero-cascade-item` entrance (which animates `transform` on the outer reel)
never fights GSAP. Verified: 5 reels (heights 360/360/414/360/360), featured
plays, band 1123px, no overflow, no console errors.

---

## A · Portada — REVERTED

**Layout (desktop, `.dc-portada`, CSS grid `1.05fr 1fr`, `align-items: stretch`):**
- Left (`.dc-portada-left`, flex column `justify-content:center`, `max-width:40rem`):
  eyebrow (`.dc-hero-eyebrow`) → name → pitch → CTAs → credits. Name scoped
  smaller for the column: `.dc-portada .dc-name-a { clamp(2.6rem,5.8vw,6rem) }`.
- Right (`.dc-portada-stage`, `display:flex; align-items:center; perspective:1600px`):
  one large hero reel (`.dc-portada-reel`, `height: clamp(20rem,78svh,40rem)`,
  **plays video**, `Nº 01` chip + `.dc-portada-caption` "reel · <category>"),
  flex-centered; a faded second reel (`.dc-portada-peek`, `position:absolute;
  top:18%; right:3%; rotate(5deg); opacity:.45`) tucked behind toward the edge.
- Background (`.dc-portada-bg`): warm-ebony radial gradient from the right + faint
  blurred reel + edge scrims.
- `@media (max-width:1100px)`: hide the peek, widen the left column.

**Two bugs fixed (both layout):**
1. **Reel not centered.** `.dc-portada` used `align-items:center`, which sized the
   single grid row to content height; `.dc-portada-stage{height:100%}` then
   resolved against that short row, so the reel's `top:50%` sat low and
   overflowed the bottom. Fix: `align-items: stretch` (stage fills 100svh) +
   vertically center the left content with `flex` on `.dc-portada-left`.
2. **Centering transform clobbered.** The reel centered via
   `transform: translateY(-50%)`, but it also carried `hero-cascade-item`, whose
   keyframe animates `transform` → it overrode the centering (reel dropped to
   `top:50%`). Fix: **flex-center the reel** (no centering transform) and let the
   cascade own `transform`; for the peek (a static `rotate(5deg)`), **drop the
   cascade class** so its entrance transform can't clobber the rotate.
   *(General rule: never combine `hero-cascade-item` with a static CSS transform
   — `translateY(-50%)`, `rotate(...)` — on the same element; and GSAP must own
   `transform` alone too, cf. the `.is-magnetic` exclusion.)*

**Motion — `src/hooks/use-hero-portada.ts`:**
```ts
import { useEffect, type RefObject } from 'react';
import { loadGsap, shouldEnableRichMotion, whenIdle } from '@/lib/motion/gsap-core';

export const useHeroPortada = (rootRef: RefObject<HTMLElement>, enabled: boolean) => {
  useEffect(() => {
    if (!enabled || !shouldEnableRichMotion()) return;
    let cancelled = false;
    let cleanup: (() => void) | undefined;
    const cancelIdle = whenIdle(async () => {
      const { gsap } = await loadGsap();
      const root = rootRef.current;
      if (cancelled || !root) return;
      const stage = root.querySelector<HTMLElement>('[data-portada-stage]');
      const inners = Array.from(root.querySelectorAll<HTMLElement>('[data-portada-inner]'));
      if (!stage || inners.length === 0) return;
      const ctx = gsap.context(() => {
        inners.forEach((inner, i) => {
          gsap.to(inner, { yPercent: i === 0 ? -2.2 : -3.6, duration: 4 + i * 0.7,
            ease: 'sine.inOut', yoyo: true, repeat: -1 });
        });
        const setX = inners.map((inner) => gsap.quickTo(inner, 'x', { duration: 0.8, ease: 'power3' }));
        const setY = inners.map((inner) => gsap.quickTo(inner, 'y', { duration: 0.8, ease: 'power3' }));
        const setRy = gsap.quickTo(stage, 'rotationY', { duration: 0.9, ease: 'power3' });
        let raf = 0, px = 0, py = 0;
        const onPointerMove = (e: PointerEvent) => {
          px = (e.clientX / window.innerWidth) * 2 - 1;
          py = (e.clientY / window.innerHeight) * 2 - 1;
          if (raf === 0) raf = requestAnimationFrame(() => {
            raf = 0; setRy(px * -3);
            inners.forEach((inner, i) => {
              const reach = inner.closest('.dc-portada-peek') ? 30 : 14;
              setX[i](px * reach); setY[i](py * reach * 0.5);
            });
          });
        };
        window.addEventListener('pointermove', onPointerMove, { passive: true });
        const tweens = gsap.getTweensOf(inners);
        const io = new IntersectionObserver(([en]) => tweens.forEach((tw) =>
          tw.paused(!en.isIntersecting || document.hidden)), { rootMargin: '120px 0px' });
        io.observe(stage);
        const onVis = () => tweens.forEach((tw) => tw.paused(document.hidden));
        document.addEventListener('visibilitychange', onVis);
        cleanup = () => {
          window.removeEventListener('pointermove', onPointerMove);
          document.removeEventListener('visibilitychange', onVis);
          if (raf) cancelAnimationFrame(raf); io.disconnect();
        };
      }, root);
      const prev = cleanup; cleanup = () => { prev?.(); ctx.revert(); };
    });
    return () => { cancelled = true; cancelIdle(); cleanup?.(); };
  }, [rootRef, enabled]);
};
```
`yPercent` float and `y` parallax compose because GSAP treats them as separate
props. Verified on a clean restart: reel centered (top 133 / bottom 773),
playing, peek present, no overflow, **zero console errors**.

---

## Decision & revert

Kept **B**. The working tree (which held A on top of C) was restored to
`bc37c57` precisely:
```
git checkout HEAD -- src/components/Hero.tsx src/index.css src/hooks/use-hero-wall.ts
rm -f src/hooks/use-hero-portada.ts   # untracked
# use-hero-cartelera.ts had already been removed when A replaced C
```
Post-restore: no `portada`/`cartelera` refs remain, `tsc` clean, `.dc-wall*` +
`use-hero-wall.ts` present. To resurrect C or A, recreate the hook above, swap
the Hero desktop branch + the `dc-cartelera*` / `dc-portada*` CSS, and point
`useHero…` at the new hook.

## Cross-cutting learnings (apply to any future hero work)

- **`hero-cascade-item` animates `transform`** — don't pair it with a static CSS
  transform (centering or rotate) on the same node; center with flex/grid and
  move static rotates to a child. GSAP likewise must own `transform` alone
  (cf. `.is-magnetic`).
- **GSAP parallax pattern:** animate an inner element CSS never transforms;
  `yPercent` (float) and `y` (parallax) coexist as distinct props.
- **HMR noise:** swapping hooks live triggers a Fast-Refresh "Rendered more hooks
  than during the previous render" flood into the console — **not a real bug**.
  Confirm via a DOM `eval` (the component's nodes are present) and a clean server
  restart (pristine buffer). Don't chase it.
- **Floating dock owns bottom-right** site-wide — keep hero CTAs elsewhere.
- **Preview screenshots** intermittently capture the window's native (~384px)
  size after navigation; trust `getBoundingClientRect`/computed styles, and the
  first screenshot after a fresh `preview_start` tends to render full-size.
