# Migrate

Convert an old-format module into a bmod in place, its packaging and the config its skills read. The old format is a `<code>-setup` skill, or for one skill a `module-setup.md` in its assets, carrying `module.yaml`, `module-help.csv` and merge scripts that wrote `_bmad/config.yaml` and `_bmad/module-help.csv`.

## Read everything

`{target}` is the folder holding the member skills and the setup skill, or a one-skill module's own folder.

Run `uv run {skill-root}/scripts/scan_legacy_module.py {target}` and read its JSON.

Ask the user only for `update_source`, the pushed `github:<owner>/<repo>` or `github:<owner>/<repo>/<path>`.

## The Smithy execution plan

Show it whole, as tables, then wait for a yes:

Files, old to new:

- `files_to_delete`: deleted. `retired.toml` lists `setup_skill` under `removed` when there was one.
- `module` to the record's `bmod.toml` (in `bmod-<code>/`, or the skill's own folder for one skill): `code`, `version` and `skills` as scanned; `update_source` from the user; `post_install_message` from `greeting`; one `[[bmod.config_questions]]` per entry of `config_keys`, `scope = "user"` where `user_setting` was true, its `default` rewritten by the config rules below.
- `agents` to `roster.toml`: `code`, `skill`, `name`, `icon`, `title`, and `description` as `persona`.
- `help_rows` to `help/help.md`: one entry per skill from its rows, what it gives and when to recommend it; preceded-by and followed-by become what to offer next. A skill with many rows gets a `help/<skill>.md` topic named in `help.md`.
- Each skill: a `bmod.toml` with `[skill]` (`bmod`, `source`) and `scripts` when it ships any.

Config, old to new, one row per `legacy_reads` entry and per `legacy_placeholders` entry, each with its v7 form. A skill reads every key it uses in one `uv run "{project-root}/_bmad/scripts/resolve_config.py" --project-root "{project-root}" --key ...` call at activation; placeholders of the keys it reads, such as `{output_folder}`, stay as they are.

- `output_folder` is `core.output_folder`.
- `planning_artifacts` and `implementation_artifacts` become the initiative folder, `{output_folder}/{active_initiative}`, read with `--key core.output_folder --key core.active_initiative` and without `/{active_initiative}` when it is unset. A document goes in `<type>-<slug>/<type>-<slug>.md` under it; a skill that ships `customize.toml` declares that path as `<type>_output_path`.
- `project_knowledge` has no v7 key. Ask whether the module needs its own question for it; otherwise name the project's docs folder in the text.
- `user_name`, `communication_language`, `document_output_language` and `user_skill_level` have no v7 key: their reads go, and a sentence built on one of their placeholders is rewritten without it.
- A module key is `modules.<code>.<key>`. A key equal to the code or starting with `<code>.` must be renamed; offer to drop a module name repeated inside a key.
- Fallbacks to the legacy per-module file go.

Cannot convert, listed from `unconvertible`, with what it means for the user:

- A select question becomes one string: put the options in the prompt and the default option in `default`, or drop it.
- Validation, directories and post-install notes have no equivalent, so the skill handles them or they go.
- Headless and inline-argument setup is gone because `bmad setup` has none.
- Existing answers in `_bmad/config.yaml` are not carried, so `bmad setup <code>` will ask again.

## Convert

On approval, load `shapes/single-skill-module/shape.md` for a one-skill module, `shapes/multi-skill-module/shape.md` otherwise, and emit from its templates. Rewrite every config read and placeholder as planned. Where a member's output path changes, rewrite every member that reads that path to match. Name each skill a member invokes from another module in that member's `bmod.toml` as `{ skill, source }`, and replace each name `scan_paths.py` reports as `retired-skill` with its successor. Remove each skill's step that ran the setup skill or loaded `module-setup.md` when unregistered. Write `retired.toml`. Then delete `files_to_delete`, and nothing else.

Then load `ship.md`.
