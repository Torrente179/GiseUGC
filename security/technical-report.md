# Technical Security Report

Date: 2026-02-19  
Project: GiseUGC  
Assessed surfaces: frontend codebase, Vercel runtime behavior, Cloudflare/R2 media access model, dependency chain.

## 1. Architecture and Trust Boundaries

- Frontend is a static Vite React app.
- Runtime media sources are loaded from `media.giselasaldarriaga.com`.
- Full reels are represented by `videos/main/*` and `videos/mobile/*`.
- Preview/poster assets are represented by `videos/previews/*` and `videos/posters/*`.
- No user-auth backend existed in-repo prior to this change.

## 2. High-Risk Findings (Pre-Implementation)

1. Public full-video path exposure:
   - Full assets were accessible by direct URL enumeration.
   - Impact: scraping/rehosting, cost increase from automated fetches.
2. Missing hardened response header policy:
   - No strong CSP/frame/referrer/mime policies at edge.
   - Impact: weaker browser-side hardening.
3. No automated anti-spike mode:
   - No threshold-triggered under-attack activation and no auto-revert flow.
   - Impact: delayed response to fake traffic storms.

## 3. Implemented Controls

### 3.1 Signed Media Session

- Added `api/media/session.ts`:
  - Generates short-lived HMAC signed URLs for protected media paths.
  - Returns payload:
    - `issuedAt`
    - `expiresAt`
    - `refreshAfterMs`
    - `mainVideoUrls` map keyed by media path.
- Added frontend session client in `src/lib/media-session.ts`.
- Integrated in `src/components/Portfolio.tsx`:
  - Silent session warm-up.
  - Background session refresh.
  - Signed source prewarm and playback.
  - Preview fallback if full-video signed source fails.

### 3.2 Header Hardening

- Added `vercel.json` with:
  - `Content-Security-Policy`
  - `X-Content-Type-Options`
  - `X-Frame-Options`
  - `Referrer-Policy`
  - `Permissions-Policy`
  - `Strict-Transport-Security`

### 3.3 Cloudflare Automation

- Added baseline configs:
  - `security/config/rate-limit-baseline.json`
  - `security/config/custom-firewall-baseline.json`
- Added scripts:
  - `security/scripts/apply-cloudflare-baseline.mjs`
  - `security/scripts/monitor-cloudflare-spike.mjs`
  - `security/scripts/lib/cloudflare-client.mjs`
- Added workflows:
  - `.github/workflows/cloudflare-apply-baseline.yml`
  - `.github/workflows/cloudflare-spike-monitor.yml`

### 3.4 Worker Enforcement Template

- Added Worker template:
  - `security/cloudflare/worker/media-gateway/src/index.ts`
  - `security/cloudflare/worker/media-gateway/wrangler.toml.example`
- Worker validates:
  - `st` signature
  - `exp` expiration
  - path-bound token payload (`<mediaPath>:<exp>`).

## 4. Operational Logic: Emergency Auto-Mode

- Evaluate 3 consecutive windows (5m each).
- Trigger if each window breaches at least 2 of 4 signals:
  - requests/min vs 7-day same-hour median
  - cache-miss/min vs median
  - unique IPs/min vs median
  - 4xx ratio > 35%
- Emergency actions:
  - `security_level = under_attack`
  - rate limits tightened to 60%
- Recovery:
  - if last 2 windows normalize, restore baseline thresholds and base security level.

## 5. Dependency and Supply-Chain Note

- Audit output previously indicated outdated and vulnerable transitive packages.
- This pass focused on traffic-abuse and media hardening without dependency upgrades.
- Recommended next pass: controlled dependency remediation with regression testing.

## 6. Residual Risk

1. If Cloudflare Worker is not deployed to `/videos/main/*`, signed URLs alone do not enforce protection.
2. If zone proxy for `www` remains disabled, fake traffic can still hit Vercel more directly.
3. Token issuance endpoint remains unauthenticated by design; edge rate limits are mandatory to constrain abuse.

## 7. Verification Targets

1. `/api/media/session` responds with valid payload.
2. Worker denies unsigned/expired `/videos/main/*` access.
3. Portfolio playback remains smooth and fallback-safe.
4. Monitor workflow executes every 5 minutes and logs decisions.
