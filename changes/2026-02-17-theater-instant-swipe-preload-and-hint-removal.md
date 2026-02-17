# 2026-02-17 - Theater Instant Swipe Preload + Hint Removal

## Summary
Improve fullscreen theater swipe responsiveness by preloading nearby clips, and remove redundant swipe hint text.

## Changes Made
- Added theater preload window for neighboring clips (`-2, -1, +1, +2`) while preview is open.
- Set fullscreen theater `<video>` to `preload="auto"`.
- Added play retry on theater source change for smoother next/prev transitions.
- Removed keyed remount on theater video to avoid unnecessary teardown/recreate cycles.
- Removed hint text: `Desliza arriba/abajo para cerrar, izquierda/derecha para navegar`.

## What Does NOT Change
- No video assets changed.
- No quality changes.
- Existing theater gestures/animations remain intact.

## Files Updated
- `src/components/Portfolio.tsx`

## Validation
- `npm run build` passes.
