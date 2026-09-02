# Editorial “Chapter 00” Homepage Hero

**Status:** Current live homepage direction  
**Implemented:** 2026-07-27  
**Scope:** Homepage hero and its top-of-page navbar integration only

## 2026-07-29 Performance Integration

The visual direction below remains current, but its media implementation was
upgraded as part of the site-wide performance overhaul:

- The center frame is a fixed lead clip (`id: 1007`) and the two flanking clips
  rotate daily from the full reel catalog.
- All three frames paint responsive AVIF/WebP/JPEG posters immediately.
- **All three frames play** (changed 2026-07-30 at the user's request; the
  original overhaul played only the center frame). Playback still starts only
  after genuine pointer, touch, keyboard, or scroll intent, so nothing is
  fetched before engagement. The playback scheduler allows the hero three
  decoders and drops to one on a metered or slow connection, where the other two
  frames keep their posters.
- Reduced-motion users always keep the complete static composition.
- The lead poster is discovered and preloaded from prerendered HTML; video is
  never an LCP dependency.
- The key light moves an already-rasterized layer with a compositor transform.
  Its time-normalized lerp feels consistent at 60, 90, and 120 Hz, stops when
  settled, and pauses offscreen or in a hidden tab.
- No Three.js/WebGL atmosphere or global animation ticker is used.

See
[`2026-07-29-performance-motion-media-architecture-overhaul.md`](./2026-07-29-performance-motion-media-architecture-overhaul.md)
for the complete runtime and validation record.

## Final Result

The former “Muro de trabajo” homepage opening was replaced with an authored editorial title sequence:

- `CHAPTER 00` appears above a large, solid-black `GISELA` wordmark.
- Three slightly misaligned 9:16 film frames overlap the lower portion of the title.
- All three frames use real Gisela portfolio stills; the center take is fixed
  and the flanking takes rotate daily.
- The frames retain subtle tape, film-edge, sprocket, grain, and timecode details.
- The bottom metadata reads exactly `MEDELLÍN · ES / EN · UGC`.
- Scrolling continues directly into the existing homepage content.
- No CTA, quiz, choice mechanic, dashboard, or new funnel behavior was added.

The final title is intentionally a clean solid fill. The experimental pencil/crosshatch texture and the blue marks beside the `A` are not part of the approved implementation.

## Design Direction

The hero follows the approved title-sequence mockup while preserving the site’s established palette:

| Role | Existing brand token |
| --- | --- |
| Paper/background | `pure-linen` and `brand-cream` |
| Main title/film | `deep-ebony` |
| Tape/production texture | `warm-sand` and `soft-stone` |
| Restrained metadata accent | `coastal-teal` |

The production residue is deliberately analog rather than dashboard-like: irregular frame angles, torn film edges, translucent tape, tiny frame labels, teal timecodes, light grain, and modest image grading.

## Content and Assets

The original approved mockup used three local WebP stills:

- `public/uploads/gisela-title-sequence-01.webp`
- `public/uploads/gisela-title-sequence-02.webp`
- `public/uploads/gisela-title-sequence-03.webp`

The current implementation draws from the real portfolio catalog and its
versioned responsive poster variants. The center take remains stable while the
flanking takes re-deal at the UTC day boundary. No AI-generated or external
imagery was introduced.

The frame metadata is defined in `src/components/Hero.tsx`:

| Frame | Label | Timecode |
| --- | --- | --- |
| 1 | `A / 01` | `00:00:00:20` |
| 2 | `A / 02` | `00:00:08:05` |
| 3 | `A / 03` | `00:00:31:17` |

## Component Structure

`src/components/Hero.tsx` now renders:

1. An accessible homepage `<section id="home">`.
2. The decorative `CHAPTER 00` label.
3. A semantic `<h1>` containing `Gisela`.
4. A `<figure>` with three decorative film frames.
5. A localized screen-reader-only description:
   - Spanish: `Tres fotogramas de Gisela creando una reseña UGC de producto.`
   - English: `Three frames of Gisela creating a UGC product review.`
6. The key-light layer.
7. The fixed editorial metadata line.

The responsive pictures use intrinsic dimensions and codec-aware source sets.
The center image is eager, synchronously decoded, and high priority; flanking
images are lazy and low priority. Images remain decorative because the
localized `<figcaption>` describes the sequence as one composition.

## Desktop Composition

- The stage fills at least one small viewport height with a 45rem minimum.
- The name sits behind the imagery at `z-index: 1`.
- The film composition sits above it at `z-index: 3`.
- Outer frames use a responsive width of `clamp(13.5rem, 22vw, 18.5rem)`.
- The center frame uses `clamp(14.5rem, 24vw, 20rem)`.
- Frames keep a 9:16 aspect ratio and use small intentional rotations:
  - left: `-5.5deg`
  - center: `1.2deg`
  - right: `5.2deg`
- The title uses the existing brand serif, uppercase display treatment, and solid `deep-ebony` fill.

## Mobile App-Quality Composition

Mobile is a purpose-built composition rather than a scaled desktop screenshot:

- The stage uses `calc(100svh - var(--app-dock-clearance))` with a 35.5rem
  minimum, to handle dynamic browser chrome **and** the fixed bottom app dock.
  Corrected on 2026-07-30: at a full `100svh` the stage ran under the 74px dock,
  hiding the metadata line completely and clipping the film frames. The stage is
  the positioning context for every hero element, so it has to end where the
  dock begins.
- `env(safe-area-inset-top)` and `env(safe-area-inset-bottom)` protect the chapter and metadata.
- The title uses a dedicated size and position below the chapter.
- The three frames form a centered 116vw collage so the outer frames can crop naturally at the screen edges.
- Mobile frame widths are 48vw, with a 51vw center frame and controlled negative overlap.
- The intended analog rotations remain restrained on mobile:
  - left: `-6.5deg`
  - center: `1.2deg`
  - right: `6.2deg`
- At 360px and below, frame widths increase slightly to preserve the composition.
- The existing mobile navigation and bottom app dock remain intact.

The implementation was visually reviewed at 320px and 390px widths as well as tablet and desktop breakpoints.

## Navbar Integration

`src/components/Navbar.tsx` applies the `title-sequence-nav` theme while Home **or a service landing** is at its top state. It maps the hero back to the existing linen, ebony, khaki, stone, and teal navigation tokens without changing navigation content, bilingual controls, contact links, or mobile menu behavior. After 18px of scroll the overlay class lifts and the themed frosted bar takes over. See `changes/ui/navbar-and-theater-hotfixes.md` (2026-09-02) for the service-page reuse.

## Motion and Accessibility

The title, chapter, film frames, tape, and metadata use short entrance animations. For users who request reduced motion, the corresponding animations are disabled with:

```css
@media (prefers-reduced-motion: reduce)
```

Other accessibility decisions:

- `Gisela` remains the page’s semantic `<h1>`.
- `CHAPTER 00` is decorative and hidden from assistive technology.
- The sequence has a localized non-visual description.
- Decorative film elements and duplicated image meaning are hidden from assistive technology.
- Existing navigation semantics and bilingual behavior are preserved.

## Superseded Iterations

The following experiments were implemented and then intentionally rolled back:

- Wide 4:5 contact-sheet cards.
- A crosshatched or pencil-scratch title fill.
- Blue/teal hand-drawn strokes beside the `A`.
- Multiple attempts to straighten or reduce the contact-sheet cards.

The source of truth is the original narrow editorial film-strip composition introduced in `77cacf4`, refined through `6decafc`, restored in `8a31991`, and finalized with a solid title in `b4533db`.

To protect against stale markup or cached experimental output, `src/index.css` also contains a final safeguard that force-hides the removed `.title-sequence-hero__a-strokes` element. Current `Hero.tsx` does not render that element.

## Files Changed

- `src/components/Hero.tsx`
  - Replaced the homepage hero markup and content.
  - Added the three-frame data model and bilingual accessible description.
- `src/index.css`
  - Added the editorial hero theme, paper texture, film treatment, responsive composition, animations, and reduced-motion behavior.
  - Added explicit solid title fill and the legacy blue-mark suppression rule.
- `src/components/Navbar.tsx`
  - Added top-of-home visual integration for the new hero.
- `public/uploads/gisela-title-sequence-01.webp`
- `public/uploads/gisela-title-sequence-02.webp`
- `public/uploads/gisela-title-sequence-03.webp`

Unrelated homepage sections were not redesigned or removed.

## Validation

The implementation passed:

- `npx tsc --noEmit`
- `npx eslint src/components/Hero.tsx src/components/Navbar.tsx`
- `npx vite build`
- Mobile regression checks
- Browser review at mobile, tablet, desktop, and wide-desktop breakpoints
- Browser console review with no hero-related errors

Known build warnings are unrelated and pre-existing:

- An old `caniuse-lite` data set.
- An ambiguous Tailwind `duration-[250ms]` utility.
- A generated HLS chunk above 500KB.

## Commit History

| Commit | Purpose | Final status |
| --- | --- | --- |
| `77cacf4` | Introduce editorial title sequence | Retained foundation |
| `cb8c592` | Keep the full title within frame | Retained |
| `6decafc` | Refine mobile title spacing | Retained baseline |
| `4b331ed` | Match wide contact-sheet mockup | Superseded |
| `789eb45` | Straighten mobile film collage | Superseded |
| `ef3177c` | Anchor title marks and reduce frames | Superseded |
| `28e8c65` | Level mobile film cards | Superseded |
| `bbe16f3` | Revert to original mockup composition | Transitional |
| `8a31991` | Restore original editorial sequence | Current composition |
| `b4533db` | Use solid title fill | Current |
| `21e7a73` | Suppress legacy title marks | Current |

## Regression Guardrails

Before changing the hero again:

1. Preserve the exact title and metadata wording unless copy changes are explicitly approved.
2. Keep `GISELA` complete and inside the viewport at 320px and 390px.
3. Do not reintroduce blue marks or pencil/crosshatch title texture without explicit approval.
4. Keep the film frames sourced from real project media.
5. Verify safe areas, `svh`, reduced motion, and the mobile bottom dock. The
   dock is fixed and 74px tall: measure that no hero element extends past
   `100svh - var(--app-dock-clearance)`, rather than assuming `svh` accounts for
   it.
6. Check that the title stays behind the film frames without becoming unreadably obscured.
7. Do not add funnel behavior or redesign unrelated homepage sections as part of a hero adjustment.
