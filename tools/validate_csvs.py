#!/usr/bin/env python3
# /// script
# requires-python = ">=3.11"
# ///
"""Validate all CSV data files under skills/.

Checks structural integrity and catalog invariants deterministically:
  - Strict UTF-8 decoding and strict RFC-4180 CSV parsing (`strict=True`).
  - Non-empty, trimmed, unique column headers.
  - Exact header column count on every data row and zero blank rows.
  - Non-empty, unique entry names when a key column (`name`, `technique_name`, `method_name`) exists.
  - Method catalogs (`doc-templates/methods-*.csv`) have `category`, `name`, and `key_questions`
    columns, non-empty values in each, and no empty `|` segments in `key_questions`.

Usage:
  uv run tools/validate_csvs.py            # Warn only (exit 0)
  uv run tools/validate_csvs.py --strict   # Exit 1 on findings
"""

from __future__ import annotations

import argparse
import csv
import io
import sys
from pathlib import Path

sys.dont_write_bytecode = True

REPO_ROOT = Path(__file__).resolve().parents[1]
KEY_COLUMNS = ("name", "technique_name", "method_name")
METHOD_CATALOG_REQUIRED = ("category", "name", "key_questions")


def validate_csv_file(path: Path, rel_path: str) -> list[str]:
    """Validate one CSV file and return human-readable error strings."""
    try:
        raw = path.read_text(encoding="utf-8")
    except UnicodeDecodeError as exc:
        return [f"{rel_path}: invalid UTF-8 ({exc})"]
    except OSError as exc:
        return [f"{rel_path}: could not read ({exc})"]

    try:
        rows = list(csv.reader(io.StringIO(raw, newline=""), strict=True))
    except csv.Error as exc:
        return [f"{rel_path}: CSV parse error ({exc})"]

    if not rows:
        return [f"{rel_path}: empty CSV file"]

    header = rows[0]
    findings: list[str] = []
    if not header or any(not col or col != col.strip() for col in header):
        findings.append(f"{rel_path}:1: empty or padded column name in header {header!r}")
    if len(set(header)) != len(header):
        findings.append(f"{rel_path}:1: duplicate column names in header {header!r}")
    if len(rows) < 2:
        findings.append(f"{rel_path}: no data rows")
        return findings

    col_count = len(header)
    is_method_catalog = path.parent.name == "doc-templates" and path.name.startswith("methods-")
    required_idx: dict[str, int] = {}
    if is_method_catalog:
        missing = [col for col in METHOD_CATALOG_REQUIRED if col not in header]
        if missing:
            findings.append(f"{rel_path}:1: missing required method catalog column(s): {', '.join(missing)}")
        else:
            required_idx = {col: header.index(col) for col in METHOD_CATALOG_REQUIRED}

    key_col = next((c for c in KEY_COLUMNS if c in header), None)
    key_idx = header.index(key_col) if key_col is not None else None
    seen_keys: dict[str, int] = {}

    for line_no, row in enumerate(rows[1:], 2):
        if not row or all(not cell.strip() for cell in row):
            findings.append(f"{rel_path}:{line_no}: blank data row")
            continue
        if len(row) != col_count:
            findings.append(f"{rel_path}:{line_no}: expected {col_count} columns, found {len(row)}")
            continue
        if key_idx is not None:
            key = row[key_idx].strip()
            if not key:
                findings.append(f"{rel_path}:{line_no}: empty {key_col!r} value")
            elif key in seen_keys:
                findings.append(f"{rel_path}:{line_no}: duplicate {key_col!r} {key!r} (first at line {seen_keys[key]})")
            else:
                seen_keys[key] = line_no
        if required_idx:
            for col, idx in required_idx.items():
                if not row[idx].strip():
                    findings.append(f"{rel_path}:{line_no}: empty {col!r} value")
            questions = [q.strip() for q in row[required_idx["key_questions"]].split("|")]
            if any(not q for q in questions):
                findings.append(f"{rel_path}:{line_no}: empty question segment in 'key_questions'")

    return findings


def scan_csvs(root: Path) -> tuple[int, list[str]]:
    """Scan all CSV files under `root` in sorted order, returning (count, findings)."""
    if not root.is_dir():
        return 0, [f"root is not a directory: {root}"]
    files = sorted(root.rglob("*.csv"))
    findings: list[str] = []
    for path in files:
        try:
            rel = path.relative_to(root).as_posix()
        except ValueError:
            rel = str(path)
        findings.extend(validate_csv_file(path, rel))
    return len(files), findings


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description="Validate all CSV files under skills/.")
    parser.add_argument("--root", type=Path, default=REPO_ROOT / "skills", help="root directory to scan")
    parser.add_argument("--strict", action="store_true", help="exit 1 if any finding is reported")
    args = parser.parse_args(argv)

    root = args.root.expanduser().resolve()
    count, findings = scan_csvs(root)
    print(f"CSV files scanned: {count}, findings: {len(findings)}")
    for finding in findings:
        print(f"  - {finding}", file=sys.stderr if args.strict else sys.stdout)
    return 1 if (findings and args.strict) else 0


if __name__ == "__main__":
    if sys.platform == "win32":
        sys.stdout.reconfigure(encoding="utf-8")
        sys.stderr.reconfigure(encoding="utf-8")
    sys.exit(main())
