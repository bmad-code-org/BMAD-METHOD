---
name: bmad-dev-auto
description: 'Implements one story or deferred-work bundle unattended for a bmad-auto orchestrator. Use when a machine-run session must execute development work with no human interaction.'
---

# BMad Dev Auto

**Goal:** turn one orchestrator task into verified code plus on-disk artifacts the orchestrator can inspect.

This skill is for unattended runs only. It is not a variant of `bmad-quick-dev`; it is a separate machine-first workflow.

## Contract

- No greeting.
- No questions.
- No menus.
- No editor.
- No commit or push.
- `result.json` is the last successful action.
- If blocked, write `escalation.json`, write `result.json`, and end the turn.

## Invocation

The orchestrator invokes one of:

- `<story-key>`
- `<story-key> --feedback <path>`
- `--dw-bundle <path>`
- `--dw-bundle <path> --feedback <path>`

Environment:

- `BMAD_AUTO_RUN_DIR`
- `BMAD_AUTO_TASK_ID`
- optional `BMAD_AUTO_SKIP_REVIEW=1`

Files:

- result file: `$BMAD_AUTO_RUN_DIR/tasks/$BMAD_AUTO_TASK_ID/result.json`
- escalation file: `$BMAD_AUTO_RUN_DIR/tasks/$BMAD_AUTO_TASK_ID/escalation.json`

## Conventions

- Bare paths resolve from the skill root.
- `{skill-root}` is this installed skill directory.
- `{project-root}` is the working directory.
- `{skill-name}` is the skill directory basename.
- `{workflow.<name>}` comes from the merged `customize.toml` `[workflow]` table.

## On Activation

1. Resolve customization:
   `python3 {project-root}/_bmad/scripts/resolve_customization.py --skill {skill-root} --key workflow`
2. If that fails, merge these in order using BMad structural merge rules:
   - `{skill-root}/customize.toml`
   - `{project-root}/_bmad/custom/{skill-name}.toml`
   - `{project-root}/_bmad/custom/{skill-name}.user.toml`
3. Run each `{workflow.activation_steps_prepend}` entry.
4. Treat each `{workflow.persistent_facts}` entry as persistent context for the whole run.
5. Load config from `{project-root}/_bmad/bmm/config.yaml` and resolve:
   - `project_name`
   - `planning_artifacts`
   - `implementation_artifacts`
   - `communication_language`
   - `document_output_language`
   - `user_skill_level`
   - `date`
   - `sprint_status` = `{implementation_artifacts}/sprint-status.yaml`
6. Run each `{workflow.activation_steps_append}` entry.

## Rules

- Speak tersely. Spend tokens on work, not narration.
- Never wait for user input.
- Treat the invocation as authoritative input.
- Spec target is **1500-4000 tokens**. On real multi-goal scope, split and defer the rest.
- Preserve anything inside `<frozen-after-approval>` once the spec is approved.
- Use the full `git rev-parse HEAD` hash for `baseline_commit`.

## Result Schema

```json
{
  "workflow": "dev-auto",
  "story_key": "<story key or null>",
  "spec_file": "<absolute path>",
  "baseline_commit": "<full hash or NO_VCS>",
  "status": "in-review|done|blocked",
  "tasks_total": 0,
  "tasks_done": 0,
  "verification": [{"command": "<cmd>", "ok": true}],
  "escalations": [{"type": "<kind>", "severity": "CRITICAL|PREFERENCE", "detail": "<detail>"}],
  "dw_ids": ["DW-1"]
}
```

`status` means:

- `in-review`: code complete; a separate review run is expected.
- `done`: no separate review run is expected.
- `blocked`: the task could not continue safely.

## First Step

Read fully and follow `./step-01-resolve.md`.
