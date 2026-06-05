# CDN Edge-Cache + R2 Upload Runbook

## Why this exists

A live probe of `media.giselasaldarriaga.com` found every video/poster returning
`cf-cache-status: DYNAMIC` with **no `Cache-Control` header**. Cloudflare sits in
front of R2 but was **not caching anything** — every byte of every 10–30 MB video
was pulled from the R2 origin on every request, for every visitor, and browsers
never cached them. This is the single biggest cause of the site feeling slow.

Fixing it is configuration, not code. There are two layers; **Layer 1 (the Cache
Rule) is the required, highest-impact fix** and is sufficient on its own. Layer 2
hardens the origin headers.

---

## Layer 1 — Cloudflare Cache Rule (REQUIRED, the big win)

Caches `/videos/*` at the edge and tells browsers to cache too, regardless of
origin headers.

### Option A — Dashboard (2 minutes)

1. Cloudflare dashboard → zone **`giselasaldarriaga.com`** → **Caching → Cache
   Rules → Create rule**.
2. Name: `media-videos-immutable`.
3. **When incoming requests match** (Custom filter expression):
   - Field `Hostname` · Operator `equals` · Value `media.giselasaldarriaga.com`
   - `And`
   - Field `URI Path` · Operator `starts with` · Value `/videos/`
4. **Then**:
   - **Cache eligibility** → **Eligible for cache**
   - **Edge TTL** → *Override origin* → **1 year** (`31536000` seconds)
   - **Browser TTL** → *Override origin* → **1 year**
5. **Deploy**.

### Option B — API (equivalent)

Set `CF_API_TOKEN` (token with *Zone → Cache Rules → Edit*) and `CF_ZONE_ID`,
then create/replace the `http_request_cache_settings` ruleset entrypoint:

```bash
curl -sS -X PUT \
  "https://api.cloudflare.com/client/v4/zones/${CF_ZONE_ID}/rulesets/phases/http_request_cache_settings/entrypoint" \
  -H "Authorization: Bearer ${CF_API_TOKEN}" \
  -H "Content-Type: application/json" \
  --data '{
    "rules": [{
      "description": "media-videos-immutable",
      "expression": "(http.host eq \"media.giselasaldarriaga.com\" and starts_with(http.request.uri.path, \"/videos/\"))",
      "action": "set_cache_settings",
      "action_parameters": {
        "cache": true,
        "edge_ttl":    { "mode": "override_origin", "default": 31536000 },
        "browser_ttl": { "mode": "override_origin", "default": 31536000 }
      }
    }]
  }'
```

> Note: PUT on the entrypoint replaces the cache-phase ruleset. If other cache
> rules already exist on this zone, GET the entrypoint first and append this rule
> to the existing `rules` array instead of overwriting.

---

## Layer 2 — Correct `Cache-Control` at the R2 origin (hardening)

New encodes get the header at upload time; existing assets get a backfill.

### One-time: add R2 credentials to `.env` (gitignored)

```
R2_ACCESS_KEY_ID=...
R2_SECRET_ACCESS_KEY=...
R2_ENDPOINT=https://<account_id>.r2.cloudflarestorage.com
R2_BUCKET=<bucket bound to media.giselasaldarriaga.com>
```

### Upload the new high-quality encodes (sets Content-Type + Cache-Control)

```bash
bash scripts/r2-upload-media.sh --dry-run   # preview the plan
bash scripts/r2-upload-media.sh             # previews + mobile + HLS ladders
```

### Backfill Cache-Control on assets we did NOT re-upload (posters + mains)

```bash
bash scripts/r2-set-cache-control.sh --dry-run
bash scripts/r2-set-cache-control.sh
```

---

## Verify (run after the above)

```bash
for u in \
  videos/main/ugc-lifestyle-review.mp4 \
  videos/previews/ugc-lifestyle-review-preview.mp4 \
  videos/posters/ugc-lifestyle-review-poster.jpg \
  videos/hls/IMG_8435/main/master.m3u8 ; do
  echo "== $u =="
  curl -sI "https://media.giselasaldarriaga.com/$u" \
    | grep -iE 'http/|content-type|cache-control|cf-cache-status|age'
done
```

Expect on each: `cache-control: public, max-age=31536000, immutable`, the right
`content-type`, and — after one warm request — `cf-cache-status: HIT`. The HLS
master must be `200`, not `404`.

## Rollback

- Delete the Cache Rule to revert edge caching.
- `Cache-Control` is overwritable by re-running the scripts with a different value.
