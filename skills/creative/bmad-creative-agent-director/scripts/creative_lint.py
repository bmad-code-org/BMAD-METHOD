#!/usr/bin/env python3
# /// script
# requires-python = ">=3.11"
# dependencies = ["pyyaml>=6.0.2,<7"]
# ///
"""creative-lint — deterministic anti-slop lint, pacing metrics, and invented-ratio checks.

Subcommands:
  lint <target> --blacklist <path> [--surface spoken|written] [--project-root DIR]
    Parse fenced ```regex blocks in <blacklist>, honoring `# scope: all`, `# scope: spoken`
    (alias `# scope: scripts`), and `# scope: written`. Scans <target> outside YAML frontmatter,
    fenced code blocks, and HTML comments, preserving 1-based file line numbers. Emits JSON on
    stdout. Exits 0 when clean on blocking patterns, 1 on blocking hits, 2 on usage/file/regex error.

  metrics <target> [--wpm 150] [--check-invented] [--max-invented-pct 25.0] [--section NAME ...] [--project-root DIR]
    Compute word count, estimated spoken runtime (MM:SS) at --wpm, sentence length distribution,
    burstiness runs (>4 consecutive sentences over 20 words), short punch line count (<=6 words),
    and `[INVENTED]` sentence ratio. Optional repeatable `--section` restricts metrics to named
    `##` sections (e.g. `Spoken draft`, `Hook written last`). With --check-invented, exits 1 when
    invented_pct exceeds --max-invented-pct.
"""

from __future__ import annotations

import argparse
import importlib.util
import json
import re
import sys
from pathlib import Path
from types import ModuleType

sys.dont_write_bytecode = True

REGEX_BLOCK_RE = re.compile(r"^ {0,3}```regex[ \t]*\n(.*?)^ {0,3}```[ \t]*$", re.MULTILINE | re.DOTALL)
SCOPE_LINE_RE = re.compile(r"^#\s*scope\s*:\s*(\S+)", re.IGNORECASE)
MASK_BLOCK_RE = re.compile(
    r"<!--.*?-->"
    r"|^ {0,3}(?P<bt>`{3,})[^`\n]*\n.*?(?:^ {0,3}(?P=bt)`*[ \t]*(?=\n|\Z)|\Z)"
    r"|^ {0,3}(?P<tl>~{3,})[^\n]*\n.*?(?:^ {0,3}(?P=tl)~*[ \t]*(?=\n|\Z)|\Z)",
    re.MULTILINE | re.DOTALL,
)
INVENTED_RE = re.compile(r"\[INVENTED\]", re.IGNORECASE)
LEADING_INVENTED_RE = re.compile(r"^(?:\s*\[INVENTED\])+", re.IGNORECASE)
WORD_RE = re.compile(r"[^\W_]+(?:['’\-][^\W_]+)*")
SENTENCE_SPLIT_RE = re.compile(r"([.!?][\"')\]”’]*)\s+")
VALID_SCOPES = {"all": "all", "spoken": "spoken", "scripts": "spoken", "written": "written"}
_FRONTMATTER_CACHE: dict[Path, ModuleType] = {}


def die(message: str) -> None:
    """Write usage or configuration error to stderr and exit 2."""
    print(f"error: {message}", file=sys.stderr)
    raise SystemExit(2)


def _blank_preserving_newlines(match: re.Match[str]) -> str:
    return re.sub(r"[^\n]", "", match.group(0))


def _find_frontmatter_path(target_path: Path | None = None, project_root: Path | None = None) -> Path | None:
    rel_candidates = (
        Path("_bmad") / "scripts" / "frontmatter.py",
        Path("skills") / "core-tools" / "bmad" / "scripts" / "frontmatter.py",
    )
    roots: list[Path] = []
    if project_root is not None:
        resolved_root = project_root.resolve()
        for rel in rel_candidates:
            candidate = resolved_root / rel
            if candidate.is_file():
                return candidate
        roots.append(resolved_root)
    if target_path is not None:
        roots.append(target_path.resolve().parent)
    roots.extend((Path.cwd(), Path(__file__).resolve().parent))

    seen_dirs: set[Path] = set()
    for start in roots:
        for directory in (start, *start.parents):
            if directory in seen_dirs:
                continue
            seen_dirs.add(directory)
            for rel in rel_candidates:
                candidate = directory / rel
                if candidate.is_file():
                    return candidate
    return None


def _load_frontmatter_module(target_path: Path | None = None, project_root: Path | None = None) -> ModuleType:
    path = _find_frontmatter_path(target_path, project_root)
    if path is None:
        die("frontmatter.py not found; run bmad setup or pass --project-root")
    if path in _FRONTMATTER_CACHE:
        return _FRONTMATTER_CACHE[path]
    spec = importlib.util.spec_from_file_location("bmad_frontmatter", path)
    if spec is None or spec.loader is None:
        die(f"could not load frontmatter helper: {path}")
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    _FRONTMATTER_CACHE[path] = module
    return module


def split_frontmatter(
    text: str,
    target_path: Path | None = None,
    project_root: Path | None = None,
) -> tuple[str, int]:
    """Return `(body_text, body_start_line_1based)` with leading YAML frontmatter stripped."""
    normalized = text.replace("\r\n", "\n")
    fm = _load_frontmatter_module(target_path, project_root)
    try:
        _, body = fm.split(normalized)
    except ValueError:
        return normalized, 1
    start_line = normalized[: len(normalized) - len(body)].count("\n") + 1
    return body, start_line


def load_patterns(blacklist_path: Path) -> list[tuple[str, re.Pattern[str]]]:
    """Parse fenced regex blocks from a blacklist file into `(scope, compiled_pattern)` pairs."""
    if not blacklist_path.is_file():
        die(f"blacklist not found: {blacklist_path}")
    text = blacklist_path.read_text(encoding="utf-8-sig").replace("\r\n", "\n")
    blocks = REGEX_BLOCK_RE.findall(text)
    if not blocks:
        die(f"no ```regex blocks found in {blacklist_path}")

    compiled: list[tuple[str, re.Pattern[str]]] = []
    for block in blocks:
        scope = "all"
        for raw_line in block.splitlines():
            line = raw_line.strip()
            if not line:
                continue
            if line.startswith("#"):
                scope_match = SCOPE_LINE_RE.match(line)
                if scope_match:
                    raw_scope = scope_match.group(1).lower()
                    if raw_scope not in VALID_SCOPES:
                        die(f"unknown blacklist scope {raw_scope!r} in {blacklist_path}")
                    scope = VALID_SCOPES[raw_scope]
                continue
            try:
                compiled.append((scope, re.compile(line, re.IGNORECASE)))
            except re.error as exc:
                die(f"invalid regex {line!r} in {blacklist_path}: {exc}")

    if not compiled:
        die(f"no active patterns in ```regex blocks of {blacklist_path}")
    return compiled


def prepare_scannable_body(
    text: str,
    target_path: Path | None = None,
    project_root: Path | None = None,
) -> tuple[list[str], list[str], int]:
    """Return `(masked_lines, raw_body_lines, start_line)` preserving 1-based line alignment."""
    body, start_line = split_frontmatter(text, target_path, project_root)
    raw_lines = body.split("\n")
    masked = MASK_BLOCK_RE.sub(_blank_preserving_newlines, body)
    return masked.split("\n"), raw_lines, start_line


def is_blocking(scope: str, surface: str) -> bool:
    if scope == "all":
        return True
    return scope == surface


def lint_file(
    target_path: Path,
    blacklist_path: Path,
    surface: str,
    project_root: Path | None = None,
) -> dict[str, object]:
    if not target_path.is_file():
        die(f"target file not found: {target_path}")
    patterns = load_patterns(blacklist_path)
    raw_text = target_path.read_text(encoding="utf-8-sig")
    masked_lines, raw_lines, start_line = prepare_scannable_body(raw_text, target_path, project_root)

    blocking: list[dict[str, object]] = []
    advisory: list[dict[str, object]] = []
    for offset, line in enumerate(masked_lines):
        lineno = start_line + offset
        excerpt = raw_lines[offset].strip() if offset < len(raw_lines) else line.strip()
        for scope, pattern in patterns:
            for match in pattern.finditer(line):
                hit = {
                    "line": lineno,
                    "pattern": pattern.pattern,
                    "match": match.group(0),
                    "scope": scope,
                    "excerpt": excerpt[:160],
                }
                if is_blocking(scope, surface):
                    blocking.append(hit)
                else:
                    advisory.append(hit)

    return {
        "target": str(target_path),
        "blacklist": str(blacklist_path),
        "surface": surface,
        "patterns_checked": len(patterns),
        "blocking_count": len(blocking),
        "advisory_count": len(advisory),
        "blocking": blocking,
        "advisory": advisory,
        "ok": len(blocking) == 0,
    }


def filter_sections(body: str, sections: list[str]) -> str:
    """Return lines belonging to matching `## <Heading>` sections (case-insensitive)."""
    wanted = {s.strip().casefold() for s in sections if s.strip()}
    masked = MASK_BLOCK_RE.sub(_blank_preserving_newlines, body)
    kept: list[str] = []
    in_section = False
    matched_any = False
    for line in masked.split("\n"):
        match = re.match(r"^(#{1,2})\s+(.+?)\s*#*$", line.strip())
        if match:
            level, title = match.group(1), match.group(2).strip().casefold()
            if level == "##" and title in wanted:
                in_section = True
                matched_any = True
                kept.append(line)
            else:
                in_section = False
            continue
        if in_section:
            kept.append(line)
    if not matched_any:
        die(f"no matching ## sections found: {', '.join(sections)}")
    return "\n".join(kept)


def extract_prose_paragraphs(
    text: str,
    target_path: Path | None = None,
    project_root: Path | None = None,
    sections: list[str] | None = None,
) -> list[str]:
    """Extract clean prose paragraphs, dropping code blocks, comments, headings, and rules."""
    body, _ = split_frontmatter(text, target_path, project_root)
    if sections:
        body = filter_sections(body, sections)
    cleaned = MASK_BLOCK_RE.sub("", body)

    paragraphs: list[str] = []
    current: list[str] = []
    for raw_line in cleaned.split("\n"):
        stripped = raw_line.strip()
        if not stripped:
            if current:
                paragraphs.append(" ".join(current))
                current = []
            continue
        if re.match(r"^#{1,6}\s+", stripped):
            if current:
                paragraphs.append(" ".join(current))
                current = []
            continue
        if re.match(r"^([-*_])(?:\s*\1){2,}$", stripped):
            if current:
                paragraphs.append(" ".join(current))
                current = []
            continue
        stripped = re.sub(r"^(?:>\s*)+", "", stripped)
        stripped = re.sub(r"^(?:[-*+]|\d+[.)])\s+", "", stripped)
        stripped = re.sub(r"!\[([^\]]*)\]\([^)]+\)", r"\1", stripped)
        stripped = re.sub(r"\[([^\]]+)\]\([^)]+\)", r"\1", stripped)
        stripped = stripped.replace("`", "")
        stripped = re.sub(r"\*{1,3}|_{1,3}", "", stripped)
        stripped = stripped.strip()
        if stripped:
            current.append(stripped)
    if current:
        paragraphs.append(" ".join(current))
    return paragraphs


def split_sentences(paragraphs: list[str]) -> list[tuple[str, bool]]:
    """Return `(sentence_without_tags, is_invented)` pairs across all prose paragraphs."""
    sentences: list[tuple[str, bool]] = []
    for para in paragraphs:
        para_start_idx = len(sentences)
        raw_parts = SENTENCE_SPLIT_RE.sub(r"\1\n", para.strip()).split("\n")
        for part in raw_parts:
            piece = part.strip()
            if not piece:
                continue
            leading_match = LEADING_INVENTED_RE.match(piece)
            rest = piece[leading_match.end() :] if leading_match else piece
            has_inner = bool(INVENTED_RE.search(rest))
            text_only = INVENTED_RE.sub(" ", rest)
            text_only = " ".join(text_only.split()).strip()
            if not text_only:
                if (leading_match or has_inner) and len(sentences) > para_start_idx:
                    sentences[-1] = (sentences[-1][0], True)
                continue
            if not WORD_RE.search(text_only):
                continue
            flagged = has_inner
            if leading_match:
                if len(sentences) > para_start_idx and not sentences[-1][1]:
                    sentences[-1] = (sentences[-1][0], True)
                else:
                    flagged = True
            sentences.append((text_only, flagged))
    return sentences


def compute_metrics(
    target_path: Path,
    wpm: int,
    check_invented: bool,
    max_invented_pct: float,
    sections: list[str] | None = None,
    project_root: Path | None = None,
) -> dict[str, object]:
    if not target_path.is_file():
        die(f"target file not found: {target_path}")
    if wpm <= 0:
        die("--wpm must be a positive integer")
    if not (0.0 <= max_invented_pct <= 100.0):
        die("--max-invented-pct must be between 0 and 100")

    raw_text = target_path.read_text(encoding="utf-8-sig")
    paragraphs = extract_prose_paragraphs(raw_text, target_path, project_root, sections)
    sentence_pairs = split_sentences(paragraphs)

    lengths = [len(WORD_RE.findall(sentence)) for sentence, _ in sentence_pairs]
    word_count = sum(lengths)
    sentence_count = len(lengths)
    avg_words = round(word_count / sentence_count, 1) if sentence_count else 0.0
    max_words = max(lengths) if lengths else 0
    short_punch_count = sum(1 for length in lengths if 1 <= length <= 6)

    runtime_seconds = round(word_count / wpm * 60) if word_count else 0
    minutes, seconds = divmod(runtime_seconds, 60)
    runtime_mmss = f"{minutes:02d}:{seconds:02d}"

    burstiness_runs: list[dict[str, int]] = []
    run_start: int | None = None
    for idx, length in enumerate(lengths, start=1):
        if length > 20:
            if run_start is None:
                run_start = idx
        elif run_start is not None:
            if idx - run_start > 4:
                burstiness_runs.append(
                    {"start_sentence": run_start, "end_sentence": idx - 1, "length": idx - run_start}
                )
            run_start = None
    if run_start is not None and (sentence_count + 1) - run_start > 4:
        burstiness_runs.append(
            {
                "start_sentence": run_start,
                "end_sentence": sentence_count,
                "length": (sentence_count + 1) - run_start,
            }
        )

    invented_sentences = sum(1 for _, flagged in sentence_pairs if flagged)
    raw_invented_pct = (invented_sentences / sentence_count) * 100.0 if sentence_count else 0.0
    invented_pct = round(raw_invented_pct, 1)

    warnings: list[str] = []
    for run in burstiness_runs:
        warnings.append(
            f"burstiness: sentences {run['start_sentence']}-{run['end_sentence']} "
            f"({run['length']} consecutive sentences) exceed 20 words without a short break"
        )
    if sentence_count >= 10 and short_punch_count == 0:
        warnings.append("pacing: no short punch sentences (1-6 words) in a 10+ sentence draft")

    exceeded_invented = check_invented and raw_invented_pct > max_invented_pct
    if exceeded_invented:
        warnings.append(
            f"quote-or-cut: {invented_pct}% [INVENTED] sentences exceeds {max_invented_pct}% limit; "
            "return to braindump before weaving"
        )

    return {
        "target": str(target_path),
        "word_count": word_count,
        "sentence_count": sentence_count,
        "wpm": wpm,
        "runtime_seconds": runtime_seconds,
        "runtime_mmss": runtime_mmss,
        "avg_sentence_words": avg_words,
        "max_sentence_words": max_words,
        "short_punch_count": short_punch_count,
        "burstiness_runs": burstiness_runs,
        "invented_sentences": invented_sentences,
        "invented_pct": invented_pct,
        "max_invented_pct": max_invented_pct if check_invented else None,
        "warnings": warnings,
        "ok": not exceeded_invented,
    }


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description="Lint creative drafts and compute pacing/quote-or-cut metrics.")
    subparsers = parser.add_subparsers(dest="command", required=True)

    lint_parser = subparsers.add_parser("lint", help="Check a draft against fenced ```regex blocks in blacklist.md.")
    lint_parser.add_argument("target", type=Path, help="Draft or outline file to lint")
    lint_parser.add_argument("--blacklist", type=Path, required=True, help="Path to blacklist.md")
    lint_parser.add_argument(
        "--surface",
        choices=("spoken", "written"),
        default="spoken",
        help="Spoken drafts enforce all+spoken rules; written copy enforces all+written and treats spoken as advisory",
    )
    lint_parser.add_argument("--project-root", type=Path, default=None, help="Optional project root holding _bmad/")

    metrics_parser = subparsers.add_parser(
        "metrics", help="Compute word count, runtime at WPM, sentence burstiness, and [INVENTED] ratio."
    )
    metrics_parser.add_argument("target", type=Path, help="Draft file to measure")
    metrics_parser.add_argument(
        "--wpm", type=int, default=150, help="Words per minute for runtime estimate (default 150)"
    )
    metrics_parser.add_argument(
        "--check-invented",
        action="store_true",
        help="Exit 1 when [INVENTED] sentence percentage exceeds --max-invented-pct",
    )
    metrics_parser.add_argument(
        "--max-invented-pct",
        type=float,
        default=25.0,
        help="Maximum allowed [INVENTED] percentage when --check-invented is set (default 25.0)",
    )
    metrics_parser.add_argument(
        "--section",
        action="append",
        default=None,
        help="Restrict metrics to named ## sections (repeatable, case-insensitive)",
    )
    metrics_parser.add_argument("--project-root", type=Path, default=None, help="Optional project root holding _bmad/")
    return parser


def main(argv: list[str] | None = None) -> int:
    parser = build_parser()
    args = parser.parse_args(argv)
    if args.command == "lint":
        result = lint_file(args.target, args.blacklist, args.surface, args.project_root)
    else:
        result = compute_metrics(
            args.target,
            args.wpm,
            args.check_invented,
            args.max_invented_pct,
            args.section,
            args.project_root,
        )

    print(json.dumps(result, indent=2, ensure_ascii=False))
    return 0 if result["ok"] else 1


if __name__ == "__main__":
    if sys.platform == "win32":
        sys.stdout.reconfigure(encoding="utf-8", errors=getattr(sys.stdout, "errors", None) or "strict")
        sys.stderr.reconfigure(encoding="utf-8", errors=getattr(sys.stderr, "errors", None) or "strict")
    sys.exit(main())
