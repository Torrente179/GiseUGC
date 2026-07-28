# App

Source: `src/App.tsx`

## Role
Owns app-level routing, locale synchronization, scroll restoration, route-level lazy loading, analytics, speed insights, and mobile media diagnostics.

## Layer
Bootstrap and Providers

## Structural Facts
- Lines: 261
- Category: `code`
- Language: `typescript`
- Change risk: High

## Exports
- None detected.

## Local Functions
- `jumpToY`
- `scrollToSection`
- `AppRoutes`
- `App`

## Depends On
- `src/components/ThemeRuntimeSync.tsx`
- `src/lib/locale-path.ts`
- `src/lib/perf-debug.ts`
- `src/lib/referral-attribution.ts`
- `src/pages/Index.tsx`

## Imported By
- `src/main.tsx`

## Forensic Notes
- It is route/locale aware and can affect bilingual navigation or canonical behavior.
