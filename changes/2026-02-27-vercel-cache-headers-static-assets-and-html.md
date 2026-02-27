# 2026-02-27 - Vercel Cache Headers for Static Assets + HTML

## Summary
Improved cache policy on Vercel to better match the current Vite build output and reduce repeat-load latency without risking stale deploys.

## Changes Made

### 1. Long-term immutable cache for fingerprinted Vite assets
- Added header rule:
  - `source: /assets/(.*)`
  - `Cache-Control: public, max-age=31536000, immutable`
- This applies to content-hashed JS/CSS chunks emitted by Vite and allows browsers/CDN to reuse them aggressively.

### 2. Short-lived HTML with edge revalidation behavior
- Added header rules:
  - `source: /`
  - `source: /index.html`
  - `Cache-Control: public, max-age=0, must-revalidate, s-maxage=60, stale-while-revalidate=300`
- This keeps HTML fresh across deployments while still allowing short edge caching and fast revalidation.

### 3. Preserved existing security baseline
- Existing global security headers in `vercel.json` were left unchanged.

## Why this change
- Current app delivery is Vite static assets on Vercel + media on Cloudflare R2.
- Video/poster assets on `media.giselasaldarriaga.com` are already edge-cached by Cloudflare.
- The main optimization gap was app-shell/static asset caching strategy at the web origin layer.

## Expected Impact
- Faster repeat visits and route loads due to immutable caching of hashed bundles.
- Reduced unnecessary revalidation for static chunks.
- Safe deploy behavior because HTML remains revalidated frequently.

## Files Updated
- `vercel.json`
- `changes/2026-02-27-vercel-cache-headers-static-assets-and-html.md`
