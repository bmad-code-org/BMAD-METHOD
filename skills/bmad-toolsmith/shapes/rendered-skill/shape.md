# Shape: rendered skill

A skill whose Markdown is rendered once per run from `customize.toml` and the team's overrides, so a team swaps a step, a rule or a route without forking. The conversation has reached it when teams must change what the skill does (not only add facts), when a selector chooses between routes, or when the body is long enough to split into steps loaded one at a time. The model is `bmad-build`: a `SKILL.md` that only renders, a `workflow.md` that activates and hands to step 1, numbered steps.

## Files

| File | From |
|---|---|
| `SKILL.md` | `assets/SKILL-template.md` |
| `workflow.md` | `assets/workflow.md` |
| `step-NN-<name>.md`, one per step | `assets/step.md` |
| `customize.toml` | `assets/customize-template.toml` |

## Rules

- `SKILL.md` does one thing: runs `uv run --no-cache "{project-root}/_bmad/scripts/render_skill.py" --project-root "{project-root}" --skill "{skill-root}"`, maps the words of the invocation to `--set workflow.<key>=<value>`, follows the printed `workflow.md`, and halts on any failure. No Jinja in it; the renderer excludes it.
- Jinja (`{{ workflow.key }}`, `{% if %}`, `rendered("step-02-<name>.md")`) lives only in `workflow.md` and the steps. An agent-facing `{{placeholder}}` sits inside `{% raw %}...{% endraw %}`; a single-brace `{placeholder}` passes through untouched. A customization value the templates cannot act on, such as a misspelled selector, is rejected at the top of `workflow.md` with `{{ halt("...") }}`, one guard per selector.
- `customize.toml` holds `[workflow]` with `activation_steps_prepend`, `activation_steps_append` and `persistent_facts`. A selector is a scalar with its allowed values in the comment above it; an instruction a team may replace whole is a `"""` block scalar. Teams override in `{project-root}/_bmad/custom/<name>.toml` or `<name>.user.toml`; a single run overrides with `--set`.
- Each step is loaded when reached, says at the top what it produces, and ends by naming the next step as `{{ rendered("step-NN-<name>.md") }}` or by saying the workflow is complete. A step that shows a menu halts and waits for the user. No file whose name contains `template` carries `{{ config.* }}` or `{{ workflow.* }}`.
