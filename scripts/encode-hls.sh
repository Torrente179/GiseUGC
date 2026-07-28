#!/usr/bin/env bash
set -euo pipefail

# ─────────────────────────────────────────────────────────────────────────────
# Multi-codec adaptive HLS (CMAF / fMP4) for R2 delivery.
#
# Produces ONE adaptive ladder per clip (the `main` rendition). Adaptive HLS
# already serves the right resolution to every device, so the old separate
# main/mobile/preview ladders were redundant — this builds a single ladder that
# every player adapts within.
#
# Each resolution tier is encoded in THREE codecs so every browser gets the most
# efficient stream it can decode, with universal fallback:
#   • AV1  (libsvtav1)  → Chrome / Firefox / Edge (and new Apple silicon)
#   • HEVC (libx265, hvc1 tag) → Safari / iOS native HLS
#   • H.264 (libx264 high) → universal fallback
#
# Output:
#   tmp/video-hls/<base>/main/master.m3u8
#   tmp/video-hls/<base>/main/<width>p/<codec>/{index.m3u8,init.mp4,segment_*.m4s}
#
# Upload each <base> folder to:  videos/hls/<base>/
# Runtime URL (see r2HlsMaster / catalog): videos/hls/<base>/main/master.m3u8
# ─────────────────────────────────────────────────────────────────────────────

usage() {
  cat <<'EOF'
Create a multi-codec (AV1 + HEVC + H.264) adaptive HLS ladder per clip.

Usage:
  bash scripts/encode-hls.sh [options] [file1.mp4 file2.mov ...]

Options:
  --input-dir DIR     Input directory (default: media-sources/legacy)
  --output-dir DIR    Output directory (default: tmp/video-hls)
  --overwrite         Overwrite existing outputs
  --dry-run           Print ffmpeg commands without running them
  -h, --help          Show help

Tunable via env (encode speed vs quality):
  AV1_PRESET   (default 7)      libsvtav1 preset (0=slow/best .. 13=fast)
  HEVC_PRESET  (default medium) libx265 preset
  H264_PRESET  (default slow)   libx264 preset
  AUDIO_KBPS   (default 128)    AAC audio bitrate for the ladder
EOF
}

AV1_PRESET="${AV1_PRESET:-7}"
HEVC_PRESET="${HEVC_PRESET:-medium}"
H264_PRESET="${H264_PRESET:-slow}"
AUDIO_KBPS="${AUDIO_KBPS:-128}"

# Resolution ladder (horizontal pixels). Each tier is gated by the source width
# so we never upscale. High-resolution masters retain 1440p/2160p delivery;
# smaller sources stop at their native width. For vertical phone video the
# "width" is the short side (2160 means a native 2160×3840 portrait master).
declare -a MAIN_LADDER=(360 540 720 1080 1440 2160)
declare -a CODECS=(av1 hevc h264)

require_binary() {
  local binary="$1"
  if ! command -v "$binary" >/dev/null 2>&1; then
    echo "Missing required binary: $binary" >&2
    exit 1
  fi
}

require_encoder() {
  local enc="$1"
  if ! ffmpeg -hide_banner -encoders 2>/dev/null | grep -q "[[:space:]]${enc}[[:space:]]"; then
    echo "Missing required ffmpeg encoder: $enc (rebuild/reinstall ffmpeg)." >&2
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
  ffprobe -v error -select_streams v:0 -show_entries "stream=$2" -of default=nw=1:nk=1 "$1"
}

file_size_bytes() {
  if stat -f%z "$1" >/dev/null 2>&1; then stat -f%z "$1"; else stat -c%s "$1"; fi
}

human_size() {
  awk -v b="$1" 'BEGIN {
    split("B KB MB GB TB", u, " "); i = 1;
    while (b >= 1024 && i < 5) { b /= 1024; i++; }
    printf "%.2f %s", b, u[i];
  }'
}

# Target video bitrate (kbps) per codec/width. AV1 & HEVC ≈ 55-65% of H.264 for
# equal perceptual quality, so they look the same while shipping fewer bytes.
bitrate_for() {
  local codec="$1" w="$2"
  case "$codec" in
    h264)
      case "$w" in
        360) echo 700;; 540) echo 1300;; 720) echo 2600;;
        1080) echo 6000;; 1440) echo 10000;; 2160) echo 18000;; *) echo 2600;;
      esac;;
    hevc)
      case "$w" in
        360) echo 450;; 540) echo 820;; 720) echo 1650;;
        1080) echo 3800;; 1440) echo 6300;; 2160) echo 11500;; *) echo 1650;;
      esac;;
    av1)
      case "$w" in
        360) echo 400;; 540) echo 750;; 720) echo 1500;;
        1080) echo 3400;; 1440) echo 5700;; 2160) echo 10500;; *) echo 1500;;
      esac;;
  esac
}

# RFC 6381 CODECS string per codec/width. hls.js calls
# MediaSource.isTypeSupported() with this, so it must be valid or the variant is
# silently dropped. Levels scale with resolution.
codec_string() {
  local codec="$1" w="$2"
  case "$codec" in
    h264)
      case "$w" in
        360|540) echo "avc1.64001e";;  # High@3.0
        720) echo "avc1.64001f";;       # High@3.1
        1080) echo "avc1.640028";;      # High@4.0
        1440) echo "avc1.640032";;      # High@5.0
        2160) echo "avc1.640033";;      # High@5.1
        *) echo "avc1.640028";;
      esac;;
    hevc)
      case "$w" in
        360|540|720) echo "hvc1.1.6.L93.B0";;  # Main@3.1
        1080) echo "hvc1.1.6.L120.B0";;        # Main@4.0
        1440) echo "hvc1.1.6.L150.B0";;        # Main@5.0
        2160) echo "hvc1.1.6.L153.B0";;        # Main@5.1
        *) echo "hvc1.1.6.L120.B0";;
      esac;;
    av1)
      # av01.<profile>.<level><tier>.<bit-depth>; Main profile, 8-bit.
      case "$w" in
        360|540) echo "av01.0.04M.08";;
        720) echo "av01.0.05M.08";;
        1080) echo "av01.0.08M.08";;
        1440) echo "av01.0.12M.08";;
        2160) echo "av01.0.13M.08";;
        *) echo "av01.0.08M.08";;
      esac;;
  esac
}

encode_variant() {
  local codec="$1" source_path="$2" output_dir="$3" max_width="$4" video_kbps="$5"
  mkdir -p "$output_dir"

  local maxrate=$(( video_kbps * 14 / 10 ))
  local bufsize=$(( video_kbps * 2 ))
  local vfilter="scale='min(${max_width},iw)':-2:flags=lanczos,fps=30,format=yuv420p"

  local -a vcodec=()
  local -a rate=()
  case "$codec" in
    av1)
      # SVT-AV1 only allows a max-bitrate cap in CRF mode, so use plain
      # target-bitrate VBR (no -maxrate/-bufsize) for the ladder tiers.
      vcodec=(-c:v libsvtav1 -preset "$AV1_PRESET" -g 30 -svtav1-params "scd=0" -pix_fmt yuv420p)
      rate=(-b:v "${video_kbps}k")
      ;;
    hevc)
      vcodec=(-c:v libx265 -preset "$HEVC_PRESET" -tag:v hvc1 \
        -x265-params "keyint=30:min-keyint=30:scenecut=0" -pix_fmt yuv420p)
      rate=(-b:v "${video_kbps}k" -maxrate "${maxrate}k" -bufsize "${bufsize}k")
      ;;
    h264)
      vcodec=(-c:v libx264 -preset "$H264_PRESET" -profile:v high \
        -x264-params "keyint=30:min-keyint=30:scenecut=0" -pix_fmt yuv420p)
      rate=(-b:v "${video_kbps}k" -maxrate "${maxrate}k" -bufsize "${bufsize}k")
      ;;
  esac

  run_cmd ffmpeg -hide_banner -loglevel error "$OVERWRITE_FLAG" \
    -i "$source_path" \
    -map 0:v:0 -map '0:a:0?' \
    -vf "$vfilter" \
    "${vcodec[@]}" \
    "${rate[@]}" \
    -c:a aac -b:a "${AUDIO_KBPS}k" -ac 2 -ar 48000 \
    -hls_time 1 \
    -hls_playlist_type vod \
    -hls_segment_type fmp4 \
    -hls_fmp4_init_filename init.mp4 \
    -hls_segment_filename "$output_dir/segment_%03d.m4s" \
    "$output_dir/index.m3u8"
}

write_master_playlist() {
  local rendition_dir="$1" source_width="$2" source_height="$3" selected_codec="${4:-}"
  local master_suffix=""
  [[ -n "$selected_codec" ]] && master_suffix="-${selected_codec}"
  local master_path="$rendition_dir/master${master_suffix}.m3u8"

  {
    echo '#EXTM3U'
    echo '#EXT-X-VERSION:7'
    for width in "${MAIN_LADDER[@]}"; do
      (( width > source_width )) && continue
      for codec in "${CODECS[@]}"; do
        [[ -n "$selected_codec" && "$codec" != "$selected_codec" ]] && continue
        local variant_playlist="$rendition_dir/${width}p/${codec}/index.m3u8"
        [[ -f "$variant_playlist" ]] || continue
        local kbps height avg peak cs
        kbps="$(bitrate_for "$codec" "$width")"
        height="$(awk -v sw="$source_width" -v sh="$source_height" -v w="$width" 'BEGIN {
          h = int((sh * w / sw) + 0.5); if (h % 2 == 1) h += 1; print h;
        }')"
        avg=$(( kbps * 1000 ))
        peak=$(( kbps * 1400 ))
        cs="$(codec_string "$codec" "$width")"
        echo "#EXT-X-STREAM-INF:BANDWIDTH=${peak},AVERAGE-BANDWIDTH=${avg},RESOLUTION=${width}x${height},FRAME-RATE=30.000,CODECS=\"${cs}\""
        echo "${width}p/${codec}/index.m3u8"
      done
    done
  } > "$master_path"
}

# ── Args ─────────────────────────────────────────────────────────────────────
INPUT_DIR="media-sources/legacy"
OUTPUT_DIR="tmp/video-hls"
OVERWRITE=0
DRY_RUN=0
FILES=()

while (($#)); do
  case "$1" in
    --input-dir) INPUT_DIR="$2"; shift 2;;
    --output-dir) OUTPUT_DIR="$2"; shift 2;;
    --overwrite) OVERWRITE=1; shift;;
    --dry-run) DRY_RUN=1; shift;;
    -h|--help) usage; exit 0;;
    --) shift; while (($#)); do FILES+=("$1"); shift; done;;
    -*) echo "Unknown option: $1" >&2; usage; exit 1;;
    *) FILES+=("$1"); shift;;
  esac
done

require_binary ffmpeg
require_binary ffprobe
require_encoder libsvtav1
require_encoder libx265
require_encoder libx264

OVERWRITE_FLAG="-n"
[[ "$OVERWRITE" -eq 1 ]] && OVERWRITE_FLAG="-y"

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
    find "$INPUT_DIR" "media-sources/nuevos" -maxdepth 1 -type f \( -iname '*.mp4' -o -iname '*.mov' \) \
      ! -iname '*-preview.mp4' ! -iname '*-mobile.mp4' 2>/dev/null | sort
  )
fi

if [[ "${#SOURCES[@]}" -eq 0 ]]; then
  echo "No source video files found."
  exit 0
fi

mkdir -p "$OUTPUT_DIR"
manifest_path="$OUTPUT_DIR/manifest.csv"
if [[ "$DRY_RUN" -eq 0 ]]; then
  printf 'source,hls_base,main_master,bytes\n' > "$manifest_path"
fi

for source_path in "${SOURCES[@]}"; do
  filename="$(basename "$source_path")"
  base_name="${filename%.*}"
  encoded_width="$(probe_field "$source_path" width)"
  encoded_height="$(probe_field "$source_path" height)"
  rotation="$(ffprobe -v error -select_streams v:0 -show_entries stream_tags=rotate:stream_side_data=rotation -of default=nw=1:nk=1 "$source_path" | tail -n 1 || true)"
  source_width="$encoded_width"
  source_height="$encoded_height"
  if [[ "$rotation" == "90" || "$rotation" == "-90" || "$rotation" == "270" || "$rotation" == "-270" ]]; then
    source_width="$encoded_height"
    source_height="$encoded_width"
  fi
  base_dir="$OUTPUT_DIR/$base_name"
  rendition_dir="$base_dir/main"

  echo ""
  echo "Source: $source_path  (${source_width}x${source_height})"
  echo "  HLS base: $base_dir"

  for width in "${MAIN_LADDER[@]}"; do
    (( width > source_width )) && continue
    for codec in "${CODECS[@]}"; do
      kbps="$(bitrate_for "$codec" "$width")"
      echo "  • ${width}p ${codec} @ ${kbps}k"
      encode_variant "$codec" "$source_path" "$rendition_dir/${width}p/${codec}" "$width" "$kbps"
    done
  done

  if [[ "$DRY_RUN" -eq 0 ]]; then
    write_master_playlist "$rendition_dir" "$source_width" "$source_height"
    for codec in "${CODECS[@]}"; do
      write_master_playlist "$rendition_dir" "$source_width" "$source_height" "$codec"
    done
    bytes="$(find "$base_dir" -type f -exec stat -f%z {} \; 2>/dev/null | awk '{s+=$1} END {print s+0}')"
    printf '%s,%s,%s,%s\n' "$source_path" "$base_dir" "$rendition_dir/master.m3u8" "$bytes" >> "$manifest_path"
    echo "  Output size: $(human_size "$bytes")"
  fi
done

echo ""
echo "Done."
[[ "$DRY_RUN" -eq 0 ]] && echo "Manifest: $manifest_path"
