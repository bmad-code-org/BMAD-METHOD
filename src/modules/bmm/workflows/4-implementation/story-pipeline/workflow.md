---
name: story-pipeline
description: Automated story development pipeline with token-efficient step-file architecture. Single-session orchestration replacing multiple Claude calls.
web_bundle: true
---

# Story Pipeline Workflow

**Goal:** Execute complete story development lifecycle in a single Claude session: create story, validate, generate tests (ATDD), implement, code review, and complete.

**Your Role:** You are the **BMAD Pipeline Orchestrator**. You will switch between agent roles (SM, TEA, DEV) as directed by each step file. Maintain context across role switches without reloading agent personas.

**Token Efficiency:** This workflow uses step-file architecture for ~60-70% token savings compared to separate Claude calls.

---

## WORKFLOW ARCHITECTURE

This uses **step-file architecture** for disciplined execution:

### Core Principles

- **Micro-file Design**: Each step is a self-contained instruction file (~150-250 lines)
- **Just-In-Time Loading**: Only the current step file is in memory
- **Role Switching**: Same session, explicit role switch instead of fresh Claude calls
- **State Tracking**: Pipeline state in `{sprint_artifacts}/pipeline-state-{story_id}.yaml`
- **Checkpoint/Resume**: Can resume from any completed step after failure

### Step Processing Rules

1. **READ COMPLETELY**: Always read the entire step file before taking any action
2. **FOLLOW SEQUENCE**: Execute all numbered sections in order, never deviate
3. **ROLE SWITCH**: When step specifies a role, adopt that agent's perspective
4. **QUALITY GATES**: Complete gate criteria before proceeding to next step
5. **WAIT FOR INPUT**: In interactive mode, halt at menus and wait for user selection
6. **SAVE STATE**: Update pipeline state file after each step completion
7. **LOAD NEXT**: When directed, load, read entire file, then execute the next step

### Critical Rules (NO EXCEPTIONS)

- **NEVER** load multiple step files simultaneously
- **ALWAYS** read entire step file before execution
- **NEVER** skip steps or optimize the sequence
- **ALWAYS** update pipeline state after completing each step
- **ALWAYS** follow the exact instructions in the step file
- **NEVER** create mental todo lists from future steps
- **NEVER** look ahead to future step files

### Mode Differences

| Aspect | Interactive | Batch |
|--------|-------------|-------|
| Menus | Present, wait for [C] | Auto-proceed |
| Approval | Required at gates | Skip with YOLO |
| On failure | Halt, checkpoint | Checkpoint, exit |
| Code review | Same session | Fresh context option |

---

## EXECUTION MODES

### Interactive Mode (Default)

```bash
bmad build 1-4          # Interactive pipeline for story 1-4
bmad build --interactive 1-4
```

Features:
- Menu navigation between steps
- User approval at quality gates
- Can pause and resume
- Role switching in same session

### Batch Mode

```bash
bmad build --batch 1-4  # Unattended execution
```

Features:
- Auto-proceed through all steps
- YOLO mode for approvals
- Fail-fast on errors
- Optional fresh context for code review

---

## INITIALIZATION SEQUENCE

### 1. Configuration Loading

Load and read config from `{project-root}/_bmad/bmm/config.yaml` and resolve:
- `output_folder`, `sprint_artifacts`, `communication_language`

### 2. Pipeline Parameters

Resolve from invocation:
- `story_id`: Story identifier (e.g., "1-4")
- `epic_num`: Epic number (e.g., 1)
- `story_num`: Story number (e.g., 4)
- `mode`: "interactive" or "batch"

### 3. Document Pre-loading

Load and cache these documents (read once, use across steps):
- Story file: `{sprint_artifacts}/story-{epic_num}-{story_num}.md`
- Epic file: `{output_folder}/epic-{epic_num}.md`
- Architecture: `{output_folder}/architecture.md` (selective sections)
- Project context: `**/project-context.md`

### 4. First Step Execution

Load, read the full file and then execute:
`{project-root}/_bmad/bmm/workflows/4-implementation/story-pipeline/steps/step-01-init.md`

---

## STEP FILE MAP

| Step | File | Agent | Purpose |
|------|------|-------|---------|
| 1 | step-01-init.md | - | Load context, detect mode, cache docs |
| 1b | step-01b-resume.md | - | Resume from checkpoint (conditional) |
| 2 | step-02-create-story.md | SM | Create detailed story with research |
| 3 | step-03-validate-story.md | SM | Adversarial validation |
| 4 | step-04-atdd.md | TEA | Generate failing tests (red phase) |
| 5 | step-05-implement.md | DEV | Implement to pass tests (green phase) |
| 5b | step-05b-post-validation.md | DEV | Verify completed tasks vs codebase reality |
| 6 | step-06-code-review.md | DEV | Find 3-10 specific issues |
| 7 | step-07-complete.md | SM | Update status, git commit |
| 8 | step-08-summary.md | - | Audit trail, summary report |

---

## ROLE SWITCHING PROTOCOL

When a step requires a different agent role:

1. **Announce Role Switch**: "Switching to [ROLE] perspective..."
2. **Adopt Mindset**: Think from that role's expertise
3. **Apply Checklist**: Use role-specific checklist from `checklists/`
4. **Maintain Context**: Keep cached documents in memory
5. **Complete Step**: Finish all step requirements before switching

Example role switches:
- Step 2-3: SM (story creation and validation)
- Step 4: SM → TEA (switch to test mindset)
- Step 5-6: TEA → DEV (switch to implementation mindset)
- Step 7: DEV → SM (switch back for completion)

---

## STATE MANAGEMENT

### Pipeline State File

Location: `{sprint_artifacts}/pipeline-state-{story_id}.yaml`

```yaml
story_id: "1-4"
epic_num: 1
story_num: 4
mode: "interactive"
stepsCompleted: [1, 2, 3]
lastStep: 3
currentStep: 4
status: "in_progress"
started_at: "2025-01-15T10:00:00Z"
updated_at: "2025-01-15T11:30:00Z"
cached_context:
  story_loaded: true
  epic_loaded: true
  architecture_sections: ["tech_stack", "data_model"]
steps:
  step-01-init: { status: completed, duration: "0:02:15" }
  step-02-create-story: { status: completed, duration: "0:15:30" }
  step-03-validate-story: { status: completed, duration: "0:08:45" }
  step-04-atdd: { status: in_progress }
  step-05-implement: { status: pending }
  step-06-code-review: { status: pending }
  step-07-complete: { status: pending }
  step-08-summary: { status: pending }
```

### Checkpoint/Resume

To resume after failure:
```bash
bmad build --resume 1-4
```

Resume logic:
1. Load state file for story 1-4
2. Find `lastStep` completed
3. Load and execute step `lastStep + 1`
4. Continue from there

---

## QUALITY GATES

Each gate must pass before proceeding:

### Story Creation Gate (Step 2)
- [ ] Story file created with proper frontmatter
- [ ] All acceptance criteria defined with Given/When/Then
- [ ] Technical context linked

### Validation Gate (Step 3)
- [ ] Story passes adversarial review
- [ ] No ambiguous requirements
- [ ] Implementation path clear

### ATDD Gate (Step 4)
- [ ] Tests exist for all acceptance criteria
- [ ] Tests fail (red phase verified)
- [ ] Test structure follows project patterns

### Implementation Gate (Step 5)
- [ ] All tests pass (green phase)
- [ ] Code follows project patterns
- [ ] No TypeScript errors
- [ ] Lint passes

### Post-Validation Gate (Step 5b)
- [ ] All completed tasks verified against codebase
- [ ] Zero false positives (or re-implementation complete)
- [ ] Files/functions/tests actually exist
- [ ] Tests actually pass (not just claimed)

### Code Review Gate (Step 6)
- [ ] 3-10 specific issues identified (not "looks good")
- [ ] All issues resolved or documented
- [ ] Security review complete

---

## SUCCESS METRICS

### ✅ SUCCESS

- Pipeline completes all 8 steps
- All quality gates passed
- Story status updated to "done"
- Git commit created
- Audit trail generated
- Token usage < 35K (target)

### ❌ FAILURE

- Step file instructions skipped or optimized
- Quality gate bypassed without approval
- Role not properly switched
- State file not updated
- Tests not verified to fail before implementation
- Code review accepts "looks good"

---

## AUDIT TRAIL

After completion, generate audit trail at:
`{sprint_artifacts}/audit-{story_id}-{date}.yaml`

Contents:
- Pipeline execution timeline
- Step durations
- Quality gate results
- Issues found and resolved
- Files modified
- Token usage estimate
