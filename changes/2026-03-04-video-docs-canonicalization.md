# 2026-03-04 - Video Docs Canonicalization

## Summary
Normalized video documentation so one canonical spec is clear and older conflicting notes are explicitly marked historical/superseded.

## What changed
1. Canonical reference strengthened
- Updated `video-encoding-tracking-setup-guide.md` with:
  - explicit status as source of truth
  - superseded-doc index
  - concrete current encode defaults from `scripts/encode-videos.sh`
  - explicit note that theater source order is main-first with mobile fallback

2. R2 routing history clarified
- Updated `2026-02-17-r2-video-routing-previews-main-posters.md`:
  - added historical/superseded status
  - corrected path examples to include `/videos/` prefix
  - corrected network verification URL examples

3. Source-priority history clarified
- Added superseded status to:
  - `2026-02-17-mobile-theater-source-priority-switch.md`
  - `2026-02-19-mobile-theater-source-priority-fix.md`

4. Iterative prewarm log clarified
- Updated `2026-02-19-portfolio-prewarm-viewport-gating.md`:
  - added explicit status section explaining final effective sections
  - marked the older mobile-first restore subsection as superseded

## Result
- Readers now have a single reliable current spec.
- Historical context is retained without ambiguous conflicting guidance.
