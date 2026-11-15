# Shape: rendered agent

A persona with a menu whose capabilities are rendered sources, so a team changes a rule inside a capability without forking.

Load `shapes/agent/shape.md` first and keep its Capabilities, Persona and Roster sections. Its Files table and activation steps do not apply: the persona paragraph, the activation and "How <Name> works" live in `workflow.md`.

## Files

| File | From | Holds |
|---|---|---|
| `{target}/SKILL.md` | `shapes/rendered-agent/assets/SKILL-template.md` | description, the render command, the invocation words mapped to `--set` |
| `{target}/workflow.md` | `shapes/rendered-agent/assets/workflow.md` | the activation from `{{ agent.* }}`: persona, facts, dispatch |
| `{target}/references/<capability>.md` | `shapes/rendered-agent/assets/capability.md` | one internal capability each |
| `{target}/customize.toml` | `shapes/rendered-agent/assets/customize-template.toml` | `[agent]` as the agent shape has it; `[workflow]`: every customization point |

Fill each template with `uv run {skill-root}/scripts/process_template.py {skill-root}/shapes/rendered-agent/assets/<template> -o {target}/<file> --var <token>=<value> ...`, passing `{skill}` (the folder name), `{name}`, `{title}`, `{icon}`, `{description}`, the persona and menu fields, and `{capability}`, `{selector}` and `{block}` for one capability; repeat a capability's blocks by hand for the others. Jinja passes through untouched. Then write by hand each `{...}` left that is not a run-time token; `{project-root}` and `{skill-root}` stay for run time.

## Rules

- `SKILL.md` only runs `uv run --no-cache "{project-root}/_bmad/scripts/render_skill.py" --project-root "{project-root}" --skill "{skill-root}"`, maps the words of the invocation to `--set workflow.<key>=<value>`, follows the printed `workflow.md`, and halts on any failure. It holds no Jinja, because the renderer excludes it.
- Jinja (`{{ agent.key }}`, `{{ workflow.key }}`, `{% if %}`, `rendered("references/<capability>.md")`) lives only in `workflow.md` and the capabilities. `agent` is the `[agent]` table and `workflow` the `[workflow]` table, both with the team's overrides merged in.
- An agent-facing `{{placeholder}}` sits inside `{% raw %}...{% endraw %}`; a single-brace `{placeholder}` passes through untouched.
- The agent's documents go under `{{ initiative_folder }}`.
- A customization value the templates cannot act on, such as a misspelled selector, is rejected at the top of `workflow.md` with `{{ halt("...") }}`, one guard per selector.
- A capability item's prompt is `Read `{skill-root}/references/<capability>.md` fully and follow it.`, as the agent shape has it; the renderer binds `{skill-root}` in a customization value to the generation, so the path is the rendered capability. A capability that hands to another file names it as `{{ rendered("references/<file>.md") }}`.
- Dispatch shows no menu: a request that names its intent runs the matching item, a request that fits nothing is a conversation, and asked what it does the agent answers in a sentence or two from the menu in its own voice. Codes stay valid shortcuts.
- A customization point is a `[workflow]` key inserted with `{{ workflow.<key> }}` at the one spot where it acts, named `<capability>_<point>`.
- Every point is declared before any team asks: a before and after instruction per capability, each selector, each instruction block a team would replace whole. A key no source inserts is not declared.
- An instruction a team may replace whole is a `"""` block scalar, a selector is a scalar with its allowed values in the comment above it, and halts on any other value, and an empty default renders nothing. Every key's comment says where it lands.
- `activation_steps_prepend`, `activation_steps_append` and `persistent_facts` stay in `[agent]`; `[workflow]` holds only the capability points.
- Teams override in `{project-root}/_bmad/custom/<name>.toml` or `<name>.user.toml`; a single run overrides with `--set`.
- No file whose name contains `template` carries `{{ config.* }}`, `{{ workflow.* }}` or `{{ agent.* }}`.
