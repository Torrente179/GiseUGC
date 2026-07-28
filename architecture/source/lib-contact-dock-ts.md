# Contact Dock

Source: `src/lib/contact-dock.ts`

## Role
Runtime utility module shared by components, hooks, or route logic.

## Layer
Interaction and Performance Utilities

## Structural Facts
- Lines: 58
- Category: `code`
- Language: `typescript`
- Change risk: High

## Exports
- `openContactDock`
- `toggleContactDock`
- `onContactDockAction`
- `consumePendingContactDockAction`
- `isMobileViewport`

## Local Functions
- `dispatchContactDockAction`
- `openContactDock`
- `toggleContactDock`
- `onContactDockAction`
- `consumePendingContactDockAction`
- `isMobileViewport`

## Depends On
- None detected.

## Imported By
- `src/components/CreatorAdvantage.tsx`
- `src/components/FloatingContactDock.tsx`
- `src/components/Hero.tsx`
- `src/components/MobileContactCtaSection.tsx`

## Forensic Notes
- It centralizes behavior used across components, so importer count matters more than file size.
