import { describe, expect, it } from 'vitest';
import {
  parseHlsMasterVariants,
  selectNativeHlsVariant,
  selectTheaterLevel,
} from '@/components/media/AdaptiveVideo';

// Shapes mirror the ladders scripts/encode-hls.sh writes: every resolution in
// AV1 / HEVC / H.264, ordered the way hls.js hands them over — ascending
// bitrate, already filtered to codecs the browser decodes.
const ladder = (widths: number[]) =>
  widths.flatMap((width) => [{ width }, { width }, { width }]);

const LEGACY_720 = ladder([360, 540, 720]);
const NUEVOS_1080 = ladder([360, 540, 720, 1080]);
const SOURCE_2160 = ladder([360, 540, 720, 1080, 1440, 2160]);

const widthAt = (levels: { width: number }[], index: number) => levels[index].width;

describe('selectTheaterLevel', () => {
  it('starts at 1080p on a 3x phone rather than the bottom of the ladder', () => {
    const { capIndex, startIndex } = selectTheaterLevel(NUEVOS_1080, 366, 3);

    expect(widthAt(NUEVOS_1080, capIndex)).toBe(1080);
    expect(widthAt(NUEVOS_1080, startIndex)).toBe(1080);
  });

  it('still reaches 1080p on a low-density device the player box would size down', () => {
    // 430 CSS px at 1x resolves to 430 physical px, well under the 1080p rung —
    // the target width floor is what keeps the reel sharp here.
    const { capIndex } = selectTheaterLevel(NUEVOS_1080, 430, 1);

    expect(widthAt(NUEVOS_1080, capIndex)).toBe(1080);
  });

  it('picks the cheapest codec at the chosen resolution as the start level', () => {
    const { startIndex } = selectTheaterLevel(NUEVOS_1080, 366, 3);

    // First of the three 1080p rungs, i.e. lowest bitrate for the same picture.
    expect(startIndex).toBe(NUEVOS_1080.findIndex((level) => level.width === 1080));
  });

  it('clamps to the top rung when the source never reaches 1080p', () => {
    const { capIndex, startIndex } = selectTheaterLevel(LEGACY_720, 366, 3);

    expect(widthAt(LEGACY_720, capIndex)).toBe(720);
    expect(widthAt(LEGACY_720, startIndex)).toBe(720);
  });

  it('does not spend a 4K ladder on a player no phone can resolve past', () => {
    const { capIndex } = selectTheaterLevel(SOURCE_2160, 366, 3);

    expect(widthAt(SOURCE_2160, capIndex)).toBe(1080);
  });

  it('allows a high-density device its full resolution when the ladder has it', () => {
    // 430 CSS px at 4x resolves to 1720 physical px, so 1440p is genuinely visible.
    const { capIndex } = selectTheaterLevel(SOURCE_2160, 430, 4);

    expect(widthAt(SOURCE_2160, capIndex)).toBe(1440);
  });
});

// A trimmed copy of a real master from the CDN: every rung in AV1 / HEVC /
// H.264, lowest bitrate first — which is why Safari, left to itself, opens the
// theater on 360p.
const MASTER = `#EXTM3U
#EXT-X-VERSION:7
#EXT-X-STREAM-INF:BANDWIDTH=560000,AVERAGE-BANDWIDTH=400000,RESOLUTION=360x204,FRAME-RATE=30.000,CODECS="av01.0.04M.08"
360p/av1/index.m3u8
#EXT-X-STREAM-INF:BANDWIDTH=630000,AVERAGE-BANDWIDTH=450000,RESOLUTION=360x204,FRAME-RATE=30.000,CODECS="hvc1.1.6.L93.B0"
360p/hevc/index.m3u8
#EXT-X-STREAM-INF:BANDWIDTH=980000,AVERAGE-BANDWIDTH=700000,RESOLUTION=360x204,FRAME-RATE=30.000,CODECS="avc1.64001e"
360p/h264/index.m3u8
#EXT-X-STREAM-INF:BANDWIDTH=4760000,AVERAGE-BANDWIDTH=3400000,RESOLUTION=1080x608,FRAME-RATE=30.000,CODECS="av01.0.08M.08"
1080p/av1/index.m3u8
#EXT-X-STREAM-INF:BANDWIDTH=5320000,AVERAGE-BANDWIDTH=3800000,RESOLUTION=1080x608,FRAME-RATE=30.000,CODECS="hvc1.1.6.L120.B0"
1080p/hevc/index.m3u8
#EXT-X-STREAM-INF:BANDWIDTH=8400000,AVERAGE-BANDWIDTH=6000000,RESOLUTION=1080x608,FRAME-RATE=30.000,CODECS="avc1.640028"
1080p/h264/index.m3u8
`;

const playsEverything = () => true;
// What an iPhone without an AV1 decoder reports.
const playsWithoutAv1 = (codecs: string) => !codecs.startsWith('av01');

describe('parseHlsMasterVariants', () => {
  it('reads every variant with its peak bandwidth, not AVERAGE-BANDWIDTH', () => {
    const variants = parseHlsMasterVariants(MASTER);

    expect(variants).toHaveLength(6);
    expect(variants[0]).toEqual({
      uri: '360p/av1/index.m3u8',
      width: 360,
      bandwidth: 560000,
      codecs: 'av01.0.04M.08',
    });
  });

  it('ignores tags that are not variants', () => {
    expect(parseHlsMasterVariants('#EXTM3U\n#EXT-X-VERSION:7\n')).toEqual([]);
  });

  it('skips a stream tag whose URI line is missing', () => {
    const truncated = '#EXTM3U\n#EXT-X-STREAM-INF:BANDWIDTH=560000,RESOLUTION=360x204\n';

    expect(parseHlsMasterVariants(truncated)).toEqual([]);
  });
});

describe('selectNativeHlsVariant', () => {
  it('pins Safari to the 1080p rung instead of the 360p one it would open on', () => {
    const variant = selectNativeHlsVariant(MASTER, 366, 3, playsEverything);

    expect(variant?.uri).toBe('1080p/av1/index.m3u8');
  });

  it('skips rungs the device cannot decode', () => {
    const variant = selectNativeHlsVariant(MASTER, 366, 3, playsWithoutAv1);

    expect(variant?.uri).toBe('1080p/hevc/index.m3u8');
  });

  it('returns null when nothing in the ladder is playable, so the master stands', () => {
    expect(selectNativeHlsVariant(MASTER, 366, 3, () => false)).toBeNull();
    expect(selectNativeHlsVariant('#EXTM3U\n', 366, 3, playsEverything)).toBeNull();
  });
});
