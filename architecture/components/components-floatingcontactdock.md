# Floating Contact Dock

Source: `src/components/FloatingContactDock.tsx`

## Role
Floating Contact Dock belongs to the Homepage Composition layer. The home page sections, social proof, service cards, portfolio entrypoints, FAQ, testimonials, contact CTA, navbar, and footer composition.

## Structural Facts
- Lines: 363
- Category: `code`
- Language: `typescript`
- Layer: Homepage Composition
- Change risk: Low

## Exports
- None detected.

## Local Functions
- `ThreadsIcon`
- `FloatingContactDock`

## Classes
- None detected.

## Depends On
- `src/components/motion/variants.ts`
- `src/lib/contact-dock.ts`

## Imported By
- None detected.

## Forensic Coupling Notes
- It uses the custom contact dock event bus.
- It relies on the shared motion layer for reveal behavior or timing.

## How It Works With The Website
Floating Contact Dock belongs to the Homepage Composition layer. The home page sections, social proof, service cards, portfolio entrypoints, FAQ, testimonials, contact CTA, navbar, and footer composition. It should be read together with its dependency list above, because this app favors composition through typed data modules, shared media primitives, and global route utilities instead of isolated standalone pages.

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
    "exportCount": 0,
    "functionCount": 2,
    "classCount": 0
  },
  "functions": [
    "ThreadsIcon",
    "FloatingContactDock"
  ],
  "exports": [],
  "classes": []
}
```
