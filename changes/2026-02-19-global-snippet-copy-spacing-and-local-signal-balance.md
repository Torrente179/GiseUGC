# 2026-02-19 - Global Snippet Copy Spacing + Local Signal Balance

## Summary
Refined metadata copy to keep Spanish first with readable bilingual spacing and removed Medellin/Colombia from public share snippets for stronger global-market positioning, while keeping local-presence signals in structured data.

## Changes Made

### 1. Spanish-First + Proper Bilingual Spacing
- Updated all key metadata strings to use `Espanol / English` (with spacing):
  - `<title>`
  - `meta[name="description"]`
  - `og:title`, `og:description`
  - `twitter:title`, `twitter:description`

### 2. Global-Market Snippet Positioning
- Removed `Medellin, Colombia` references from social/search snippet copy.
- Updated messaging to global positioning:
  - "para marcas globales"
  - "UGC creator for global campaigns"

### 3. Keep Local SEO Signals (not snippet-facing)
- Preserved local-strength signals in structured data (address, geo tags) to support local discoverability without forcing local wording into share cards.

## Files Updated
- `index.html`

## Validation
- `npm run build` completed successfully.
