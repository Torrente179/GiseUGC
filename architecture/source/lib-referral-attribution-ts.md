# Referral Attribution

Source: `src/lib/referral-attribution.ts`

## Role
Runtime utility module shared by components, hooks, or route logic.

## Layer
Interaction and Performance Utilities

## Structural Facts
- Lines: 62
- Category: `code`
- Language: `typescript`
- Change risk: Medium

## Exports
- `getChatGptReferralContext`

## Local Functions
- `parseHostname`
- `isChatGptHost`
- `getChatGptReferralContext`

## Depends On
- None detected.

## Imported By
- `src/App.tsx`

## Forensic Notes
- It participates in route-level app orchestration.
- It centralizes behavior used across components, so importer count matters more than file size.
