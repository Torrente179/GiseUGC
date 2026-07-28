# Hero

Source: `src/components/Hero.tsx`

## Role
Homepage first viewport: daily rotating video wall, localized hero copy, portfolio/contact CTAs, and desktop introduction handoff.

## Structural Facts
- Lines: 186
- Category: `code`
- Language: `typescript`
- Layer: Homepage Composition
- Change risk: Medium

## Exports
- None detected.

## Local Functions
- `shuffleWithSeed`
- `Hero`

## Classes
- None detected.

## Depends On
- `src/components/HeroWallTile.tsx`
- `src/components/motion/PretextLineReveal.tsx`
- `src/data/nuevos-r2-ready.ts`
- `src/data/portfolio-clips.ts`
- `src/hooks/use-hashless-section-navigation.ts`
- `src/hooks/use-mobile.tsx`
- `src/lib/contact-dock.ts`
- `src/lib/locale-path.ts`

## Imported By
- `src/pages/Index.tsx`

## Forensic Coupling Notes
- It is directly part of the homepage render tree.
- It is content-driven and should be reviewed with the data modules it imports.
- It is route/locale aware and may affect canonical or bilingual navigation behavior.
- It uses the custom contact dock event bus.
- It relies on the shared motion layer for reveal behavior or timing.

## How It Works With The Website
Homepage first viewport: daily rotating video wall, localized hero copy, portfolio/contact CTAs, and desktop introduction handoff. It should be read together with its dependency list above, because this app favors composition through typed data modules, shared media primitives, and global route utilities instead of isolated standalone pages.

## Maintenance Checkpoints
- Before editing, inspect every importer listed above.
- If the file touches media, test mobile memory and autoplay behavior.
- If the file touches locale paths or SEO, verify Spanish and English routes plus canonical alternates.
- If the file is a UI primitive, search for all consumers before changing variants or class names.

## Parser Snapshot
```json
{
  "metrics": {
    "importCount": 8,
    "exportCount": 0,
    "functionCount": 2,
    "classCount": 0
  },
  "functions": [
    "shuffleWithSeed",
    "Hero"
  ],
  "exports": [],
  "classes": []
}
```
