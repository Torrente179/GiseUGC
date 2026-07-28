# Autoplay Preview Video

Source: `src/components/media/AutoplayPreviewVideo.tsx`

## Role
Muted looping preview video primitive for service/vertical proof cards that resumes playback after visibility and page lifecycle changes.

## Structural Facts
- Lines: 103
- Category: `code`
- Language: `typescript`
- Layer: Media and Video System
- Change risk: Medium

## Exports
- None detected.

## Local Functions
- `AutoplayPreviewVideo`

## Classes
- None detected.

## Depends On
- None detected.

## Imported By
- `src/components/ServiceLandingPage.tsx`
- `src/components/VerticalLandingPage.tsx`

## Forensic Coupling Notes
- Its coupling is mostly local according to the current import graph.

## How It Works With The Website
Muted looping preview video primitive for service/vertical proof cards that resumes playback after visibility and page lifecycle changes. It should be read together with its dependency list above, because this app favors composition through typed data modules, shared media primitives, and global route utilities instead of isolated standalone pages.

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
    "functionCount": 1,
    "classCount": 0
  },
  "functions": [
    "AutoplayPreviewVideo"
  ],
  "exports": [],
  "classes": []
}
```
