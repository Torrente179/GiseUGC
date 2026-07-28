# FAQ

Source: `src/components/FAQ.tsx`

## Role
FAQ belongs to the Homepage Composition layer. The home page sections, social proof, service cards, portfolio entrypoints, FAQ, testimonials, contact CTA, navbar, and footer composition.

## Structural Facts
- Lines: 95
- Category: `code`
- Language: `typescript`
- Layer: Homepage Composition
- Change risk: Low

## Exports
- None detected.

## Local Functions
- `FAQ`

## Classes
- None detected.

## Depends On
- `src/components/motion/SplitTextReveal.tsx`
- `src/components/motion/variants.ts`
- `src/components/ui/accordion.tsx`
- `src/hooks/use-hashless-section-navigation.ts`
- `src/lib/locale-path.ts`

## Imported By
- None detected.

## Forensic Coupling Notes
- It is route/locale aware and may affect canonical or bilingual navigation behavior.
- It relies on the shared motion layer for reveal behavior or timing.

## How It Works With The Website
FAQ belongs to the Homepage Composition layer. The home page sections, social proof, service cards, portfolio entrypoints, FAQ, testimonials, contact CTA, navbar, and footer composition. It should be read together with its dependency list above, because this app favors composition through typed data modules, shared media primitives, and global route utilities instead of isolated standalone pages.

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
    "functionCount": 1,
    "classCount": 0
  },
  "functions": [
    "FAQ"
  ],
  "exports": [],
  "classes": []
}
```
