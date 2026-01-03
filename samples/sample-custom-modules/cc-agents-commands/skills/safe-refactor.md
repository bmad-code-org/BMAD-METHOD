---
description: "Test-safe file refactoring with facade pattern and incremental migration. Use when splitting large files to prevent test breakage."
argument-hint: "[--dry-run] <file_path>"
---

# Safe Refactor Skill

Refactor file: "$ARGUMENTS"

## Parse Arguments

Extract from "$ARGUMENTS":
- `--dry-run`: Show plan without executing (optional)
- `<file_path>`: Target file to refactor (required)

## Execution

Delegate to the safe-refactor agent:

```
Task(
    subagent_type="safe-refactor",
    description="Safe refactor: {file_path}",
    prompt="Refactor this file using test-safe workflow:

    File: {file_path}
    Mode: {--dry-run OR full execution}

    Follow the MANDATORY WORKFLOW:
    - PHASE 0: Establish test baseline (must be GREEN)
    - PHASE 1: Create facade structure (preserve imports)
    - PHASE 2: Incremental migration with test gates
    - PHASE 3: Update test imports if needed
    - PHASE 4: Cleanup legacy

    Use git stash checkpoints. Revert immediately if tests fail.

    If --dry-run: Analyze file, identify split points, show proposed
    structure WITHOUT making changes."
)
```

## Dry Run Output

If `--dry-run` specified, output:

```markdown
## Safe Refactor Plan (Dry Run)

### Target File
- Path: {file_path}
- Size: {loc} LOC
- Language: {detected_language}

### Proposed Structure
```
{new_directory}/
├── __init__.py     # Facade (~{N} LOC)
├── service.py      # Main logic (~{N} LOC)
├── repository.py   # Data access (~{N} LOC)
└── utils.py        # Utilities (~{N} LOC)
```

### Migration Plan
1. Create facade with re-exports
2. Extract: {list of functions/classes per module}
3. Update imports in {N} test files

### Risk Assessment
- Test files affected: {count}
- External imports: {count} (will remain unchanged)
- Estimated phases: {count}

### To Execute
Run: `/safe-refactor {file_path}` (without --dry-run)
```
