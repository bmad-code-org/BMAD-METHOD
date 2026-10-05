# Standards

The contract a built skill meets; `canon.md` covers the prose.

## Frontmatter

`name` and `description` only. `name` equals the folder name, kebab-case. `bmad-` belongs to modules shipped by the bmad-code-org (`^bmad-[a-z0-9]+(?:-[a-z0-9]+)*$`); anyone else's module skills carry its own code as prefix; a lone skill is a plain name, and one with the user's prefix is better. `description`: a single-quoted YAML string, aiming under 500 characters with 1024 as the ceiling, per the canon's trigger section. `disable-model-invocation: true` is the one further key, for a skill only ever called by name, where the host honours it.

## Layout

`SKILL.md` at the root. `references/` for prompt content a branch loads, one level deep. `scripts/` for deterministic code, tests in `scripts/tests/`. `assets/` for templates and examples of emitted output. Folders stay flat; group files with a filename prefix (`scan-*.md`), not a subfolder. Only a rendered skill keeps `workflow.md` and step files at root. An agent whose internal routes would not fit a flat folder may group them in subfolders by axis, as `bmad-toolsmith` does; each route file then names the conventions it depends on, because the entry may have left context by the time it loads.

## Paths

`{project-root}` is the nearest folder holding `_bmad/`, `{skill-root}` the skill's folder. A skill's own script runs as `uv run {skill-root}/scripts/<name>.py`, a runtime script as `uv run {project-root}/_bmad/scripts/<name>.py`; never a bare `scripts/` call, which resolves from the working directory, and never `python`, `python3` or `pip`, since `uv run` reads the script's PEP 723 header for its dependencies. Every backticked path resolves to a real file. Never a path into another skill: to use one, write "invoke the `<name>` skill". Never `module.yaml`, `module-help.csv` or `_bmad/config.yaml`, the old format. Config: `resolve_config.py --key core.<key>` or `--key modules.<code>.<key>`; customization: `resolve_customization.py --key workflow` or `--key agent`. Config values already hold `{project-root}`; never prefix them.

## Output

A document lands at `<type>-<slug>/<type>-<slug>.md` under `{output_folder}/{active_initiative}/`.

## customize.toml

One table, read in activation. `[workflow]` for a skill: `activation_steps_prepend`, `activation_steps_append`, `persistent_facts`, `on_complete`, `<purpose>_output_path`, `run_folder_pattern`, and its own scalars, each commented with when to override it. `[agent]` for an agent: `name`, `title`, `icon`, `role`, `identity`, `communication_style`, `principles`, the two step arrays, `persistent_facts`, and `[[agent.menu]]` items with `code`, `description` and exactly one of `skill` or `prompt`. The body reads values as `{workflow.<key>}` or `{agent.<key>}`; a value declared but hardcoded in the body makes every override a silent no-op. Scalars override, arrays append, arrays of tables merge by `code` or `id`. No boolean toggles; a switch means the author never decided. Reading is the resolver's job; writing is the `bmad-customize` skill's, which authors the override files under `_bmad/custom/` for any skill with a `customize.toml`. A skill never writes there, never merges its own TOML, and never carries a second code path for when `_bmad/` is absent: it offers setup. When users will change a value, the body says so in one line: invoke the `bmad-customize` skill naming the key, and if it is not installed offer `npx skills add bmad-code-org/BMAD-METHOD --skill bmad-customize`.

## bmod.toml

A skill in a module: `[skill]` with `bmod` (the record folder), `source` (the record's `update_source`), `required_skills` (it invokes them), `recommended_skills` (they help beside it) and `scripts` it ships. A dependency is a plain name for the same source, `{ skill, source, version? }` for another. A single-skill module carries `[bmod]` (`code`, `version`, `update_source`, `skills`, `required_skills`) and an empty `[skill]` in one file; a multi-skill module keeps `[bmod]` in a `bmod-<code>` record folder with `help/` and, with agents, `roster.toml`. A skill outside BMad needs none.

## Scripts

A script does work that has one right answer per input: parsing, counting, resolving paths, validating structure, rendering a template, diffing. Prose does work that turns on meaning. Tests assert what a script produced, never what a model wrote or what a prompt file says. Python with a PEP 723 header, `requires-python = ">=3.11"`, dependencies listed. argparse with `--help`. JSON on stdout when a model reads the result. Non-zero exit with a reason, never an error deferred to the model. Stdlib first, a graceful fallback when an optional import is absent. A test at `scripts/tests/test_<name>.py` using `unittest`. No model ids or time estimates anywhere in a skill.

## Memory agents

The sanctum lives at `{project-root}/_bmad/memory/{name}/`, `{name}` being the skill name; the agent needs the skill bundle only for first wake and init. Waking loads the identity files (PERSONA, CREED, BOND, HOW-I-REMEMBER as the layout guide, CAPABILITIES) and a generated map; memory is small files under `memory/<kind>/` and a write-once `raw/` layer, read as a conversation reaches them. The owner's name and language come from the First Breath conversation into BOND.md, never from config.
