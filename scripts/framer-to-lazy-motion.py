#!/usr/bin/env python3
"""
Migrate `motion` identifiers from `framer-motion` to the lighter `m` component.
Paired with `<LazyMotion features={domAnimation}>` wrap in App.tsx, this lets
the bundler tree-shake the full Framer Motion runtime out of the app.

Transforms per file only when the file already imports `motion` from
'framer-motion'. Rewrites:
  - the named import `motion` to `m`
  - JSX usages `motion.div`, `motion.ul`, etc. to `m.div`, `m.ul`
  - function-call wrapper `motion(` to `m(`
  - forwardRef generic arg `motion(forwardRef...` stays untouched because
    the identifier remains `m` and keeps the same API surface.
"""
from __future__ import annotations

import pathlib
import re
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
SRC = ROOT / "src"

# Files to skip even if they match.
SKIP_SUBSTRINGS = (".claude/worktrees",)

IMPORT_RE = re.compile(
    r"^(import\s*\{)([^}]*)(\}\s*from\s*['\"]framer-motion['\"];?)",
    re.MULTILINE,
)


def rewrite_imports(source: str) -> tuple[str, bool]:
    changed = False

    def replace(match: re.Match[str]) -> str:
        nonlocal changed
        prefix, body, suffix = match.group(1), match.group(2), match.group(3)
        parts = [p.strip() for p in body.split(",")]
        updated_parts: list[str] = []
        seen_m = False
        touched = False
        for part in parts:
            if not part:
                continue
            if re.fullmatch(r"motion", part):
                if not seen_m:
                    updated_parts.append("m")
                    seen_m = True
                touched = True
                continue
            if re.fullmatch(r"motion\s+as\s+\w+", part):
                # Respect custom aliases — leave them alone.
                updated_parts.append(part)
                continue
            updated_parts.append(part)
        if not touched:
            return match.group(0)
        changed = True
        new_body = ", ".join(updated_parts)
        return f"{prefix} {new_body} {suffix}"

    new_source = IMPORT_RE.sub(replace, source)
    return new_source, changed


USAGE_RE = re.compile(r"\bmotion\.([A-Za-z][A-Za-z0-9]*)")
CALL_RE = re.compile(r"\bmotion\(")


def rewrite_usages(source: str) -> tuple[str, bool]:
    before = source
    source = USAGE_RE.sub(lambda match: f"m.{match.group(1)}", source)
    source = CALL_RE.sub("m(", source)
    return source, source != before


def process_file(path: pathlib.Path) -> bool:
    text = path.read_text(encoding="utf-8")
    new_text, import_changed = rewrite_imports(text)
    if not import_changed:
        return False
    new_text, _ = rewrite_usages(new_text)
    if new_text == text:
        return False
    path.write_text(new_text, encoding="utf-8")
    return True


def main() -> int:
    targets: list[pathlib.Path] = []
    for pattern in ("**/*.tsx", "**/*.ts"):
        for path in SRC.rglob(pattern):
            rel = str(path.relative_to(ROOT))
            if any(skip in rel for skip in SKIP_SUBSTRINGS):
                continue
            targets.append(path)

    changed = 0
    for path in targets:
        if process_file(path):
            changed += 1
            print(f"updated {path.relative_to(ROOT)}")
    print(f"\n{changed}/{len(targets)} files updated")
    return 0


if __name__ == "__main__":
    sys.exit(main())
