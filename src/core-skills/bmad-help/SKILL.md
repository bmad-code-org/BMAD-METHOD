---
name: bmad-help
description: 'Analyzes current state and user query to answer BMad questions or recommend the next skill(s) to use. Use when user asks for help, bmad help, what to do next, or what to start with in BMad'
---

# BMad Help

## Purpose

Help the user understand where they are in their BMad workflow and what to do next, and also answer broader questions when asked that could be augmented with remote sources such as module documentation sources.

## Desired Outcomes

When this skill completes, the user should:

1. **Know where they are** — which module and phase they're in, what's already been completed
2. **Know what to do next** — the next recommended and/or required step, with clear reasoning
3. **Know how to invoke it** — skill name, menu code, action context, and any args that shortcut the conversation
4. **Get offered a quick start** — when a single skill is the clear next step, offer to run it for the user right now rather than just listing it
5. **Feel oriented, not overwhelmed** — surface only what's relevant to their current position; don't dump the entire catalog
6. **Get answers to general questions** — when the question doesn't map to a specific skill, use the module's registered documentation to give a grounded answer

## Data Sources

- **Catalog**: `{project-root}/_bmad/_config/bmad-help.csv` — assembled manifest of all installed module skills
- **Config**: Run `uv run {project-root}/_bmad/scripts/resolve_config.py --project-root {project-root}` and use the merged JSON to resolve `output-location` variables and read `core.communication_language` and `modules.bmm.project_knowledge`. The resolver merges `_bmad/config.toml`, `_bmad/config.user.toml`, `_bmad/custom/config.toml`, and `_bmad/custom/config.user.toml` in that order.
- **Artifacts**: Files matching `outputs` patterns at resolved `output-location` paths reveal which steps are possibly completed; their content may also provide grounding context for recommendations
- **Project knowledge**: If `project_knowledge` resolves to an existing path, read it for grounding context. Never fabricate project-specific details.
- **Module docs**: Rows with `_meta` in the `skill` column carry a URL or path in `output-location` pointing to the module's documentation (e.g., llms.txt). Fetch and use these to answer general questions about that module.

## Artifact Completion Contracts

When an artifact folder or file is found during phase detection, **always verify
completion before treating it as done.** File presence is necessary but not sufficient.

An artifact is **COMPLETE** when its specific completion signal is satisfied (see table).
Any artifact that exists but does not meet its completion signal is **IN_PROGRESS** —
it marks the current phase as still active. Never recommend advancing to the next phase
while any required artifact is IN_PROGRESS.

### Phase 1 — Analysis

| Artifact | Folder pattern | Primary file | Completion signal |
|---|---|---|---|
| Brainstorming | `brainstorming/brainstorm-*/` (under `output_folder`) | `.memlog.md` + `brainstorm-intent.md` | `.memlog.md` contains `"status": "complete"` (set by `memlog.py set --key status --value complete`) |
| Deep Recon (market / domain / technical) | `research/{type}-*/` (under `planning_artifacts`) | `research.md` | frontmatter `status: complete` (set in `synthesis.md` before Finalize) — no canonical memlog event text is prescribed by this skill |
| Product Brief | `briefs/brief-*/` (under `planning_artifacts`) | `brief.md` | `brief.md` has content below the YAML frontmatter (document sections exist beyond the frontmatter fields) **and** `.memlog.md` exists `[CAVEAT: Finalize never changes status: draft and appends no canonical event — the only proxy is substantive body content beyond the frontmatter skeleton; a freshly initialized brief has frontmatter only]` |
| PRFAQ | `planning_artifacts/` root (no run subfolder) | `prfaq-{project_name}.md` | frontmatter `status: "complete"` (set at Stage 5 of the verdict) |

### Phase 2 — Planning

| Artifact | Folder pattern | Primary file | Completion signal |
|---|---|---|---|
| PRD | `prds/prd-*/` (under `planning_artifacts`) | `prd.md` | frontmatter `status: final` **and** `.memlog.md` contains the text `PRD finalized` |
| UX Design | `ux-designs/ux-*/` (under `planning_artifacts`) | `DESIGN.md` + `EXPERIENCE.md` | **Both** files have frontmatter `status: final` **and** `.memlog.md` contains the text `spines finalized` |

### Phase 3 — Solutioning

| Artifact | Folder pattern | Primary file | Completion signal |
|---|---|---|---|
| Architecture Spine | `architecture/architecture-*/` (under `planning_artifacts`) | `ARCHITECTURE-SPINE.md` | frontmatter `status: final` **and** `.memlog.md` contains the text `spine finalized` |
| Epics & Stories | `planning_artifacts/` root (no run subfolder) | `epics.md` | frontmatter `stepsCompleted` array contains `4` (the final step index) — this skill uses no `status:` field and no memlog |
| Sprint Planning / Readiness | `implementation_artifacts/` | `sprint-status.yaml` | file exists with a non-empty `development_status` map — no `status:` field or memlog used |

### Verification procedure

For every artifact folder or file found during phase detection:

1. Read the primary file(s) listed in the table above.
2. Apply the completion signal check for that artifact type.
3. If the signal is not satisfied → artifact is **IN_PROGRESS**.
4. If the signal is satisfied → artifact is **COMPLETE**.
5. If the folder exists but the primary file is absent → artifact is **IN_PROGRESS** (started but not written yet).
6. If neither folder nor file exists → artifact is **ABSENT** (phase not started for this artifact).

For root-level artifacts (PRFAQ, Epics & Stories, Sprint Planning): detect by the presence
of their specific files (`prfaq-{project_name}.md`, `epics.md`, `sprint-status.yaml`) — not
by the existence of `planning_artifacts/` or `implementation_artifacts/` root folders, which
are always present in any BMad project.

When reporting to the user, distinguish clearly:
- COMPLETE → this step is done, can advance.
- IN_PROGRESS → still active, recommend continuing the skill that owns this artifact.
- ABSENT → not started, recommend starting if required.

## CSV Interpretation

The catalog uses this format:

```
module,skill,display-name,menu-code,description,action,args,phase,preceded-by,followed-by,required,output-location,outputs
```

**Phases** determine the high-level flow:
- `anytime` — available regardless of workflow state
- Skills group into folders (`plan`, `ship`; some modules use numbered phases) and flow in order; naming varies by module

**Sequencing** determines recommended ordering within and across phases (these are soft suggestions, not hard gates — see `required` for gating):
- `preceded-by` — skills that should ideally complete before this one
- `followed-by` — skills that should ideally run after this one
- Format: `skill-name` for single-action skills, `skill-name:action` for multi-action skills

**Required gates**:
- `required=true` items must complete before the user can meaningfully proceed to later phases
- A phase with no required items is entirely optional — recommend it but be clear about what's actually required next

**Completion detection** — priority order (highest wins):

1. **User explicit statement** — if the user states a step is done or not done, believe them.

2. **Artifact Completion Contracts** — when files are found at the expected output paths,
   consult the `## Artifact Completion Contracts` section above before treating them as done.
   Apply the verification procedure for each artifact type:
   - Read the primary file and check its specific completion signal (status field, memlog text,
     stepsCompleted array, or non-empty body — as defined per artifact type).
   - A folder or file existing is necessary but **not sufficient** for completion.
   - `status: draft` means IN_PROGRESS for artifact types that use `status` as a completion signal (PRD, UX Design, Architecture Spine, PRFAQ). Product Brief is exempt — its `status` field remains `draft` permanently even after completion; use its specific body-content contract instead.
   - Report COMPLETE, IN_PROGRESS, or ABSENT per artifact — never infer done from presence alone.

3. **File-presence fallback** — only for artifact types not covered by the Contracts table
   (e.g., third-party or community module outputs with no defined contract): fuzzy-match found
   files to catalog rows. Always caveat to the user: *"I'm inferring this from file presence —
   confirm if incorrect."*

**Descriptions carry routing context** — some contain cycle info and alternate paths (e.g., "back to DS if fixes needed"). Read them as navigation hints, not just display text.

## Response Format

For each recommended item, present:
- `[menu-code]` **Display name** — e.g., "[PR] PRD"
- Skill name in backticks — e.g., `bmad-prd`
- For multi-action skills: action invocation context — e.g., "dev lets run a code review!"
- Description if present in CSV; otherwise your existing knowledge of the skill suffices
- Args if available

**Ordering**: Show optional items first, then the next required item. Make it clear which is which.

## Constraints

- Present all output in `{communication_language}`
- Recommend running each skill in a **fresh context window**
- Match the user's tone — conversational when they're casual, structured when they want specifics
- If the active module is ambiguous, retrieve all meta rows remote sources to find relevant info also to help answer their question
