"""Build the home hero's two aligned layers from one photo and its matte.

Usage:
  <venv>/bin/python scripts/hero-matte.py <photo.jpg> /tmp/hero-matte.png
  python3 scripts/clean-hero-cutout.py <photo.jpg> /tmp/hero-matte.png public/uploads

Needs Pillow, numpy and scipy.

Writes the cut-out of her (gisela-cutout-*.webp/png) and the scene she stood
in with her removed and lightly blurred (gisela-scene-*.webp), then prints
where the cut-out sits inside the photo. The hero stacks the two in the same
frame, so every edge pixel lands on the background it came from; the printed
values are the `--feed-cut-*`, `--feed-face-x` and `--feed-head-y` variables in
src/index.css, and the cut-out size goes on the <img> in Hero.tsx.

The matte comes from BiRefNet (scripts/hero-matte.py) and is used as it is.
The only edge treatment left is colour: a partly transparent pixel still holds
some of the original background, so it takes the colour of the nearest solid
pixel of her instead. Over the white name that keeps her hair dark to the tip.
"""

import sys

import numpy as np
from PIL import Image
from scipy.ndimage import distance_transform_edt, gaussian_filter

WIDTHS = (520, 760)
SCENE_WIDTHS = (1344, 2016)
# At the photo's full width; the hero shows it at roughly half that, so this
# reads as a gentle, lens-like softness rather than a smear.
SCENE_BLUR_SIGMA = 14
SCENE_HOLE_MARGIN_PX = 18


def push_pull_fill(colour, known):
    """Fill unknown pixels from their surroundings with a premultiplied
    pyramid: each coarser level averages what is known, and each finer level
    keeps its own known pixels and takes the rest from the level below."""
    levels = []
    premult, weight = colour * known[..., None], known.astype(np.float32)
    while min(weight.shape) > 2:
        levels.append((premult, weight))
        h, w = weight.shape
        ph, pw = h + h % 2, w + w % 2
        premult = np.pad(premult, ((0, ph - h), (0, pw - w), (0, 0)), mode='edge')
        weight = np.pad(weight, ((0, ph - h), (0, pw - w)), mode='edge')
        premult = premult.reshape(ph // 2, 2, pw // 2, 2, 3).mean((1, 3))
        weight = weight.reshape(ph // 2, 2, pw // 2, 2).mean((1, 3))
    estimate = premult / np.maximum(weight, 1e-6)[..., None]
    for premult, weight in reversed(levels):
        h, w = weight.shape
        up = estimate.repeat(2, axis=0).repeat(2, axis=1)[:h, :w]
        up = np.stack([gaussian_filter(up[..., i], 1.0) for i in range(3)], -1)
        estimate = premult + (1 - weight)[..., None] * up
    return estimate


def build_scene(colour, alpha, out_dir):
    hole = distance_transform_edt(alpha <= 0.02) <= SCENE_HOLE_MARGIN_PX
    scene = push_pull_fill(colour, (~hole).astype(np.float32))
    scene = np.stack([gaussian_filter(scene[..., i], SCENE_BLUR_SIGMA) for i in range(3)], -1)
    image = Image.fromarray((np.clip(scene, 0, 1) * 255 + 0.5).astype(np.uint8), 'RGB')
    for target in SCENE_WIDTHS:
        size = (target, round(image.height * target / image.width))
        image.resize(size, Image.LANCZOS).save(f'{out_dir}/gisela-scene-{target}.webp', 'WEBP', quality=84, method=6)


def main(photo_path, matte_path, out_dir):
    colour = np.asarray(Image.open(photo_path).convert('RGB'), dtype=np.float32) / 255
    alpha = np.asarray(Image.open(matte_path).convert('L'), dtype=np.float32) / 255
    alpha = np.clip((alpha - 0.02) / 0.96, 0, 1)

    inner = alpha >= 0.98
    _, (rows, cols) = distance_transform_edt(~inner, return_indices=True)
    nearest = colour[rows, cols]
    weight = alpha[..., None]
    foreground = np.where(inner[..., None], colour, colour * weight + nearest * (1 - weight))

    rgba = np.dstack([foreground, alpha[..., None]])
    full = Image.fromarray((rgba * 255 + 0.5).astype(np.uint8), 'RGBA')
    x0, y0, x1, y1 = full.getbbox()
    cutout = full.crop((x0, y0, x1, y1))
    width, height = cutout.size
    photo_w, photo_h = full.size

    # WebP: lossy colour, lossless alpha. AVIF compresses alpha lossily and
    # steps the outline.
    for target in (*WIDTHS, width):
        image = cutout if target == width else cutout.resize((target, round(height * target / width)), Image.LANCZOS)
        image.save(f'{out_dir}/gisela-cutout-{target}.webp', 'WEBP', quality=92, alpha_quality=100, method=6)
    cutout.resize((640, round(height * 640 / width)), Image.LANCZOS).save(
        f'{out_dir}/gisela-cutout-640.png', 'PNG', optimize=True,
    )

    build_scene(colour, alpha, out_dir)

    head = alpha[y0:y0 + round(height * 0.22)] > 0.5
    head_cx = np.nonzero(head.any(axis=0))[0].mean()
    print(f'photo {photo_w}x{photo_h}, cut-out {width}x{height} at ({x0}, {y0})')
    print(f'--feed-cut-left: {x0 / photo_w * 100:.3f}%;')
    print(f'--feed-cut-top: {y0 / photo_h * 100:.3f}%;')
    print(f'--feed-cut-width: {width / photo_w * 100:.3f}%;')
    print(f'--feed-face-x: {head_cx / photo_w:.4f};')
    print(f'--feed-head-y: {y0 / photo_h:.4f};')


if __name__ == '__main__':
    main(*sys.argv[1:4])
