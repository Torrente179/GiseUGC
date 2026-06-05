#!/usr/bin/env bash
set -euo pipefail

# ─────────────────────────────────────────────────────────────────────────────
# Backfill a long-lived Cache-Control on EXISTING R2 objects that this pipeline
# does NOT re-upload: posters and the `main` originals. (New previews / mobile /
# HLS already get Cache-Control via r2-upload-media.sh.)
#
# The Cloudflare Cache Rule (see cdn-cache-runbook.md) is the primary fix and is
# sufficient on its own; this script is origin-side hardening so the header is
# correct at the source regardless of edge rules.
#
# Copies each object onto itself with REPLACE metadata (server-side, no download).
#
# Usage:
#   bash scripts/r2-set-cache-control.sh [--dry-run]
# ─────────────────────────────────────────────────────────────────────────────

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

if [[ -f .env ]]; then
  set -a
  # shellcheck disable=SC1090
  source <(grep -E '^R2_[A-Z0-9_]+=' .env)
  set +a
fi

: "${R2_ACCESS_KEY_ID:?set R2_ACCESS_KEY_ID in .env}"
: "${R2_SECRET_ACCESS_KEY:?set R2_SECRET_ACCESS_KEY in .env}"
: "${R2_ENDPOINT:?set R2_ENDPOINT in .env}"
: "${R2_BUCKET:?set R2_BUCKET in .env}"

export AWS_ACCESS_KEY_ID="$R2_ACCESS_KEY_ID"
export AWS_SECRET_ACCESS_KEY="$R2_SECRET_ACCESS_KEY"
export AWS_DEFAULT_REGION="${R2_REGION:-auto}"
export AWS_REQUEST_CHECKSUM_CALCULATION=when_required
export AWS_RESPONSE_CHECKSUM_VALIDATION=when_required

CACHE_CONTROL="public, max-age=31536000, immutable"
DRY_RUN=0
[[ "${1:-}" == "--dry-run" ]] && DRY_RUN=1

# $1 = key prefix, $2 = include glob, $3 = content-type
copy_meta() {
  local prefix="$1" glob="$2" ctype="$3"
  echo "==> ${prefix}  (${glob} -> ${ctype})"
  local -a cmd=(aws s3 cp "s3://$R2_BUCKET/$prefix" "s3://$R2_BUCKET/$prefix"
    --recursive --metadata-directive REPLACE
    --cache-control "$CACHE_CONTROL" --content-type "$ctype"
    --exclude "*" --include "$glob"
    --endpoint-url "$R2_ENDPOINT" --no-progress)
  if [[ "$DRY_RUN" -eq 1 ]]; then printf '+ %q ' "${cmd[@]}"; printf '\n'; else "${cmd[@]}"; fi
}

copy_meta "videos/posters/" "*.jpg"  "image/jpeg"
copy_meta "videos/posters/" "*.jpeg" "image/jpeg"
copy_meta "videos/posters/" "*.png"  "image/png"
copy_meta "videos/main/"    "*.mp4"  "video/mp4"
copy_meta "videos/main/"    "*.MOV"  "video/quicktime"
copy_meta "videos/main/"    "*.mov"  "video/quicktime"

echo ""
echo "Done. Verify with: curl -sI https://media.giselasaldarriaga.com/videos/posters/<name>.jpg | grep -i cache-control"
