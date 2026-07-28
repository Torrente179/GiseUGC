# Theme Toggle

Source: `src/components/ThemeToggle.tsx`

## Role
Controls light/dark theme selection from the navigation controls. It is a small UI component, but it participates in the global theme system through next-themes and shared button styling.

## Structural Facts
- Lines: 143
- Category: `code`
- Language: `typescript`
- Layer: Motion and Design System
- Change risk: Medium

## Exports
- None detected.

## Local Functions
- `ThemeToggle`

## Classes
- None detected.

## Depends On
- `src/lib/utils.ts`

## Imported By
- `src/components/NavbarControls.tsx`

## Forensic Coupling Notes
- Its coupling is mostly local according to the current import graph.

## How It Works With The Website
Controls light/dark theme selection from the navigation controls. It is a small UI component, but it participates in the global theme system through next-themes and shared button styling. It should be read together with its dependency list above, because this app favors composition through typed data modules, shared media primitives, and global route utilities instead of isolated standalone pages.

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
    "functionCount": 1,
    "classCount": 0
  },
  "functions": [
    "ThemeToggle"
  ],
  "exports": [],
  "classes": []
}
```
