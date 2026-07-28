# Footer

Source: `src/components/Footer.tsx`

## Role
Footer belongs to the Homepage Composition layer. The home page sections, social proof, service cards, portfolio entrypoints, FAQ, testimonials, contact CTA, navbar, and footer composition.

## Structural Facts
- Lines: 137
- Category: `code`
- Language: `typescript`
- Layer: Homepage Composition
- Change risk: Medium

## Exports
- None detected.

## Local Functions
- `Footer`

## Classes
- None detected.

## Depends On
- `src/lib/locale-path.ts`

## Imported By
- `src/components/SiteFooter.tsx`

## Forensic Coupling Notes
- It is route/locale aware and may affect canonical or bilingual navigation behavior.

## How It Works With The Website
Footer belongs to the Homepage Composition layer. The home page sections, social proof, service cards, portfolio entrypoints, FAQ, testimonials, contact CTA, navbar, and footer composition. It should be read together with its dependency list above, because this app favors composition through typed data modules, shared media primitives, and global route utilities instead of isolated standalone pages.

## Maintenance Checkpoints
- Before editing, inspect every importer listed above.
- If the file touches media, test mobile memory and autoplay behavior.
- If the file touches locale paths or SEO, verify Spanish and English routes plus canonical alternates.
- If the file is a UI primitive, search for all consumers before changing variants or class names.

## Parser Snapshot
```json
{
  "metrics": {
    "importCount": 1,
    "exportCount": 0,
    "functionCount": 1,
    "classCount": 0
  },
  "functions": [
    "Footer"
  ],
  "exports": [],
  "classes": []
}
```
