# 2026-10-16 · Own cut-outs for four service pages

Testimonials, Spokesperson, Problem-solution and Lifestyle now each show their
own cut-out of Gisela in the Overview beat, from frames picked for them (sent as
player screenshots). Bilingual creator and TikTok/Meta ads keep `denim` and
`open`; Demos and B-roll keep `vest` until better sources arrive (below).

| Service | Cut-out | Clip, time | Method | Size |
|---|---|---|---|---|
| Testimonials | `denim-ok` | Croma key plano cerrado, 7.467 s | green-screen key | 777×1400 (keyed at 1006×1812, scaled down) |
| Problem-solution | `vest-home` | WhatsApp Video 2026-02-19 at 14.09.00, 6.2 s | BiRefNet-portrait | 720×1183 |
| Lifestyle | `perfume` | ugc-lifestyle-review-2, 16.4 s | BiRefNet-portrait | 720×1120 |
| Spokesperson | `mic` | ugc-brand-spokesperson, 20.133 s | BiRefNet-portrait | 700×1166 |

Files: `public/uploads/service-cutout-{denim-ok,vest-home,perfume,mic}.webp`,
listed in `KEYNOTE_CUTOUTS` with alt text in both languages and assigned in
`SERVICE_IMAGERY` (`src/data/service-page-imagery.ts`).

## How they were made

- Each screenshot was matched to its clip and frame by correlating small grey
  thumbnails against every poster, then every frame near the player's time.
- Frames come from `media-sources/` (the same files the site plays), decoded as
  BT.709: against the screenshots BT.709 was closer than the BT.601 decode the
  posters use.
- Green screen: `scripts/chroma-cutout.py`. Everything else:
  `scripts/hero-matte.py` (BiRefNet-portrait, two passes) for the matte, then
  `scripts/service-cutout.py` for the edge colour, crop and WebP. The script
  rebuilds `service-cutout-vest-home.webp` byte for byte from the same frame
  and matte.
- Model choice: BiRefNet-portrait, BiRefNet HR-matting and BEN2 Base were
  compared on two non-green frames (hair and hands, light and dark). BEN2 left
  a block of background on her hair and smears beside motion-blurred hands.
  HR-matting was marginally crisper but needs most of a 16 GB Mac's memory per
  frame at 2048 px and could not run a second frame without heavy swapping.
  Portrait was clean on both and runs in about 35 s per frame.

## Sharpness

The page draws the figure 700 px tall on desktop and 470 px on phones, so
retina screens need about 1400 px. These sources are 720×1280 (1080×1920 for
the green screen), so the three BiRefNet cut-outs are drawn about 1.2× larger
than their pixels: slightly softer than `denim`, accepted.

## Waiting for original videos

- Demos (WhatsApp Video 2026-02-13 at 00.02.34, 0.0 s): the only copy is
  480×848, so the cut-out would be drawn about 2× larger than its pixels.
- B-roll (ugc-voiceover-bots-review, 0.0 s): 720×1280 and HDR (HLG). Cut at
  the waist (y 808) to stay above the table, it is 634 px tall, about 2.2×.
  HLG needs tone mapping for a still; this ffmpeg has no `zscale`, and a
  numpy HLG → BT.709 conversion with exposure 0.37 matched the QuickTime
  screenshot best.

Both cut-outs were made and shown, then held back. With the original phone
files they can be redone with the commands above.

## Checked

- typecheck, lint, 393 unit tests, plus `service-page-imagery.test.ts` (new):
  every entry in `KEYNOTE_CUTOUTS` is a transparent WebP in `public/` at the
  width and height the `<img>` declares.
- The dev server serves the four files (`image/webp`, 200).
- Each cut-out was previewed at the page's figure height (700 px) with the
  `.kn-fig` fade, on `#fdfcfb` and `#0a0a0b`, and at the 2× size a retina
  screen draws. The live pages were not rendered: service pages need the
  build's route data (the dev server stops at "Missing prerendered route
  data"), and only the data changed, not `OverviewBeat`.
