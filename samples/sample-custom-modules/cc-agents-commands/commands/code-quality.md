---
description: "Analyze and fix code quality issues - file sizes, function lengths, complexity"
argument-hint: "[--check] [--fix] [--focus=file-size|function-length|complexity] [--path=apps/api|apps/web]"
allowed-tools: ["Task", "Bash", "Grep", "Read", "Glob", "TodoWrite", "SlashCommand"]
---

# Code Quality Orchestrator

Analyze and fix code quality violations for: "$ARGUMENTS"

## CRITICAL: ORCHESTRATION ONLY

🚨 **MANDATORY**: This command NEVER fixes code directly.
- Use Bash/Grep/Read for READ-ONLY analysis
- Delegate ALL fixes to specialist agents
- Guard: "Am I about to edit a file? STOP and delegate."

## STEP 1: Parse Arguments

Parse flags from "$ARGUMENTS":
- `--check`: Analysis only, no fixes (DEFAULT if no flags provided)
- `--fix`: Analyze and delegate fixes to agents with TEST-SAFE workflow
- `--dry-run`: Show refactoring plan without executing changes
- `--focus=file-size|function-length|complexity`: Filter to specific issue type
- `--path=apps/api|apps/web`: Limit scope to specific directory

If no arguments provided, default to `--check` (analysis only).

## STEP 2: Run Quality Analysis

Execute quality check scripts from the repository root:

```bash
cd /Users/ricardocarvalho/DeveloperFolder/Memento && python3 scripts/check-file-size.py 2>&1 || true
```

```bash
cd /Users/ricardocarvalho/DeveloperFolder/Memento && python3 scripts/check-function-length.py 2>&1 || true
```

Capture violations into categories:
- **FILE_SIZE_VIOLATIONS**: Files >500 LOC (production) or >800 LOC (tests)
- **FUNCTION_LENGTH_VIOLATIONS**: Functions >100 lines
- **COMPLEXITY_VIOLATIONS**: Functions with cyclomatic complexity >12

## STEP 3: Generate Quality Report

Create structured report in this format:

```
## Code Quality Report

### File Size Violations (X files)
| File | LOC | Limit | Status |
|------|-----|-------|--------|
| path/to/file.py | 612 | 500 | ❌ BLOCKING |
...

### Function Length Violations (X functions)
| File:Line | Function | Lines | Status |
|-----------|----------|-------|--------|
| path/to/file.py:125 | _process_job() | 125 | ❌ BLOCKING |
...

### Test File Warnings (X files)
| File | LOC | Limit | Status |
|------|-----|-------|--------|
| path/to/test.py | 850 | 800 | ⚠️ WARNING |
...

### Summary
- Total violations: X
- Critical (blocking): Y
- Warnings (non-blocking): Z
```

## STEP 4: Delegate Fixes (if --fix or --dry-run flag provided)

### For --dry-run: Show plan without executing

If `--dry-run` flag provided, delegate to `safe-refactor` agent with dry-run mode:
```
Task(
    subagent_type="safe-refactor",
    description="Dry run: {filename}",
    prompt="Analyze this file and show refactoring plan WITHOUT making changes:
    File: {file_path}
    Current LOC: {loc}

    Show:
    1. Proposed directory/module structure
    2. Which functions/classes go where
    3. Test files that would be affected
    4. Estimated phases and risk assessment"
)
```

### For --fix: Execute with TEST-SAFE workflow

If `--fix` flag is provided, dispatch specialist agents IN PARALLEL (multiple Task calls in single message):

**For file size violations → delegate to `safe-refactor`:**
```
Task(
    subagent_type="safe-refactor",
    description="Safe refactor: {filename}",
    prompt="Refactor this file using TEST-SAFE workflow:
    File: {file_path}
    Current LOC: {loc}

    MANDATORY WORKFLOW:
    1. PHASE 0: Run existing tests, establish GREEN baseline
    2. PHASE 1: Create facade structure (tests must stay green)
    3. PHASE 2: Migrate code incrementally (test after each change)
    4. PHASE 3: Update test imports only if necessary
    5. PHASE 4: Cleanup legacy, final test verification

    CRITICAL RULES:
    - If tests fail at ANY phase, REVERT with git stash pop
    - Use facade pattern to preserve public API
    - Never proceed with broken tests"
)
```

**For linting issues → delegate to existing `linting-fixer`:**
```
Task(
    subagent_type="linting-fixer",
    description="Fix linting errors",
    prompt="Fix all linting errors found by ruff check and eslint."
)
```

**For type errors → delegate to existing `type-error-fixer`:**
```
Task(
    subagent_type="type-error-fixer",
    description="Fix type errors",
    prompt="Fix all type errors found by mypy and tsc."
)
```

## STEP 5: Verify Results (after --fix)

After agents complete, re-run analysis to verify fixes:

```bash
cd /Users/ricardocarvalho/DeveloperFolder/Memento && python3 scripts/check-file-size.py
```

```bash
cd /Users/ricardocarvalho/DeveloperFolder/Memento && python3 scripts/check-function-length.py
```

## STEP 6: Report Summary

Output final status:

```
## Code Quality Summary

### Before
- File size violations: X
- Function length violations: Y
- Test file warnings: Z

### After (if --fix was used)
- File size violations: A
- Function length violations: B
- Test file warnings: C

### Status
[PASS/FAIL based on blocking violations]

### Suggested Next Steps
- If violations remain: Run `/code_quality --fix` to auto-fix
- If all passing: Run `/pr --fast` to commit changes
- For manual review: See .claude/rules/file-size-guidelines.md
```

## Examples

```
# Check only (default)
/code_quality

# Check with specific focus
/code_quality --focus=file-size

# Preview refactoring plan (no changes made)
/code_quality --dry-run

# Auto-fix all violations with TEST-SAFE workflow
/code_quality --fix

# Auto-fix only Python backend
/code_quality --fix --path=apps/api

# Preview plan for specific path
/code_quality --dry-run --path=apps/web
```
