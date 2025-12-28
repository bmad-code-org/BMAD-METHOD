---
name: super-dev-pipeline
description: Step-file architecture for super-dev workflow - disciplined execution for both greenfield and brownfield development
web_bundle: true
---

# Super-Dev Pipeline Workflow

**Goal:** Execute story development with disciplined step-file architecture that prevents "vibe coding" and works for both new features and existing codebase modifications.

**Your Role:** You are the **BMAD Pipeline Orchestrator**. You will follow each step file precisely, without deviation, optimization, or skipping ahead.

**Key Principle:** This workflow uses **step-file architecture** for disciplined execution that prevents Claude from veering off-course when token usage is high.

---

## WORKFLOW ARCHITECTURE

This uses **step-file architecture** borrowed from story-pipeline:

### Core Principles

- **Micro-file Design**: Each step is a self-contained instruction file (~150-300 lines)
- **Just-In-Time Loading**: Only the current step file is in memory
- **Mandatory Sequences**: Execute all numbered sections in order, never deviate
- **State Tracking**: Pipeline state in `{sprint_artifacts}/super-dev-state-{story_id}.yaml`
- **No Vibe Coding**: Explicit instructions prevent optimization/deviation

### Step Processing Rules

1. **READ COMPLETELY**: Always read the entire step file before taking any action
2. **FOLLOW SEQUENCE**: Execute all numbered sections in order, never deviate
3. **QUALITY GATES**: Complete gate criteria before proceeding to next step
4. **WAIT FOR INPUT**: In interactive mode, halt at menus and wait for user selection
5. **SAVE STATE**: Update pipeline state file after each step completion
6. **LOAD NEXT**: When directed, load, read entire file, then execute the next step

### Critical Rules (NO EXCEPTIONS)

- **NEVER** load multiple step files simultaneously
- **ALWAYS** read entire step file before execution
- **NEVER** skip steps or optimize the sequence
- **ALWAYS** update pipeline state after completing each step
- **ALWAYS** follow the exact instructions in the step file
- **NEVER** create mental todo lists from future steps
- **NEVER** look ahead to future step files
- **NEVER** vibe code when token usage is high - follow the steps exactly!

---

## STEP FILE MAP

| Step | File | Agent | Purpose |
|------|------|-------|---------|
| 1 | step-01-init.md | - | Load story, detect greenfield vs brownfield |
| 2 | step-02-pre-gap-analysis.md | DEV | Validate/refine tasks against codebase |
| 3 | step-03-implement.md | DEV | Adaptive implementation (TDD or refactor) |
| 4 | step-04-post-validation.md | DEV | Verify completed tasks vs reality |
| 5 | step-05-code-review.md | DEV | Find 3-10 specific issues |
| 6 | step-06-complete.md | SM | Commit and push changes |
| 7 | step-07-summary.md | - | Audit trail generation |

---

## KEY DIFFERENCES FROM story-pipeline

### What's REMOVED:
- ❌ Step 2 (create-story) - assumes story already exists
- ❌ Step 4 (ATDD) - not mandatory for brownfield

### What's ENHANCED:
- ✅ Pre-gap analysis is MORE thorough (validates against existing code)
- ✅ Implementation is ADAPTIVE (TDD for new, refactor for existing)
- ✅ Works for both greenfield and brownfield

---

## EXECUTION MODES

### Interactive Mode (Default)
```bash
bmad super-dev-pipeline
```

Features:
- Menu navigation between steps
- User approval at quality gates
- Can pause and resume

### Batch Mode (For autonomous-epic)
```bash
bmad super-dev-pipeline --batch
```

Features:
- Auto-proceed through all steps
- Fail-fast on errors
- No vibe coding even at high token counts

---

## INITIALIZATION SEQUENCE

### 1. Configuration Loading

Load config from `{project-root}/_bmad/bmm/config.yaml` and resolve:
- `output_folder`, `sprint_artifacts`, `communication_language`

### 2. Pipeline Parameters

Resolve from invocation:
- `story_id`: Story identifier (e.g., "1-4")
- `story_file`: Path to story file (must exist!)
- `mode`: "interactive" or "batch"

### 3. Document Pre-loading

Load and cache these documents (read once, use across steps):
- Story file: Required, must exist
- Project context: `**/project-context.md`
- Epic file: Optional, for context

### 4. First Step Execution

Load, read the full file and then execute:
`{project-root}/_bmad/bmm/workflows/4-implementation/super-dev-pipeline/steps/step-01-init.md`

---

## QUALITY GATES

Each gate must pass before proceeding:

### Pre-Gap Analysis Gate (Step 2)
- [ ] All tasks validated against codebase
- [ ] Existing code analyzed
- [ ] Tasks refined if needed
- [ ] No missing context

### Implementation Gate (Step 3)
- [ ] All tasks completed
- [ ] Tests pass
- [ ] Code follows project patterns
- [ ] No TypeScript errors

### Post-Validation Gate (Step 4)
- [ ] All completed tasks verified against codebase
- [ ] Zero false positives (or re-implementation complete)
- [ ] Files/functions/tests actually exist
- [ ] Tests actually pass (not just claimed)

### Code Review Gate (Step 5)
- [ ] 3-10 specific issues identified (not "looks good")
- [ ] All issues resolved or documented
- [ ] Security review complete

---

## ANTI-VIBE-CODING ENFORCEMENT

This workflow **prevents vibe coding** through:

1. **Mandatory Sequence**: Can't skip ahead or optimize
2. **Micro-file Loading**: Only current step in memory
3. **Quality Gates**: Must pass criteria to proceed
4. **State Tracking**: Progress is recorded and verified
5. **Explicit Instructions**: No interpretation required

**Even at 200K tokens**, Claude must:
- ✅ Read entire step file
- ✅ Follow numbered sequence
- ✅ Complete quality gate
- ✅ Update state
- ✅ Load next step

**No shortcuts. No optimizations. No vibe coding.**

---

## SUCCESS METRICS

### ✅ SUCCESS
- Pipeline completes all 7 steps
- All quality gates passed
- Story status updated
- Git commit created
- Audit trail generated
- **No vibe coding occurred**

### ❌ FAILURE
- Step file instructions skipped or optimized
- Quality gate bypassed without approval
- State file not updated
- Tests not verified
- Code review accepts "looks good"
- **Vibe coding detected**

---

## COMPARISON WITH OTHER WORKFLOWS

| Feature | super-dev-story | story-pipeline | super-dev-pipeline |
|---------|----------------|----------------|-------------------|
| Architecture | Orchestration | Step-files | Step-files |
| Story creation | Separate workflow | Included | ❌ Not included |
| ATDD mandatory | No | Yes | No (adaptive) |
| Greenfield | ✅ | ✅ | ✅ |
| Brownfield | ✅ | ❌ Limited | ✅ |
| Token efficiency | ~100-150K | ~25-30K | ~40-60K |
| Vibe-proof | ❌ | ✅ | ✅ |

---

**super-dev-pipeline is the best of both worlds for autonomous-epic!**
