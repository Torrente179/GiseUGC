# Index

Source: `src/pages/Index.tsx`

## Role
Composes the homepage and controls which sections are eagerly rendered, lazy loaded, or deferred between mobile and desktop.

## Layer
Routing and URL Model

## Structural Facts
- Lines: 218
- Category: `code`
- Language: `typescript`
- Change risk: Medium

## Exports
- None detected.

## Local Functions
- `DeferredSection`

## Depends On
- `src/components/CreatorAdvantage.tsx`
- `src/components/Hero.tsx`
- `src/components/motion/FadeInOnMount.tsx`
- `src/components/motion/SectionSkeleton.tsx`
- `src/components/Navbar.tsx`
- `src/components/PageSeo.tsx`
- `src/components/SiteFooter.tsx`
- `src/hooks/use-deferred-mount.tsx`
- `src/hooks/use-hashless-section-navigation.ts`
- `src/hooks/use-mobile.tsx`
- `src/lib/locale-path.ts`
- `src/lib/perf-debug.ts`

## Imported By
- `src/App.tsx`

## Forensic Notes
- It participates in route-level app orchestration.
- It is route/locale aware and can affect bilingual navigation or canonical behavior.
