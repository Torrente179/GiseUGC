# Security Hardening Kit (Low-Friction)

This folder contains the implementation artifacts for anti-cost-spike protection and signed media access.

## What Was Implemented

- Signed media session API:
  - `GET /api/media/session`
  - Returns short-lived signed URLs for protected full videos.
- Frontend session integration:
  - Background session warmup and refresh.
  - Signed full-video playback with preview fallback.
- Vercel headers baseline:
  - Added in `vercel.json`.
- Cloudflare automation:
  - Baseline rate-limit + firewall scripts.
  - Emergency monitor script with auto-enable/auto-revert support.
  - GitHub Actions workflows for baseline apply and every-5-min monitoring.
- Cloudflare Worker template for protected `/videos/main/*` token validation.
- Vercel Firewall manual rule set in `security/vercel-firewall-rules.md`.

## Required Runtime Configuration

### Vercel Environment Variables

- `MEDIA_SESSION_SECRET` (required): shared HMAC secret used by API + Worker.
- `MEDIA_BASE_URL` (optional): defaults to `https://media.giselasaldarriaga.com`.
- `MEDIA_SESSION_TTL_SECONDS` (optional): default `900`.
- `MEDIA_SESSION_REFRESH_SECONDS` (optional): default `540`.
- `MEDIA_SESSION_ALLOWED_ORIGINS` (optional): comma-separated allowed origins.

### Cloudflare / GitHub Secrets

- `CF_API_TOKEN`: token with Zone Rulesets + Zone Settings write permission.
- `CF_ZONE_ID`: zone id for `giselasaldarriaga.com`.
- `CF_ALERT_WEBHOOK` (optional): Slack/Discord-compatible webhook.
- `CF_BASE_SECURITY_LEVEL` (optional GitHub variable): default `medium`.

## Cloudflare Apply Commands

Dry run baseline payload:

```bash
node security/scripts/apply-cloudflare-baseline.mjs
```

Apply baseline:

```bash
CF_API_TOKEN=... CF_ZONE_ID=... node security/scripts/apply-cloudflare-baseline.mjs --apply
```

Apply emergency thresholds (60% of baseline):

```bash
CF_API_TOKEN=... CF_ZONE_ID=... node security/scripts/apply-cloudflare-baseline.mjs --apply --emergency
```

Run spike monitor once (dry run):

```bash
CF_API_TOKEN=... CF_ZONE_ID=... node security/scripts/monitor-cloudflare-spike.mjs
```

Run spike monitor once (apply mode):

```bash
CF_API_TOKEN=... CF_ZONE_ID=... node security/scripts/monitor-cloudflare-spike.mjs --apply
```

## Cloudflare Worker Deploy (Protected Main Videos)

1. Copy `security/cloudflare/worker/media-gateway/wrangler.toml.example` to `wrangler.toml`.
2. Set the R2 bucket binding.
3. Set secret:

```bash
wrangler secret put MEDIA_SIGNING_SECRET
```

4. Deploy:

```bash
wrangler deploy
```

5. Ensure route only covers:
   - `media.giselasaldarriaga.com/videos/main/*`

## Validation Checklist

- `/api/media/session` returns JSON with `expiresAt`, `refreshAfterMs`, `mainVideoUrls`.
- Full video without token returns `403` once Worker is active.
- Previews/posters remain public and cached.
- Portfolio reel opening remains instant with no login/challenge prompts.
- Scheduled workflow `Cloudflare Spike Monitor` runs every 5 minutes.
