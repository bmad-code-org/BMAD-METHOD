"""Pure-Python port of BMAD's minimal non-interactive install.

Reproduces what the Node installer produces for a fresh, non-interactive
``bmad install --directory . --modules bmm --tools claude-code --yes`` run,
with no Node/npm required. The output layout (``_bmad/`` config + manifests and
the IDE ``skills/`` directory) matches the Node installer closely enough to be a
drop-in scaffold; see ``tests/python`` for the parity checks.

Scope (deliberate PoC boundaries): fresh installs only - no update/quick-update,
no external/marketplace modules, no custom-source modules, no interactive
prompts. Everything here is driven by the built-in ``core`` and ``bmm`` payloads
plus the config-driven IDE registry.
"""

from __future__ import annotations

import getpass
import hashlib
import re
import shutil
from dataclasses import dataclass, field
from datetime import datetime, timezone
from pathlib import Path

import yaml

from . import ide
from .payload import bmad_version, module_source

BMAD_FOLDER_NAME = "_bmad"

# Directories under _bmad/ that are not installable modules.
NON_MODULE_DIRS = {"_config", "_memory", "memory", "docs", "scripts", "custom"}

# Files/dirs never shipped from src/scripts/ into a user's _bmad/scripts/.
_SCRIPT_SKIP_DIRS = {"tests", "__pycache__", ".pytest_cache"}

MODULE_HELP_CSV_HEADER = (
    "module,skill,display-name,menu-code,description,action,args,phase,"
    "preceded-by,followed-by,required,output-location,outputs"
)
_MODULE_HELP_COLUMNS = 13
_MODULE_HELP_PHASE_INDEX = 7


@dataclass
class InstallConfig:
    directory: Path
    modules: list[str]  # excluding 'core'; core is always prepended
    tools: list[str]
    user_name: str | None = None
    communication_language: str | None = None
    document_output_language: str | None = None
    output_folder: str | None = None
    yes: bool = True


@dataclass
class InstallResult:
    project_root: Path
    bmad_dir: Path
    modules: list[str]
    tools: list[str]
    skill_count: int
    ide_results: dict = field(default_factory=dict)


# --------------------------- value formatting ---------------------------


def format_toml_value(value) -> str:
    """Format a scalar/list as a TOML literal (mirrors the Node formatter)."""
    if value is None:
        return '""'
    if isinstance(value, bool):
        return "true" if value else "false"
    if isinstance(value, int) or (isinstance(value, float) and value == value):
        return str(value)
    if isinstance(value, (list, tuple)):
        return "[" + ", ".join(format_toml_value(v) for v in value) + "]"
    s = str(value)
    escaped = (
        s.replace("\\", "\\\\")
        .replace('"', '\\"')
        .replace("\n", "\\n")
        .replace("\r", "\\r")
        .replace("\t", "\\t")
    )
    return f'"{escaped}"'


_YAML_INDICATORS = set("!&*?|>%@`\"'#,[]{} ")
_YAML_RESERVED = {"true", "false", "null", "~", "yes", "no", "on", "off"}


def _yaml_looks_numeric(s: str) -> bool:
    try:
        float(s)
        return True
    except ValueError:
        return False


def format_yaml_scalar(s: str) -> str:
    """Emit a YAML scalar, double-quoting only when a plain scalar is unsafe.

    Calibrated against the Node installer's ``yaml.stringify`` output for the
    values this installer produces (e.g. ``{project-root}/...`` gets quoted,
    ``_bmad-output`` and ``English`` stay plain).
    """
    if s == "":
        return '""'
    needs_quote = (
        s[0] in _YAML_INDICATORS
        or s[-1] == " "
        or ": " in s
        or " #" in s
        or "\n" in s
        or s.lower() in _YAML_RESERVED
        or _yaml_looks_numeric(s)
    )
    if not needs_quote:
        return s
    escaped = s.replace("\\", "\\\\").replace('"', '\\"')
    return f'"{escaped}"'


def _csv_always_quote(value) -> str:
    return '"' + str("" if value is None else value).replace('"', '""') + '"'


def _csv_escape_field(value) -> str:
    """Quote only when needed (mirrors installer.escapeCSVField)."""
    if value is None:
        return ""
    s = str(value)
    if "," in s or '"' in s or "\n" in s:
        return '"' + s.replace('"', '""') + '"'
    return s


def _parse_csv_line(line: str) -> list[str]:
    """Split a single CSV line honouring quotes (mirrors parseCSVLine)."""
    result: list[str] = []
    current = ""
    in_quotes = False
    i = 0
    while i < len(line):
        char = line[i]
        nxt = line[i + 1] if i + 1 < len(line) else None
        if char == '"':
            if in_quotes and nxt == '"':
                current += '"'
                i += 1
            else:
                in_quotes = not in_quotes
        elif char == "," and not in_quotes:
            result.append(current)
            current = ""
        else:
            current += char
        i += 1
    result.append(current)
    return result


def _clean_for_csv(text: str) -> str:
    if not text:
        return ""
    return re.sub(r"\s+", " ", text.strip())


def _iso_now() -> str:
    now = datetime.now(timezone.utc)
    return now.strftime("%Y-%m-%dT%H:%M:%S.") + f"{now.microsecond // 1000:03d}Z"


# --------------------------- module.yaml model ---------------------------


class ModuleSpec:
    def __init__(self, code: str, raw: dict):
        self.code = raw.get("code", code)
        self.raw = raw
        # Config fields: any top-level key whose value is a mapping with a prompt.
        self.config_fields: dict[str, dict] = {
            k: v
            for k, v in raw.items()
            if isinstance(v, dict) and "prompt" in v
        }
        self.scope: dict[str, str] = {
            k: ("user" if v.get("scope") == "user" else "team")
            for k, v in self.config_fields.items()
        }
        self.agents: list[dict] = raw.get("agents") or []
        self.directories: list[str] = raw.get("directories") or []


def load_module_spec(module: str) -> ModuleSpec:
    raw = yaml.safe_load(module_source(module).joinpath("module.yaml").read_text(encoding="utf-8"))
    if not isinstance(raw, dict):
        raw = {}
    return ModuleSpec(module, raw)


# ------------------------- placeholder resolution -------------------------


def _resolve_placeholders(s: str, collected: dict, dirname: str) -> str:
    def repl(match: re.Match) -> str:
        key = match.group(1)
        if key == "project-root":
            return "{project-root}"
        if key == "directory_name":
            return dirname
        for cfg in collected.values():
            if key in cfg:
                val = cfg[key]
                if isinstance(val, str) and val.startswith("{project-root}/"):
                    val = val[len("{project-root}/") :]
                return str(val)
        return match.group(0)

    return re.sub(r"\{([^}]+)\}", repl, s)


def _resolve_module_config(spec: ModuleSpec, collected: dict, dirname: str) -> dict:
    """Resolve a non-core module's config values in non-interactive mode."""
    out: dict = {}
    for key, field_def in spec.config_fields.items():
        default = field_def.get("default", "")
        value = _resolve_placeholders(str(default), collected, dirname)
        if value.startswith("{project-root}/"):
            value = value[len("{project-root}/") :]
        result_tmpl = field_def.get("result")
        if result_tmpl is not None:
            resolved = str(result_tmpl).replace("{value}", value)
            resolved = _resolve_placeholders(resolved, collected, dirname)
        else:
            resolved = value
        out[key] = resolved
    return out


def _seed_core_config(config: InstallConfig, project_root: Path) -> dict:
    """Core config values for a fresh --yes install (raw defaults, no templates)."""
    try:
        username = getpass.getuser()
    except Exception:
        username = "User"
    default_username = username[:1].upper() + username[1:] if username else "User"
    return {
        "user_name": config.user_name or default_username,
        # Use the resolved directory name so `--directory .` yields the real
        # folder name rather than an empty string.
        "project_name": project_root.name,
        "communication_language": config.communication_language or "English",
        "document_output_language": config.document_output_language or "English",
        "output_folder": config.output_folder or "_bmad-output",
    }


# --------------------------- file operations ---------------------------


def _copy_shared_scripts(src_scripts: Path, dest_scripts: Path, tracked: list[Path]) -> None:
    """Copy src/scripts/* -> _bmad/scripts/, skipping tests and caches."""
    if dest_scripts.exists():
        shutil.rmtree(dest_scripts)
    dest_scripts.mkdir(parents=True, exist_ok=True)

    def recurse(src_dir: Path, dst_dir: Path) -> None:
        for entry in sorted(src_dir.iterdir(), key=lambda p: p.name):
            if entry.is_dir():
                if entry.name in _SCRIPT_SKIP_DIRS:
                    continue
                target = dst_dir / entry.name
                target.mkdir(parents=True, exist_ok=True)
                recurse(entry, target)
            else:
                if entry.name.endswith(".pyc"):
                    continue
                target = dst_dir / entry.name
                shutil.copy2(entry, target)
                tracked.append(target)

    recurse(src_scripts, dest_scripts)


def _list_files(root: Path) -> list[str]:
    """All files under root, as POSIX-relative paths (mirrors getFileList).

    Walks depth-first with per-directory name sorting so the emitted order
    matches the Node installer's readdir-order recursion (which determines the
    stable tiebreak in files-manifest.csv). Sorting per-directory - rather than
    by full path - matters because ``-`` sorts before ``/``.
    """
    files: list[str] = []

    def walk(d: Path) -> None:
        for entry in sorted(d.iterdir(), key=lambda p: p.name):
            if entry.is_dir():
                walk(entry)
            elif entry.is_file():
                files.append(entry.relative_to(root).as_posix())

    walk(root)
    return files


def _copy_module(module: str, bmad_dir: Path, tracked: list[Path]) -> None:
    """Copy a module's source tree into _bmad/<module>/ with the install filters."""
    source = module_source(module)
    target = bmad_dir / module
    if target.exists():
        shutil.rmtree(target)

    for rel in _list_files(source):
        parts = rel.split("/")
        if parts[0] == "sub-modules":
            continue
        if any(seg.lower().endswith("-sidecar") for seg in parts[:-1]):
            continue
        # Never ship Python bytecode caches. Unlike the Node installer (which
        # runs from a clean checkout), our payload lives in site-packages where
        # pip byte-compiles the shipped scripts, seeding __pycache__/*.pyc.
        if "__pycache__" in parts or rel.endswith(".pyc"):
            continue
        if rel == "module.yaml" or rel == "config.yaml":
            continue
        src_file = source / rel
        if rel.startswith("agents/") and rel.endswith(".md"):
            content = src_file.read_text(encoding="utf-8", errors="replace")
            if re.search(r'<agent[^>]*\slocalskip="true"[^>]*>', content):
                continue
        dst_file = target / rel
        dst_file.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(src_file, dst_file)
        tracked.append(dst_file)


def _create_module_directories(spec: ModuleSpec, module_cfg: dict, project_root: Path) -> list[Path]:
    """Create directories declared in module.yaml's `directories` key."""
    created: list[Path] = []
    for entry in spec.directories:
        if not isinstance(entry, str):
            continue
        m = re.fullmatch(r"\{([^}]+)\}", entry.strip())
        if not m:
            continue
        key = m.group(1)
        value = module_cfg.get(key)
        if not isinstance(value, str) or not value:
            continue
        dir_path = re.sub(r"^\{project-root\}/?", "", value).replace("{project-root}", "")
        full = (project_root / dir_path).resolve()
        root = project_root.resolve()
        if full != root and root not in full.parents:
            continue
        full.mkdir(parents=True, exist_ok=True)
        created.append(full)
    return created


# --------------------------- skill discovery ---------------------------


def _parse_skill_md(skill_md: Path, dir_name: str) -> dict | None:
    try:
        raw = skill_md.read_text(encoding="utf-8")
    except OSError:
        return None
    content = raw.replace("\r\n", "\n").replace("\r", "\n")
    match = re.match(r"^---\n([\s\S]*?)\n---", content)
    if not match:
        return None
    try:
        meta = yaml.safe_load(match.group(1))
    except yaml.YAMLError:
        return None
    if not isinstance(meta, dict):
        return None
    name = meta.get("name")
    description = meta.get("description")
    if not isinstance(name, str) or not isinstance(description, str) or not name or not description:
        return None
    if name != dir_name:
        # Mirrors the Node installer's hard skip on name/dir mismatch.
        print(f"Error: SKILL.md name '{name}' does not match directory name '{dir_name}' - skipping")
        return None
    return {"name": name, "description": description}


def _collect_skills(bmad_dir: Path, modules: list[str]) -> list[dict]:
    """Discover SKILL.md entrypoints across installed modules."""
    skills: list[dict] = []
    for module in modules:
        module_path = bmad_dir / module
        if not module_path.is_dir():
            continue

        def walk(d: Path) -> None:
            skill_md = d / "SKILL.md"
            meta = _parse_skill_md(skill_md, d.name) if skill_md.exists() else None
            if meta:
                rel = d.relative_to(module_path).as_posix()
                install_path = (
                    f"{BMAD_FOLDER_NAME}/{module}/{rel}/SKILL.md"
                    if rel
                    else f"{BMAD_FOLDER_NAME}/{module}/SKILL.md"
                )
                skills.append(
                    {
                        "canonicalId": d.name,
                        "name": meta["name"],
                        "description": _clean_for_csv(meta["description"]),
                        "module": module,
                        "path": install_path,
                    }
                )
                return  # do not descend into a discovered skill
            for child in sorted(d.iterdir(), key=lambda p: p.name):
                if not child.is_dir():
                    continue
                if child.name.startswith(".") or child.name.startswith("_"):
                    continue
                walk(child)

        walk(module_path)
    return skills


def _collect_agents(specs: dict[str, ModuleSpec], modules: list[str]) -> list[dict]:
    agents: list[dict] = []
    for module in modules:
        spec = specs.get(module)
        if not spec:
            continue
        for entry in spec.agents:
            code = entry.get("code")
            if not isinstance(code, str):
                continue
            agents.append(
                {
                    "code": code,
                    "name": entry.get("name", ""),
                    "title": entry.get("title", ""),
                    "icon": entry.get("icon", ""),
                    "description": entry.get("description", ""),
                    "module": module,
                    "team": entry.get("team", module),
                }
            )
    return agents


# --------------------------- config generation ---------------------------


def _write_module_config_yaml(bmad_dir: Path, modules: list[str], collected: dict, version: str, tracked: list[Path]) -> None:
    core_cfg = collected.get("core", {})
    core_keys = set(core_cfg.keys())
    iso = _iso_now()
    for module in modules:
        module_path = bmad_dir / module
        if not module_path.is_dir():
            continue
        cfg = collected.get(module, {})
        header = (
            f"# {module.upper()} Module Configuration\n"
            f"# Generated by BMAD installer\n"
            f"# Version: {version}\n"
            f"# Date: {iso}\n\n"
        )
        module_lines: list[str] = []
        core_lines: list[str] = []
        if module == "core":
            for key, value in cfg.items():
                module_lines.append(f"{key}: {format_yaml_scalar(str(value))}")
        else:
            merged = {**cfg, **core_cfg}
            for key, value in merged.items():
                line = f"{key}: {format_yaml_scalar(str(value))}"
                if key in core_keys:
                    core_lines.append(line)
                else:
                    module_lines.append(line)
        body = "\n".join(module_lines)
        if core_lines:
            # Node's yaml.stringify emits a trailing newline that becomes a blank
            # line between the module block and the core-values comment section.
            body += "\n\n# Core Configuration Values\n" + "\n".join(core_lines)
        content = header + body
        if not content.endswith("\n"):
            content += "\n"
        config_path = module_path / "config.yaml"
        config_path.write_text(content, encoding="utf-8")
        tracked.append(config_path)


# The central-config headers/stubs must match the Node installer byte-for-byte.
# They contain a U+2500 box rule (65 dashes) and U+2014 em-dashes. Building them
# via chr() keeps THIS source pure-ASCII, so an editor/formatter that "dumbs
# down" Unicode punctuation cannot silently break byte-parity (which it did once,
# turning U+2014 into a hyphen and lengthening the rule). See the header
# regression test in tests/python.
_EM_DASH = chr(0x2014)  # em dash
_CONFIG_RULE = "# " + chr(0x2500) * 65  # "# " + 65x U+2500 box-drawing rule

_TEAM_HEADER = [
    _CONFIG_RULE,
    f"# Installer-managed. Regenerated on every install {_EM_DASH} treat as read-only.",
    "#",
    "# Direct edits to this file will be overwritten on the next install.",
    "# To change an install answer durably, re-run the installer (your prior",
    "# answers are remembered as defaults). To pin a value regardless of",
    "# install answers, or to add custom agents / override descriptors, use:",
    "#   _bmad/custom/config.toml       (team, committed)",
    "#   _bmad/custom/config.user.toml  (personal, gitignored)",
    "# Those files are never touched by the installer.",
    _CONFIG_RULE,
    "",
]

_USER_HEADER = [
    _CONFIG_RULE,
    f"# Installer-managed. Regenerated on every install {_EM_DASH} treat as read-only.",
    "# Holds install answers scoped to YOU personally.",
    "#",
    "# Direct edits to this file will be overwritten on the next install.",
    "# To change an answer durably, re-run the installer (your prior answers",
    "# are remembered as defaults). For pinned overrides or custom sections",
    "# the installer does not know about, use _bmad/custom/config.user.toml",
    f"# {_EM_DASH} it is never touched by the installer.",
    _CONFIG_RULE,
    "",
]


def _partition(module: str, cfg: dict, scope: dict, core_keys: set, only_declared: bool) -> tuple[dict, dict]:
    team: dict = {}
    user: dict = {}
    is_core = module == "core"
    for key, value in cfg.items():
        if not is_core and key in core_keys:
            continue
        if only_declared and key not in scope:
            continue
        if scope.get(key) == "user":
            user[key] = value
        else:
            team[key] = value
    return team, user


def _write_central_config(bmad_dir: Path, modules: list[str], specs: dict[str, ModuleSpec], collected: dict, agents: list[dict], tracked: list[Path]) -> None:
    core_scope = specs["core"].scope if "core" in specs else {}
    core_keys = set(core_scope.keys())

    team_lines = list(_TEAM_HEADER)
    user_lines = list(_USER_HEADER)

    # [core]
    core_cfg = collected.get("core", {})
    core_team, core_user = _partition("core", core_cfg, core_scope, core_keys, only_declared=False)
    if core_team:
        team_lines.append("[core]")
        team_lines += [f"{k} = {format_toml_value(v)}" for k, v in core_team.items()]
        team_lines.append("")
    if core_user:
        user_lines.append("[core]")
        user_lines += [f"{k} = {format_toml_value(v)}" for k, v in core_user.items()]
        user_lines.append("")

    # [modules.<code>]
    for module in modules:
        if module == "core":
            continue
        cfg = collected.get(module, {})
        if not cfg:
            continue
        spec = specs.get(module)
        section = spec.code if spec else module
        scope = spec.scope if spec else {}
        have_schema = len(scope) > 0
        mod_team, mod_user = _partition(module, cfg, scope, core_keys, only_declared=have_schema)
        if mod_team:
            team_lines.append(f"[modules.{section}]")
            team_lines += [f"{k} = {format_toml_value(v)}" for k, v in mod_team.items()]
            team_lines.append("")
        if mod_user:
            user_lines.append(f"[modules.{section}]")
            user_lines += [f"{k} = {format_toml_value(v)}" for k, v in mod_user.items()]
            user_lines.append("")

    # [agents.<code>] - always team scope.
    for agent in agents:
        block = [
            f"[agents.{agent['code']}]",
            f"module = {format_toml_value(agent['module'])}",
            f"team = {format_toml_value(agent['team'])}",
        ]
        if agent.get("name"):
            block.append(f"name = {format_toml_value(agent['name'])}")
        if agent.get("title"):
            block.append(f"title = {format_toml_value(agent['title'])}")
        if agent.get("icon"):
            block.append(f"icon = {format_toml_value(agent['icon'])}")
        if agent.get("description"):
            block.append(f"description = {format_toml_value(agent['description'])}")
        block.append("")
        team_lines += block

    team_content = re.sub(r"\n+$", "\n", "\n".join(team_lines))
    user_content = re.sub(r"\n+$", "\n", "\n".join(user_lines))
    team_path = bmad_dir / "config.toml"
    user_path = bmad_dir / "config.user.toml"
    team_path.write_text(team_content, encoding="utf-8")
    user_path.write_text(user_content, encoding="utf-8")
    tracked.append(team_path)
    tracked.append(user_path)


def _write_main_manifest(bmad_dir: Path, modules: list[str], tools: list[str], version: str, tracked: list[Path]) -> None:
    iso = _iso_now()
    lines = [
        "installation:",
        f"  version: {version}",
        f"  installDate: {iso}",
        f"  lastUpdated: {iso}",
        "modules:",
    ]
    for module in modules:
        lines += [
            f"  - name: {module}",
            f"    version: {version}",
            f"    installDate: {iso}",
            f"    lastUpdated: {iso}",
            "    source: built-in",
            "    npmPackage: null",
            "    repoUrl: null",
        ]
    lines.append("ides:")
    for tool in tools:
        lines.append(f"  - {tool}")
    content = "\n".join(lines) + "\n"
    path = bmad_dir / "_config" / "manifest.yaml"
    path.write_text(content, encoding="utf-8")
    tracked.append(path)


def _write_skill_manifest(bmad_dir: Path, skills: list[dict]) -> None:
    out = ["canonicalId,name,description,module,path"]
    for skill in skills:
        out.append(
            ",".join(
                _csv_always_quote(skill[col])
                for col in ("canonicalId", "name", "description", "module", "path")
            )
        )
    content = "\n".join(out) + "\n"
    (bmad_dir / "_config" / "skill-manifest.csv").write_text(content, encoding="utf-8")


def _sha256(path: Path) -> str:
    try:
        return hashlib.sha256(path.read_bytes()).hexdigest()
    except OSError:
        return ""


def _write_files_manifest(bmad_dir: Path, tracked: list[Path]) -> None:
    rows = []
    seen = set()
    for path in tracked:
        try:
            rel = path.relative_to(bmad_dir).as_posix()
        except ValueError:
            continue
        if rel in seen:
            continue
        seen.add(rel)
        ext = path.suffix.lower()
        name = path.name[: len(path.name) - len(ext)] if ext else path.name
        module = rel.split("/")[0]
        type_ = ext[1:] if ext else "file"
        rows.append((type_, name, module, rel, _sha256(path)))
    # Sort by module, type, name (case-insensitive approximation of localeCompare).
    rows.sort(key=lambda r: (r[2].lower(), r[0].lower(), r[1].lower()))
    out = ["type,name,module,path,hash"]
    for type_, name, module, rel, digest in rows:
        out.append(",".join(_csv_always_quote(v) for v in (type_, name, module, rel, digest)))
    content = "\n".join(out) + "\n"
    (bmad_dir / "_config" / "files-manifest.csv").write_text(content, encoding="utf-8")


_CUSTOM_TEAM_STUB = [
    "# Team / enterprise overrides for _bmad/config.toml.",
    f"# Committed to the repo {_EM_DASH} applies to every developer on the project.",
    "# Tables deep-merge over base config; keyed entries merge by key.",
    "# Example: override an agent descriptor, or add a new agent.",
    "#",
    "# [agents.bmad-agent-pm]",
    '# description = "Prefers short, bulleted PRDs over narrative drafts."',
    "",
]

_CUSTOM_USER_STUB = [
    "# Personal overrides for _bmad/config.toml.",
    f"# NOT committed (gitignored) {_EM_DASH} applies only to your local install.",
    "# Wins over both base config and team overrides.",
    "",
]


def _ensure_custom_stubs(bmad_dir: Path) -> None:
    custom = bmad_dir / "custom"
    custom.mkdir(parents=True, exist_ok=True)
    team = custom / "config.toml"
    if not team.exists():
        team.write_text("\n".join(_CUSTOM_TEAM_STUB), encoding="utf-8")
    user = custom / "config.user.toml"
    if not user.exists():
        user.write_text("\n".join(_CUSTOM_USER_STUB), encoding="utf-8")


def _merge_help_catalogs(bmad_dir: Path, modules: list[str]) -> None:
    ordered = ["core"] + [m for m in modules if m != "core"]
    decorated = []
    index = 0
    for module in ordered:
        help_path = bmad_dir / module / "module-help.csv"
        if not help_path.exists():
            continue
        for line in help_path.read_text(encoding="utf-8").split("\n"):
            if not line.strip() or line.startswith("#"):
                continue
            if line.startswith("module,"):
                continue
            cols = _parse_csv_line(line)
            if len(cols) < _MODULE_HELP_COLUMNS - 1:
                continue
            cols = cols[:_MODULE_HELP_COLUMNS]
            while len(cols) < _MODULE_HELP_COLUMNS:
                cols.append("")
            if (not cols[0] or not cols[0].strip()) and module != "core":
                cols[0] = module
            row = ",".join(_csv_escape_field(c) for c in cols)
            decorated.append((row, index, cols))
            index += 1
    decorated.sort(key=lambda d: (d[2][0].lower(), d[2][_MODULE_HELP_PHASE_INDEX], d[1]))
    rows = [MODULE_HELP_CSV_HEADER] + [d[0] for d in decorated]
    (bmad_dir / "_config" / "bmad-help.csv").write_text("\n".join(rows), encoding="utf-8")


# --------------------------- orchestration ---------------------------


def install(config: InstallConfig) -> InstallResult:
    project_root = config.directory.resolve()
    project_root.mkdir(parents=True, exist_ok=True)
    bmad_dir = project_root / BMAD_FOLDER_NAME
    dirname = project_root.name
    version = bmad_version()

    modules = ["core"] + [m for m in config.modules if m != "core"]
    specs = {m: load_module_spec(m) for m in modules}

    tracked: list[Path] = []
    (bmad_dir / "_config").mkdir(parents=True, exist_ok=True)

    # 1. Shared runtime scripts + custom/.gitignore.
    _copy_shared_scripts(_scripts_source(), bmad_dir / "scripts", tracked)
    custom_dir = bmad_dir / "custom"
    custom_dir.mkdir(parents=True, exist_ok=True)
    gitignore = custom_dir / ".gitignore"
    if not gitignore.exists():
        gitignore.write_text("*.user.toml\n", encoding="utf-8")
        tracked.append(gitignore)

    # 2. Module payloads.
    for module in modules:
        _copy_module(module, bmad_dir, tracked)

    # 3. Config values.
    collected: dict = {"core": _seed_core_config(config, project_root)}
    for module in modules:
        if module == "core":
            continue
        collected[module] = _resolve_module_config(specs[module], collected, dirname)

    # 4. Module directories declared in module.yaml.
    for module in modules:
        _create_module_directories(specs[module], collected.get(module, {}), project_root)

    # 5. Per-module config.yaml.
    _write_module_config_yaml(bmad_dir, modules, collected, version, tracked)

    # 6. Manifests + central config.
    skills = _collect_skills(bmad_dir, modules)
    agents = _collect_agents(specs, modules)
    _write_central_config(bmad_dir, modules, specs, collected, agents, tracked)
    _write_main_manifest(bmad_dir, modules, config.tools, version, tracked)
    _write_skill_manifest(bmad_dir, skills)
    _write_files_manifest(bmad_dir, tracked)
    _ensure_custom_stubs(bmad_dir)
    _merge_help_catalogs(bmad_dir, modules)

    # 7. Configure IDE/tool skill directories.
    ide_results: dict = {}
    for tool in config.tools:
        ide_results[tool] = ide.setup_tool(tool, project_root, bmad_dir)

    # 8. Skills are self-contained in the IDE dirs now - drop them from _bmad/.
    _cleanup_skill_dirs(bmad_dir)

    return InstallResult(
        project_root=project_root,
        bmad_dir=bmad_dir,
        modules=modules,
        tools=list(config.tools),
        skill_count=len(skills),
        ide_results=ide_results,
    )


def _scripts_source() -> Path:
    from .payload import src_path

    return src_path("scripts")


def _cleanup_skill_dirs(bmad_dir: Path) -> None:
    """Remove skill source dirs from _bmad/ after they were copied to IDE dirs."""
    csv_path = bmad_dir / "_config" / "skill-manifest.csv"
    if not csv_path.exists():
        return
    import csv as _csv

    prefix = BMAD_FOLDER_NAME + "/"
    with csv_path.open(encoding="utf-8", newline="") as fh:
        for record in _csv.DictReader(fh):
            rel = record.get("path") or ""
            if rel.startswith(prefix):
                rel = rel[len(prefix) :]
            source_dir = (bmad_dir / rel).parent
            if source_dir.exists():
                shutil.rmtree(source_dir, ignore_errors=True)
                _remove_empty_parents(source_dir.parent, bmad_dir)


def _remove_empty_parents(start: Path, bmad_dir: Path) -> None:
    current = start
    while True:
        try:
            rel = current.relative_to(bmad_dir)
        except ValueError:
            break
        if rel == Path("."):
            break
        try:
            if any(current.iterdir()):
                break
            current.rmdir()
        except OSError:
            break
        current = current.parent
