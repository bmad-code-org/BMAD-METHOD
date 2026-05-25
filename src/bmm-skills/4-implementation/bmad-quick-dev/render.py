#!/usr/bin/env python3
"""render.py — bmad-quick-dev template renderer.

Resolves compile-time {{.variable}} placeholders from BMad's central config,
bakes absolute paths for {project-root} into derived values, and writes
rendered .md files to {project-root}/_bmad/render/bmad-quick-dev/.

Config: four-layer merge of _bmad/config.toml + config.user.toml +
custom/config.toml + custom/config.user.toml (post-#2285 installs).
Keys surface from [core] and [modules.bmm]. Missing or unparseable
config.toml → HALT.

Runtime {variable} placeholders (single curly) pass through untouched for
the LLM to resolve during workflow execution.

Every invocation rebuilds from scratch — no hash, no cache.
Python 3.11+ stdlib only. UTF-8 I/O.
"""

import os
import posixpath
import re
import sys
import tomllib


def find_project_root():
    """Walk up from cwd until a _bmad/ directory is found. On failure, print a
    HALT instruction to stdout and exit non-zero."""
    current = os.path.abspath(os.getcwd())
    while True:
        candidate = os.path.join(current, "_bmad")
        if os.path.isdir(candidate):
            return current
        parent = os.path.dirname(current)
        if parent == current:
            print(
                f"HALT and report to the user: no _bmad/ directory found walking up from {os.getcwd()}"
            )
            sys.exit(1)
        current = parent


def load_toml(path, required=False):
    """Load a TOML file. For required files, HALT (stdout) on missing/parse
    error so the LLM-driven workflow stops — stdout is how this script signals
    workflow halts to its LLM caller. For optional files, write a stderr
    warning and return {}."""
    if not os.path.isfile(path):
        if required:
            print(
                f"HALT and report to the user: required config file not found: {path} — "
                "ensure this is a post-#2285 BMAD install"
            )
            sys.exit(1)
        return {}
    try:
        with open(path, "rb") as fh:
            parsed = tomllib.load(fh)
    except tomllib.TOMLDecodeError as error:
        if required:
            print(f"HALT and report to the user: failed to parse {path}: {error}")
            sys.exit(1)
        print(f"render.py: warning: failed to parse {path}: {error}", file=sys.stderr)
        return {}
    except OSError as error:
        if required:
            print(f"HALT and report to the user: failed to read {path}: {error}")
            sys.exit(1)
        print(f"render.py: warning: failed to read {path}: {error}", file=sys.stderr)
        return {}
    if not isinstance(parsed, dict):
        return {}
    return parsed


def _deep_merge(base, override):
    """Dict-aware deep merge. Lists and scalars: override wins (we don't need
    the full keyed-merge semantics of resolve_config.py — quick-dev only reads
    flat scalars out of [core] and [modules.bmm])."""
    if isinstance(base, dict) and isinstance(override, dict):
        result = dict(base)
        for key, value in override.items():
            result[key] = _deep_merge(result[key], value) if key in result else value
        return result
    return override


def load_central_config(root):
    """Four-layer merge of _bmad/config.toml and its peers (highest priority
    last). HALTs if the base _bmad/config.toml is missing or unparseable."""
    bmad_dir = posixpath.join(root, "_bmad")
    base_team = load_toml(posixpath.join(bmad_dir, "config.toml"), required=True)
    base_user = load_toml(posixpath.join(bmad_dir, "config.user.toml"))
    custom_team = load_toml(posixpath.join(bmad_dir, "custom", "config.toml"))
    custom_user = load_toml(posixpath.join(bmad_dir, "custom", "config.user.toml"))

    merged = _deep_merge(base_team, base_user)
    merged = _deep_merge(merged, custom_team)
    merged = _deep_merge(merged, custom_user)
    return merged


def flatten_central_config(merged):
    """Lift scalar keys from [core] and [modules.bmm] into a single namespace.
    Module keys take precedence on collision (installer strips core keys from
    module buckets, so collisions shouldn't happen in practice)."""
    flat = {}
    for section in (merged.get("core"), merged.get("modules", {}).get("bmm")):
        if not isinstance(section, dict):
            continue
        for key, value in section.items():
            if isinstance(value, bool):
                flat[key] = "true" if value else "false"
            elif isinstance(value, (str, int, float)):
                flat[key] = str(value)
    return flat


def render_template(content, vars_):
    """Resolve {{.var}} substitutions. Unresolved references emit an empty string
    (Go's missingkey=zero semantics)."""
    return re.sub(r"\{\{\.(\w+)\}\}", lambda m: vars_.get(m.group(1), ""), content)


def main():
    script_dir = os.path.dirname(os.path.abspath(__file__))
    skill_name = os.path.basename(script_dir)
    root = find_project_root()
    root = root.replace(os.sep, "/")
    bmad_dir = posixpath.join(root, "_bmad")

    vars_ = flatten_central_config(load_central_config(root))

    for key in list(vars_.keys()):
        vars_[key] = vars_[key].replace("{project-root}", root)

    vars_["project_root"] = root
    vars_["main_config"] = posixpath.join(bmad_dir, "config.toml")
    vars_["sprint_status"] = posixpath.join(
        vars_["implementation_artifacts"], "sprint-status.yaml"
    )
    vars_["deferred_work_file"] = posixpath.join(
        vars_["implementation_artifacts"], "deferred-work.md"
    )

    out_dir = posixpath.join(root, "_bmad", "render", skill_name)
    os.makedirs(out_dir, exist_ok=True)

    for fname in os.listdir(out_dir):
        if fname.endswith(".md"):
            os.remove(posixpath.join(out_dir, fname))

    count = 0
    for fname in sorted(os.listdir(script_dir)):
        if not fname.endswith(".md") or fname == "SKILL.md":
            continue
        src = posixpath.join(script_dir, fname)
        dst = posixpath.join(out_dir, fname)
        with open(src, "r", encoding="utf-8", newline="") as fh:
            content = fh.read()
        with open(dst, "w", encoding="utf-8", newline="") as fh:
            fh.write(render_template(content, vars_))
        count += 1

    print(f"render.py: rendered {count} files -> {out_dir}", file=sys.stderr)
    workflow_md = posixpath.join(out_dir, "workflow.md")
    print(f"read and follow {workflow_md}")


if __name__ == "__main__":
    main()
