# Pretext Line Reveal

Source: `src/components/motion/PretextLineReveal.tsx`

## Role
Motion helper or reveal primitive used to keep animation timing, easing, and text entrance behavior consistent across the site.

## Structural Facts
- Lines: 220
- Category: `code`
- Language: `typescript`
- Layer: Motion and Design System
- Change risk: High

## Exports
- None detected.

## Local Functions
- `getPixelValue`
- `getLineHeight`
- `getCanvasFont`
- `haveSameLines`
- `PretextLineReveal`

## Classes
- None detected.

## Depends On
- `src/lib/utils.ts`

## Imported By
- `src/components/CreatorAdvantage.tsx`
- `src/components/Hero.tsx`
- `src/components/HeroIntroduction.tsx`
- `src/components/LegalPage.tsx`
- `src/components/ServiceLandingPage.tsx`

## Forensic Coupling Notes
- Its coupling is mostly local according to the current import graph.

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
    "exportCount": 0,
    "functionCount": 5,
    "classCount": 0
  },
  "functions": [
    "getPixelValue",
    "getLineHeight",
    "getCanvasFont",
    "haveSameLines",
    "PretextLineReveal"
  ],
  "exports": [],
  "classes": []
}
```
