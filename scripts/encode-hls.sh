#!/usr/bin/env bash
set -euo pipefail

usage() {
  cat <<'EOF'
Create adaptive HLS renditions for R2 delivery.

Outputs:
  tmp/video-hls/<base>/main/master.m3u8
  tmp/video-hls/<base>/mobile/master.m3u8
  tmp/video-hls/<base>/preview/master.m3u8

Each master contains 2s fMP4 segments and a quality ladder capped by the
source dimensions. Upload each <base> folder to:
  videos/hls/<base>/

Usage:
  bash scripts/encode-hls.sh [options] [file1.mp4 file2.mov ...]

Options:
  --input-dir DIR          Input directory (default: public/uploads/videos)
  --output-dir DIR         Output directory (default: tmp/video-hls)
  --preview-seconds N      Preview duration in seconds (default: 4)
  --overwrite              Overwrite existing outputs
  --dry-run                Print commands without running ffmpeg
  -h, --help               Show help
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
  if [[ "$DRY_RUN" -eq 1 ]]; then
    printf '+ '
    printf '%q ' "$@"
    printf '\n'
    return 0
  fi
  "$@"
}

probe_field() {
  local file="$1"
  local field="$2"
  ffprobe -v error -select_streams v:0 -show_entries "stream=${field}" -of default=nw=1:nk=1 "$file"
}

bitrate_for_width() {
  case "$1" in
    360) echo 600 ;;
    540) echo 1100 ;;
    720) echo 2200 ;;
    1080) echo 4200 ;;
    *) echo 2200 ;;
  esac
}

file_size_bytes() {
  local file="$1"
  if stat -f%z "$file" >/dev/null 2>&1; then
    stat -f%z "$file"
  else
    stat -c%s "$file"
  fi
}

human_size() {
  local bytes="$1"
  awk -v b="$bytes" 'BEGIN {
    split("B KB MB GB TB", unit, " ");
    i = 1;
    while (b >= 1024 && i < 5) { b /= 1024; i++; }
    printf "%.2f %s", b, unit[i];
  }'
}

write_master_playlist() {
  local rendition_dir="$1"
  local source_width="$2"
  local source_height="$3"
  local master_path="$rendition_dir/master.m3u8"

  {
    echo '#EXTM3U'
    echo '#EXT-X-VERSION:7'
    for variant_dir in "$rendition_dir"/*p; do
      [[ -d "$variant_dir" ]] || continue
      local playlist="$variant_dir/index.m3u8"
      [[ -f "$playlist" ]] || continue
      local width height bandwidth average_bandwidth label bitrate
      label="$(basename "$variant_dir")"
      width="${label%p}"
      bitrate="$(bitrate_for_width "$width")"
      height="$(awk -v sw="$source_width" -v sh="$source_height" -v w="$width" 'BEGIN {
        h = int((sh * w / sw) + 0.5);
        if (h % 2 == 1) h += 1;
        print h;
      }')"
      average_bandwidth="$((bitrate * 1000))"
      bandwidth="$((bitrate * 1300))"
      echo "#EXT-X-STREAM-INF:BANDWIDTH=${bandwidth},AVERAGE-BANDWIDTH=${average_bandwidth},RESOLUTION=${width}x${height},FRAME-RATE=30.000"
      echo "${label}/index.m3u8"
    done
  } > "$master_path"
}

encode_variant() {
  local source_path="$1"
  local output_dir="$2"
  local max_width="$3"
  local video_kbps="$4"
  local include_audio="$5"
  local duration_value="${6:-}"

  mkdir -p "$output_dir"

  local map_audio=()
  local audio_args=()
  if [[ "$include_audio" == "1" ]]; then
    map_audio=(-map '0:a:0?')
    audio_args=(-c:a aac -b:a 96k -ac 2 -ar 48000)
  else
    audio_args=(-an)
  fi

  run_cmd ffmpeg -hide_banner -loglevel error "$OVERWRITE_FLAG" \
    ${duration_value:+-t "$duration_value"} \
    -i "$source_path" \
    -map 0:v:0 ${map_audio[@]+"${map_audio[@]}"} \
    -vf "scale='min(${max_width},iw)':-2:flags=lanczos,fps=30,format=yuv420p" \
    -c:v libx264 -preset slow -profile:v high -level 4.1 \
    -b:v "${video_kbps}k" -maxrate "$((video_kbps * 13 / 10))k" -bufsize "$((video_kbps * 2))k" \
    -x264-params "keyint=60:min-keyint=60:scenecut=0" \
    "${audio_args[@]}" \
    -hls_time 2 \
    -hls_playlist_type vod \
    -hls_segment_type fmp4 \
    -hls_fmp4_init_filename init.mp4 \
    -hls_segment_filename "$output_dir/segment_%03d.m4s" \
    "$output_dir/index.m3u8"

}

INPUT_DIR="public/uploads/videos"
OUTPUT_DIR="tmp/video-hls"
PREVIEW_SECONDS=4
OVERWRITE=0
DRY_RUN=0
FILES=()

while (($#)); do
  case "$1" in
    --input-dir)
      INPUT_DIR="$2"
      shift 2
      ;;
    --output-dir)
      OUTPUT_DIR="$2"
      shift 2
      ;;
    --preview-seconds)
      PREVIEW_SECONDS="$2"
      shift 2
      ;;
    --overwrite)
      OVERWRITE=1
      shift
      ;;
    --dry-run)
      DRY_RUN=1
      shift
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    --)
      shift
      while (($#)); do FILES+=("$1"); shift; done
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
require_binary ffprobe

OVERWRITE_FLAG="-n"
if [[ "$OVERWRITE" -eq 1 ]]; then
  OVERWRITE_FLAG="-y"
fi

declare -a SOURCES=()
if [[ "${#FILES[@]}" -gt 0 ]]; then
  for entry in "${FILES[@]}"; do
    candidate="$entry"
    [[ -f "$candidate" ]] || candidate="$INPUT_DIR/$entry"
    if [[ -f "$candidate" ]]; then
      SOURCES+=("$candidate")
    else
      echo "Skipping missing file: $entry" >&2
    fi
  done
else
  while IFS= read -r source_file; do
    SOURCES+=("$source_file")
  done < <(
    find "$INPUT_DIR" "$INPUT_DIR/nuevos" -maxdepth 1 -type f \( -iname '*.mp4' -o -iname '*.mov' \) \
      ! -iname '*-preview.mp4' ! -iname '*-mobile.mp4' | sort
  )
fi

if [[ "${#SOURCES[@]}" -eq 0 ]]; then
  echo "No source video files found."
  exit 0
fi

mkdir -p "$OUTPUT_DIR"
manifest_path="$OUTPUT_DIR/manifest.csv"
if [[ "$DRY_RUN" -eq 0 ]]; then
  printf 'source,hls_base,main_master,mobile_master,preview_master,bytes\n' > "$manifest_path"
fi

declare -a LADDER_WIDTHS=(360 540 720 1080)
for source_path in "${SOURCES[@]}"; do
  filename="$(basename "$source_path")"
  base_name="${filename%.*}"
  source_width="$(probe_field "$source_path" width)"
  source_height="$(probe_field "$source_path" height)"
  base_dir="$OUTPUT_DIR/$base_name"

  echo ""
  echo "Source: $source_path"
  echo "  HLS base: $base_dir"

  for rendition in main mobile preview; do
    rendition_dir="$base_dir/$rendition"
    include_audio=1
    duration=""
    if [[ "$rendition" == "preview" ]]; then
      include_audio=0
      duration="$PREVIEW_SECONDS"
    fi

    for width in "${LADDER_WIDTHS[@]}"; do
      if (( width > source_width )); then
        continue
      fi
      if [[ "$rendition" == "preview" && "$width" -gt 720 ]]; then
        continue
      fi
      encode_variant "$source_path" "$rendition_dir/${width}p" "$width" "$(bitrate_for_width "$width")" "$include_audio" "$duration"
    done

    if [[ "$DRY_RUN" -eq 0 ]]; then
      write_master_playlist "$rendition_dir" "$source_width" "$source_height"
    fi
  done

  if [[ "$DRY_RUN" -eq 0 ]]; then
    bytes="$(find "$base_dir" -type f -exec stat -f%z {} \; 2>/dev/null | awk '{s+=$1} END {print s+0}')"
    printf '%s,%s,%s,%s,%s,%s\n' \
      "$source_path" "$base_dir" \
      "$base_dir/main/master.m3u8" \
      "$base_dir/mobile/master.m3u8" \
      "$base_dir/preview/master.m3u8" \
      "$bytes" >> "$manifest_path"
    echo "  Output size: $(human_size "$bytes")"
  fi
done

echo ""
echo "Done."
if [[ "$DRY_RUN" -eq 0 ]]; then
  echo "Manifest: $manifest_path"
fi
