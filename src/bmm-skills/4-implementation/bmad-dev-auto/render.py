#!/usr/bin/env python3
# /// script
# requires-python = ">=3.11"
# ///
"""render.py — bmad-dev-auto template renderer.

Resolves compile-time {{.variable}} placeholders from BMad's central config,
bakes absolute paths for {project-root} into derived values, resolves and
inlines the skill's [workflow] customization block, rewrites ./<sibling>.md
cross-references to their absolute publish paths, and writes rendered .md
files to {project-root}/_bmad/render/bmad-dev-auto/.

Config: four-layer merge of _bmad/config.toml + config.user.toml +
custom/config.toml + custom/config.user.toml (post-#2285 installs).
Keys surface from [core] and [modules.bmm]. Missing or unparseable
config.toml → HALT. A {{.var}} referenced by this skill's .md sources but
absent from the merged config, present with an empty value, or present
with a non-string type → HALT (never a silent empty or garbage
substitution). Optional layers may be missing, but one that exists and
cannot be parsed or read → HALT.

Customization: three-layer merge of {skill}/customize.toml +
_bmad/custom/bmad-dev-auto.toml + .user.toml (same structural rules as
resolve_customization.py). The resolved [workflow] values fill {workflow.*}
placeholders, so this skill needs no runtime resolve_customization.py call.
Other single-curly placeholders ({project-root}, {spec_file}, {skill-root},
...) pass through untouched for the LLM to resolve during workflow execution.

Every invocation rebuilds from scratch and republishes atomically: rendering
is deterministic (same _bmad config + same skill source -> same output), so
the result is staged in a sibling temp dir and swapped into place only if it
differs from what's already published — a no-op the vast majority of the
time. This keeps concurrent renderers (parallel agents, or worktrees sharing
one _bmad/ via symlink) from tearing each other's output: readers only ever
see a fully-old or fully-new publish, never a half-written one. See
_publish_atomically for the swap and its handling of the residual race.
Python 3.11+ stdlib only. UTF-8 I/O.
"""

import os
import posixpath
import re
import shutil
import sys
import tempfile
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
    the full keyed-merge semantics of resolve_config.py — dev-auto only reads
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
    module buckets, so collisions shouldn't happen in practice). Also returns
    the keys present with non-scalar values (arrays, tables, dates), so the
    missing-vars HALT can name the actual problem instead of claiming a key
    the user can see in their config is absent."""
    flat = {}
    unsupported = {}
    modules = merged.get("modules")
    modules = modules if isinstance(modules, dict) else {}
    for section in (merged.get("core"), modules.get("bmm")):
        if not isinstance(section, dict):
            continue
        for key, value in section.items():
            if isinstance(value, bool):
                flat[key] = "true" if value else "false"
                unsupported.pop(key, None)
            elif isinstance(value, (str, int, float)):
                flat[key] = str(value)
                unsupported.pop(key, None)
            else:
                unsupported[key] = type(value).__name__
                flat.pop(key, None)
    return flat, unsupported


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


def collect_empty_vars(sources, vars_):
    """Map each {{.var}} referenced by the source .md files whose merged-config
    value is present but empty/whitespace to the files that reference it. Every
    referenced key names something the workflow cannot function without (paths,
    languages), so an empty value is always a config mistake — HALT rather than
    bake blank prose into the rendered workflow."""
    empty = {}
    for fname, content in sources:
        for name in re.findall(r"\{\{\.(\w+)\}\}", content):
            if name in vars_ and not vars_[name].strip():
                files = empty.setdefault(name, [])
                if fname not in files:
                    files.append(fname)
    return empty


def collect_missing_workflow_keys(sources, workflow):
    """Map each {workflow.<key>} name referenced by the source .md files but
    absent from the resolved [workflow] block to the files that reference it.
    A missing key must HALT: missingkey=zero rendering would bake an empty
    handoff or review block into the workflow with no failure signal. Every
    legitimate key ships in this skill's customize.toml defaults, so a miss
    is always an authoring error (typo) or a broken install."""
    missing = {}
    for fname, content in sources:
        for name in re.findall(r"\{workflow\.(\w+)\}", content):
            if name not in workflow:
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


def _is_scalar(value):
    """True for values _scalar_str can render faithfully. Anything else (a
    table, an array, a date) would bake its Python repr into the rendered
    workflow — main() HALTs on those instead."""
    return value is None or isinstance(value, (bool, str, int, float))


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
    Unknown keys emit an empty string, but main() HALTs on any missing key
    before rendering starts (collect_missing_workflow_keys), so this fallback
    never fires in practice — matching render_template. Distinct regex from
    render_template so single-curly runtime placeholders elsewhere are
    untouched."""
    return re.sub(
        r"\{workflow\.(\w+)\}",
        lambda m: _render_workflow_value(m.group(1), workflow.get(m.group(1))),
        content,
    )


def _absolutize_sibling_refs(content, out_dir, filenames):
    """Rewrite ./<name>.md cross-references to their canonical absolute path
    in the publish directory. Only rendered siblings are rewritten; any other
    relative .md mention passes through untouched. The executor then never
    resolves a relative path — every cross-file reference is absolute:
    readable, or loudly missing. Never a silent hit on the unrendered
    sources in the skill directory."""
    rendered = set(filenames)
    return re.sub(
        r"\./([\w-]+\.md)",
        lambda m: (
            posixpath.join(out_dir, m.group(1))
            if m.group(1) in rendered
            else m.group(0)
        ),
        content,
    )


def _same_rendered_content(existing_dir, staging_dir, filenames):
    """True if existing_dir already holds exactly filenames with byte-identical
    content to staging_dir. Missing/unreadable existing_dir, or any mismatch,
    means "not the same" — always err toward publishing."""
    if not os.path.isdir(existing_dir):
        return False
    try:
        existing_names = {f for f in os.listdir(existing_dir) if f.endswith(".md")}
    except OSError:
        return False
    if existing_names != set(filenames):
        return False
    for fname in filenames:
        try:
            with open(posixpath.join(existing_dir, fname), "rb") as a, open(
                posixpath.join(staging_dir, fname), "rb"
            ) as b:
                if a.read() != b.read():
                    return False
        except OSError:
            return False
    return True


def _publish_atomically(out_dir, staging_dir, filenames):
    """Swap staging_dir into place at out_dir via same-directory renames,
    which are atomic on a given filesystem — readers of out_dir see either the
    fully-old or fully-new publish, never a half-written one. staging_dir
    lives alongside out_dir (same parent), so both renames stay on the same
    filesystem.

    Returns None on success, or the OSError when the swap failed and out_dir
    does not hold the intended content. Concurrent renderers can race here:
    rendering is deterministic, so a lost race whose winner already published
    byte-identical content is success. Every other failure is returned for
    main() to HALT on — fail early with the real error rather than dispatch
    a render known to be stale. Best effort on the way out: the last-good
    render is restored for the next run when possible."""
    trash_dir = staging_dir + ".prev"
    moved_old = False
    swap_error = None
    if os.path.isdir(out_dir):
        try:
            os.rename(out_dir, trash_dir)
            moved_old = True
        except OSError as error:
            swap_error = error
    if swap_error is None:
        try:
            os.rename(staging_dir, out_dir)
        except OSError as error:
            swap_error = error
    if swap_error is None:
        if moved_old:
            shutil.rmtree(trash_dir, ignore_errors=True)
        return None
    if _same_rendered_content(out_dir, staging_dir, filenames):
        # Lost the deterministic race: a concurrent renderer already
        # published equivalent content — this run's copy is redundant.
        shutil.rmtree(staging_dir, ignore_errors=True)
        if moved_old:
            shutil.rmtree(trash_dir, ignore_errors=True)
        return None
    shutil.rmtree(staging_dir, ignore_errors=True)
    if moved_old and not os.path.isdir(out_dir):
        # Nobody published. Restore the previous render rather than leaving
        # nothing — the next run may succeed where this one could not.
        try:
            os.rename(trash_dir, out_dir)
        except OSError:
            pass
    return swap_error


def main():
    script_dir = os.path.dirname(os.path.abspath(__file__))
    skill_name = os.path.basename(script_dir)
    root = find_project_root()
    root = root.replace(os.sep, "/")

    vars_, unsupported = flatten_central_config(load_central_config(root))

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
    try:
        listing = sorted(os.listdir(script_dir))
    except OSError as error:
        print(
            f"HALT and report to the user: failed to list skill sources in {script_dir}: {error}"
        )
        sys.exit(1)
    for fname in listing:
        if not fname.endswith(".md") or fname == "SKILL.md":
            continue
        try:
            with open(
                posixpath.join(script_dir, fname), "r", encoding="utf-8", newline=""
            ) as fh:
                sources.append((fname, fh.read()))
        except (OSError, UnicodeDecodeError) as error:
            print(
                f"HALT and report to the user: failed to read skill source {fname}: {error}"
            )
            sys.exit(1)

    missing = collect_missing_vars(sources, vars_)
    if missing:
        absent = "; ".join(
            f"`{name}` (referenced by {', '.join(files)})"
            for name, files in sorted(missing.items())
            if name not in unsupported
        )
        typed = "; ".join(
            f"`{name}` has unsupported type {unsupported[name]} — expected a string "
            f"(referenced by {', '.join(files)})"
            for name, files in sorted(missing.items())
            if name in unsupported
        )
        parts = []
        if absent:
            parts.append(f"config is missing {absent}")
        if typed:
            parts.append(f"config value for {typed}")
        print(
            f"HALT and report to the user: {'; '.join(parts)} "
            "(expected under [core] or [modules.bmm] in _bmad/config.toml)"
        )
        sys.exit(1)

    empty = collect_empty_vars(sources, vars_)
    if empty:
        details = "; ".join(
            f"`{name}` (referenced by {', '.join(files)})"
            for name, files in sorted(empty.items())
        )
        print(
            f"HALT and report to the user: config value is empty for {details} "
            "— set a non-empty value under [core] or [modules.bmm] in _bmad/config.toml"
        )
        sys.exit(1)

    workflow = resolve_workflow(root, script_dir.replace(os.sep, "/"), skill_name)

    missing_workflow = collect_missing_workflow_keys(sources, workflow)
    if missing_workflow:
        details = "; ".join(
            f"`workflow.{name}` (referenced by {', '.join(files)})"
            for name, files in sorted(missing_workflow.items())
        )
        print(
            f"HALT and report to the user: [workflow] customization is missing {details} "
            f"(expected in {skill_name}/customize.toml or its overrides under _bmad/custom/)"
        )
        sys.exit(1)

    for key in _REVIEW_LAYER_KEYS:
        value = workflow.get(key)
        if value is None:
            continue
        if not isinstance(value, list):
            print(
                f"HALT and report to the user: [workflow] customization key `{key}` "
                f"must be an array of [[workflow.{key}]] tables, got {type(value).__name__} — "
                f"check {skill_name}/customize.toml and its overrides under _bmad/custom/"
            )
            sys.exit(1)
        for layer in value:
            fields = ("id", "name", "when", "instruction")
            if not isinstance(layer, dict) or not all(
                _is_scalar(layer.get(field)) for field in fields
            ):
                print(
                    f"HALT and report to the user: [workflow] customization key `{key}` "
                    f"entries must be [[workflow.{key}]] tables with scalar "
                    f"id/name/when/instruction fields — "
                    f"check {skill_name}/customize.toml and its overrides under _bmad/custom/"
                )
                sys.exit(1)

    referenced_workflow_keys = set()
    for _, content in sources:
        referenced_workflow_keys.update(re.findall(r"\{workflow\.(\w+)\}", content))
    for name in sorted(referenced_workflow_keys):
        if name in _REVIEW_LAYER_KEYS:
            continue
        value = workflow.get(name)
        valid = _is_scalar(value) or (
            isinstance(value, list) and all(_is_scalar(item) for item in value)
        )
        if not valid:
            print(
                f"HALT and report to the user: [workflow] customization key `{name}` "
                f"must be a scalar or an array of scalars, got {type(value).__name__} — "
                f"check {skill_name}/customize.toml and its overrides under _bmad/custom/"
            )
            sys.exit(1)

    render_root = posixpath.join(root, "_bmad", "render")
    out_dir = posixpath.join(render_root, skill_name)

    filenames = [fname for fname, _ in sources]
    try:
        os.makedirs(render_root, exist_ok=True)
        staging_dir = tempfile.mkdtemp(prefix=f"{skill_name}.", dir=render_root)
    except OSError as error:
        print(
            f"HALT and report to the user: failed to create a staging directory in {render_root}: {error}"
        )
        sys.exit(1)
    publish_error = None
    try:
        for fname, content in sources:
            dst = posixpath.join(staging_dir, fname)
            rendered = render_workflow(render_template(content, vars_), workflow)
            with open(dst, "w", encoding="utf-8", newline="") as fh:
                fh.write(_absolutize_sibling_refs(rendered, out_dir, filenames))

        if _same_rendered_content(out_dir, staging_dir, filenames):
            shutil.rmtree(staging_dir, ignore_errors=True)
        else:
            publish_error = _publish_atomically(out_dir, staging_dir, filenames)
    except OSError as error:
        shutil.rmtree(staging_dir, ignore_errors=True)
        print(
            f"HALT and report to the user: failed to write the staged render: {error}"
        )
        sys.exit(1)
    except BaseException:
        shutil.rmtree(staging_dir, ignore_errors=True)
        raise
    if publish_error is not None:
        print(
            "HALT and report to the user: render publish failed — could not swap "
            f"the staged render into {out_dir}: {publish_error}"
        )
        sys.exit(1)

    workflow_md = posixpath.join(out_dir, "workflow.md")
    if not os.path.isfile(workflow_md):
        print(
            f"HALT and report to the user: render publish failed — {workflow_md} does not exist"
        )
        sys.exit(1)
    print(f"read and follow {workflow_md}")


if __name__ == "__main__":
    main()
