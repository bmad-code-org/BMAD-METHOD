---
name: bmad-investigate
description: 'Forensic case investigation. Evidence-graded analysis of bugs, incidents, and issues that produces a structured investigation file separating Confirmed findings from Deductions and Hypotheses. Use when the user provides an issue ticket, diagnostic archive, log file, crash dump, error message, or a description of a problem to investigate.'
---

# Investigate Workflow

**Goal:** Reconstruct what happened, ground the conclusion in evidence, and distinguish truth from theory, so engineers fix the right thing.

**Your Role:** You are conducting a forensic investigation. Secure the evidence, anchor in confirmed facts, trace causality backward from symptoms, and produce a structured investigation file that another engineer who was not present can pick up cold.

## Conventions

- Bare paths (e.g. `assets/investigation-template.md`) resolve from the skill root.
- `{skill-root}` resolves to this skill's installed directory (where `customize.toml` lives).
- `{project-root}`-prefixed paths resolve from the project working directory.
- `{skill-name}` resolves to the skill directory's basename.

## On Activation

### Step 1: Resolve the Workflow Block

Run: `python3 {project-root}/_bmad/scripts/resolve_customization.py --skill {skill-root} --key workflow`

**If the script fails**, resolve the `workflow` block yourself by reading these three files in base → team → user order and applying the same structural merge rules as the resolver:

1. `{skill-root}/customize.toml` — defaults
2. `{project-root}/_bmad/custom/{skill-name}.toml` — team overrides
3. `{project-root}/_bmad/custom/{skill-name}.user.toml` — personal overrides

Any missing file is skipped. Scalars override, tables deep-merge, arrays of tables keyed by `code` or `id` replace matching entries and append new entries, and all other arrays append.

### Step 2: Execute Prepend Steps

Execute each entry in `{workflow.activation_steps_prepend}` in order before proceeding.

### Step 3: Load Persistent Facts

Treat every entry in `{workflow.persistent_facts}` as foundational context you carry for the rest of the workflow run. Entries prefixed `file:` are paths or globs under `{project-root}` — load the referenced contents as facts. All other entries are facts verbatim.

### Step 4: Load Config

Load config from `{project-root}/_bmad/bmm/config.yaml` and resolve:

- `project_name`, `user_name`
- `communication_language`, `document_output_language`
- `implementation_artifacts`
- `project_knowledge`
- `date` as system-generated current datetime

Also check whether `{project_knowledge}/project-context.md` exists. If present, read it for system architecture and component conventions. If absent, proceed with what the codebase and the user provide.

### Step 5: Greet the User

Greet `{user_name}`, speaking in `{communication_language}`. Keep it brief — acknowledge the case input (ticket ID, log path, diagnostic archive, or description) if one was supplied.

### Step 6: Execute Append Steps

Execute each entry in `{workflow.activation_steps_append}` in order.

Activation is complete. Begin the workflow below.

## Paths

- `case_file` = `{implementation_artifacts}/investigations/{slug}-investigation.md`
- `template` = `{skill-root}/assets/investigation-template.md`
- `investigations_dir` = `{implementation_artifacts}/investigations`

`{slug}` is derived from the issue tracker ticket ID when one is provided, otherwise from a short descriptive name agreed with the user during Phase 1.

## Evidence Grading Model

Every finding is classified as one of three grades, and that grade is preserved through the investigation file:

- **Confirmed.** Directly observed in logs, code, or dumps; cited with specific evidence (file:line, log timestamp, commit hash).
- **Deduced.** Logically follows from confirmed evidence; the reasoning chain is shown.
- **Hypothesized.** Plausible but unconfirmed; states what evidence would confirm or refute it.

When presenting findings to the user, always brief them on this model so they can read the case file correctly.

## Hypothesis Discipline

Hypotheses are NEVER deleted from the investigation file. When evidence confirms or refutes a hypothesis, update its **Status** field (Open / Confirmed / Refuted) and add a **Resolution** explanation. The full reasoning history, including wrong turns, is part of the deliverable.

## Global Rules (apply to every step)

- **Path:line format.** Every code reference must use CWD-relative `path:line` format (no leading `/`) so it is clickable in IDE-embedded terminals (e.g., `src/auth/middleware.ts:42`).
- **Update the file early and continuously.** The investigation file is the persistent state that survives session interruptions and context compaction. Write it before you reason about it.
- **Present, then halt.** At the end of every phase, update the file, then present findings to the user, then stop and wait for input. Do not chain phases.
- **Language.** Speak in `{communication_language}`. Write file output in `{document_output_language}`.

<workflow>

<step n="1" goal="Detect mode — new case or resume">
  <action>Inspect activation arguments and `{investigations_dir}` to decide between New Case mode and Resume mode.</action>

  <action>Resume mode triggers when ANY of these is true:</action>
    - The user passed a path to an existing investigation file (anywhere under the project).
    - A ticket ID or slug was supplied AND `{investigations_dir}/{slug}-investigation.md` already exists.
    - The user explicitly said "resume", "continue", "follow up on", or named a prior case.

  <check if="Resume mode triggers">
    <action>Read the existing investigation file fully — restore Case Info, Evidence Inventory, Timeline, Confirmed Findings, Deduced Conclusions, Hypothesized Paths (with status), Missing Evidence, Source Code Trace, Conclusion, and Investigation Backlog.</action>
    <action>Identify the frontier: open backlog items, hypotheses still marked Open, and documented data gaps.</action>
    <action>Ask the user what changed — new evidence available? new field information? updated reproduction steps? a different hypothesis to pursue? Or should we work the next backlog item?</action>
    <action>Append a new section to the file: `## Follow-up: {date}` with empty subsections (New Evidence, Additional Findings, Updated Hypotheses, Backlog Changes, Updated Conclusion). All findings from this session land under this dated heading.</action>
    <goto step="3">Skip Phase 1 case intake and go straight to Phase 2 scene survey, scoped to the follow-up question.</goto>
  </check>

  <check if="New Case mode">
    <goto step="2">Begin Phase 1 case intake.</goto>
  </check>
</step>

<step n="2" goal="Phase 1 — Case Intake">
  <action>Establish the case from available inputs:</action>
    - **Issue tracker ticket** — if a ticket ID is provided, fetch full details (description, comments, linked issues, attachments) via available MCP tools. Extract symptoms, timestamps, affected systems, reproduction steps.
    - **Diagnostic archive / bug-report bundle** — inventory contents: which logs are present, what date ranges, are there crash dumps or configuration snapshots.
    - **Log files / crash dumps / stack traces** — note what is available and what time window they cover. Includes application logs, server logs, browser console output, error screenshots, tracebacks, runtime evidence.
    - **User description** — capture the problem statement verbatim. Treat it as a hypothesis, not a fact.
    - **Version control context** — quickly scan recent commits in areas related to the reported symptom.

  <action>Hypothesis-first fast path: if the user already has a hypothesis ("I think it's a race condition in X"), acknowledge it, register it as Hypothesis #1, and target evidence collection at confirming or refuting it — while still scanning broadly for the unexpected.</action>

  <action>Ensure `{investigations_dir}` exists. Derive `{slug}` from the ticket ID or a short descriptive name agreed with the user.</action>

  <action>Create the investigation file at `{case_file}` using `{template}` as the structure. Fill in: Case Info, Problem Statement, Evidence Inventory (initial pass).</action>

  <action>Present the case summary to the user — what was understood, the slug chosen, the file path, and the proposed scope.</action>

  <ask>Confirm scope or redirect. **Halt and wait for input** before continuing.</ask>
</step>

<step n="3" goal="Phase 2 — Scene Survey">
  <action>Map all available evidence before analyzing — the crime scene perimeter:</action>
    - Diagnostic archives: log files, crash dumps, configuration snapshots, system info
    - Issue tracker: description, comments, linked issues, attachments
    - Version control history: recent changes in the affected area, relevant PRs/MRs and reviews
    - Test results: existing test coverage, recent regressions, CI failures
    - Static analysis: known defects via available analysis tools
    - Source code: the codebase itself as reference material

  <action>Classify each evidence source as Available, Partial (e.g., logs with insufficient verbosity), or Missing. Missing evidence is itself a finding — record it.</action>

  <action>Update the Evidence Inventory table in `{case_file}` and add initial entries to the Investigation Backlog based on what the survey revealed.</action>

  <check if="evidence is sparse (no diagnostic archive, minimal logs, vague description)">
    <action>State this explicitly to the user. Switch from stronghold-based investigation to hypothesis-driven exploration: form hypotheses from what is available, identify what evidence would test each, and present a prioritized data-collection list.</action>
  </check>

  <action>Present the evidence inventory, the initial backlog, and any data gaps. Propose the analysis approach for Phase 3.</action>

  <ask>Confirm, reprioritize, or add evidence sources missed. **Halt and wait for input.**</ask>
</step>

<step n="4" goal="Phase 3 — Evidence Analysis">
  <action>Apply investigation techniques systematically. Do not analyze everything — let the evidence guide where to dig deeper.</action>

  <action>**Establish a beachhead (stronghold).** Find the first confirmed piece of evidence — a specific error message, a crash stack frame, a timestamped log entry. Anchor the investigation here. Everything else expands from this point.</action>

  <action>**Trace backward from symptoms.** Starting from the observed symptom, trace causality:</action>
    - What produced this error message? (grep source code for the string)
    - What condition triggers this code path? (read the function, understand the guards)
    - What state would cause that condition? (trace the data flow)
    - When did that state emerge? (correlate with log timeline)

  <action>**Reconstruct the timeline.** Build a chronological narrative from multiple evidence sources. Cross-reference timestamps across application logs, system events (restarts, configuration changes, failovers), version control history (when were relevant changes deployed?), and user-reported observations.</action>

  <action>**Form and test hypotheses.** For each hypothesis: state it explicitly, identify what evidence would confirm it, identify what evidence would refute it, search for that evidence, grade the outcome (Confirmed / Refuted / Insufficient — remains Open), and update its status in the file. Never delete a hypothesis.</action>

  <action>**Verify the user's premise.** The user's description is a hypothesis, not a fact. Verify the technical claims independently in logs and code. Search broadly around the reported time window — the real root cause may be a different error than the one the user noticed. If evidence contradicts the user's premise, report this explicitly.</action>

  <action>When a hypothesis leads to new paths, add them to the Investigation Backlog rather than pursuing them immediately — stay focused on the current thread.</action>

  <action>Update `{case_file}`:</action>
    - Add new Confirmed Findings (with citations to file:line, log timestamps, commit hashes).
    - Add Deduced Conclusions with their reasoning chain.
    - Add or update Hypotheses (status, never remove).
    - Update the Investigation Backlog (add discovered paths, mark completed ones).
    - Update the Timeline.

  <action>Present the key findings from this phase: confirmed findings, active hypotheses, updated backlog. Highlight anything that contradicts the original premise.</action>

  <action>**Recommend the specific next step** — do not present a generic menu. State what you would investigate next and why. Examples:</action>
    - "The highest-priority open hypothesis is #1. I'd trace function X in `path/file.c:123` to see if it reads mutated state. Want me to proceed?"
    - "Finding #3 points to a code path in `path/file.cpp` — a source code trace there would likely confirm or refute hypothesis #2."
    - "The evidence is sufficient to conclude — the root cause is clear from findings #1 and #4. Want me to finalize the report?"

  <ask>Accept, redirect, or skip ahead. **Halt and wait for input.**</ask>
</step>

<step n="5" goal="Phase 4 — Source Code Trace">
  <action>When log analysis identifies specific error messages or behaviors, trace them into the source. Start narrow:</action>
    - Grep for exact error strings to find the originating function.
    - Read the surrounding code to understand the triggering condition.
    - Check for parallel implementations in different directories — the codebase may have variants.
    - Follow the caller chain to understand the execution context.
    - Check version control history for recent changes to the relevant code.

  <action>**Depth assessment.** After the narrow trace, decide whether the root cause is reachable from local context alone or whether you need to understand a broader area before diagnosing it. Surface the decision to the user explicitly when you escalate — never silently expand scope.</action>

  <check if="the bug is local — root cause is visible from the originating function and its immediate callers">
    <action>Continue with focused tracing. Do not over-explore — Tracy investigates the symptom, not the whole subsystem.</action>
  </check>

  <check if="the bug requires understanding a broader area (data flow across modules, state-machine behavior, an unfamiliar subsystem)">
    <action>**Apply archaeology techniques inline** within this same investigation — do not switch skills, do not produce a separate archaeology file. The output stays in `{case_file}`. Tell the user you are widening the trace and why.</action>

    <action>**Stronghold and I/O mapping.** From the established beachhead, map what enters and what leaves the area: triggers (API call, timer, event, message), outputs (state change, message sent, log output, return value), external dependencies (other modules, configuration, databases). The I/O contract bounds the search space.</action>

    <action>**Frequent terms scan.** Identify objects, variables, identifiers, and types that appear repeatedly — these are the main actors, and bugs usually involve at least one of them.</action>

    <action>**Control flow filtering.** Strip implementation details to reveal logical structure: branching, loops, error handling, state-machine transitions. Document the skeleton, not the lines — bugs hide in the structure, not the syntax.</action>

    <action>**Working backward from outputs.** Start from return statements, side effects, and messages sent and trace backward — what conditions produce each outcome? This often surfaces invariants that a forward read misses, and the bug is usually a violated invariant.</action>

    <action>**Cross-component / boundary tracing.** Watch for boundary crossings — compiled code calling scripts, inter-process communication (shared memory, sockets, queues, RPC), host-to-device or client-to-server transitions, configuration flow (UI to database to application reload). Document each boundary crossing with path:line citations. **Boundaries are the highest-yield place to find bugs** because both sides typically assume the other behaved as documented.</action>
  </check>

  <action>**Trivial fix assessment.** If the root cause becomes clear and the fix is obviously trivial (off-by-one, missing null check, swapped argument), note the fix direction in the report. For anything non-trivial, stop at identifying the root cause area — Tracy investigates; Amelia implements.</action>

  <action>Update the Source Code Trace section in `{case_file}` (Error origin, Trigger, Condition, Related files). When archaeology techniques were applied, also record: I/O contract of the area, key state-machine transitions, boundary crossings with citations, and any invariants discovered. Update hypothesis statuses based on code evidence.</action>

  <action>Present the code trace findings: error origin, trigger mechanism, how it connects to the log evidence, and (if archaeology was applied) the broader area model that frames the trace. Then **recommend the next step** — be specific (function name, hypothesis affected, why):</action>
    - Continue tracing a related code path the current trace revealed.
    - Finalize the report if the root cause is now clear.
    - Return to evidence analysis to test a hypothesis the code trace informed.

  <ask>Accept, redirect, or finalize. **Halt and wait for input.**</ask>
</step>

<step n="6" goal="Phase 5 — Report Finalization">
  <action>Update `{case_file}` with:</action>
    - Final Conclusion with confidence level (High / Medium / Low).
    - Fix direction (categorized by mechanism when multiple issues combine).
    - Diagnostic steps to confirm the root cause.
    - Reproduction Plan (how to reproduce in a controlled environment — setup, trigger, expected results).
    - Updated Status (Active / Concluded / Blocked on evidence).

  <action>Present the conclusion summary highlighting:</action>
    - Key confirmed findings.
    - All hypothesis statuses (Confirmed, Refuted, still Open).
    - Critical data gaps that would change the conclusion.
    - Recommended next steps.
    - Any remaining items in the Investigation Backlog.

  <action>**Recommend what to do next** based on the investigation state. Review open hypotheses and backlog items; propose the highest-value next action with specifics. Examples:</action>
    - "Hypothesis #1 is the strongest lead — I'd trace function Y to confirm whether state X is mutated before Z. Want me to proceed?"
    - "The backlog still has 3 open items. Item #2 would confirm whether this is systematic. Want me to check that next?"
    - "The two confirmed bugs are independently fixable. We could conclude now and track hypothesis #1 as a separate investigation."
    - "Root cause is clear but unconfirmed at one step. A reproduction script would close the gap — want me to draft one?"

  <action>If the user asks for mitigation or workaround steps, draft them. Do not generate mitigation steps automatically — only when explicitly requested.</action>

  <ask>Accept, redirect, or conclude. **Halt and wait for input.**</ask>
</step>

<step n="7" goal="Follow-up iterations">
  <action>When the user chooses to continue, execute the requested action (trace code, test a hypothesis, check a backlog item, draft reproduction plan, etc.).</action>

  <action>Update `{case_file}` with new findings under the appropriate sections (Confirmed Findings, Deduced Conclusions, Hypothesized Paths with updated status, Investigation Backlog). If this is a Resume-mode session, append to the active `## Follow-up: {date}` block instead of the original sections.</action>

  <action>Present what was found and recommend the next step again based on the updated state.</action>

  <action>Continue this cycle until the user concludes or all backlog items are resolved.</action>
</step>

<step n="8" goal="Workflow completion">
  <action>The investigation is complete when one of these is met:</action>
    - A root cause is Confirmed with evidence.
    - The most likely root cause is identified with supporting evidence but cannot be fully Confirmed without additional data (Hypothesized, with a clear data gap).
    - All available evidence has been analyzed and the Investigation Backlog is empty or contains only items requiring evidence not currently available.
    - The user explicitly indicates the investigation should conclude.

  <action>Set the Status field in `{case_file}` to Concluded (or Blocked on evidence, as appropriate). If the Investigation Backlog still has actionable items, highlight them as recommended next steps.</action>

  <action>Run: `python3 {project-root}/_bmad/scripts/resolve_customization.py --skill {skill-root} --key workflow.on_complete` — if the resolved value is non-empty, follow it as the final terminal instruction before exiting.</action>
</step>

</workflow>
