# Internal Linking Sections — UX Polish

## Summary
Redesigned the "By Industry" and "Resources" internal linking sections on all service landing pages. The original implementation used an undefined `st-cta-secondary` CSS class, resulting in invisible/unstyled links on desktop and visually monotonous row-lists on mobile.

## What changed

### Desktop (≥768px)
**Before:** Two separate `st-section` blocks with unstyled `st-cta-secondary` links (no CSS definition existed — links were invisible plain text with zero padding, border, or hover state)

**After:** Single unified "Explorar" section using `st-section--warm` background for visual separation, with a two-column `st-explore-grid`:
- **Left column:** "Por industria" — vertical page links using the site's established `st-related-row` pattern (hover indent + arrow animation)
- **Right column:** "Recursos" — resource article links using the same `st-related-row` pattern
- Contrast overrides placed after base `st-related` rules to ensure proper specificity in both light and dark themes

### Mobile (<768px)
**Before:** Two identical `stm-all-services` row-lists stacked consecutively — visually indistinguishable from the "También ofrezco" service list, creating monotony

**After:** Single `.stm-explore` section with:
- Section title in Cormorant Garamond
- **Verticals:** Horizontal-wrap pill tags (`.stm-explore-pill`) — tactile browse feel, distinct from row lists
- **Resources:** Row-link list (`.stm-service-row`) — reading material feel with arrows
- Sub-labels (`.stm-explore-sublabel`) in small uppercase to separate the two groups

### CSS additions
**Desktop classes:** `st-explore-grid`, `st-explore-col`, `st-explore-label`, plus `st-section--warm .st-related-*` contrast overrides (0.7 opacity for titles, 0.3 for arrows, 0.12 for borders)

**Mobile classes:** `stm-explore`, `stm-explore-title`, `stm-explore-sublabel`, `stm-explore-pills`, `stm-explore-pill`

### Deleted
- All usage of `st-cta-secondary` class (never had a CSS definition)

## Files changed
- `src/components/ServiceLandingPage.tsx` — restructured desktop D5b+D5c and mobile M3b+M3c sections
- `src/index.css` — added explore section styles for both desktop and mobile layouts

## Design decisions
- Reuses the site's existing `st-related-row` pattern (already proven in the close/CTA section) rather than inventing new components
- Combines industries + resources into one section to reduce page length and avoid three consecutive identical-looking list sections
- Pills for verticals vs rows for resources creates visual variety and communicates different affordances (browse vs read)
- `st-section--warm` background provides the same visual break used in other alternating sections throughout the site
