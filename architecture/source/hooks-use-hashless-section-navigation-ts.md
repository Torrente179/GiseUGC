# Use Hashless Section Navigation

Source: `src/hooks/use-hashless-section-navigation.ts`

## Role
Custom React hook that encapsulates reusable browser/runtime behavior for the app.

## Layer
Interaction and Performance Utilities

## Structural Facts
- Lines: 110
- Category: `code`
- Language: `typescript`
- Change risk: High

## Exports
- `clearUrlHash`
- `useHashlessSectionNavigation`

## Local Functions
- `stripHashFromUrl`
- `clearUrlHash`
- `cancelActiveScroll`
- `premiumEaseScroll`
- `smoothScrollTo`
- `useHashlessSectionNavigation`

## Depends On
- None detected.

## Imported By
- `src/components/CreatorAdvantage.tsx`
- `src/components/FAQ.tsx`
- `src/components/Hero.tsx`
- `src/components/Navbar.tsx`
- `src/pages/Index.tsx`

## Forensic Notes
- It centralizes behavior used across components, so importer count matters more than file size.
