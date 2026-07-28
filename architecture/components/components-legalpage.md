# Legal Page

Source: `src/components/LegalPage.tsx`

## Role
Renders privacy and content usage pages from legal data with bilingual alternates, table of contents, and legal contact blocks.

## Structural Facts
- Lines: 304
- Category: `code`
- Language: `typescript`
- Layer: Dynamic Page Factories
- Change risk: Low

## Exports
- None detected.

## Local Functions
- `buildUrl`
- `LegalPage`

## Classes
- None detected.

## Depends On
- `src/components/motion/PretextLineReveal.tsx`
- `src/components/Navbar.tsx`
- `src/components/PageSeo.tsx`
- `src/components/SiteFooter.tsx`
- `src/data/legal-pages.ts`
- `src/lib/locale-path.ts`

## Imported By
- None detected.

## Forensic Coupling Notes
- It is content-driven and should be reviewed with the data modules it imports.
- It is route/locale aware and may affect canonical or bilingual navigation behavior.
- It relies on the shared motion layer for reveal behavior or timing.

## How It Works With The Website
Renders privacy and content usage pages from legal data with bilingual alternates, table of contents, and legal contact blocks. It should be read together with its dependency list above, because this app favors composition through typed data modules, shared media primitives, and global route utilities instead of isolated standalone pages.

## Maintenance Checkpoints
- Before editing, inspect every importer listed above.
- If the file touches media, test mobile memory and autoplay behavior.
- If the file touches locale paths or SEO, verify Spanish and English routes plus canonical alternates.
- If the file is a UI primitive, search for all consumers before changing variants or class names.

## Parser Snapshot
```json
{
  "metrics": {
    "importCount": 6,
    "exportCount": 0,
    "functionCount": 2,
    "classCount": 0
  },
  "functions": [
    "buildUrl",
    "LegalPage"
  ],
  "exports": [],
  "classes": []
}
```
