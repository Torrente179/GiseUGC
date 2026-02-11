# 2026-02-11 - Nordic Prestige Font System Update

## Summary
Replaced the previous typography stack with the requested Nordic prestige pairing:
- `Playfair Display` for editorial/high-impact headings.
- `Inter` for navigation, labels, body copy, and UI text.
- `Alex Brush` for the hero signature accent (`Saldarriaga`).

## Changes Made
1. Global font imports
- Updated Google Fonts in `index.html` to load:
  - Playfair Display (roman + italic)
  - Inter
  - Alex Brush

2. Tailwind font tokens
- Updated `tailwind.config.ts`:
  - `fontFamily.serif` -> Playfair Display
  - `fontFamily.sans` -> Inter
  - `fontFamily.script` -> Alex Brush

3. Typography role mapping in base styles
- Updated `src/index.css`:
  - `body`, `p` use Inter.
  - `.brand-logo` uses Playfair Display.
  - `h1` and `.hero-title` use Playfair Display.
  - `.section-label` uses Inter with stronger tracked uppercase styling.
  - `.luxury-accent` uses Alex Brush.
  - `.font-playfair` and `.font-cormorant` utility aliases now point to Playfair Display.

4. Component-level alignment
- `src/components/SocialProof.tsx`:
  - Stat numbers now explicitly use serif styling (Playfair role).
- `src/components/Testimonials.tsx`:
  - Quote text now explicitly uses serif italic styling.
- `src/components/Navbar.tsx`:
  - Mobile nav link typography set to sans treatment for the modern Nordic UI role.

5. Build unblock fix
- `src/index.css`:
  - Replaced invalid Tailwind utility `bg-card/82` with valid `bg-card/80` in `.studio-panel` to restore build success.

## Files Updated
- `index.html`
- `tailwind.config.ts`
- `src/index.css`
- `src/components/Navbar.tsx`
- `src/components/SocialProof.tsx`
- `src/components/Testimonials.tsx`
- `changes/2026-02-11-nordic-prestige-font-system.md`

## Validation
- Ran `npm run build` successfully.
