# 2026-02-19 - Anti-Cost Spike Hardening + Signed Media Sessions

## Summary
Implemented a low-friction security hardening pass focused on reducing fake-traffic cost spikes and protecting full-quality video assets without degrading user experience.

Main UX guarantee:
- No login flow added
- No visible challenge/CAPTCHA in normal operation
- Theater playback remains smooth with silent session warmup + refresh

## What Changed

### 1. Signed media session API (full-video protection foundation)
- Added:
  - `api/media/session.ts`
- New endpoint:
  - `GET /api/media/session`
- Response:
  - `issuedAt`
  - `expiresAt`
  - `refreshAfterMs`
  - `mainVideoUrls` (signed URL map)
- Behavior:
  - Issues short-lived signed URLs for `videos/main/*` and `videos/mobile/*`
  - Uses HMAC (`st` + `exp`) signing
  - Supports origin allowlist checks

### 2. Frontend signed-session client
- Added:
  - `src/lib/media-session.ts`
- Features:
  - In-memory session cache
  - Deduplicated session requests
  - Safe early-refresh behavior before token expiry
  - Utility to map original media URL to signed URL

### 3. Portfolio integration (frictionless flow)
- Updated:
  - `src/components/Portfolio.tsx`
- Behavior changes:
  - Silent media session warmup on near-viewport/idle
  - Background session refresh timer
  - Interaction and theater prewarm now use signed full-video URLs when available
  - Theater sources now include preview fallback to avoid user-facing stall
  - No visible security friction added

### 4. Vercel hardening headers + function runtime
- Added:
  - `vercel.json`
- Includes:
  - CSP
  - `X-Content-Type-Options`
  - `X-Frame-Options`
  - `Referrer-Policy`
  - `Permissions-Policy`
  - HSTS
- Configured API runtime profile for `api/**/*.ts`.

### 5. Cloudflare baseline anti-spike automation
- Added configs:
  - `security/config/rate-limit-baseline.json`
  - `security/config/custom-firewall-baseline.json`
- Added scripts:
  - `security/scripts/apply-cloudflare-baseline.mjs`
  - `security/scripts/monitor-cloudflare-spike.mjs`
  - `security/scripts/lib/cloudflare-client.mjs`
- Baseline controls included:
  - `/api/media/session` rate limit
  - `/videos/main/*` rate limit
  - HTML and static burst rate limits
  - unexpected method blocking
  - common exploit path blocking

### 6. Emergency auto-mode (Cloudflare Under Attack)
- Added monitor logic to:
  - evaluate 5-minute windows against 7-day same-hour medians
  - trigger emergency mode when sustained anomaly thresholds are breached
  - tighten rate limits to 60% in emergency mode
  - auto-revert when traffic normalizes

### 7. GitHub workflow automation
- Added:
  - `.github/workflows/cloudflare-spike-monitor.yml` (every 5 minutes)
  - `.github/workflows/cloudflare-apply-baseline.yml` (manual apply)

### 8. Cloudflare Worker template for protected main media
- Added:
  - `security/cloudflare/worker/media-gateway/src/index.ts`
  - `security/cloudflare/worker/media-gateway/wrangler.toml.example`
  - `security/cloudflare/worker/media-gateway/README.md`
- Worker contract:
  - route: `media.giselasaldarriaga.com/videos/main/*`
  - validates `st` and `exp`
  - serves private R2 object only when token is valid

### 9. Security documentation and deliverables
- Added:
  - `security/executive-summary.md`
  - `security/technical-report.md`
  - `security/risk-register.csv`
  - `security/cost-spike-playbook.md`
  - `security/rate-limit-tuning-log.md`
  - `security/vercel-firewall-rules.md`
  - `security/README.md`

### 10. Project wiring and docs
- Added:
  - `.env.example`
- Updated:
  - `.gitignore` (allow `.env.example`)
  - `package.json` (security scripts)
  - `README.md` (security commands + overview)

## Commands Added
- `npm run security:cf:baseline:dry`
- `npm run security:cf:baseline:apply`
- `npm run security:cf:monitor:dry`
- `npm run security:cf:monitor:apply`

## Validation Snapshot
- `npm run build` passes.
- Security script dry-run payload generation passes.
- Targeted typecheck for new media session files passes.
- Existing lint errors remain in unrelated UI files:
  - `src/components/ui/command.tsx`
  - `src/components/ui/textarea.tsx`

## External Platform Steps Still Required
1. Configure Vercel env vars (`MEDIA_SESSION_SECRET`, etc.).
2. Proxy `www.giselasaldarriaga.com` through Cloudflare.
3. Deploy Worker route for `/videos/main/*`.
4. Configure Cloudflare/GitHub secrets for automation.
5. Apply Vercel firewall dashboard rules from `security/vercel-firewall-rules.md`.
