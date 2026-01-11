---
description: "Orchestrate test failure analysis and coordinate parallel specialist test fixers with strategic analysis mode"
argument-hint: "[test_scope] [--run-first] [--coverage] [--fast] [--strategic] [--research] [--force-escalate] [--no-chain] [--api-only] [--database-only] [--vitest-only] [--pytest-only] [--playwright-only] [--only-category=<unit|integration|e2e|acceptance>]"
allowed-tools: ["Task", "TodoWrite", "Bash", "Grep", "Read", "LS", "Glob", "SlashCommand"]
---

# Test Orchestration Command (v2.0)

Execute this test orchestration procedure for: "$ARGUMENTS"

---

## ORCHESTRATOR GUARD RAILS

### PROHIBITED (NEVER do directly):
- Direct edits to test files
- Direct edits to source files
- pytest --fix or similar
- git add / git commit
- pip install / uv add
- Modifying test configuration

### ALLOWED (delegation only):
- Task(subagent_type="unit-test-fixer", ...)
- Task(subagent_type="api-test-fixer", ...)
- Task(subagent_type="database-test-fixer", ...)
- Task(subagent_type="e2e-test-fixer", ...)
- Task(subagent_type="type-error-fixer", ...)
- Task(subagent_type="import-error-fixer", ...)
- Read-only bash commands for analysis
- Grep/Glob/Read for investigation

**WHY:** Ensures expert handling by specialists, prevents conflicts, maintains audit trail.

---

## STEP 0: MODE DETECTION + AUTO-ESCALATION + DEPTH PROTECTION

### 0a. Depth Protection (prevent infinite loops)

```bash
echo "SLASH_DEPTH=${SLASH_DEPTH:-0}"
```

If SLASH_DEPTH >= 3:
- Report: "Maximum orchestration depth (3) reached. Exiting to prevent loop."
- EXIT immediately

Otherwise, set for any chained commands:
```bash
export SLASH_DEPTH=$((${SLASH_DEPTH:-0} + 1))
```

### 0b. Parse Strategic Flags

Check "$ARGUMENTS" for strategic triggers:
- `--strategic` = Force strategic mode
- `--research` = Research best practices only (no fixes)
- `--force-escalate` = Force strategic mode regardless of history

If ANY strategic flag present → Set STRATEGIC_MODE=true

### 0c. Auto-Escalation Detection

Check git history for recurring test fix attempts:
```bash
TEST_FIX_COUNT=$(git log --oneline -20 | grep -iE "fix.*(test|spec|jest|pytest|vitest)" | wc -l | tr -d ' ')
echo "TEST_FIX_COUNT=$TEST_FIX_COUNT"
```

If TEST_FIX_COUNT >= 3:
- Report: "Detected $TEST_FIX_COUNT test fix attempts in recent history. Auto-escalating to strategic mode."
- Set STRATEGIC_MODE=true

### 0d. Mode Decision

| Condition | Mode |
|-----------|------|
| --strategic OR --research OR --force-escalate | STRATEGIC |
| TEST_FIX_COUNT >= 3 | STRATEGIC (auto-escalated) |
| Otherwise | TACTICAL (default) |

Report the mode: "Operating in [TACTICAL/STRATEGIC] mode."

---

## STEP 1: Parse Arguments

Check "$ARGUMENTS" for these flags:
- `--run-first` = Ignore cached results, run fresh tests
- `--pytest-only` = Focus on pytest (backend) only
- `--vitest-only` = Focus on Vitest (frontend) only
- `--playwright-only` = Focus on Playwright (E2E) only
- `--coverage` = Include coverage analysis
- `--fast` = Skip slow tests
- `--no-chain` = Disable chain invocation after fixes
- `--only-category=<category>` = Target specific test category for faster iteration

**Parse --only-category for targeted test execution:**
```bash
# Parse --only-category for finer control
if [[ "$ARGUMENTS" =~ "--only-category="([a-zA-Z]+) ]]; then
    TARGET_CATEGORY="${BASH_REMATCH[1]}"
    echo "🎯 Targeting only '$TARGET_CATEGORY' tests"
    # Used in STEP 4 to filter pytest: -k $TARGET_CATEGORY
fi
```

Valid categories: `unit`, `integration`, `e2e`, `acceptance`, `api`, `database`

---

## STEP 2: Discover Cached Test Results

Run these commands ONE AT A TIME:

**2a. Project info:**
```bash
echo "Project: $(basename $PWD) | Branch: $(git branch --show-current) | Root: $PWD"
```

**2b. Check if pytest results exist:**
```bash
test -f "test-results/pytest/junit.xml" && echo "PYTEST_EXISTS=yes" || echo "PYTEST_EXISTS=no"
```

**2c. If pytest results exist, get stats:**
```bash
echo "PYTEST_AGE=$(($(date +%s) - $(stat -f %m test-results/pytest/junit.xml 2>/dev/null || stat -c %Y test-results/pytest/junit.xml 2>/dev/null)))s"
```
```bash
echo "PYTEST_TESTS=$(grep -o 'tests="[0-9]*"' test-results/pytest/junit.xml | head -1 | grep -o '[0-9]*')"
```
```bash
echo "PYTEST_FAILURES=$(grep -o 'failures="[0-9]*"' test-results/pytest/junit.xml | head -1 | grep -o '[0-9]*')"
```

**2d. Check Vitest results:**
```bash
test -f "test-results/vitest/results.json" && echo "VITEST_EXISTS=yes" || echo "VITEST_EXISTS=no"
```

**2e. Check Playwright results:**
```bash
test -f "test-results/playwright/results.json" && echo "PLAYWRIGHT_EXISTS=yes" || echo "PLAYWRIGHT_EXISTS=no"
```

---

## STEP 2.5: Test Framework Intelligence

Detect test framework configuration:

**2.5a. Pytest configuration:**
```bash
grep -A 20 "\[tool.pytest" pyproject.toml 2>/dev/null | head -25 || echo "No pytest config in pyproject.toml"
```

**2.5b. Available pytest markers:**
```bash
grep -rh "pytest.mark\." tests/ 2>/dev/null | sed 's/.*@pytest.mark.\([a-zA-Z_]*\).*/\1/' | sort -u | head -10
```

**2.5c. Check for slow tests:**
```bash
grep -l "@pytest.mark.slow" tests/**/*.py 2>/dev/null | wc -l | xargs echo "Slow tests:"
```

Save detected markers and configuration for agent context.

---

## STEP 2.6: Discover Project Context (SHARED CACHE - Token Efficient)

**Token Savings**: Using shared discovery cache saves ~14K tokens (2K per agent x 7 agents).

```bash
# 📊 SHARED DISCOVERY - Use cached context, refresh if stale (>15 min)
echo "=== Loading Shared Project Context ==="

# Source shared discovery helper (creates/uses cache)
if [[ -f "$HOME/.claude/scripts/shared-discovery.sh" ]]; then
    source "$HOME/.claude/scripts/shared-discovery.sh"
    discover_project_context

    # SHARED_CONTEXT now contains pre-built context for agents
    # Variables available: PROJECT_TYPE, VALIDATION_CMD, TEST_FRAMEWORK, RULES_SUMMARY
else
    # Fallback: inline discovery (less efficient)
    echo "⚠️ Shared discovery not found, using inline discovery"

    PROJECT_CONTEXT=""
    [ -f "CLAUDE.md" ] && PROJECT_CONTEXT="Read CLAUDE.md for project conventions. "
    [ -d ".claude/rules" ] && PROJECT_CONTEXT+="Check .claude/rules/ for patterns. "

    PROJECT_TYPE=""
    [ -f "pyproject.toml" ] && PROJECT_TYPE="python"
    [ -f "package.json" ] && PROJECT_TYPE="${PROJECT_TYPE:+$PROJECT_TYPE+}node"

    SHARED_CONTEXT="$PROJECT_CONTEXT"
fi

# Display cached context summary
echo "PROJECT_TYPE=$PROJECT_TYPE"
echo "VALIDATION_CMD=${VALIDATION_CMD:-pnpm prepush}"
echo "TEST_FRAMEWORK=${TEST_FRAMEWORK:-pytest}"
```

**CRITICAL**: Pass `$SHARED_CONTEXT` to ALL agent prompts instead of asking each agent to discover.
This prevents 7 agents from each running discovery independently.

---

## STEP 3: Decision Logic + Early Exit

Based on discovery, decide:

| Condition | Action |
|-----------|--------|
| `--run-first` flag present | Go to STEP 4 (run fresh tests) |
| PYTEST_EXISTS=yes AND AGE < 900s AND FAILURES > 0 | Go to STEP 5 (read results) |
| PYTEST_EXISTS=yes AND AGE < 900s AND FAILURES = 0 | **EARLY EXIT** (see below) |
| PYTEST_EXISTS=no OR AGE >= 900s | Go to STEP 4 (run fresh tests) |

### EARLY EXIT OPTIMIZATION (Token Savings: ~80%)

If ALL tests are passing from cached results:

```
✅ All tests passing (PYTEST_FAILURES=0, VITEST_FAILURES=0)
📊 No failures to fix. Skipping agent dispatch.
💰 Token savings: ~80K tokens (avoided 7 agent dispatches)

Output JSON summary:
{
  "status": "all_passing",
  "tests_run": $PYTEST_TESTS,
  "failures": 0,
  "agents_dispatched": 0,
  "action": "none_required"
}

→ Go to STEP 10 (chain invocation) or EXIT if --no-chain
```

**DO NOT:**
- Run discovery phase (STEP 2.6) if no failures
- Dispatch any agents
- Run strategic analysis
- Generate documentation

This avoids full pipeline when unnecessary.

---

## STEP 4: Run Fresh Tests (if needed)

**4a. Run pytest:**
```bash
mkdir -p test-results/pytest && cd apps/api && uv run pytest -v --tb=short --junitxml=../../test-results/pytest/junit.xml 2>&1 | tail -40
```

**4b. Run Vitest (if config exists):**
```bash
test -f "apps/web/vitest.config.ts" && mkdir -p test-results/vitest && cd apps/web && npx vitest run --reporter=json --outputFile=../../test-results/vitest/results.json 2>&1 | tail -25
```

**4c. Run Playwright (if config exists):**
```bash
test -f "playwright.config.ts" && mkdir -p test-results/playwright && npx playwright test --reporter=json 2>&1 | tee test-results/playwright/results.json | tail -25
```

**4d. If --coverage flag present:**
```bash
mkdir -p test-results/pytest && cd apps/api && uv run pytest --cov=app --cov-report=xml:../../test-results/pytest/coverage.xml --cov-report=term-missing 2>&1 | tail -30
```

---

## STEP 5: Read Test Result Files

Use the Read tool:

**For pytest:** `Read(file_path="test-results/pytest/junit.xml")`
- Look for `<testcase>` with `<failure>` or `<error>` children
- Extract: test name, classname (file path), failure message, **full stack trace**

**For Vitest:** `Read(file_path="test-results/vitest/results.json")`
- Look for `"status": "failed"` entries
- Extract: test name, file path, failure messages

**For Playwright:** `Read(file_path="test-results/playwright/results.json")`
- Look for specs where `"ok": false`
- Extract: test title, browser, error message

---

## STEP 5.5: ANALYSIS PHASE

### 5.5a. Test Isolation Analysis

Check for potential isolation issues:

```bash
echo "=== Shared State Detection ===" && grep -rn "global\|class.*:$" tests/ 2>/dev/null | grep -v "conftest\|__pycache__" | head -10
```

```bash
echo "=== Fixture Scope Analysis ===" && grep -rn "@pytest.fixture.*scope=" tests/ 2>/dev/null | head -10
```

```bash
echo "=== Order Dependency Markers ===" && grep -rn "pytest.mark.order\|pytest.mark.serial" tests/ 2>/dev/null | head -5
```

If isolation issues detected:
- Add to agent context: "WARNING: Potential test isolation issues detected"
- List affected files

### 5.5b. Flakiness Detection

Check for flaky test indicators:

```bash
echo "=== Timing Dependencies ===" && grep -rn "sleep\|time.sleep\|setTimeout" tests/ 2>/dev/null | grep -v "__pycache__" | head -5
```

```bash
echo "=== Async Race Conditions ===" && grep -rn "asyncio.gather\|Promise.all" tests/ 2>/dev/null | head -5
```

If flakiness indicators found:
- Add to agent context: "Known flaky patterns detected"
- Recommend: pytest-rerunfailures or vitest retry

### 5.5c. Coverage Analysis (if --coverage)

```bash
test -f "test-results/pytest/coverage.xml" && grep -o 'line-rate="[0-9.]*"' test-results/pytest/coverage.xml | head -1
```

Coverage gates:
- < 60%: WARN "Critical: Coverage below 60%"
- 60-80%: INFO "Coverage could be improved"
- > 80%: OK

---

## STEP 6: Enhanced Failure Categorization (Regex-Based)

Use regex pattern matching for precise categorization:

### Unit Test Patterns → unit-test-fixer
- `/AssertionError:.*expected.*got/` → Assertion mismatch
- `/Mock.*call_count.*expected/` → Mock verification failure
- `/fixture.*not found/` → Fixture missing
- Business logic failures

### API Test Patterns → api-test-fixer
- `/status.*(4\d\d|5\d\d)/` → HTTP error response
- `/validation.*failed|ValidationError/` → Schema validation
- `/timeout.*\d+\s*(s|ms)/` → Request timeout
- FastAPI/Flask/Django endpoint failures

### Database Test Patterns → database-test-fixer
- `/connection.*refused|ConnectionError/` → Connection failure
- `/relation.*does not exist|table.*not found/` → Schema mismatch
- `/deadlock.*detected/` → Concurrency issue
- `/IntegrityError|UniqueViolation/` → Constraint violation
- Fixture/mock database issues

### E2E Test Patterns → e2e-test-fixer
- `/locator.*timeout|element.*not found/` → Selector failure
- `/navigation.*failed|page.*crashed/` → Page load issue
- `/screenshot.*captured/` → Visual regression
- Playwright/Cypress failures

### Type Error Patterns → type-error-fixer
- `/TypeError:.*expected.*got/` → Type mismatch
- `/mypy.*error/` → Static type check failure
- `/TypeScript.*error TS/` → TS compilation error

### Import Error Patterns → import-error-fixer
- `/ModuleNotFoundError|ImportError/` → Missing module
- `/circular import/` → Circular dependency
- `/cannot import name/` → Named import failure

---

## STEP 6.5: FAILURE PRIORITIZATION

Assign priority based on test type:

| Priority | Criteria | Detection |
|----------|----------|-----------|
| P0 Critical | Security/auth tests | `test_auth_*`, `test_security_*`, `test_permission_*` |
| P1 High | Core business logic | `test_*_service`, `test_*_handler`, most unit tests |
| P2 Medium | Integration tests | `test_*_integration`, API tests |
| P3 Low | Edge cases, performance | `test_*_edge_*`, `test_*_perf_*`, `test_*_slow` |

Pass priority information to agents:
- "Priority: P0 - Fix these FIRST (security critical)"
- "Priority: P1 - High importance (core logic)"

---

## STEP 7: STRATEGIC MODE (if triggered)

If STRATEGIC_MODE=true:

### 7a. Launch Test Strategy Analyst

```
Task(subagent_type="test-strategy-analyst",
     model="opus",
     description="Analyze recurring test failures",
     prompt="Analyze test failures in this project using Five Whys methodology.

Git history shows $TEST_FIX_COUNT recent test fix attempts.
Current failures: [FAILURE SUMMARY]

Research:
1. Best practices for the detected failure patterns
2. Common pitfalls in pytest/vitest testing
3. Root cause analysis for recurring issues

Provide strategic recommendations for systemic fixes.

MANDATORY OUTPUT FORMAT - Return ONLY JSON:
{
  \"root_causes\": [{\"issue\": \"...\", \"five_whys\": [...], \"recommendation\": \"...\"}],
  \"infrastructure_changes\": [\"...\"],
  \"prevention_mechanisms\": [\"...\"],
  \"priority\": \"P0|P1|P2\",
  \"summary\": \"Brief strategic overview\"
}
DO NOT include verbose analysis or full code examples.")
```

### 7b. After Strategy Analyst Completes

If fixes are recommended, proceed to STEP 8.

### 7c. Launch Documentation Generator (optional)

If significant insights were found:
```
Task(subagent_type="test-documentation-generator",
     model="haiku",
     description="Generate test knowledge documentation",
     prompt="Based on the strategic analysis results, generate:
1. Test failure runbook (docs/test-failure-runbook.md)
2. Test strategy summary (docs/test-strategy.md)
3. Pattern-specific knowledge (docs/test-knowledge/)

MANDATORY OUTPUT FORMAT - Return ONLY JSON:
{
  \"files_created\": [\"docs/test-failure-runbook.md\"],
  \"patterns_documented\": 3,
  \"summary\": \"Created runbook with 5 failure patterns\"
}
DO NOT include file contents in response.")
```

---

## STEP 7.5: Conflict Detection for Parallel Agents

Before launching agents, detect overlapping file scopes to prevent conflicts:

**SAFE TO PARALLELIZE (different test domains):**
- unit-test-fixer + e2e-test-fixer → ✅ Different test directories
- api-test-fixer + database-test-fixer → ✅ Different concerns
- vitest tests + pytest tests → ✅ Different frameworks

**MUST SERIALIZE (overlapping files):**
- unit-test-fixer + import-error-fixer → ⚠️ Both may modify conftest.py → SEQUENTIAL
- type-error-fixer + any test fixer → ⚠️ Type fixes affect test expectations → RUN FIRST
- Multiple fixers for same test file → ⚠️ RUN SEQUENTIALLY

**Execution Phases:**
```
PHASE 1 (First): type-error-fixer, import-error-fixer
   └── These fix foundational issues that other agents depend on

PHASE 2 (Parallel): unit-test-fixer, api-test-fixer, database-test-fixer
   └── These target different test categories, safe to run together

PHASE 3 (Last): e2e-test-fixer
   └── E2E depends on backend fixes being complete

PHASE 4 (Validation): Run full test suite to verify all fixes
```

**Conflict Detection Algorithm:**
```bash
# Check if multiple agents target same file patterns
# If conftest.py in scope of multiple agents → serialize them
# If same test file reported → assign to single agent only
```

---

## STEP 7.6: Test File Modification Safety (NEW)

**CRITICAL**: When multiple test files need modification, apply dependency-aware batching similar to source file refactoring.

### Analyze Test File Dependencies

Before spawning test fixers, identify shared fixtures and conftest dependencies:

```bash
echo "=== Test Dependency Analysis ==="

# Find all conftest.py files
CONFTEST_FILES=$(find tests/ -name "conftest.py" 2>/dev/null)
echo "Shared fixture files: $CONFTEST_FILES"

# For each failing test file, find its fixture dependencies
for TEST_FILE in $FAILING_TEST_FILES; do
    # Find imports from conftest
    FIXTURE_IMPORTS=$(grep -E "^from.*conftest|@pytest.fixture" "$TEST_FILE" 2>/dev/null | head -10)

    # Find shared fixtures used
    FIXTURES_USED=$(grep -oE "[a-z_]+_fixture|@pytest.fixture" "$TEST_FILE" 2>/dev/null | sort -u)

    echo "  $TEST_FILE -> fixtures: [$FIXTURES_USED]"
done
```

### Group Test Files by Shared Fixtures

```bash
# Files sharing conftest.py fixtures MUST serialize
# Files with independent fixtures CAN parallelize

# Example output:
echo "
Test Cluster A (SERIAL - shared fixtures in tests/conftest.py):
  - tests/unit/test_user.py
  - tests/unit/test_auth.py

Test Cluster B (PARALLEL - independent fixtures):
  - tests/integration/test_api.py
  - tests/integration/test_database.py

Test Cluster C (SPECIAL - conftest modification needed):
  - tests/conftest.py (SERIALIZE - blocks all others)
"
```

### Execution Rules for Test Modifications

| Scenario | Execution Mode | Reason |
|----------|----------------|--------|
| Multiple test files, no shared fixtures | PARALLEL | Safe, independent |
| Multiple test files, shared fixtures | SERIAL within fixture scope | Fixture state conflicts |
| conftest.py needs modification | SERIAL (blocks all) | Critical shared state |
| Same test file reported by multiple fixers | Single agent only | Avoid merge conflicts |

### conftest.py Special Handling

If `conftest.py` needs modification:

1. **Run conftest fixer FIRST** (before any other test fixers)
2. **Wait for completion** before proceeding
3. **Re-run baseline tests** to verify fixture changes don't break existing tests
4. **Then parallelize** remaining independent test fixes

```
PHASE 1 (First, blocking): conftest.py modification
   └── WAIT for completion

PHASE 2 (Sequential): Test files sharing modified fixtures
   └── Run one at a time, verify after each

PHASE 3 (Parallel): Independent test files
   └── Safe to parallelize
```

### Failure Handling for Test Modifications

When a test fixer fails:

```
AskUserQuestion(
  questions=[{
    "question": "Test fixer for {test_file} failed: {error}. {N} test files remain. What would you like to do?",
    "header": "Test Fix Failure",
    "options": [
      {"label": "Continue", "description": "Skip this test file, proceed with remaining"},
      {"label": "Abort", "description": "Stop test fixing, preserve current state"},
      {"label": "Retry", "description": "Attempt to fix {test_file} again"}
    ],
    "multiSelect": false
  }]
)
```

### Test Fixer Dispatch with Scope

Include scope information when dispatching test fixers:

```
Task(
    subagent_type="unit-test-fixer",
    description="Fix unit tests in {test_file}",
    prompt="Fix failing tests in this file:

    TEST FILE CONTEXT:
    - file: {test_file}
    - shared_fixtures: {list of conftest fixtures used}
    - parallel_peers: {other test files being fixed simultaneously}
    - conftest_modified: {true|false - was conftest changed this session?}

    SCOPE CONSTRAINTS:
    - ONLY modify: {test_file}
    - DO NOT modify: conftest.py (unless explicitly assigned)
    - DO NOT modify: {parallel_peer_files}

    MANDATORY OUTPUT FORMAT - Return ONLY JSON:
    {
      \"status\": \"fixed|partial|failed\",
      \"test_file\": \"{test_file}\",
      \"tests_fixed\": N,
      \"fixtures_modified\": [],
      \"remaining_failures\": N,
      \"summary\": \"...\"
    }"
)
```

---

## STEP 8: PARALLEL AGENT DISPATCH

### CRITICAL: Launch ALL agents in ONE response with multiple Task calls.

### ENHANCED AGENT CONTEXT TEMPLATE

For each agent, provide this comprehensive context:

```
Test Specialist Task: [Agent Type] - Test Failure Fix

## Context
- Project: [detected from git remote]
- Branch: [from git branch --show-current]
- Framework: pytest [version] / vitest [version]
- Python/Node version: [detected]

## Project Patterns (DISCOVER DYNAMICALLY - Do This First!)
**CRITICAL - Project Context Discovery:**
Before making any fixes, you MUST:
1. Read CLAUDE.md at project root (if exists) for project conventions
2. Check .claude/rules/ directory for domain-specific rule files:
   - If editing Python test files → read python*.md rules
   - If editing TypeScript tests → read typescript*.md rules
   - If graphiti/temporal patterns exist → read graphiti.md rules
3. Detect test patterns from config files (pytest.ini, vitest.config.ts)
4. Apply discovered patterns to ALL your fixes

This ensures fixes follow project conventions, not generic patterns.

[Include PROJECT_CONTEXT from STEP 2.6 here]

## Recent Test Changes
[git diff HEAD~3 --name-only | grep -E "(test|spec)\.(py|ts|tsx)$"]

## Failures to Fix
[FAILURE LIST with full stack traces]

## Test Isolation Status
[From STEP 5.5a - any warnings]

## Flakiness Report
[From STEP 5.5b - any detected patterns]

## Priority
[From STEP 6.5 - P0/P1/P2/P3 with reasoning]

## Framework Configuration
[From STEP 2.5 - markers, config]

## Constraints
- Follow project's test method length limits (check CLAUDE.md or file-size-guidelines.md)
- Pre-flight: Verify baseline tests pass
- Post-flight: Ensure no broken existing tests
- Cannot modify implementation code (test expectations only unless bug found)
- Apply project-specific patterns discovered from CLAUDE.md/.claude/rules/

## Expected Output
- Summary of fixes made
- Files modified with line numbers
- Verification commands run
- Remaining issues (if any)
```

### Dispatch Example (with Model Strategy + JSON Output)

```
Task(subagent_type="unit-test-fixer",
     model="sonnet",
     description="Fix unit test failures (P1)",
     prompt="[FULL ENHANCED CONTEXT TEMPLATE]

MANDATORY OUTPUT FORMAT - Return ONLY JSON:
{
  \"status\": \"fixed|partial|failed\",
  \"tests_fixed\": N,
  \"files_modified\": [\"path/to/file.py\"],
  \"remaining_failures\": N,
  \"summary\": \"Brief description of fixes\"
}
DO NOT include full file content or verbose logs.")

Task(subagent_type="api-test-fixer",
     model="sonnet",
     description="Fix API test failures (P2)",
     prompt="[FULL ENHANCED CONTEXT TEMPLATE]

MANDATORY OUTPUT FORMAT - Return ONLY JSON:
{...same format...}
DO NOT include full file content or verbose logs.")

Task(subagent_type="import-error-fixer",
     model="haiku",
     description="Fix import errors (P1)",
     prompt="[CONTEXT]

MANDATORY OUTPUT FORMAT - Return ONLY JSON:
{...same format...}")
```

### Model Strategy

| Agent Type | Model | Rationale |
|------------|-------|-----------|
| test-strategy-analyst | opus | Complex research + Five Whys |
| unit/api/database/e2e-test-fixer | sonnet | Balanced speed + quality |
| type-error-fixer | sonnet | Type inference complexity |
| import-error-fixer | haiku | Simple pattern matching |
| linting-fixer | haiku | Rule-based fixes |
| test-documentation-generator | haiku | Template-based docs |

---

## STEP 9: Validate Fixes

After agents complete:

```bash
cd apps/api && uv run pytest -v --tb=short --junitxml=../../test-results/pytest/junit.xml 2>&1 | tail -40
```

Check results:
- If ALL tests pass → Go to STEP 10
- If SOME tests still fail → Report remaining failures, suggest --strategic

---

## STEP 10: INTELLIGENT CHAIN INVOCATION

### 10a. Check Depth
If SLASH_DEPTH >= 3:
- Report: "Maximum depth reached, skipping chain invocation"
- Go to STEP 11

### 10b. Check --no-chain Flag
If --no-chain present:
- Report: "Chain invocation disabled by flag"
- Go to STEP 11

### 10c. Determine Chain Action

**If ALL tests passing AND changes were made:**
```
SlashCommand(skill="/commit_orchestrate",
             args="--message 'fix(tests): resolve test failures'")
```

**If ALL tests passing AND NO changes made:**
- Report: "All tests passing, no changes needed"
- Go to STEP 11

**If SOME tests still failing:**
- Report remaining failure count
- If TACTICAL mode: Suggest "Run with --strategic for root cause analysis"
- Go to STEP 11

---

## STEP 11: Report Summary

Report:
- Mode: TACTICAL or STRATEGIC
- Initial failure count by type
- Agents dispatched with priorities
- Strategic insights (if applicable)
- Current pass/fail status
- Coverage status (if --coverage)
- Chain invocation result
- Remaining issues and recommendations

---

## Quick Reference

| Command | Effect |
|---------|--------|
| `/test_orchestrate` | Use cached results if fresh (<15 min) |
| `/test_orchestrate --run-first` | Run tests fresh, ignore cache |
| `/test_orchestrate --pytest-only` | Only pytest failures |
| `/test_orchestrate --strategic` | Force strategic mode (research + analysis) |
| `/test_orchestrate --coverage` | Include coverage analysis |
| `/test_orchestrate --no-chain` | Don't auto-invoke /commit_orchestrate |

## VS Code Integration

pytest.ini must have: `addopts = --junitxml=test-results/pytest/junit.xml`

Then: Run tests in VS Code -> `/test_orchestrate` reads cached results -> Fixes applied

---

## Agent Quick Reference

| Failure Pattern | Agent | Model | JSON Output |
|-----------------|-------|-------|-------------|
| Assertions, mocks, fixtures | unit-test-fixer | sonnet | Required |
| HTTP, API contracts, endpoints | api-test-fixer | sonnet | Required |
| Database, SQL, connections | database-test-fixer | sonnet | Required |
| Selectors, timeouts, E2E | e2e-test-fixer | sonnet | Required |
| Type annotations, mypy | type-error-fixer | sonnet | Required |
| Imports, modules, paths | import-error-fixer | haiku | Required |
| Strategic analysis | test-strategy-analyst | opus | Required |
| Documentation | test-documentation-generator | haiku | Required |

## Token Efficiency: JSON Output Format

**ALL agents MUST return distilled JSON summaries only.**

```json
{
  "status": "fixed|partial|failed",
  "tests_fixed": 3,
  "files_modified": ["tests/test_auth.py", "tests/conftest.py"],
  "remaining_failures": 0,
  "summary": "Fixed mock configuration and assertion order"
}
```

**DO NOT return:**
- Full file contents
- Verbose explanations
- Step-by-step execution logs

This reduces token usage by 80-90% per agent response.

---

EXECUTE NOW. Start with Step 0a (depth check).
