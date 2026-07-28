# Aspect Ratio

Source: `src/components/ui/aspect-ratio.tsx`

## Role
Reusable shadcn/Radix UI primitive wrapper. It keeps visual classes and local utility composition centralized for Aspect Ratio.

## Structural Facts
- Lines: 5
- Category: `code`
- Language: `typescript`
- Layer: Motion and Design System
- Change risk: Low

## Exports
- `AspectRatio`

## Local Functions
- None detected.

## Classes
- None detected.

## Depends On
- None detected.

## Imported By
- None detected.

## Forensic Coupling Notes
- It is a primitive dependency; styling changes can ripple into any consumer.

## How It Works With The Website
Reusable shadcn/Radix UI primitive wrapper. It keeps visual classes and local utility composition centralized for Aspect Ratio. It should be read together with its dependency list above, because this app favors composition through typed data modules, shared media primitives, and global route utilities instead of isolated standalone pages.

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
    "exportCount": 1,
    "functionCount": 0,
    "classCount": 0
  },
  "functions": [],
  "exports": [
    "AspectRatio"
  ],
  "classes": []
}
```
