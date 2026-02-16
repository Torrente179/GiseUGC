#!/usr/bin/env bash
set -euo pipefail

# Generate lightweight preview clips for portfolio videos.
# Requires: ffmpeg
#
# Output: public/uploads/videos/*-preview.mp4
#   - 360px wide, CRF 30, no audio, faststart
#   - Expected ~200 KB - 1.5 MB per clip

VIDEOS_DIR="$(cd "$(dirname "$0")/../public/uploads/videos" && pwd)"

SOURCES=(
  ugc-lifestyle-review
  ugc-brand-spokesperson
  ugc-voicebot-review
  ugc-creatine-supplement-review
  ugc-business-promotion
  ugc-services-presentation
  ugc-ai-services-review
  ugc-lifestyle-review-2
  ugc-voiceover-bots-review
  ugc-lifestyle-review-3
  ugc-clothing-showcase-1
  ugc-clothing-showcase-2
  ugc-clothing-showcase-3
)

for name in "${SOURCES[@]}"; do
  input="$VIDEOS_DIR/${name}.mp4"
  output="$VIDEOS_DIR/${name}-preview.mp4"

  if [[ ! -f "$input" ]]; then
    echo "SKIP  $name.mp4 (not found)"
    continue
  fi

  if [[ -f "$output" ]]; then
    echo "EXISTS $name-preview.mp4"
    continue
  fi

  echo "ENCODE $name-preview.mp4 ..."
  ffmpeg -y -i "$input" \
    -vf "scale=360:-2" \
    -c:v libx264 -crf 30 -preset slow \
    -an -movflags +faststart -pix_fmt yuv420p \
    "$output"

  size=$(du -h "$output" | cut -f1)
  echo "  -> $size"
done

echo ""
echo "Done. Preview files:"
ls -lh "$VIDEOS_DIR"/*-preview.mp4 2>/dev/null || echo "(none)"
