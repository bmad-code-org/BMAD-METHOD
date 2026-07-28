#!/usr/bin/env python3
# /// script
# requires-python = ">=3.11"
# ///
"""render.py — bmad-quick-dev template renderer.

Resolves compile-time {{.variable}} placeholders from BMad's central config,
bakes absolute paths for {project-root} into derived values, resolves and
inlines the skill's [workflow] customization block, and writes rendered .md
files to {project-root}/_bmad/render/bmad-quick-dev/.

Config: four-layer merge of _bmad/config.toml + config.user.toml +
custom/config.toml + custom/config.user.toml (post-#2285 installs).
Keys surface from [core] and [modules.bmm]. Missing or unparseable
config.toml → HALT. A {{.var}} referenced by this skill's .md sources but
absent from the merged config → HALT (never a silent empty substitution).
Optional layers may be missing, but one that exists and cannot be parsed
or read → HALT.

Customization: three-layer merge of {skill}/customize.toml +
_bmad/custom/bmad-quick-dev.toml + .user.toml (same structural rules as
resolve_customization.py). The resolved [workflow] values fill {workflow.*}
placeholders, so this skill needs no runtime resolve_customization.py call.
Other single-curly placeholders ({project-root}, {spec_file}, {skill-root},
...) pass through untouched for the LLM to resolve during workflow execution.

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
    """Load a TOML file. Only absence is negotiable: a missing optional file
    returns {} (customization layers are optional), a missing required file
    HALTs. A file that exists but cannot be parsed or read always HALTs —
    stdout is how this script signals workflow halts to its LLM caller — the
    user wrote it to be honored, and silently continuing with {} would discard
    their customizations with no failure signal."""
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
        print(f"HALT and report to the user: failed to parse {path}: {error}")
        sys.exit(1)
    except OSError as error:
        print(f"HALT and report to the user: failed to read {path}: {error}")
        sys.exit(1)
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


def _detect_keyed_merge_field(items):
    """Return 'code' or 'id' if every table item carries that same field.
    Mixed or partial arrays return None and fall through to append."""
    if not items or not all(isinstance(item, dict) for item in items):
        return None
    for candidate in ("code", "id"):
        if all(item.get(candidate) is not None for item in items):
            return candidate
    return None


def _merge_by_key(base, override, key_name):
    result = []
    index_by_key = {}
    for item in base:
        if not isinstance(item, dict):
            continue
        if item.get(key_name) is not None:
            index_by_key[item[key_name]] = len(result)
        result.append(dict(item))
    for item in override:
        if not isinstance(item, dict):
            result.append(item)
            continue
        key = item.get(key_name)
        if key is not None and key in index_by_key:
            result[index_by_key[key]] = dict(item)
        else:
            if key is not None:
                index_by_key[key] = len(result)
            result.append(dict(item))
    return result


def _merge_arrays(base, override):
    """Shape-aware array merge: keyed merge if every item has code/id, else append."""
    base_arr = base if isinstance(base, list) else []
    override_arr = override if isinstance(override, list) else []
    keyed_field = _detect_keyed_merge_field(base_arr + override_arr)
    if keyed_field:
        return _merge_by_key(base_arr, override_arr, keyed_field)
    return base_arr + override_arr


def _structural_merge(base, override):
    """Faithful port of resolve_customization.py's deep_merge: tables deep-merge,
    arrays-of-tables keyed by code/id replace-then-append (other arrays append),
    scalars override. Used only for the [workflow] customization layers — the
    central-config path keeps its own simpler _deep_merge. Duplicated rather than
    imported to keep this skill self-contained."""
    if isinstance(base, dict) and isinstance(override, dict):
        result = dict(base)
        for key, over_val in override.items():
            result[key] = (
                _structural_merge(result[key], over_val) if key in result else over_val
            )
        return result
    if isinstance(base, list) and isinstance(override, list):
        return _merge_arrays(base, override)
    return override


def resolve_workflow(root, skill_dir, skill_name):
    """Resolve the [workflow] customization block via the three-layer merge
    (skill defaults -> team -> user), highest priority last. Same structural
    rules as resolve_customization.py. All three layers are optional: a missing
    file is skipped, but an unparseable one HALTs (via load_toml)."""
    defaults = load_toml(posixpath.join(skill_dir, "customize.toml"))
    custom_dir = posixpath.join(root, "_bmad", "custom")
    team = load_toml(posixpath.join(custom_dir, f"{skill_name}.toml"))
    user = load_toml(posixpath.join(custom_dir, f"{skill_name}.user.toml"))
    merged = _structural_merge(defaults, team)
    merged = _structural_merge(merged, user)
    workflow = merged.get("workflow")
    return workflow if isinstance(workflow, dict) else {}


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
    modules = merged.get("modules")
    modules = modules if isinstance(modules, dict) else {}
    for section in (merged.get("core"), modules.get("bmm")):
        if not isinstance(section, dict):
            continue
        for key, value in section.items():
            if isinstance(value, bool):
                flat[key] = "true" if value else "false"
            elif isinstance(value, (str, int, float)):
                flat[key] = str(value)
    return flat


def render_template(content, vars_):
    """Resolve {{.var}} substitutions. Unresolved references emit an empty string,
    but main() HALTs on any missing reference before rendering starts, so this
    fallback never fires in practice."""
    return re.sub(r"\{\{\.(\w+)\}\}", lambda m: vars_.get(m.group(1), ""), content)


def collect_missing_vars(sources, vars_):
    """Map each {{.var}} name referenced by the source .md files but absent from
    the merged config to the files that reference it. A missing key must HALT:
    missingkey=zero rendering would bake a corrupted workflow (empty paths,
    blank language lines) with no failure signal."""
    missing = {}
    for fname, content in sources:
        for name in re.findall(r"\{\{\.(\w+)\}\}", content):
            if name not in vars_:
                files = missing.setdefault(name, [])
                if fname not in files:
                    files.append(fname)
    return missing


def _scalar_str(value):
    """Stringify a scalar for inline rendering: booleans lowercase (matching
    BMad config conventions), None as empty, everything else via str()."""
    if value is None:
        return ""
    if isinstance(value, bool):
        return "true" if value else "false"
    return str(value)


# [workflow] keys holding review layers ([[workflow.review_layers]] tables with
# id/name/instruction/when fields). This renderer knows this skill's
# customization schema outright — layer semantics are materialized here, not
# interpreted by the LLM at run time.
_REVIEW_LAYER_KEYS = ("review_layers", "oneshot_review_layers")


def _render_review_layers(layers):
    """Materialize review layers into direct invocation blocks. A layer with an
    empty or missing instruction is disabled (that is how an override turns off
    a default layer) and drops out entirely. A `when` condition is the one part
    that stays with the LLM: it renders as a run-time guard line. No active
    layers renders as the HALT instruction the workflow would otherwise have to
    derive from an empty list."""
    active = [
        layer
        for layer in layers
        if isinstance(layer, dict) and _scalar_str(layer.get("instruction")).strip()
    ]
    if not active:
        return (
            "No review layers are active. HALT with status `blocked` and "
            "blocking condition `no active review layers`."
        )
    blocks = []
    for layer in active:
        title = (
            _scalar_str(layer.get("name")).strip()
            or _scalar_str(layer.get("id")).strip()
            or "Review layer"
        )
        lines = [f"#### {title}", ""]
        when = _scalar_str(layer.get("when")).strip()
        if when:
            lines.append(
                "Run this layer only if the following holds in the "
                f"current context: `{when}`"
            )
            lines.append("")
        lines.append(_scalar_str(layer.get("instruction")).strip("\n"))
        blocks.append("\n".join(lines))
    return "\n\n".join(blocks)


def _render_workflow_value(key, value):
    """Format a resolved [workflow] value for inline substitution. Review-layer
    keys materialize as invocation blocks; other lists render as markdown
    bullets (empty -> '_None._'); scalars render verbatim. Each list item uses
    the same scalar formatting so booleans stay consistent. Entries are emitted
    as-is so runtime placeholders like {project-root} or {diff_output} survive
    for the LLM to resolve."""
    if key in _REVIEW_LAYER_KEYS and isinstance(value, list):
        return _render_review_layers(value)
    if isinstance(value, list):
        if not value:
            return "_None._"
        return "\n".join(f"- {_scalar_str(item)}" for item in value)
    return _scalar_str(value)


def render_workflow(content, workflow):
    """Resolve {workflow.<key>} placeholders from the resolved [workflow] block.
    Unknown keys emit an empty string (missingkey=zero, matching render_template).
    Distinct regex from render_template so single-curly runtime placeholders
    elsewhere are untouched."""
    return re.sub(
        r"\{workflow\.(\w+)\}",
        lambda m: _render_workflow_value(m.group(1), workflow.get(m.group(1))),
        content,
    )


def main():
    script_dir = os.path.dirname(os.path.abspath(__file__))
    skill_name = os.path.basename(script_dir)
    root = find_project_root()
    root = root.replace(os.sep, "/")

    vars_ = flatten_central_config(load_central_config(root))

    for key in list(vars_.keys()):
        vars_[key] = vars_[key].replace("{project-root}", root)

    vars_["project_root"] = root

    # Guarded ahead of the general missing-vars scan: sprint_status and
    # deferred_work_file derive from it below, and unlike the scan (absent
    # keys only) this also HALTs on a present-but-empty value.
    implementation_artifacts = vars_.get("implementation_artifacts", "").strip()
    if not implementation_artifacts:
        print(
            "HALT and report to the user: config is missing `implementation_artifacts` "
            "(expected under [core] or [modules.bmm] in _bmad/config.toml)"
        )
        sys.exit(1)

    vars_["sprint_status"] = posixpath.join(
        implementation_artifacts, "sprint-status.yaml"
    )
    vars_["deferred_work_file"] = posixpath.join(
        implementation_artifacts, "deferred-work.md"
    )

    sources = []
    for fname in sorted(os.listdir(script_dir)):
        if not fname.endswith(".md") or fname == "SKILL.md":
            continue
        with open(
            posixpath.join(script_dir, fname), "r", encoding="utf-8", newline=""
        ) as fh:
            sources.append((fname, fh.read()))

    missing = collect_missing_vars(sources, vars_)
    if missing:
        details = "; ".join(
            f"`{name}` (referenced by {', '.join(files)})"
            for name, files in sorted(missing.items())
        )
        print(
            f"HALT and report to the user: config is missing {details} "
            "(expected under [core] or [modules.bmm] in _bmad/config.toml)"
        )
        sys.exit(1)

    workflow = resolve_workflow(root, script_dir.replace(os.sep, "/"), skill_name)

    out_dir = posixpath.join(root, "_bmad", "render", skill_name)
    os.makedirs(out_dir, exist_ok=True)

    for fname in os.listdir(out_dir):
        if fname.endswith(".md"):
            os.remove(posixpath.join(out_dir, fname))

    for fname, content in sources:
        dst = posixpath.join(out_dir, fname)
        with open(dst, "w", encoding="utf-8", newline="") as fh:
            fh.write(render_workflow(render_template(content, vars_), workflow))

    workflow_md = posixpath.join(out_dir, "workflow.md")
    print(f"read and follow {workflow_md}")


if __name__ == "__main__":
    main()
