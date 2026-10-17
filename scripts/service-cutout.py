"""Service-page cut-out of Gisela from a frame and its BiRefNet matte.

Usage:
  ffmpeg -ss <seconds> -i <clip> -frames:v 1 \
    -vf "scale=in_color_matrix=bt709:in_range=tv,format=rgb24" /tmp/frame.png
  <venv>/bin/python scripts/hero-matte.py /tmp/frame.png /tmp/matte.png
  python3 scripts/service-cutout.py /tmp/frame.png /tmp/matte.png public/uploads/service-cutout-<name>.webp [bottom_y]

Needs Pillow, numpy and scipy. For a frame shot on the green screen use
scripts/chroma-cutout.py instead; it needs no matte.

The frame is decoded as BT.709, as the browser plays these clips. The matte
(BiRefNet-portrait, two passes; see hero-matte.py) is used as it is, and:

- Edge colour: a pixel that is not fully solid takes the colour of the nearest
  solid pixel of her, as on the home hero, so no background is left in her hair.
- Only the largest shape and what touches it is kept, so specks of the
  background do not widen the crop.
- The crop is tight on the sides and top. The bottom is a hard cut at the
  bottom of the frame, or at bottom_y when something in front of her (a table)
  would otherwise cut across her; the page fades the lower part of the figure.

Prints the cut-out size, which goes in KEYNOTE_CUTOUTS
(src/data/service-page-imagery.ts). The page draws the figure 700 px tall on
desktop and 470 px on phones, so a cut-out under about 1400 px tall is
upscaled on retina screens.
"""

import sys

import numpy as np
from PIL import Image
from scipy.ndimage import binary_dilation, distance_transform_edt, label

KEEP_MARGIN_PX = 8
CROP_PAD_PX = 4


def main(frame_path, matte_path, out_path, bottom_y=None):
    rgb = np.asarray(Image.open(frame_path).convert('RGB'), np.float32)
    alpha = np.asarray(Image.open(matte_path).convert('L'), np.float32) / 255
    height, width = alpha.shape
    y1 = int(bottom_y) if bottom_y else height

    shapes, _ = label(alpha > 0.5)
    sizes = np.bincount(shapes.ravel())
    sizes[0] = 0
    alpha *= binary_dilation(shapes == sizes.argmax(), iterations=KEEP_MARGIN_PX)

    solid = alpha >= 0.98
    _, (iy, ix) = distance_transform_edt(~solid, return_indices=True)
    rgb = np.where(solid[..., None], rgb, rgb[iy, ix])

    ys, xs = np.nonzero(alpha[:y1] > 0.02)
    x0, x1 = max(0, xs.min() - CROP_PAD_PX), min(width, xs.max() + 1 + CROP_PAD_PX)
    y0 = max(0, ys.min() - CROP_PAD_PX)

    rgba = np.dstack([rgb, alpha * 255])[y0:y1, x0:x1]
    cutout = Image.fromarray((rgba + 0.5).clip(0, 255).astype(np.uint8), 'RGBA')
    cutout.save(out_path, 'WEBP', quality=92, alpha_quality=100, method=6)
    print(f'{out_path}: {x1 - x0}x{y1 - y0}, at ({x0}, {y0}) in the {width}x{height} frame')


if __name__ == '__main__':
    main(*sys.argv[1:5])
