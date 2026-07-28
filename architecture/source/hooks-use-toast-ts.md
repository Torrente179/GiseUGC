# Use Toast

Source: `src/hooks/use-toast.ts`

## Role
Custom React hook that encapsulates reusable browser/runtime behavior for the app.

## Layer
Interaction and Performance Utilities

## Structural Facts
- Lines: 191
- Category: `code`
- Language: `typescript`
- Change risk: Medium

## Exports
- `reducer`
- `useToast`
- `toast`

## Local Functions
- `genId`
- `addToRemoveQueue`
- `reducer`
- `dispatch`
- `toast`
- `useToast`

## Depends On
- `src/components/ui/toast.tsx`

## Imported By
- `src/components/ui/toaster.tsx`
- `src/components/ui/use-toast.ts`

## Forensic Notes
- It centralizes behavior used across components, so importer count matters more than file size.
