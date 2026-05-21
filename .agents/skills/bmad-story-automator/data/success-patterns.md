# Success Patterns

**Purpose:** Patterns for detecting when each workflow step has completed successfully.

---

## create-story

**Success indicators:**
- Story file created at expected path
- Story file contains required sections (title, acceptance criteria, etc.)
- Session output contains "Story created" or similar confirmation

**Failure indicators:**
- Error messages in session output
- Story file not found after session completes
- Session exits with non-zero code

---

## dev-story

**Success indicators:**
- Code changes committed or staged
- Tests pass (if applicable)
- Session output contains "Implementation complete" or similar
- No unresolved errors in session output

**Failure indicators:**
- Test failures
- Unresolved compilation/lint errors
- Session output contains error messages
- Session times out or crashes

---

## automate (guardrail tests)

**Success indicators:**
- Test files created
- Tests pass when run
- Session output confirms test generation complete

**Failure indicators:**
- Test generation errors
- Generated tests fail immediately
- Session output contains errors

---

## code-review

**Success indicators (clean):**
- "No issues found" or "LGTM" in session output
- Zero blocking issues reported
- Only informational/optional suggestions remain

**Success indicators (issues found):**
- Clear list of issues with file:line references
- Issues categorized by severity
- Actionable fix suggestions provided

**Failure indicators:**
- Unable to complete review
- Session crashes or times out
- Ambiguous output that can't be parsed

---

## git-commit

**Success indicators:**
- Commit created successfully
- Commit message follows convention
- No uncommitted changes remain (for story scope)

**Failure indicators:**
- Git errors (merge conflicts, etc.)
- Commit hook failures
- Unable to stage changes

---

## retrospective

**Success indicators:**
- Retrospective session completes
- Summary document generated
- Learnings captured

**Failure indicators:**
- Session incomplete
- Unable to generate summary
