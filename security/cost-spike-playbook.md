# Cost-Spike Incident Playbook

## Trigger Conditions

Treat as active incident when any of these are true:

1. Vercel usage spikes >2x baseline within 30 minutes.
2. Cloudflare monitor enables emergency mode.
3. Error/4xx rates jump while traffic pattern appears bot-like.

## Incident Roles

- Incident lead: owner of Cloudflare + Vercel controls.
- Comms owner: customer-facing updates if impact is visible.
- Scribe: timeline and evidence capture.

## Triage Checklist (First 5 Minutes)

1. Confirm monitor output in `cloudflare-spike-monitor` workflow logs.
2. Confirm current Cloudflare `security_level`.
3. Confirm active rate-limit thresholds.
4. Check whether requests target:
   - `/api/media/session`
   - `/videos/main/*`
   - static bundle paths.

## Containment Actions

1. If emergency mode did not auto-enable, manually set:
   - `security_level=under_attack`.
2. Apply emergency thresholds:
   - `node security/scripts/apply-cloudflare-baseline.mjs --apply --emergency`.
3. If attack persists:
   - tighten `/api/media/session` rate-limit by additional 30%.
   - reduce token TTL temporarily (e.g. `MEDIA_SESSION_TTL_SECONDS=300`).

## Validation During Incident

1. Cloudflare cache hit ratio improves.
2. Origin-bound requests flatten.
3. Legitimate playback remains functional.
4. No sustained increase in user-reported failures.

## Recovery

1. Confirm monitor indicates normalized windows.
2. Restore baseline:
   - `node security/scripts/apply-cloudflare-baseline.mjs --apply`.
3. Return `security_level` to base value (`medium` unless changed).

## Post-Incident Tasks

1. Capture timeline and payload patterns.
2. Update `security/rate-limit-tuning-log.md`.
3. Adjust thresholds based on observed false positives/negatives.
4. Rotate any exposed/at-risk API tokens.
