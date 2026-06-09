# 2026-06-10 Hero "Ramillete" 3D Rotating Card Deck

## Motivation

The previous hero design showed a 40-tile wall of video cards, all decoding simultaneously.
On mid-range devices this was the single biggest performance cost — 40+ concurrent media
decoders, many of them never in the viewport.

An intermediate curated showcase (commit `e89702e`) replaced the wall with a handful of
larger tiles, but the user wanted something more cinematic: **"a card ramillete — they turn
and the floating cards move so another one gets in focus."**

## What shipped

### New component: `src/components/HeroReelDeck.tsx`

A 3D fanned card deck where:

- The **focused card** (relative rank `r === 0`) plays a muted 720p preview video. All other
  cards show a static poster image.
- The focus **auto-cycles every 4.2 s** — a different reel rotates to the front while the
  rest fan back and rotate behind it.
- **Cycling pauses on hover** so the user can dwell on a reel.
- Desktop: 6 clips in the deck, `fan=3` (3 trailing cards visible behind the front).
- Mobile: 4 clips, `fan=1` (1 trailing card peeking behind).

#### 3D transform math (`transformFor(r)`)

```ts
// r = relative position from focused card (0 = front, 1 = first behind, …)
if (r === 0) return 'translate(-50%, -50%) translateZ(0) rotateY(0deg) scale(1)';
const x  = 50 + (r - 1) * 24;         // fan to the right (% of card width)
const ry = -17 - (r - 1) * 4;         // rotate away from viewer
const tz = -150 * r;                   // push back in Z
const s  = Math.max(0.58, 0.82 - (r - 1) * 0.11);  // shrink as depth increases
return `translate(-50%, -50%) translateX(${x}%) translateZ(${tz}px) rotateY(${ry}deg) scale(${s})`;
```

CSS transition: `transform 1.05s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.7s ease` —
the spring-like easing gives the "snap to front" a physical feel.

#### Decode budget

Only 1 `<video>` element is ever alive at a time (the focused card). When the active index
changes, React unmounts the previous card's `AutoplayPreviewVideo` and mounts the new one.
This is the critical property: regardless of deck size, decode load ≈ 1 decoder throughout
the entire hero lifecycle. The atmospheric blurred backdrop (`hero-stage-bg`) is a separate
dedicated decoder, also limited to one.

### Hero.tsx changes

- Removed: 40-tile `HeroWallTile` columns, column state, column layout.
- Added: `<HeroReelDeck clips={deckClips} fan={…} />` inside a `hero-deck-wrap` div.
- Added: `AutoplayPreviewVideo` for the blurred atmospheric backdrop (`ambientClip`).
- `deckClips = dailyClips.slice(0, deckCount)` — same daily-seed shuffle as Portfolio so
  the featured clips rotate every 24 h without client-side randomness per visit.

### CSS additions in `src/index.css`

| Selector | Purpose |
|---|---|
| `.hero-stage` | Absolute fill of the hero viewport; hosts all video layers |
| `.hero-stage-bg` / `.hero-stage-bg-video` | Full-bleed blurred backdrop video |
| `.hero-deck-wrap` | Right-anchored container (`right:0; bottom:0; width:56%`) |
| `.hero-deck` | 3D context: `perspective:1600px; perspective-origin:42% 46%` |
| `.hero-deck-card` | Absolutely positioned; transitions on `transform` and `opacity` |
| `.hero-deck-face` | `position:absolute; inset:0; object-fit:cover` |
| Mobile overrides | `left:47%; top:30%; width:clamp(11rem,50vw,15rem)` — moves deck upper-right so it doesn't overlap the title+CTAs |

## Bugs found and fixed during development

| Bug | Root cause | Fix |
|---|---|---|
| Cards rendered 0×0 | `.hero-reel--0/1/2` modifier classes dropped by build | Moved all per-card sizing to inline `style` props |
| Video drove card to 1920px height | `<video>` was block-flow inside the card | `.hero-deck-face { position:absolute; inset:0 }` |
| Mobile deck overlapping title | `top:50%` centered deck over heading | Mobile override: `top:30%` |
| HMR blank screens in dev | DOM-paint timing during hot reload | Non-issue in production build |

## Commits

| Hash | Message |
|---|---|
| `e89702e` | `feat(hero): curated featured-reel showcase — replaces the 40-tile wall` |
| `7a94e3b` | `feat(hero): rotating "ramillete" reel deck — focus auto-cycles` |

## Known/pending

- At ~1024 px (narrow desktop) "Saldarriaga" can graze the deck edge — minor spacing
  tuning still possible.
- React error #426 (pre-existing `startTransition` gap in `Index.tsx` lazy sections) is
  unrelated to this component and still present.
