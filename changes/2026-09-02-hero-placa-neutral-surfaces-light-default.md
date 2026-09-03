# Hero "Placa", Neutral Dark Surfaces, Light Default, Mobile Reel Autoplay

**Status:** Live on main
**Implemented:** 2026-09-02
**Scope:** Homepage hero; the `--deep-ebony` surface role site-wide; the boot
theme resolution in every entrypoint; the mobile hero reel on service and
vertical landing pages

Four commits, landed in this order:

| Commit | Subject |
| --- | --- |
| `90bb43a` | `feat(hero): lead with the offer, retire the fake handset` |
| `6c1f129` | `fix(theme): split dark surfaces off --deep-ebony so they stop reading brown` |
| `2e8d4ec` | `feat(theme): default to light instead of following the OS` |
| `78a2226` | `fix(mobile): autoplay the service and vertical hero reels, drop the tap target` |

---

## 1. Homepage hero — direction "Placa" (`90bb43a`)

`src/components/Hero.tsx`, `src/index.css`, both `translation.json`
— 350 insertions, 307 deletions across 4 files.

The previous hero was reported as "tacky and weird". The diagnosis, in the
order the problems mattered:

1. **Two serif voices fighting inside one lockup.** `Gisela` in a heavy roman
   and `Saldarriaga` in a swashed italic read as two different logos.
2. **Four type treatments before the CTA** — gold micro-caps eyebrow, giant
   serif name, white tracked all-caps subtitle, gold rule, sans paragraph.
   Nothing was subordinate.
3. **The subtitle was a sentence set as a label**: uppercase at 0.14em
   tracking and ~11px, and it repeated what the paragraph below already said.
4. **The `↘` was a text glyph**, rendering at whatever weight the font gave it.
5. **A drawn Dynamic Island and home indicator** on the reel frame — an
   imitation handset that dates the design to whichever phone was current when
   it was drawn.
6. **A gold hairline** floating between two paragraphs with no job.

### What shipped

- **The H1 is now the offer, not the name.** `hero.offerTitle` — "UGC bilingüe,
  demos y videos de portavoz". Her name drops to a signature row beside the
  place and languages. The `Person` JSON-LD in `index.html` still carries the
  name, so the entity signal is unchanged.
- **One serif.** `__given-name` / `__surname` and the italic are gone.
- **The tracked subtitle and the orphan rule are gone.** New `hero.offerLead`
  copy is assembled from strings already on the site, so the paragraph no
  longer restates the headline.
- **The handset became a plain 9:16 media card.** The counter moved *inside*
  it — below the card it lands on the planted wall behind her and stops being
  readable.
- **The CTA went ivory.** Teal stays the action colour in the navbar and dock.
- **The arrow is drawn SVG.**

### New locale keys

`hero.offerTitle`, `hero.offerLead`, `hero.signatureMeta`, `hero.reelNote`,
`hero.reelLabel` — added to both `es` and `en`. The old `hero.subtitle` and
`hero.description` are left in place; nothing else read them.

### The scrim geometry, and why it is load-bearing

The original comment on `.portrait-hero__scrim` explains that the horizontal
knee is derived rather than guessed. That derivation had to be redone: the
offer headline is a wider object than the stacked name it replaced.

At the first attempt the headline ran onto her white blazer and the last word
lost all contrast. The column is now capped at **26rem** and the knee is
derived from it:

```css
--hero-copy-edge: calc(max(0px, (100% - 100rem) / 2) + 5.5rem + 26rem);
```

**The 26rem term is the number that keeps her lit.** The ramp needs roughly
12rem of clear ground to fall off in, so a wider column pushes the falloff
onto her shoulder. Widen the headline and this has to be re-derived, not
nudged. The comment in the file says so.

Tablet (768–1023px) gets its own knee plus `object-position: 38% 40%`, which
walks her right of the copy column instead of paying for the collision in
scrim.

### Bug found and fixed during verification

`.portrait-hero__picture` and its `img` share the base rule, so setting the
mobile zone height on **both** made the image 55% of a box that was already
55% — a third of the frame instead of a bit over half. The zone belongs on
the wrapper only.

> **Superseded for mobile on 2026-09-03.** "The zone belongs on the wrapper
> only" still holds for the *band height*, but the `img` now deliberately
> carries its own sizing at `max-width: 767px` — `width: 130%`,
> `aspect-ratio: 1 / 2`, `max-width: none`, anchored to the top of the source.
> That is what gets her head out from behind the navbar, and stripping it to
> "restore" this note re-buries her. See
> [`2026-09-03-mobile-hero-reel-deck.md`](./2026-09-03-mobile-hero-reel-deck.md) §2.

### Verified

320 / 390 / 430 px (no horizontal overflow, CTA clears the dock at every
width), 900 px, 1440 px. `npm run typecheck` clean, tests green, eslint clean
on `Hero.tsx`.

---

## 2. Dark surfaces stop reading brown (`6c1f129`)

`src/index.css`, `src/styles/templates.css` — 60 insertions, 54 deletions.

Three surfaces were reported as "un tono medio café": the desktop navbar on
the home page (`#312E29`), the mobile home hero (`#2F2A24`) and the mobile
services hero (`#302B26`).

### Measurement, not impression

Sampled against the live render, every dark plate sat at hue 40–48° with red
5–9 points ahead of blue. Sampling the untouched source photo at the same
spots showed the split cleanly:

| Region | Source `.webp` | Rendered |
| --- | --- | --- |
| White blazer | `#D6CEC1` — hue 37°, sat **20%** | `#C6C0B4` — hue 40°, sat 14% |
| Left background | `#4D584F` — hue 131°, R−B **−2** | `#2A2A25` — hue 60°, R−B **+5** |

So the warmth in the **lit** areas is baked into the photograph — the scrim
actually *lowers* the blazer's saturation. What the CSS added was warmth in
the **shadows**: a green-grey background came out warm grey.

### Why the token could not simply be neutralised

All three surfaces traced to one variable, `--deep-ebony: 33 13.3% 16.3%`.
But that token is also `--foreground`: **every line of body text on the site
inherits it.** Changing it in place would have re-coloured the whole page
instead of the three plates that read as brown.

### What shipped

- New token `--ink-surface: 0 0% 17%`, declared next to `--deep-ebony` with a
  comment explaining the split.
- **32 background / gradient / shadow uses** moved to it (17 in `index.css`,
  15 in `templates.css`).
- **The five places the token is a text colour keep it** and stay warm.
- The desktop hero scrim hardcoded the brown rather than using the token —
  `rgba(34,31,27)` in 14 places, plus the mobile top-of-frame darkener and the
  reel caption bar. **21 literals** went neutral too.

### Result

| Surface | Before | After |
| --- | --- | --- |
| Home navbar | `#312E29` · sat 5% · R−B +5 | `#333434` · sat 1% · R−B −1 |
| Hero ground | `#31302C` · sat 5% · R−B +5 | `#2E3030` · sat 2% · R−B −2 |
| Copy column | `#474541` · sat 4% · R−B +6 | `#454544` · sat 1% · R−B +1 |

Residual warmth in the lit areas is the photograph's own grade, untouched.

---

## 3. Light is the default theme (`2e8d4ec`)

49 files — 2 `.tsx`, 1 `.mjs`, 46 HTML entrypoints.

A first-time visitor on a dark-mode OS was served the dark theme. **Three
places had to agree**, or the page would boot one way and hydrate the other:

1. **`ThemeProvider`** in `src/client-runtime.tsx` and `src/entry-server.tsx`
   moved from `defaultTheme="system"` to `"light"`. `enableSystem` is off as
   well: `ThemeToggle` is a two-state light/dark switch that never sets
   `"system"`, so the flag only ever served as an OS-driven fallback.
2. **The inline boot script that runs before React paints** resolved an absent
   preference against `prefers-color-scheme`. It now resolves to light, and
   the dead `systemTheme` lookup is gone. That script is inlined into **all 46
   committed HTML entrypoints** — touching only `index.html` would have left
   every static service, resource and vertical page still booting dark.
3. **`scripts/sync-hub-entrypoints.mjs`** carries the same script as a
   template and would have reintroduced the old behaviour on its next run.

Unchanged: a stored preference still wins, the toggle still persists to
`localStorage`, and `boot-home` still boots the home shell dark so the hero
does not flash light before it paints.

### Verified

With `prefers-color-scheme: dark` emulated and no stored preference: `html`
carries no `.dark` class, `colorScheme` is `light`, body is `#FDFCFB` — on
both the SPA and a static entrypoint. Toggling still switches and persists.

---

## 4. Mobile hero reel autoplays and is no longer a tap target (`78a2226`)

`src/components/ServiceLandingPage.tsx`,
`src/components/VerticalLandingPage.tsx`, `src/styles/templates.css`
— 8 insertions, 16 deletions.

Reported: on mobile the service hero video showed as a poster asking to be
tapped. It should roll on entry with no play/pause affordance, as on desktop.
Desktop has neither behaviour — there the hero is a plain `aria-hidden` div.

Three things kept mobile from matching:

1. **`VerticalLandingPage` still called `useMediaIntent()` bare.** That gate
   only opens on `pointermove` / `pointerdown` / `touchstart` / `keydown` — a
   mouse satisfies it within a second of load, **a phone does not satisfy it
   at all until the visitor touches something.** `ServiceLandingPage` was
   given `autoStart` in `b8c609d`; the vertical pages were missed.
2. **Both mobile heroes left `loadStrategy` at its `'visible'` default**, so
   the source only attached after an `IntersectionObserver` callback even
   though the element is the top of the page. They now load immediately, the
   way the home hero already does.
3. **Both wrapped the plate in a `<button>`** that opened the clip theater —
   that is the play/pause affordance the visitor was seeing. It is now an
   `aria-hidden <div>` matching the desktop markup, and `.stm-hero-poster` no
   longer paints a pointer cursor.

Opening a clip is unaffected: the swipeable proof gallery directly below still
calls `openProofClip` for every example, including this one.

### Not reproduced

**This fix was derived from the code, not from an observed repro.** The
preview pane and Chrome both report `document.visibilityState: 'hidden'` for
this route, so the mobile `viewport-layout` never mounts; headless Chrome will
not lay out below ~500px and did not hydrate the page at 700px either. The fix
comes from reading the gate chain in `AdaptiveVideo` and matching the desktop
markup it is being aligned to.

If the poster still appears instead of the video, the remaining suspect is the
OS **Reduce Motion** setting: `useMediaIntent` returns `false` unconditionally
when it is on, on every page.

---

## Open items, deliberately not done

- **Body text is still warm.** `--foreground` remains `--deep-ebony`
  (`#2F2A24`) — the same hue removed from the surfaces. One line changes it
  (`0 0% 16%`); it was left alone because it re-colours every page and was not
  what was asked for.
- **The photograph is warm-graded at source.** The white blazer measures
  20% saturation at hue 37° before any CSS touches it. Removing that means
  re-grading and re-exporting every hero variant (mobile 768/992, desktop
  1600/2048, webp and jpg).
- **Navbar collision at ~900px.** Between roughly 768 and 1023px the brand
  logo overlaps the first nav link and the last link runs under the language
  pill. Pre-existing, not touched — a background task was filed for it.
- **`public/locales/` is stale.** It diverges from `src/locales/` since commit
  `868ba4d`. The app imports from `src/locales/`, so nothing is broken, but
  the copy is misleading.

## Same session, outside the codebase

- Two design canvases were produced before the hero work landed: four
  directions (Placa / Ficha / Placa de vidrio / Marquesina), from which
  **Placa** was chosen, and later five more exploratory readings (Díptico /
  Contacto / Cartel / Visor / Luz), which were **not** adopted — the decision
  was to keep the current design.
- A research pass on UGC creator platforms for a Colombia-based creator. The
  headline finding: Billo, JoinBrands and Insense all exclude Colombia, so the
  platforms every "best of" list recommends are unusable. Colombia-eligible
  options are Collabstr, UGC LATAM, StoryTalent, Collabify and CreatorPlace.
  Not a code change; recorded here so the conclusion is not lost.
