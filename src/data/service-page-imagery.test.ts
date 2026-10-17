// @vitest-environment node
import { existsSync } from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
import { describe, expect, it } from 'vitest';
import { KEYNOTE_CUTOUTS } from '@/data/service-page-imagery';

const publicFile = (src: string) => path.join(process.cwd(), 'public', src);

describe('service cut-outs', () => {
  it.each(Object.entries(KEYNOTE_CUTOUTS))(
    '%s: a transparent WebP in public/, at the size the <img> declares',
    async (_id, cutout) => {
      expect(existsSync(publicFile(cutout.src)), cutout.src).toBe(true);
      const meta = await sharp(publicFile(cutout.src)).metadata();
      expect(meta.format).toBe('webp');
      expect(meta.hasAlpha).toBe(true);
      expect([meta.width, meta.height]).toEqual([cutout.width, cutout.height]);
    },
  );
});
