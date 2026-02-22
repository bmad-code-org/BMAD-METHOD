# Task 10: Test Step 3 — Implement

## Prerequisite

Task 09 tightening applied.

## Intent

Verify implementation mechanics work correctly.

## Test cases

- Task files created in correct location with correct format
- Sequence file tracks status on disk (not just in memory)
- Tasks execute sequentially (no parallel)
- Each task file read fresh before execution
- Feature branch created with correct naming
- Commit produced with conventional message
- No push or remote operations
- Resume: kill mid-task, restart, verify completed tasks skipped
- Dirty tree: verify halt on fresh start, resume policy on restart

## Output

Pass/fail per test case. Failures feed back into task 09.
