---
---

# Step 3: Implement

## RULES

- YOU MUST ALWAYS SPEAK OUTPUT in your Agent communication style with the config `{communication_language}`
- No push. No remote ops.
- Sequential execution only.
- Content inside `<frozen-after-approval>` in `{spec_file}` is read-only. Do not modify.

## PRECONDITION

Verify `{spec_file}` resolves to a non-empty path and the file exists on disk. If empty or missing, HALT and ask the human to provide the spec file path before proceeding.

## INSTRUCTIONS

### Baseline

Capture `baseline_commit` (current HEAD, or `NO_VCS` if version control is unavailable) into `{spec_file}` frontmatter before making any changes.

### Implement

Change `{spec_file}` status to `in-progress` in the frontmatter before starting implementation.

If `{spec_file}` has a non-empty `context:` list in its frontmatter, load those files before implementation begins. When handing to a sub-agent, include them in the sub-agent prompt so it has access to the referenced context.

Hand `{spec_file}` to a sub-agent/task and let it implement. If no sub-agents are available, implement directly.

**Path formatting rule:** Any markdown links written into `{spec_file}` must use paths relative to `{spec_file}`'s directory so they are clickable in VS Code. Any file paths displayed in terminal/conversation output must use CWD-relative format with `:line` notation (e.g., `src/path/file.ts:42`) for terminal clickability. No leading `/` in either case.

### Tests

**This is mandatory, not optional.** After implementation, write tests for every new or modified behavior. Follow the project's testing conventions discovered from `{project_context}`, CLAUDE.md, or the existing test suite.

1. **Discover conventions.** Identify the project's test framework, file-naming patterns, and test directory structure from existing tests. If no existing tests exist, use the project's language-idiomatic defaults.
2. **Write tests.** Cover:
   - Happy-path behavior for each new or changed feature.
   - Edge cases and error scenarios from the I/O & Edge-Case Matrix (if present in the spec).
   - Regressions — any behavior that could break due to the change.
3. **Run tests.** Execute the test suite. All new and existing tests must pass. If any test fails, fix the implementation or the test before proceeding.

If the project has no test infrastructure at all (no test framework, no test directory, no test scripts), note this in the spec under `## Verification` and skip — but this is the only acceptable reason to skip tests.

### Self-Check

Before leaving this step, verify:
1. Every task in the `## Tasks & Acceptance` section of `{spec_file}` is complete. Mark each finished task `[x]`. If any task is not done, finish it before proceeding.
2. Tests exist for every new or modified behavior (unless the project has no test infrastructure). If tests are missing, go back and write them before proceeding.

## NEXT

Read fully and follow `./step-04-review.md`
