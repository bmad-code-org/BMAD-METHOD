# Retrospective Workflow

**Goal:** Review a completed epic by reading the evidence it left in the ticket tree — the epic file, the initiative's requirements, each ticket's entry, story file, and plan, the diff and commits between plan baselines, and session logs when they exist. An unattended epic run leaves a record; this workflow reads that record, surfaces the defects no single ticket could show, and judges the epic against the criteria it set for itself.

Every finding you report carries a source reference (file, line, commit, or log). A claim you cannot point at — an invented root cause, a pattern the diff does not actually show — is not a finding. Drop it.

**CRITICAL:** If a phase directs you to another snapshot file, read it fully and follow it. No exceptions.

## Conventions

- Every operational cross-file reference in this workflow is an absolute snapshot path. Open it directly; do not resolve it relative to a skill directory.
- `{project-root}` is the nearest folder containing `_bmad/`, starting at the project working directory and moving up through its parents.
- `{date}` is the current system datetime. Never state time estimates — AI has changed development speed, so hour/day/week predictions are noise.

## Modes

Interactive by default. With `-H`/`--headless`: skip every confirmation, take the epic from the invocation, never open the team discussion, render the verdict on the evidence alone, and record each assumption made without the user (which epic was selected, the machine verdict, each proposed item) into the retrospective document's Assumptions section so the audit trail survives. The Phase 4 acceptance fail-safe still applies in headless runs.

For automation, `-H <epic folder | id | slug>` — an explicit epic in headless mode — is the stable orchestrator-facing interface. Headless with nothing named stops and reports. The offer of finished epics (see Inputs) is a human convenience, not an automation contract.

## On Activation

### Step 1: Execute Prepend Steps

Execute each of these steps in order before proceeding (`_None._` means skip):

{{ workflow.activation_steps_prepend }}

### Step 2: Load Persistent Facts

Treat every entry below as foundational context you carry for the rest of the workflow run. Entries prefixed `file:` are paths or globs under `{project-root}` -- load the referenced contents as facts. All other entries are facts verbatim (`_None._` means none):

{{ workflow.persistent_facts }}

### Step 3: Execute Append Steps

Execute each of these steps in order (`_None._` means skip):

{{ workflow.activation_steps_append }}

Activation is complete after all activation steps have run.

## Inputs

| Input | Where | Use |
|-------|-------|-----|
| epic | invocation argument — an epic folder, or an epic id or slug in the active initiative — or chosen from the offer below | which epic to retro |
| epic folder | `tickets.toml`, the epic file `epic-<slug>.md` (the folder's name plus `.md`), one `<type>-<slug>-plan.md` per ticket, and a story file where a ticket was refined | the record the epic left |
| initiative file | the epic folder's parent's same-named file, section Requirements | what each ticket's `covers` points at |
| architecture / prd | `{{ config.planning_artifacts }}/*architecture*`, `*prd*` | context for judging as-built vs intended |
| previous retro (optional) | `<folder name>-retrospective.md` in the previous epic's folder: run `status` with no folder for the `epics` order; the previous epic's folder is the sibling folder of that name | check whether last epic's actions landed |
| session logs (optional) | conversation/session records for the epic's tickets | process lessons; record the gap when absent |

The epic is a folder in the ticket tree, named `epic-<slug>`; the retrospective is `epic-<slug>-retrospective.md` in it — the folder's name plus `-retrospective.md`. Run `tickets.py` as `uv run {project-root}/_bmad/method/scripts/tickets.py --project-root {project-root} <verb>`; a non-zero exit prints an error — show it and stop. A ticket is finished when its `status` is `built` or its `state` is `done` or `dropped`; unfinished is everything else. An epic with no `tickets` rows has nothing to retro: leave it out of the offer, and when it is named, say so and stop. Resolve the reference:

- **Folder given**: run `status <folder>`.
- **Id or slug given** (including `-H <id|slug>`): run `status` with no folder and match the argument against `epics` by `id` or `slug`. No match: list the epics and ask which; headless, stop and report. The folder is the parent of `epic_file` from `find <ref>`, `ref` taken from the first `tickets` row whose `epic` is the slug. Then run `status <folder>`.
- **Nothing given**: interactive, run `status` with no folder and offer the epics whose `tickets` rows are all finished; when none is, say so and ask which. Headless, stop and report.

`status <folder>`'s `tickets` rows, in the order returned, are the ticket list — that order is the build order. Each row carries `id`, `ref`, `title`, `status`, and `state`. `pending_tickets` is the `ref`s of the unfinished rows, scoped to this epic alone.

Then check the epic is actually finished before Phase 1. When `pending_tickets` is non-empty, interactively list those tickets and ask whether to retro an unfinished epic: if the user declines, stop and report — do not enter Phase 1; if they accept, record the tickets they accepted proceeding over in the document's Epic summary. Headless, proceed and record the same list in the Assumptions section — do not invent a confirmation. Either way the list sits in the document, and Phase 4's machine verdict is **rejected** when any ticket remained unfinished (see `{{ rendered("references/acceptance-verdict.md") }}`); a human may override interactively. Tickets still at `built` — finished by the build, not yet called done — are listed in Epic summary too. Then go to Phase 1.

## Working state and resumption

The retrospective document is the working artifact, not only the final output. Once the epic is fixed, create it as a skeleton (`{{ rendered("references/retro-document.md") }}` names the sections) and write each phase's result into it as you finish — inventory, then findings with sources, then dispositions and verdict. Continuity is re-reading the file.

The document is the retrospective file named above, a fixed name so a resumed run finds it. If it already exists, load it, reconcile its recorded state against the current evidence — the current evidence wins, since commits may have landed and questions may have been answered since — and resume at the first incomplete phase instead of redoing finished ones.

## Flow

Run the phases in order. A default run stops at a written evidence report and verdict; the team discussion in Phase 3 is opt-in.

Before Phase 1, interactively invite the user's going-in concerns ("anything you want weighted — a ticket that felt rushed, a risky interaction between two tickets?"). Use any answer to focus the Phase 1–2 analysis; it directs attention but never becomes a finding without a source.

### Phase 1 — Gather

Enumerate what the epic actually produced and record what is missing. Read fully and follow `{{ rendered("references/evidence-gathering.md") }}` for the inventory checklist, the `git_evidence.py` pre-pass that derives each plan's diff range and commits, and the missing-evidence rule: each later analysis declares what it needs and records a narrowed scope when the evidence is absent, so a reader can always tell "checked and clean" from "never checked."

### Phase 2 — Analyze

Produce findings, each with a source reference, from three angles:

- **Aggregate views** — the defects no single diff hunk shows: architecture delta, duplication map, god-class growth, pattern divergence, spec-to-implementation reconciliation. Read fully and follow `{{ rendered("references/aggregate-views.md") }}` for the catalog and how to derive each (deterministic scripts first).
- **Diff-scope review** — do not reimplement review. Invoke **`bmad-review`** on the epic's diff for the code lenses (adversarial, edge-case, verification-gap), weighting the boundaries between tickets, where no single session ever saw both sides. Fold its findings in. If `bmad-review` is unavailable, run those lenses inline over the diff on a narrowed scope and record the narrowing.
- **Behavior check (when the epic changed runtime behavior)** — exercise the changed flows end to end and record what you observed. Passing tests do not substitute for running the system.

Consolidate: merge, dedupe, and provenance-link findings. Drop any finding you cannot tie to a source.

### Phase 3 — Team Discussion (opt-in)

Skip by default; never runs headless. When the user asks to "discuss it as a team," "run party mode," or similar, invoke the skill `bmad-party-mode` seeded with the Phase 2 findings so the installed agents react to real evidence — the god class the diff really grew, the verification gap that is actually there, the wins the evidence confirms. Read fully and follow `{{ rendered("references/team-discussion.md") }}` for how to seed it and keep it grounded. If `bmad-party-mode` is unavailable, run the discussion inline over the Phase 2 findings and record the narrowing. The rule: agents speak only to findings with sources.

### Phase 4 — Decide

- **Action items** — compile fix-now findings and process lessons into specific, owned action items. Fixes and spec reconciliations are *proposed here*, not auto-applied; the human decides what to execute.
- **Acceptance verdict** — judge the final state against the epic file's Done when (profile the criteria from the diff and plans if it has none): **accepted**, **accepted-with-open-items**, or **rejected** — one spelling, everywhere a machine reads it. Unfinished tickets in `pending_tickets` force the machine verdict to **rejected**. A human decision always overrides. An epic that fails its criteria with no human decision is recorded as *not accepted* — never as silently accepted. Read fully and follow `{{ rendered("references/acceptance-verdict.md") }}` for the rubric, the finding-routing dispositions, and the previous-retro follow-through record.

### Phase 5 — Finalize

Finalize the retrospective document and stop. Read fully and follow `{{ rendered("references/retro-document.md") }}` for the document's location, frontmatter, and sections, and the terminal instruction that ends the run. The document is the run's only write: no status change, no `tickets.py mark`, and no edit to the epic file, any plan, or any story file. Closing the epic is the ticketing skill's, confirmed by the user.
