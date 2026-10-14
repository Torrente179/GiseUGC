"""Alpha matte of the person in the home hero photo, with BiRefNet.

Usage (Python 3.12; onnxruntime has no 3.14 wheels yet):
  python3.12 -m venv /tmp/hero-venv
  /tmp/hero-venv/bin/pip install onnxruntime numpy pillow huggingface_hub
  /tmp/hero-venv/bin/python scripts/hero-matte.py <photo.jpg> /tmp/hero-matte.png

Then build the hero layers with scripts/clean-hero-cutout.py.

BiRefNet-portrait (MIT, onnx-community/BiRefNet-portrait-ONNX, ~970 MB,
cached by huggingface_hub) replaced Apple Vision's subject mask, which left a
grey halo round her hair and smeared her arm edges. The model sees a 1024 px
square, so it runs twice: once on the whole photo to find her, then on a crop
around her, so its resolution goes on her outline instead of the scene.
"""

import sys

import numpy as np
import onnxruntime as ort
from huggingface_hub import hf_hub_download
from PIL import Image

MODEL_REPO = 'onnx-community/BiRefNet-portrait-ONNX'
MODEL_FILE = 'onnx/model.onnx'
SIDE = 1024
CROP_MARGIN = 0.18
MEAN = np.array([0.485, 0.456, 0.406], np.float32)
STD = np.array([0.229, 0.224, 0.225], np.float32)


def predict(session, image):
    width, height = image.size
    x = np.asarray(image.resize((SIDE, SIDE), Image.BILINEAR), np.float32) / 255
    x = ((x - MEAN) / STD).transpose(2, 0, 1)[None]
    logits = session.run(None, {session.get_inputs()[0].name: x})[0][0, 0]
    matte = Image.fromarray((255 / (1 + np.exp(-logits))).astype(np.uint8))
    return np.asarray(matte.resize((width, height), Image.LANCZOS), np.float32) / 255


def main(photo_path, out_path):
    session = ort.InferenceSession(hf_hub_download(MODEL_REPO, MODEL_FILE), providers=['CPUExecutionProvider'])
    photo = Image.open(photo_path).convert('RGB')
    width, height = photo.size

    rough = predict(session, photo)
    ys, xs = np.nonzero(rough > 0.5)
    margin = round((xs.max() - xs.min()) * CROP_MARGIN)
    x0, x1 = max(0, xs.min() - margin), min(width, xs.max() + margin)
    y0, y1 = max(0, ys.min() - margin), min(height, ys.max() + margin)

    matte = np.zeros((height, width), np.float32)
    matte[y0:y1, x0:x1] = predict(session, photo.crop((x0, y0, x1, y1)))
    Image.fromarray((matte * 255 + 0.5).astype(np.uint8)).save(out_path)
    print(f'matte {width}x{height}, refined on ({x0}, {y0})–({x1}, {y1})')


if __name__ == '__main__':
    main(*sys.argv[1:3])
