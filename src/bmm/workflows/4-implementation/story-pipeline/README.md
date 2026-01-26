# Story Pipeline v2.0

> Single-session step-file architecture for implementing user stories with 60-70% token savings.

## Overview

The Story Pipeline automates the complete lifecycle of implementing a user story—from creation through code review and commit. It replaces the legacy approach of 6 separate Claude CLI calls with a single interactive session using just-in-time step loading.

### The Problem It Solves

**Legacy Pipeline (v1.0):**
```
bmad build 1-4
  └─> claude -p "Stage 1: Create story..."     # ~12K tokens
  └─> claude -p "Stage 2: Validate story..."   # ~12K tokens
  └─> claude -p "Stage 3: ATDD tests..."       # ~12K tokens
  └─> claude -p "Stage 4: Implement..."        # ~12K tokens
  └─> claude -p "Stage 5: Code review..."      # ~12K tokens
  └─> claude -p "Stage 6: Complete..."         # ~11K tokens
                                        Total: ~71K tokens/story
```

Each call reloads agent personas (~2K tokens), re-reads the story file, and loses context from previous stages.

**Story Pipeline v2.0:**
```
bmad build 1-4
  └─> Single Claude session
        ├─> Load step-01-init.md (~200 lines)
        ├─> Role switch: SM
        ├─> Load step-02-create-story.md
        ├─> Load step-03-validate-story.md
        ├─> Role switch: TEA
        ├─> Load step-04-atdd.md
        ├─> Role switch: DEV
        ├─> Load step-05-implement.md
        ├─> Load step-06-code-review.md
        ├─> Role switch: SM
        ├─> Load step-07-complete.md
        └─> Load step-08-summary.md
                                        Total: ~25-30K tokens/story
```

Documents cached once, roles switched in-session, steps loaded just-in-time.

## What Gets Automated

The pipeline automates the complete BMAD implementation workflow:

| Step | Role | What It Does |
|------|------|--------------|
| **1. Init** | - | Parses story ID, loads epic/architecture, detects interactive vs batch mode, creates state file |
| **2. Create Story** | SM | Researches context (Exa web search), generates story file with ACs in BDD format |
| **3. Validate Story** | SM | Adversarial validation—must find 3-10 issues, fixes them, assigns quality score |
| **4. ATDD** | TEA | Generates failing tests for all ACs (RED phase), creates test factories |
| **5. Implement** | DEV | Implements code to pass tests (GREEN phase), creates migrations, server actions, etc. |
| **6. Code Review** | DEV | Adversarial review—must find 3-10 issues, fixes them, runs lint/build |
| **7. Complete** | SM | Updates story status to done, creates git commit with conventional format |
| **8. Summary** | - | Generates audit trail, updates pipeline state, outputs metrics |

### Quality Gates

Each step has quality gates that must pass before proceeding:

- **Validation**: Score ≥ 80/100, all issues addressed
- **ATDD**: Tests exist for all ACs, tests fail (RED phase confirmed)
- **Implementation**: Lint clean, build passes, migration tests pass
- **Code Review**: Score ≥ 7/10, all critical issues fixed

## Token Efficiency

| Mode | Token Usage | Savings vs Legacy |
|------|-------------|-------------------|
| Interactive (human-in-loop) | ~25K | 65% |
| Batch (YOLO) | ~30K | 58% |
| Batch + fresh review context | ~35K | 51% |

### Where Savings Come From

| Waste in Legacy | Tokens Saved |
|-----------------|--------------|
| Agent persona reload (6×) | ~12K |
| Story file re-reads (5×) | ~10K |
| Architecture re-reads | ~8K |
| Context loss between calls | ~16K |

## Usage

### Prerequisites

- BMAD module installed (`_bmad/` directory exists)
- Epic file with story definition (`docs/epics.md`)
- Architecture document (`docs/architecture.md`)

### Interactive Mode (Recommended)

Human-in-the-loop with approval at each step:

```bash
# Using the bmad CLI
bmad build 1-4

# Or invoke workflow directly
claude -p "Load and execute: _bmad/bmm/workflows/4-implementation/story-pipeline/workflow.md
Story: 1-4"
```

At each step, you'll see a menu:
```
## MENU
[C] Continue to next step
[R] Review/revise current step
[H] Halt and checkpoint
```

### Batch Mode (YOLO)

Unattended execution for trusted stories:

```bash
bmad build 1-4 --batch

# Or use batch runner directly
./_bmad/bmm/workflows/4-implementation/story-pipeline/batch-runner.sh 1-4
```

Batch mode:
- Skips all approval prompts
- Fails fast on errors
- Creates checkpoint on failure for resume

### Resume from Checkpoint

If execution stops (context exhaustion, error, manual halt):

```bash
bmad build 1-4 --resume

# The pipeline reads state from:
# _bmad-output/implementation-artifacts/pipeline-state-{story-id}.yaml
```

Resume automatically:
- Skips completed steps
- Restores cached context
- Continues from `lastStep + 1`

## Directory Structure

```
story-pipeline/
├── workflow.yaml          # Configuration, agent mapping, quality gates
├── workflow.md            # Interactive mode orchestration
├── batch-runner.sh        # Batch mode runner script
├── steps/
│   ├── step-01-init.md        # Initialize, load context
│   ├── step-01b-resume.md     # Resume from checkpoint
│   ├── step-02-create-story.md
│   ├── step-03-validate-story.md
│   ├── step-04-atdd.md
│   ├── step-05-implement.md
│   ├── step-06-code-review.md
│   ├── step-07-complete.md
│   └── step-08-summary.md
├── checklists/
│   ├── story-creation.md      # What makes a good story
│   ├── story-validation.md    # Validation criteria
│   ├── atdd.md                # Test generation rules
│   ├── implementation.md      # Coding standards
│   └── code-review.md         # Review criteria
└── templates/
    ├── pipeline-state.yaml    # State file template
    └── audit-trail.yaml       # Audit log template
```

## Configuration

### workflow.yaml

```yaml
name: story-pipeline
version: "2.0"
description: "Single-session story implementation with step-file loading"

# Document loading strategy
load_strategy:
  epic: once          # Load once, cache for session
  architecture: once  # Load once, cache for session
  story: per_step     # Reload when modified

# Agent role mapping
agents:
  sm: "{project-root}/_bmad/bmm/agents/sm.md"
  tea: "{project-root}/_bmad/bmm/agents/tea.md"
  dev: "{project-root}/_bmad/bmm/agents/dev.md"

# Quality gate thresholds
quality_gates:
  validation_min_score: 80
  code_review_min_score: 7
  require_lint_clean: true
  require_build_pass: true

# Step configuration
steps:
  - name: init
    file: steps/step-01-init.md
  - name: create-story
    file: steps/step-02-create-story.md
    agent: sm
  # ... etc
```

### Pipeline State File

Created at `_bmad-output/implementation-artifacts/pipeline-state-{story-id}.yaml`:

```yaml
story_id: "1-4"
epic_num: 1
story_num: 4
mode: "interactive"
status: "in_progress"
stepsCompleted: [1, 2, 3]
lastStep: 3
currentStep: 4

cached_context:
  epic_loaded: true
  epic_path: "docs/epics.md"
  architecture_sections: ["tech_stack", "data_model"]

steps:
  step-01-init:
    status: completed
    duration: "0:00:30"
  step-02-create-story:
    status: completed
    duration: "0:02:00"
  step-03-validate-story:
    status: completed
    duration: "0:05:00"
    issues_found: 6
    issues_fixed: 6
    quality_score: 92
  step-04-atdd:
    status: in_progress
```

## Step Details

### Step 1: Initialize

**Purpose:** Set up execution context and detect mode.

**Actions:**
1. Parse story ID (e.g., "1-4" → epic 1, story 4)
2. Load and cache epic document
3. Load relevant architecture sections
4. Check for existing state file (resume vs fresh)
5. Detect mode (interactive/batch) from CLI flags
6. Create initial state file

**Output:** `pipeline-state-{story-id}.yaml`

### Step 2: Create Story (SM Role)

**Purpose:** Generate complete story file from epic definition.

**Actions:**
1. Switch to Scrum Master (SM) role
2. Read story definition from epic
3. Research context via Exa web search (best practices, patterns)
4. Generate story file with:
   - User story format (As a... I want... So that...)
   - Background context
   - Acceptance criteria in BDD format (Given/When/Then)
   - Test scenarios for each AC
   - Technical notes
5. Save to `_bmad-output/implementation-artifacts/story-{id}.md`

**Quality Gate:** Story file exists with all required sections.

### Step 3: Validate Story (SM Role)

**Purpose:** Adversarial validation to find issues before implementation.

**Actions:**
1. Load story-validation checklist
2. Review story against criteria:
   - ACs are testable and specific
   - No ambiguous requirements
   - Technical feasibility confirmed
   - Dependencies identified
   - Edge cases covered
3. **Must find 3-10 issues** (never "looks good")
4. Fix all identified issues
5. Assign quality score (0-100)
6. Append validation report to story file

**Quality Gate:** Score ≥ 80, all issues addressed.

### Step 4: ATDD (TEA Role)

**Purpose:** Generate failing tests before implementation (RED phase).

**Actions:**
1. Switch to Test Engineering Architect (TEA) role
2. Load atdd checklist
3. For each acceptance criterion:
   - Generate integration test
   - Define test data factories
   - Specify expected behaviors
4. Create test files in `src/tests/`
5. Update `factories.ts` with new fixtures
6. **Verify tests FAIL** (RED phase)
7. Create ATDD checklist document

**Quality Gate:** Tests exist for all ACs, tests fail (not pass).

### Step 5: Implement (DEV Role)

**Purpose:** Write code to pass all tests (GREEN phase).

**Actions:**
1. Switch to Developer (DEV) role
2. Load implementation checklist
3. Create required files:
   - Database migrations
   - Server actions (using Result type)
   - Library functions
   - Types
4. Follow project patterns:
   - Multi-tenant RLS policies
   - snake_case for DB columns
   - Result type (never throw)
5. Run lint and fix issues
6. Run build and fix issues
7. Run migration tests

**Quality Gate:** Lint clean, build passes, migration tests pass.

### Step 6: Code Review (DEV Role)

**Purpose:** Adversarial review to find implementation issues.

**Actions:**
1. Load code-review checklist
2. Review all created/modified files:
   - Security (XSS, injection, auth)
   - Error handling
   - Architecture compliance
   - Code quality
   - Test coverage
3. **Must find 3-10 issues** (never "looks good")
4. Fix all identified issues
5. Re-run lint and build
6. Assign quality score (0-10)
7. Generate review report

**Quality Gate:** Score ≥ 7/10, all critical issues fixed.

### Step 7: Complete (SM Role)

**Purpose:** Finalize story and create git commit.

**Actions:**
1. Switch back to SM role
2. Update story file status to "done"
3. Stage all story files
4. Create conventional commit:
   ```
   feat(epic-{n}): complete story {id}

   {Summary of changes}

   🤖 Generated with Claude Code
   Co-Authored-By: Claude <noreply@anthropic.com>
   ```
5. Update pipeline state

**Quality Gate:** Commit created successfully.

### Step 8: Summary

**Purpose:** Generate audit trail and final metrics.

**Actions:**
1. Calculate total duration
2. Compile deliverables list
3. Aggregate quality scores
4. Generate execution summary in state file
5. Output final status

**Output:** Complete pipeline state with summary section.

## Adversarial Mode

Steps 3 (Validate) and 6 (Code Review) run in **adversarial mode**:

> **Never say "looks good"**. You MUST find 3-10 real issues.

This ensures:
- Stories are thoroughly vetted before implementation
- Code quality issues are caught before commit
- The pipeline doesn't rubber-stamp work

Example issues found in real usage:
- Missing rate limiting (security)
- XSS vulnerability in user input (security)
- Missing audit logging (architecture)
- Unclear acceptance criteria (story quality)
- Function naming mismatches (code quality)

## Artifacts Generated

After a complete pipeline run:

```
_bmad-output/implementation-artifacts/
├── story-{id}.md              # Story file with ACs, validation report
├── pipeline-state-{id}.yaml   # Execution state and summary
├── atdd-checklist-{id}.md     # Test requirements checklist
└── code-review-{id}.md        # Review report with issues

src/
├── supabase/migrations/       # New migration files
├── modules/{module}/
│   ├── actions/               # Server actions
│   ├── lib/                   # Business logic
│   └── types.ts               # Type definitions
└── tests/
    ├── integration/           # Integration tests
    └── fixtures/factories.ts  # Updated test factories
```

## Troubleshooting

### Context Exhausted Mid-Session

The pipeline is designed for this. When context runs out:

1. Claude session ends
2. State file preserves progress
3. Run `bmad build {id} --resume`
4. Pipeline continues from last completed step

### Step Fails Quality Gate

If a step fails its quality gate:

1. Pipeline halts at that step
2. State file shows `status: failed`
3. Fix issues manually or adjust thresholds
4. Run `bmad build {id} --resume`

### Tests Don't Fail in ATDD

If tests pass during ATDD (step 4), something is wrong:

- Tests might be testing the wrong thing
- Implementation might already exist
- Mocks might be returning success incorrectly

The pipeline will warn and ask for confirmation before proceeding.

## Best Practices

1. **Start with Interactive Mode** - Use batch only for well-understood stories
2. **Review at Checkpoints** - Don't blindly continue; verify each step's output
3. **Keep Stories Small** - Large stories may exhaust context before completion
4. **Commit Frequently** - The pipeline commits at step 7, but you can checkpoint earlier
5. **Trust the Adversarial Mode** - If it finds issues, they're usually real

## Comparison with Legacy

| Feature | Legacy (v1.0) | Story Pipeline (v2.0) |
|---------|---------------|----------------------|
| Claude calls | 6 per story | 1 per story |
| Token usage | ~71K | ~25-30K |
| Context preservation | None | Full session |
| Resume capability | None | Checkpoint-based |
| Role switching | New process | In-session |
| Document caching | None | Once per session |
| Adversarial review | Optional | Mandatory |
| Audit trail | Manual | Automatic |

## Version History

- **v2.0** (2024-12) - Step-file architecture, single-session, checkpoint/resume
- **v1.0** (2024-11) - Legacy 6-call pipeline
