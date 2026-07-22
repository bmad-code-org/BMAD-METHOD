---
name: bmad-retrospective
description: 'Evidence-based epic retrospective — mine what the epic actually left behind, verify it, render an acceptance verdict. Use when the user says "run a retrospective" or "lets retro the epic [epic]". Supports -H/--headless.'
---

# Retrospective

Close out a completed epic by reading the evidence it left — the epic spec, story files, the full diff, per-story commits, sprint status, and session logs when they exist. An unattended epic run leaves real witnesses; this skill interrogates them, surfaces the defects no single story could show, and judges the epic against the criteria it set for itself.

Every finding you report carries a source reference (file, line, commit, or log). A claim you cannot point at — an invented root cause, a pattern the diff does not actually show — is not a finding. Drop it.

## Resolution rules

- Bare paths and `{skill-root}` (e.g. `references/aggregate-views.md`, `scripts/sprint_status.py`) resolve from this skill's installed directory.
- `{project-root}` → the project working directory.
- `{skill-name}` → the skill directory's basename.

## Modes

Interactive by default. With `-H`/`--headless`: skip every confirmation, accept epic detection, never open the team discussion, render the verdict on the evidence alone, and record each assumption made without the user (which epic was selected, the machine verdict, each proposed item) into the retrospective document's Assumptions section so the audit trail survives. The Phase 4 acceptance fail-safe still applies in headless runs.

## On Activation

Run these in order before the retrospective begins:

1. **Resolve the workflow block.** Run `uv run {project-root}/_bmad/scripts/resolve_customization.py --skill {skill-root} --key workflow`. If it fails, resolve `{workflow.*}` yourself by reading `{skill-root}/customize.toml`, then `{project-root}/_bmad/custom/{skill-name}.toml`, then `.user.toml` in that order, merging base → team → user (scalars override, keyed arrays-of-tables merge by `code`/`id`, other arrays append).
2. **Run prepend steps** — execute each entry in `{workflow.activation_steps_prepend}` in order.
3. **Load persistent facts** — treat every `{workflow.persistent_facts}` entry as standing context. `file:` entries are paths/globs under `{project-root}` whose contents load as facts; all others are literal facts.
4. **Load config** from `{project-root}/_bmad/bmm/config.yaml`: `project_name`, `user_name`, `communication_language`, `document_output_language`, `user_skill_level`, `planning_artifacts`, `implementation_artifacts`, and `date` (system datetime). Speak all output in `{communication_language}`; write all documents in `{document_output_language}`. Never state time estimates — AI has changed development speed, so hour/day/week predictions are noise.
5. **Greet and orient** (interactive only). Greet `{user_name}`, name the epic you are about to retro, and optionally invite their going-in concerns ("anything you want weighted — a story that felt rushed, a risky seam between stories?"). Use any answer to focus the Phase 1–2 mining; it directs attention but never becomes a finding without a source.
6. **Run append steps** — execute each entry in `{workflow.activation_steps_append}` in order.

## Inputs

| Input | Where | Use |
|-------|-------|-----|
| epic | invocation argument, or detected from sprint status | which epic to retro |
| sprint status | `{implementation_artifacts}/sprint-status.yaml` | epic detection + close-out update |
| architecture / prd | `{planning_artifacts}/*architecture*`, `*prd*` | context for judging as-built vs intended |
| previous retro (optional) | `{implementation_artifacts}/**/epic-{{prev}}-retro-*.md` | check whether last epic's actions landed |
| session logs (optional) | conversation/session records for the epic's stories | process lessons; degrade honestly when absent |

Determine the epic: if the user supplied one, use it. Otherwise run `uv run {skill-root}/scripts/sprint_status.py detect-epic --file {implementation_artifacts}/sprint-status.yaml` (returns the highest epic with a `done` story). Confirm the detected epic with the user and let them override; in headless mode accept it and record the assumption. If detection returns none, ask the user — or, headless, stop and report.

## Working state and resumption

The retrospective document is the working artifact, not only the final output. Once the epic is fixed, create it as a skeleton (`references/retro-document.md` names the sections) and write each phase's result into it as you finish — inventory, then findings with sources, then dispositions and verdict. Continuity is re-reading the file.

If a retrospective document for this epic already exists, load it, reconcile its recorded state against the current evidence — reality wins, since commits may have landed and questions may have been answered since — and resume at the first incomplete phase instead of redoing finished ones.

## Flow

Run the phases in order. A default run stops at a written evidence report and verdict; the team discussion in Phase 3 is opt-in.

### Phase 1 — Gather

Enumerate what the epic actually produced and record what is missing. Load `references/evidence-gathering.md` for the inventory checklist, the `git_evidence.py` pre-pass that derives the diff range and per-story commits, and the honest-degradation rule: each later analysis declares what it needs and records a narrowed scope when the evidence is absent, so a reader can always tell "checked and clean" from "never checked."

### Phase 2 — Analyze

Produce findings, each with a source reference, from three angles:

- **Aggregate views** — the defects no single diff hunk shows: architecture delta, duplication map, god-class growth, pattern divergence, spec-to-implementation reconciliation. Load `references/aggregate-views.md` for the catalog and how to derive each (deterministic scripts first).
- **Diff-scope review** — do not reimplement review. Invoke **`bmad-review`** on the epic's diff for the code lenses (adversarial, edge-case, verification-gap), weighting the seams between stories, where no single session ever saw both sides. Fold its findings in. If `bmad-review` is unavailable, run those lenses inline over the diff on a narrowed scope and record the narrowing.
- **Behavior check (when the epic changed runtime behavior)** — exercise the changed flows end to end and record what you observed. Passing tests do not substitute for running the system.

Consolidate: merge, dedupe, and provenance-link findings. Drop any finding you cannot tie to a source.

### Phase 3 — Team Discussion (opt-in)

Skip by default; never runs headless. When the user asks to "discuss it as a team," "run party mode," or convene the roster, invoke **`bmad-party-mode`** seeded with the Phase 2 findings so the installed agents react to real evidence — the god class the diff really grew, the verification gap that is actually there, the wins the evidence confirms. Load `references/team-discussion.md` for how to seed it and keep it grounded. The rule that makes this worth doing: agents speak only to findings with sources; nobody invents drama.

### Phase 4 — Decide

- **Action items** — compile fix-now findings and process lessons into specific, owned action items. Fixes and spec reconciliations are *proposed here*, not auto-applied; the human decides what to execute.
- **Acceptance verdict** — judge the final state against the epic's declared acceptance criteria (profile it from the diff and stories if none were declared): **accepted**, **accepted with open items**, or **rejected**. A human decision always overrides. An epic that fails its criteria with no human decision closes as *not accepted* — never as silently accepted. Load `references/acceptance-verdict.md` for the rubric and the finding-routing dispositions.

### Phase 5 — Close

Finalize the retrospective document and update sprint status. Load `references/retro-document.md` for the document's sections and the exact `sprint_status.py update` invocation that marks the retro key `done`, appends the action items, and validates the write. Then, if `{workflow.on_complete}` is non-empty, follow it as the final instruction.
