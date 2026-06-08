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

## Layer 1b — CORS for hls.js (REQUIRED for adaptive HLS in Chrome/Firefox/Edge)

Safari/iOS play HLS natively (no CORS needed). Chrome/Firefox/Edge play it via
`hls.js`, which fetches the playlists and segments over XHR — a **cross-origin**
request (`www.giselasaldarriaga.com` → `media.giselasaldarriaga.com`). Without an
`Access-Control-Allow-Origin` header on the media responses, those fetches are
blocked and playback silently falls back to MP4. The media domain currently
sends no CORS headers, so this must be added.

Use a **Cloudflare Transform Rule** (applies at the edge, including to cached
responses — no R2 CORS needed, and avoids duplicate-header issues):

Dashboard → zone `giselasaldarriaga.com` → **Rules → Transform Rules → Modify
Response Header → Create rule**:
- Name: `media-videos-cors`
- When incoming requests match:
  `(http.host eq "media.giselasaldarriaga.com" and starts_with(http.request.uri.path, "/videos/"))`
- Then → **Set static** response headers:
  - `Access-Control-Allow-Origin` = `*`
  - (optional hardening) `Access-Control-Allow-Methods` = `GET, HEAD, OPTIONS`
  - (optional hardening) `Access-Control-Allow-Headers` = `*`

Use **Set** (not Add) so there is never a duplicate `Access-Control-Allow-Origin`
header (duplicates are rejected by browsers). Transform Rules apply to cached
responses, so no purge is required for this one.

API form:
```bash
curl -sS -X PUT \
  "https://api.cloudflare.com/client/v4/zones/${CF_ZONE_ID}/rulesets/phases/http_response_headers_transform/entrypoint" \
  -H "Authorization: Bearer ${CF_API_TOKEN}" -H "Content-Type: application/json" \
  --data '{
    "rules": [{
      "description": "media-videos-cors",
      "expression": "(http.host eq \"media.giselasaldarriaga.com\" and starts_with(http.request.uri.path, \"/videos/\"))",
      "action": "rewrite",
      "action_parameters": { "headers": {
        "Access-Control-Allow-Origin": { "operation": "set", "value": "*" }
      } }
    }]
  }'
```

Verify:
```bash
curl -sI -H "Origin: https://www.giselasaldarriaga.com" \
  https://media.giselasaldarriaga.com/videos/hls/IMG_8435/main/master.m3u8 \
  | grep -i access-control-allow-origin     # expect: access-control-allow-origin: *
```

## ⚠️ Gotcha — purge stale negative-cached 404s (do this after first upload)

Cloudflare caches `404` responses. Any `videos/hls/<base>/main/master.m3u8` (or
other key) that was requested **before** it was uploaded — e.g. by the catalog
generator's HEAD checks or manual `curl` — gets a `404` cached at the edge with a
long TTL. After uploading the real object, the edge keeps serving the stale
`404` (symptom: direct R2 `GET` works and `…/master.m3u8?v=1` returns `200`, but
the plain URL returns `404` with `cf-cache-status: HIT`). HLS playback then fails
and silently falls back to MP4.

Fix once, after the first upload:
- Dashboard → **Caching → Configuration → Purge Everything** (simplest), or purge
  by prefix `https://media.giselasaldarriaga.com/videos/hls/`.
- API:
  ```bash
  curl -sS -X POST \
    "https://api.cloudflare.com/client/v4/zones/${CF_ZONE_ID}/purge_cache" \
    -H "Authorization: Bearer ${CF_API_TOKEN}" \
    -H "Content-Type: application/json" \
    --data '{"purge_everything":true}'
  ```

Verify: `curl -sI https://media.giselasaldarriaga.com/videos/hls/<base>/main/master.m3u8`
returns `200` on a plain GET (not just HEAD).

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
