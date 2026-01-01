---
description: "Analyze and fix code quality issues - file sizes, function lengths, complexity"
argument-hint: "[--check] [--fix] [--dry-run] [--focus=file-size|function-length|complexity] [--path=apps/api|apps/web] [--max-parallel=N] [--no-chain]"
allowed-tools: ["Task", "Bash", "Grep", "Read", "Glob", "TodoWrite", "SlashCommand", "AskUserQuestion"]
---

# Code Quality Orchestrator

Analyze and fix code quality violations for: "$ARGUMENTS"

## CRITICAL: ORCHESTRATION ONLY

**MANDATORY**: This command NEVER fixes code directly.
- Use Bash/Grep/Read for READ-ONLY analysis
- Delegate ALL fixes to specialist agents
- Guard: "Am I about to edit a file? STOP and delegate."

---

## STEP 1: Parse Arguments

Parse flags from "$ARGUMENTS":
- `--check`: Analysis only, no fixes (DEFAULT if no flags provided)
- `--fix`: Analyze and delegate fixes to agents with TEST-SAFE workflow
- `--dry-run`: Show refactoring plan without executing changes
- `--focus=file-size|function-length|complexity`: Filter to specific issue type
- `--path=apps/api|apps/web`: Limit scope to specific directory
- `--max-parallel=N`: Maximum parallel agents (default: 6, max: 6)
- `--no-chain`: Disable automatic chain invocation after fixes

If no arguments provided, default to `--check` (analysis only).

---

## STEP 2: Run Quality Analysis

Execute quality check scripts (portable centralized tools with backward compatibility):

```bash
# File size checker - try centralized first, then project-local
if [ -f ~/.claude/scripts/quality/check_file_sizes.py ]; then
    echo "Running file size check (centralized)..."
    python3 ~/.claude/scripts/quality/check_file_sizes.py --project "$PWD" 2>&1 || true
elif [ -f scripts/check_file_sizes.py ]; then
    echo "⚠️  Using project-local scripts (consider migrating to ~/.claude/scripts/quality/)"
    python3 scripts/check_file_sizes.py 2>&1 || true
elif [ -f scripts/check-file-size.py ]; then
    echo "⚠️  Using project-local scripts (consider migrating to ~/.claude/scripts/quality/)"
    python3 scripts/check-file-size.py 2>&1 || true
else
    echo "✗ File size checker not available"
    echo "  Install: Copy quality tools to ~/.claude/scripts/quality/"
fi
```

```bash
# Function length checker - try centralized first, then project-local
if [ -f ~/.claude/scripts/quality/check_function_lengths.py ]; then
    echo "Running function length check (centralized)..."
    python3 ~/.claude/scripts/quality/check_function_lengths.py --project "$PWD" 2>&1 || true
elif [ -f scripts/check_function_lengths.py ]; then
    echo "⚠️  Using project-local scripts (consider migrating to ~/.claude/scripts/quality/)"
    python3 scripts/check_function_lengths.py 2>&1 || true
elif [ -f scripts/check-function-length.py ]; then
    echo "⚠️  Using project-local scripts (consider migrating to ~/.claude/scripts/quality/)"
    python3 scripts/check-function-length.py 2>&1 || true
else
    echo "✗ Function length checker not available"
    echo "  Install: Copy quality tools to ~/.claude/scripts/quality/"
fi
```

Capture violations into categories:
- **FILE_SIZE_VIOLATIONS**: Files >500 LOC (production) or >800 LOC (tests)
- **FUNCTION_LENGTH_VIOLATIONS**: Functions >100 lines
- **COMPLEXITY_VIOLATIONS**: Functions with cyclomatic complexity >12

---

## STEP 3: Generate Quality Report

Create structured report in this format:

```
## Code Quality Report

### File Size Violations (X files)
| File | LOC | Limit | Status |
|------|-----|-------|--------|
| path/to/file.py | 612 | 500 | BLOCKING |
...

### Function Length Violations (X functions)
| File:Line | Function | Lines | Status |
|-----------|----------|-------|--------|
| path/to/file.py:125 | _process_job() | 125 | BLOCKING |
...

### Test File Warnings (X files)
| File | LOC | Limit | Status |
|------|-----|-------|--------|
| path/to/test.py | 850 | 800 | WARNING |
...

### Summary
- Total violations: X
- Critical (blocking): Y
- Warnings (non-blocking): Z
```

---

## STEP 4: Smart Parallel Refactoring (if --fix or --dry-run flag provided)

### For --dry-run: Show plan without executing

If `--dry-run` flag provided, show the dependency analysis and execution plan:

```
## Dry Run: Refactoring Plan

### PHASE 2: Dependency Analysis
Analyzing imports for 8 violation files...
Building dependency graph...
Mapping test file relationships...

### Identified Clusters

Cluster A (SERIAL - shared tests/test_user.py):
  - user_service.py (612 LOC)
  - user_utils.py (534 LOC)

Cluster B (PARALLEL - independent):
  - auth_handler.py (543 LOC)
  - payment_service.py (489 LOC)
  - notification.py (501 LOC)

### Proposed Schedule
  Batch 1: Cluster B (3 agents in parallel)
  Batch 2: Cluster A (2 agents serial)

### Estimated Time
  - Parallel batch (3 files): ~4 min
  - Serial batch (2 files): ~10 min
  - Total: ~14 min
```

Exit after showing plan (no changes made).

### For --fix: Execute with Dependency-Aware Smart Batching

#### PHASE 0: Warm-Up (Check Dependency Cache)

```bash
# Check if dependency cache exists and is fresh (< 15 min)
CACHE_FILE=".claude/cache/dependency-graph.json"
CACHE_AGE=900  # 15 minutes

if [ -f "$CACHE_FILE" ]; then
    MODIFIED=$(stat -f %m "$CACHE_FILE" 2>/dev/null || stat -c %Y "$CACHE_FILE" 2>/dev/null)
    NOW=$(date +%s)
    if [ $((NOW - MODIFIED)) -lt $CACHE_AGE ]; then
        echo "Using cached dependency graph (age: $((NOW - MODIFIED))s)"
    else
        echo "Cache stale, will rebuild"
    fi
else
    echo "No cache found, will build dependency graph"
fi
```

#### PHASE 1: Dependency Graph Construction

Before ANY refactoring agents are spawned:

```bash
echo "=== PHASE 2: Dependency Analysis ==="
echo "Analyzing imports for violation files..."

# For each violating file, find its test dependencies
for FILE in $VIOLATION_FILES; do
    MODULE_NAME=$(basename "$FILE" .py)

    # Find test files that import this module
    TEST_FILES=$(grep -rl "$MODULE_NAME" tests/ --include="test_*.py" 2>/dev/null | sort -u)

    echo "  $FILE -> tests: [$TEST_FILES]"
done

echo ""
echo "Building dependency graph..."
echo "Mapping test file relationships..."
```

#### PHASE 2: Cluster Identification

Group files by shared test files (CRITICAL for safe parallelization):

```bash
# Files sharing test files MUST be serialized
# Files with independent tests CAN be parallelized

# Example output:
echo "
Cluster A (SERIAL - shared tests/test_user.py):
  - user_service.py (612 LOC)
  - user_utils.py (534 LOC)

Cluster B (PARALLEL - independent):
  - auth_handler.py (543 LOC)
  - payment_service.py (489 LOC)
  - notification.py (501 LOC)

Cluster C (SERIAL - shared tests/test_api.py):
  - api_router.py (567 LOC)
  - api_middleware.py (512 LOC)
"
```

#### PHASE 3: Calculate Cluster Priority

Score each cluster for execution order (higher = execute first):

```bash
# +10 points per file with >600 LOC (worst violations)
# +5 points if cluster contains frequently-modified files
# +3 points if cluster is on critical path (imported by many)
# -5 points if cluster only affects test files
```

Sort clusters by priority score (highest first = fail fast on critical code).

#### PHASE 4: Execute Batched Refactoring

For each cluster, respecting parallelization rules:

**Parallel clusters (no shared tests):**
Launch up to `--max-parallel` (default 6) agents simultaneously:

```
Task(
    subagent_type="safe-refactor",
    description="Safe refactor: auth_handler.py",
    prompt="Refactor this file using TEST-SAFE workflow:
    File: auth_handler.py
    Current LOC: 543

    CLUSTER CONTEXT (NEW):
    - cluster_id: cluster_b
    - parallel_peers: [payment_service.py, notification.py]
    - test_scope: tests/test_auth.py
    - execution_mode: parallel

    MANDATORY WORKFLOW:
    1. PHASE 0: Run existing tests, establish GREEN baseline
    2. PHASE 1: Create facade structure (tests must stay green)
    3. PHASE 2: Migrate code incrementally (test after each change)
    4. PHASE 3: Update test imports only if necessary
    5. PHASE 4: Cleanup legacy, final test verification

    CRITICAL RULES:
    - If tests fail at ANY phase, REVERT with git stash pop
    - Use facade pattern to preserve public API
    - Never proceed with broken tests
    - DO NOT modify files outside your scope

    MANDATORY OUTPUT FORMAT - Return ONLY JSON:
    {
      \"status\": \"fixed|partial|failed\",
      \"cluster_id\": \"cluster_b\",
      \"files_modified\": [\"...\"],
      \"test_files_touched\": [\"...\"],
      \"issues_fixed\": N,
      \"remaining_issues\": N,
      \"conflicts_detected\": [],
      \"summary\": \"...\"
    }
    DO NOT include full file contents."
)
```

**Serial clusters (shared tests):**
Execute ONE agent at a time, wait for completion:

```
# File 1/2: user_service.py
Task(safe-refactor, ...) → wait for completion

# Check result
if result.status == "failed":
    → Invoke FAILURE HANDLER (see below)

# File 2/2: user_utils.py
Task(safe-refactor, ...) → wait for completion
```

#### PHASE 5: Failure Handling (Interactive)

When a refactoring agent fails, use AskUserQuestion to prompt:

```
AskUserQuestion(
  questions=[{
    "question": "Refactoring of {file} failed: {error}. {N} files remain. What would you like to do?",
    "header": "Failure",
    "options": [
      {"label": "Continue with remaining files", "description": "Skip {file} and proceed with remaining {N} files"},
      {"label": "Abort refactoring", "description": "Stop now, preserve current state"},
      {"label": "Retry this file", "description": "Attempt to refactor {file} again"}
    ],
    "multiSelect": false
  }]
)
```

**On "Continue"**: Add file to skipped list, continue with next
**On "Abort"**: Clean up locks, report final status, exit
**On "Retry"**: Re-attempt (max 2 retries per file)

#### PHASE 6: Early Termination Check (After Each Batch)

After completing high-priority clusters, check if user wants to terminate early:

```bash
# Calculate completed vs remaining priority
COMPLETED_PRIORITY=$(sum of completed cluster priorities)
REMAINING_PRIORITY=$(sum of remaining cluster priorities)
TOTAL_PRIORITY=$((COMPLETED_PRIORITY + REMAINING_PRIORITY))

# If 80%+ of priority work complete, offer early exit
if [ $((COMPLETED_PRIORITY * 100 / TOTAL_PRIORITY)) -ge 80 ]; then
    # Prompt user
    AskUserQuestion(
      questions=[{
        "question": "80%+ of high-priority violations fixed. Complete remaining low-priority work?",
        "header": "Progress",
        "options": [
          {"label": "Complete all remaining", "description": "Fix remaining {N} files (est. {time})"},
          {"label": "Terminate early", "description": "Stop now, save ~{time}. Remaining files can be fixed later."}
        ],
        "multiSelect": false
      }]
    )
fi
```

---

## STEP 5: Parallel-Safe Operations (Linting, Type Errors)

These operations are ALWAYS safe to parallelize (no shared state):

**For linting issues -> delegate to existing `linting-fixer`:**
```
Task(
    subagent_type="linting-fixer",
    description="Fix linting errors",
    prompt="Fix all linting errors found by ruff check and eslint."
)
```

**For type errors -> delegate to existing `type-error-fixer`:**
```
Task(
    subagent_type="type-error-fixer",
    description="Fix type errors",
    prompt="Fix all type errors found by mypy and tsc."
)
```

These can run IN PARALLEL with each other and with safe-refactor agents (different file domains).

---

## STEP 6: Verify Results (after --fix)

After agents complete, re-run analysis to verify fixes:

```bash
# Re-run file size check
if [ -f ~/.claude/scripts/quality/check_file_sizes.py ]; then
    python3 ~/.claude/scripts/quality/check_file_sizes.py --project "$PWD"
elif [ -f scripts/check_file_sizes.py ]; then
    python3 scripts/check_file_sizes.py
elif [ -f scripts/check-file-size.py ]; then
    python3 scripts/check-file-size.py
fi
```

```bash
# Re-run function length check
if [ -f ~/.claude/scripts/quality/check_function_lengths.py ]; then
    python3 ~/.claude/scripts/quality/check_function_lengths.py --project "$PWD"
elif [ -f scripts/check_function_lengths.py ]; then
    python3 scripts/check_function_lengths.py
elif [ -f scripts/check-function-length.py ]; then
    python3 scripts/check-function-length.py
fi
```

---

## STEP 7: Report Summary

Output final status:

```
## Code Quality Summary

### Execution Mode
- Dependency-aware smart batching: YES
- Clusters identified: 3
- Parallel batches: 1
- Serial batches: 2

### Before
- File size violations: X
- Function length violations: Y
- Test file warnings: Z

### After (if --fix was used)
- File size violations: A
- Function length violations: B
- Test file warnings: C

### Refactoring Results
| Cluster | Files | Mode | Status |
|---------|-------|------|--------|
| Cluster B | 3 | parallel | COMPLETE |
| Cluster A | 2 | serial | 1 skipped |
| Cluster C | 3 | serial | COMPLETE |

### Skipped Files (user decision)
- user_utils.py: TestFailed (user chose continue)

### Status
[PASS/FAIL based on blocking violations]

### Time Breakdown
- Dependency analysis: ~30s
- Parallel batch (3 files): ~4 min
- Serial batches (5 files): ~15 min
- Total: ~20 min (saved ~8 min vs fully serial)

### Suggested Next Steps
- If violations remain: Run `/code_quality --fix` to auto-fix
- If all passing: Run `/pr --fast` to commit changes
- For skipped files: Run `/test_orchestrate` to investigate test failures
```

---

## STEP 8: Chain Invocation (unless --no-chain)

If all tests passing after refactoring:

```bash
# Check if chaining disabled
if [[ "$ARGUMENTS" != *"--no-chain"* ]]; then
    # Check depth to prevent infinite loops
    DEPTH=${SLASH_DEPTH:-0}
    if [ $DEPTH -lt 3 ]; then
        export SLASH_DEPTH=$((DEPTH + 1))
        SlashCommand(command="/commit_orchestrate --message 'refactor: reduce file sizes'")
    fi
fi
```

---

## Observability & Logging

Log all orchestration decisions to `.claude/logs/orchestration-{date}.jsonl`:

```json
{"event": "cluster_scheduled", "cluster_id": "cluster_b", "files": ["auth.py", "payment.py"], "mode": "parallel", "priority": 18}
{"event": "batch_started", "batch": 1, "agents": 3, "cluster_id": "cluster_b"}
{"event": "agent_completed", "file": "auth.py", "status": "fixed", "duration_s": 240}
{"event": "failure_handler_invoked", "file": "user_utils.py", "error": "TestFailed"}
{"event": "user_decision", "action": "continue", "remaining": 3}
{"event": "early_termination_offered", "completed_priority": 45, "remaining_priority": 10}
```

---

## Examples

```
# Check only (default)
/code_quality

# Check with specific focus
/code_quality --focus=file-size

# Preview refactoring plan (no changes made)
/code_quality --dry-run

# Auto-fix all violations with smart batching (default max 6 parallel)
/code_quality --fix

# Auto-fix with lower parallelism (e.g., resource-constrained)
/code_quality --fix --max-parallel=3

# Auto-fix only Python backend
/code_quality --fix --path=apps/api

# Auto-fix without chain invocation
/code_quality --fix --no-chain

# Preview plan for specific path
/code_quality --dry-run --path=apps/web
```

---

## Conflict Detection Quick Reference

| Operation Type | Parallelizable? | Reason |
|----------------|-----------------|--------|
| Linting fixes | YES | Independent, no test runs |
| Type error fixes | YES | Independent, no test runs |
| Import fixes | PARTIAL | May conflict on same files |
| **File refactoring** | **CONDITIONAL** | Depends on shared tests |

**Safe to parallelize (different clusters, no shared tests)**
**Must serialize (same cluster, shared test files)**
