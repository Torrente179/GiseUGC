# Fix: Service proof meta chips invisible in dark mode

**Date:** 2026-03-22
**File:** `src/index.css`

## Problem

The `.st-proof-meta-chip` badges (duration like "33s" and language like "ESPAÑOL") below service proof video clips were invisible in dark mode. The background used `--pure-linen` (nearly white) and the text color resolved to a light value via `--foreground`, making both blend into the dark page background.

## Fix

Added `.dark .st-proof-meta-chip` override with:
- Semi-transparent light border (`pure-linen / 0.15`)
- Subtle frosted background (`pure-linen / 0.06`)
- Legible light text (`pure-linen / 0.55`)

This matches the style convention used by `.st-chip--dark` and `.theater-meta-chip` dark mode variants already in the codebase.
