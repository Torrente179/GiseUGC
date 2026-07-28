# Switch

Source: `src/components/ui/switch.tsx`

## Role
Reusable shadcn/Radix UI primitive wrapper. It keeps visual classes and local utility composition centralized for Switch.

## Structural Facts
- Lines: 27
- Category: `code`
- Language: `typescript`
- Layer: Motion and Design System
- Change risk: Low

## Exports
- `Switch`

## Local Functions
- None detected.

## Classes
- None detected.

## Depends On
- `src/lib/utils.ts`

## Imported By
- None detected.

## Forensic Coupling Notes
- It is a primitive dependency; styling changes can ripple into any consumer.

## How It Works With The Website
Reusable shadcn/Radix UI primitive wrapper. It keeps visual classes and local utility composition centralized for Switch. It should be read together with its dependency list above, because this app favors composition through typed data modules, shared media primitives, and global route utilities instead of isolated standalone pages.

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
    "exportCount": 1,
    "functionCount": 0,
    "classCount": 0
  },
  "functions": [],
  "exports": [
    "Switch"
  ],
  "classes": []
}
```
