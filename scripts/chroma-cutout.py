"""Transparent cut-out of Gisela from a frame of the green-screen shoot.

Usage:
  python3 scripts/chroma-cutout.py "media-sources/nuevos/Croma Key.MP4" /tmp/cut.webp 7.5
  python3 scripts/chroma-cutout.py "public/uploads/videos/service-posters/Croma Key.jpg" /tmp/cut.webp

Needs Pillow, numpy and scipy, and ffmpeg when the source is a video (the third
argument is the time of the frame, in seconds).

The service-page cut-outs (public/uploads/service-cutout-*.webp) are this key
on the posters, which are the 1.2 s frame of each clip: run on those posters it
gives the same matte (IoU 0.9998-0.9999) and the same crop within 4 px. The three
"Croma key" clips were shot on a green screen, so the green is keyed out
directly and no segmentation model is needed. For a photo that was not shot on
a green screen, use scripts/hero-matte.py instead.

- Key: how far green rises above the larger of red and blue. At or below
  KEY_LOW the pixel is solid, at KEY_HIGH and above it is gone.
- Despill: green is capped at the larger of red and blue, which takes the green
  fringe off her hair and arms and leaves skin, the vest and the white top as
  they were (green is already the lowest channel there).
- Only the largest solid shape and a few pixels round it are kept, so specks of
  the backdrop do not widen the crop.
- The crop is tight on the sides and top and runs to the bottom of the frame:
  the bottom edge is a hard cut, so sit it on an edge or fade it.

Prints the cut-out size (the width and height in KEYNOTE_CUTOUTS) and where it
sits in the frame.
"""

import io
import subprocess
import sys

import numpy as np
from PIL import Image
from scipy.ndimage import binary_dilation, label

KEY_LOW = 0.05
KEY_HIGH = 0.25
KEEP_MARGIN_PX = 6
CROP_PAD_PX = 4


def read_frame(path, seconds):
    """A video frame is decoded the way the posters were (generate-service-posters.sh
    writes yuvj420p JPEGs, which decode as BT.601), so a new cut-out has the same
    colour as the posters and the three cut-outs already on the site."""
    if seconds is None:
        return Image.open(path).convert('RGB')
    png = subprocess.run(
        ['ffmpeg', '-v', 'error', '-ss', seconds, '-i', path, '-frames:v', '1',
         '-vf', 'scale=in_color_matrix=bt601:in_range=tv,format=rgb24',
         '-f', 'image2pipe', '-c:v', 'png', '-'],
        capture_output=True, check=True,
    ).stdout
    return Image.open(io.BytesIO(png)).convert('RGB')


def main(source, out_path, seconds=None):
    rgb = np.asarray(read_frame(source, seconds), np.float32) / 255
    height, width = rgb.shape[:2]
    red, green, blue = rgb[..., 0], rgb[..., 1], rgb[..., 2]

    excess = green - np.maximum(red, blue)
    alpha = 1 - np.clip((excess - KEY_LOW) / (KEY_HIGH - KEY_LOW), 0, 1)

    shapes, _ = label(alpha > 0.5)
    sizes = np.bincount(shapes.ravel())
    sizes[0] = 0
    keep = binary_dilation(shapes == sizes.argmax(), iterations=KEEP_MARGIN_PX)
    alpha *= keep

    rgb[..., 1] = np.minimum(green, np.maximum(red, blue))

    ys, xs = np.nonzero(alpha > 0.02)
    x0, x1 = max(0, xs.min() - CROP_PAD_PX), min(width, xs.max() + 1 + CROP_PAD_PX)
    y0, y1 = max(0, ys.min() - CROP_PAD_PX), height

    rgba = np.dstack([rgb, alpha])[y0:y1, x0:x1]
    cutout = Image.fromarray((rgba * 255 + 0.5).astype(np.uint8), 'RGBA')
    cutout.save(out_path, 'WEBP', quality=92, alpha_quality=100, method=6)
    print(f'{out_path}: {x1 - x0}x{y1 - y0}, at ({x0}, {y0}) in the {width}x{height} frame')


if __name__ == '__main__':
    main(*sys.argv[1:4])
