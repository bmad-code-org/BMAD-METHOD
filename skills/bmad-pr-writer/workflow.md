Write a pull request title and body, or a commit message, for a
change that already exists. A reviewer who did not see the work
should learn from it what changed for the user, what changed in the
code, how it was verified, and what is still open, then know exactly
what to do.

# Rules

- Never claim a check that did not run. Every PR body has a
  **Not verified:** line, or says that everything was checked.
- Label simulated, mocked, or fixture evidence as such.
- No tool or model attribution: no "Generated with" footer, no
  `Co-Authored-By` trailer for a tool, no session links.
- Never push or open the PR without the user's approval of the
  final text.
- Follow `{{ rendered("references/style.md") }}` for titles, wording, and commits.
{% if workflow.title_style == "conventional" %}
- Titles and commit subjects use Conventional Commits:
  `type: imperative summary`, under 72 characters.
{% else %}
- Titles and commit subjects are one plain imperative sentence about
  what the user gets, with no `feat:`/`fix:` prefix, unless the
  repo's own rules require one.
{% endif %}

{% if workflow.on_activation %}
# On Activation

{{ workflow.on_activation }}
{% endif %}
{% if workflow.persistent_facts %}
# Persistent facts

Do not compact these away. Load `file:` paths. Expand globs and read
every match. Other entries are facts.

{{ workflow.persistent_facts }}

{% endif %}
# Workflow

Follow the step files in order. Read one step fully, execute it, then
load the next step only when directed. Do not skip, reorder, or
pre-load steps.

# FIRST STEP

Read fully and follow: `{{ rendered("step-01-gather.md") }}` to begin.
