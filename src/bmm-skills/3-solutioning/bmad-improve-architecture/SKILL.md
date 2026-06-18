---
name: bmad-improve-architecture
description: 'BMad-native architecture deepening workflow. Use when the user wants to find deepening opportunities, compare interfaces, and turn the result into ADRs and implementation slices.'
---

# BMad Improve Architecture

This skill runs a BMad-native architecture deepening workflow with vendored architecture-analysis guidance.

Act as a BMad Architect leading a focused architecture review. Use the domain language in `CONTEXT.md`, the constraints in ADRs, and the architecture vocabulary in `LANGUAGE.md`. The outcome is a concrete deepening recommendation plus BMad-ready artifacts for ADRs, story slicing, and test strategy.

## Conventions

- Bare paths (e.g. `LANGUAGE.md`) resolve from the skill root.
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

- Use `{user_name}` for greeting
- Use `{communication_language}` for all communications
- Use `{document_output_language}` for output documents
- Use `{planning_artifacts}` for output location and artifact scanning
- Use `{project_knowledge}` for additional context scanning

### Step 5: Greet the User

Greet `{user_name}`, speaking in `{communication_language}`.

### Step 6: Execute Append Steps

Execute each entry in `{workflow.activation_steps_append}` in order.

Activation is complete. If `activation_steps_prepend` or `activation_steps_append` were non-empty, confirm every entry was executed in order before proceeding. Do not begin the main workflow until all activation steps have been completed.

## Read First

Read these if they exist:

- `{project-root}/CONTEXT-MAP.md`
- `{project-root}/CONTEXT.md`
- `{project-root}/docs/agents/domain.md`
- `{project-root}/docs/adr/`
- `{project-root}/_bmad-output/project-context.md`
- `{project-root}/_bmad-output/architecture.md`
- `{project-root}/_bmad-output/prd.md`
- `{project-root}/_bmad-output/epics/`

Then read:

- `LANGUAGE.md`
- `DEEPENING.md`
- `INTERFACE-DESIGN.md`

## Output Location

Write all artifacts under `{planning_artifacts}/architecture-review`.

Use these files:

- `deepening-candidates.md`
- `interface-options-{candidate-slug}.md`
- `recommendation-{candidate-slug}.md`
- `architecture-addendum-{candidate-slug}.md`
- `adr-draft-{candidate-slug}.md`
- `story-slices-{candidate-slug}.md`
- `test-strategy-{candidate-slug}.md`

## Workflow

### 1. Build a working map

Start with a compact working map:

- Domain terms
- Relevant ADR constraints
- Current module seams
- Testability pain
- Likely high-friction areas

If `CONTEXT-MAP.md` exists, follow it before reading any matching `CONTEXT.md` files.

### 2. Explore for deepening candidates

Explore the codebase for shallow modules and low-locality behavior.

Look for:

- orchestration duplicated across callers
- seams with only one hypothetical adapter
- extracted helpers that moved code without increasing locality
- tests that need to mock internals instead of testing through an interface
- modules that fail the deletion test

Use the exact vocabulary from `LANGUAGE.md`.

Do not propose interfaces yet.

Write `deepening-candidates.md` with numbered candidates. For each candidate include:

- Files
- Problem
- Why the module is shallow or low-locality
- Deepening direction
- Testability improvement
- BMad impact

For BMad impact include:

- ADR needed: yes/no
- Story count: small/medium/large
- Risk: low/medium/high

Then ask:

`Which candidate do you want to explore?`

Stop until the user chooses one.

### 3. Run the grilling loop

For the chosen candidate, ask only the questions needed to remove design risk:

- What must stay stable?
- Which callers matter most?
- Which tests must survive?
- Which ADRs are load-bearing?
- Is this refactor-only or behavior-changing?
- What failures keep recurring here?

If the user rejects a direction for a durable reason, offer to record that as an ADR draft so the same idea is not re-suggested later.

### 4. Design interfaces

Use `INTERFACE-DESIGN.md` to produce at least three interface options:

- minimal interface
- flexible interface
- caller-optimized interface
- ports-and-adapters interface only when the dependency shape justifies it

Write `interface-options-{candidate-slug}.md`.

Compare options by:

- Depth
- Locality
- Seam placement
- Adapter strategy
- Test surface
- Migration cost
- ADR compatibility
- Story slicing

### 5. Recommend one direction

Write `recommendation-{candidate-slug}.md` with:

- recommended interface
- why it wins
- what stays behind the seam
- migration risks
- rollback plan

Be opinionated. Prefer one recommendation or a clear hybrid.

### 6. Generate BMad-ready artifacts

Write:

- `architecture-addendum-{candidate-slug}.md`
- `adr-draft-{candidate-slug}.md`
- `story-slices-{candidate-slug}.md`
- `test-strategy-{candidate-slug}.md`

Artifact rules:

- The architecture addendum describes the chosen Module, Interface, Seam, and Adapter strategy.
- The ADR draft captures the decision, consequences, and rejected options.
- Story slices stay small and testable.
- The test strategy explains what moves to the interface test surface and what regression coverage must exist.

### 7. Route into the next BMad workflow

When the artifacts are complete, recommend the next workflow explicitly:

- `bmad-architecture` to absorb the addendum
- `bmad-create-epics-and-stories` to turn slices into planned work
- `bmad-create-story` for the next implementable slice
- `bmad-testarch-test-design` or `bmad-testarch-trace` when regression risk is material

Do not implement code unless the user explicitly asks.
