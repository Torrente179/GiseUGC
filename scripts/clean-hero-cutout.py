"""Build the home hero's two aligned layers from one photo.

Usage:
  swift scripts/hero-cutout.swift <original.jpg> /tmp/cutout-raw.png
  python3 scripts/clean-hero-cutout.py <original.jpg> /tmp/cutout-raw.png public/uploads

Writes the cut-out of her (gisela-cutout-*.webp/png) and the scene she stood
in with her removed and lightly blurred (gisela-scene-*.webp), then prints
where the cut-out sits inside the photo. The hero stacks the two in the same
frame, so every edge pixel lands on the background it came from; the printed
fractions are the `--feed-cut-*` values in src/index.css.

Needs Pillow (with AVIF), numpy and scipy.

The raw Vision mask has three problems on the dark hero:
1. Its outline is a smooth upscale of a low-resolution mask, so it drifts off
   the real edge and steps along arms. A guided filter, with the photo as the
   guide, snaps the alpha to the edges that are actually in the image.
2. Its interior is not fully opaque, and its soft edge still carries the
   original background's colour (a light rim against glass). The interior is
   made solid, and every partly transparent pixel takes its colour from the
   nearest solid pixel of her, so an edge can only ever fade, never glow or
   darken. (Solving each edge pixel against an estimated background, the
   previous approach, tinted the skin and left a dark rim where the estimate
   was off.)
3. It counts some strips of light background between hair strands as solid.
   Near the outline, a pixel is dropped only when it sits in a dark-hair
   neighbourhood, is lighter than that hair, and the background right beside it
   is light too; hair highlights next to a dark background stay.
"""

import sys

import numpy as np
from PIL import Image
from scipy.ndimage import distance_transform_edt, gaussian_filter, uniform_filter

EDGE_BAND_PX = 34
HAIR_LIFT = 0.06
GUIDE_RADIUS = 5
GUIDE_EPS = 4e-4
REFINE_BAND_PX = 14
WIDTHS = (520, 760)
SCENE_WIDTHS = (1344, 2016)
# At the photo's full width; the hero shows it at roughly half that, so this
# reads as a gentle, lens-like softness rather than a smear.
SCENE_BLUR_SIGMA = 14
SCENE_HOLE_MARGIN_PX = 18


def luminance(rgb):
    return 0.2126 * rgb[..., 0] + 0.7152 * rgb[..., 1] + 0.0722 * rgb[..., 2]


def box(arr, radius):
    return uniform_filter(arr, 2 * radius + 1, mode='reflect')


def guided_filter(guide, src, radius, eps):
    mean_i = box(guide, radius)
    mean_p = box(src, radius)
    cov_ip = box(guide * src, radius) - mean_i * mean_p
    var_i = box(guide * guide, radius) - mean_i * mean_i
    a = cov_ip / (var_i + eps)
    b = mean_p - a * mean_i
    return box(a, radius) * guide + box(b, radius)


def background_in_hair(colour, alpha, lum):
    solid = (alpha > 0.5).astype(np.float32)
    depth = distance_transform_edt(solid)
    band = (depth > 0) & (depth <= EDGE_BAND_PX)
    coverage = uniform_filter(solid, 61)
    subject_lum = uniform_filter(lum * solid, 61) / np.maximum(coverage, 1e-4)
    background_mask = (alpha < 0.02).astype(np.float32)
    weight = gaussian_filter(background_mask, 24)
    background = np.stack(
        [gaussian_filter(colour[..., i] * background_mask, 24) for i in range(3)], -1,
    ) / np.maximum(weight, 1e-4)[..., None]
    background_lum = luminance(background)
    stray = (
        band
        & (subject_lum < 0.30)
        & (lum > subject_lum + HAIR_LIFT)
        & (background_lum > 0.32)
        & (np.abs(lum - background_lum) < 0.30)
        & (weight > 0.02)
    )
    return np.clip(gaussian_filter(stray.astype(np.float32), 1.2) * 1.6, 0, 1)


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


def main(original_path, raw_cutout_path, out_dir):
    colour = np.asarray(Image.open(original_path).convert('RGB'), dtype=np.float32) / 255
    alpha = np.asarray(Image.open(raw_cutout_path).convert('RGBA'), dtype=np.float32)[..., 3] / 255
    lum = luminance(colour)

    # 1) snap the outline to the photo's own edges, only near the outline and
    #    only along skin and clothes. Against hair the filter shreds the strands,
    #    and step 2's colour fill already removes the halo there.
    refined = np.clip(guided_filter(lum, alpha, GUIDE_RADIUS, GUIDE_EPS), 0, 1)
    solid = alpha > 0.5
    near_edge = np.minimum(distance_transform_edt(solid), distance_transform_edt(~solid)) <= REFINE_BAND_PX
    coverage = uniform_filter(solid.astype(np.float32), 61)
    subject_lum = uniform_filter(lum * solid, 61) / np.maximum(coverage, 1e-4)
    light_subject = gaussian_filter((subject_lum >= 0.30).astype(np.float32), 6)
    alpha = np.where(near_edge, refined * light_subject + alpha * (1 - light_subject), alpha)

    # 3) strips of background caught inside the hair outline are repainted as
    #    hair rather than cut out: cut out, the white name behind her shows
    #    through them as a crack along her hair.
    stray = background_in_hair(colour, alpha, lum)

    # 2) solid interior, soft edge; the edge borrows colour from her. Around
    #    hair the falloff is steeper, so the outermost strands read as hair over
    #    the white letters instead of letting the letters show through.
    hair_zone = gaussian_filter((subject_lum < 0.30).astype(np.float32), 6)
    body_alpha = np.clip((alpha - 0.04) / 0.86, 0, 1)
    hair_alpha = np.clip((alpha - 0.03) / 0.55, 0, 1)
    alpha = body_alpha * (1 - hair_zone) + hair_alpha * hair_zone
    inner = (alpha >= 0.98) & (stray < 0.05)
    _, (rows, cols) = distance_transform_edt(~inner, return_indices=True)
    nearest = colour[rows, cols]
    weight = (alpha * (1 - stray))[..., None]
    foreground = np.where(inner[..., None], colour, colour * weight + nearest * (1 - weight))

    rgba = np.dstack([foreground, alpha[..., None]])
    full = Image.fromarray((rgba * 255 + 0.5).astype(np.uint8), 'RGBA')
    x0, y0, x1, y1 = full.getbbox()
    cutout = full.crop((x0, y0, x1, y1))
    width, height = cutout.size
    photo_w, photo_h = full.size

    build_scene(colour, alpha, out_dir)

    head = alpha[y0:y0 + round(height * 0.22)] > 0.5
    head_cx = np.nonzero(head.any(axis=0))[0].mean()
    print(f'photo {photo_w}x{photo_h}, cut-out {width}x{height} at ({x0}, {y0})')
    print(f'--feed-cut-left: {x0 / photo_w * 100:.3f}%;')
    print(f'--feed-cut-top: {y0 / photo_h * 100:.3f}%;')
    print(f'--feed-cut-width: {width / photo_w * 100:.3f}%;')
    print(f'--feed-face-x: {head_cx / photo_w:.4f};  /* face centre, fraction of photo width */')
    print(f'--feed-head-y: {y0 / photo_h:.4f};  /* head top, fraction of photo height */')

    # AVIF compresses alpha lossily and steps the outline, so the transparent
    # cut-out ships as WebP: lossy colour, lossless alpha.
    for target in (*WIDTHS, width):
        image = cutout if target == width else cutout.resize((target, round(height * target / width)), Image.LANCZOS)
        image.save(f'{out_dir}/gisela-cutout-{target}.webp', 'WEBP', quality=92, alpha_quality=100, method=6)
    cutout.resize((640, round(height * 640 / width)), Image.LANCZOS).save(
        f'{out_dir}/gisela-cutout-640.png', 'PNG', optimize=True,
    )


if __name__ == '__main__':
    main(*sys.argv[1:4])
