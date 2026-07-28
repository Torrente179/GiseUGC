# Portfolio

Source: `src/components/Portfolio.tsx`

## Role
Interactive reel portfolio with daily shuffle, lazy video cards, prewarming, mobile carousel state, and full-screen theater interactions.

## Structural Facts
- Lines: 1477
- Category: `code`
- Language: `typescript`
- Layer: Homepage Composition
- Change risk: Medium

## Exports
- None detected.

## Local Functions
- `getLqip`
- `getUtcDayBucket`
- `shuffleWithSeed`
- `Portfolio`

## Classes
- None detected.

## Depends On
- `src/components/media/LazyVideo.tsx`
- `src/components/motion/SplitTextReveal.tsx`
- `src/components/motion/variants.ts`
- `src/data/nuevos-r2-ready.ts`
- `src/data/portfolio-clips.ts`
- `src/data/video-lqip.ts`
- `src/hooks/use-mobile.tsx`

## Imported By
- `src/pages/Index.tsx` (lazy dynamic import)

## Forensic Coupling Notes
- It is directly part of the homepage render tree through a lazy dynamic import.
- It is content-driven and should be reviewed with the data modules it imports.
- It participates in the media-heavy path, so memory, autoplay, and mobile behavior matter.
- It relies on the shared motion layer for reveal behavior or timing.

## How It Works With The Website
Interactive reel portfolio with daily shuffle, lazy video cards, prewarming, mobile carousel state, and full-screen theater interactions. It should be read together with its dependency list above, because this app favors composition through typed data modules, shared media primitives, and global route utilities instead of isolated standalone pages.

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
    "getLqip",
    "getUtcDayBucket",
    "shuffleWithSeed",
    "Portfolio"
  ],
  "exports": [],
  "classes": []
}
```
