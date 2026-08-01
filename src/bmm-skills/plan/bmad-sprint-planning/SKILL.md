---
name: bmad-sprint-planning
description: 'Gate planning readiness, then generate sprint status tracking from epics. Use when the user says "run sprint planning", "generate sprint plan", or "check implementation readiness"'
---

# Overview

You are a senior developer about to commit to this plan. Two moves, in order: first scrutinize the planning the way a skeptic reads a handoff — gaps found now are cheap, gaps found mid-build are not. Then hand the mechanical work to the script: parsing epics, deriving keys, merging statuses, and writing `sprint-status.yaml` are deterministic jobs, not judgment calls. Your judgment goes where the script can't: deciding which files are epics, weighing readiness, and reconciling anything the script flags.

## On Activation

1. Resolve customization: `uv run {project-root}/_bmad/scripts/resolve_customization.py --skill {skill-root} --key workflow`. On failure, read `{skill-root}/customize.toml` directly and use defaults.
2. Execute each entry in `{workflow.activation_steps_prepend}` in order.
3. Treat every entry in `{workflow.persistent_facts}` as foundational context for the rest of the run. Entries prefixed `file:` are paths or globs under `{project-root}` — load the referenced contents as facts. All other entries are facts verbatim.
4. Load `{project-root}/_bmad/bmm/config.yaml` (and `config.user.yaml` if present). Resolve `{user_name}`, `{communication_language}`, `{document_output_language}`, `{project_name}`, `{planning_artifacts}`, `{implementation_artifacts}`, `{date}`. Stay in `{communication_language}` for every turn, not just the greeting.
5. Greet `{user_name}` and detect intent: readiness check only, full sprint planning (gate then tracking), or a refresh of an existing `sprint-status.yaml`. If interactive and unclear, ask; for headless behavior see `## Headless Mode`.

Execute each entry in `{workflow.activation_steps_append}` in order.

Activation is complete. If `activation_steps_prepend` or `activation_steps_append` were non-empty, confirm every entry was executed in order before proceeding.

## Readiness Gate

Before generating any tracking, judge whether the plan can actually be built. If the user only asked to check readiness, this gate is the deliverable — report the verdict and stop.

Inventory what planning actually exists: scan `{planning_artifacts}` and `{project_knowledge}` for intent and planning artifacts — briefs, PRFAQs, PRDs, specs, UX outputs, architecture, epics and stories. Identify documents by reading what they are, not by filename patterns; projects arrive with different artifact mixes and naming.

Assess the plan as a whole against one question: **could a developer implement these epics without inventing decisions nothing records?**

- Requirements and decisions in the intent artifacts trace forward into stories; stories trace back to recorded intent — flag orphans in both directions
- Epics deliver user value and carry no forward dependencies; stories are independently completable
- Architecture and UX decisions the stories rely on are recorded somewhere, not assumed
- Conflicts between artifacts (a spec and an epic disagreeing) are surfaced, not silently resolved

A missing document type is only a finding if stories depend on decisions nothing records — a project with no UX artifact and no UI stories is fine.

Deliver a verdict:

- **PASS** — state it in one line and continue to `## Generate Tracking`
- **CONCERNS** — list them briefly with where each gap lives; ask `{user_name}` whether to proceed anyway or fix first
- **FAIL** — the plan is not implementable as recorded. Present findings ordered by severity, name the skill that fixes each (the relevant plan skill, or `bmad-correct-course` for cross-cutting changes), offer to save the findings to `{planning_artifacts}/implementation-readiness.md`, and stop

## Generate Tracking

Discovery is your call; everything after it is the script's.

1. Identify the epic files. The gate inventory already surfaced them — typically `epics.md`, `epic-*.md`, or a sharded `epics/` folder in `{planning_artifacts}`, but trust content over filename. If both a whole document and a sharded version exist, ask which is current rather than guessing.
2. Run the script, passing every epic file:

   ```
   uv run {skill-root}/scripts/sprint_plan.py generate \
     --epic-file <path> [--epic-file <path> ...] \
     --status-file {implementation_artifacts}/sprint-status.yaml \
     --stories-dir {implementation_artifacts} \
     --project "{project_name}" --date "{date}"
   ```

   The script owns parsing (`## Epic N:` / `### Story N.M: Title` → kebab-case keys), ordering (epic, its stories, its retrospective), merging with any existing file (preserve advanced statuses, never downgrade, `action_items` carried verbatim), story-file detection (a story file on disk floors its status at `ready-for-dev`), atomic writes, and post-write validation. It prints a JSON report. Add `--dry-run` to preview without writing. The status vocabulary and workflow notes it embeds are documented in `sprint-status-template.yaml`.

3. Read the JSON report and act on it — this is where judgment re-enters:
   - `warnings` about unparsed Epic/Story-like headings mean the epic file deviates from the standard format. Show the user, fix the headings together (or accept the omission), and rerun.
   - `dropped_orphans` are entries that existed in the old status file but match nothing in the epics — usually renames, which silently lose status. Reconcile with the user before accepting the result: rerun after fixing the epic, or hand-edit the status file to transplant the status.
   - If the epics defeat the parser entirely (a format the regexes can't see), fall back to building the file yourself against `sprint-status-template.yaml`, and tell the user the deterministic path didn't apply.

There is also a `check` subcommand (same `--epic-file`/`--status-file` arguments, never writes) that reports drift between epics and an existing status file — use it when the user asks whether tracking is in sync rather than to regenerate.

## Report

Present the result from the script's JSON in `{communication_language}`: file path, epic/story counts, status breakdown, anything upgraded from disk. Suggest next steps — review the file, `bmad-build` to start the first story, rerun this skill anytime to refresh after epics change. Run `{workflow.on_complete}` if non-empty; treat a string scalar as one instruction and an array as a sequence.

## Headless Mode

When invoked headless, do not ask. Run the gate and, unless intent was readiness-only, generate tracking. Ambiguity the interactive flow would resolve by asking (duplicate epic versions, unreconciled orphans) halts with a `blocked` status instead of guessing. End with a JSON response:

```json
{
  "status": "complete",
  "intent": "sprint-planning",
  "gate": "PASS",
  "status_file": "{implementation_artifacts}/sprint-status.yaml",
  "findings": [],
  "warnings": []
}
```

`gate` is `PASS`, `CONCERNS`, or `FAIL`; on `FAIL` include `findings` and the saved findings path if written, and omit `status_file`. `intent` is `"readiness"` or `"sprint-planning"`.

## References

- `scripts/sprint_plan.py` — the deterministic parser/generator/merger; `--help` documents both subcommands, and its JSON output is the contract this skill reads
- `sprint-status-template.yaml` — example output file; the single source for the status vocabulary (epic / story / retrospective / action-item state machines) and workflow notes
