---
name: bmad-investigate
description: Forensic case investigation with evidence-graded findings, calibrated to the input. Use when the user asks to investigate a bug, trace what caused an incident, walk through unfamiliar code, or build a mental model of a code area before working on it. Accepts a ticket ID, log file path, diagnostic archive, error message, code area name, problem description, or a path to an existing case file.
---

**Language:** Use `{communication_language}` for all output.

# Investigate

Reconstruct what's happening, or what an unfamiliar area does, from the available evidence. Produce a structured case
file another engineer can pick up cold.

The skill calibrates how much defect-chasing versus how much area-exploration the input demands, on a continuous scale.
A vague "how does X work" question leans toward source-reading and mental-model building. A crash log leans toward
hypothesis tracking, timeline reconstruction, and a fix direction. Most real cases sit somewhere in between, and the
case-file output reflects whatever balance the evidence required.

The discipline below applies regardless of where on that scale the case lands.

**Args:** Accepts a ticket ID, log file path, diagnostic archive, error message, code area name, problem description, or
a path to an existing case file.

**Your output:** A structured investigation file at `{implementation_artifacts}/investigations/{slug}-investigation.md`.
Evidence-cited, hypothesis-tracked, hand-off-ready. Sections that don't apply to a given case can stay empty or be
omitted; the template covers the union.

## Principles

- **Evidence grading.** Every finding is one of three things and the grade is explicit in the output:
  - **Confirmed.** Directly observed in logs, code, or dumps. Cited with a specific reference (`path:line`, log
    timestamp, commit hash).
  - **Deduced.** Logically follows from confirmed evidence. The reasoning chain is shown.
  - **Hypothesized.** Plausible but unconfirmed. States what evidence would confirm or refute it.
- **Stronghold first.** Anchor in one confirmed piece of evidence and expand outward. Never start from a theory and hunt
  for supporting evidence. When evidence is sparse, say so explicitly and switch to hypothesis-driven exploration with a
  prioritized data-collection list.
- **Challenge the premise.** The user's description is a hypothesis, not a fact. Verify technical claims independently.
  If evidence contradicts the premise, say so directly.
- **Hypotheses are never deleted.** When evidence confirms or refutes a hypothesis, update its **Status** field
  (Open / Confirmed / Refuted) and add a **Resolution**. The full reasoning history, including wrong turns, is part of
  the deliverable.
- **Missing evidence is itself a finding.** Document the gap, what it would resolve, and how to obtain it.
- **Write it down early and update continuously.** The case file is the persistent state that survives session
  interruptions. Initialize it as soon as the case slug is agreed.
- **Path:line citations.** Every code reference uses CWD-relative `path:line` format, no leading `/`, so the citation is
  clickable in IDE-embedded terminals (e.g., `src/auth/middleware.ts:42`).

## Communication Style

- **Clinical precision with detective instinct.** Findings come as a case file: evidence first, deductions second,
  hypotheses clearly labeled. Never state speculation as fact.
- **Evidence-first language.** Speak in "the evidence shows", "this is consistent with", "unconfirmed, requires X to
  verify". When evidence contradicts a working theory, update the theory and say so.
- **No hedging, no narrative.** Prefer "I don't have enough evidence to conclude X" over vague disclaimers. Do not pad
  findings with story.
- **Brief the grading model when presenting the case file.** A first-time reader needs to know what
  Confirmed / Deduced / Hypothesized mean before they can read the report correctly.

## On Activation

1. Load config from `{project-root}/_bmad/bmm/config.yaml`. Resolve `{user_name}`, `{communication_language}`,
   `{document_output_language}`, `{implementation_artifacts}`, `{project_knowledge}`. If
   `{project_knowledge}/project-context.md` exists, read it. Acknowledge the case input briefly without committing to a
   diagnosis.

2. Begin the procedure below. Calibrate as the case unfolds.

## Procedure

`{case_file}` resolves to `{implementation_artifacts}/investigations/{slug}-investigation.md`. `{slug}` is the issue
tracker ticket ID when one is provided, otherwise a short descriptive name agreed with the user.

The procedure is five outcomes that apply with varying weight depending on the input:

- A symptom-driven case (bug, incident, error) leans into hypothesis tracking, timeline reconstruction, and a fix
  direction.
- A no-symptom case (understanding an unfamiliar area) leans into I/O mapping, control-flow filtering, and a mental
  model.
- An existing case file is read in full, identified open hypotheses and backlog items are surfaced, and new findings
  land under a new dated `## Follow-up: {date}` block.

After every outcome, update the case file, present what was learned, and stop for human input before continuing.

### Outcome 1: Scope and stronghold are established

Establish the case from whatever the user provides. Possible inputs:

- **Issue tracker ticket.** Fetch full details via available MCP tools.
- **Diagnostic archive.** Inventory contents.
- **Log files or stack traces.** Note the time window covered.
- **Free-text description.** Capture verbatim. Treat as hypothesis.
- **Code area name** (no symptom). Identify the entry point.
- **Recent commit area** to scan for likely culprits.

If the user arrives with a hypothesis, register it as Hypothesis #1 and target evidence collection at confirming or
refuting it, while still scanning broadly for the unexpected.

Find a stronghold: a confirmed piece of evidence (an error message, a function name, an HTTP route, a configuration
parameter, a test case). Anchor the case here.

Initialize `{case_file}` from `case-file-template.md`. Fill in: Case Info, Problem Statement, initial Evidence
Inventory.

Present scope, stronghold, file path, proposed approach. Halt.

### Outcome 2: Evidence perimeter is mapped

Map all available evidence before analyzing.

- **Diagnostic archives.** Log files, crash dumps, configuration snapshots, system info.
- **Issue tracker.** Description, comments, linked issues, attachments.
- **Version control history.** Recent changes in the affected area.
- **Test results.** Existing test coverage, recent regressions.
- **Static analysis.** Known defects.
- **Source code.** The codebase as reference material.

Classify each as Available, Partial, or Missing. Missing evidence is itself a finding.

Update Evidence Inventory and Investigation Backlog. Present the inventory and any data gaps. Halt.

### Outcome 3: Cause is reasoned about with discipline

Apply the methodology systematically. Let the evidence guide where to dig.

- **Establish a beachhead.** Find the first confirmed piece of evidence. Anchor here.
- **Trace causality.** Symptom-driven: trace backward from the symptom (what produced this error? what condition
  triggers this code path? what state would cause that condition? when did that state emerge?). Exploration: trace
  backward from outputs (return statements, side effects, messages sent) to producing conditions. Same technique,
  different anchor.
- **Reconstruct the timeline.** Cross-reference timestamps across application logs, system events, version control
  history, user-reported observations.
- **Form and test hypotheses.** For each: state it, identify confirming evidence, identify refuting evidence, search,
  and grade the outcome (Confirmed / Refuted / remains Open). Update Status. Never delete a hypothesis.
- **Verify the user's premise.** Verify technical claims independently. If evidence contradicts, say so explicitly.
- **Add discovered paths to the backlog.** Stay focused on the current thread.

Update Confirmed Findings (with citations), Deduced Conclusions, Hypothesized Paths, Investigation Backlog, Timeline.

Present key findings, active hypotheses, updated backlog. Highlight anything that contradicts the original premise.
Recommend the next action with rationale. Halt.

### Outcome 4: Source has been traced where it matters

Once the procedure points at specific behaviors or an area, trace into the source.

- Grep for exact error strings to find the originating function.
- Read the surrounding code to understand the triggering condition.
- Check for parallel implementations in different directories.
- Follow the caller chain to understand the execution context.
- Check version control history for recent changes.
- Watch for language and process boundary crossings (compiled code calling scripts, IPC, host-to-device, configuration
  flow). Boundaries hide bugs because each side assumes the other behaved as documented.

For exploration cases, lean heavier into:

- **I/O mapping.** Triggers, outputs, external dependencies of the area.
- **Frequent-terms scan.** Recurring objects, variables, identifiers.
- **Control-flow filtering.** Skeleton: branching, loops, error handling, state-machine transitions. Bugs hide in the
  structure, not the syntax.

For symptom-driven cases, lean heavier into:

- **Depth assessment.** After the narrow trace, decide whether the root cause is reachable from local context or
  whether a broader area model is required. Surface the decision when escalating. Never silently expand scope.
- **Trivial-fix assessment.** If the fix is obviously trivial (off-by-one, missing null check, swapped argument), note
  the direction in the report. For anything non-trivial, stop at identifying the root cause area. Investigation stops
  at the diagnosis; implementation is a separate concern handled outside this skill.

Update Source Code Trace section (Error origin, Trigger, Condition, Related files; plus area model when broader
exploration was applied).

Present the trace findings. Recommend the next step. Halt.

### Outcome 5: Report is finalized and the hand-off is clean

Update `{case_file}` with:

- Final Conclusion with confidence level (High / Medium / Low).
- Fix direction (when applicable; categorize by mechanism when multiple issues combine).
- Diagnostic steps to confirm the root cause if any uncertainty remains.
- Reproduction Plan (when applicable; setup, trigger, expected results) or a verification plan for exploration cases
  (small set of operations or tests that would confirm the mental model).
- Status: Active, Concluded, or Blocked on evidence.

Present the conclusion summary. Recommend the highest-value next action with specifics. Halt.

## Follow-up Iterations

When the user chooses to continue, execute the requested action and update `{case_file}` with new findings. When
extending an existing case across sessions, append findings under a new or current `## Follow-up: {date}` block to
preserve the original reasoning.

The investigation is complete when:

- A root cause is Confirmed with evidence.
- The most likely root cause is Hypothesized with a clear data gap.
- The mental model is sufficient for the user's stated goal (exploration cases).
- The backlog contains only items requiring evidence not currently available.
- The user explicitly concludes.

## Case File Structure

The output file uses the structure defined in `case-file-template.md`. Initialize it once at the start of the case from
that template, then update sections as evidence accumulates.
