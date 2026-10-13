#!/usr/bin/env bash
# IndexNow ping — submit sitemap URLs to Bing/Yandex after a production deploy.
#
# Manual (from the repo root):
#   npm run indexnow
#   ./scripts/indexnow-ping.sh
#   INDEXNOW_KEY=bc6e18cf87bf49fcc1ad22e759c161ac ./scripts/indexnow-ping.sh
#   ./scripts/indexnow-ping.sh --soft    # never exit non-zero
#
# Production: .github/workflows/indexnow.yml runs this on push to main after
# waiting for the Vercel production deploy. Fail-soft there so IndexNow never
# blocks deploy. Docs: https://www.indexnow.org/documentation
#
# Requires: curl, node. Key file: public/<32-hex>.txt (content = key).

set -euo pipefail

SOFT=0
if [[ "${1:-}" == "--soft" || "${INDEXNOW_FAIL_SOFT:-}" == "1" ]]; then
  SOFT=1
fi

fail() {
  echo "IndexNow: $*" >&2
  if [[ "$SOFT" -eq 1 ]]; then
    echo "IndexNow: failing soft (deploy is not blocked)." >&2
    exit 0
  fi
  exit 1
}

SITE="https://www.giselasaldarriaga.com"
HOST="www.giselasaldarriaga.com"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SITEMAP="$ROOT/public/sitemap.xml"

if [[ -z "${INDEXNOW_KEY:-}" ]]; then
  KEY_FILE=$(find "$ROOT/public" -maxdepth 1 -name '*.txt' \
    ! -name 'robots.txt' \
    ! -name 'llms.txt' \
    ! -name 'llms-full.txt' \
    -print -quit 2>/dev/null || true)
  if [[ -n "$KEY_FILE" ]]; then
    INDEXNOW_KEY=$(basename "$KEY_FILE" .txt)
  else
    fail "set INDEXNOW_KEY or place a 32-char hex key file in public/"
  fi
fi

if [[ ! "$INDEXNOW_KEY" =~ ^[0-9a-f]{32}$ ]]; then
  fail "INDEXNOW_KEY must be a 32-char lowercase hex string"
fi

if [[ ! -f "$SITEMAP" ]]; then
  fail "missing $SITEMAP"
fi

URLS_JSON=$(node -e '
const fs = require("fs");
const xml = fs.readFileSync(process.argv[1], "utf8");
const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
if (locs.length === 0) process.exit(2);
process.stdout.write(JSON.stringify(locs));
' "$SITEMAP") || fail "could not parse <loc> entries from $SITEMAP"

PAYLOAD=$(INDEXNOW_KEY="$INDEXNOW_KEY" HOST="$HOST" SITE="$SITE" URLS_JSON="$URLS_JSON" node -e '
const payload = {
  host: process.env.HOST,
  key: process.env.INDEXNOW_KEY,
  keyLocation: `${process.env.SITE}/${process.env.INDEXNOW_KEY}.txt`,
  urlList: JSON.parse(process.env.URLS_JSON),
};
process.stdout.write(JSON.stringify(payload));
') || fail "could not build IndexNow payload"

URL_COUNT=$(URLS_JSON="$URLS_JSON" node -e 'process.stdout.write(String(JSON.parse(process.env.URLS_JSON).length))')

echo "Submitting ${URL_COUNT} sitemap URLs to IndexNow..."
HTTP_CODE=$(curl -sS -o /tmp/indexnow-response.txt -w "%{http_code}" \
  -X POST "https://api.indexnow.org/indexnow" \
  -H "Content-Type: application/json; charset=utf-8" \
  -d "$PAYLOAD") || fail "curl could not reach https://api.indexnow.org/indexnow"

if [[ "$HTTP_CODE" == "200" || "$HTTP_CODE" == "202" ]]; then
  echo "IndexNow accepted (HTTP $HTTP_CODE) — ${URL_COUNT} URLs submitted."
  exit 0
fi

fail "API returned HTTP ${HTTP_CODE}: $(tr '\n' ' ' </tmp/indexnow-response.txt)"
