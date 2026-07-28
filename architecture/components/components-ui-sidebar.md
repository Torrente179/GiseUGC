# Sidebar

Source: `src/components/ui/sidebar.tsx`

## Role
Reusable shadcn/Radix UI primitive wrapper. It keeps visual classes and local utility composition centralized for Sidebar.

## Structural Facts
- Lines: 761
- Category: `code`
- Language: `typescript`
- Layer: Motion and Design System
- Change risk: Low

## Exports
- `Sidebar`
- `SidebarContent`
- `SidebarFooter`
- `SidebarGroup`
- `SidebarGroupAction`
- `SidebarGroupContent`
- `SidebarGroupLabel`
- `SidebarHeader`
- `SidebarInput`
- `SidebarInset`
- `SidebarMenu`
- `SidebarMenuAction`
- `SidebarMenuBadge`
- `SidebarMenuButton`
- `SidebarMenuItem`
- `SidebarMenuSkeleton`
- `SidebarMenuSub`
- `SidebarMenuSubButton`
- `SidebarMenuSubItem`
- `SidebarProvider`
- `SidebarRail`
- `SidebarSeparator`
- `SidebarTrigger`
- `useSidebar`

## Local Functions
- `useSidebar`

## Classes
- None detected.

## Depends On
- `src/components/ui/button.tsx`
- `src/components/ui/input.tsx`
- `src/components/ui/separator.tsx`
- `src/components/ui/sheet.tsx`
- `src/components/ui/skeleton.tsx`
- `src/components/ui/tooltip.tsx`
- `src/hooks/use-mobile.tsx`
- `src/lib/utils.ts`

## Imported By
- None detected.

## Forensic Coupling Notes
- It is a primitive dependency; styling changes can ripple into any consumer.

## How It Works With The Website
Reusable shadcn/Radix UI primitive wrapper. It keeps visual classes and local utility composition centralized for Sidebar. It should be read together with its dependency list above, because this app favors composition through typed data modules, shared media primitives, and global route utilities instead of isolated standalone pages.

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
    "exportCount": 24,
    "functionCount": 1,
    "classCount": 0
  },
  "functions": [
    "useSidebar"
  ],
  "exports": [
    "Sidebar",
    "SidebarContent",
    "SidebarFooter",
    "SidebarGroup",
    "SidebarGroupAction",
    "SidebarGroupContent",
    "SidebarGroupLabel",
    "SidebarHeader",
    "SidebarInput",
    "SidebarInset",
    "SidebarMenu",
    "SidebarMenuAction",
    "SidebarMenuBadge",
    "SidebarMenuButton",
    "SidebarMenuItem",
    "SidebarMenuSkeleton",
    "SidebarMenuSub",
    "SidebarMenuSubButton",
    "SidebarMenuSubItem",
    "SidebarProvider",
    "SidebarRail",
    "SidebarSeparator",
    "SidebarTrigger",
    "useSidebar"
  ],
  "classes": []
}
```
