{% if workflow.review not in ("quick", "thorough") %}
  {{ halt("workflow.review must be quick or thorough, not " ~ workflow.review) }}
{% endif %}
{% if workflow.interactive is not boolean %}
  {{ halt("workflow.interactive must be true or false, not " ~ workflow.interactive) }}
{% endif %}
{% if workflow.fixes not in ("apply", "handoff") %}
  {{ halt("workflow.fixes must be apply or handoff, not " ~ workflow.fixes) }}
{% endif %}

# Code Review Workflow

Several independent reviewers hunt for defects in a code change; this workflow sends them the change, then verifies, triages, presents, and fixes what they found.

Subagents are an important part of this workflow. Use them wherever a step calls for them, if you can. If you need the user's permission to run them, ask once now for the whole run.

## Conventions

- When a step directs you to another file, read it fully and follow it. Load one step at a time, when it is reached.
- A step that shows a menu or checkpoint halts there and waits for the user.
{% if workflow.fixes == "handoff" %}

## No-code review

Review by inspection only. Do not modify code, run builds or tests, or invoke quality gates.
{% endif %}

## On activation

Run each of these in order before step 1 (`_None._` means skip):

{{ workflow.activation_steps_prepend }}

Hold every entry below as fact for the whole run. Entries prefixed `file:` are paths or globs under `{project-root}` to read; the rest are facts verbatim (`_None._` means none):

{{ workflow.persistent_facts }}

Then run each of these in order (`_None._` means skip):

{{ workflow.activation_steps_append }}

## First step

Read fully and follow `{{ rendered("step-01-gather-context.md") }}`.
