# The active initiative

Work for one body of work lives in a container folder under `output_folder`: `program-*`, `initiative-*`, or standalone `epic-*` (and nested `program-*/tickets/initiative-*`). `active_initiative` under `[core]` in `_bmad/custom/config.user.toml` names the active container path relative to `output_folder`. A skill that handed off here continues its own work when this ends.

1. Run `uv run "{project-root}/_bmad/scripts/resolve_config.py" --project-root "{project-root}" --key core.output_folder --key core.active_initiative`. Script not found, or no `output_folder`: BMad is not set up here; offer `bmad setup` first.
2. Tell the user the active initiative, or none. List top-level `program-*`, `initiative-*`, and `epic-*` folders under `{output_folder}` (with `{project-root}` substituted), and any nested `initiative-*` folders under `{output_folder}/program-*/tickets/`.
3. The user picks one, asks for a new one, or clears it. For a new one, ask its name and container level (`program`, `initiative`, or `epic`; default `initiative`), and create `<base>/<type>-<slug>/<type>-<slug>.md` with `<slug>` in kebab-case and `<base>` as `{output_folder}` (or `{output_folder}/<parent>/tickets` when nested inside a container). Write only frontmatter: `type: <program|initiative|epic>`, `title`, and `parent: none` (or the parent container folder name when nested).
4. Write `active_initiative = "<path relative to output_folder>"` under `[core]` in `{project-root}/_bmad/custom/config.user.toml`, creating the file or the table when missing and keeping the rest of the file. Clearing removes the line.
5. Confirm the change in one line.

