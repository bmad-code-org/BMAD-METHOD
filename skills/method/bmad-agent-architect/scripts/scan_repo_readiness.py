#!/usr/bin/env python3
# /// script
# requires-python = ">=3.11"
# ///
"""scan_repo_readiness — deterministic repo telemetry for agent-readiness coaching.

Measures codebase friction signals that LLMs should never guess from memory:
  - summary                 file counts, approximate token footprint, language breakdown
  - largest_files           top source files by line count (context-window pressure)
  - churn_hotspots          source files ranked by git commit churn * lines
  - instruction_and_doc_files  agent instruction files, top-level docs, and large doc files
  - comment_hotspots        source files with comment bloat, TODO markers, ticket refs, or commented code
  - guardrails              detected package manifests, linters, typecheckers, tests, and CI configs

Pure stdlib, offline, exits 0 on success or 2 if the target path is not a directory.
"""

from __future__ import annotations

import argparse
import json
import os
import re
import subprocess
import sys
from collections import Counter
from pathlib import Path

sys.dont_write_bytecode = True

SKIP_DIRS = frozenset(
    {
        ".git",
        "node_modules",
        ".venv",
        "venv",
        ".tox",
        "dist",
        "build",
        "target",
        "__pycache__",
        ".next",
        ".nuxt",
        ".svelte-kit",
        "coverage",
        ".pytest_cache",
        ".mypy_cache",
        ".ruff_cache",
        "vendor",
        "_bmad",
        "_bmad-output",
    }
)

SKIP_FILES = frozenset(
    {
        "package-lock.json",
        "pnpm-lock.yaml",
        "yarn.lock",
        "uv.lock",
        "Cargo.lock",
        "poetry.lock",
        "Gemfile.lock",
        "composer.lock",
    }
)

BINARY_EXTS = frozenset(
    {
        ".png",
        ".jpg",
        ".jpeg",
        ".gif",
        ".webp",
        ".ico",
        ".svg",
        ".pdf",
        ".zip",
        ".tar",
        ".gz",
        ".tgz",
        ".whl",
        ".woff",
        ".woff2",
        ".ttf",
        ".eot",
        ".mp3",
        ".mp4",
        ".mov",
        ".pyc",
        ".pyo",
        ".so",
        ".dylib",
        ".dll",
        ".exe",
        ".bin",
        ".db",
        ".sqlite",
        ".lock",
        ".map",
    }
)

SOURCE_EXTS = frozenset(
    {
        ".py",
        ".js",
        ".jsx",
        ".ts",
        ".tsx",
        ".mjs",
        ".cjs",
        ".go",
        ".rs",
        ".java",
        ".kt",
        ".kts",
        ".cs",
        ".rb",
        ".php",
        ".swift",
        ".c",
        ".cc",
        ".cpp",
        ".h",
        ".hpp",
        ".scala",
        ".ex",
        ".exs",
        ".sh",
        ".bash",
        ".zsh",
        ".sql",
    }
)

DOC_EXTS = frozenset({".md", ".mdx", ".rst", ".txt", ".adoc"})

INSTRUCTION_NAMES = frozenset(
    {
        "AGENTS.md",
        "CLAUDE.md",
        "GEMINI.md",
        ".cursorrules",
        "copilot-instructions.md",
    }
)

TOP_DOC_NAMES = frozenset({"README.md", "CONTRIBUTING.md", "ARCHITECTURE.md", "DEVELOPMENT.md"})

MANIFEST_NAMES = frozenset(
    {
        "pyproject.toml",
        "package.json",
        "Cargo.toml",
        "go.mod",
        "pom.xml",
        "build.gradle",
        "build.gradle.kts",
        "Makefile",
        "justfile",
    }
)

GUARDRAIL_NAMES = frozenset(
    {
        ".pre-commit-config.yaml",
        ".eslintrc",
        ".eslintrc.js",
        ".eslintrc.cjs",
        ".eslintrc.json",
        ".eslintrc.yml",
        "eslint.config.js",
        "eslint.config.mjs",
        "eslint.config.ts",
        "biome.json",
        "biome.jsonc",
        "ruff.toml",
        ".ruff.toml",
        "mypy.ini",
        ".mypy.ini",
        "pyrightconfig.json",
        "tsconfig.json",
        "pytest.ini",
        "jest.config.js",
        "jest.config.ts",
        "vitest.config.ts",
        "vitest.config.js",
    }
)

TODO_RE = re.compile(r"\b(TODO|FIXME|HACK|XXX)\b")
TICKET_RE = re.compile(r"\b[A-Z]{2,8}-\d+\b")
CODE_HINT_RE = re.compile(
    r"(?:=|;|\{|\}|\(\)|\b(?:def|class|function|const|let|var|return|import|export|if|for|while)\b)"
)

LARGE_DOC_LINES = 200
MIN_COMMENT_SAMPLE_LINES = 20


def approx_tokens(text: str) -> int:
    return max(1, len(text) // 4) if text else 0


def git_churn(repo: Path, commits: int) -> tuple[bool, Counter[str]]:
    """Count per-file commit touches in recent git history, returning (git_ok, counts)."""
    env = {k: v for k, v in os.environ.items() if not k.startswith("GIT_")}
    try:
        proc = subprocess.run(
            ["git", "-C", str(repo), "log", f"-n{commits}", "--name-only", "--pretty=format:"],
            capture_output=True,
            text=True,
            check=True,
            timeout=15,
            env=env,
        )
    except (OSError, subprocess.SubprocessError):
        return False, Counter()
    counts: Counter[str] = Counter()
    for raw in proc.stdout.splitlines():
        rel = raw.strip()
        if rel:
            counts[rel] += 1
    return True, counts


def analyze_comments(lines: list[str]) -> dict[str, int | float]:
    """Count comment lines, TODO markers, ticket IDs, and commented-out code runs."""
    comment_lines = 0
    todo_markers = 0
    ticket_refs = 0
    commented_code_runs = 0
    code_run = 0
    in_block = False

    for raw in lines:
        stripped = raw.strip()
        is_comment = False
        comment_text = ""

        if in_block:
            is_comment = True
            end = stripped.find("*/")
            if end != -1:
                comment_text = stripped[:end]
                in_block = False
            else:
                comment_text = stripped
        elif stripped.startswith("/*"):
            is_comment = True
            end = stripped.find("*/", 2)
            if end != -1:
                comment_text = stripped[2:end]
            else:
                comment_text = stripped[2:]
                in_block = True
        elif stripped.startswith("#") and not stripped.startswith("#!"):
            is_comment = True
            comment_text = stripped.lstrip("#").strip()
        elif stripped.startswith("//"):
            is_comment = True
            comment_text = stripped[2:].strip()

        if is_comment:
            comment_lines += 1
            if TODO_RE.search(comment_text):
                todo_markers += 1
            if TICKET_RE.search(comment_text):
                ticket_refs += 1
            if comment_text and CODE_HINT_RE.search(comment_text):
                code_run += 1
            else:
                if code_run >= 2:
                    commented_code_runs += 1
                code_run = 0
        else:
            if code_run >= 2:
                commented_code_runs += 1
            code_run = 0

    if code_run >= 2:
        commented_code_runs += 1

    total = len(lines)
    ratio = round(comment_lines / total, 3) if total else 0.0
    return {
        "comment_lines": comment_lines,
        "comment_ratio": ratio,
        "todo_markers": todo_markers,
        "ticket_refs": ticket_refs,
        "commented_code_runs": commented_code_runs,
    }


def is_instruction_or_important_doc(rel: Path, lines: int) -> bool:
    name = rel.name
    posix = rel.as_posix()
    if name in INSTRUCTION_NAMES:
        return True
    if ".cursor/rules/" in posix or posix.startswith(".cursor/rules/"):
        return True
    if len(rel.parts) == 1 and name in TOP_DOC_NAMES:
        return True
    return rel.suffix.lower() in DOC_EXTS and lines >= LARGE_DOC_LINES


def _skip_dir(rel_parts: tuple[str, ...]) -> bool:
    """Skip ignored directory names and installed agent skill trees (e.g. `.claude/skills`, `.agents/skills`)."""
    name = rel_parts[-1]
    if name in SKIP_DIRS:
        return True
    return len(rel_parts) >= 2 and name == "skills" and rel_parts[-2].startswith(".")


def scan_repo(repo: Path, *, top: int = 15, commits: int = 200) -> dict:
    """Scan `repo` deterministically and return readiness telemetry."""
    git_ok, churn = git_churn(repo, commits)
    languages: Counter[str] = Counter()
    source_records: list[dict] = []
    comment_records: list[dict] = []
    doc_records: list[dict] = []
    manifests: list[str] = []
    guardrails: list[str] = []
    ci_workflows: list[str] = []

    total_files = 0
    source_files = 0
    doc_files = 0
    source_tokens = 0
    doc_tokens = 0

    for dirpath, dirnames, filenames in os.walk(repo):
        cur = Path(dirpath)
        rel_dir = cur.relative_to(repo)
        dirnames[:] = sorted(d for d in dirnames if not _skip_dir((*rel_dir.parts, d)))
        for fname in sorted(filenames):
            if fname in SKIP_FILES or fname.endswith((".min.js", ".min.css")):
                continue
            fpath = cur / fname
            if fpath.is_symlink():
                continue
            rel = fpath.relative_to(repo)
            posix = rel.as_posix()
            ext = fpath.suffix.lower()

            if ext in BINARY_EXTS:
                continue

            total_files += 1
            if fname in MANIFEST_NAMES:
                manifests.append(posix)
            if fname in GUARDRAIL_NAMES:
                guardrails.append(posix)
            if posix.startswith(".github/workflows/") and ext in {".yml", ".yaml"}:
                ci_workflows.append(posix)

            try:
                text = fpath.read_text(encoding="utf-8", errors="ignore")
            except OSError:
                continue
            lines = text.splitlines()
            line_count = len(lines)
            tokens = approx_tokens(text)

            if ext in SOURCE_EXTS:
                source_files += 1
                source_tokens += tokens
                languages[ext] += 1
                file_churn = churn.get(posix, 0)
                source_records.append(
                    {
                        "path": posix,
                        "lines": line_count,
                        "approx_tokens": tokens,
                        "churn_commits": file_churn,
                    }
                )
                cstats = analyze_comments(lines)
                has_noise = cstats["todo_markers"] > 0 or cstats["ticket_refs"] > 0 or cstats["commented_code_runs"] > 0
                if (line_count >= MIN_COMMENT_SAMPLE_LINES and cstats["comment_ratio"] >= 0.15) or has_noise:
                    comment_records.append({"path": posix, "lines": line_count, **cstats})
            elif ext in DOC_EXTS or fname in INSTRUCTION_NAMES:
                doc_files += 1
                doc_tokens += tokens
                if is_instruction_or_important_doc(rel, line_count):
                    doc_records.append({"path": posix, "lines": line_count, "approx_tokens": tokens})

    largest = sorted(source_records, key=lambda r: (-r["lines"], r["path"]))[:top]
    churn_hotspots = (
        sorted(
            (r for r in source_records if r["churn_commits"] > 0),
            key=lambda r: (-(r["churn_commits"] * r["lines"]), -r["churn_commits"], r["path"]),
        )[:top]
        if git_ok
        else []
    )
    comment_hotspots = sorted(
        comment_records,
        key=lambda r: (
            -(r["commented_code_runs"] * 5 + r["ticket_refs"] * 3 + r["todo_markers"]),
            -r["comment_ratio"],
            -r["comment_lines"],
            r["path"],
        ),
    )[:top]
    doc_records.sort(key=lambda r: (-r["approx_tokens"], r["path"]))

    return {
        "repo": str(repo),
        "git_available": git_ok,
        "summary": {
            "total_files": total_files,
            "source_files": source_files,
            "doc_files": doc_files,
            "approx_source_tokens": source_tokens,
            "approx_doc_tokens": doc_tokens,
            "languages": dict(languages.most_common()),
        },
        "largest_files": largest,
        "churn_hotspots": churn_hotspots,
        "instruction_and_doc_files": doc_records,
        "comment_hotspots": comment_hotspots,
        "guardrails": {
            "manifests": sorted(manifests),
            "configs": sorted(guardrails),
            "ci_workflows": sorted(ci_workflows),
        },
    }


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description="Scan a repository for agentic delivery readiness telemetry.")
    parser.add_argument("repo", nargs="?", default=".", type=Path, help="repository root to scan (default: .)")
    parser.add_argument("--top", type=int, default=15, help="max items in hotspot lists (default: 15)")
    parser.add_argument("--commits", type=int, default=200, help="git log window for churn analysis (default: 200)")
    parser.add_argument("-o", "--output", type=Path, help="write JSON output to file instead of stdout")
    args = parser.parse_args(argv)

    repo = args.repo.expanduser().resolve()
    if not repo.is_dir():
        print(f"error: not a directory: {args.repo}", file=sys.stderr)
        return 2

    payload = json.dumps(scan_repo(repo, top=args.top, commits=args.commits), indent=2)
    if args.output:
        args.output.write_text(payload + "\n", encoding="utf-8")
    else:
        print(payload)
    return 0


if __name__ == "__main__":
    sys.exit(main())
