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
| Videos de portavoz | 1010, 2, 1001, 5, 1014, 1007, 1005, 1003 |
| UGC Ads TikTok y Meta | 1001, 1009, 4, 8, 7, 1015, 1003, 10 |
| Testimoniales y reseñas | 4, 1004, 3, 8, 1, 1013, 1012 |
| Demos de producto | 1008, 3, 1009, 7, 1016, 1011 |
| Problema-solución | 1009, 1001, 2, 5, 1015, 3, 1012 |
| Lifestyle | 1002, 8, 1, 4, 7, 9, 1015 |
| B-roll | 1002, 1006, 1007, 9, 10 |

All 26 clips are used. The transcripts changed some earlier calls:

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
