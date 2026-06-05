#!/usr/bin/env python3
# /// script
# requires-python = ">=3.10"
# ///
"""lint-spine — the mechanical half of spine decision-integrity, done deterministically.

LLMs miscount IDs and miss literal placeholders; a grep does not. This linter owns the
checks a script does better than a prompt, and leaves the semantic half (is each Rule
actually enforceable? does the boundary make sense?) to the rubric walker.

It reads ARCHITECTURE-SPINE.md from a workspace and reports, as compact JSON on stdout:

  - placeholder    literal TBD / TODO / "similar to AD-n" / unfilled {template-token}
  - ad_id          duplicate or non-monotonic AD-n identifiers
  - ad_fields      an AD-n block missing Binds / Prevents / Rule
  - version_pin    a frontmatter key_deps entry with no @version

Fenced code blocks are skipped for placeholder/brace scanning so mermaid and source
trees don't trip false positives. Exit code is always 0 — findings travel in the JSON;
the caller (Reviewer Gate / rubric walker) decides what to do with them.
"""
from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path

SPINE = "ARCHITECTURE-SPINE.md"

AD_HEADING = re.compile(r"^#{2,4}\s*AD-(\d+)\b(.*)$", re.MULTILINE)
HEADING = re.compile(r"^#{1,6}\s", re.MULTILINE)
FENCE = re.compile(r"```.*?```", re.DOTALL)
PLACEHOLDER_WORD = re.compile(r"\b(TBD|TODO|FIXME|XXX)\b")
SIMILAR_TO = re.compile(r"similar to AD-\d+", re.IGNORECASE)
TEMPLATE_TOKEN = re.compile(r"\{[a-z_][a-z0-9_ /.-]*\}")


def split_frontmatter(text: str) -> tuple[str, str]:
    """Return (frontmatter, body). Frontmatter is the content between the first two
    `---` fences, or '' when absent."""
    if text.startswith("---"):
        end = text.find("\n---", 3)
        if end != -1:
            fm = text[3:end].lstrip("\n")
            body = text[end + 4:]
            return fm, body
    return "", text


def strip_fences(text: str) -> str:
    return FENCE.sub("", text)


def line_of(text: str, idx: int) -> int:
    return text.count("\n", 0, idx) + 1


def find_placeholders(body: str) -> list[dict]:
    findings: list[dict] = []
    scan = strip_fences(body)
    for rx, label in (
        (PLACEHOLDER_WORD, "placeholder marker"),
        (SIMILAR_TO, "unresolved cross-reference"),
        (TEMPLATE_TOKEN, "unfilled template token"),
    ):
        for m in rx.finditer(scan):
            findings.append({
                "category": "placeholder",
                "severity": "high",
                "detail": f"{label}: {m.group(0)!r}",
                "location": f"{SPINE} (approx line {line_of(scan, m.start())})",
            })
    return findings


def find_ad_issues(body: str) -> list[dict]:
    findings: list[dict] = []
    matches = list(AD_HEADING.finditer(body))
    seen: dict[int, int] = {}
    prev = 0
    for i, m in enumerate(matches):
        num = int(m.group(1))
        loc = f"{SPINE} AD-{num} (line {line_of(body, m.start())})"
        if num in seen:
            findings.append({
                "category": "ad_id",
                "severity": "high",
                "detail": f"AD-{num} id reused (also at line {seen[num]})",
                "location": loc,
            })
        else:
            seen[num] = line_of(body, m.start())
        if num <= prev:
            findings.append({
                "category": "ad_id",
                "severity": "high",
                "detail": f"AD-{num} is non-monotonic (follows AD-{prev}); ids must ascend and never renumber",
                "location": loc,
            })
        prev = max(prev, num)

        # block text = from this heading to the next heading of any level
        start = m.end()
        nxt = HEADING.search(body, start)
        block = body[start:nxt.start()] if nxt else body[start:]
        low = block.lower()
        missing = [f for f in ("binds", "prevents", "rule") if f not in low]
        if missing:
            findings.append({
                "category": "ad_fields",
                "severity": "high",
                "detail": f"AD-{num} missing required field(s): {', '.join(missing)}",
                "location": loc,
            })
    return findings


def find_unpinned_deps(frontmatter: str) -> list[dict]:
    findings: list[dict] = []
    lines = frontmatter.splitlines()
    in_key_deps = False
    key_indent = 0
    for raw in lines:
        stripped = raw.strip()
        if not stripped or stripped.startswith("#"):
            continue
        indent = len(raw) - len(raw.lstrip())
        m = re.match(r"key_deps:\s*(.*)$", stripped)
        if m:
            in_key_deps = True
            key_indent = indent
            inline = _strip_comment(m.group(1)).strip()
            if inline and inline not in ("[]", "[ ]"):
                # inline list form: key_deps: [a@1, b] — consumed here, no block follows
                for item in re.findall(r"[^\[\],]+", inline.strip("[]")):
                    _check_dep(item.strip().strip("'\""), findings)
                in_key_deps = False
            continue
        if in_key_deps:
            if indent <= key_indent and not stripped.startswith("-"):
                in_key_deps = False
                continue
            if stripped.startswith("-"):
                _check_dep(_strip_comment(stripped[1:]).strip().strip("'\""), findings)
    return findings


def _strip_comment(s: str) -> str:
    """Drop a trailing YAML ` # comment`, leaving an inline `name@1.2` intact."""
    return re.sub(r"(^|\s)#.*$", "", s)


def _check_dep(item: str, findings: list[dict]) -> None:
    if not item or item.startswith("#"):
        return
    if "@" not in item:
        findings.append({
            "category": "version_pin",
            "severity": "medium",
            "detail": f"key_deps entry {item!r} has no @version pin",
            "location": f"{SPINE} frontmatter stack.key_deps",
        })


def lint(text: str) -> dict:
    frontmatter, body = split_frontmatter(text)
    findings: list[dict] = []
    findings += find_placeholders(body)
    findings += find_ad_issues(body)
    findings += find_unpinned_deps(frontmatter)
    counts: dict[str, int] = {}
    for f in findings:
        counts[f["severity"]] = counts.get(f["severity"], 0) + 1
    return {
        "ok": len(findings) == 0,
        "spine": SPINE,
        "total_findings": len(findings),
        "by_severity": counts,
        "findings": findings,
    }


def main(argv: list[str] | None = None) -> int:
    ap = argparse.ArgumentParser(description="Lint an architecture spine for mechanical integrity.")
    ap.add_argument("--workspace", required=True, help="run folder containing ARCHITECTURE-SPINE.md")
    ap.add_argument("-o", "--output", help="write JSON here instead of stdout")
    args = ap.parse_args(argv)

    spine_path = Path(args.workspace) / SPINE
    if not spine_path.exists():
        result = {"ok": False, "error": f"{spine_path} not found", "findings": [], "total_findings": 0}
    else:
        result = lint(spine_path.read_text(encoding="utf-8"))

    out = json.dumps(result, indent=2)
    if args.output:
        Path(args.output).write_text(out + "\n", encoding="utf-8")
    else:
        print(out)
    return 0


if __name__ == "__main__":
    sys.exit(main())
