# Context Menu

Source: `src/components/ui/context-menu.tsx`

## Role
Reusable shadcn/Radix UI primitive wrapper. It keeps visual classes and local utility composition centralized for Context Menu.

## Structural Facts
- Lines: 198
- Category: `code`
- Language: `typescript`
- Layer: Motion and Design System
- Change risk: Low

## Exports
- `ContextMenu`
- `ContextMenuTrigger`
- `ContextMenuContent`
- `ContextMenuItem`
- `ContextMenuCheckboxItem`
- `ContextMenuRadioItem`
- `ContextMenuLabel`
- `ContextMenuSeparator`
- `ContextMenuShortcut`
- `ContextMenuGroup`
- `ContextMenuPortal`
- `ContextMenuSub`
- `ContextMenuSubContent`
- `ContextMenuSubTrigger`
- `ContextMenuRadioGroup`

## Local Functions
- `ContextMenuShortcut`

## Classes
- None detected.

## Depends On
- `src/lib/utils.ts`

## Imported By
- None detected.

## Forensic Coupling Notes
- It is a primitive dependency; styling changes can ripple into any consumer.

## How It Works With The Website
Reusable shadcn/Radix UI primitive wrapper. It keeps visual classes and local utility composition centralized for Context Menu. It should be read together with its dependency list above, because this app favors composition through typed data modules, shared media primitives, and global route utilities instead of isolated standalone pages.

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
    "exportCount": 15,
    "functionCount": 1,
    "classCount": 0
  },
  "functions": [
    "ContextMenuShortcut"
  ],
  "exports": [
    "ContextMenu",
    "ContextMenuTrigger",
    "ContextMenuContent",
    "ContextMenuItem",
    "ContextMenuCheckboxItem",
    "ContextMenuRadioItem",
    "ContextMenuLabel",
    "ContextMenuSeparator",
    "ContextMenuShortcut",
    "ContextMenuGroup",
    "ContextMenuPortal",
    "ContextMenuSub",
    "ContextMenuSubContent",
    "ContextMenuSubTrigger",
    "ContextMenuRadioGroup"
  ],
  "classes": []
}
```
