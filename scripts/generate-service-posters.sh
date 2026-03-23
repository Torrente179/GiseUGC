#!/usr/bin/env bash
set -euo pipefail

usage() {
  cat <<'EOF'
Generate high-quality static poster images for service-page video surfaces.

Defaults:
- inputs: public/uploads/videos + public/uploads/videos/nuevos
- output: public/uploads/videos/service-posters
- frame time: 1.2s
- output: high-quality JPEG

Usage:
  bash scripts/generate-service-posters.sh [options] [file1.mp4 file2.mov ...]

Options:
  --output-dir DIR     Output directory (default: public/uploads/videos/service-posters)
  --time SECONDS       Frame timestamp to capture (default: 1.2)
  --quality N          JPEG quality 0-100, higher is better (default: 92)
  --overwrite          Overwrite existing poster files
  -h, --help           Show this help
EOF
}

require_binary() {
  local binary="$1"
  if ! command -v "$binary" >/dev/null 2>&1; then
    echo "Missing required binary: $binary" >&2
    exit 1
  fi
}

run_cmd() {
  "$@"
}

OUTPUT_DIR="public/uploads/videos/service-posters"
CAPTURE_TIME="1.2"
QUALITY="92"
OVERWRITE=0
FILES=()

while (($#)); do
  case "$1" in
    --output-dir)
      OUTPUT_DIR="$2"
      shift 2
      ;;
    --time)
      CAPTURE_TIME="$2"
      shift 2
      ;;
    --quality)
      QUALITY="$2"
      shift 2
      ;;
    --overwrite)
      OVERWRITE=1
      shift
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    --)
      shift
      while (($#)); do
        FILES+=("$1")
        shift
      done
      ;;
    -*)
      echo "Unknown option: $1" >&2
      usage
      exit 1
      ;;
    *)
      FILES+=("$1")
      shift
      ;;
  esac
done

require_binary ffmpeg

mkdir -p "$OUTPUT_DIR"

declare -a SOURCES=()

if [[ "${#FILES[@]}" -gt 0 ]]; then
  for file in "${FILES[@]}"; do
    if [[ -f "$file" ]]; then
      SOURCES+=("$file")
    else
      echo "Skipping missing file: $file" >&2
    fi
  done
else
  while IFS= read -r -d '' source_file; do
    SOURCES+=("$source_file")
  done < <(
    find "public/uploads/videos" "public/uploads/videos/nuevos" -maxdepth 1 -type f \
      \( -iname '*.mp4' -o -iname '*.mov' \) \
      ! -iname '*-preview.mp4' \
      ! -iname '*-mobile.mp4' \
      -print0 | sort -z
  )
fi

if [[ "${#SOURCES[@]}" -eq 0 ]]; then
  echo "No source videos found."
  exit 0
fi

overwrite_flag="-n"
if [[ "$OVERWRITE" -eq 1 ]]; then
  overwrite_flag="-y"
fi

for source_path in "${SOURCES[@]}"; do
  filename="$(basename "$source_path")"
  basename_no_ext="${filename%.*}"
  output_path="$OUTPUT_DIR/${basename_no_ext}.jpg"
  jpeg_quality=$((31 - (QUALITY * 30 / 100)))
  if (( jpeg_quality < 1 )); then
    jpeg_quality=1
  fi
  if (( jpeg_quality > 31 )); then
    jpeg_quality=31
  fi

  echo "Generating poster: $output_path"

  run_cmd ffmpeg -hide_banner -loglevel error "$overwrite_flag" \
    -ss "$CAPTURE_TIME" \
    -i "$source_path" \
    -frames:v 1 \
    -an \
    -sn \
    -vf "scale='if(gte(iw,ih),max(iw,1440),max(iw,1080))':-2:flags=lanczos,format=yuvj420p" \
    -c:v mjpeg \
    -q:v "$jpeg_quality" \
    "$output_path"
done

echo "Generated ${#SOURCES[@]} poster(s) in $OUTPUT_DIR"
