# Theme Flicker Fix + SPA Navigation

**Date:** 2026-03-22

## Problem 1: Theme flicker on service pages

Service pages flashed light theme before switching to dark when the user's system preference was dark mode.

**Root cause:** The inline theme detection script in all 17 non-home HTML files (16 service pages + `en/index.html`) only checked `storedTheme === 'dark'`. When next-themes stored `'system'` (the default), the script:
- Ignored the system preference and forced light mode
- Overwrote localStorage with `'light'`, breaking the preference
- React then mounted, next-themes detected actual system preference, and switched to dark - causing a visible flash

**Fix:** Updated all 17 HTML files to use the same correct detection script as the home page, which checks `matchMedia('(prefers-color-scheme: dark)')` for system preference fallback.

**Files changed:**
- `en/index.html`
- All 8 `servicios/*/index.html`
- All 8 `en/services/*/index.html`

## Problem 2: Choppy page transitions

Navigation between home and service pages caused full page reloads with visible white flash, re-parsing JS, and re-mounting React.

**Root cause:** All internal navigation used plain `<a href>` tags instead of React Router's `<Link>` component, triggering full document loads despite React Router already having client-side routes configured.

**Fix:** Converted all internal links to use React Router:
- `Navbar.tsx` - Nav links, logo, hire-me button use `useNavigate()` with `event.preventDefault()`
- `ServiceLandingPage.tsx` - Breadcrumbs and related service links use `<Link to>`
- `Services.tsx` - Service cards use `motion.create(Link)` instead of `motion.a`
- `Footer.tsx` - Service links use `<Link to>`
- `NotFound.tsx` - Home link uses `<Link to>`
- Language switcher uses `navigate()` instead of `window.location.assign()`
