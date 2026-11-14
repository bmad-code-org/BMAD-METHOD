# Validate

Report what would stop a skill or a module installing, loading or firing. This mode writes nothing.

## Target

A path to a skill, a module folder holding a record and its members, or a repository.

A folder holding `module.yaml`, `module-help.csv` or a `<code>-setup` skill is the old module format: report one line, "old-format module: convert it with the migrate mode", and stop, because none of the checks below apply to it.

## Checks

Run them all, then report.

- When `uv run {skill-root}/scripts/registry.py --project-root {project-root}` lists `records`: `uv run {project-root}/_bmad/scripts/validate_manifests.py --project-root <repo>`. It covers manifests, membership, versions, retired names, help topics and the roster.
- For each skill: `uv run {skill-root}/scripts/init_skill.py --check <skill>`, with `--any-name` outside BMAD-METHOD (frontmatter, name, description, `[TODO:` left behind, `bmod.toml` parses, `customize-invalid` for a `customize.toml` that does not parse, `memory-script-stale` for a memory agent's `<skill>/scripts/wake.py` or `<skill>/scripts/init-sanctum.py` that differs from Smithy's template).
- For each skill: `uv run {skill-root}/scripts/scan_paths.py <skill>` (paths that do not resolve, bare `scripts/` calls, references into another skill, old-format names).
- For each skill with scripts: `uv run {skill-root}/scripts/scan_scripts.py <skill>`, then run its tests.
- For a module: `uv run {skill-root}/scripts/scan_config_reads.py <module-folder>`, the folder holding the `bmod-<code>/` record and its members, or a single-skill module's own folder. `unasked` is a config value a member reads that no `[[bmod.config_questions]]` asks; `unread` is a question no member reads.

Judge what the tools do not check:

- A record's `SKILL.md` body does anything but redirect to `bmad setup <code>`.
- `help/help.md` tells the help agent things it cannot act on: install mechanics, manifest keys.
- A skill's name carries `bmad-` outside BMAD-METHOD, or lacks its module's code.

## Report

One line per finding: file, what is wrong, the fix. Then the counts, and whether the target would install and load. Offer to fix through `modes/edit.md`.

When `evals/triggers.json` exists, offer a trigger eval once and invoke the `bmad-eval` skill in trigger mode on a yes.
