# 2026-02-18 - Theater Close Scroll Jump Fix

## Summary
Fixed a Theater mode close behavior where the page visibly jumped to the top and then back to the Portfolio section.

## Root Cause
- Global smooth scrolling is enabled on the root element (`html { scroll-behavior: smooth; }`).
- On Theater close, scroll lock cleanup restores the saved Y position via `window.scrollTo(0, scrollY)`.
- Because smooth scrolling was active, that restoration animated instead of applying instantly, creating a noticeable jump effect.

## Changes Made
- Updated Theater scroll-lock cleanup in `src/components/Portfolio.tsx`.
- Saved and restored `htmlElement.style.scrollBehavior` during cleanup.
- Temporarily forced `htmlElement.style.scrollBehavior = 'auto'` only for the `window.scrollTo(0, scrollY)` call.
- Restored the previous scroll behavior immediately after restoring scroll position.

## Files Updated
- `src/components/Portfolio.tsx`
- `changes/2026-02-18-theater-close-scroll-jump-fix.md`

## Validation
- `npm run build` completed successfully.
