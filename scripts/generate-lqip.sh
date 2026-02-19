#!/usr/bin/env bash
set -euo pipefail

# Generate Low Quality Image Placeholders (LQIP) from video preview files.
# Extracts the first frame, resizes to 16x28 WebP, and outputs a TypeScript map.
#
# Requirements: ffmpeg, cwebp (from libwebp)
#
# Usage:
#   bash scripts/generate-lqip.sh [--input-dir DIR] [--output FILE]

INPUT_DIR="tmp/video-encodes"
OUTPUT_FILE="src/data/video-lqip.ts"
LQIP_WIDTH=16
LQIP_HEIGHT=28
QUALITY=20

while (($#)); do
  case "$1" in
    --input-dir) INPUT_DIR="$2"; shift 2 ;;
    --output)    OUTPUT_FILE="$2"; shift 2 ;;
    -h|--help)
      echo "Usage: bash scripts/generate-lqip.sh [--input-dir DIR] [--output FILE]"
      exit 0
      ;;
    *) echo "Unknown option: $1" >&2; exit 1 ;;
  esac
done

for cmd in ffmpeg cwebp; do
  if ! command -v "$cmd" >/dev/null 2>&1; then
    echo "Missing required binary: $cmd" >&2
    exit 1
  fi
done

if [[ ! -d "$INPUT_DIR" ]]; then
  echo "Input directory not found: $INPUT_DIR" >&2
  echo "Run the encode script first to generate preview videos." >&2
  exit 1
fi

TMPDIR_LQIP="$(mktemp -d)"
trap 'rm -rf "$TMPDIR_LQIP"' EXIT

declare -A LQIP_MAP

while IFS= read -r preview_file; do
  filename="$(basename "$preview_file")"
  # Strip -preview.mp4 suffix to get the clip key
  clip_key="${filename%-preview.mp4}"

  frame_png="$TMPDIR_LQIP/${clip_key}.png"
  frame_webp="$TMPDIR_LQIP/${clip_key}.webp"

  # Extract first frame
  ffmpeg -hide_banner -loglevel error -y \
    -i "$preview_file" \
    -vframes 1 -vf "scale=${LQIP_WIDTH}:${LQIP_HEIGHT}:flags=lanczos" \
    "$frame_png"

  # Convert to tiny WebP
  cwebp -quiet -q "$QUALITY" -resize "$LQIP_WIDTH" "$LQIP_HEIGHT" "$frame_png" -o "$frame_webp"

  # Encode to base64 data URI
  base64_data="$(base64 < "$frame_webp" | tr -d '\n')"
  LQIP_MAP["$clip_key"]="data:image/webp;base64,${base64_data}"

  size="$(wc -c < "$frame_webp" | tr -d ' ')"
  echo "  ${clip_key}: ${size} bytes"
done < <(find "$INPUT_DIR" -maxdepth 1 -name '*-preview.mp4' -type f | sort)

if [[ ${#LQIP_MAP[@]} -eq 0 ]]; then
  echo "No preview files found in $INPUT_DIR" >&2
  exit 1
fi

# Generate TypeScript file
{
  cat <<'HEADER'
/**
 * Low Quality Image Placeholders (LQIP) for video clips.
 * Tiny 16×28 base64 WebP thumbnails (~300-500 bytes each) extracted from video first frames.
 *
 * Regenerate with: bash scripts/generate-lqip.sh
 */

const VIDEO_LQIP: Record<string, string> = {
HEADER

  for key in $(echo "${!LQIP_MAP[@]}" | tr ' ' '\n' | sort); do
    printf "  '%s': '%s',\n" "$key" "${LQIP_MAP[$key]}"
  done

  cat <<'FOOTER'
};

export default VIDEO_LQIP;
FOOTER
} > "$OUTPUT_FILE"

echo ""
echo "Generated $OUTPUT_FILE with ${#LQIP_MAP[@]} entries."
