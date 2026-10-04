# Migrate

Convert an old-format module into a bmod in place. The old format is a `<code>-setup` skill, or for one skill a `module-setup.md` in its assets, carrying `module.yaml`, `module-help.csv` and merge scripts that wrote `_bmad/config.yaml` and `_bmad/module-help.csv`. The new format is a record `bmad` reads: `bmod.toml`, `help/`, `roster.toml`. Nothing is deleted before the user approves the whole plan.

## Read everything

`{target}` is the module folder: the one holding the member skills and the setup skill, or for a one-skill module that skill's folder. Run `uv run {skill-root}/scripts/scan_legacy_module.py {target}` and read its JSON: `module` (code, version, greeting, agents), `config_keys` (key, prompt, default, user_setting, kind, unconvertible reasons), `help_rows`, `skills`, `legacy_reads` (every config read by skill, path and line), `setup_skill`, `files_to_delete`. Ask the user only for `update_source`, the pushed `github:<owner>/<repo>` or `github:<owner>/<repo>/<path>`. `{bmad_version}` is the `version` in the `bmod-core-tools` record installed beside `{skill-root}`; ask when it is not installed.

## The plan

Show it whole, as tables, then wait for a yes:

Files, old to new:

- `files_to_delete` (the setup skill or `module-setup.md`, `module.yaml`, `module-help.csv`, the merge scripts): deleted. `retired.toml` lists `setup_skill` under `removed` when there was one.
- `module` to `bmod-<code>/bmod.toml`: `code` and `version` as scanned; `update_source` from the user; `skills` as scanned; `post_install_message` from `greeting`; one `[[bmod.config_questions]]` per entry of `config_keys`, `scope = "user"` where `user_setting` was true. `agents` to `roster.toml`: `code`, `skill`, `name`, `icon`, `title`, and `description` as `persona`.
- `help_rows` to `help/help.md`: one entry per skill from its rows, what it gives and when to recommend it; preceded-by and followed-by become what to offer next. A skill with many rows gets a `help/<skill>.md` topic named in `help.md`.
- Each skill: a `bmod.toml` with `[skill]` (`bmod`, `source`) and `scripts` when it ships any.
- A folder with one skill: the single-skill shape, both tables in that skill's `bmod.toml` and `help/help.md` beside it, no `bmod-<code>/`.

Config keys, old to new, one row per `legacy_reads` entry: every read becomes `uv run {project-root}/_bmad/scripts/resolve_config.py --project-root {project-root} --key ...`. `user_name`, `communication_language`, `document_output_language` and `output_folder` are `core.<key>`; a module key is `modules.<code>.<key>`. A key equal to the code or starting with `<code>.` must be renamed; offer to drop a module name repeated inside a key. Fallbacks to the legacy per-module file go.

Cannot convert, listed plainly from `unconvertible`, with what it means for the user: a select question becomes one string (put the options in the prompt and the default option in `default`, or drop it); validation, directories and post-install notes have no equivalent, so the skill handles them or they go; headless and inline-argument setup is gone because `bmad setup` has none; existing answers in `_bmad/config.yaml` are not carried, so `bmad setup <code>` will ask again.

## Convert

On approval: load `shapes/multi-skill-module/shape.md` or `shapes/single-skill-module/shape.md` and emit from its templates; rewrite every config read as planned, and remove each skill's step that ran the setup skill or loaded `module-setup.md` when unregistered; write `retired.toml`; then delete `files_to_delete`, and nothing else.

## Check

Run the checks of `modes/validate.md`: `validate_manifests.py` when the result sits in a repository with `skills/*/bmod.toml`, and `init_skill.py --check` and `scan_paths.py` on each skill. `scan_paths.py` also catches an old-format name the rewrite missed. Fix until clean, then load `ship.md`.
