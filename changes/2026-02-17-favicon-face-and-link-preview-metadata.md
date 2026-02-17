# 2026-02-17 - Face Favicon + Link Preview Metadata Hardening

## Summary
Configured the site favicon to use Gisela's face from the hero image and strengthened social link preview metadata so pasted URLs render a reliable title, description, and image across WhatsApp, Telegram, LinkedIn, and iMessage.

## Changes Made

### 1. Face-Based Favicon Set
- Generated a complete favicon set from the hero/OG face crop:
  - `public/favicon-16x16.png`
  - `public/favicon-32x32.png`
  - `public/favicon-192.png`
  - `public/favicon-512.png`
  - `public/apple-touch-icon.png`
  - `public/favicon.ico` (updated)
- Added explicit favicon links in `index.html` for modern browsers and Apple devices.

### 2. Social Preview Metadata Improvements
- Updated canonical URL to `https://www.giselasaldarriaga.com/`.
- Added/updated metadata for better parser compatibility:
  - `meta[name="description"]`
  - `meta[name="robots"]`
  - `link[rel="canonical"]`
  - `meta[property="og:url"]`
  - `meta[property="og:image"]`
  - `meta[property="og:image:secure_url"]`
  - `meta[property="og:image:alt"]`
  - `meta[name="twitter:url"]`
  - `meta[name="twitter:image"]`
  - `meta[name="twitter:image:alt"]`
- Normalized OG/Twitter image references to absolute HTTPS URLs on the canonical host.

### 3. Domain Check During Verification
- Verified that `giseugc.com` / `www.giseugc.com` do not currently resolve via DNS.
- Confirmed the active deploy is reachable on `www.giselasaldarriaga.com`.

## Files Updated
- `index.html` — favicon links, canonical, robots, and OG/Twitter metadata improvements
- `public/favicon.ico` — updated icon resource
- `public/apple-touch-icon.png` — new
- `public/favicon-16x16.png` — new
- `public/favicon-32x32.png` — new
- `public/favicon-192.png` — new
- `public/favicon-512.png` — new

## Validation
- `npm run build` completed successfully.
