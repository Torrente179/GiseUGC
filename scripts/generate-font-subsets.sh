#!/usr/bin/env bash
set -euo pipefail

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SOURCE_FONT="$PROJECT_ROOT/public/fonts/cormorant-garamond-latin-var.woff2"
HERO_FONT="$PROJECT_ROOT/public/fonts/cormorant-garamond-hero.woff2"

if command -v pyftsubset >/dev/null 2>&1; then
  SUBSETTER=(pyftsubset)
elif python3 -c 'import fontTools.subset' >/dev/null 2>&1; then
  SUBSETTER=(python3 -m fontTools.subset)
else
  echo "fonttools is required to regenerate font subsets: python3 -m pip install 'fonttools[woff]'" >&2
  exit 1
fi

"${SUBSETTER[@]}" \
  "$SOURCE_FONT" \
  --text='Gisela.GISELAUGCugc' \
  --output-file="$HERO_FONT" \
  --flavor=woff2 \
  --layout-features='*' \
  --no-hinting

echo "Generated $HERO_FONT"
