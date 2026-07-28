# Navbar

Source: `src/components/Navbar.tsx`

## Role
Navbar belongs to the Homepage Composition layer. The home page sections, social proof, service cards, portfolio entrypoints, FAQ, testimonials, contact CTA, navbar, and footer composition.

## Structural Facts
- Lines: 627
- Category: `code`
- Language: `typescript`
- Layer: Homepage Composition
- Change risk: High

## Exports
- None detected.

## Local Functions
- `ThreadsIcon`
- `Navbar`

## Classes
- None detected.

## Depends On
- `src/components/motion/variants.ts`
- `src/components/NavbarControls.tsx`
- `src/hooks/use-hashless-section-navigation.ts`
- `src/lib/locale-path.ts`
- `src/lib/utils.ts`

## Imported By
- `src/components/LegalPage.tsx`
- `src/components/ResourcePage.tsx`
- `src/components/ServiceLandingPage.tsx`
- `src/components/VerticalLandingPage.tsx`
- `src/pages/Index.tsx`

## Forensic Coupling Notes
- It is directly part of the homepage render tree.
- It is route/locale aware and may affect canonical or bilingual navigation behavior.
- It relies on the shared motion layer for reveal behavior or timing.

## How It Works With The Website
Navbar belongs to the Homepage Composition layer. The home page sections, social proof, service cards, portfolio entrypoints, FAQ, testimonials, contact CTA, navbar, and footer composition. It should be read together with its dependency list above, because this app favors composition through typed data modules, shared media primitives, and global route utilities instead of isolated standalone pages.

## Maintenance Checkpoints
- Before editing, inspect every importer listed above.
- If the file touches media, test mobile memory and autoplay behavior.
- If the file touches locale paths or SEO, verify Spanish and English routes plus canonical alternates.
- If the file is a UI primitive, search for all consumers before changing variants or class names.

## Parser Snapshot
```json
{
  "metrics": {
    "importCount": 5,
    "exportCount": 0,
    "functionCount": 2,
    "classCount": 0
  },
  "functions": [
    "ThreadsIcon",
    "Navbar"
  ],
  "exports": [],
  "classes": []
}
```
