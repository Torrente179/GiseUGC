#!/usr/bin/env bash
set -euo pipefail

SOURCE_DIR="${1:-public/uploads/videos/service-posters}"
OUTPUT_DIR="${2:-public/uploads/videos/poster-variants/v1}"
WIDTHS=(180 360 720 1080)

if ! command -v magick >/dev/null 2>&1; then
  echo "Missing required binary: magick" >&2
  exit 1
fi

mkdir -p "$OUTPUT_DIR"

generated=0
while IFS= read -r -d '' source_path; do
  filename="$(basename "$source_path")"
  basename_no_ext="${filename%.*}"

  for width in "${WIDTHS[@]}"; do
    common_args=(
      "$source_path"
      -auto-orient
      -resize "${width}x>"
      -strip
    )

    magick "${common_args[@]}" -quality 48 "$OUTPUT_DIR/${basename_no_ext}-${width}.avif"
    magick "${common_args[@]}" -quality 74 "$OUTPUT_DIR/${basename_no_ext}-${width}.webp"
    magick "${common_args[@]}" -sampling-factor 4:2:0 -quality 80 "$OUTPUT_DIR/${basename_no_ext}-${width}.jpg"
    generated=$((generated + 3))
  done
done < <(find "$SOURCE_DIR" -maxdepth 1 -type f -iname '*.jpg' -print0 | sort -z)

echo "Generated $generated responsive poster variants in $OUTPUT_DIR"
