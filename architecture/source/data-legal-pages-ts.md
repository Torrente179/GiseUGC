# Legal Pages

Source: `src/data/legal-pages.ts`

## Role
Typed content or media data module consumed by route factories or homepage sections.

## Layer
Content Data Model

## Structural Facts
- Lines: 592
- Category: `code`
- Language: `typescript`
- Change risk: Medium

## Exports
- `getLegalPageContent`

## Local Functions
- `getLegalPageContent`

## Depends On
- `src/lib/locale-path.ts`

## Imported By
- `src/components/LegalPage.tsx`

## Forensic Notes
- It is route/locale aware and can affect bilingual navigation or canonical behavior.
- It is part of the typed content model; schema changes ripple into page factories.
