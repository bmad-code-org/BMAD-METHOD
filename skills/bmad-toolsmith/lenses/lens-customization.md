# Lens: customization

Lane: the `customize.toml` surface and its wiring, per `lenses/standards.md`. The bar: every declared value reaches the place it changes; every value a team would override is declared.

- Persona keys (`identity`, `communication_style`, `principles`) in `[workflow]`, or a skill's scalars in `[agent]`: high; the skill wants to be an agent, or the reverse.
- Not resolved: no `resolve_customization.py` call in activation, or `{workflow.*}` and `{agent.*}` tokens naming no key. High; overrides never reach the model.
- Declared and hardcoded: the table declares a scalar the body hardcodes. High; every override is a silent no-op.
- Hardcoded values a team would override (`<purpose>_output_path`, a template path, a completion hook): low each, medium at two or more.
- Arrays of tables without `code` or `id`, or mixing the two: medium; the resolver can only append.
- Boolean toggles: one medium, three or more high; a switch means the author never decided.
- Old-format config (`module.yaml`, `module-help.csv`, `_bmad/config.yaml`), installer questions, a settings concept in the skill, or config read other than via `resolve_config.py`: high.
- The skill writing under `_bmad/custom/`, merging `customize.toml` with override files itself, or carrying its own reader for when `_bmad/` is absent: high. The resolver reads, `bmad-customize` writes, setup installs; `script_findings` carries `custom-io` for the script side. Users who will change a value and no line telling them to invoke `bmad-customize`: low.
- Jinja where `SKILL.md` does not call `render_skill.py`: high; it reaches the model verbatim. In a rendered skill, `config.*` or `workflow.*` in a file named "template": high.
- Agent (`shape_hint` is `agent` or `memory-agent`): `[agent]` missing `name`, `title` or `icon`, or a menu item with both or neither of `skill` and `prompt`: high. A memory agent's `[agent]` duplicating its sanctum: medium; two selves drift.

Not flagged: a line telling the user to invoke `bmad-customize`; an empty `persistent_facts` (shipped skills carry none); `name` and `title` being fixed; reading project config at activation; a skill with no `customize.toml` and nothing a team would change.
