# Perf Debug

Source: `src/lib/perf-debug.ts`

## Role
Runtime utility module shared by components, hooks, or route logic.

## Layer
Interaction and Performance Utilities

## Structural Facts
- Lines: 146
- Category: `code`
- Language: `typescript`
- Change risk: High

## Exports
- `mark`
- `measure`
- `startLongTaskObserver`
- `logMobileMediaPressureSnapshot`
- `startMobileMediaPressureObserver`

## Local Functions
- `mark`
- `measure`
- `startLongTaskObserver`
- `shouldEnableMobilePerfDebug`
- `isMobileViewport`
- `getBufferedSeconds`
- `getHeapUsedMb`
- `logMobileMediaPressureSnapshot`
- `startMobileMediaPressureObserver`

## Depends On
- None detected.

## Imported By
- `src/App.tsx`
- `src/components/ServicesMarquee.tsx`
- `src/hooks/use-deferred-mount.tsx`
- `src/pages/Index.tsx`

## Forensic Notes
- It participates in route-level app orchestration.
- It centralizes behavior used across components, so importer count matters more than file size.
