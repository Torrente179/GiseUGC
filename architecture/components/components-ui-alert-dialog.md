# Alert Dialog

Source: `src/components/ui/alert-dialog.tsx`

## Role
Reusable shadcn/Radix UI primitive wrapper. It keeps visual classes and local utility composition centralized for Alert Dialog.

## Structural Facts
- Lines: 139
- Category: `code`
- Language: `typescript`
- Layer: Motion and Design System
- Change risk: Low

## Exports
- `AlertDialog`
- `AlertDialogPortal`
- `AlertDialogOverlay`
- `AlertDialogTrigger`
- `AlertDialogContent`
- `AlertDialogHeader`
- `AlertDialogFooter`
- `AlertDialogTitle`
- `AlertDialogDescription`
- `AlertDialogAction`
- `AlertDialogCancel`

## Local Functions
- `AlertDialogHeader`
- `AlertDialogFooter`

## Classes
- None detected.

## Depends On
- `src/components/ui/button.tsx`
- `src/lib/utils.ts`

## Imported By
- None detected.

## Forensic Coupling Notes
- It is a primitive dependency; styling changes can ripple into any consumer.

## How It Works With The Website
Reusable shadcn/Radix UI primitive wrapper. It keeps visual classes and local utility composition centralized for Alert Dialog. It should be read together with its dependency list above, because this app favors composition through typed data modules, shared media primitives, and global route utilities instead of isolated standalone pages.

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
    "exportCount": 11,
    "functionCount": 2,
    "classCount": 0
  },
  "functions": [
    "AlertDialogHeader",
    "AlertDialogFooter"
  ],
  "exports": [
    "AlertDialog",
    "AlertDialogPortal",
    "AlertDialogOverlay",
    "AlertDialogTrigger",
    "AlertDialogContent",
    "AlertDialogHeader",
    "AlertDialogFooter",
    "AlertDialogTitle",
    "AlertDialogDescription",
    "AlertDialogAction",
    "AlertDialogCancel"
  ],
  "classes": []
}
```
