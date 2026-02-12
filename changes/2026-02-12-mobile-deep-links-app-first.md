# 2026-02-12 - Mobile Deep Links: App-First Social Icons

## Summary
On mobile, social icon links now open the native app (Instagram, TikTok, WhatsApp, Telegram, etc.) if installed, falling back to the browser version if not.

## How It Works
Removed `target="_blank"` and `rel="noopener noreferrer"` from all mobile-rendered social links. Without `target="_blank"`, iOS and Android can intercept the navigation via Universal Links / App Links and hand it off to the native app. If the app isn't installed, the browser loads the URL normally.

Desktop links keep `target="_blank"` to open in new tabs as expected.

## Changes Made
- `src/components/FloatingContactDock.tsx` — mobile bubble links (md:hidden section) no longer use `target="_blank"`
- `src/components/Navbar.tsx` — mobile menu contact grid no longer uses `target="_blank"`
- `src/components/Footer.tsx` — mobile footer social icons (md:hidden section) no longer use `target="_blank"`

## Validation
- `npm run build` completed successfully.
- Desktop links still open in new tabs (target="_blank" preserved).
- Mobile links navigate in-page, allowing OS universal link interception.
