# Resource Page

Source: `src/components/ResourcePage.tsx`

## Role
Renders editorial resource articles from typed content, related services/verticals, FAQ schema, and CTA links.

## Structural Facts
- Lines: 467
- Category: `code`
- Language: `typescript`
- Layer: Dynamic Page Factories
- Change risk: Low

## Exports
- None detected.

## Local Functions
- `buildUrl`
- `useScrollReveal`
- `RevealSection`
- `ResourcePage`

## Classes
- None detected.

## Depends On
- `src/components/Navbar.tsx`
- `src/components/PageSeo.tsx`
- `src/components/SiteFooter.tsx`
- `src/data/resource-pages.ts`
- `src/data/service-pages.ts`
- `src/data/vertical-pages.ts`
- `src/lib/locale-path.ts`

## Imported By
- None detected.

## Forensic Coupling Notes
- It is content-driven and should be reviewed with the data modules it imports.
- It is route/locale aware and may affect canonical or bilingual navigation behavior.

## How It Works With The Website
Renders editorial resource articles from typed content, related services/verticals, FAQ schema, and CTA links. It should be read together with its dependency list above, because this app favors composition through typed data modules, shared media primitives, and global route utilities instead of isolated standalone pages.

## Maintenance Checkpoints
- Before editing, inspect every importer listed above.
- If the file touches media, test mobile memory and autoplay behavior.
- If the file touches locale paths or SEO, verify Spanish and English routes plus canonical alternates.
- If the file is a UI primitive, search for all consumers before changing variants or class names.

## Parser Snapshot
```json
{
  "metrics": {
    "importCount": 7,
    "exportCount": 0,
    "functionCount": 4,
    "classCount": 0
  },
  "functions": [
    "buildUrl",
    "useScrollReveal",
    "RevealSection",
    "ResourcePage"
  ],
  "exports": [],
  "classes": []
}
```
