# 2026-02-17 - Mobile Theater Source Priority Switch

## Summary
Switched theater playback source priority to use `mobile` first on mobile devices, while preserving `main` first on desktop.

## Change
- File: `src/components/Portfolio.tsx`
- Updated theater source order:
  - Mobile: `[mobileSrc, mainSrc]`
  - Desktop: `[mainSrc, mobileSrc]`

## Why
- Mobile startup speed and swipe responsiveness are prioritized.
- Desktop keeps highest-quality-first behavior.

## Notes
- Existing fallback logic remains active, so if the first source fails it will automatically try the second source.
