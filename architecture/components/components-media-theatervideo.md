# Theater Video

Source: `src/components/media/TheaterVideo.tsx`

## Role
Full video playback primitive with source fallback, play/mute controls, startup retry, and unmount cleanup.

## Structural Facts
- Lines: 258
- Category: `code`
- Language: `typescript`
- Layer: Media and Video System
- Change risk: Medium

## Exports
- None detected.

## Local Functions
- None detected.

## Classes
- None detected.

## Depends On
- `src/lib/utils.ts`

## Imported By
- `src/components/ServiceLandingPage.tsx`
- `src/components/VerticalLandingPage.tsx`

## Forensic Coupling Notes
- Its coupling is mostly local according to the current import graph.

## How It Works With The Website
Full video playback primitive with source fallback, play/mute controls, startup retry, and unmount cleanup. It should be read together with its dependency list above, because this app favors composition through typed data modules, shared media primitives, and global route utilities instead of isolated standalone pages.

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
    "functionCount": 0,
    "classCount": 0
  },
  "functions": [],
  "exports": [],
  "classes": []
}
```
