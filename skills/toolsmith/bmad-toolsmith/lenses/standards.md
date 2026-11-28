# Standards

The contract a built skill meets; the canon covers the prose.

## Frontmatter

- `name` and `description` only. `disable-model-invocation: true` is the one further key, for a skill only ever called by name, where the host honours it.
- `name` equals the folder name, kebab-case. `bmad-` belongs to modules shipped by the bmad-code-org (`^bmad-[a-z0-9]+(?:-[a-z0-9]+)*$`). Anyone else's module skills carry its own code as prefix. A lone skill is a plain name, better with the user's prefix.
- `description` is a single-quoted YAML string in the canon's two parts, 1024 characters at most.

## Layout

- `SKILL.md` at the root; `references/` for prompt content a branch loads, one level deep; `scripts/` for deterministic code, its tests in `{tests}`, outside the skill; `assets/` for templates and examples of emitted output; `doc-templates/` in a module record for the `bmad-facilitate` templates it ships.
- Folders stay flat; group files with a filename prefix (`scan-*.md`), not a subfolder. Only a rendered skill keeps `workflow.md` and step files at root.
- An agent whose routes would not fit a flat folder may group them in subfolders by axis, as `bmad-toolsmith` does. Each route file then names the conventions it depends on, because the entry may have left context by the time it loads.

## Paths

- `{project-root}` is the nearest folder holding `_bmad/`, `{skill-root}` the skill's folder.
- A skill's own script runs as `uv run "{skill-root}/scripts/<name>.py"`, a runtime script as `uv run "{project-root}/_bmad/scripts/<name>.py"`. Never a bare `scripts/` call, which resolves from the working directory, and never `python`, `python3` or `pip`: `uv run` reads the script's PEP 723 header for its dependencies.
- Every backticked path resolves to a real file. Never a path into another skill: write "invoke the `<name>` skill".
- Never `module.yaml`, `module-help.csv` or `_bmad/config.yaml`, the old format.
- Config is read with `resolve_config.py --key core.<key>` or `--key modules.<code>.<key>`, customization with `resolve_customization.py --key workflow` or `--key agent`. Config values already hold `{project-root}`; never prefix them.

## Output

A document lands at `<type>-<slug>/<type>-<slug>.md` under `{output_folder}/{active_initiative}/`.

## customize.toml

Activation resolves it.

- A skill has `[workflow]`: `activation_steps_prepend`, `activation_steps_append`, `persistent_facts`, `on_complete`, `<purpose>_output_path`, `run_folder_pattern`, and its own scalars, each commented with when to override it.
- An agent has `[agent]`: `name`, `title`, `icon`, `role`, `identity`, `communication_style`, `principles`, the two step arrays, `persistent_facts`, and `[[agent.menu]]` items with `code`, `description` and exactly one of `skill` or `prompt`. Its own scalars go in a `[workflow]` table beside `[agent]`, resolved in the same call. An agent whose capabilities are fixed routes no team should swap lists them in `SKILL.md` and ships no `[[agent.menu]]`; teams change it through the activation steps, as with `bmad-toolsmith`.
- A memory agent's `[agent]` keeps `name`, `title`, `icon`, the two step arrays and `persistent_facts` and adds `[[agent.dominion]]`; its persona and capabilities live in the sanctum.

The body reads values as `{workflow.<key>}` or `{agent.<key>}`; a value declared but hardcoded in the body makes every override a silent no-op.

Scalars override, arrays append, arrays of tables merge by `code` or `id`. No boolean toggles; a switch means the author never decided.

Reading is the resolver's job; writing is the `bmad-customize` skill's, which authors the override files under `_bmad/custom/` for any skill with a `customize.toml`. A skill never writes there, never merges its own TOML, and never carries a second code path for when `_bmad/` is absent: it offers setup. The one exception: a memory agent writes its own `[[agent.dominion]]` entries, each restated whole, to its own `_bmad/custom/<skill>.toml` or `.user.toml`, because First Breath settles them in character.

When users will change a value, the body says so in one line: invoke the `bmad-customize` skill naming the key, and if it is not installed offer `npx skills add bmad-code-org/BMAD-METHOD --skill bmad-customize`.

## bmod.toml

- A skill in a module has `[skill]` with `bmod` (the record folder), `source` (the record's `update_source`), `required_skills` (it invokes them), `recommended_skills` (they help beside it) and the `scripts` it ships. A dependency is a plain name for the same source, `{ skill, source, version? }` for another.
- A single-skill module carries `[bmod]` (`code`, `version`, `update_source`, `skills`, `required_skills`) and an empty `[skill]` in one file.
- A multi-skill module keeps `[bmod]` in a `bmod-<code>` record folder with `help/` and, with agents, `roster.toml`.
- A skill outside BMad needs none.

## Help files

A module record's `help/` has one reader, the `bmad` help agent. `help.md` loads on every help question for every installed module, so it stays a short routing index: what each skill gives, when to recommend it, what to offer next, and which topic file answers what.

A `help/<topic>.md` topic loads only when `help.md` names it for the question at hand. Cross-references between help files use module-relative `help/<topic>.md` paths (checked by `validate_manifests.py`). No help file holds install mechanics or `bmod.toml` key detail; the help agent cannot act on them.

## Scripts

A script does work that has one right answer per input: parsing, counting, resolving paths, validating structure, rendering a template, diffing. Prose does work that turns on meaning. Tests assert what a script produced, never what a model wrote or what a prompt file says.

- Python with a PEP 723 header, `requires-python = ">=3.11"`, dependencies listed; stdlib first, with a graceful fallback when an optional import is absent.
- argparse with `--help`. JSON on stdout when a model reads the result. Non-zero exit with a reason, never an error deferred to the model.
- A test at `{tests}/test_<name>.py` using `unittest`.
- No model ids or time estimates anywhere in a skill.

## Memory agents

- The sanctum lives at `{project-root}/_bmad/memory/{name}/`, `{name}` being the skill name. It holds only what the agent learns: built-in capabilities and scripts stay in the skill, and the facts of the work live in the dominion areas `[[agent.dominion]]` lists.
- Waking loads the identity files (PERSONA, CREED, BOND, HOW-I-REMEMBER as the layout guide, CAPABILITIES) and a generated map. Memory is small files under `memory/<kind>/` and a write-once `raw/` layer, read as a conversation reaches them.
- The owner's name and language come from the First Breath conversation into BOND.md, never from config.
