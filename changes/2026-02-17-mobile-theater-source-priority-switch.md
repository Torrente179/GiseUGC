# 2026-02-17 - Mobile Theater Source Priority Switch

## Summary
Adjusted theater playback source priority for better mobile sharpness while preserving fast fallback behavior.

## Change
- File: `src/components/Portfolio.tsx`
- Updated source selection to be network-adaptive:
  - Desktop: always `[mainSrc, mobileSrc]`.
  - Mobile (normal networks): `[mainSrc, mobileSrc]` for sharper quality.
  - Mobile (slow network / data-saver): `[mobileSrc, mainSrc]` for faster startup.
- Slow-network detection uses `navigator.connection`:
  - `saveData === true`, or
  - `effectiveType` in `slow-2g`, `2g`, `3g`.
- Added `enableStartupFallback` control on `TheaterVideo`:
  - Mobile: startup timeout fallback remains enabled.
  - Desktop: startup timeout fallback is disabled, so it does not downgrade to mobile just because of startup latency.
  - Desktop still keeps error-based fallback to mobile for resilience.

## Why
- Earlier mobile-first routing made quality noticeably softer on phones.
- This keeps quality high on typical 4G/Wi‑Fi mobile while retaining speed fallback for constrained connections.

## Notes
- Existing fallback logic remains active, so if the first source fails it will automatically try the second source.
- Existing fast startup fallback timer (`420ms`) and theater prewarming remain active.
- Verified R2 `main` URLs now return `200` for all theater clips.
