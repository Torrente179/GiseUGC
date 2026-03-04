# 2026-03-04 - Portfolio Rail Shows Full Video Library

## Summary
Updated the non-Theater portfolio scrolling rail to display the full available video library (`ALL_REEL_CLIPS`) instead of a limited subset of 10 clips.

## What Changed
- `src/components/Portfolio.tsx`
  - Removed the fixed showcase limit (`DAILY_REEL_SHOWCASE_COUNT = 10`).
  - Removed the slice-based selector helper.
  - `showcaseReelClips` now uses a full-list UTC-day seeded shuffle:
    - `shuffleWithSeed(ALL_REEL_CLIPS, utcDayBucket)`

## Behavior After Change
- Users can horizontally scroll through all available portfolio videos in one rail.
- Theater mode behavior remains unchanged:
  - opens from any selected card
  - navigates across the full library
- Daily UTC rotation is preserved as order rotation (not clip-count truncation).

## Validation
- `npx eslint src/components/Portfolio.tsx` passes.

## Notes
- Prewarm budgets and preload caps were not expanded; startup/theater guardrails remain unchanged.
