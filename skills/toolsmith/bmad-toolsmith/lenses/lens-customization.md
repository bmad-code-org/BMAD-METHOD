# Lens: customization

Lane: the `customize.toml` surface and its wiring, per the standards' customize.toml section. The bar: every declared value reaches the place it changes; every value a team would override is declared. `customize_findings` in the pre-pass holds the structural checks; each rule below names its own.

- Persona keys (`identity`, `communication_style`, `principles`) in `[workflow]`, or keys in `[agent]` that the standards do not list there: high.
- Not resolved: in a skill that is not rendered, no `resolve_customization.py` call in activation, or a token naming no key (`unknown-token`): high.
- Declared and hardcoded: a declared key no file inserts, as `{workflow.<key>}` or, in a rendered skill or agent, `{{ workflow.<key> }}` (`unread-key`): high.
- Hardcoded values a team would override (`<purpose>_output_path`, a template path, a completion hook): low each, medium at two or more.
- Array-of-tables entries without `code` or `id` (`entry-without-id`), or mixing the two: medium.
- A boolean that switches behavior (`boolean-toggle`): one medium, three or more high. A per-entry attribute in an array of tables (`private = true`) is data, not a switch.
- Old-format config (the files the standards' Paths section names), installer questions, a settings concept in the skill, or config read other than via `resolve_config.py`: high.
- The skill writing under `_bmad/custom/`, merging `customize.toml` with override files itself, or carrying its own reader for when `_bmad/` is absent: high, except a memory agent writing its own `[[agent.dominion]]` entries. `script_findings` carries `custom-io` for the script side.
- Users who will change a value and no line telling them to invoke `bmad-customize`: low.
- An entry in `toml_errors`: high, naming the file and the parse error. Judge the shape from the files when `shape_hint` is `unknown` because of it.
- Jinja where `SKILL.md` does not call `render_skill.py`: high. In a rendered skill or rendered agent, `config.*`, `workflow.*` or `agent.*` in a file named "template": high.
- Agent (`shape_hint` is `agent` or `memory-agent`): `agent-missing-field` or `menu-item-target`: high. A memory agent's `[agent]` duplicating its sanctum: medium.

Not flagged: a line telling the user to invoke `bmad-customize`; an empty `persistent_facts` (shipped skills carry none); `name` and `title` being fixed; reading project config at activation; a skill with no `customize.toml` and nothing a team would change.
