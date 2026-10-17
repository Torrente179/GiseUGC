# Service pages: new hero, and every portfolio video mapped to its services

**Status:** Live on main
**Date:** 2026-10-16
**Scope:** the 8 service pages (`/servicios/*`, `/en/services/*`), hero and
`featuredExamples`. The vertical pages keep their own `svc-cine-*` / `stm-*`
hero.

The user picked two boards from the design canvas
(https://claude.ai/artifact/L7DtvF1VoqjmT1hfxe9Qz6, "Service page hero"):

- **Desktop:** "S2 · Glass proof panel".
- **Phones:** "S1 · Phone stage".

They also asked to map every portfolio video to the right service, "so it
matches the premium quality we are looking for".

## The mapping

Read from `content/video-transcripts/` (all 26 clips have one) plus frames
from each clip. A clip can serve several services. The first clip of each list
opens the hero, so it is the sharpest clip that is on-brief: 1080p or more
where one fits, and never a raw green-screen take or a sub-500 px clip.

| Service | Clips, hero first |
|---|---|
| Creadora UGC bilingüe | 1006, 1001, 1010, 4, 1008, 1002, 1004, 6 |
| Videos de portavoz | 2, 1006, 1001, 5, 1014, 1005, 1003 (see the follow-ups below; was 1010, 2, 1001, 5, 1014, 1007, 1005, 1003) |
| UGC Ads TikTok y Meta | 1001, 1009, 4, 8, 7, 1015, 1016, 10 (was 1003 in place of 1016) |
| Testimoniales y reseñas | 4, 3, 8, 1, 1015, 1013, 1012 (was 4, 1004, 3, 8, 1, 1013, 1012) |
| Demos de producto | 1008, 9, 1011 (was 1008, 3, 1009, 7, 1016, 1011) |
| Problema-solución | 1009, 1001, 2, 5, 1015, 3, 1012 |
| Lifestyle | 8, 1, 4, 7, 9, 1015, 1002 (was 1002 first) |
| B-roll | 9, 7, 4, 1 (was 1002, 1006, 1007, 9, 10) |

All 26 clips were used in this first mapping; since the audit below, 1007 is
on no service page. The transcripts changed some earlier calls:

- **1007 (Minuto 30):** a full newscast, so it went to spokesperson.
- **10 (7 s):** a hook line, so it went to ads.
- **3 and 1012 (Calvotia):** first-person before/after stories, so they went
  to testimonials and problem-solution.
- **1015 (Tenky):** a problem-solution story.

Each clip has a title and a one-line description per language, in the site
voice. Copy that already existed for a clip on that page was kept. The
"Formatos" beat on the bilingual page now uses its own clips: 1001, 1008, 4,
1006.

**Source quality** caps what any layout can do:

- 1011 and 1012 are 480p.
- 1013 is 736×480.
- 6 is 720×408.
- The legacy clips 1–10 are 720p.

They sit at the end of their lists.

## The hero

`src/components/service-hero/ServiceHero.tsx` and
`src/styles/service-hero.css`.

- **Desktop:** the copy and a glass panel side by side.
  - **Copy:** breadcrumb, eyebrow, title, summary, "Quiero este servicio" (in
    ink), "Ver mi trabajo", and a real Fiverr review that fits the service.
  - **Panel:** the example in a 4:5 frame, playing its silent feed preview.
    The frame opens MediaTheater with sound. Under it, a strip of every
    example switches the frame.
  - **Theme:** it follows the site theme (light by default, dark with
    `.dark`).
  - **Fit:** it fits a 1440×900 screen.
- **Phones:** a feed card at the top cycles the examples.
  - Each plays its 6 s preview, with stories-style progress segments that are
    also buttons, a "Servicios" back pill, and a caption with name, title and
    length.
  - Tapping the card opens the player.
  - The next loop is warmed ahead. It holds still while the player is open and
    for reduced motion.
  - Below the card: the H1, summary, the WhatsApp pill and the hero points as
    chips. The swipeable "El trabajo" gallery stays under the hero.
- **The reviews** (`src/data/service-hero-reviews.ts`): one real 5-star review
  per service, picked for what it says.
  - It is built server-side into the route data (`heroReview`, with the
    country already in the page's language), so a page ships one review, not
    the capture.
  - `service-hero-reviews.test.ts` fails if a recapture renumbers one.
- **Rating:** the 4.7 · 177 Fiverr totals show only on the bilingual page, the
  one with the `AggregateRating`. That follows the rule in
  `changes/seo/seo-crawl-trust.md`: other service pages must not grow a
  rating.
- **Tests:** two SEO guards were updated to the new markup. The single H1 is
  now `svm-title`, and the breadcrumb check reads `ServiceHero.tsx`.

## Verified

A throwaway dev harness rendered the service pages with their route data, in
headless Chrome:

- **Desktop:**
  - At 1440 (light and dark), 1280 (EN) and 1024, the preview plays (HEVC
    where the master is), the strip switches ("3 / 7"), and the right review
    shows.
  - The rating appears only on the bilingual page.
  - No horizontal overflow, no errors, no missing images.
- **Phone (390, ES and EN):** the card advances after 6 s, and the title is
  white over the dark ground.
- **Player:** it opens on the right clip from both heroes, and the hero
  preview pauses.
- **Checks:** typecheck, ESLint, 418 tests.

## Follow-up: the dark band under the desktop hero

The service sections (`ServicePageInner`, `.kn`) open with a dark strip and a
rising rounded sheet, `.kn-handoff` and `.kn-ease`. They were drawn to take
over from the old dark hero. On desktop the new hero follows the site theme,
so in light theme a black band sat between it and the section nav, and the
nav's dark text sat on black.

On desktop (`.kn--d`, `src/styles/service-keynote.css`):

- The strip and sheet are hidden.
- The section starts on the hero's ground: linen in light theme, and in dark
  theme the site background easing into the section's near-black.
- The hero's glows fade out before its bottom edge
  (`src/styles/service-hero.css`), so the two meet without a line.

Phones are unchanged. Their hero stays dark.

## Follow-up: B-roll shows only B-roll

The B-roll page sells footage with no one talking to camera: product
close-ups, product in use, ambient shots. Three of its five clips were
talking-to-camera pieces (1002 Contenido TikTok, 10 a hook line), a
multi-brand spokesperson reel (1006) and a newscast (1007). They all stay on
their other pages.

Checked against six frames from each of the 26 clips and the transcripts:

- **9** (café, phone) and **7** (laptop among plants) are voice-over over
  footage of her using a product, never facing the camera.
- **4** has the tub, scoop and mix up close, and **1** the fabric, buttons and
  pockets up close, then each outfit worn, though she talks to camera in
  parts.

Examples (and hero rail): 9, 7, 4, 1. Format phones: close-ups 4, in use 9,
ambient 7, vertical and horizontal 1. New titles and descriptions for 7, 4 and
1 in both languages; 9 keeps its copy. No clip in the catalog is horizontal
B-roll. The three silent clothing showcases would fit best, but they exist
only as 480p mains on R2, with no mobile or preview renditions, so they are
not in the catalog.


## Follow-up: the other seven pages, checked against the footage

**Date:** 2026-10-17

The first mapping came from transcripts. This pass checked each clip against
six to twelve frames as well, then compared it with its page's own promise
(hero title, deliverables, "Te conviene si" and "No te conviene si"). Only
clear mismatches changed. The user approved the table before the edit.

What the frames showed that the transcripts did not:

- **3, 1009, 1015 and 1016** are talking to camera. The product is never on
  screen.
- **7** is her typing on a laptop. The screen is never visible.
- **9** shows the bots' app on her phone screen.
- **1003, 1004 and 1005** are raw green-screen takes. 1004 is a restaurant
  host segment, not a visit.
- **1010 and 1007** are newscasts, with no brand and no offer.
- **1001**'s original on R2 is 4K and **1008**'s is 1080p (probed with
  ffprobe).

The changes, by page:

- **Videos de portavoz** (the page sells a brand's offer explained to
  camera):
  - The newscasts 1010 and 1007 are out. 1010 stays on the bilingual page.
    1007 is now on no service page.
  - The new hero is 2 (Agenda Bot). It is 720p. The 1080p clips that fit,
    1006 and 1009, already open other pages, and the close's "More services"
    tiles show each page's hero poster, so the heroes stay distinct.
  - 1006 (spokesperson reel for four brands) is added.
- **UGC Ads:** 1003 is out. It is a raw green-screen take, but its copy said
  "Listo para Meta Ads". 1016 (an app-install ad: question hook, benefit,
  download CTA) is added from the demo page.
- **Testimoniales y reseñas:** 1004 is out. Nothing is used or tried on
  camera, but the page promises "Uso tu producto… natural, no actuado". 1015
  (Tenky, told in first person) is added.
- **Demos de producto:** the intro promises the product working on screen.
  - 3, 1009, 7 and 1016 are out.
  - 9 is added.
  - The page now shows 1008, 9 and 1011, the only real demos in the catalog.
- **Lifestyle:** the hero changes from 1002 to 8. 1002 has no product, and
  the page promises "Tu producto en escenas reales". 1002 moves to the end.
  No 1080p lifestyle clip shows a product.
- **Problema-solución** and **Creadora UGC bilingüe:** the examples are
  unchanged.

The Formats phones (`SERVICE_FORMAT_CLIP_IDS`), in deliverable order:

| Page | Phones | Changed |
|---|---|---|
| Videos de portavoz | 1005, 1014, 2, 1008 | 1010 → 1014 |
| UGC Ads | 1001, 1009, 1008, 4 | 1003 → 1008 on "Anuncios con demo" |
| Testimoniales | 4, 1013, 1, 3 | 1004 → 3 on "Reseña comparativa" (3 is a before/after story) |
| Demos de producto | 1008, 9, 1011, 4 | was 1008, 1011, 3, 7 |
| Problema-solución | 1009, 1001, 4, 1012 | 5 → 4 on "Problema-solución con demo" |
| Lifestyle | 8, 9, 1, 1002 | 1002 → 9 on "Escenas del día a día", 10 → 1002 on "Contenido para el feed" |

Clip 4 shows on a phone without being in that page's examples on the ads,
demo and problem-solution pages. On the demo page, that is because the test
needs four distinct phones and only three clips are real demos. Clip 4 is a
supplement on a tech page, but the product is used on camera.

New ES/EN titles and descriptions:

- 1006 on spokesperson.
- 1016 on ads.
- 1015 on testimonials.
- 9 on demo.

Every clip that stayed on a page kept its copy. The video sitemap and
VideoObject schema follow the examples lists.

Still open: every clip in the catalog is in Spanish. The bilingual page has no
English example to show.
