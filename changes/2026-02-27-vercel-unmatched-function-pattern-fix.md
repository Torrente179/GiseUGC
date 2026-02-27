# 2026-02-27 - Vercel unmatched function pattern fix

## Summary

Fixed Vercel deployment failure caused by a stale `functions` pattern in `vercel.json` after removing the `api/` directory.

## What changed

- Updated `/vercel.json`:
  - Removed:
    - `functions.api/**/*.ts.maxDuration`

## Why

Vercel validates `functions` globs at build time. Since there are no Serverless Functions in `api/`, the pattern `api/**/*.ts` fails with:

- `The pattern "api/**/*.ts" defined in functions doesn't match any Serverless Functions inside the api directory.`

## Impact

- Restores successful Vercel builds/deployments.
- Keeps existing global security headers unchanged.
