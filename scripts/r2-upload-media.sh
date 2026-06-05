#!/usr/bin/env bash
set -euo pipefail

# ─────────────────────────────────────────────────────────────────────────────
# Upload re-encoded media to Cloudflare R2 with correct Content-Type + a long
# lived Cache-Control, in one pass. Run AFTER:
#   npm run video:encode -- --overwrite   (previews + mobile MP4s)
#   npm run video:hls     -- --overwrite   (multi-codec HLS ladders)
#
# Requires a gitignored .env (see .env.example) with:
#   R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_ENDPOINT, R2_BUCKET
#   R2_ENDPOINT = https://<account_id>.r2.cloudflarestorage.com
#   R2_BUCKET   = the bucket bound to media.giselasaldarriaga.com
#
# Usage:
#   bash scripts/r2-upload-media.sh [--dry-run]
# ─────────────────────────────────────────────────────────────────────────────

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

# Load only R2_* keys from .env (avoids sourcing unrelated multi-word values).
if [[ -f .env ]]; then
  set -a
  # shellcheck disable=SC1090
  source <(grep -E '^R2_[A-Z0-9_]+=' .env)
  set +a
fi

: "${R2_ACCESS_KEY_ID:?set R2_ACCESS_KEY_ID in .env}"
: "${R2_SECRET_ACCESS_KEY:?set R2_SECRET_ACCESS_KEY in .env}"
: "${R2_ENDPOINT:?set R2_ENDPOINT in .env (https://<account_id>.r2.cloudflarestorage.com)}"
: "${R2_BUCKET:?set R2_BUCKET in .env}"

export AWS_ACCESS_KEY_ID="$R2_ACCESS_KEY_ID"
export AWS_SECRET_ACCESS_KEY="$R2_SECRET_ACCESS_KEY"
export AWS_DEFAULT_REGION="${R2_REGION:-auto}"
# aws-cli >= 2.23 adds request/response integrity checksums by default that R2
# can reject; only send them when the operation actually requires it.
export AWS_REQUEST_CHECKSUM_CALCULATION=when_required
export AWS_RESPONSE_CHECKSUM_VALIDATION=when_required

CACHE_CONTROL="public, max-age=31536000, immutable"
ENCODES_DIR="tmp/video-encodes"
HLS_DIR="tmp/video-hls"
DRY_RUN=0
[[ "${1:-}" == "--dry-run" ]] && DRY_RUN=1

aws_s3() {
  if [[ "$DRY_RUN" -eq 1 ]]; then
    printf '+ aws s3 %s --endpoint-url %s\n' "$*" "$R2_ENDPOINT"
  else
    aws s3 "$@" --endpoint-url "$R2_ENDPOINT" --no-progress
  fi
}

if [[ -d "$ENCODES_DIR" ]]; then
  echo "==> Previews  -> videos/previews/"
  aws_s3 sync "$ENCODES_DIR" "s3://$R2_BUCKET/videos/previews/" \
    --exclude "*" --include "*-preview.mp4" \
    --content-type video/mp4 --cache-control "$CACHE_CONTROL"

  echo "==> Mobile    -> videos/mobile/"
  aws_s3 sync "$ENCODES_DIR" "s3://$R2_BUCKET/videos/mobile/" \
    --exclude "*" --include "*-mobile.mp4" \
    --content-type video/mp4 --cache-control "$CACHE_CONTROL"
else
  echo "!! $ENCODES_DIR missing — run 'npm run video:encode -- --overwrite' first." >&2
fi

if [[ -d "$HLS_DIR" ]]; then
  # Upload segments/init FIRST so a manifest is never live before its media.
  echo "==> HLS segments (.m4s + init.mp4) -> videos/hls/"
  aws_s3 sync "$HLS_DIR" "s3://$R2_BUCKET/videos/hls/" \
    --exclude "*" --include "*.m4s" --include "*.mp4" \
    --content-type video/mp4 --cache-control "$CACHE_CONTROL"

  echo "==> HLS manifests (.m3u8) -> videos/hls/"
  aws_s3 sync "$HLS_DIR" "s3://$R2_BUCKET/videos/hls/" \
    --exclude "*" --include "*.m3u8" \
    --content-type application/vnd.apple.mpegurl --cache-control "$CACHE_CONTROL"
else
  echo "!! $HLS_DIR missing — run 'npm run video:hls -- --overwrite' first." >&2
fi

echo ""
echo "Done. Next: run 'npm run video:catalog' so the runtime catalog picks up the HLS URLs,"
echo "then verify with curl (see changes/video-functionality/cdn-cache-runbook.md)."
