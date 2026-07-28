# Pagination

Source: `src/components/ui/pagination.tsx`

## Role
Reusable shadcn/Radix UI primitive wrapper. It keeps visual classes and local utility composition centralized for Pagination.

## Structural Facts
- Lines: 117
- Category: `code`
- Language: `typescript`
- Layer: Motion and Design System
- Change risk: Low

## Exports
- `Pagination`
- `PaginationContent`
- `PaginationEllipsis`
- `PaginationItem`
- `PaginationLink`
- `PaginationNext`
- `PaginationPrevious`

## Local Functions
- `Pagination`
- `PaginationLink`
- `PaginationPrevious`
- `PaginationNext`
- `PaginationEllipsis`

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
Reusable shadcn/Radix UI primitive wrapper. It keeps visual classes and local utility composition centralized for Pagination. It should be read together with its dependency list above, because this app favors composition through typed data modules, shared media primitives, and global route utilities instead of isolated standalone pages.

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
    "exportCount": 7,
    "functionCount": 5,
    "classCount": 0
  },
  "functions": [
    "Pagination",
    "PaginationLink",
    "PaginationPrevious",
    "PaginationNext",
    "PaginationEllipsis"
  ],
  "exports": [
    "Pagination",
    "PaginationContent",
    "PaginationEllipsis",
    "PaginationItem",
    "PaginationLink",
    "PaginationNext",
    "PaginationPrevious"
  ],
  "classes": []
}
```
