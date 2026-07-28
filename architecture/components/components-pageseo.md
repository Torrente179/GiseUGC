# Page Seo

Source: `src/components/PageSeo.tsx`

## Role
Mutates document head metadata, canonical and hreflang links, Open Graph/Twitter tags, and route-specific JSON-LD.

## Structural Facts
- Lines: 113
- Category: `code`
- Language: `typescript`
- Layer: SEO, Static Assets, and Deployment
- Change risk: High

## Exports
- None detected.

## Local Functions
- `upsertMeta`
- `upsertLink`
- `PageSeo`

## Classes
- None detected.

## Depends On
- None detected.

## Imported By
- `src/components/LegalPage.tsx`
- `src/components/ResourcePage.tsx`
- `src/components/ServiceLandingPage.tsx`
- `src/components/VerticalLandingPage.tsx`
- `src/pages/Index.tsx`

## Forensic Coupling Notes
- It is directly part of the homepage render tree.
- It mutates document head state and must clean up structured data on route changes.

## How It Works With The Website
Mutates document head metadata, canonical and hreflang links, Open Graph/Twitter tags, and route-specific JSON-LD. It should be read together with its dependency list above, because this app favors composition through typed data modules, shared media primitives, and global route utilities instead of isolated standalone pages.

## Maintenance Checkpoints
- Before editing, inspect every importer listed above.
- If the file touches media, test mobile memory and autoplay behavior.
- If the file touches locale paths or SEO, verify Spanish and English routes plus canonical alternates.
- If the file is a UI primitive, search for all consumers before changing variants or class names.

## Parser Snapshot
```json
{
  "metrics": {
    "importCount": 0,
    "exportCount": 0,
    "functionCount": 3,
    "classCount": 0
  },
  "functions": [
    "upsertMeta",
    "upsertLink",
    "PageSeo"
  ],
  "exports": [],
  "classes": []
}
```
