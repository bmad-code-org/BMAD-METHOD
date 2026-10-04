# Validate

Check a skill or a module and report what would stop it installing, loading or firing, with the fix for each. This mode writes nothing.

## Target

A path to a skill, a record folder, or a repository. A folder holding `module.yaml`, `module-help.csv` or a `<code>-setup` skill is the old module format: report one line, "old-format module: convert it with the migrate mode", and stop, because none of the checks below apply to it.

## Checks

Run them all, then report; do not stop at the first failure.

- In a repository with `skills/*/bmod.toml`: `uv run {project-root}/_bmad/scripts/validate_manifests.py --project-root <repo>`. It covers manifests, membership, versions, retired names, help topics and the roster, and each message names its fix.
- For each skill: `uv run {skill-root}/scripts/init_skill.py --check <skill>` (frontmatter, name, description, `[TODO:` left behind, `bmod.toml` parses; add `--any-name` outside BMAD-METHOD) and `uv run {skill-root}/scripts/scan_paths.py <skill>` (paths that do not resolve, bare `scripts/` calls, references into another skill, old-format names). `uv run {skill-root}/scripts/scan_scripts.py <skill>` when it has scripts, then run its tests.
- When `evals/triggers.json` exists, offer a trigger eval once and invoke the `bmad-eval` skill in trigger mode on a yes.

Only what the tools do not check is yours to judge:

- A record's `SKILL.md` body does anything but redirect to `bmad setup <code>`.
- A member reads a value from config that no question in the record asks, or a question no member reads.
- `help/help.md` tells the help agent things it cannot act on: install mechanics, manifest keys.
- A skill's name carries `bmad-` outside BMAD-METHOD, or lacks its module's code.

## Report

One line per finding: file, what is wrong, the fix. Then the counts, and whether the target would install and load as it stands. Offer to fix through `modes/edit.md`; do not fix here.
