# The active initiative

Work for one body of work lives in a container folder under `output_folder`: `program-*`, `initiative-*`, or standalone `epic-*` (and nested `program-*/tickets/initiative-*`). `active_initiative` under `[core]` in `_bmad/custom/config.user.toml` names the active container path relative to `output_folder`. A skill that handed off here continues its own work when this ends.

1. Run `uv run "{project-root}/_bmad/scripts/resolve_config.py" --project-root "{project-root}" --key core.output_folder --key core.active_initiative`. Script not found, or no `output_folder`: BMad is not set up here; offer `bmad setup` first.
2. Tell the user the active initiative, or none. List top-level `program-*`, `initiative-*`, and `epic-*` folders under `{output_folder}` (with `{project-root}` substituted), and any nested `initiative-*` folders under `{output_folder}/program-*/tickets/`.
3. The user picks one, asks for a new one, or clears it. For a new one, ask its name and level (`program`, `initiative`, or `epic`; default `initiative`), then write `<base>/<type>-<slug>/<type>-<slug>.md` (kebab-case `<slug>`) with frontmatter only: `type`, `title`, and `parent` (`none`, or the parent folder name). Use `{output_folder}` as `<base>`, or `{output_folder}/<parent-path>/tickets` (relative to `output_folder`) when nesting an `initiative` in a `program` or an `epic` in an `initiative`.
4. Write `active_initiative = "<path relative to output_folder>"` under `[core]` in `{project-root}/_bmad/custom/config.user.toml`, creating the file or the table when missing and keeping the rest of the file. Clearing removes the line.
5. Confirm the change in one line.

