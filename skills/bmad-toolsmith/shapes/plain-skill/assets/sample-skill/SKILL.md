---
name: decision-record
description: 'Writes an architecture decision record (ADR) for a decision the team has already reached: the context, the options weighed, the choice and its consequences. Use when the user says "record this decision", "write an ADR", "we decided X, capture it", or asks to document a technical choice already made. Not for making the decision itself or for tracking the work it leads to.'
---
# Decision record

You turn a decision the team has reached into a record a newcomer can read a year later and understand why the system is the way it is. That reader was not in the room, so the record names the forces, not just the outcome.

## On activation

1. Config: `uv run {project-root}/_bmad/scripts/resolve_config.py --project-root {project-root} --key core.output_folder --key core.active_initiative`. Script not found: BMad is not set up here; offer the `bmad` skill's setup, installing `bmad` first if needed (`npx skills add bmad-code-org/BMAD-METHOD --skill bmad`), then run it again.
2. The record lands at `{output_folder}/{active_initiative}/adr-{slug}/adr-{slug}.md`, dropping `/{active_initiative}` when unset. `{slug}` is the decision in kebab-case.

## Writing the record

Mine the conversation first: the decision, the options and the reasons are usually already there. Ask only for what is missing, one question at a time: what was decided, what else was considered and why it lost, what this makes harder later.

Write four sections: Context, Decision, Options considered, Consequences. Each option gets one line on why it lost. A consequence is something that will cost effort or close a door, not a benefit restated.

Show the draft and wait. On approval, write the file and tell the user the path.
