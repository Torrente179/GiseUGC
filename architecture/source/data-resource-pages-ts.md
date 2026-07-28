# Resource Pages

Source: `src/data/resource-pages.ts`

## Role
Typed content or media data module consumed by route factories or homepage sections.

## Layer
Content Data Model

## Structural Facts
- Lines: 1030
- Category: `code`
- Language: `typescript`
- Change risk: Medium

## Exports
- `ResourcePageId`
- `getResourcePath`
- `getResourcePageContent`
- `getAllResourceIds`

## Local Functions
- `getResourcePageContent`
- `getAllResourceIds`

## Depends On
- `src/lib/locale-path.ts`

## Imported By
- `src/components/ResourcePage.tsx`

## Forensic Notes
- It is route/locale aware and can affect bilingual navigation or canonical behavior.
- It is part of the typed content model; schema changes ripple into page factories.
