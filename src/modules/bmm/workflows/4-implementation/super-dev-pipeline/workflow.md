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
| 2 | step-02-pre-gap-analysis.md | DEV | Validate tasks + **detect batchable patterns** |
| 3 | step-03-implement.md | DEV | **Smart batching** + adaptive implementation |
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
- ✅ **Smart Batching** - detects and groups similar tasks automatically
- ✅ Implementation is ADAPTIVE (TDD for new, refactor for existing)
- ✅ Works for both greenfield and brownfield

### What's NEW:
- ⚡ **Pattern Detection** - automatically identifies batchable tasks
- ⚡ **Intelligent Grouping** - groups similar tasks for batch execution
- ⚡ **Time Optimization** - 50-70% faster for repetitive work
- ⚡ **Safety Preserved** - validation gates enforce discipline

---

## SMART BATCHING FEATURE

### What is Smart Batching?

**Smart batching** is an intelligent optimization that groups similar, low-risk tasks for batch execution while maintaining full validation discipline.

**NOT Vibe Coding:**
- ✅ Pattern detection is systematic (not guesswork)
- ✅ Batches are validated as a group (not skipped)
- ✅ Failure triggers fallback to one-at-a-time
- ✅ High-risk tasks always executed individually

**When It Helps:**
- Large stories with repetitive tasks (100+ tasks)
- Package migration work (installing multiple packages)
- Module refactoring (same pattern across files)
- Code cleanup (delete old implementations)

**Time Savings:**
```
Example: 100-task story
- Without batching: 100 tasks × 2 min = 200 minutes (3.3 hours)
- With batching: 6 batches × 10 min + 20 individual × 2 min = 100 minutes (1.7 hours)
- Savings: 100 minutes (50% faster!)
```

### Batchable Pattern Types

| Pattern | Example Tasks | Risk | Validation |
|---------|--------------|------|------------|
| **Package Install** | Add dependencies | LOW | Build succeeds |
| **Module Registration** | Import modules | LOW | TypeScript compiles |
| **Code Deletion** | Remove old code | LOW | Tests pass |
| **Import Updates** | Update import paths | LOW | Build succeeds |
| **Config Changes** | Update settings | LOW | App starts |

### NON-Batchable (Individual Execution)

| Pattern | Example Tasks | Risk | Why Individual |
|---------|--------------|------|----------------|
| **Business Logic** | Circuit breaker fallbacks | MEDIUM-HIGH | Logic varies per case |
| **Security Code** | Auth/authorization | HIGH | Mistakes are critical |
| **Data Migrations** | Schema changes | HIGH | Irreversible |
| **API Integration** | External service calls | MEDIUM | Error handling varies |
| **Novel Patterns** | First-time implementation | MEDIUM | Unproven approach |

### How It Works

**Step 2 (Pre-Gap Analysis):**
1. Analyzes all tasks
2. Detects repeating patterns
3. Categorizes as batchable or individual
4. Generates batching plan with time estimates
5. Adds plan to story file

**Step 3 (Implementation):**
1. Loads batching plan
2. Executes pattern batches first
3. Validates each batch
4. Fallback to individual if batch fails
5. Executes individual tasks with full rigor

**Safety Mechanisms:**
- Pattern detection uses conservative rules (default to individual)
- Each batch has explicit validation strategy
- Failed batch triggers automatic fallback
- High-risk tasks never batched
- All validation gates still enforced

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
