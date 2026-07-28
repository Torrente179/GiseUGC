# Use Deferred Mount

Source: `src/hooks/use-deferred-mount.tsx`

## Role
Custom React hook that encapsulates reusable browser/runtime behavior for the app.

## Layer
Interaction and Performance Utilities

## Structural Facts
- Lines: 103
- Category: `code`
- Language: `typescript`
- Change risk: Medium

## Exports
- `useDeferredMount`

## Local Functions
- `useDeferredMount`

## Depends On
- `src/lib/perf-debug.ts`

## Imported By
- `src/pages/Index.tsx`

## Forensic Notes
- It centralizes behavior used across components, so importer count matters more than file size.
