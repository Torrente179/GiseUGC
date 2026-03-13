# Changes

This folder is organized by subsystem instead of by date.

## Structure

- `architecture/`
  - Start here for the current site map, section order, and project-level working rules.
- `ui/`
  - Hero, navbar, footer, contact flows, FAQ, rating cards, motion polish, and visual evolution.
- `carousel-functionality/`
  - Services marquee, swipe behavior, loop logic, resize stability, and regression guidance.
- `video-functionality/`
  - Portfolio theater, reel catalog, R2 gating, transcript-driven naming, and the encoding pipeline.
- `seo/`
  - Canonicals, metadata, schema, crawlability, and language-routing behavior.
- `deployment/`
  - Hosting, caching, security hardening, and runtime instrumentation.

## Logging Rule

1. Find the closest subsystem file and append the update there.
2. Create a new file only when the change introduces a genuinely new subsystem, not a one-off tweak.
3. Keep related iterations together even when they happen on different days.

## Mobile Regression Guardrail

For any change that touches carousel, touch/drag input, smooth scrolling, or section loading behavior:

1. Run:
   ```bash
   npm run check:mobile-regression
   ```
2. Copy the generated block from:
   - `tmp/mobile-regression/latest.md`
3. Paste it into the matching file under `changes/carousel-functionality/` or `changes/ui/` beneath:
   - `## Mobile Regression Checklist`
4. Fill out the manual iPhone Safari checks before merging.

## Why this exists

Recent regressions came from mobile-only interaction differences such as viewport changes, touch axis locking, and carousel offset resets. Grouping notes by subsystem makes it easier to see how a behavior evolved before changing it again.
