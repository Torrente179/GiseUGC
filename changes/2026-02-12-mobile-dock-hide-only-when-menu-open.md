# 2026-02-12 - Mobile Dock Visibility While Hamburger Menu Is Open

## Summary
Adjusted contact bubble behavior so floating bubbles remain visible on the site by default, and are only hidden when the mobile hamburger menu is open (where the same contact actions are shown inside the menu).

## Changes Made
1. Mobile menu state hook
- Added a body class toggle tied to hamburger menu state:
  - `mobile-menu-open` is added when menu is open.
  - Removed when menu closes/unmounts.
- Implemented in `src/components/Navbar.tsx`.

2. Floating contact dock rendering
- Restored mobile floating dock rendering (previous always-visible site behavior).
- Kept desktop horizontal dock unchanged.
- Added a stable class selector to target dock visibility transitions:
  - `floating-contact-dock`
- Implemented in `src/components/FloatingContactDock.tsx`.

3. Mobile-only hide rule while menu is open
- Added CSS rule to hide/fade the floating dock only on mobile when body has `mobile-menu-open`.
- Implemented in `src/index.css`.

## Files Updated
- `src/components/Navbar.tsx`
- `src/components/FloatingContactDock.tsx`
- `src/index.css`
- `changes/2026-02-12-mobile-dock-hide-only-when-menu-open.md`

## Validation
- `npm run build` completed successfully.
