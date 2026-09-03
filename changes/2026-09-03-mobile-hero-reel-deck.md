# Mobile Hero — Reel Deck, and the Crop That Buried Her Head

**Status:** Live on main
**Implemented:** 2026-09-03
**Scope:** Homepage hero, mobile only (`max-width: 767px`). Desktop and tablet
compositions are untouched.

| Commit | Subject |
| --- | --- |
| `ead796b` | `feat(hero): stack the mobile reel into a deck, unbury her head` |

Design exploration for this change (11 artboards, before/after plus ten
directions that were not taken):
<https://claude.ai/code/artifact/b2243870-8da2-4a41-8240-76671ad915b9>

---

## 1. What shipped

`src/components/Hero.tsx`, `src/index.css` — 143 insertions, 13 deletions across
2 files. Selectors touched, all inside `@media (max-width: 767px)` except the
first and the last two:

| Selector | Change |
| --- | --- |
| `.portrait-hero__phone-stack` | new; `display: none` at the base, so the deck never reaches desktop |
| `.portrait-hero__picture` | `height` 55% → 60%, plus `overflow: hidden` to clip the oversized image |
| `.portrait-hero__picture img` | new sizing block — see §2 |
| `.portrait-hero__scrim` | ink ramp raised: solid at 41%, clear by 63% |
| `.portrait-hero__phone-wrap` | `top: 27%` → `top: auto` + bottom anchor; `right` 1.25rem → 1.375rem; `width` 25vw → 30vw band |
| `.portrait-hero__phone` | `transform: rotate(3deg)` |
| `.portrait-hero__phone-stack--back` / `--mid` | new; the two turned cards and their `::after` washes |
| `@media … and (max-height: 700px)` | new short-phone branch — band 56%, deck 26vw |
| `@media … and (max-height: 650px)` | existing branch: `top: 22%` → bottom anchor, `width: 22vw` → clamped 24vw |
| `@media … and (hover: hover)` | new; restates the turn under hover |
| `@media … and (prefers-reduced-motion: reduce)` | new; restates the turn under reduced motion |

In `Hero.tsx`: `HERO_DECK_CLIPS`, the `posterThumbSrc` import, and two
`aria-hidden` spans rendered **before** the anchor so they paint beneath it by
tree order — neither needs a `z-index`.

The single reel card became a **deck of three**. The live card keeps the link,
the play glyph and the `01 / 10` counter; two decorative cards sit behind it,
turned `-11deg` and `-5.4deg`, dimmed with an `::after` wash, and carrying
static posters from `posterThumbSrc()` as `background-image` — no extra `<img>`
nodes and no extra requests beyond two ~10KB thumbs.

The rationale is that the count was doing no work. `01 / 10` in a chip is a
number a visitor has to read and convert; a pile of takes is understood before
it is read. `HERO_DECK_CLIPS` is deliberately **fixed** rather than derived from
`reelIndex`: a pile of prints does not reshuffle itself every 3.5s.

Also in this change: the photo band grew from 55% to 60% of the stage, and the
scrim's ink ramp moved up with it (solid at 41%, clear by 63%) so the taller
band still dissolves rather than ending on a ruled line.

## 2. Her head was behind the navbar

This predates the deck and is the more important fix.

The mobile source (`gisela-hero-mobile-992.webp`, 992x1984) carries **95 rows of
headroom above her hair**. At `object-fit: cover` scale in a 390-wide column
those 95 rows compress to about 12px — and the nav plate is 73px tall. Her whole
head sat behind it.

**`object-position` cannot fix this.** It only slides the image *inside* a
cover-fitted box; it cannot change the scale, and at cover scale the headroom
simply is not there. So the image is now oversized on purpose:

```css
.portrait-hero__picture img {
  inset: 0 auto auto 0;
  left: -26.4%;
  width: 130%;
  max-width: none;
  height: auto;
  aspect-ratio: 1 / 2;
  object-position: 50% 0;
}
```

Three of those five declarations are load-bearing and none are obvious:

- **`max-width: none`** — Tailwind preflight's `img { max-width: 100% }` clamps
  the oversize straight back to the column width, silently undoing the entire
  rule. This cost a debugging pass; the computed width read `375px` while the
  declared width read `130%`.
- **`aspect-ratio: 1 / 2`, not `height: auto` alone** — the `<img>` element's
  `width`/`height` attributes describe the **desktop** source (2048x1152), so an
  auto height reserves a 16:9 box and then jumps to 1:2 on load. The mobile
  `<source>` is exactly 1:2, so the ratio is stated rather than inferred, and
  the band is CLS-free.
- **`left: -26.4%`** — walks her left of centre so the deck lands beside her
  face rather than across her jaw. At the old centring the reframe pushed her
  chin straight into the stack.

Measured result: hair at y=96 on 390x844, y=89 on the tightest case (360x740),
against a 73px nav throughout.

## 3. The deck is anchored to the bottom, not to a percentage

`.portrait-hero__stage` is `max(40rem, 100svh - var(--app-dock-clearance))`, so
**the stage height moves with the device while the copy's height does not.** A
percentage `top` that cleared the signature row on an 844-tall phone landed
**22px inside it** on a 740-tall one — which is how the first attempt shipped
into review and had to be reworked.

The wrap now takes `top: auto` and
`bottom: calc(env(safe-area-inset-bottom, 0px) + 1.6rem + 18.5rem)` — the copy's
own inset, plus its height, plus a gap. The offset reproduces the design's
geometry exactly at 390x844 and degrades gracefully in both directions.

Measured clearance between the deck and the signature row:

| Viewport | Stage | Clearance |
| --- | --- | --- |
| 430x932 | 864 | 17px |
| 390x844 | 776 | 24px |
| 375x812 | 744 | 28px |
| 375x667 | 640 | 27px |
| 375x640 | 572 | 26px |
| 360x740 | 672 | 30px |

No horizontal overflow at any of them.

## 4. Cascade guardrails

Two rules restate the live card's `rotate(3deg)` **after** the rules that would
erase it, so the cascade resolves without `!important`:

- `@media (max-width: 767px) and (hover: hover)` — the generic
  `.portrait-hero__phone:hover { transform: translateY(-3px) }` sets `transform`
  wholesale and would flatten the card mid-hover.
- `@media (max-width: 767px) and (prefers-reduced-motion: reduce)` — the
  reduced-motion block sets `transform: none` on the same hover.

Both must stay **after** those blocks in `src/index.css`. Moving them up silently
un-turns the top card.

## 5. Regression guardrails

- **Desktop must not change.** `.portrait-hero__phone-stack { display: none }`
  lives outside the mobile query; the rotation, the oversized image and the
  bottom anchor are all inside it. Verified at 1280x900: one card, no rotation,
  `aspect-ratio: auto 2048 / 1152`, `max-width: 100%`.
- **Do not reintroduce a percentage `top` on `.portrait-hero__phone-wrap`.** See
  §3 — it cannot hold across stage heights.
- **`@media (max-width: 767px) and (max-height: 700px)`** trims the band to 56%
  and the deck to `26vw`; the existing `max-height: 650px` block, which hides the
  description, overrides the bottom offset again. Both are load-bearing on short
  phones.
- **Verify the crop numerically, not by eye.** The Browser pane freezes rAF while
  hidden and will render the hero photo black — that is a tooling artifact, not a
  regression. Measure `95 / 1000 * img.getBoundingClientRect().height` against the
  navbar's height instead.

## 6. Known, accepted

The same "head behind the navbar" crop still ships on **service and vertical
landing heroes** if they share the pattern — this change touched only
`.portrait-hero__*`. The navbar's own controls are also below the 44px touch
minimum (hamburger 40x40, ES/EN toggles 28px tall); untouched here and worth a
separate pass.
