# /// script
# /// requires-python = ">=3.10"
# /// dependencies = []
# ///
"""Analyze source documents for the distillation generator.

Enumerates files from paths/folders/globs, computes sizes and token estimates,
detects document types from naming conventions, and suggests groupings for
related documents (e.g., a brief paired with its discovery notes).

Accepts: file paths, folder paths (scans recursively for .md/.txt/.yaml/.yml/.json),
or glob patterns. Skips node_modules, .git, __pycache__, .venv, _bmad-output.

Output JSON structure:
  status: "ok" | "error"
  files[]: path, filename, size_bytes, estimated_tokens, doc_type
  summary: total_files, total_size_bytes, total_estimated_tokens
  groups[]: group_key, files[] with role (primary/companion/standalone)
    - Groups related docs by naming convention (e.g., brief + discovery-notes)
  routing: recommendation ("single" | "fan-out"), reason
    - single: ≤3 files AND ≤15K estimated tokens
    - fan-out: >3 files OR >15K estimated tokens
  split_prediction: prediction ("likely" | "unlikely"), reason, estimated_distillate_tokens
    - Estimates distillate at ~1/3 source size; splits if >5K tokens
"""

from __future__ import annotations

import argparse
import glob
import json
import os
import re
import sys
from pathlib import Path

# Extensions to include when scanning folders
INCLUDE_EXTENSIONS = {".md", ".txt", ".yaml", ".yml", ".json"}

# Directories to skip when scanning folders
SKIP_DIRS = {
    "node_modules", ".git", "__pycache__", ".venv", "venv",
    ".claude", "_bmad-output", ".cursor", ".vscode",
}

# Approximate chars per token for estimation
CHARS_PER_TOKEN = 4

# Thresholds
SINGLE_COMPRESSOR_MAX_TOKENS = 15_000
SINGLE_DISTILLATE_MAX_TOKENS = 5_000

# Naming patterns for document type detection
DOC_TYPE_PATTERNS = [
    (r"discovery[_-]notes", "discovery-notes"),
    (r"product[_-]brief", "product-brief"),
    (r"research[_-]report", "research-report"),
    (r"architecture", "architecture-doc"),
    (r"prd", "prd"),
    (r"distillate", "distillate"),
    (r"changelog", "changelog"),
    (r"readme", "readme"),
    (r"spec", "specification"),
    (r"requirements", "requirements"),
    (r"design[_-]doc", "design-doc"),
    (r"meeting[_-]notes", "meeting-notes"),
    (r"brainstorm", "brainstorming"),
    (r"interview", "interview-notes"),
]

# Patterns for grouping related documents
GROUP_PATTERNS = [
    # base document + discovery notes
    (r"^(.+?)(?:-discovery-notes|-discovery_notes)\.(\w+)$", r"\1.\2"),
    # base document + appendix
    (r"^(.+?)(?:-appendix|-addendum)(?:-\w+)?\.(\w+)$", r"\1.\2"),
    # base document + review/feedback
    (r"^(.+?)(?:-review|-feedback)\.(\w+)$", r"\1.\2"),
]


def resolve_inputs(inputs: list[str]) -> list[Path]:
    """Resolve input arguments to a flat list of file paths."""
    files: list[Path] = []
    for inp in inputs:
        path = Path(inp)
        if path.is_file():
            files.append(path.resolve())
        elif path.is_dir():
            for root, dirs, filenames in os.walk(path):
                dirs[:] = [d for d in dirs if d not in SKIP_DIRS]
                for fn in sorted(filenames):
                    fp = Path(root) / fn
                    if fp.suffix.lower() in INCLUDE_EXTENSIONS:
                        files.append(fp.resolve())
        else:
            # Try as glob
            matches = glob.glob(inp, recursive=True)
            for m in sorted(matches):
                mp = Path(m)
                if mp.is_file() and mp.suffix.lower() in INCLUDE_EXTENSIONS:
                    files.append(mp.resolve())
    # Deduplicate while preserving order
    seen: set[Path] = set()
    deduped: list[Path] = []
    for f in files:
        if f not in seen:
            seen.add(f)
            deduped.append(f)
    return deduped


def detect_doc_type(filename: str) -> str:
    """Detect document type from filename."""
    name_lower = filename.lower()
    for pattern, doc_type in DOC_TYPE_PATTERNS:
        if re.search(pattern, name_lower):
            return doc_type
    return "unknown"


def suggest_groups(files: list[Path]) -> list[dict]:
    """Suggest document groupings based on naming conventions."""
    groups: dict[str, list[dict]] = {}
    ungrouped: list[dict] = []

    file_map = {f.name: f for f in files}

    assigned: set[str] = set()

    for f in files:
        if f.name in assigned:
            continue

        matched = False
        for pattern, base_pattern in GROUP_PATTERNS:
            m = re.match(pattern, f.name, re.IGNORECASE)
            if m:
                # This file is a companion — find its base
                base_name = re.sub(pattern, base_pattern, f.name, flags=re.IGNORECASE)
                group_key = base_name
                if group_key not in groups:
                    groups[group_key] = []
                    # Add the base file if it exists
                    if base_name in file_map and base_name not in assigned:
                        groups[group_key].append({
                            "path": str(file_map[base_name]),
                            "filename": base_name,
                            "role": "primary",
                        })
                        assigned.add(base_name)
                groups[group_key].append({
                    "path": str(f),
                    "filename": f.name,
                    "role": "companion",
                })
                assigned.add(f.name)
                matched = True
                break

        if not matched:
            # Check if this file is a base that already has companions
            if f.name in groups:
                continue  # Already added as primary
            ungrouped.append({
                "path": str(f),
                "filename": f.name,
            })

    result = []
    for group_key, members in groups.items():
        result.append({
            "group_key": group_key,
            "files": members,
        })
    for ug in ungrouped:
        if ug["filename"] not in assigned:
            result.append({
                "group_key": ug["filename"],
                "files": [{"path": ug["path"], "filename": ug["filename"], "role": "standalone"}],
            })

    return result


def analyze(inputs: list[str], output_path: str | None = None) -> None:
    """Main analysis function."""
    files = resolve_inputs(inputs)

    if not files:
        result = {
            "status": "error",
            "error": "No readable files found from provided inputs",
            "inputs": inputs,
        }
        output_json(result, output_path)
        return

    # Analyze each file
    file_details = []
    total_chars = 0
    for f in files:
        size = f.stat().st_size
        total_chars += size
        file_details.append({
            "path": str(f),
            "filename": f.name,
            "size_bytes": size,
            "estimated_tokens": size // CHARS_PER_TOKEN,
            "doc_type": detect_doc_type(f.name),
        })

    total_tokens = total_chars // CHARS_PER_TOKEN
    groups = suggest_groups(files)

    # Routing recommendation
    if len(files) <= 3 and total_tokens <= SINGLE_COMPRESSOR_MAX_TOKENS:
        routing = "single"
        routing_reason = (
            f"{len(files)} file(s), ~{total_tokens:,} estimated tokens — "
            f"within single compressor threshold"
        )
    else:
        routing = "fan-out"
        routing_reason = (
            f"{len(files)} file(s), ~{total_tokens:,} estimated tokens — "
            f"exceeds single compressor threshold "
            f"({'>' + str(SINGLE_COMPRESSOR_MAX_TOKENS) + ' tokens' if total_tokens > SINGLE_COMPRESSOR_MAX_TOKENS else '> 3 files'})"
        )

    # Split prediction
    estimated_distillate_tokens = total_tokens // 3  # rough: distillate is ~1/3 of source
    if estimated_distillate_tokens > SINGLE_DISTILLATE_MAX_TOKENS:
        split_prediction = "likely"
        split_reason = (
            f"Estimated distillate ~{estimated_distillate_tokens:,} tokens "
            f"exceeds {SINGLE_DISTILLATE_MAX_TOKENS:,} threshold"
        )
    else:
        split_prediction = "unlikely"
        split_reason = (
            f"Estimated distillate ~{estimated_distillate_tokens:,} tokens "
            f"within {SINGLE_DISTILLATE_MAX_TOKENS:,} threshold"
        )

    result = {
        "status": "ok",
        "files": file_details,
        "summary": {
            "total_files": len(files),
            "total_size_bytes": total_chars,
            "total_estimated_tokens": total_tokens,
        },
        "groups": groups,
        "routing": {
            "recommendation": routing,
            "reason": routing_reason,
        },
        "split_prediction": {
            "prediction": split_prediction,
            "reason": split_reason,
            "estimated_distillate_tokens": estimated_distillate_tokens,
        },
    }

    output_json(result, output_path)


def output_json(data: dict, output_path: str | None) -> None:
    """Write JSON to file or stdout."""
    json_str = json.dumps(data, indent=2)
    if output_path:
        Path(output_path).parent.mkdir(parents=True, exist_ok=True)
        Path(output_path).write_text(json_str + "\n")
        print(f"Results written to {output_path}", file=sys.stderr)
    else:
        print(json_str)


def main() -> None:
    parser = argparse.ArgumentParser(
        description=__doc__,
        formatter_class=argparse.RawDescriptionHelpFormatter,
    )
    parser.add_argument(
        "inputs",
        nargs="+",
        help="File paths, folder paths, or glob patterns to analyze",
    )
    parser.add_argument(
        "-o", "--output",
        help="Output JSON to file instead of stdout",
    )
    args = parser.parse_args()
    analyze(args.inputs, args.output)
    sys.exit(0)


if __name__ == "__main__":
    main()
