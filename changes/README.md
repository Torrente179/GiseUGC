# Changes Workflow

Use this folder for chronological implementation notes (`YYYY-MM-DD-<slug>.md`).

## Mobile Regression Guardrail

For any change that touches carousel, touch/drag input, smooth scrolling, or section loading behavior:

1. Run:
   ```bash
   npm run check:mobile-regression
   ```
2. Copy the generated block from:
   - `tmp/mobile-regression/latest.md`
3. Paste it into the current `changes/<date>-<slug>.md` entry under a section named:
   - `## Mobile Regression Checklist`
4. Fill out the manual iPhone Safari checks before merging.

## Why this exists

Recent regressions came from mobile-only interaction differences (viewport changes, touch axis locking, and carousel offset resets). This checklist keeps every related update verifiable with the same baseline.

