{% if workflow.{selector} not in ({allowed_values}) %}{{ halt("workflow.{selector} must be one of {allowed_values}, not " ~ workflow.{selector}) }}{% endif %}
# {title}

{purpose: one paragraph. What the workflow produces, for whom, and what must be true of it for them to act. Said once.}

## Conventions

- Every cross-file reference in this workflow is an absolute snapshot path. Open it directly; do not resolve it relative to a skill directory.
- `{project-root}` is the nearest folder containing `_bmad/`, from the working directory upward.
- When a step directs you to another file, read it fully and follow it. Load one step at a time, when it is reached.
- A step that shows a menu halts there and waits for the user.

## On activation

Run each of these in order before step 1 (`_None._` means skip):

{{ workflow.activation_steps_prepend }}

Hold every entry below as fact for the whole run. Entries prefixed `file:` are paths or globs under `{project-root}` to read; the rest are facts verbatim (`_None._` means none):

{{ workflow.persistent_facts }}

Then run each of these in order (`_None._` means skip):

{{ workflow.activation_steps_append }}

## First step

Read fully and follow `{{ rendered("step-01-{first_step}.md") }}`.
