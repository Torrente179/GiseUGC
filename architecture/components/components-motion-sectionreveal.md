# Section Reveal

Source: `src/components/motion/SectionReveal.tsx`

## Role
Motion helper or reveal primitive used to keep animation timing, easing, and text entrance behavior consistent across the site.

## Structural Facts
- Lines: 169
- Category: `code`
- Language: `typescript`
- Layer: Motion and Design System
- Change risk: Low

## Exports
- `SectionReveal`
- `SectionRevealItem`

## Local Functions
- `getDirectionalVariants`
- `SectionReveal`
- `SectionRevealItem`

## Classes
- None detected.

## Depends On
- `src/components/motion/variants.ts`

## Imported By
- None detected.

## Forensic Coupling Notes
- It relies on the shared motion layer for reveal behavior or timing.

## How It Works With The Website
Motion helper or reveal primitive used to keep animation timing, easing, and text entrance behavior consistent across the site. It should be read together with its dependency list above, because this app favors composition through typed data modules, shared media primitives, and global route utilities instead of isolated standalone pages.

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
    "exportCount": 2,
    "functionCount": 3,
    "classCount": 0
  },
  "functions": [
    "getDirectionalVariants",
    "SectionReveal",
    "SectionRevealItem"
  ],
  "exports": [
    "SectionReveal",
    "SectionRevealItem"
  ],
  "classes": []
}
```
