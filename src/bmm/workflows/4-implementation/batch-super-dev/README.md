# Batch Super-Dev Workflow

**Version:** 1.3.1 (Agent Limitations Documentation)
**Created:** 2026-01-06
**Updated:** 2026-01-08
**Author:** BMad

---

## Critical Prerequisites

> **⚠️ IMPORTANT: Read before running batch-super-dev!**

**BEFORE running batch-super-dev:**

### ✅ 1. All stories must be properly generated

- Run: `/create-story-with-gap-analysis` for each story
- Do NOT create skeleton/template files manually
- Validation: `./scripts/validate-all-stories.sh`

**Why:** Agents CANNOT invoke `/create-story-with-gap-analysis` workflow. Story generation requires user interaction and context-heavy codebase scanning.

### ✅ 2. All stories must have 12 BMAD sections

Required sections:
1. Business Context
2. Current State
3. Acceptance Criteria
4. Tasks/Subtasks
5. Technical Requirements
6. Architecture Compliance
7. Testing Requirements
8. Dev Agent Guardrails
9. Definition of Done
10. References
11. Dev Agent Record
12. Change Log

### ✅ 3. All stories must have tasks

- At least 3 unchecked tasks (minimum for valid story)
- Zero-task stories will be skipped
- Validation: `grep -c "^- \[ \]" story-file.md`

### Common Failure Mode: Batch Regeneration

**What you might try:**
```
1. Create 20 skeleton story files (just headers + widget lists)
2. Run /batch-super-dev
3. Expect agents to regenerate them
```

**What happens:**
- Agents identify stories are incomplete
- Agents correctly halt per super-dev-pipeline validation
- Stories get skipped (not regenerated)
- You waste time

**Solution:**
```bash
# 1. Generate all stories (1-2 days, manual)
/create-story-with-gap-analysis  # For each story

# 2. Validate (30 seconds, automated)
./scripts/validate-all-stories.sh

# 3. Execute (4-8 hours, parallel autonomous)
/batch-super-dev
```

See: `AGENT-LIMITATIONS.md` for full documentation on what agents can and cannot do.

---

## Overview

Interactive batch workflow for processing multiple `ready-for-dev` stories sequentially or in parallel using the super-dev-pipeline with full quality gates.

**New in v1.2.0:** Smart Story Validation & Auto-Creation - validates story files, creates missing stories, regenerates invalid ones automatically.
**New in v1.1.0:** Smart Story Reconciliation - automatically verifies story accuracy after each implementation.

---

## Features

### Core Capabilities

1. **🆕 Smart Story Validation & Auto-Creation** (NEW v1.2.0)
   - Validates all selected stories before processing
   - Checks for 12 required BMAD sections
   - Validates content quality (Current State ≥100 words, gap analysis present)
   - **Auto-creates missing story files** with codebase gap analysis
   - **Auto-regenerates invalid stories** (incomplete or stub files)
   - Interactive prompts (or fully automated with settings)
   - Backups existing files before regeneration

2. **Interactive Story Selection**
   - Lists all `ready-for-dev` stories from sprint-status.yaml
   - Shows story status icons (✅ file exists, ❌ missing, 🔄 needs status update)
   - Supports flexible selection syntax: single, ranges, comma-separated, "all"
   - Optional epic filtering (process only Epic 3 stories, etc.)

3. **Execution Modes**
   - **Sequential:** Process stories one-by-one in current session (easier monitoring)
   - **Parallel:** Spawn Task agents to process stories concurrently (faster, autonomous)
   - Configurable parallelism: 2, 4, or all stories at once

4. **Full Quality Gates** (from super-dev-pipeline)
   - Pre-gap analysis (validate story completeness)
   - Test-driven implementation
   - Post-validation (verify requirements met)
   - Multi-agent code review (4 specialized agents)
   - Targeted git commits
   - Definition of done verification

5. **Smart Story Reconciliation** (v1.1.0)
   - Automatically checks story accuracy after implementation
   - Verifies Acceptance Criteria checkboxes match Dev Agent Record
   - Verifies Tasks/Subtasks checkboxes match implementation
   - Verifies Definition of Done completion
   - Updates story status (done/review/in-progress) based on actual completion
   - Synchronizes sprint-status.yaml with story file status
   - **Prevents "done" stories with unchecked items** ✅

---

## Smart Story Validation & Auto-Creation (NEW v1.2.0)

### What It Does

Before processing any selected stories, the workflow automatically validates each story file:

1. **File Existence Check** - Verifies story file exists (tries multiple naming patterns)
2. **Section Validation** - Ensures all 12 BMAD sections are present
3. **Content Quality Check** - Validates sufficient content (not stubs):
   - Current State: ≥100 words
   - Gap analysis markers: ✅/❌ present
   - Acceptance Criteria: ≥3 items
   - Tasks: ≥5 items
4. **Auto-Creation** - Creates missing stories with codebase gap analysis
5. **Auto-Regeneration** - Regenerates invalid/incomplete story files

### Why This Matters

**Problem this solves:**

Before v1.2.0:
```
User: "Process stories 3.1, 3.2, 3.3, 3.4"
Workflow: "Story 3.3 file missing - please create it first"
User: Ctrl+C → /create-story → /batch-super-dev again
```

After v1.2.0:
```
User: "Process stories 3.1, 3.2, 3.3, 3.4"
Workflow: "Story 3.3 missing - create it? (yes)"
User: "yes"
Workflow: Creates story 3.3 with gap analysis → Processes all 4 stories
```

**Prevents:**
- Incomplete story files being processed
- Missing gap analysis
- Stub files (< 100 words)
- Manual back-and-forth workflow interruptions

### Validation Process

```
Load Sprint Status
       ↓
Display Available Stories
       ↓
🆕 VALIDATE EACH STORY  ← NEW STEP 2.5
       ↓
For each story:
  ┌─ File missing? → Prompt: "Create story with gap analysis?"
  │  └─ yes → /create-story-with-gap-analysis → ✅ Created
  │  └─ no → ⏭️ Skip story
  │
  ┌─ File exists but invalid?
  │  (< 12 sections OR < 100 words OR no gap analysis)
  │  → Prompt: "Regenerate story with codebase scan?"
  │  └─ yes → Backup original → /create-story-with-gap-analysis → ✅ Regenerated
  │  └─ no → ⏭️ Skip story
  │
  └─ File valid? → ✅ Ready to process
       ↓
Remove skipped stories
       ↓
Display Validated Stories
       ↓
User Selection (only validated stories)
       ↓
Process Stories
```

### Configuration Options

**In workflow.yaml:**

```yaml
# Story validation settings (NEW in v1.2.0)
validation:
  enabled: true                   # Enable/disable validation
  auto_create_missing: false      # Auto-create without prompting (use cautiously)
  auto_regenerate_invalid: false  # Auto-regenerate without prompting (use cautiously)
  min_sections: 12                # BMAD format requires all 12
  min_current_state_words: 100    # Minimum content length
  require_gap_analysis: true      # Must have ✅/❌ markers
  backup_before_regenerate: true  # Create .backup before regenerating
```

**Interactive Mode (default):**
- Prompts before creating/regenerating each story
- Safe, user retains control
- Recommended for most workflows

**Fully Automated Mode:**
```yaml
validation:
  auto_create_missing: true
  auto_regenerate_invalid: true
```
- Creates/regenerates without prompting
- Faster for large batches
- Use with caution (may overwrite valid stories)

### Example Session (v1.2.0)

```
🤖 /batch-super-dev

📊 Ready-for-Dev Stories (5)

1. **3-1-vehicle-card** ✅
   → Story file exists
2. **3-2-vehicle-search** ✅
   → Story file exists
3. **3-3-vehicle-compare** ❌
   → Story file missing
4. **3-4-vehicle-details** ⚠️
   → File exists (7/12 sections, stub content)
5. **3-5-vehicle-history** ✅
   → Story file exists

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔍 VALIDATING STORY FILES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Story 3-1-vehicle-card: ✅ Valid (12/12 sections, gap analysis present)

Story 3-2-vehicle-search: ✅ Valid (12/12 sections, gap analysis present)

📝 Story 3-3-vehicle-compare: File missing

Create story file with gap analysis? (yes/no): yes

Creating story 3-3-vehicle-compare with codebase gap analysis...
→ Scanning apps/frontend/web for existing components...
→ Scanning packages/widgets for related widgets...
→ Analyzing gap: 3 files exist, 5 need creation

✅ Story 3-3-vehicle-compare created successfully (12/12 sections)

⚠️ Story 3-4-vehicle-details: File incomplete or invalid
   - Sections: 7/12
   - Current State: stub (32 words, expected ≥100)
   - Gap analysis: missing

Regenerate story with codebase scan? (yes/no): yes

Regenerating story 3-4-vehicle-details with gap analysis...
→ Backing up to docs/sprint-artifacts/3-4-vehicle-details.md.backup
→ Scanning codebase for VehicleDetails implementation...
→ Found: packages/widgets/vehicle-details-v2 (partial)
→ Analyzing gap: 8 files exist, 3 need creation

✅ Story 3-4-vehicle-details regenerated successfully (12/12 sections)

Story 3-5-vehicle-history: ✅ Valid (12/12 sections, gap analysis present)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Story Validation Complete
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
**Validated:** 5 stories ready to process
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Select stories to process: all

[Proceeds to process all 5 validated stories...]
```

---

## Smart Story Reconciliation (v1.1.0)

### What It Does

After each story completes, the workflow automatically:

1. **Loads Dev Agent Record** - Reads implementation summary, file list, test results
2. **Analyzes Acceptance Criteria** - Checks which ACs have evidence of completion
3. **Analyzes Tasks** - Verifies which tasks have been implemented
4. **Analyzes Definition of Done** - Confirms quality gates passed
5. **Calculates Completion %** - AC%, Tasks%, DoD% percentages
6. **Determines Correct Status:**
   - `done`: AC≥95% AND Tasks≥95% AND DoD≥95%
   - `review`: AC≥80% AND Tasks≥80% AND DoD≥80%
   - `in-progress`: Below 80% on any category
7. **Updates Story File** - Checks/unchecks boxes to match reality
8. **Updates sprint-status.yaml** - Synchronizes status entry

### Why This Matters

**Problem this solves:**

Story 20.8 (before reconciliation):
- Dev Agent Record: "COMPLETE - 10 files created, 37 tests passing"
- Acceptance Criteria: All unchecked ❌
- Tasks: All unchecked ❌
- Definition of Done: All unchecked ❌
- sprint-status.yaml: `ready-for-dev` ❌
- **Reality:** Story was 100% complete but looked 0% complete!

**After reconciliation:**
- Acceptance Criteria: 17/18 checked ✅
- Tasks: 24/24 checked ✅
- Definition of Done: 24/25 checked ✅
- sprint-status.yaml: `done` ✅
- **Accurate representation of actual completion** ✅

### Reconciliation Process

```
Implementation Complete
         ↓
Load Dev Agent Record
         ↓
Parse: Implementation Summary, File List, Test Results, Completion Notes
         ↓
For each checkbox in ACs/Tasks/DoD:
  - Search Dev Agent Record for evidence
  - Determine expected status (checked/unchecked/partial)
  - Compare actual vs expected
  - Record discrepancies
         ↓
Calculate completion percentages:
  - AC: X/Y checked (Z%)
  - Tasks: X/Y checked (Z%)
  - DoD: X/Y checked (Z%)
         ↓
Determine correct story status (done/review/in-progress)
         ↓
Apply changes (with user confirmation):
  - Update checkboxes in story file
  - Update story status header
  - Update sprint-status.yaml entry
         ↓
Report final completion statistics
```

### Reconciliation Output

```
🔧 Story 20.8: Reconciling 42 issues

Changes to apply:
1. AC1: FlexibleGridSection component - CHECK (File created: FlexibleGridSection.tsx)
2. AC2: Screenshot automation - CHECK (File created: screenshot-pages.ts)
3. Task 1.3: Create page corpus generator - CHECK (File created: generate-page-corpus.ts)
... (39 more)

Apply these reconciliation changes? (yes/no): yes

✅ Story 20.8: Reconciliation complete (42 changes applied)

📊 Story 20.8 - Final Status

Acceptance Criteria: 17/18 (94%)
Tasks/Subtasks: 24/24 (100%)
Definition of Done: 24/25 (96%)

Story Status: done
sprint-status.yaml: done

✅ Story is COMPLETE and accurately reflects implementation
```

---

## Usage

### Basic Usage

```bash
# Process all ready-for-dev stories
/batch-super-dev

# Follow prompts:
# 1. See list of ready stories
# 2. Select stories to process (1,3-5,8 or "all")
# 3. Choose execution mode (sequential/parallel)
# 4. Confirm execution plan
# 5. Stories process automatically with reconciliation
# 6. Review batch summary
```

### Epic Filtering

```bash
# Only process Epic 3 stories
/batch-super-dev filter_by_epic=3
```

### Selection Syntax

```
Single: 1
Multiple: 1,3,5
Range: 1-5 (processes 1,2,3,4,5)
Mixed: 1,3-5,8 (processes 1,3,4,5,8)
All: all (processes all ready-for-dev stories)
```

### Execution Modes

**Sequential (Recommended for ≤5 stories):**
- Processes one story at a time in current session
- Easier to monitor progress
- Lower resource usage
- Can pause/cancel between stories

**Parallel (Recommended for >5 stories):**
- Spawns autonomous Task agents
- Much faster (2-4x speedup)
- Choose parallelism: 2 (conservative), 4 (moderate), all (aggressive)
- Requires more system resources

---

## Workflow Configuration

**File:** `_bmad/bmm/workflows/4-implementation/batch-super-dev/workflow.yaml`

### Key Settings

```yaml
# Safety limits
max_stories: 20  # Won't process more than 20 in one batch

# Pacing
pause_between_stories: 5  # Seconds between stories (sequential mode)

# Error handling
continue_on_failure: true  # Keep processing if one story fails

# Reconciliation (NEW v1.1.0)
reconciliation:
  enabled: true  # Auto-reconcile after each story
  require_confirmation: true  # Ask before applying changes
  update_sprint_status: true  # Sync sprint-status.yaml
```

---

## Workflow Steps

### 1. Load Sprint Status
- Parses sprint-status.yaml
- Filters stories with status="ready-for-dev"
- Excludes epics and retrospectives
- Optionally filters by epic number

### 2. Display Available Stories
- Shows all ready-for-dev stories
- Verifies story files exist
- Displays status icons and comments

### 2.5. 🆕 Validate and Create/Regenerate Stories (NEW v1.2.0)
**For each story:**
- Check file existence (multiple naming patterns)
- Validate 12 BMAD sections present
- Check content quality (Current State ≥100 words, gap analysis)
- **If missing:** Prompt to create with gap analysis
- **If invalid:** Prompt to regenerate with codebase scan
- **If valid:** Mark ready to process
- Remove skipped stories from selection

### 3. Get User Selection
- Interactive story picker
- Supports flexible selection syntax
- Validates selection and confirms

### 3.5. Choose Execution Strategy
- Sequential vs Parallel
- If parallel: choose concurrency level
- Confirm execution plan

### 4. Process Stories
**Sequential Mode:**
- For each selected story:
  - Invoke super-dev-pipeline
  - Execute reconciliation (Step 4.5)
  - Report results
  - Pause between stories

**Parallel Mode (Semaphore Pattern - NEW v1.3.0):**
- Initialize worker pool with N slots (user-selected concurrency)
- Fill initial N slots with first N stories
- Poll workers continuously (non-blocking)
- As soon as worker completes → immediately refill slot with next story
- Maintain constant N concurrent agents until queue empty
- Execute reconciliation after each story completes
- **Commit Queue:** File-based locking prevents git lock conflicts
  - Workers acquire `.git/bmad-commit.lock` before committing
  - Automatic retry with exponential backoff (1s → 30s)
  - Stale lock cleanup (>5 min)
  - Serialized commits, parallel implementation
- No idle time waiting for batch synchronization
- **20-40% faster** than old batch-and-wait pattern

### 4.5. Smart Story Reconciliation (NEW)
**Executed after each story completes:**
- Load Dev Agent Record
- Analyze ACs/Tasks/DoD vs implementation
- Calculate completion percentages
- Determine correct story status
- Update checkboxes and status
- Sync sprint-status.yaml

See: `step-4.5-reconcile-story-status.md` for detailed algorithm

### 5. Display Batch Summary
- Shows completion statistics
- Lists failed stories (if any)
- Lists reconciliation warnings (if any)
- Provides next steps
- Saves batch log

---

## Output Files

### Batch Log

**Location:** `docs/sprint-artifacts/batch-super-dev-{date}.log`

**Contains:**
- Start/end timestamps
- Selected stories
- Completed stories
- Failed stories
- Reconciliation warnings
- Success rate
- Total duration

### Reconciliation Results (per story)

**Embedded in Dev Agent Record:**
- Reconciliation summary
- Changes applied
- Final completion percentages
- Status determination reasoning

---

## Error Handling

### Story Implementation Fails
- Increments failed counter
- Adds to failed_stories list
- If `continue_on_failure=true`, continues with remaining stories
- If `continue_on_failure=false`, stops batch

### Reconciliation Fails
- Story still marked as completed (implementation succeeded)
- Adds to reconciliation_warnings list
- User warned to manually verify story accuracy
- Does NOT fail the batch

### Task Agent Fails (Parallel Mode)
- Collects error from TaskOutput
- Marks story as failed
- Continues with remaining stories in batch

---

## Best Practices

### Story Selection
- ✅ Start small: Process 2-3 stories first to verify workflow
- ✅ Group by epic: Related stories often share context
- ✅ Check file status: ✅ stories are ready, ❌ need creation first
- ❌ Don't process 20 stories at once on first run

### Execution Mode
- Sequential for ≤5 stories (easier monitoring)
- Parallel for >5 stories (faster completion)
- Use parallelism=2 first, then increase if stable

### During Execution
- Monitor progress output
- Check reconciliation reports
- Verify changes look correct
- Spot-check 1-2 completed stories

### After Completion
1. Review batch summary
2. Check reconciliation warnings
3. Verify sprint-status.yaml updated
4. Run tests: `pnpm test`
5. Check coverage: `pnpm test --coverage`
6. Review commits: `git log -<count>`
7. Spot-check 2-3 stories for quality

---

## Troubleshooting

### Reconciliation Reports Many Warnings

**Cause:** Dev Agent Record may be incomplete or stories weren't fully implemented

**Fix:**
1. Review listed stories manually
2. Check Dev Agent Record has all required sections
3. Re-run super-dev-pipeline for problematic stories
4. Manually reconcile checkboxes if needed

### Parallel Mode Hangs

**Cause:** Too many agents running concurrently, system resources exhausted

**Fix:**
1. Kill hung agents: `/tasks` then `kill <task-id>`
2. Reduce parallelism: Use 2 instead of 4
3. Process remaining stories sequentially

### Story Marked "done" but has Unchecked Items

**Cause:** Reconciliation may have missed some checkboxes

**Fix:**
1. Review Dev Agent Record
2. Check which checkboxes should be checked
3. Manually check them or re-run reconciliation:
   - Load story file
   - Compare ACs/Tasks/DoD to Dev Agent Record
   - Update checkboxes to match reality

---

## Version History

### v1.3.0 (2026-01-07)
- **NEW:** Complexity-Based Routing (Step 2.6)
  - Automatic story complexity scoring (micro/standard/complex)
  - Risk keyword detection with configurable weights
  - Smart pipeline selection: micro → lightweight, complex → enhanced
  - 50-70% token savings for micro stories
  - Deterministic classification with mutually exclusive thresholds
  - **CRITICAL:** Rejects stories with <3 tasks as INVALID (prevents 0-task stories from being processed)
- **NEW:** Semaphore Pattern for Parallel Execution
  - Worker pool maintains constant N concurrent agents
  - As soon as worker completes → immediately start next story
  - No idle time waiting for batch synchronization
  - 20-40% faster than old batch-and-wait pattern
  - Non-blocking task polling with live progress dashboard
- **NEW:** Git Commit Queue (Parallel-Safe)
  - File-based locking prevents concurrent commit conflicts
  - Workers acquire `.git/bmad-commit.lock` before committing
  - Automatic retry with exponential backoff (1s → 30s max)
  - Stale lock cleanup (>5 min old locks auto-removed)
  - Eliminates "Another git process is running" errors
  - Serializes commits while keeping implementations parallel
- **NEW:** Continuous Sprint-Status Tracking
  - sprint-status.yaml updated after EVERY task completion
  - Real-time progress: "# 7/10 tasks (70%)"
  - CRITICAL enforcement with HALT on update failure
  - Immediate visibility into story progress
- **NEW:** Stricter Story Validation
  - Step 2.5 now rejects stories with <3 tasks
  - Step 2.6 marks stories with <3 tasks as INVALID
  - Prevents incomplete/stub stories from being processed
  - Requires /validate-create-story to fix before processing

### v1.2.0 (2026-01-06)
- **NEW:** Smart Story Validation & Auto-Creation (Step 2.5)
  - Validates story files before processing
  - Auto-creates missing stories with gap analysis
  - Auto-regenerates invalid/incomplete stories
  - Checks 12 BMAD sections, content quality
  - Interactive or fully automated modes
  - Backups before regeneration
- **Removes friction:** No more "story file missing" interruptions
- **Ensures quality:** Only valid stories with gap analysis proceed
- **Configuration:** New `validation` settings in workflow.yaml

### v1.1.0 (2026-01-06)
- **NEW:** Smart Story Reconciliation (Step 4.5)
  - Auto-verifies story accuracy after implementation
  - Updates checkboxes based on Dev Agent Record
  - Synchronizes sprint-status.yaml
  - Prevents "done" stories with unchecked items
- Added reconciliation warnings to batch summary
- Added reconciliation statistics to output

### v1.0.0 (2026-01-05)
- Initial release
- Interactive story selector
- Sequential and parallel execution modes
- Integration with super-dev-pipeline
- Batch summary and logging

---

## Related Workflows

- **super-dev-pipeline:** Individual story implementation (invoked by batch-super-dev)
- **create-story-with-gap-analysis:** Create new stories with codebase scan
- **sprint-status:** View/update sprint status
- **multi-agent-review:** Standalone code review (part of super-dev-pipeline)

---

## Support

**Questions or Issues:**
- Check workflow logs: `docs/sprint-artifacts/batch-super-dev-*.log`
- Review reconciliation step: `step-4.5-reconcile-story-status.md`
- Check story file format: Ensure 12-section BMAD format
- Verify Dev Agent Record populated: Required for reconciliation

---

**Last Updated:** 2026-01-07
**Status:** Active - Production-ready with semaphore pattern and continuous tracking
**Maintained By:** BMad
