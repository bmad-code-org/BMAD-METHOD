---
name: bmad-dev-auto
description: 'Runs a full unattended development loop for one precise orchestrator task: resolve input, write or resume a machine-owned spec, implement, review, repair or escalate, and emit structured artifacts. Use when bmad-auto or another orchestrator launches a non-interactive development session with no human present.'
---

# Dev Auto Workflow

**Goal:** Execute one orchestrator-supplied development task from input resolution through planning, implementation, review, repair, and structured completion without human interaction.

**Execution posture:** Machine-first. Assume no human is present in the session.

## Non-Interactive Contract

- Never greet.
- Never ask questions.
- Never present menus.
- Never pause for approval.
- Never rely on conversational checkpoints.
- Never require pasted review results or out-of-band human decisions.
- If required information is missing, write a blocked result artifact and end cleanly.
- If a decision would normally require a human, classify it as an escalation for the orchestrator.

## Responsibility Boundary

`bmad-dev-auto` owns the end-to-end development judgment loop for one task:

- Resolve the orchestrator invocation into a concrete run.
- Plan or resume from disk artifacts.
- Write and maintain the task spec.
- Implement the code.
- Review the implementation.
- Decide whether findings require code repair, spec repair, deferred work, rejection, or escalation.
- Emit structured result artifacts.

The orchestrator owns process-level concerns:

- Task selection.
- Session launching.
- Worktree creation and cleanup.
- Commit, push, and PR behavior.
- Cross-run coordination.

## Continuity Rule

The same active session that interprets the task and writes the spec must retain final judgment through implementation, review triage, repair, and finalization. Subagents may be used for bounded exploration or independent review signals, but they do not own the development decision. This session synthesizes their output against the spec, implementation rationale, and current code state.

## Invocation Shape

The triggering prompt is the invocation. Prefer a structured block with these fields:

- `task_id`: stable orchestrator task identifier.
- `run_id`: stable attempt identifier. If absent, derive one from date and HEAD.
- `intent`: precise change request.
- `source_refs`: optional files, issue text, story text, or orchestrator notes to load.
- `resume_from`: optional path to an existing auto run directory or spec file.
- `constraints`: optional invariants, allowed paths, forbidden paths, compatibility requirements, or verification requirements.
- `acceptance`: optional expected behavior in Given/When/Then or equivalent machine-readable form.
- `verification`: optional commands the orchestrator expects to run.

Minimum viable invocation: a precise `intent`. If neither `intent` nor `resume_from` can be resolved, the run must end as `blocked`.

## Artifact Contract

Write run artifacts under `{implementation_artifacts}/auto/{task_id}/` unless `resume_from` points to an existing run directory:

- `spec.md` -- machine-owned task spec.
- `review.md` -- final review and triage record.
- `result.json` -- valid JSON result for the orchestrator.

Append incidental pre-existing issues to `{implementation_artifacts}/deferred-work.md`.

## On Activation

### Step 1: Resolve the Workflow Block

Run: `python3 {project-root}/_bmad/scripts/resolve_customization.py --skill {skill-root} --key workflow`

If the script fails, resolve the `workflow` block yourself by reading these three files in base -> team -> user order and applying the same structural merge rules as the resolver:

1. `{skill-root}/customize.toml` -- defaults
2. `{project-root}/_bmad/custom/{skill-name}.toml` -- team overrides
3. `{project-root}/_bmad/custom/{skill-name}.user.toml` -- personal overrides

Any missing file is skipped. Scalars override, tables deep-merge, arrays of tables keyed by `code` or `id` replace matching entries and append new entries, and all other arrays append.

### Step 2: Execute Prepend Steps

Execute each entry in `{workflow.activation_steps_prepend}` in order before proceeding.

### Step 3: Load Persistent Facts

Treat every entry in `{workflow.persistent_facts}` as foundational context you carry for the rest of the workflow run. Entries prefixed `file:` are paths or globs under `{project-root}` -- load the referenced contents as facts. All other entries are facts verbatim.

### Step 4: Load Config

Load config from `{project-root}/_bmad/bmm/config.yaml` and resolve:

- `project_name`, `planning_artifacts`, `implementation_artifacts`, `user_name`
- `communication_language`, `document_output_language`, `user_skill_level`
- `date` as system-generated current datetime
- `project_context` = `**/project-context.md` (load if exists)
- CLAUDE.md / memory files (load if exist)
- YOU MUST ALWAYS SPEAK OUTPUT in your Agent communication style with the config `{communication_language}`

Do not greet after loading config.

### Step 5: Execute Append Steps

Execute each entry in `{workflow.activation_steps_append}` in order.

Activation is complete. If `activation_steps_prepend` or `activation_steps_append` were non-empty, record their execution in the run notes. Do not wait for acknowledgement.

## Workflow Architecture

This uses sequential step files for deterministic execution:

- Read the entire current step file before acting.
- Execute sections in order.
- Do not load future step files until the current step reaches its `NEXT` section.
- Persist state to disk as artifacts, not conversation.
- End only through a written `result.json` or a clean terminal branch explicitly defined by the current step.

## First Step

Read fully and follow `./steps/step-01-resolve.md`.
