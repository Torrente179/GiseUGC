# Locale Path

Source: `src/lib/locale-path.ts`

## Role
Central source of truth for bilingual route paths, path normalization, route id lookup, localized alternates, and route entry generation.

## Layer
Routing and URL Model

## Structural Facts
- Lines: 244
- Category: `code`
- Language: `typescript`
- Change risk: High

## Exports
- `normalizePathname`
- `getLocaleFromPath`
- `isHomePath`
- `getHomePath`
- `getCanonicalLocaleHref`
- `getHomeSectionHref`
- `getServicePath`
- `getVerticalPath`
- `getResourcePath`
- `getLegalPath`
- `getServicePageIdFromPath`
- `getVerticalPageIdFromPath`
- `getResourcePageIdFromPath`
- `getLegalPageIdFromPath`
- `getLocalizedPathForCurrentRoute`
- `getAllServicePaths`
- `getAllVerticalPaths`
- `getAllResourcePaths`
- `getAllLegalPaths`
- `getServicePageRouteEntries`
- `getVerticalPageRouteEntries`
- `getResourcePageRouteEntries`
- `getLegalPageRouteEntries`

## Local Functions
- `normalizeHash`
- `normalizePathname`
- `getLocaleFromPath`
- `isHomePath`
- `getHomePath`
- `getCanonicalLocaleHref`
- `getHomeSectionHref`
- `getServicePath`
- `getVerticalPath`
- `getResourcePath`
- `getLegalPath`
- `getPageIdFromPath`
- `getServicePageIdFromPath`
- `getVerticalPageIdFromPath`
- `getResourcePageIdFromPath`
- `getLegalPageIdFromPath`
- `getLocalizedPathForCurrentRoute`
- `getAllServicePaths`
- `getAllVerticalPaths`
- `getAllResourcePaths`
- `getAllLegalPaths`
- `getServicePageRouteEntries`
- `getVerticalPageRouteEntries`
- `getResourcePageRouteEntries`
- `getLegalPageRouteEntries`

## Depends On
- None detected.

## Imported By
- `src/App.tsx`
- `src/components/FAQ.tsx`
- `src/components/Footer.tsx`
- `src/components/Hero.tsx`
- `src/components/LegalPage.tsx`
- `src/components/Navbar.tsx`
- `src/components/NavbarControls.tsx`
- `src/components/PageEndStrip.tsx`
- `src/components/ResourcePage.tsx`
- `src/components/ServiceLandingPage.tsx`
- `src/components/Services.tsx`
- `src/components/VerticalLandingPage.tsx`
- `src/data/legal-pages.ts`
- `src/data/resource-pages.ts`
- `src/data/service-pages.ts`
- `src/data/vertical-pages.ts`
- `src/pages/Index.tsx`
- `src/pages/NotFound.tsx`

## Forensic Notes
- It participates in route-level app orchestration.
- It centralizes behavior used across components, so importer count matters more than file size.
