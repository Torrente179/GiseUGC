#!/usr/bin/env python3
"""
Strip inline GTM + gtag blocks from all HTML entries and replace them with a
single deferred loader reference (`/gtm-loader.js`). Idempotent: running it
again is a no-op on already-updated files.
"""
from __future__ import annotations

import pathlib
import re
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent

# Regions to strip. Order matters — keep conservative, exact.
PATTERNS: list[re.Pattern[str]] = [
    # <!-- Google tag (gtag.js) --> ... </script>\n<script> gtag config ... </script>
    re.compile(
        r"[ \t]*<!-- Google tag \(gtag\.js\) -->\s*\n"
        r"[ \t]*<script async src=\"https://www\.googletagmanager\.com/gtag/js\?id=G-3W6XVBLWXH\"></script>\s*\n"
        r"[ \t]*<script>\s*\n"
        r".*?gtag\('config', 'G-3W6XVBLWXH'\);\s*\n"
        r"[ \t]*</script>\s*\n?",
        re.DOTALL,
    ),
    # <!-- Google Tag Manager --> ... <!-- End Google Tag Manager -->
    re.compile(
        r"[ \t]*<!-- Google Tag Manager -->\s*\n"
        r".*?<!-- End Google Tag Manager -->\s*\n?",
        re.DOTALL,
    ),
]

LOADER_TAG = '    <script defer src="/gtm-loader.js"></script>\n'

# Rough pattern: the loader tag should sit directly after <head>.
HEAD_OPEN = re.compile(r"(<head>\s*\n)")

def rewrite(path: pathlib.Path) -> bool:
    text = path.read_text(encoding="utf-8")
    original = text

    for pattern in PATTERNS:
        text = pattern.sub("", text)

    # Insert loader tag after <head> if missing.
    if "/gtm-loader.js" not in text:
        match = HEAD_OPEN.search(text)
        if not match:
            return False
        text = text[: match.end()] + LOADER_TAG + text[match.end() :]

    if text == original:
        return False
    path.write_text(text, encoding="utf-8")
    return True


def main() -> int:
    skip_roots = {"node_modules", ".git", "dist", ".claude"}
    htmls: list[pathlib.Path] = []
    for p in ROOT.rglob("index.html"):
        parts = set(p.relative_to(ROOT).parts)
        if parts & skip_roots:
            continue
        htmls.append(p)

    changed = 0
    for p in htmls:
        if rewrite(p):
            changed += 1
            print(f"updated {p.relative_to(ROOT)}")
    print(f"\n{changed}/{len(htmls)} files updated")
    return 0


if __name__ == "__main__":
    sys.exit(main())
