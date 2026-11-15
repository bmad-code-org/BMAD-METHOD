#!/usr/bin/env python3
# /// script
# requires-python = ">=3.11"
# ///
"""scan_scripts: lint a skill's scripts/*.py for the repository's script conventions.

Rules, each a `rule` value in the findings:
  pep723-missing   no `# /// script` inline metadata block; `uv run` needs it to pick dependencies
  pep723-floor     the block has no requires-python, or its floor is below 3.11
  test-missing     no scripts/tests/test_<name>.py beside the script; an exact copy (line endings aside)
                   of the memory-agent shape's wake.py or init-sanctum.py is tested in Toolsmith and never flagged
  network-call     imports a network module (urllib.request, requests, httpx, socket, http.client, aiohttp);
                   a skill script should work offline unless its docstring says why it cannot
  model-id         a string literal naming a model id (claude-*, gpt-*, gemini-*); users run any model,
                   so a script never hardcodes or validates against one
  custom-io        a string literal naming `_bmad/custom` or a `.user.toml` file; resolve_customization.py reads
                   overrides and the bmad-customize skill writes them, so a skill's own script touches neither
  argparse-missing a script with an `if __name__ == "__main__":` entry point that imports none of argparse,
                   click or typer, so it has no --help for the agent to read; a module only imported by its
                   siblings is not flagged, nor one whose entry point only refuses to run
                   (`sys.exit("...")` or `raise SystemExit("...")` with a message)
  syntax-error     the file does not parse

A shebang is optional. Files under scripts/tests/ are not linted.

Usage:
  scan_scripts.py <skill-folder>

Output, one JSON object on stdout:
  {"skill": str, "scripts": [{"path", "has_pep723", "floor", "has_test", "has_argparse", "copy_of" (copies only)}, ...],
   "findings": [{"path", "line", "rule", "text", "fix"}, ...]}
Exit 0 when clean, 1 when there are findings, 2 on a usage error.
"""

from __future__ import annotations

import argparse
import ast
import json
import re
import sys
from pathlib import Path

FLOOR = (3, 11)
SKILL_ROOT = Path(__file__).resolve().parent.parent
# The memory-agent shape copies these byte for byte into each agent it builds; their tests live with Toolsmith.
COPIED_SCRIPTS = ("shapes/memory-agent/assets/wake-template.py", "shapes/memory-agent/assets/init-sanctum-template.py")
PEP723_RE = re.compile(r"^# /// script\n(?P<body>(?:^#(?: .*)?\n)+?)^# ///$", re.MULTILINE)
REQUIRES_RE = re.compile(r'^#\s*requires-python\s*=\s*"([^"]*)"', re.MULTILINE)
VERSION_RE = re.compile(r">=\s*(\d+)\.(\d+)")
# Pieces are joined so this file's own literals do not match the rule.
CUSTOM_IO_RE = re.compile("|".join([r"_bmad/" + "custom", r"\.user\." + "toml"]))
NETWORK_MODULES = {"urllib.request", "requests", "httpx", "socket", "http.client", "aiohttp"}
# A model id carries a version digit; "claude-code" is a product name, not a model.
MODEL_ID_RE = re.compile(r"\b(?:claude|gpt|gemini)-(?:[a-z]+-)*\d[a-z0-9.-]*\b", re.IGNORECASE)


def finding(path: str, line: int, rule: str, text: str, fix: str) -> dict:
    return {"path": path, "line": line, "rule": rule, "text": text.strip()[:200], "fix": fix}


def pep723_floor(content: str) -> tuple[bool, str | None]:
    """Return (has_block, requires-python value or None)."""
    match = PEP723_RE.search(content)
    if not match:
        return False, None
    requires = REQUIRES_RE.search(match.group("body"))
    return True, requires.group(1) if requires else None


def floor_ok(requires: str) -> bool:
    match = VERSION_RE.search(requires)
    return bool(match) and (int(match.group(1)), int(match.group(2))) >= FLOOR


def scan_ast(tree: ast.AST, rel: str) -> list[dict]:
    findings = []
    docstring = tree.body[0].value if tree.body and isinstance(tree.body[0], ast.Expr) else None
    for node in ast.walk(tree):
        if node is docstring:
            continue
        names: list[str] = []
        if isinstance(node, ast.Import):
            names = [alias.name for alias in node.names]
        elif isinstance(node, ast.ImportFrom) and node.module:
            names = [node.module] + [f"{node.module}.{alias.name}" for alias in node.names]
        for name in names:
            if name in NETWORK_MODULES or name.split(".")[0] in {"requests", "httpx", "socket", "aiohttp"}:
                findings.append(
                    finding(rel, node.lineno, "network-call", name, "work offline, or say in the docstring why not")
                )
                break
        if isinstance(node, ast.Constant) and isinstance(node.value, str):
            if CUSTOM_IO_RE.search(node.value):
                findings.append(
                    finding(
                        rel,
                        node.lineno,
                        "custom-io",
                        node.value,
                        "drop it: resolve_customization.py reads overrides and the bmad-customize skill writes them",
                    )
                )
            match = MODEL_ID_RE.search(node.value)
            if match:
                findings.append(
                    finding(
                        rel, node.lineno, "model-id", match.group(0), "take the model from the caller, never a list"
                    )
                )
    return findings


def imports_any(tree: ast.AST, modules: set[str]) -> bool:
    for node in ast.walk(tree):
        if isinstance(node, ast.Import) and any(alias.name.split(".")[0] in modules for alias in node.names):
            return True
        if isinstance(node, ast.ImportFrom) and node.module and node.module.split(".")[0] in modules:
            return True
    return False


def is_refusal(stmt: ast.stmt) -> bool:
    """`sys.exit("...")`, `exit("...")` or `raise SystemExit("...")`: a library that will not run on its own."""
    call = stmt.exc if isinstance(stmt, ast.Raise) else stmt.value if isinstance(stmt, ast.Expr) else None
    if not isinstance(call, ast.Call) or call.keywords or len(call.args) != 1:
        return False
    func = call.func
    name = func.attr if isinstance(func, ast.Attribute) else func.id if isinstance(func, ast.Name) else ""
    allowed = {"SystemExit"} if isinstance(stmt, ast.Raise) else {"exit"}
    arg = call.args[0]
    return name in allowed and isinstance(arg, ast.Constant) and isinstance(arg.value, str)


def has_entry_point(tree: ast.Module) -> bool:
    for node in tree.body:
        if isinstance(node, ast.If) and isinstance(node.test, ast.Compare):
            names = [node.test.left, *node.test.comparators]
            if any(isinstance(n, ast.Name) and n.id == "__name__" for n in names):
                if not all(is_refusal(stmt) for stmt in node.body):
                    return True
    return False


def lf_bytes(path: Path) -> bytes:
    return path.read_bytes().replace(b"\r\n", b"\n")


def shape_scripts() -> dict[bytes, str]:
    """The copied scripts by content, line endings normalized."""
    return {lf_bytes(SKILL_ROOT / rel): rel for rel in COPIED_SCRIPTS if (SKILL_ROOT / rel).is_file()}


def scan_script(path: Path, scripts_dir: Path, copies: dict[bytes, str]) -> tuple[dict, list[dict]]:
    rel = f"scripts/{path.name}"
    content = path.read_text(encoding="utf-8", errors="replace")
    has_block, requires = pep723_floor(content)
    test_file = scripts_dir / "tests" / f"test_{path.stem}.py"
    info = {
        "path": rel,
        "has_pep723": has_block,
        "floor": requires,
        "has_test": test_file.is_file(),
        "has_argparse": False,
    }
    copy_of = copies.get(lf_bytes(path))
    if copy_of:
        info["copy_of"] = copy_of
    findings = []
    if not has_block:
        findings.append(
            finding(rel, 1, "pep723-missing", path.name, 'add `# /// script` with requires-python = ">=3.11"')
        )
    elif requires is None or not floor_ok(requires):
        findings.append(finding(rel, 1, "pep723-floor", requires or "(none)", 'set requires-python = ">=3.11"'))
    if not info["has_test"] and not copy_of:
        findings.append(finding(rel, 1, "test-missing", path.name, f"add scripts/tests/test_{path.stem}.py (unittest)"))
    try:
        tree = ast.parse(content)
    except SyntaxError as err:
        findings.append(finding(rel, err.lineno or 1, "syntax-error", str(err.msg), "fix the syntax"))
        return info, findings
    info["has_argparse"] = imports_any(tree, {"argparse"})
    if not imports_any(tree, {"argparse", "click", "typer"}) and has_entry_point(tree):
        findings.append(finding(rel, 1, "argparse-missing", path.name, "parse arguments with argparse"))
    findings.extend(scan_ast(tree, rel))
    return info, findings


def scan_scripts(skill_root: Path) -> dict:
    scripts_dir = skill_root / "scripts"
    scripts: list[dict] = []
    findings: list[dict] = []
    if scripts_dir.is_dir():
        copies = shape_scripts()
        for path in sorted(scripts_dir.glob("*.py")):
            info, found = scan_script(path, scripts_dir, copies)
            scripts.append(info)
            findings.extend(found)
    findings.sort(key=lambda f: (f["path"], f["line"], f["rule"]))
    return {"skill": skill_root.name, "scripts": scripts, "findings": findings}


def main(argv: list[str] | None = None) -> int:
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    p.add_argument("skill", type=Path, help="skill folder to scan")
    args = p.parse_args(argv)
    if not args.skill.is_dir():
        p.error(f"not a directory: {args.skill}")
    result = scan_scripts(args.skill)
    print(json.dumps(result, indent=2))
    return 1 if result["findings"] else 0


if __name__ == "__main__":
    sys.exit(main())
