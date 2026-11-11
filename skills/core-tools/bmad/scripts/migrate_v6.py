#!/usr/bin/env python3
# /// script
# requires-python = ">=3.11"
# ///
"""Report or remove the v6 traces in `_bmad/` that v7 does not read, or fold pre-release spec folders.

With no flag it lists the traces: the classic installer's files, the v6 install answers
v7 has no key for, the customization keys of retired skills, and customizations of
skills that are not installed. With `--clean` it copies `_bmad/` to
`.v6-v7-migration-backup-<datetime>/`, which the method migration reuses, then removes them.

With `--fold-specs <root>` it folds every 6.13 pre-release spec folder (`spec-<name>/` holding
`spec-<name>.md`) under the output folder into the ticket that holds it, or into a new `backlog/` story when the folder
sits at the root; the method migration's guide says when to run it.

Usage:
  uv run migrate_v6.py --project-root P --skill <the bmad skill> [--root R ...] [--clean]
  uv run migrate_v6.py --project-root P --skill <the bmad skill> --fold-specs <output folder>
"""

from __future__ import annotations

import argparse
import datetime
import importlib.util
import os
import re
import shutil
import sys
import tomllib
from pathlib import Path, PurePosixPath

sys.dont_write_bytecode = True


def _load_setup():
    spec = importlib.util.spec_from_file_location("bmad_setup", Path(__file__).with_name("setup.py"))
    module = importlib.util.module_from_spec(spec)
    assert spec.loader is not None
    spec.loader.exec_module(module)
    return module


_setup = _load_setup()
Installation = _setup.Installation
Retirement = _setup.Retirement
TABLE_HEADER = _setup.TABLE_HEADER
TEAM_CONFIG = _setup.TEAM_CONFIG
USER_CONFIG = _setup.USER_CONFIG
_MISSING = _setup._MISSING
discover_installation = _setup.discover_installation
header_path = _setup.header_path
lookup = _setup.lookup
present = _setup.present
reject_unusable_bmad = _setup.reject_unusable_bmad
render_toml = _setup.render_toml
retired_skills = _setup.retired_skills
retirement_report = _setup.retirement_report
write_text = _setup.write_text

# Traces the classic installer leaves under _bmad.
LEGACY_LEFTOVERS = (
    "_config/manifest.yaml",
    "_config/files-manifest.csv",
    "_config/skill-manifest.csv",
    "_config/bmad-help.csv",
    "config.user.toml",
    "core/config.yaml",
    "core/module-help.csv",
    "core/v6-shims",
    "bmm/config.yaml",
    "bmm/module-help.csv",
    "bmm/v6-shims",
)
# The v6.12 install answers v7 has no key for. Only these are removed, so a key added later is never touched.
V6_KEYS = (
    ("core", "user_name"),
    ("core", "communication_language"),
    ("core", "document_output_language"),
    ("modules", "bmm", "user_skill_level"),
    ("modules", "bmm", "planning_artifacts"),
    ("modules", "bmm", "implementation_artifacts"),
    ("modules", "bmm", "project_knowledge"),
)
CENTRAL_CONFIGS = (TEAM_CONFIG, "_bmad/custom/config.toml", USER_CONFIG)
BACKUP_PREFIX = ".v6-v7-migration-backup-"
# `[workflow]` keys the retired spec and ticket skills read that the agent they retired into does not. Only
# these are removed from that skill's `_bmad/custom/` files, and the note names what replaced them.
RETIRED_CUSTOM_KEYS = {
    "bmad-agent-po": (
        "initiative_template",
        "epic_template",
        "story_template",
        "spec_template",
        "spec_output_path",
        "run_folder_pattern",
        "on_complete",
    ),
}
RETIRED_CUSTOM_NOTE = (
    "{file}: {keys} are keys of retired skills and were dropped; bmad-agent-po reads ticket_template, "
    "the one template for an initiative, epic or story, and <capability>_after (spec_after, tickets_after, ...) "
    "in place of on_complete."
)
# `[workflow]` keys of the retired skills that the agent reads under `[agent]`; they move there, values kept.
MOVED_CUSTOM_KEYS = {
    "bmad-agent-po": ("activation_steps_prepend", "activation_steps_append", "persistent_facts"),
}
MOVED_CUSTOM_NOTE = "{file}: {keys} moved from [workflow] to [agent], where bmad-agent-po reads them."


def legacy_leftovers(project_root: Path) -> list[str]:
    bmad = project_root / "_bmad"
    return [
        relative
        for relative in LEGACY_LEFTOVERS
        if (path := bmad.joinpath(*PurePosixPath(relative).parts)).exists() and inside_bmad(path, project_root)
    ]


def inside_bmad(path: Path, project_root: Path) -> bool:
    """A link along the way could point a cleanup outside the project; such a path is not cleaned."""
    return path.resolve().is_relative_to((project_root / "_bmad").resolve())


def stale_config_keys(project_root: Path) -> list[tuple[str, tuple[str, ...]]]:
    """The V6_KEYS set in the central config files."""
    stale: list[tuple[str, tuple[str, ...]]] = []
    for relative in CENTRAL_CONFIGS:
        path = project_root / relative
        if path.is_symlink() or not path.is_file() or not inside_bmad(path, project_root):
            continue
        try:
            data = tomllib.loads(path.read_text(encoding="utf-8"))
        except (OSError, UnicodeError, tomllib.TOMLDecodeError):
            continue
        stale += [(relative, key) for key in V6_KEYS if lookup(data, key) is not _MISSING]
    return stale


def stale_custom_keys(project_root: Path, retirement: Retirement) -> list[tuple[str, tuple[str, ...]]]:
    """The RETIRED_CUSTOM_KEYS and MOVED_CUSTOM_KEYS set in a skill's `_bmad/custom/` files, a retired name's file
    carried over included."""
    custom = project_root / "_bmad" / "custom"
    stale: list[tuple[str, tuple[str, ...]]] = []
    for skill in dict.fromkeys((*RETIRED_CUSTOM_KEYS, *MOVED_CUSTOM_KEYS)):
        keys = (*RETIRED_CUSTOM_KEYS.get(skill, ()), *MOVED_CUSTOM_KEYS.get(skill, ()))
        names = [f"{skill}.toml", f"{skill}.user.toml"]
        names += [old for old, new in (*retirement.renames, *retirement.unmoved) if new.split(".")[0] == skill]
        for name in dict.fromkeys(names):
            path = custom / name
            if path.is_symlink() or not path.is_file() or not inside_bmad(path, project_root):
                continue
            try:
                data = tomllib.loads(path.read_text(encoding="utf-8"))
            except (OSError, UnicodeError, tomllib.TOMLDecodeError):
                continue
            stale += [
                (f"_bmad/custom/{name}", ("workflow", key))
                for key in keys
                if lookup(data, ("workflow", key)) is not _MISSING
            ]
    return stale


def is_moved(key: tuple[str, ...]) -> bool:
    return any(key[-1] in keys for keys in MOVED_CUSTOM_KEYS.values())


def custom_key_notes(stale: list[tuple[str, tuple[str, ...]]]) -> list[str]:
    """Per file in a `stale_custom_keys` result, a note on the keys dropped and one on the keys moved."""
    notes: list[str] = []
    for file in dict.fromkeys(file for file, _key in stale):
        for note, moved in ((RETIRED_CUSTOM_NOTE, False), (MOVED_CUSTOM_NOTE, True)):
            keys = [key[-1] for f, key in stale if f == file and is_moved(key) == moved]
            if keys:
                notes.append(note.format(file=file, keys=", ".join(keys)))
    return notes


def unused_customizations(project_root: Path, installation: Installation, retirement: Retirement) -> list[str]:
    """`_bmad/custom/` files of skills that are not installed. Files setup is about to rename are not unused."""
    custom = project_root / "_bmad" / "custom"
    if custom.is_symlink() or not custom.is_dir():
        return []
    moving = {old for old, _new in (*retirement.renames, *retirement.unmoved)}
    unused: list[str] = []
    for path in sorted(custom.iterdir(), key=lambda entry: entry.name):
        name = path.name
        stem = name.removesuffix(".toml").removesuffix(".user")
        if not name.startswith("bmad-") or not name.endswith(".toml") or name in moving:
            continue
        if stem not in installation.folders:
            unused.append(name)
    return unused


def traces_json(project_root: Path, installation: Installation, retirement: Retirement) -> dict[str, object]:
    custom_keys = stale_custom_keys(project_root, retirement)
    return {
        "legacy_leftovers": legacy_leftovers(project_root),
        "stale_config_keys": [
            {"file": relative, "key": ".".join(path)}
            for relative, path in (*stale_config_keys(project_root), *custom_keys)
        ],
        "unused_customizations": [
            f"_bmad/custom/{name}" for name in unused_customizations(project_root, installation, retirement)
        ],
        "notes": custom_key_notes(custom_keys),
    }


def clean(project_root: Path, skill_root: Path, *, roots: tuple[Path, ...] = ()) -> dict[str, object]:
    """Back up `_bmad/`, then remove the v6 traces v7 does not read: the classic installer's files, v6
    config keys, and customizations of skills that are not installed."""
    reject_unusable_bmad(project_root)
    bmad = project_root / "_bmad"
    installation = discover_installation(skill_root, roots)
    if installation.missing_records:
        # Without every module record, a renamed skill's customizations would look unused.
        raise Exception("a module record is missing; run setup to repair the installation before cleaning up")
    retirement = retirement_report(
        project_root, skill_root, installation, retired_skills(installation.modules, installation.modules)
    )
    leftovers = legacy_leftovers(project_root)
    custom_keys = stale_custom_keys(project_root, retirement)
    stale = [*stale_config_keys(project_root), *custom_keys]
    unused = unused_customizations(project_root, installation, retirement)
    moved = [(file, key) for file, key in custom_keys if is_moved(key)]
    removed = [(file, key) for file, key in stale if (file, key) not in moved]
    edits = {
        relative: text_without_keys(
            (project_root / relative).read_text(encoding="utf-8"),
            [key for file, key in removed if file == relative],
            [key for file, key in moved if file == relative],
        )
        for relative in dict.fromkeys(file for file, _path in stale)
    }
    report: dict[str, object] = {
        "mode": "clean",
        "backup": None,
        "removed_files": [],
        "removed_keys": [],
        "moved_keys": [],
        "removed_customizations": [],
        "notes": [],
    }
    if not (leftovers or stale or unused):
        return report
    backup = backup_bmad(project_root)
    report["backup"] = backup.relative_to(project_root).as_posix()
    for relative in leftovers:
        path = bmad.joinpath(*PurePosixPath(relative).parts)
        if path.is_dir() and not path.is_symlink():
            shutil.rmtree(path)
        else:
            path.unlink()
        prune_empty_parents(path.parent, bmad)
    for relative, text in edits.items():
        write_text(project_root / relative, text)
    for name in unused:
        (bmad / "custom" / name).unlink()
    report["removed_files"] = [f"_bmad/{relative}" for relative in leftovers]
    report["removed_keys"] = [{"file": relative, "key": ".".join(path)} for relative, path in removed]
    report["moved_keys"] = [
        {"file": relative, "key": ".".join(path), "to": f"agent.{path[-1]}"} for relative, path in moved
    ]
    report["removed_customizations"] = [f"_bmad/custom/{name}" for name in unused]
    report["notes"] = custom_key_notes(custom_keys)
    return report


def backup_bmad(project_root: Path) -> Path:
    """Copy `_bmad/` into a new `.v6-v7-migration-backup-<datetime>/`, which the method migration reuses.
    Its `.gitignore` keeps the copy, personal settings included, out of every commit."""
    now = datetime.datetime.now()
    backup = project_root / f"{BACKUP_PREFIX}{now:%Y%m%d-%H%M}"
    if present(backup):
        backup = project_root / f"{BACKUP_PREFIX}{now:%Y%m%d-%H%M%S}"
    shutil.copytree(project_root / "_bmad", backup / "_bmad", symlinks=True)
    write_text(backup / ".gitignore", "*")
    return backup


def prune_empty_parents(folder: Path, stop: Path) -> None:
    while folder != stop and folder.is_dir() and not folder.is_symlink() and not any(folder.iterdir()):
        folder.rmdir()
        folder = folder.parent


def text_without_keys(text: str, paths: list[tuple[str, ...]], moves: list[tuple[str, ...]] = ()) -> str:
    """The file's text with these keys removed, and `moves` moved to the same key under `[agent]` (a list joined
    after one already there), so comments and layout survive.

    A key written on one line in its table's section is cut by text, and a table left
    empty loses its header. When the result does not parse to the expected values,
    the whole file is rendered instead.
    """
    original = tomllib.loads(text)
    expected = tomllib.loads(text)
    moved = {path[-1]: value for path in moves if (value := lookup(original, path)) is not _MISSING}
    for path in (*paths, *moves):
        drop_path(expected, path)
    if moved:
        agent = expected.setdefault("agent", {})
        for leaf, value in moved.items():
            current = agent.get(leaf)
            if current is None:
                agent[leaf] = value
            elif isinstance(current, list) and isinstance(value, list):
                agent[leaf] = current + value
    lines = text.split("\n")
    for path in (*paths, *moves):
        lines = lines_without_key(lines, path[:-1], path[-1])
    headers = [index for index, line in enumerate(lines) if TABLE_HEADER.match(line)]
    emptied = {
        index
        for position, index in enumerate(headers)
        if (name := header_path(lines[index])) is not None
        and lookup(expected, name) is _MISSING
        and not any(
            line.strip() and not line.lstrip().startswith("#")
            for line in lines[index + 1 : headers[position + 1] if position + 1 < len(headers) else len(lines)]
        )
    }
    candidate = "\n".join(line for index, line in enumerate(lines) if index not in emptied)
    if moved and "agent" not in original:
        candidate = candidate.rstrip("\n") + "\n\n" + render_toml({"agent": moved})
    try:
        if tomllib.loads(candidate) == expected:
            return candidate
    except tomllib.TOMLDecodeError:
        pass
    return render_toml(expected)


def drop_path(data: dict, path: tuple[str, ...]) -> None:
    """Delete the key at path, then any table the deletion left empty."""
    parents = [data]
    for part in path[:-1]:
        child = parents[-1].get(part)
        if not isinstance(child, dict):
            return
        parents.append(child)
    parents[-1].pop(path[-1], None)
    for depth in range(len(path) - 1, 0, -1):
        if parents[depth]:
            break
        parents[depth - 1].pop(path[depth - 1], None)


def lines_without_key(lines: list[str], table: tuple[str, ...], leaf: str) -> list[str]:
    start, end = 0, len(lines)
    if table:
        headers = [(index, header_path(line)) for index, line in enumerate(lines) if TABLE_HEADER.match(line)]
        for position, (index, name) in enumerate(headers):
            if name == table:
                start = index + 1
                end = headers[position + 1][0] if position + 1 < len(headers) else len(lines)
                break
        else:
            return lines
    else:
        end = next((index for index, line in enumerate(lines) if TABLE_HEADER.match(line)), len(lines))
    key = re.compile(rf"\s*(?:{re.escape(leaf)}|\"{re.escape(leaf)}\"|'{re.escape(leaf)}')\s*=")
    for index in range(start, end):
        if not key.match(lines[index]):
            continue
        # A multi-line value ends at the first line after which the file parses again.
        for stop in range(index + 1, end + 1):
            remaining = [*lines[:index], *lines[stop:]]
            try:
                tomllib.loads("\n".join(remaining))
            except tomllib.TOMLDecodeError:
                continue
            return remaining
        return lines
    return lines


# --- Pre-release spec folders ---------------------------------------------------------------------------------
# A 6.13 pre-release `spec-<name>/` holds `spec-<name>.md` (frontmatter lists `companions` and `sources`, sections Why,
# Capabilities with `CAP-<n>` ids, Constraints, Non-goals, Success signal, Assumptions, Open Questions), `.memlog.md`
# and companions. The ticket file is the spec now, so the folder folds into the ticket that holds it.

MEMLOG = ".memlog.md"
SPEC_FOLDER = re.compile(r"\Aspec-(?P<slug>[A-Za-z0-9][A-Za-z0-9._-]*)\Z")
CAP_ID = re.compile(r"\bCAP-(\d+)\b")
R_LINE = re.compile(r"^\s*-\s+R(\d+)\b", re.MULTILINE)
R_SOURCE = re.compile(r"^- R\d+ \((.*?)\)", re.MULTILINE)
CAPABILITY = re.compile(r"\A-\s+\*\*(CAP-(\d+))\*\*\s*(.*)\Z")
CAPABILITY_FIELD = re.compile(r"\A\s+-\s+\*\*(intent|success):\*\*\s*(.*)\Z")
HEADING = re.compile(r"(?m)^## (.+?)\s*$")
SECTION_ORDER = (
    "Description",
    "Outcome",
    "Requirements",
    "Constraints",
    "Done when",
    "Boundaries",
    "References",
    "Notes",
)
UNTOUCHED_FOLDERS = ("archive", "archive-v6")
COMPANION_TYPES = {"DESIGN.md": "design", "EXPERIENCE.md": "experience", "ARCHITECTURE-SPINE.md": "architecture"}
TEXT_SUFFIXES = (".md", ".toml")


def fold_specs(project_root: Path, store: Path) -> dict[str, object]:
    """Fold every pre-release spec folder under `store` into its ticket, parents before children."""
    if not store.is_dir():
        raise Exception(f"{store} is not a folder")
    report: dict[str, object] = {"mode": "fold-specs", "folded": [], "problems": []}
    for folder in spec_folders(store):
        try:
            report["folded"].append(fold_spec(project_root, store, folder))
        except FoldProblem as problem:
            report["problems"].append({"spec": relative(folder, project_root), "problem": str(problem)})
    return report


class FoldProblem(Exception):
    pass


def spec_folders(store: Path) -> list[Path]:
    found: list[Path] = []
    for current, dirs, _files in os.walk(store):
        dirs[:] = sorted(d for d in dirs if not d.startswith(".") and d not in UNTOUCHED_FOLDERS)
        for name in dirs:
            if SPEC_FOLDER.match(name) and (Path(current) / name / f"{name}.md").is_file():
                found.append(Path(current) / name)
    return sorted(found, key=lambda path: (len(path.parts), path.as_posix()))


def relative(path: Path, root: Path) -> str:
    """From the root, or absolute for a store outside it."""
    return path.relative_to(root).as_posix() if path.is_relative_to(root) else path.as_posix()


def fold_spec(project_root: Path, store: Path, folder: Path) -> dict[str, object]:
    slug = SPEC_FOLDER.match(folder.name)["slug"]
    spec = parse_spec(read_for_fold(folder / f"{folder.name}.md", project_root))
    loose = folder.parent == store
    if loose:
        home = store / "backlog"
        ticket = home / f"story-{slug}.md"
        if ticket.exists():
            raise FoldProblem(f"{relative(ticket, project_root)} already exists")
    else:
        home = folder.parent
        ticket = home / f"{home.name}.md"
        if not ticket.is_file():
            raise FoldProblem("not inside a ticket folder (one holding a same-named .md) and not at the root")
    moving = [
        path
        for path in sorted(folder.iterdir(), key=lambda p: p.name)
        if path.name not in (f"{folder.name}.md", MEMLOG)
        and not path.name.endswith(".tmp")
        and not path.name.startswith(".")
    ]
    taken = [path.name for path in moving if (home / path.name).exists()]
    if taken:
        raise FoldProblem(f"{', '.join(taken)} already exist(s) beside the ticket")

    existing = read_for_fold(ticket, project_root) if ticket.is_file() else ""
    existing_requirements = section_body(existing, "Requirements")
    offset = max((int(n) for n in R_LINE.findall(existing_requirements)), default=0)
    ids = {f"CAP-{n}": f"R{n + offset}" for n in spec["capabilities"]}

    def map_cap(match: re.Match[str]) -> str:
        return f"R{int(match.group(1)) + offset}"

    def map_caps(text: str) -> str:
        """CAP ids mapped everywhere but inside a Requirements line's parentheses, where they are a folded spec's source ids."""
        out, last = [], 0
        for span in R_SOURCE.finditer(text):
            out += [CAP_ID.sub(map_cap, text[last : span.start()]), span.group(0)]
            last = span.end()
        return "".join(out) + CAP_ID.sub(map_cap, text[last:])

    # Lines the ticket wrote itself stay, less any that name the spec folder, the mapped ones after them; prose that
    # only pointed at the folder is replaced.
    own = "\n".join(line for line in existing_requirements.splitlines() if folder.name not in line)
    own_lines = map_caps(own).strip("\n").splitlines()
    if R_LINE.search(existing_requirements):
        replace_requirements = True
    else:
        own_lines = []
        replace_requirements = not existing_requirements.strip() or folder.name in existing_requirements

    for key in ("constraints", "non_goals", "assumptions", "questions"):
        spec[key] = [CAP_ID.sub(map_cap, line) for line in spec[key]]
    spec["why"] = CAP_ID.sub(map_cap, spec["why"])
    spec["kept"] = [(name, CAP_ID.sub(map_cap, value)) for name, value in spec["kept"]]
    spec["capabilities"] = {n: CAP_ID.sub(map_cap, line) for n, line in spec["capabilities"].items()}

    # References to the folder, wherever they are: `spec-<name>/spec-<name>.md` becomes the ticket, `spec-<name>/x` the
    # moved companion. A suffix rewrite keeps relative and absolute forms right, since the folder's parent is unchanged.
    new_prefix = "backlog/" if loose else ""
    rewrites = [(f"{folder.name}/{folder.name}.md", f"{new_prefix}{ticket.name}")]
    rewrites += [(f"{folder.name}/{path.name}", f"{new_prefix}{path.name}") for path in moving]
    # Every rewrite is read and computed first, so a file that cannot be read stops the fold before anything changes.
    writes: dict[Path, str] = {}
    for path in text_files(store, skip=(folder,)):
        text = read_for_fold(path, project_root)
        changed = text
        for old, new in rewrites:
            changed = rewrite_reference(changed, old, new, path, folder.parent, project_root)
        if changed != text:
            writes[path] = changed
    for path in companion_files(moving):
        text = read_for_fold(path, project_root)
        changed = rebase_links(text, path, folder, home, ticket)
        if changed != text:
            writes[path] = changed
    for path in cap_scope(home, folder, moving) if not loose else companion_files(moving):
        text = writes[path] if path in writes else read_for_fold(path, project_root)
        changed = map_caps(text)
        if changed != text:
            writes[path] = changed
    for path in (home / MEMLOG, folder / MEMLOG):
        if path.is_file():
            read_for_fold(path, project_root)
    for path, text in writes.items():
        path.write_text(text, encoding="utf-8")
    rewritten = [relative(path, project_root) for path in writes]

    references, unresolved = companion_references(spec["companions"], folder, home, project_root, store)
    sources = [rebase(item, folder, home, project_root, store) for item in spec["sources"]]
    companions = [companion_path(item, folder, home, project_root, store) for item in spec["companions"]]
    requirements = own_lines + [f"- {ids[f'CAP-{n}']} (CAP-{n}): {line}" for n, line in spec["capabilities"].items()]
    if loose:
        text = story_text(spec, home, slug, requirements, references, sources, companions)
    else:
        text = folded_ticket_text(
            ticket.read_text(encoding="utf-8"),
            ticket,
            spec,
            requirements,
            references,
            sources,
            companions,
            replace_requirements,
        )
    home.mkdir(parents=True, exist_ok=True)
    write_text(ticket, text)

    memlog = home / MEMLOG
    spec_memlog = folder / MEMLOG
    if spec_memlog.is_file():
        if memlog.is_file():
            append_text(memlog, memlog_body(spec_memlog))
            spec_memlog.unlink()
        else:
            shutil.move(spec_memlog, memlog)
    elif not memlog.is_file():
        write_text(memlog, f"---\ntopic: {spec['title']}\nupdated: {datetime.datetime.now():%Y-%m-%dT%H:%M}\n---\n")
    entries = [f"- (note) {name}, from {folder.name}: {value}" for name, value in spec["kept"]]
    entries.append(
        f"- (event) folded {folder.name}/ into {ticket.name}"
        + ("; " + ", ".join(f"{old} is {new}" for old, new in ids.items()) if ids else "")
    )
    append_text(memlog, "\n".join(entries) + "\n")

    for path in moving:
        shutil.move(path, home / path.name)
    (folder / f"{folder.name}.md").unlink()
    shutil.rmtree(folder)
    return {
        "spec": relative(folder, project_root),
        "ticket": relative(ticket, project_root),
        "ids": ids,
        "companions": [relative(home / path.name, project_root) for path in moving],
        "unresolved": unresolved,
        "memlog": relative(memlog, project_root),
        "rewritten": rewritten,
    }


PATH_DELIMITERS = set(" \t\n()[]<>\"'`,|=:")


def rewrite_reference(text: str, old: str, new: str, file: Path, base: Path, project_root: Path) -> str:
    """`old` replaced by `new` where the path it ends resolves to `base / old`: from the file's folder or one above
    it (the project root among them), from `{project-root}`, or absolute. Another folder's spec of the same name
    keeps its references."""
    target = (base / old).resolve()
    out, last = [], 0
    for match in re.finditer(re.escape(old), text):
        start = match.start()
        while start > 0 and text[start - 1] not in PATH_DELIMITERS:
            start -= 1
        written = text[start : match.end()]
        if written.startswith("{project-root}/"):
            candidates = [project_root / written.removeprefix("{project-root}/")]
        elif written.startswith("/"):
            candidates = [Path(written)]
        else:
            candidates = [above / written for above in (file.parent, *file.parent.parents)]
        if any(candidate.resolve() == target for candidate in candidates):
            out += [text[last : match.start()], new]
            last = match.end()
    return "".join(out) + text[last:]


LINK_TOKEN = re.compile(r"[^\s()\[\]<>\"'`,|=:]+")


def rebase_links(text: str, file: Path, folder: Path, home: Path, ticket: Path) -> str:
    """A companion's links as they read once it moves from the spec folder to `home`: a `./` or `../` path that
    leaves the folder is recomputed from the new place, and a path to the spec itself names the ticket."""
    spec = (folder / f"{folder.name}.md").resolve()
    new_parent = (home / file.relative_to(folder)).parent.resolve()

    def swap(match: re.Match[str]) -> str:
        path, hash_, anchor = match.group(0).partition("#")
        if not path.startswith(("./", "../")) and path != spec.name:
            return match.group(0)
        target = (file.parent / path).resolve()
        if target == spec:
            target = ticket.resolve()
        elif target.is_relative_to(folder.resolve()) or not target.exists():
            return match.group(0)
        return Path(os.path.relpath(target, new_parent)).as_posix() + hash_ + anchor

    return LINK_TOKEN.sub(swap, text)


def read_for_fold(path: Path, project_root: Path) -> str:
    try:
        return path.read_text(encoding="utf-8")
    except (OSError, UnicodeError) as error:
        raise FoldProblem(f"{relative(path, project_root)} cannot be read: {error}") from error


def text_files(root: Path, *, skip: tuple[Path, ...] = ()) -> list[Path]:
    """The .md and .toml files under root, hidden files, archives and `skip` folders left out."""
    found: list[Path] = []
    for current, dirs, files in os.walk(root):
        dirs[:] = sorted(
            d for d in dirs if not d.startswith(".") and d not in UNTOUCHED_FOLDERS and (Path(current) / d) not in skip
        )
        found += [Path(current) / f for f in sorted(files) if f.endswith(TEXT_SUFFIXES) and not f.startswith(".")]
    return found


def companion_files(moving: list[Path]) -> list[Path]:
    files: list[Path] = []
    for path in moving:
        files += text_files(path) if path.is_dir() else [path] if path.name.endswith(TEXT_SUFFIXES) else []
    return files


def cap_scope(home: Path, folder: Path, moving: list[Path]) -> list[Path]:
    """Where a spec's `CAP` ids are cited: the ticket folder and its children, except a child container with a
    spec of its own, folded or not, whose own fold maps its ids; only that child's ticket file, which cites the
    parent's, is in."""
    files: list[Path] = []
    for current, dirs, names in os.walk(home):
        here = Path(current)
        if here == folder:
            dirs[:] = []
            continue
        files += [here / f for f in sorted(names) if f.endswith(TEXT_SUFFIXES) and not f.startswith(".")]
        kept: list[str] = []
        for d in sorted(dirs):
            if d.startswith(".") or d in UNTOUCHED_FOLDERS:
                continue
            child = here / d
            if has_own_spec(child):
                files.append(child / f"{d}.md")
                continue
            kept.append(d)
        dirs[:] = kept
    return files + companion_files(moving)


def has_own_spec(child: Path) -> bool:
    ticket = child / f"{child.name}.md"
    if not ticket.is_file():
        return False
    if any(SPEC_FOLDER.match(p.name) and (p / f"{p.name}.md").is_file() for p in child.iterdir() if p.is_dir()):
        return True
    requirements = section_body(ticket.read_text(encoding="utf-8"), "Requirements")
    return any(CAP_ID.search(span.group(1)) for span in R_SOURCE.finditer(requirements))


def parse_spec(text: str) -> dict[str, object]:
    meta, body = split_frontmatter(text)
    title = next((line[2:].strip() for line in body.splitlines() if line.startswith("# ")), "")
    sections = {name.lower(): content for name, content in split_sections(body)[1]}
    capabilities: dict[int, str] = {}
    current: dict[str, str] | None = None
    key = "rest"
    blocks: list[tuple[int, dict[str, str]]] = []
    for line in sections.get("capabilities", "").splitlines():
        if match := CAPABILITY.match(line):
            current, key = {"rest": match.group(3).strip()}, "rest"
            blocks.append((int(match.group(2)), current))
        elif current is not None and (field := CAPABILITY_FIELD.match(line)):
            key = field.group(1)
            current[key] = field.group(2).strip()
        elif current is not None and line.strip():
            # A wrapped line continues the field above it; another bullet does not.
            if line.lstrip().startswith("- "):
                key = "rest"
            current[key] = f"{current.get(key, '')} {line.strip()}".strip()
    for number, block in blocks:
        intent, success = block.get("intent", ""), block.get("success", "")
        line = intent or block["rest"]
        if success:
            line = f"{line.rstrip('.')}. Success: {success}"
        capabilities[number] = line
    kept = [(name, prose(sections[name])) for name in ("why", "success signal") if sections.get(name, "").strip()]
    return {
        "title": title,
        "companions": frontmatter_list(meta, "companions"),
        "sources": frontmatter_list(meta, "sources"),
        "capabilities": capabilities,
        "constraints": bullets(sections.get("constraints", "")),
        "non_goals": bullets(sections.get("non-goals", "")),
        "assumptions": bullets(sections.get("assumptions", "")),
        "questions": bullets(sections.get("open questions", "")),
        "why": prose(sections.get("why", "")),
        "kept": kept,
    }


def prose(section: str) -> str:
    """A section as one line, bullet markers dropped."""
    lines = [line.strip() for line in section.splitlines() if line.strip()]
    return " ".join(line[2:].strip() if line.startswith("- ") else line for line in lines)


def split_frontmatter(text: str) -> tuple[list[str], str]:
    lines = text.splitlines()
    if not lines or lines[0].strip() != "---":
        return [], text
    end = next((i for i in range(1, len(lines)) if lines[i].strip() == "---"), None)
    if end is None:
        return [], text
    return lines[1:end], "\n".join(lines[end + 1 :])


def frontmatter_list(meta: list[str], key: str) -> list[str]:
    """`key: [a, b]`, or `key:` followed by `- a` lines. Comments after the value are dropped."""
    items: list[str] = []
    for index, line in enumerate(meta):
        if not re.match(rf"\A{re.escape(key)}\s*:", line):
            continue
        value = line.split(":", 1)[1].split("#", 1)[0].strip()
        if value.startswith("["):
            items = [item.strip().strip("'\"") for item in value.strip("[]").split(",")]
        else:
            for following in meta[index + 1 :]:
                if not following.lstrip().startswith("- "):
                    break
                items.append(following.lstrip()[2:].split("#", 1)[0].strip().strip("'\""))
        break
    return [item for item in items if item]


def bullets(section: str) -> list[str]:
    """Bullet lines as plain text, a wrapped line joined to its bullet, without placeholder comments."""
    items: list[str] = []
    open_item = False
    for line in section.splitlines():
        stripped = line.strip()
        if stripped.startswith("- "):
            items.append(stripped[2:].strip())
            open_item = True
        elif open_item and stripped and not stripped.startswith("<!--"):
            items[-1] = f"{items[-1]} {stripped}"
        else:
            open_item = False
    return items


def split_sections(text: str) -> tuple[str, list[tuple[str, str]]]:
    """(the text before the first `## `, [(name, body)]) with each body stripped of surrounding blank lines."""
    parts = HEADING.split(text)
    return parts[0], [(parts[i], parts[i + 1].strip("\n")) for i in range(1, len(parts), 2)]


def join_sections(head: str, sections: list[tuple[str, str]]) -> str:
    out = [head.rstrip("\n")] if head.strip() else []
    out += [f"## {name}\n\n{body}" if body else f"## {name}" for name, body in sections]
    return "\n\n".join(out) + "\n"


def section_body(text: str, name: str) -> str:
    return next((body for heading, body in split_sections(text)[1] if heading.lower() == name.lower()), "")


def add_lines(sections: list[tuple[str, str]], name: str, lines: list[str], *, replace: bool = False) -> None:
    """Append lines to the section, replacing its body when `replace`; a missing section is created in template order."""
    if not lines:
        return
    for index, (heading, body) in enumerate(sections):
        if heading.lower() == name.lower():
            if replace or not body:
                body = "\n".join(lines)
            else:
                # A list after prose needs a blank line to be one.
                separator = "\n" if body.splitlines()[-1].startswith("- ") else "\n\n"
                body = f"{body}{separator}{chr(10).join(lines)}"
            sections[index] = (heading, body)
            return
    rank = SECTION_ORDER.index(name)
    position = next(
        (
            i
            for i, (heading, _b) in enumerate(sections)
            if heading in SECTION_ORDER and SECTION_ORDER.index(heading) > rank
        ),
        len(sections),
    )
    sections.insert(position, (name, "\n".join(lines)))


def folded_ticket_text(
    text: str,
    ticket: Path,
    spec: dict,
    requirements: list[str],
    references: list[str],
    sources: list[str],
    companions: list[str],
    replace_requirements: bool,
) -> str:
    meta, body = split_frontmatter(text)
    head, sections = split_sections(body)
    add_lines(sections, "Requirements", requirements, replace=replace_requirements)
    add_lines(sections, "Constraints", [f"- {line}" for line in spec["constraints"]])
    add_lines(sections, "Boundaries", [f"- Non-goal: {line}" for line in spec["non_goals"]])
    existing = section_body(body, "References")
    self_reference = re.compile(rf"(^|/){re.escape(ticket.name)}(,|\s|$)")
    kept = [
        line
        for line in existing.splitlines()
        if not (line.strip().startswith("- ") and self_reference.search(line.split(" — ", 1)[-1]))
    ]
    kept += [line for line in references if line not in existing]
    index = next((i for i, (heading, _b) in enumerate(sections) if heading.lower() == "references"), None)
    if index is None:
        add_lines(sections, "References", kept)
    else:
        sections[index] = (sections[index][0], "\n".join(kept))
    add_lines(
        sections,
        "Notes",
        [f"- Assumption: {line}" for line in spec["assumptions"]]
        + [f"- Open question: {line}" for line in spec["questions"]],
    )
    meta = with_list(meta, "sources", sources)
    meta = with_list(meta, "companions", companions)
    if any(re.match(r"\Atype\s*:\s*initiative\b", line) for line in meta):
        meta = [line for line in meta if not re.match(r"\Acovers\s*:", line)]
    front = "---\n" + "\n".join(meta) + "\n---\n" if meta else ""
    return front + join_sections(head, sections)


def with_list(meta: list[str], key: str, items: list[str]) -> list[str]:
    """The frontmatter with `key` holding its existing items plus `items`, the line added after `sources:` or at the end."""
    if not items:
        return meta
    index = next((i for i, line in enumerate(meta) if re.match(rf"\A{key}\s*:", line)), None)
    merged = list(dict.fromkeys((frontmatter_list(meta, key) if index is not None else []) + items))
    line = f"{key}: [{', '.join(merged)}]"
    if index is not None:
        # A block list's `- item` lines go with the key line they continue.
        end = index + 1
        while end < len(meta) and meta[end].lstrip().startswith("- "):
            end += 1
        return [*meta[:index], line, *meta[end:]]
    after = next((i for i, line in enumerate(meta) if re.match(r"\Asources\s*:", line)), None)
    if after is None or key == "sources":
        return [*meta, line]
    return [*meta[: after + 1], line, *meta[after + 1 :]]


def story_text(
    spec: dict,
    home: Path,
    slug: str,
    requirements: list[str],
    references: list[str],
    sources: list[str],
    companions: list[str],
) -> str:
    used = [
        int(match.group(1))
        for path in sorted(home.glob("*.md"))
        if (match := re.search(r"(?m)^id:\s*(\d+)\s*$", path.read_text(encoding="utf-8")))
    ]
    # `next_id` at the top of the folder's tickets.toml keeps a moved-out id from being reused.
    floor = 0
    breakdown = home / "tickets.toml"
    if breakdown.is_file():
        try:
            floor = tomllib.loads(breakdown.read_text(encoding="utf-8")).get("next_id", 0)
        except (OSError, UnicodeError, tomllib.TOMLDecodeError):
            floor = 0
        if isinstance(floor, bool) or not isinstance(floor, int):
            floor = 0
    title = spec["title"] or slug.replace("-", " ")
    meta = [
        f"id: {max(max(used, default=0) + 1, floor)}",
        "type: story",
        f'title: "{title.replace(chr(34), chr(39))}"',
        "parent: none",
        "covers: []",
        f"sources: [{', '.join(sources)}]",
        f"companions: [{', '.join(companions)}]",
        "after: []",
        "refined: false",
        "hitl: false",
        "risk: low",
    ]
    sections: list[tuple[str, str]] = [("Description", spec["why"] or title)]
    add_lines(sections, "Requirements", requirements)
    add_lines(sections, "Constraints", [f"- {line}" for line in spec["constraints"]])
    add_lines(sections, "Boundaries", [f"- Non-goal: {line}" for line in spec["non_goals"]])
    add_lines(sections, "References", references)
    add_lines(
        sections,
        "Notes",
        [f"- Assumption: {line}" for line in spec["assumptions"]]
        + [f"- Open question: {line}" for line in spec["questions"]],
    )
    return "---\n" + "\n".join(meta) + "\n---\n\n" + join_sections(f"# {title}", sections)


def companion_references(
    items: list[str], folder: Path, home: Path, project_root: Path, store: Path
) -> tuple[list[str], list[str]]:
    """A References line per companion: `companion — <name>` for one moving beside the ticket, else typed by its
    file name with the path rebased to the ticket's folder. A path that resolves nowhere is kept as written."""
    lines: list[str] = []
    unresolved: list[str] = []
    for item in items:
        target = resolve_companion(item, folder, project_root, store)
        if target is None:
            unresolved.append(item)
            lines.append(f"- companion — {item}")
            continue
        if target.is_relative_to(folder.resolve()):
            lines.append(f"- companion — {target.relative_to(folder.resolve()).as_posix()}")
            continue
        kind = COMPANION_TYPES.get(target.name) or re.split(r"[-_.]", target.stem, maxsplit=1)[0].lower() or "companion"
        lines.append(f"- {kind} — {rebase(item, folder, home, project_root, store)}")
    return lines, unresolved


def companion_path(item: str, folder: Path, home: Path, project_root: Path, store: Path) -> str:
    """The companion as `companions:` lists it: a path from the project root when it resolves there, else as rebased."""
    target = resolve_companion(item, folder, project_root, store)
    if target is None:
        return item
    target = moved_path(target, folder, home)
    if target.is_relative_to(project_root.resolve()):
        return target.relative_to(project_root.resolve()).as_posix()
    return rebase(item, folder, home, project_root, store)


def resolve_companion(item: str, folder: Path, project_root: Path, store: Path) -> Path | None:
    for base in (folder, project_root, store):
        candidate = (base / item).resolve()
        if candidate.exists():
            return candidate
    return None


def moved_path(target: Path, folder: Path, home: Path) -> Path:
    """Where a file in the spec folder, at any depth, sits once the fold moves the folder's contents beside the ticket."""
    if target.is_relative_to(folder.resolve()):
        return home.resolve() / target.relative_to(folder.resolve())
    return target


def rebase(item: str, folder: Path, home: Path, project_root: Path, store: Path) -> str:
    """The path as the ticket's folder sees it: a path from beside it, a path from the project root, else relative."""
    target = resolve_companion(item, folder, project_root, store)
    if target is None:
        return item
    target = moved_path(target, folder, home)
    if target.is_relative_to(home.resolve()):
        return target.relative_to(home.resolve()).as_posix()
    if target.is_relative_to(project_root.resolve()):
        return target.relative_to(project_root.resolve()).as_posix()
    return Path(os.path.relpath(target, home.resolve())).as_posix()


def memlog_body(path: Path) -> str:
    _meta, body = split_frontmatter(path.read_text(encoding="utf-8"))
    body = body.strip("\n")
    return body + "\n" if body else ""


def append_text(path: Path, text: str) -> None:
    """Add text at the end of the file, on its own line. The memlog is append-only, so nothing above is touched."""
    if not text:
        return
    with path.open("r+", encoding="utf-8") as handle:
        current = handle.read()
        handle.write(("" if not current or current.endswith("\n") else "\n") + text)


def report(project_root: Path, skill_root: Path, *, roots: tuple[Path, ...] = ()) -> dict[str, object]:
    """The traces `--clean` would remove. Reads only."""
    reject_unusable_bmad(project_root)
    installation = discover_installation(skill_root, roots)
    retirement = retirement_report(
        project_root, skill_root, installation, retired_skills(installation.modules, installation.modules)
    )
    return {"mode": "report", **traces_json(project_root, installation, retirement)}


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description="Report or remove the v6 traces in _bmad that v7 does not read.")
    parser.add_argument("--project-root", type=Path, required=True)
    parser.add_argument("--skill", type=Path, required=True)
    parser.add_argument("--root", type=Path, action="append", default=[], help="an active skills folder, repeated")
    parser.add_argument("--clean", action="store_true", help="back up _bmad, then remove the traces")
    parser.add_argument(
        "--fold-specs", type=Path, metavar="FOLDER", help="fold the pre-release spec folders under this output folder"
    )
    args = parser.parse_args(argv)
    if args.fold_specs and args.clean:
        parser.error("--fold-specs cannot be combined with --clean")
    project_root = args.project_root.resolve()
    skill_root = args.skill.resolve()
    roots = tuple(root.resolve() for root in args.root)
    if args.fold_specs:
        _setup.print_json(fold_specs(project_root, args.fold_specs.resolve()))
        return 0
    run = clean if args.clean else report
    _setup.print_json(run(project_root, skill_root, roots=roots))
    return 0


if __name__ == "__main__":
    if sys.platform == "win32":
        # Piped output on Windows defaults to a legacy code page, not UTF-8.
        sys.stdout.reconfigure(encoding="utf-8")
        sys.stderr.reconfigure(encoding="utf-8")
    try:
        raise SystemExit(main())
    except Exception as error:
        sys.stderr.write(f"error: {error}\n")
        raise SystemExit(1) from None
