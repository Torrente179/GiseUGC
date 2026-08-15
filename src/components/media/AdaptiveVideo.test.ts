import { describe, expect, it } from 'vitest';
import { selectTheaterLevel } from '@/components/media/AdaptiveVideo';

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
