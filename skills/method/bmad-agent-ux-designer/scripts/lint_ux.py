#!/usr/bin/env python3
# /// script
# requires-python = ">=3.11"
# dependencies = ["pyyaml>=6.0.2,<7"]
# ///
"""lint_ux — domain-only structural and contrast checks for UX and brand contracts.

Pairs with core-tools `check_doc.py` (which owns placeholders, TOC, and `--forbid-prefix`).
Checks UX/brand files (`DESIGN.md`, `EXPERIENCE.md`, `BRAND.md`, and run router `.md`) for:

  - invalid_hex           color/component hex values failing #RGB/#RGBA/#RRGGBB/#RRGGBBAA
  - design_section_order  out-of-order canonical Google Labs DESIGN.md `##` headings
  - low_contrast          WCAG 2.1 contrast failures (<4.5) on paired fg/bg hex tokens
  - unresolved_token      `{colors|typography|rounded|spacing|components.*}` refs missing defs
  - broken_visual_links   `mockups/`, `wireframes/`, `imports/`, `logos/` refs to missing files
  - orphaned_artifacts    files in `mockups/`, `wireframes/`, `imports/`, `logos/` not linked

Auto-discovers sibling `DESIGN.md`, `EXPERIENCE.md`, and `BRAND.md` in the first file's folder
unless `--no-siblings` is set. Exits 0 on scan completion, or 2 on bad usage or missing files.
"""

from __future__ import annotations

import argparse
import importlib.util
import json
import re
import sys
from collections.abc import Iterable
from pathlib import Path

sys.dont_write_bytecode = True  # Keep cache files out of the installed scripts tree.

FENCE_OPEN = re.compile(r"^ {0,3}(`{3,}|~{3,})")
HEADING_H2 = re.compile(r"^##[ \t]+(.+?)[ \t#]*$", re.MULTILINE)
HEX_RE = re.compile(r"^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$")
TOKEN_REF = re.compile(r"\{(colors|typography|rounded|spacing|components)\.([A-Za-z0-9_.-]+)\}")
VISUAL_REF = re.compile(r"(?<![A-Za-z0-9_/-])((?:mockups|wireframes|imports|logos)/[^\s`'\"\)\]>]+)")
DESIGN_LINK = re.compile(r"(?<![A-Za-z0-9_.-])((?:\.\.?/)*[^\s`'\"\)\]>]*DESIGN\.md)(?![A-Za-z0-9_.-])")

CANONICAL_SECTIONS = (
    "brand and style",
    "colors",
    "typography",
    "layout and spacing",
    "elevation and depth",
    "shapes",
    "components",
    "dos and donts",
)
CANONICAL_LABELS = {
    "brand and style": "Brand & Style",
    "colors": "Colors",
    "typography": "Typography",
    "layout and spacing": "Layout & Spacing",
    "elevation and depth": "Elevation & Depth",
    "shapes": "Shapes",
    "components": "Components",
    "dos and donts": "Do's and Don'ts",
}
TOKEN_GROUPS = ("colors", "typography", "rounded", "spacing", "components")
VISUAL_DIRS = ("mockups", "wireframes", "imports", "logos")
SIBLING_CONTRACTS = ("DESIGN.md", "EXPERIENCE.md", "BRAND.md")
INK_SURFACE_PAIRS = (
    ("ink-primary", "surface-base"),
    ("ink-primary", "surface-raised"),
    ("ink-primary", "surface"),
    ("ink-primary", "background"),
    ("ink-secondary", "surface-base"),
    ("ink-secondary", "surface-raised"),
    ("ink-secondary", "surface"),
    ("ink-secondary", "background"),
    ("ink-muted", "surface-base"),
    ("ink-muted", "surface-raised"),
    ("ink-muted", "background"),
    ("text-secondary", "surface-base"),
    ("text-secondary", "surface-raised"),
    ("text-secondary", "surface"),
    ("text-secondary", "background"),
    ("text-muted", "surface-base"),
    ("text-muted", "surface-raised"),
    ("text-muted", "surface"),
    ("text-muted", "background"),
    ("muted-foreground", "surface-base"),
    ("muted-foreground", "surface-raised"),
    ("muted-foreground", "surface"),
    ("muted-foreground", "background"),
    ("on-surface-variant", "surface"),
    ("on-surface-variant", "background"),
    ("ink-primary-dark", "surface-base-dark"),
    ("ink-primary-dark", "surface-raised-dark"),
    ("ink-primary-dark", "surface-dark"),
    ("ink-primary-dark", "background-dark"),
    ("ink-secondary-dark", "surface-base-dark"),
    ("ink-secondary-dark", "surface-raised-dark"),
    ("ink-secondary-dark", "background-dark"),
    ("ink-muted-dark", "surface-base-dark"),
    ("ink-muted-dark", "surface-raised-dark"),
    ("ink-muted-dark", "background-dark"),
    ("muted-foreground-dark", "surface-dark"),
    ("muted-foreground-dark", "background-dark"),
)

frontmatter = None


def _load_frontmatter(start_paths: Iterable[Path] = (), project_root: Path | None = None):
    """Load shared `frontmatter.py` from `_bmad/scripts/`, an adjacent `bmad` skill, or repo checkout."""
    candidates: list[Path] = []
    if project_root is not None:
        candidates.append(project_root / "_bmad" / "scripts" / "frontmatter.py")
    for start in start_paths:
        cur = start if start.is_dir() else start.parent
        for root in (cur, *cur.parents):
            candidates.append(root / "_bmad" / "scripts" / "frontmatter.py")
    script_dir = Path(__file__).resolve()
    skills = script_dir.parents[2]
    candidates.extend(
        [
            skills / "scripts" / "frontmatter.py",
            skills / "bmad" / "scripts" / "frontmatter.py",
            skills.parent / "core-tools" / "bmad" / "scripts" / "frontmatter.py",
        ]
    )
    for root in (Path.cwd(), *Path.cwd().parents):
        candidates.append(root / "_bmad" / "scripts" / "frontmatter.py")
    for path in candidates:
        if path.is_file():
            spec = importlib.util.spec_from_file_location("bmad_frontmatter", path)
            module = importlib.util.module_from_spec(spec)
            spec.loader.exec_module(module)
            return module
    raise FileNotFoundError("frontmatter.py not found in _bmad/scripts/ or installed bmad skill")


def _require_frontmatter():
    global frontmatter
    if frontmatter is None:
        frontmatter = _load_frontmatter()
    return frontmatter


def split_frontmatter(text: str) -> tuple[str, str, int]:
    """Return (frontmatter_text, body_text, body_line_offset) with CRLF normalized."""
    fm = _require_frontmatter()
    norm = text.replace("\r\n", "\n")
    try:
        fm_text, body_text = fm.split(norm)
    except ValueError:
        return "", norm, 0
    return fm_text, body_text, norm[: len(norm) - len(body_text)].count("\n")


def _parse_meta(fm_text: str) -> dict:
    if not fm_text:
        return {}
    try:
        parsed = _require_frontmatter().load(fm_text)
    except ValueError:
        return {}
    return parsed if isinstance(parsed, dict) else {}


def blank_fences_and_comments(text: str) -> str:
    """Replace fenced code blocks and HTML comments with empty lines to preserve line numbers."""
    lines = text.replace("\r\n", "\n").split("\n")
    out: list[str] = []
    fence: tuple[str, int] | None = None
    in_comment = False
    for line in lines:
        if fence is not None:
            out.append("")
            m = FENCE_OPEN.match(line)
            if m and m.group(1)[0] == fence[0] and len(m.group(1)) >= fence[1] and not line[m.end() :].strip(" \t"):
                fence = None
            continue
        if not in_comment:
            m = FENCE_OPEN.match(line)
            if m and (m.group(1)[0] == "~" or "`" not in line[m.end() :]):
                fence = (m.group(1)[0], len(m.group(1)))
                out.append("")
                continue
        pos = 0
        n = len(line)
        buf: list[str] = []
        while pos < n:
            if in_comment:
                end = line.find("-->", pos)
                if end == -1:
                    break
                in_comment = False
                pos = end + 3
            elif line.startswith("<!--", pos):
                in_comment = True
                pos += 4
            else:
                nxt = line.find("<!--", pos)
                stop = nxt if nxt != -1 else n
                buf.append(line[pos:stop])
                pos = stop
        out.append("".join(buf))
    return "\n".join(out)


def _normalize_heading(raw: str) -> str:
    text = raw.strip().lower().replace("&", " and ")
    text = text.replace("\u2019", "").replace("'", "")
    return re.sub(r"\s+", " ", text)


def _line_of_key(fm_text: str, key: str) -> int:
    rx = re.compile(rf"^[ \t]*{re.escape(key)}\s*:", re.MULTILINE)
    m = rx.search(fm_text) if fm_text else None
    return 2 + fm_text[: m.start()].count("\n") if m else 1


def _hex_rgb(value: object) -> tuple[int, int, int] | None:
    if not isinstance(value, str):
        return None
    s = value.strip()
    if not HEX_RE.match(s):
        return None
    digits = s[1:]
    if len(digits) == 3:
        digits = "".join(ch * 2 for ch in digits)
    elif len(digits) != 6:
        return None
    return tuple(int(digits[i : i + 2], 16) for i in (0, 2, 4))


def _relative_luminance(rgb: tuple[int, int, int]) -> float:
    def channel(c: int) -> float:
        s = c / 255.0
        return s / 12.92 if s <= 0.03928 else ((s + 0.055) / 1.055) ** 2.4

    r, g, b = (channel(x) for x in rgb)
    return 0.2126 * r + 0.7152 * g + 0.0722 * b


def contrast_ratio(fg_hex: str, bg_hex: str) -> float | None:
    """Compute WCAG 2.1 contrast ratio between two opaque hex colors."""
    fg = _hex_rgb(fg_hex)
    bg = _hex_rgb(bg_hex)
    if fg is None or bg is None:
        return None
    l1 = _relative_luminance(fg)
    l2 = _relative_luminance(bg)
    hi, lo = max(l1, l2), min(l1, l2)
    return (hi + 0.05) / (lo + 0.05)


def _is_design_file(name: str, meta: dict) -> bool:
    if Path(name).name.upper() == "DESIGN.MD":
        return True
    return isinstance(meta.get("colors"), dict) or isinstance(meta.get("typography"), dict)


def _is_contract_file(name: str, meta: dict) -> bool:
    if Path(name).name.upper() in {s.upper() for s in SIBLING_CONTRACTS}:
        return True
    return _is_design_file(name, meta)


def _check_invalid_hex(name: str, obj: object, path: str, out: list[dict]) -> None:
    if isinstance(obj, dict):
        for k, v in obj.items():
            sub = f"{path}.{k}" if path else str(k)
            _check_invalid_hex(name, v, sub, out)
    elif isinstance(obj, list):
        for idx, item in enumerate(obj):
            _check_invalid_hex(name, item, f"{path}[{idx}]", out)
    elif isinstance(obj, str):
        s = obj.strip()
        if s.startswith("#") and not HEX_RE.match(s):
            out.append({"key": path, "value": s, "location": name})


def _paired_color_candidates(colors: dict) -> list[tuple[str, str]]:
    pairs: list[tuple[str, str]] = []
    seen: set[tuple[str, str]] = set()

    def add(fg_key: str, bg_key: str) -> None:
        if fg_key in colors and bg_key in colors and (fg_key, bg_key) not in seen:
            seen.add((fg_key, bg_key))
            pairs.append((fg_key, bg_key))

    for key in colors:
        if not isinstance(key, str):
            continue
        if key.endswith("-dark"):
            base = key[:-5]
            if f"{base}-foreground-dark" in colors:
                add(f"{base}-foreground-dark", key)
            if f"on-{base}-dark" in colors:
                add(f"on-{base}-dark", key)
        else:
            if f"{key}-foreground" in colors:
                add(f"{key}-foreground", key)
            if f"on-{key}" in colors:
                add(f"on-{key}", key)

    for fg_key, bg_key in INK_SURFACE_PAIRS:
        add(fg_key, bg_key)
    return pairs


def _check_contrast(name: str, fm_text: str, colors: dict) -> list[dict]:
    findings: list[dict] = []
    for fg_key, bg_key in _paired_color_candidates(colors):
        fg_val, bg_val = colors.get(fg_key), colors.get(bg_key)
        ratio = contrast_ratio(fg_val, bg_val)
        if ratio is None or ratio >= 4.5:
            continue
        findings.append(
            {
                "pair": f"{fg_key} / {bg_key}",
                "fg": str(fg_val).strip(),
                "bg": str(bg_val).strip(),
                "ratio": round(ratio, 2),
                "severity": "error" if ratio < 3.0 else "warning",
                "location": f"{name}:{_line_of_key(fm_text, fg_key)}",
            }
        )
    return findings


def _check_design_section_order(name: str, clean_body: str, offset: int) -> list[dict]:
    findings: list[dict] = []
    max_idx = -1
    max_heading = ""
    for m in HEADING_H2.finditer(clean_body):
        norm = _normalize_heading(m.group(1))
        if norm not in CANONICAL_SECTIONS:
            continue
        idx = CANONICAL_SECTIONS.index(norm)
        if idx < max_idx:
            line = offset + clean_body[: m.start()].count("\n") + 1
            findings.append(
                {
                    "heading": m.group(1).strip(),
                    "after": max_heading,
                    "expected": CANONICAL_LABELS[norm],
                    "location": f"{name}:{line}",
                }
            )
        else:
            max_idx = idx
            max_heading = m.group(1).strip()
    return findings


def _deep_merge_tokens(target: dict[str, dict], source_meta: dict) -> None:
    for group in TOKEN_GROUPS:
        val = source_meta.get(group)
        if isinstance(val, dict) and val:
            bucket = target.setdefault(group, {})
            for k, v in val.items():
                if k not in bucket:
                    bucket[k] = v


def _resolve_token_path(tokens: dict[str, dict], group: str, rest: str) -> bool:
    group_map = tokens.get(group)
    if not isinstance(group_map, dict) or not group_map:
        return True  # Group not locally defined (e.g. inherited from external UI system).
    cur: object = group_map
    for part in rest.split("."):
        if not isinstance(cur, dict) or part not in cur:
            return False
        cur = cur[part]
    return True


def _collect_parent_design_tokens(files: list[tuple[str, str]], metas: list[dict], tokens: dict[str, dict]) -> None:
    visited: set[Path] = set()
    for (name, text), meta in zip(files, metas, strict=True):
        base = Path(name).parent
        candidates: list[str] = []
        sources = meta.get("sources")
        if isinstance(sources, list):
            candidates.extend(s for s in sources if isinstance(s, str) and s.endswith("DESIGN.md"))
        candidates.extend(m.group(1) for m in DESIGN_LINK.finditer(blank_fences_and_comments(text)))
        for rel in candidates:
            target = (base / rel).resolve()
            if target in visited or not target.is_file():
                continue
            visited.add(target)
            try:
                p_text = target.read_text(encoding="utf-8")
            except OSError:
                continue
            p_fm, _, _ = split_frontmatter(p_text)
            _deep_merge_tokens(tokens, _parse_meta(p_fm))


def _scan_component_tokens(name: str, fm_text: str, obj: object, tokens: dict[str, dict], out: list[dict]) -> None:
    if isinstance(obj, dict):
        for v in obj.values():
            _scan_component_tokens(name, fm_text, v, tokens, out)
    elif isinstance(obj, list):
        for item in obj:
            _scan_component_tokens(name, fm_text, item, tokens, out)
    elif isinstance(obj, str):
        for m in TOKEN_REF.finditer(obj):
            if not _resolve_token_path(tokens, m.group(1), m.group(2)):
                out.append({"token": m.group(0), "location": name})


def scan(files: list[tuple[str, str]], run_dir: Path | None = None) -> dict:
    """Scan UX/brand markdown files for hex, section order, contrast, token, and visual link issues."""
    invalid_hex: list[dict] = []
    design_section_order: list[dict] = []
    low_contrast: list[dict] = []
    unresolved_token: list[dict] = []
    broken_visual_links: list[dict] = []
    orphaned_artifacts: list[str] = []

    parsed: list[tuple[str, str, str, int, dict, str]] = []
    tokens: dict[str, dict] = {}
    has_design = False

    for name, text in files:
        fm_text, body_text, offset = split_frontmatter(text)
        meta = _parse_meta(fm_text)
        clean_body = blank_fences_and_comments(body_text)
        parsed.append((name, fm_text, clean_body, offset, meta, text))
        if _is_design_file(name, meta):
            has_design = True
            _deep_merge_tokens(tokens, meta)

    _collect_parent_design_tokens(files, [row[4] for row in parsed], tokens)
    if tokens:
        has_design = True

    referenced_visuals: set[str] = set()
    base_dir = run_dir.resolve() if run_dir is not None else (Path(files[0][0]).resolve().parent if files else None)

    for name, fm_text, clean_body, offset, meta, _raw_text in parsed:
        if _is_design_file(name, meta):
            if isinstance(meta.get("colors"), dict):
                _check_invalid_hex(name, meta["colors"], "colors", invalid_hex)
                low_contrast.extend(_check_contrast(name, fm_text, meta["colors"]))
            if isinstance(meta.get("components"), dict):
                _check_invalid_hex(name, meta["components"], "components", invalid_hex)
            design_section_order.extend(_check_design_section_order(name, clean_body, offset))

        if has_design and _is_contract_file(name, meta) and tokens:
            if isinstance(meta.get("components"), dict):
                _scan_component_tokens(name, fm_text, meta["components"], tokens, unresolved_token)
            for idx, line in enumerate(clean_body.split("\n"), 1 + offset):
                for m in TOKEN_REF.finditer(line):
                    if not _resolve_token_path(tokens, m.group(1), m.group(2)):
                        unresolved_token.append({"token": m.group(0), "location": f"{name}:{idx}"})

        if base_dir is not None:
            for idx, line in enumerate(clean_body.split("\n"), 1 + offset):
                for m in VISUAL_REF.finditer(line):
                    ref = m.group(1).rstrip(".,;:")
                    ref_path = ref.split("#", 1)[0].split("?", 1)[0]
                    target = (base_dir / ref_path).resolve()
                    try:
                        target.relative_to(base_dir)
                    except ValueError:
                        broken_visual_links.append({"path": ref_path, "location": f"{name}:{idx}"})
                        continue
                    referenced_visuals.add(ref_path)
                    if not target.is_file():
                        broken_visual_links.append({"path": ref_path, "location": f"{name}:{idx}"})

    if base_dir is not None and base_dir.is_dir():
        for subdir in VISUAL_DIRS:
            folder = base_dir / subdir
            if not folder.is_dir():
                continue
            for item in sorted(folder.rglob("*")):
                if not item.is_file() or any(part.startswith(".") for part in item.relative_to(base_dir).parts):
                    continue
                rel_posix = item.relative_to(base_dir).as_posix()
                if rel_posix not in referenced_visuals:
                    orphaned_artifacts.append(rel_posix)

    return {
        "invalid_hex": invalid_hex,
        "design_section_order": design_section_order,
        "low_contrast": low_contrast,
        "unresolved_token": unresolved_token,
        "broken_visual_links": broken_visual_links,
        "orphaned_artifacts": orphaned_artifacts,
    }


def _collect_input_paths(cli_files: list[str], include_siblings: bool) -> list[Path]:
    paths: list[Path] = []
    seen: set[Path] = set()
    for raw in cli_files:
        p = Path(raw)
        if not p.is_file():
            raise FileNotFoundError(raw)
        resolved = p.resolve()
        if resolved not in seen:
            seen.add(resolved)
            paths.append(p)
    if include_siblings and paths:
        first_dir = paths[0].resolve().parent
        for name in SIBLING_CONTRACTS:
            candidate = first_dir / name
            if candidate.is_file() and candidate.resolve() not in seen:
                seen.add(candidate.resolve())
                paths.append(candidate)
    return paths


def main(argv: list[str] | None = None) -> int:
    global frontmatter

    parser = argparse.ArgumentParser(
        description="Validate UX and brand contracts (`DESIGN.md`, `EXPERIENCE.md`, `BRAND.md`) and visual links."
    )
    parser.add_argument("files", nargs="+", metavar="FILE", help="run document or UX contract markdown files")
    parser.add_argument("--project-root", type=Path, help="project folder holding `_bmad/scripts/frontmatter.py`")
    parser.add_argument(
        "--no-siblings",
        action="store_true",
        help="scan only explicitly named files instead of auto-including sibling DESIGN.md/EXPERIENCE.md/BRAND.md",
    )
    args = parser.parse_args(argv)
    try:
        paths = _collect_input_paths(args.files, include_siblings=not args.no_siblings)
    except FileNotFoundError as exc:
        print(f"not found: {exc}", file=sys.stderr)
        return 2
    try:
        frontmatter = _load_frontmatter([p.resolve() for p in paths], project_root=args.project_root)
    except FileNotFoundError as exc:
        print(f"error: {exc}", file=sys.stderr)
        return 2

    files: list[tuple[str, str]] = []
    for p in paths:
        try:
            text = p.read_text(encoding="utf-8")
        except (OSError, UnicodeDecodeError) as exc:
            print(f"unreadable: {p}: {exc}", file=sys.stderr)
            return 2
        files.append((str(p), text))

    run_dir = paths[0].resolve().parent
    print(json.dumps(scan(files, run_dir=run_dir), indent=2))
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
