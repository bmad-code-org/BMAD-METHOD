# The active initiative

Work for one body of work lives in an initiative folder under `output_folder`. `active_initiative` under `[modules.bmm]` in `_bmad/custom/config.user.toml` names the one in use. A skill that handed off here continues its own work when this ends.

1. Run `uv run {project-root}/_bmad/scripts/resolve_config.py --project-root {project-root} --key core.output_folder --key modules.bmm.active_initiative`. Script not found, or no `output_folder`: BMad is not set up here; offer setup (`references/setup.md`) first.
2. Tell the user the active initiative, or none. List the `initiative-*` folders under `{output_folder}`, with `{project-root}` substituted.
3. The user picks one, asks for a new one, or clears it. For a new one, ask its name and create `{output_folder}/initiative-<slug>/initiative-<slug>.md`, `<slug>` the name in kebab-case, holding only frontmatter: `type: initiative`, `title`, `parent: none`. The ticketing skill fills it in when the user plans the work.
4. Write `active_initiative = "<folder name>"` under `[modules.bmm]` in `{project-root}/_bmad/custom/config.user.toml`, creating the file or the table when missing and keeping the rest of the file. Clearing removes the line.
5. Confirm the change in one line.

