# Shape: rendered agent

The agent shape rendered: a persona with a menu whose capabilities are rendered sources, so a team changes a rule inside a capability without forking. The conversation has reached it when the user wants someone to talk to (a name, a role, a way of working) who does several related things, and teams must change what those things do, not only add facts. A persona whose capabilities ship as they are: `shapes/agent/shape.md`. Must remember between sessions: `shapes/memory-agent/shape.md`, which stays on the resolver bootloader. The model is `bmad-build`'s form with the agent shape's content: a `SKILL.md` that only renders, a `workflow.md` that activates and dispatches, one rendered source per capability.

## Files

| File | From | Holds |
|---|---|---|
| `SKILL.md` | `assets/SKILL-template.md` | description, the render command, the invocation words mapped to `--set` |
| `workflow.md` | `assets/workflow.md` | the activation from `{{ agent.* }}`: persona, facts, dispatch |
| `references/<capability>.md` | `assets/capability.md` | one internal capability each, its customization points inserted where they act |
| `customize.toml` | `assets/customize-template.toml` | `[agent]` as the agent shape has it; `[workflow]`: every customization point |

Build-time tokens: `{skill}` (folder name), `{name}`, `{title}`, `{icon}`, `{description}`, the persona and menu fields; `{project-root}` and `{skill-root}` are runtime. The agent shape's Capabilities and Roster sections hold as written, and its Persona section too, except that the persona paragraph, the activation and "How <Name> works" live in `workflow.md`, not `SKILL.md`, and there are no numbered activation steps; this file adds what rendering changes.

## Rules

- `SKILL.md` does one thing: runs `uv run --no-cache "{project-root}/_bmad/scripts/render_skill.py" --project-root "{project-root}" --skill "{skill-root}"`, maps the words of the invocation to `--set workflow.<key>=<value>`, follows the printed `workflow.md`, and halts on any failure. No Jinja in it; the renderer excludes it.
- Jinja (`{{ agent.key }}`, `{{ workflow.key }}`, `{% if %}`, `rendered("references/<capability>.md")`) lives only in `workflow.md` and the capabilities. `agent` is the `[agent]` table and `workflow` the `[workflow]` table, both through the same layers. An agent-facing `{{placeholder}}` sits inside `{% raw %}...{% endraw %}`; a single-brace `{placeholder}` passes through untouched. The agent's documents go under `{{ initiative_folder }}`. A customization value the templates cannot act on, such as a misspelled selector, is rejected at the top of `workflow.md` with `{{ halt("...") }}`, one guard per selector.
- A capability item's prompt is `Read `{skill-root}/references/<capability>.md` fully and follow it.`, as the agent shape has it; the renderer binds `{skill-root}` in a customization value to the generation, so the path is the rendered capability. A capability that hands to another file names it as `{{ rendered("references/<file>.md") }}`.
- Dispatch shows no menu, ever: a request that names its intent runs the matching item, a request that fits nothing is a conversation, and asked what it does the agent answers in a sentence or two from the menu in its own voice. Codes stay valid shortcuts.
- A customization point is a `[workflow]` key inserted with `{{ workflow.<key> }}` at the one spot where it acts, named `<capability>_<point>` (`spec_before`, `spec_after`, `slice_to_epics`). Every point is declared before any team asks: a before and after instruction per capability, each selector, each instruction block a team would replace whole. An instruction a team may replace whole is a `"""` block scalar; a selector is a scalar with its allowed values in the comment above it, and halts on any other value; an empty default renders nothing; a key no source inserts is not declared. Every key's comment says where it lands.
- `activation_steps_prepend`, `activation_steps_append` and `persistent_facts` stay in `[agent]`; `[workflow]` holds only the capability points. Teams override in `{project-root}/_bmad/custom/<name>.toml` or `<name>.user.toml`; a single run overrides with `--set`.
- No file whose name contains `template` carries `{{ config.* }}`, `{{ workflow.* }}` or `{{ agent.* }}`.
