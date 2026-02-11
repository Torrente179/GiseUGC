# Mobile Services Grid and Hero Refinement (2026-02-11)

## Overview
Added a dedicated services grid for mobile users in the Hero section and refined the layout of the Services section to improve visibility and accessibility on smaller screens.

## Changes

### 1. Hero Component (`src/components/Hero.tsx`)
- **Removed Scroll Prompt**: Deleted the "EXPLORA MIS SERVICIOS" prompt and arrow from the bottom of the hero section to simplify the initial view.
- **Added Mobile Services Grid**: Implemented a responsive 2-column grid visible only on mobile devices.
  - Includes icons, titles, and brief descriptions for all 6 core services.
  - Uses glassmorphism styling (`backdrop-blur-md`, `bg-card/40`) to match the premium aesthetic.
  - Replaced the scroll prompt with direct access to services.

### 2. Services Component (`src/components/Services.tsx`)
- **Restructured Grid for Mobile**: Changed the grid from 1 column to 2 columns on mobile devices (`grid-cols-2`).
- **Responsive Sizing**: Adjusted padding, icon sizes, and typography for better fit on small screens.
- **Content Clamping**: Applied `line-clamp-3` to service descriptions on mobile to ensure uniform card heights.

## Aesthetic Impact
- **Immediate Value**: Mobile users now see the range of services immediately without needing to scroll past the hero fold.
- **Consistency**: The rounded corners and card styles align with the "Nordic Luxe" design system established across the site.
- **Better Performance**: Replaced the absolute-positioned scroll prompt with functional layout elements.
