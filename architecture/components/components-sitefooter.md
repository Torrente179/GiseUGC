# Site Footer

Source: `src/components/SiteFooter.tsx`

## Role
Site Footer belongs to the Homepage Composition layer. The home page sections, social proof, service cards, portfolio entrypoints, FAQ, testimonials, contact CTA, navbar, and footer composition.

## Structural Facts
- Lines: 13
- Category: `code`
- Language: `typescript`
- Layer: Homepage Composition
- Change risk: High

## Exports
- `SHOW_SITE_FOOTER`

## Local Functions
- `SiteFooter`

## Classes
- None detected.

## Depends On
- `src/components/Footer.tsx`
- `src/components/PageEndStrip.tsx`

## Imported By
- `src/components/LegalPage.tsx`
- `src/components/ResourcePage.tsx`
- `src/components/ServiceLandingPage.tsx`
- `src/components/VerticalLandingPage.tsx`
- `src/pages/Index.tsx`

## Forensic Coupling Notes
- It is directly part of the homepage render tree.

## How It Works With The Website
Site Footer belongs to the Homepage Composition layer. The home page sections, social proof, service cards, portfolio entrypoints, FAQ, testimonials, contact CTA, navbar, and footer composition. It should be read together with its dependency list above, because this app favors composition through typed data modules, shared media primitives, and global route utilities instead of isolated standalone pages.

## Maintenance Checkpoints
- Before editing, inspect every importer listed above.
- If the file touches media, test mobile memory and autoplay behavior.
- If the file touches locale paths or SEO, verify Spanish and English routes plus canonical alternates.
- If the file is a UI primitive, search for all consumers before changing variants or class names.

## Parser Snapshot
```json
{
  "metrics": {
    "importCount": 2,
    "exportCount": 1,
    "functionCount": 1,
    "classCount": 0
  },
  "functions": [
    "SiteFooter"
  ],
  "exports": [
    "SHOW_SITE_FOOTER"
  ],
  "classes": []
}
```
