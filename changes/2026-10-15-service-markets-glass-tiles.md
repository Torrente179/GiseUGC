# Service pages: "Mercados y formatos" as glass tiles on phones

**Status:** Live on main
**Implemented:** 2026-10-15
**Scope:** the Overview beat of every service page (8 services, ES and EN),
phones only (`.kn--m`). Desktop keeps its plain list.

The user asked for a new mobile design for this block. Before, it was three
grey body paragraphs under a bold "Qué puedes pedir" list, and read like fine
print. From the design canvas (row «Mercados y formatos» on a phone) they
picked **B · Glass tiles** over A · Icon list and C · Swipe cards.

## What it is now

- **Tiles:** each line is a frosted tile (`.kn-mkt-tile`, blur 22px, white
  60% / 6%) with a 44px teal-gradient icon and the line at 18px semibold in
  full ink.
- **Glow:** a soft teal and sand glow behind the stack, made with radial
  gradients on the list's `::before`/`::after`. That means no filter to paint,
  and they stop at the 20px gutter, so nothing overflows.
- **Icons follow what the line says**, since the copy is free text per page
  and locale (`market-icon.ts`, first match wins):
  - globe: the markets line;
  - audience: who watches;
  - target: campaigns;
  - layers: what it is ordered with;
  - voice: talking to camera;
  - social: content for social feeds;
  - video: the videos themselves;
  - page: where they get reused.
- **Tests** (`market-icon.test.ts`) check that every page opens on the globe,
  no page repeats an icon, and ES and EN pages get the same icons.

## Verified

Service pages need the build's embedded route data, and the local build is
blocked (quarantined WhatsApp media). So the beat was rendered on its own in a
throwaway Vite page and screenshotted:
- **Pages:** UGC Ads (light and dark), Problema-solución, Bilingual (EN, dark)
  and B-roll at 320px.
- **Result:** 3 tiles each, backdrop-filter active, correct ink per theme, and
  no horizontal overflow.
