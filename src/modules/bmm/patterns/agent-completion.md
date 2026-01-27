# Agent Completion Format

<overview>
All agents must return structured output that the orchestrator can parse. This enables automated verification and reliable workflow progression.

**Principle:** Return parseable data, not prose. The orchestrator needs to extract file lists, status, and evidence.
</overview>

<format>
## Standard Completion Format

Every agent returns this structure when done:

```markdown
## AGENT COMPLETE

**Agent:** [builder|inspector|reviewer|fixer]
**Story:** {{story_key}}
**Status:** [SUCCESS|PASS|FAIL|ISSUES_FOUND|PARTIAL]

### [Agent-Specific Section]
[See below for each agent type]

### Files Created
- path/to/new/file.ts
- path/to/another.ts

### Files Modified
- path/to/existing/file.ts

### Ready For
[Next phase or action required]
```
</format>

<builder_format>
## Builder Agent Output

```markdown
## AGENT COMPLETE

**Agent:** builder
**Story:** {{story_key}}
**Status:** SUCCESS | FAILED

### Files Created
- src/lib/feature/service.ts
- src/lib/feature/__tests__/service.test.ts

### Files Modified
- src/app/api/feature/route.ts

### Tests Added
- 3 test files
- 12 test cases total

### Implementation Summary
Brief description of what was built.

### Known Gaps
- Edge case X not handled
- NONE if all complete

### Ready For
Inspector validation
```
</builder_format>

<inspector_format>
## Inspector Agent Output

```markdown
## AGENT COMPLETE

**Agent:** inspector
**Story:** {{story_key}}
**Status:** PASS | FAIL

### Evidence
- **Type Check:** PASS (0 errors)
- **Lint:** PASS (0 warnings)
- **Build:** PASS
- **Tests:** 45 passing, 0 failing, 92% coverage

### Files Verified
- src/lib/feature/service.ts ✓
- src/app/api/feature/route.ts ✓

### Failures (if FAIL status)
1. Type error in service.ts:45
2. Test failing: "should handle empty input"

### Ready For
Reviewer (if PASS) | Builder fix (if FAIL)
```
</inspector_format>

<reviewer_format>
## Reviewer Agent Output

```markdown
## AGENT COMPLETE

**Agent:** reviewer
**Story:** {{story_key}}
**Status:** ISSUES_FOUND | CLEAN

### Issue Summary
- **CRITICAL:** 1 (security, data loss)
- **HIGH:** 2 (production bugs)
- **MEDIUM:** 3 (tech debt)
- **LOW:** 1 (nice-to-have)

### Must Fix (CRITICAL + HIGH)
1. [CRITICAL] service.ts:45 - SQL injection vulnerability
2. [HIGH] route.ts:23 - Missing authorization check
3. [HIGH] service.ts:78 - Unhandled null case

### Should Fix (MEDIUM)
1. service.ts:92 - No error logging

### Files Reviewed
- src/lib/feature/service.ts ✓
- src/app/api/feature/route.ts ✓

### Ready For
Fixer agent to address CRITICAL and HIGH issues
```
</reviewer_format>

<fixer_format>
## Fixer Agent Output

```markdown
## AGENT COMPLETE

**Agent:** fixer
**Story:** {{story_key}}
**Status:** SUCCESS | PARTIAL | FAILED

### Issues Fixed
- **CRITICAL:** 1/1 fixed
- **HIGH:** 2/2 fixed
- **Total:** 3 issues resolved

### Fixes Applied
1. [CRITICAL] service.ts:45 - Parameterized query
2. [HIGH] route.ts:23 - Added auth check
3. [HIGH] service.ts:78 - Added null guard

### Quality Checks
- **Type Check:** PASS
- **Lint:** PASS
- **Tests:** 47 passing (2 new)

### Git Commit
- **Hash:** abc123def
- **Message:** fix({{story_key}}): address security and null handling

### Deferred Issues
- MEDIUM: 3 (defer to follow-up)
- LOW: 1 (skip as gold-plating)

### Ready For
Orchestrator reconciliation
```
</fixer_format>

<parsing_hints>
## Parsing Hints for Orchestrator

Extract key data using grep:

```bash
# Get status
grep "^\*\*Status:\*\*" agent_output.txt | cut -d: -f2 | xargs

# Get files created
sed -n '/### Files Created/,/###/p' agent_output.txt | grep "^-" | cut -d' ' -f2

# Get issue count
grep "CRITICAL:" agent_output.txt | grep -oE "[0-9]+"

# Check if ready for next phase
grep "### Ready For" -A 1 agent_output.txt | tail -1
```
</parsing_hints>
