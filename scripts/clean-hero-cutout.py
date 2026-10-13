"""Clean the edges of a Vision cut-out and export the hero sizes.

Usage:
  swift scripts/hero-cutout.swift <original.jpg> /tmp/cutout-raw.png
  python3 scripts/clean-hero-cutout.py <original.jpg> /tmp/cutout-raw.png public/uploads

Needs Pillow (with AVIF), numpy and scipy.

Two problems with the raw Vision mask, both visible on the dark hero:
1. Soft edge pixels still carry the original background's colour, so bright
   glass behind her hair shows up as a light rim. Each edge pixel is solved
   for its foreground colour against a local estimate of that background.
2. The mask counts some strips of light background between hair strands as
   solid. Near the outline, a pixel is dropped only when it sits in a dark
   hair neighbourhood, is lighter than that hair, and the background right
   beside it is light too; hair highlights next to a dark background stay.
"""

import sys

import numpy as np
from PIL import Image
from scipy.ndimage import distance_transform_edt, gaussian_filter, uniform_filter

EDGE_BAND_PX = 34
HAIR_LIFT = 0.06
WIDTHS = (520, 760)


def luminance(rgb):
    return 0.2126 * rgb[..., 0] + 0.7152 * rgb[..., 1] + 0.0722 * rgb[..., 2]


def local_background(colour, background_mask, radius):
    weight = gaussian_filter(background_mask, radius)
    channels = [gaussian_filter(colour[..., i] * background_mask, radius) for i in range(3)]
    return np.stack(channels, -1) / np.maximum(weight, 1e-4)[..., None], weight


def main(original_path, raw_cutout_path, out_dir):
    colour = np.asarray(Image.open(original_path).convert('RGB'), dtype=np.float32) / 255
    alpha = np.asarray(Image.open(raw_cutout_path).convert('RGBA'), dtype=np.float32)[..., 3] / 255
    lum = luminance(colour)

    # 2) strips of background caught inside the hair outline
    solid = (alpha > 0.5).astype(np.float32)
    depth = distance_transform_edt(solid)
    band = (depth > 0) & (depth <= EDGE_BAND_PX)
    coverage = uniform_filter(solid, 61)
    subject_lum = uniform_filter(lum * solid, 61) / np.maximum(coverage, 1e-4)
    background, background_weight = local_background(colour, (alpha < 0.02).astype(np.float32), 24)
    background_lum = luminance(background)
    stray = (
        band
        & (subject_lum < 0.30)
        & (lum > subject_lum + HAIR_LIFT)
        & (background_lum > 0.32)
        & (np.abs(lum - background_lum) < 0.30)
        & (background_weight > 0.02)
    )
    alpha = alpha * (1 - np.clip(gaussian_filter(stray.astype(np.float32), 1.2) * 1.6, 0, 1))

    # 1) decontaminate what is left of the soft edge
    background, _ = local_background(colour, (alpha < 0.02).astype(np.float32), 18)
    edge = (alpha > 0.02) & (alpha < 0.98)
    safe_alpha = np.maximum(alpha, 0.08)[..., None]
    foreground = colour.copy()
    foreground[edge] = np.clip((colour[edge] - (1 - safe_alpha[edge]) * background[edge]) / safe_alpha[edge], 0, 1)

    # wisps under ~15% opacity drop out; the rest keeps its gradient
    t = np.clip((alpha - 0.10) / 0.80, 0, 1)
    alpha = t * t * (3 - 2 * t)

    rgba = np.dstack([foreground, alpha[..., None]])
    cutout = Image.fromarray((rgba * 255 + 0.5).astype(np.uint8), 'RGBA')
    cutout = cutout.crop(cutout.getbbox())
    width, height = cutout.size
    print(f'cut-out {width}x{height}')

    for target in (*WIDTHS, width):
        image = cutout if target == width else cutout.resize((target, round(height * target / width)), Image.LANCZOS)
        image.save(f'{out_dir}/gisela-cutout-{target}.avif', 'AVIF', quality=72, speed=4)
        image.save(f'{out_dir}/gisela-cutout-{target}.webp', 'WEBP', quality=95, method=6)
    cutout.resize((640, round(height * 640 / width)), Image.LANCZOS).save(
        f'{out_dir}/gisela-cutout-640.png', 'PNG', optimize=True,
    )


if __name__ == '__main__':
    main(*sys.argv[1:4])
