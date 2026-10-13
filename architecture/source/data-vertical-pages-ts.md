# Vertical Pages

Source: `src/data/vertical-pages.ts`

## Role
Typed content or media data module consumed by route factories or homepage sections.

## Layer
Content Data Model

## Structural Facts
- Lines: 1365
- Category: `code`
- Language: `typescript`
- Change risk: Medium

## Exports
- `getVerticalPageContent`
- `getVerticalPageRouteEntries`
- `getAllVerticalIds`

## Local Functions
- `getVerticalPageContent`
- `getVerticalPageRouteEntries`
- `getAllVerticalIds`

## Depends On
- `src/lib/locale-path.ts`

## Imported By
- `src/components/ResourcePage.tsx`
- `src/components/ServiceLandingPage.tsx`
- `src/components/VerticalLandingPage.tsx`

## Forensic Notes
- It is route/locale aware and can affect bilingual navigation or canonical behavior.
- It is part of the typed content model; schema changes ripple into page factories.
- Beauty, fashion, tech/SaaS, and lifestyle/wellness `sectionIntroText` (ES+EN) each close with two money-page markdown links: bilingüe service + how-to-hire guide. Ecommerce does not. Anchors are locked in `src/data/faq-schema-and-links.test.tsx`. Do not rewrite Juan's surrounding paragraph.
