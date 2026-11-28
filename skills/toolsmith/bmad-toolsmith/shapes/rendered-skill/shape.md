# Shape: rendered skill

A skill whose Markdown is rendered once per run from `customize.toml` and the team's overrides.

## Files

| File | From |
|---|---|
| `{target}/SKILL.md` | `shapes/rendered-skill/assets/SKILL-template.md` |
| `{target}/workflow.md` | `shapes/rendered-skill/assets/workflow.md` |
| `{target}/step-NN-<name>.md`, one per step | `shapes/rendered-skill/assets/step.md` |
| `{target}/customize.toml` | `shapes/rendered-skill/assets/customize-template.toml` |

Fill each template with `uv run "{skill-root}/scripts/process_template.py" "{skill-root}/shapes/rendered-skill/assets/<template>" -o "{target}/<file>" --var <token>=<value> ...`, passing `{name}`, `{title}`, `{description}`, `{selector}`, `{block}`, the selector's values and the step names. Jinja passes through untouched. Then write by hand each `{...}` left that is not a run-time token such as `{project-root}`.

## Rules

- `SKILL.md` only renders: it runs `uv run --cache-dir "{project-root}/_bmad/render/.uv-cache" "{project-root}/_bmad/scripts/render_skill.py" --project-root "{project-root}" --skill "{skill-root}"`, maps the words of the invocation to `--set workflow.<key>=<value>`, follows the printed `workflow.md`, and halts on any failure.
- Jinja (`{{ workflow.key }}`, `{% if %}`, `rendered("step-02-<name>.md")`) lives only in `workflow.md` and the steps; the renderer excludes `SKILL.md`.
- An agent-facing `{{placeholder}}` sits inside `{% raw %}...{% endraw %}`; a single-brace `{placeholder}` passes through untouched.
- The skill's documents go under `{{ initiative_folder }}`, the output folder plus the active initiative, if set.
- A customization value the templates cannot act on, such as a misspelled selector, is rejected at the top of `workflow.md` with `{{ halt("...") }}`, one guard per selector.
- `customize.toml` holds `[workflow]` with `activation_steps_prepend`, `activation_steps_append`, `persistent_facts` and `on_complete`, which the last step inserts before it says the workflow is complete.
- A selector is a scalar with its allowed values in the comment above it; an instruction a team may replace whole is a `"""` block scalar.
- Teams override in `{project-root}/_bmad/custom/<name>.toml` or `<name>.user.toml`; a single run overrides with `--set`.
- Each step is loaded when reached, says at the top what it produces, and ends by naming the next step as `{{ rendered("step-NN-<name>.md") }}` or by saying the workflow is complete.
- A step that shows a menu halts and waits for the user.
- No file whose name contains `template` carries `{{ config.* }}` or `{{ workflow.* }}`.
