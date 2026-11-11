---
name: {name}
description: '{description}'
---
# {title}

{purpose: one paragraph. The stance the skill acts from, the outcome it produces, who consumes that output, and what must be true of it for them to act. Said once; nothing below restates it.}

## On activation

{Keep only the steps this skill needs. A skill outside BMad keeps none and this section goes.}

1. Config: `uv run {project-root}/_bmad/scripts/resolve_config.py --project-root {project-root} --key core.output_folder --key core.active_initiative`. Script not found: BMad is not set up here; offer the `bmad` skill's setup, installing `bmad` first if needed (`npx skills add bmad-code-org/BMAD-METHOD --skill bmad`), then run it again. {Add `--key modules.<code>.<key>` for each module setting this skill reads.}
2. Customization: `uv run {project-root}/_bmad/scripts/resolve_customization.py --skill {skill-root} --project-root {project-root} --key workflow`; on any other failure read `{skill-root}/customize.toml` and use its defaults. Run each entry of `{workflow.activation_steps_prepend}`, hold every entry of `{workflow.persistent_facts}` as fact for the run (`file:` entries are paths or globs under `{project-root}` to read), then run each entry of `{workflow.activation_steps_append}`.
3. Output: the document lands at `{output_folder}/{active_initiative}/{type}-{slug}/{type}-{slug}.md`, dropping `/{active_initiative}` when unset. `{slug}` is what the document is about, in kebab-case.

## {body}

{What the skill does, as outcomes with their reason. Exact procedure only where a wrong move costs something. Name a reference when its branch is reached, never ahead of it: "read `references/<topic>.md` fully and follow it". A skill with `customize.toml` runs `{workflow.on_complete}` last. When users will change a value it reads, one line: "To change <what>, invoke the `bmad-customize` skill and name `workflow.<key>`; if it is not installed, offer `npx skills add bmad-code-org/BMAD-METHOD --skill bmad-customize`."}
