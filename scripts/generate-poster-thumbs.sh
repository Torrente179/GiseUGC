#!/usr/bin/env bash
# Generate small mobile-grid poster thumbnails for the Hero 4-tile strip.
# Source: public/uploads/videos/*-poster.jpg
# Output: public/uploads/videos/poster-thumbs/*-thumb.webp (280w, quality 75)
#
# Requirements: ffmpeg (resize) + cwebp (encode). Install via:
#   brew install ffmpeg webp
set -euo pipefail

SRC_DIR="public/uploads/videos"
OUT_DIR="public/uploads/videos/poster-thumbs"
WIDTH=280
QUALITY=75

mkdir -p "$OUT_DIR"

TMP_DIR=$(mktemp -d)
trap 'rm -rf "$TMP_DIR"' EXIT

shopt -s nullglob
for src in "$SRC_DIR"/*-poster.jpg; do
  base=$(basename "$src" .jpg)
  out="$OUT_DIR/${base}-thumb.webp"
  if [[ -f "$out" && "$out" -nt "$src" ]]; then
    continue
  fi
  resized="$TMP_DIR/${base}-resized.png"
  ffmpeg -y -i "$src" -vf "scale=${WIDTH}:-2" "$resized" -loglevel error
  cwebp -q "$QUALITY" -quiet "$resized" -o "$out"
  echo "generated: $out"
done
