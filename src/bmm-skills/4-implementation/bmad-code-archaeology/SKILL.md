---
name: bmad-code-archaeology
description: 'Deep source-code investigation to understand how a code area works (structure, data flow, key decision points, non-obvious behaviors) without a specific bug to debug. Use when the user says "how does X work", "trace the flow from A to B", "I need to understand this module before I can work on it", or is preparing to work in unfamiliar code.'
---

# Code Archaeology Workflow

**Goal:** Build a clear, documented understanding of how an unfamiliar code area works (its structure, data flow, key decision points, and non-obvious behaviors) so the user can confidently work on or extend it.

**Your Role:** You are conducting source-code archaeology. This is exploration and knowledge-building, not debugging. Apply forensic discipline. Anchor in confirmed evidence read from the source, distinguish what the code actually does from what it appears to do, and document uncertain areas explicitly.

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

Greet `{user_name}`, speaking in `{communication_language}`. Acknowledge the area to be explored if one was specified.

### Step 6: Execute Append Steps

Execute each entry in `{workflow.activation_steps_append}` in order.

Activation is complete. Begin the workflow below.

## Paths

- `case_file` = `{implementation_artifacts}/investigations/{slug}-archaeology.md`
- `template` = `{skill-root}/assets/investigation-template.md`
- `investigations_dir` = `{implementation_artifacts}/investigations`

`{slug}` is derived from a short descriptive name agreed with the user during Phase 1 (typically the area or feature being explored).

## Section Mapping

The investigation template is reused with archaeology-flavored interpretations:

- **Evidence Inventory** documents the **code area surveyed** (files, modules, components examined).
- **Confirmed Findings** documents **how it works**: verified behavior read directly from source.
- **Deduced Conclusions** documents **inferred behavior**: what follows from the confirmed code paths.
- **Hypothesized Paths** documents **uncertain areas**: code paths or behaviors not fully understood.
- **Missing Evidence** documents **further reading needed**: areas that need deeper investigation, missing tests, missing documentation.
- **Source Code Trace** captures the entry point, key functions, and boundary crossings.
- **Conclusion** summarizes the mental model of the area, how it works at a glance.

## Global Rules (apply to every step)

- **Path:line format.** Every code reference must use CWD-relative `path:line` format (no leading `/`) so it is clickable in IDE-embedded terminals (e.g., `src/auth/middleware.ts:42`).
- **Document boundary crossings.** Language transitions, IPC, host-to-device, configuration flow. These are where assumptions break and bugs hide; capture them explicitly.
- **Update the file early and continuously.** The archaeology file is the deliverable; write it as you read, not after.
- **Present, then halt.** At the end of every phase, update the file, present findings, then stop and wait for input.
- **Language.** Speak in `{communication_language}`. Write file output in `{document_output_language}`.

<workflow>

<step n="1" goal="Detect mode — new exploration or resume">
  <action>Inspect activation arguments and `{investigations_dir}` to decide between New Exploration mode and Resume mode.</action>

  <action>Resume mode triggers when ANY of these is true:</action>
    - The user passed a path to an existing archaeology file (anywhere under the project).
    - A slug was supplied AND `{investigations_dir}/{slug}-archaeology.md` already exists.
    - The user explicitly said "resume", "continue", "follow up on", or named a prior exploration.

  <check if="Resume mode triggers">
    <action>Read the existing archaeology file fully — restore Code area surveyed, How it works, Inferred behavior, Uncertain areas, Further reading needed, Source Code Trace, and Conclusion.</action>
    <action>Identify the frontier: open uncertain areas, documented data gaps, areas marked as "further reading needed".</action>
    <action>Ask the user what they want to dig into — a specific uncertain area, a new entry point, or the next item flagged for further reading.</action>
    <action>Append a new section to the file: `## Follow-up: {date}` with empty subsections. All findings from this session land under this dated heading.</action>
    <goto step="3">Skip Phase 1 scoping and go to Phase 2 input/output mapping for the chosen target.</goto>
  </check>

  <check if="New Exploration mode">
    <goto step="2">Begin Phase 1 scoping.</goto>
  </check>
</step>

<step n="2" goal="Phase 1 — Scope and stronghold">
  <action>Establish what is being explored:</action>
    - **Area** — the module, feature, subsystem, or flow the user wants to understand.
    - **Goal** — why they need to understand it (preparing to extend it? onboarding? evaluating reusability?). The goal shapes how deep to go and what to document.
    - **Stronghold** — find a recognizable entry point: a function name from logs, a UI action, an HTTP route, a configuration parameter, a test case. Anchor the exploration here.

  <action>Ensure `{investigations_dir}` exists. Derive `{slug}` from the area name (e.g., `auth-middleware`, `payment-flow`).</action>

  <action>Create the archaeology file at `{case_file}` using `{template}` as the structure. Fill in: Case Info (use "Area surveyed" as the System), Problem Statement (the exploration goal), and an initial Evidence Inventory listing the entry point and any obviously related files.</action>

  <action>Present the scope, the stronghold, the file path, and the proposed exploration plan.</action>

  <ask>Confirm scope or redirect. **Halt and wait for input** before continuing.</ask>
</step>

<step n="3" goal="Phase 2 — Input/Output mapping">
  <action>Map what enters and what leaves the code area under study:</action>
    - **Triggers** — what causes this code to run? (API call, timer, event, message, scheduled job)
    - **Outputs** — what does it produce? (state change, message sent, log output, return value, side effect)
    - **External dependencies** — what does it call into? (other modules, configuration, databases, network, filesystem)

  <action>**Frequent terms scan.** Identify objects, variables, identifiers, and types that appear repeatedly — these are the main actors in the code's narrative.</action>

  <action>Update `{case_file}`:</action>
    - Evidence Inventory: list all files surveyed (with path:line for entry points).
    - Source Code Trace: fill the Trigger and Related files rows.
    - Confirmed Findings: record the input/output contract as observed in the code.

  <action>Present the I/O map and the recurring actors. Ask whether to drill into a specific path or continue surveying.</action>

  <ask>**Halt and wait for input.**</ask>
</step>

<step n="4" goal="Phase 3 — Control flow and working backward">
  <action>**Control flow filtering.** Strip implementation details to reveal logical structure: branching, loops, error handling, state-machine transitions. Document the skeleton, not the lines.</action>

  <action>**Working backward.** Start from outputs (return statements, side effects, messages sent) and trace backward — what conditions produce each outcome? This often surfaces invariants that a forward read misses.</action>

  <action>**Cross-component tracing.** Watch for boundary crossings:</action>
    - Compiled code calling scripts (e.g., backend invoking shell scripts).
    - Inter-process communication — shared memory, sockets, message queues, RPC.
    - Host-to-device, client-to-server boundaries.
    - Configuration flow — UI to database to application reload.

  <action>Document each boundary crossing in Source Code Trace with path:line citations. These are where assumptions break and bugs hide.</action>

  <action>Update `{case_file}`:</action>
    - Confirmed Findings: how each branch behaves, what each output represents.
    - Deduced Conclusions: inferred behavior from the structure (e.g., "calls X before Y, so X must succeed for Y to run").
    - Hypothesized Paths: code paths that look reachable but couldn't be confirmed without running the code.
    - Missing Evidence: tests, docs, or runtime data that would close gaps.

  <action>Present the control-flow skeleton, the boundary crossings, and the uncertain areas.</action>

  <action>**Recommend the next step** — be specific:</action>
    - "The boundary at `path/file.ts:88` (HTTP → worker) is the murkiest spot. Want me to trace the worker side?"
    - "The state machine in `path/file.go:42-130` is fully mapped. Should I move to the persistence layer or wrap up?"
    - "I'd recommend reading the tests at `tests/path/spec.ts` next — they document the expected edge cases."

  <ask>Accept, redirect, or finalize. **Halt and wait for input.**</ask>
</step>

<step n="5" goal="Phase 4 — Finalize the archaeology report">
  <action>Update `{case_file}` with:</action>
    - Conclusion — a tight summary of how the area works, written so a developer who has not read the code can build a mental model from it.
    - Recommended Next Steps — Fix direction is replaced with **Reading direction**: where to go next if the user wants to understand the area more deeply or extend it.
    - Reproduction Plan — replaced with **Verification plan**: a small set of operations or tests that, if run, would confirm the mental model is correct.
    - Status field set to Concluded (or Active if uncertainties remain).

  <action>Present the finalized mental model and the verification plan. Highlight any uncertain areas that remain open.</action>

  <ask>Accept, redirect, or conclude. **Halt and wait for input.**</ask>
</step>

<step n="6" goal="Follow-up iterations">
  <action>When the user chooses to continue, dig into the requested area (a new boundary, a deeper trace, a specific function).</action>

  <action>Update `{case_file}` with new findings under the appropriate sections. If this is a Resume-mode session, append to the active `## Follow-up: {date}` block instead of the original sections.</action>

  <action>Present what was found and recommend the next step again based on the updated state.</action>
</step>

<step n="7" goal="Workflow completion">
  <action>The exploration is complete when the user has the mental model they came for, when all flagged areas have been resolved, or when the user explicitly indicates the exploration should conclude.</action>

  <action>Set the Status field in `{case_file}` to Concluded. If "further reading needed" items remain, highlight them as suggested next sessions.</action>

  <action>Run: `python3 {project-root}/_bmad/scripts/resolve_customization.py --skill {skill-root} --key workflow.on_complete` — if the resolved value is non-empty, follow it as the final terminal instruction before exiting.</action>
</step>

</workflow>
