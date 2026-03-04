#!/usr/bin/env bash
set -euo pipefail

usage() {
  cat <<'EOF'
Batch transcode source videos into:
1) short preview loops (for cards) and
2) mobile-friendly full videos (for theater/modal playback)

Defaults are tuned for "quality-first instant feel":
- preview: 4 seconds, ~700 KB target, no audio
- mobile full: ~5 MB target per clip, AAC audio, faststart enabled

Usage:
  bash scripts/encode-videos.sh [options] [file1.mp4 file2.mov ...]

Options:
  --input-dir DIR          Input directory containing .mp4/.mov files (default: public/uploads/videos)
  --output-dir DIR         Output directory (default: tmp/video-encodes)
  --preview-seconds N      Preview clip duration (default: 4)
  --preview-target-kb N    Preview size target in KB (default: 700)
  --preview-width N        Max preview width in px (default: 480)
  --mobile-target-mb N     Mobile full size target in MB (default: 5)
  --mobile-width N         Max mobile full width in px (default: 720)
  --audio-bitrate-k N      Audio bitrate in kbps for mobile full (default: 96)
  --overwrite              Overwrite existing outputs
  --dry-run                Print commands without running ffmpeg
  -h, --help               Show this help

Examples:
  npm run video:encode
  npm run video:encode -- --mobile-target-mb 6 --preview-target-kb 820
  npm run video:encode -- ugc-lifestyle-review.mp4 ugc-brand-spokesperson.mov
EOF
}

require_binary() {
  local binary="$1"
  if ! command -v "$binary" >/dev/null 2>&1; then
    echo "Missing required binary: $binary" >&2
    exit 1
  fi
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
    while (b >= 1024 && i < 5) {
      b /= 1024;
      i++;
    }
    printf "%.2f %s", b, unit[i];
  }'
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

INPUT_DIR="public/uploads/videos"
OUTPUT_DIR="tmp/video-encodes"
PREVIEW_SECONDS=4
PREVIEW_TARGET_KB=700
PREVIEW_WIDTH=480
MOBILE_TARGET_MB=5
MOBILE_WIDTH=720
AUDIO_BITRATE_K=96
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
    --preview-target-kb)
      PREVIEW_TARGET_KB="$2"
      shift 2
      ;;
    --preview-width)
      PREVIEW_WIDTH="$2"
      shift 2
      ;;
    --mobile-target-mb)
      MOBILE_TARGET_MB="$2"
      shift 2
      ;;
    --mobile-width)
      MOBILE_WIDTH="$2"
      shift 2
      ;;
    --audio-bitrate-k)
      AUDIO_BITRATE_K="$2"
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
require_binary ffprobe

if [[ ! -d "$INPUT_DIR" ]]; then
  echo "Input directory not found: $INPUT_DIR" >&2
  exit 1
fi

mkdir -p "$OUTPUT_DIR"

declare -a SOURCES=()

if [[ "${#FILES[@]}" -gt 0 ]]; then
  for entry in "${FILES[@]}"; do
    candidate="$entry"
    if [[ ! -f "$candidate" ]]; then
      candidate="$INPUT_DIR/$entry"
    fi
    if [[ ! -f "$candidate" && ! "$entry" =~ \.[mM][pP]4$ && ! "$entry" =~ \.[mM][oO][vV]$ ]]; then
      candidate="$INPUT_DIR/$entry.mp4"
    fi
    if [[ ! -f "$candidate" && ! "$entry" =~ \.[mM][pP]4$ && ! "$entry" =~ \.[mM][oO][vV]$ ]]; then
      candidate="$INPUT_DIR/$entry.MP4"
    fi
    if [[ ! -f "$candidate" && ! "$entry" =~ \.[mM][pP]4$ && ! "$entry" =~ \.[mM][oO][vV]$ ]]; then
      candidate="$INPUT_DIR/$entry.mov"
    fi
    if [[ ! -f "$candidate" && ! "$entry" =~ \.[mM][pP]4$ && ! "$entry" =~ \.[mM][oO][vV]$ ]]; then
      candidate="$INPUT_DIR/$entry.MOV"
    fi
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
    find "$INPUT_DIR" -maxdepth 1 -type f \( -iname '*.mp4' -o -iname '*.mov' \) \
      ! -iname '*-preview.mp4' ! -iname '*-mobile.mp4' | sort
  )
fi

if [[ "${#SOURCES[@]}" -eq 0 ]]; then
  echo "No source video files (.mp4/.mov) found."
  exit 0
fi

manifest_path="$OUTPUT_DIR/manifest.csv"
if [[ "$DRY_RUN" -eq 0 ]]; then
  printf 'source,preview,mobile,duration_seconds,source_bytes,preview_bytes,mobile_bytes\n' > "$manifest_path"
fi

overwrite_flag="-n"
if [[ "$OVERWRITE" -eq 1 ]]; then
  overwrite_flag="-y"
fi

total_source_bytes=0
total_preview_bytes=0
total_mobile_bytes=0
processed_count=0

for source_path in "${SOURCES[@]}"; do
  filename="$(basename "$source_path")"
  basename_no_ext="${filename%.*}"
  preview_path="$OUTPUT_DIR/${basename_no_ext}-preview.mp4"
  mobile_path="$OUTPUT_DIR/${basename_no_ext}-mobile.mp4"

  duration="$(ffprobe -v error -show_entries format=duration -of default=nw=1:nk=1 "$source_path" || true)"
  if [[ -z "$duration" ]]; then
    echo "Skipping (could not read duration): $source_path" >&2
    continue
  fi

  preview_video_kbps="$(awk -v kb="$PREVIEW_TARGET_KB" -v sec="$PREVIEW_SECONDS" 'BEGIN {
    if (sec <= 0) { print 1200; exit; }
    target = (kb * 8) / sec;
    if (target < 250) target = 250;
    if (target > 2400) target = 2400;
    printf "%.0f", target;
  }')"

  mobile_video_kbps="$(awk -v mb="$MOBILE_TARGET_MB" -v dur="$duration" -v a="$AUDIO_BITRATE_K" 'BEGIN {
    if (dur <= 0) { print 1800; exit; }
    total = (mb * 8192) / dur;
    video = total - a - 16;
    if (video < 300) video = 300;
    if (video > 4200) video = 4200;
    printf "%.0f", video;
  }')"

  preview_maxrate_kbps=$((preview_video_kbps * 12 / 10))
  preview_bufsize_kbps=$((preview_video_kbps * 2))
  mobile_maxrate_kbps=$((mobile_video_kbps * 13 / 10))
  mobile_bufsize_kbps=$((mobile_video_kbps * 2))

  preview_filter="scale='min(${PREVIEW_WIDTH},iw)':-2:flags=lanczos,fps=24,format=yuv420p"
  mobile_filter="scale='min(${MOBILE_WIDTH},iw)':-2:flags=lanczos,fps=30,format=yuv420p"

  echo ""
  echo "Source: $source_path"
  echo "  Duration: ${duration}s"
  echo "  Preview target bitrate: ${preview_video_kbps}k"
  echo "  Mobile target bitrate: ${mobile_video_kbps}k (+ ${AUDIO_BITRATE_K}k audio)"

  if [[ -f "$preview_path" && "$OVERWRITE" -eq 0 ]]; then
    echo "  Preview exists, skipping: $preview_path"
  else
    run_cmd ffmpeg -hide_banner -loglevel error "$overwrite_flag" \
      -ss 0 -t "$PREVIEW_SECONDS" -i "$source_path" \
      -map 0:v:0 -an \
      -vf "$preview_filter" \
      -c:v libx264 -preset medium -profile:v high \
      -b:v "${preview_video_kbps}k" -maxrate "${preview_maxrate_kbps}k" -bufsize "${preview_bufsize_kbps}k" \
      -x264-params "keyint=24:min-keyint=24:scenecut=0" \
      -movflags +faststart \
      "$preview_path"
  fi

  if [[ -f "$mobile_path" && "$OVERWRITE" -eq 0 ]]; then
    echo "  Mobile exists, skipping: $mobile_path"
  else
    run_cmd ffmpeg -hide_banner -loglevel error "$overwrite_flag" \
      -i "$source_path" \
      -map 0:v:0 -map 0:a:0? \
      -vf "$mobile_filter" \
      -c:v libx264 -preset slow -profile:v high -level 4.0 \
      -b:v "${mobile_video_kbps}k" -maxrate "${mobile_maxrate_kbps}k" -bufsize "${mobile_bufsize_kbps}k" \
      -x264-params "keyint=30:min-keyint=30:scenecut=0" \
      -c:a aac -b:a "${AUDIO_BITRATE_K}k" -ac 2 -ar 48000 \
      -movflags +faststart \
      "$mobile_path"
  fi

  if [[ "$DRY_RUN" -eq 1 ]]; then
    source_bytes="$(file_size_bytes "$source_path")"
    total_source_bytes=$((total_source_bytes + source_bytes))
    processed_count=$((processed_count + 1))
    echo "  Output preview: $preview_path (dry-run)"
    echo "  Output mobile : $mobile_path (dry-run)"
    continue
  fi

  source_bytes="$(file_size_bytes "$source_path")"
  preview_bytes=0
  mobile_bytes=0

  if [[ -f "$preview_path" ]]; then
    preview_bytes="$(file_size_bytes "$preview_path")"
  fi
  if [[ -f "$mobile_path" ]]; then
    mobile_bytes="$(file_size_bytes "$mobile_path")"
  fi

  total_source_bytes=$((total_source_bytes + source_bytes))
  total_preview_bytes=$((total_preview_bytes + preview_bytes))
  total_mobile_bytes=$((total_mobile_bytes + mobile_bytes))
  processed_count=$((processed_count + 1))

  echo "  Output preview: $preview_path ($(human_size "$preview_bytes"))"
  echo "  Output mobile : $mobile_path ($(human_size "$mobile_bytes"))"

  if [[ "$DRY_RUN" -eq 0 ]]; then
    printf '%s,%s,%s,%s,%s,%s,%s\n' \
      "$source_path" "$preview_path" "$mobile_path" "$duration" \
      "$source_bytes" "$preview_bytes" "$mobile_bytes" >> "$manifest_path"
  fi
done

echo ""
echo "Done."
echo "Processed clips : $processed_count"
echo "Source total    : $(human_size "$total_source_bytes")"
echo "Preview total   : $(human_size "$total_preview_bytes")"
echo "Mobile total    : $(human_size "$total_mobile_bytes")"
if [[ "$DRY_RUN" -eq 0 ]]; then
  echo "Manifest        : $manifest_path"
else
  echo "Manifest        : skipped (dry-run)"
fi
