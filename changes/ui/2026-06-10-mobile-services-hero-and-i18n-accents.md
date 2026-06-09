# 2026-06-10 Mobile Services Hero Polish + i18n Accent Restore

Two small fixes shipped in the same release wave as the ramillete deck.

---

## 1. Mobile services hero — frosted scrim + legible title

**Commit:** `39786bc` — `style(services-mobile): elegant frosted hero scrim + legible title`

### Problem
On mobile, the `ServiceLandingPage` hero rendered the video clip at full opacity behind
a very thin overlay. The service name and hook were barely readable — especially on
light-background clips.

### Fix (`src/index.css`)

```css
/* Heavy blur + desaturation scrim anchored to the bottom half of the hero */
.stm-hero-bottom {
  backdrop-filter: blur(18px) saturate(0.85);
  background: linear-gradient(
    to top,
    hsl(var(--background) / 0.82) 0%,
    hsl(var(--background) / 0.60) 40%,
    transparent 100%
  );
  -webkit-mask-image: linear-gradient(to top, black 55%, transparent 100%);
  mask-image: linear-gradient(to top, black 55%, transparent 100%);
}

/* Title: always-white with subtle shadow so it reads on any clip */
.stm-hero-title {
  color: hsl(0 0% 98%) !important;
  text-shadow: 0 2px 12px hsl(0 0% 0% / 0.55), 0 1px 3px hsl(0 0% 0% / 0.4);
}

/* Hook/subtitle: slightly lifted opacity + matching shadow */
.stm-hero-hook {
  opacity: 0.92;
  text-shadow: 0 1px 6px hsl(0 0% 0% / 0.4);
}
```

The mask-image feathers the scrim so it fades naturally into the clear clip above rather
than having a hard edge.

---

## 2. Spanish accent restoration in copy

**Commit:** `811b4e5` — `fix(i18n): restore missing Spanish accents in portfolio/creator-advantage copy`

### Problem
A bulk find-and-replace had stripped the diacritics from several strings in
`src/locales/es/translation.json`. The affected sections were `portfolio` and
`creatorAdvantage`.

### Strings corrected (representative sample)

| Before | After |
|---|---|
| `"Marcas que confian"` | `"Marcas que confían"` |
| `"creacion"` | `"creación"` |
| `"autenticidad"` | already correct — surrounding strings needed fixing |
| `"produccion"` | `"producción"` |
| `"vision"` | `"visión"` |

9+ accented characters restored across the two sections.

---

## HLS quality ramp fix (same wave)

**Commit:** `8dd7aff` — `perf(video): open HLS at the highest fitting rendition (no low-quality ramp)`

Covered in detail in
[`video-performance-overhaul-2026-06.md`](../video-functionality/video-performance-overhaul-2026-06.md).

Short version: `AdaptiveVideo.tsx` was configured with `startLevel: -1` (default — ramps
from 360p). Added `abrEwmaDefaultEstimate: 8_000_000` (8 Mbps seed) and a
`MANIFEST_PARSED` handler that immediately pins non-theater streams to `topLevel`. Theater
views keep full ABR adaptivity. Result: no visible low-quality-ramp on first load.
