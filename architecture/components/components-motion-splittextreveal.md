# Split Text Reveal

Source: `src/components/motion/SplitTextReveal.tsx`

## Role
Motion helper or reveal primitive used to keep animation timing, easing, and text entrance behavior consistent across the site.

## Structural Facts
- Lines: 79
- Category: `code`
- Language: `typescript`
- Layer: Motion and Design System
- Change risk: High

## Exports
- None detected.

## Local Functions
- `SplitTextReveal`

## Classes
- None detected.

## Depends On
- `src/components/motion/variants.ts`
- `src/lib/utils.ts`

## Imported By
- `src/components/FAQ.tsx`
- `src/components/Portfolio.tsx`
- `src/components/Services.tsx`
- `src/components/Testimonials.tsx`

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
    "importCount": 2,
    "exportCount": 0,
    "functionCount": 1,
    "classCount": 0
  },
  "functions": [
    "SplitTextReveal"
  ],
  "exports": [],
  "classes": []
}
```
