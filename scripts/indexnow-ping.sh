#!/usr/bin/env bash
# IndexNow ping — submit changed URLs to Bing/Yandex for faster discovery.
# Usage: ./scripts/indexnow-ping.sh
# Requires INDEXNOW_KEY env var (or reads from public/<key>.txt).
# Docs: https://www.indexnow.org/documentation

set -euo pipefail

SITE="https://www.giselasaldarriaga.com"
HOST="www.giselasaldarriaga.com"

# Resolve IndexNow key
if [[ -z "${INDEXNOW_KEY:-}" ]]; then
  KEY_FILE=$(find public -maxdepth 1 -name '*.txt' ! -name 'robots.txt' ! -name 'llms.txt' -print -quit 2>/dev/null || true)
  if [[ -n "$KEY_FILE" ]]; then
    INDEXNOW_KEY=$(basename "$KEY_FILE" .txt)
  else
    echo "Error: Set INDEXNOW_KEY or place a key file in public/" >&2
    exit 1
  fi
fi

# All indexable URLs (homepage + services + verticals)
URLS=(
  "$SITE/"
  "$SITE/en/"
  "$SITE/servicios/creadora-ugc-bilingue/"
  "$SITE/servicios/videos-de-portavoz/"
  "$SITE/servicios/ugc-ads-tiktok-meta/"
  "$SITE/servicios/testimoniales-resenas-ugc/"
  "$SITE/servicios/demo-producto-ugc/"
  "$SITE/servicios/ugc-problema-solucion/"
  "$SITE/servicios/ugc-lifestyle/"
  "$SITE/servicios/b-roll-footage-ugc/"
  "$SITE/en/services/bilingual-ugc-creator/"
  "$SITE/en/services/spokesperson-videos/"
  "$SITE/en/services/ugc-ads-tiktok-meta/"
  "$SITE/en/services/ugc-testimonials-reviews/"
  "$SITE/en/services/ugc-product-demo/"
  "$SITE/en/services/ugc-problem-solution/"
  "$SITE/en/services/lifestyle-ugc-organic-content/"
  "$SITE/en/services/ugc-b-roll-footage/"
  "$SITE/verticales/ugc-beauty/"
  "$SITE/verticales/ugc-moda/"
  "$SITE/verticales/ugc-tech-saas/"
  "$SITE/verticales/ugc-ecommerce/"
  "$SITE/verticales/ugc-lifestyle-bienestar/"
  "$SITE/en/verticals/beauty-ugc-creator/"
  "$SITE/en/verticals/fashion-ugc-creator/"
  "$SITE/en/verticals/tech-saas-ugc-creator/"
  "$SITE/en/verticals/ecommerce-ugc-creator/"
  "$SITE/en/verticals/lifestyle-wellness-ugc-creator/"
)

# Build JSON array of URLs
URL_JSON=$(printf '%s\n' "${URLS[@]}" | jq -R . | jq -s .)

PAYLOAD=$(cat <<EOF
{
  "host": "$HOST",
  "key": "$INDEXNOW_KEY",
  "keyLocation": "$SITE/$INDEXNOW_KEY.txt",
  "urlList": $URL_JSON
}
EOF
)

echo "Submitting ${#URLS[@]} URLs to IndexNow..."
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" \
  -X POST "https://api.indexnow.org/IndexNow" \
  -H "Content-Type: application/json; charset=utf-8" \
  -d "$PAYLOAD")

if [[ "$HTTP_CODE" == "200" || "$HTTP_CODE" == "202" ]]; then
  echo "IndexNow accepted (HTTP $HTTP_CODE) — ${#URLS[@]} URLs submitted."
else
  echo "IndexNow returned HTTP $HTTP_CODE" >&2
  exit 1
fi
