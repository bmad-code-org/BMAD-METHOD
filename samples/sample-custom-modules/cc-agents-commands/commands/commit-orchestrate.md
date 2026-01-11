---
description: "Orchestrate git commit workflows with parallel quality checks and automated staging"
argument-hint: "[commit_message] [--stage-all] [--skip-hooks] [--quality-first] [--push-after]"
allowed-tools: ["Task", "TodoWrite", "Bash", "Grep", "Read", "LS", "Glob", "SlashCommand"]
---

# ⚠️ GENERAL-PURPOSE COMMAND - Works with any project
# Tools (ruff, mypy, pytest) are detected dynamically from system PATH, venv, or .venv
# Source directories are detected dynamically (apps/api/src, src, lib, .)
# Override with COMMIT_RUFF_CMD, COMMIT_MYPY_CMD, COMMIT_SRC_DIR environment variables

You must now execute the following git commit orchestration procedure for: "$ARGUMENTS"

## EXECUTE IMMEDIATELY: Git Commit Analysis & Quality Orchestration

**STEP 1: Parse Arguments**
Parse "$ARGUMENTS" to extract:
- Commit message or "auto-generate"
- --stage-all flag (stage all changes)
- --skip-hooks flag (bypass pre-commit hooks)
- --quality-first flag (run all quality checks before staging)
- --push-after flag (push to remote after successful commit)

**STEP 2: Pre-Commit Analysis**
Use git commands to analyze repository state:
```bash
# Check repository status
git status --porcelain
git diff --name-only  # Unstaged changes
git diff --cached --name-only  # Staged changes
git stash list  # Check for stashed changes

# Check for potential commit blockers
git log --oneline -5  # Recent commits for message pattern
git branch --show-current  # Current branch
```

**STEP 2.5: Load Shared Project Context (Token Efficient)**

```bash
# Source shared discovery helper (uses cache if fresh)
if [[ -f "$HOME/.claude/scripts/shared-discovery.sh" ]]; then
    source "$HOME/.claude/scripts/shared-discovery.sh"
    discover_project_context
    # SHARED_CONTEXT, PROJECT_TYPE, VALIDATION_CMD now available
fi
```

**STEP 3: Quality Issue Detection & Agent Mapping**

**CODE QUALITY ISSUES:**
- Linting violations (ruff errors) → linting-fixer
- Formatting inconsistencies → linting-fixer  
- Import organization problems → import-error-fixer
- Type checking failures → type-error-fixer

**SECURITY CONCERNS:**
- Secrets in staged files → security-scanner
- Potential vulnerabilities → security-scanner
- Sensitive data exposure → security-scanner

**TEST FAILURES:**
- Unit test failures → unit-test-fixer
- API test failures → api-test-fixer
- Database test failures → database-test-fixer
- Integration test failures → e2e-test-fixer

**FILE CONFLICTS:**
- Merge conflicts → general-purpose
- Binary file issues → general-purpose
- Large file warnings → general-purpose

**STEP 4: Create Parallel Quality Work Packages**

**For PRE_COMMIT_QUALITY:**
```bash
# ============================================
# DYNAMIC TOOL DETECTION (Project-Agnostic)
# ============================================

# Detect ruff command (allow env override)
if [[ -n "$COMMIT_RUFF_CMD" ]]; then
  RUFF_CMD="$COMMIT_RUFF_CMD"
  echo "📦 Using override ruff: $RUFF_CMD"
elif command -v ruff &> /dev/null; then
  RUFF_CMD="ruff"
elif [[ -f "./venv/bin/ruff" ]]; then
  RUFF_CMD="./venv/bin/ruff"
elif [[ -f "./.venv/bin/ruff" ]]; then
  RUFF_CMD="./.venv/bin/ruff"
elif command -v uv &> /dev/null; then
  RUFF_CMD="uv run ruff"
else
  RUFF_CMD=""
  echo "⚠️ ruff not found - skipping linting"
fi

# Detect mypy command (allow env override)
if [[ -n "$COMMIT_MYPY_CMD" ]]; then
  MYPY_CMD="$COMMIT_MYPY_CMD"
  echo "📦 Using override mypy: $MYPY_CMD"
elif command -v mypy &> /dev/null; then
  MYPY_CMD="mypy"
elif [[ -f "./venv/bin/mypy" ]]; then
  MYPY_CMD="./venv/bin/mypy"
elif [[ -f "./.venv/bin/mypy" ]]; then
  MYPY_CMD="./.venv/bin/mypy"
elif command -v uv &> /dev/null; then
  MYPY_CMD="uv run mypy"
else
  MYPY_CMD=""
  echo "⚠️ mypy not found - skipping type checking"
fi

# Detect source directory (allow env override)
if [[ -n "$COMMIT_SRC_DIR" ]] && [[ -d "$COMMIT_SRC_DIR" ]]; then
  SRC_DIR="$COMMIT_SRC_DIR"
  echo "📁 Using override source dir: $SRC_DIR"
else
  SRC_DIR=""
  for dir in "apps/api/src" "src" "lib" "app" "."; do
    if [[ -d "$dir" ]]; then
      SRC_DIR="$dir"
      echo "📁 Detected source dir: $SRC_DIR"
      break
    fi
  done
fi

# Detect quality issues that would block commit
if [[ -n "$RUFF_CMD" ]]; then
  $RUFF_CMD check . --output-format=concise 2>/dev/null | head -20
fi
if [[ -n "$MYPY_CMD" ]] && [[ -n "$SRC_DIR" ]]; then
  $MYPY_CMD "$SRC_DIR" --show-error-codes 2>/dev/null | head -20
fi
git secrets --scan 2>/dev/null || true  # Check for secrets (if available)
```

**For TEST_VALIDATION:**
```bash
# Detect pytest command
if command -v pytest &> /dev/null; then
  PYTEST_CMD="pytest"
elif [[ -f "./venv/bin/pytest" ]]; then
  PYTEST_CMD="./venv/bin/pytest"
elif [[ -f "./.venv/bin/pytest" ]]; then
  PYTEST_CMD="./.venv/bin/pytest"
elif command -v uv &> /dev/null; then
  PYTEST_CMD="uv run pytest"
else
  PYTEST_CMD="python -m pytest"
fi

# Detect test directory
TEST_DIR=""
for dir in "tests" "test" "apps/api/tests"; do
  if [[ -d "$dir" ]]; then
    TEST_DIR="$dir"
    break
  fi
done

# Run critical tests before commit
if [[ -n "$TEST_DIR" ]]; then
  $PYTEST_CMD "$TEST_DIR" -x --tb=short 2>/dev/null | head -20
else
  echo "⚠️ No test directory found - skipping test validation"
fi
# Check for test file changes
git diff --name-only | grep -E "test_|_test\.py|\.test\." || true
```

**For SECURITY_SCANNING:**
```bash
# Security pre-commit checks
find . -name "*.py" -exec grep -l "password\|secret\|key\|token" {} \; | head -10
# Check for common security issues
```

**STEP 5: EXECUTE PARALLEL QUALITY AGENTS**
🚨 CRITICAL: ALWAYS USE BATCH DISPATCH FOR PARALLEL EXECUTION 🚨

MANDATORY REQUIREMENT: Launch multiple Task agents simultaneously using batch dispatch in a SINGLE response.

EXECUTION METHOD - Use multiple Task tool calls in ONE message:
- Task(subagent_type="linting-fixer", description="Fix pre-commit linting issues", prompt="Detailed linting fix instructions")
- Task(subagent_type="security-scanner", description="Scan for commit security issues", prompt="Detailed security scan instructions")
- Task(subagent_type="unit-test-fixer", description="Fix failing tests before commit", prompt="Detailed test fix instructions")
- Task(subagent_type="type-error-fixer", description="Fix type errors before commit", prompt="Detailed type fix instructions")
- [Additional quality agents as needed]

⚠️ CRITICAL: NEVER execute Task calls sequentially - they MUST all be in a single message batch

Each commit quality agent prompt must include:
```
Commit Quality Task: [Agent Type] - Pre-Commit Fix

Context: You are part of parallel commit orchestration for: $ARGUMENTS

Your Quality Domain: [linting/security/testing/types]
Your Scope: [Files to be committed that need quality fixes]
Your Task: Ensure commit quality in your domain before staging
Constraints: Only fix issues in staged/to-be-staged files

Critical Commit Requirements:
- All fixes must maintain code functionality
- No breaking changes during commit quality fixes
- Security fixes must not expose sensitive data
- Performance fixes cannot introduce regressions
- All changes must be automatically committable

Pre-Commit Workflow:
1. Identify quality issues in commit files
2. Apply fixes that maintain code integrity  
3. Verify fixes don't break functionality
4. Ensure files are ready for staging
5. Report quality status for commit readiness

MANDATORY OUTPUT FORMAT - Return ONLY JSON:
{
  "status": "fixed|partial|failed",
  "issues_fixed": N,
  "files_modified": ["path/to/file.py"],
  "quality_gates_passed": true|false,
  "staging_ready": true|false,
  "blockers": [],
  "summary": "Brief description of fixes"
}

DO NOT include:
- Full file contents
- Verbose execution logs
- Step-by-step descriptions

Execute your commit quality fixes autonomously and report JSON summary only.
```

**COMMIT QUALITY SPECIALIST MAPPING:**
- linting-fixer: Code style, ruff/mypy pre-commit fixes
- security-scanner: Secrets detection, vulnerability pre-commit scanning
- unit-test-fixer: Test failures that would block commit
- api-test-fixer: API endpoint tests before commit
- database-test-fixer: Database integration pre-commit tests
- type-error-fixer: Type checking issues before commit
- import-error-fixer: Module import issues in commit files
- e2e-test-fixer: Critical integration tests before commit
- general-purpose: Git conflicts, merge issues, file problems

**STEP 6: Intelligent Commit Message Generation & Execution**

## Best Practices Reference
Following Conventional Commits (conventionalcommits.org) and Git project standards:
- **Subject**: Imperative mood, ≤50 chars, no period, format: `<type>[scope]: <description>`
- **Body**: Explain WHY (not HOW), wrap at 72 chars, separate from subject with blank line
- **Footer**: Reference issues (`Closes #123`), note breaking changes
- **Types**: feat, fix, docs, style, refactor, perf, test, build, ci, chore

## Good vs Bad Examples
❌ BAD: "fix: address quality issues in auth.py" (vague, focuses on file not change)
✅ GOOD: "feat(auth): implement JWT refresh token endpoint" (specific, clear type/scope)

❌ BAD: "updated code" (past tense, no detail)
✅ GOOD: "refactor(api): simplify error handling middleware" (imperative, descriptive)

After quality agents complete their fixes:

```bash
# Stage quality-fixed files
git add -A  # or specific files based on quality fixes

# INTELLIGENT COMMIT MESSAGE GENERATION
if [[ -z "$USER_PROVIDED_MESSAGE" ]]; then
  echo "🤖 Generating intelligent commit message..."

  # Analyze staged changes to determine type and scope
  CHANGED_FILES=$(git diff --cached --name-only)
  ADDED_FILES=$(git diff --cached --diff-filter=A --name-only | wc -l)
  MODIFIED_FILES=$(git diff --cached --diff-filter=M --name-only | wc -l)
  DELETED_FILES=$(git diff --cached --diff-filter=D --name-only | wc -l)
  TEST_FILES=$(echo "$CHANGED_FILES" | grep -E "(test_|_test\.py|\.test\.|\.spec\.)" | wc -l)

  # Detect commit type based on file patterns
  TYPE="chore"  # default
  SCOPE=""

  if echo "$CHANGED_FILES" | grep -qE "^docs/"; then
    TYPE="docs"
  elif echo "$CHANGED_FILES" | grep -qE "^test/|^tests/|test_|_test\.py"; then
    TYPE="test"
  elif echo "$CHANGED_FILES" | grep -qE "\.github/|ci/|\.gitlab-ci"; then
    TYPE="ci"
  elif [ "$ADDED_FILES" -gt 0 ] && [ "$TEST_FILES" -gt 0 ]; then
    TYPE="feat"  # New files + tests = feature
  elif [ "$MODIFIED_FILES" -gt 0 ] && git diff --cached | grep -qE "^\+.*def |^\+.*class "; then
    # New functions/classes without breaking existing = likely feature
    if git diff --cached | grep -qE "^\-.*def |^\-.*class "; then
      TYPE="refactor"  # Modifying existing functions/classes
    else
      TYPE="feat"
    fi
  elif git diff --cached | grep -qE "^\+.*#.*fix|^\+.*#.*bug"; then
    TYPE="fix"
  elif git diff --cached | grep -qE "performance|optimize|speed"; then
    TYPE="perf"
  fi

  # Detect scope from directory structure
  PRIMARY_DIR=$(echo "$CHANGED_FILES" | head -1 | cut -d'/' -f1)
  if [ "$PRIMARY_DIR" != "" ] && [ "$PRIMARY_DIR" != "." ]; then
    # Extract meaningful scope (e.g., "auth" from "src/auth/login.py")
    SCOPE_CANDIDATE=$(echo "$CHANGED_FILES" | head -1 | cut -d'/' -f2)
    if [ "$SCOPE_CANDIDATE" != "" ] && [ ${#SCOPE_CANDIDATE} -lt 15 ]; then
      SCOPE="($SCOPE_CANDIDATE)"
    fi
  fi

  # Extract issue number from branch name
  BRANCH_NAME=$(git branch --show-current)
  ISSUE_REF=""
  if [[ "$BRANCH_NAME" =~ \#([0-9]+) ]] || [[ "$BRANCH_NAME" =~ issue[-_]([0-9]+) ]]; then
    ISSUE_NUM="${BASH_REMATCH[1]}"
    ISSUE_REF="Closes #$ISSUE_NUM"
  elif [[ "$BRANCH_NAME" =~ story/([0-9]+\.[0-9]+) ]]; then
    STORY_NUM="${BASH_REMATCH[1]}"
    ISSUE_REF="Story $STORY_NUM"
  fi

  # Generate meaningful subject from code analysis
  # Use git diff to find key changes (function names, class names, imports)
  KEY_CHANGES=$(git diff --cached | grep -E "^\+.*def |^\+.*class |^\+.*import " | head -3 | sed 's/^+//' | sed 's/def //' | sed 's/class //' | sed 's/import //' | tr '\n' ', ' | sed 's/,$//')

  # Create descriptive subject (fallback to file-based if no key changes)
  if [ -n "$KEY_CHANGES" ] && [ ${#KEY_CHANGES} -lt 40 ]; then
    SUBJECT="implement ${KEY_CHANGES}"
  else
    PRIMARY_FILE=$(echo "$CHANGED_FILES" | head -1 | xargs basename)
    MODULE_NAME=$(echo "$PRIMARY_FILE" | sed 's/\.py$//' | sed 's/_/ /g')
    SUBJECT="update ${MODULE_NAME} module"
  fi

  # Enforce 50-char limit on subject
  FULL_SUBJECT="${TYPE}${SCOPE}: ${SUBJECT}"
  if [ ${#FULL_SUBJECT} -gt 50 ]; then
    # Truncate subject intelligently
    MAX_DESC_LEN=$((50 - ${#TYPE} - ${#SCOPE} - 2))
    SUBJECT=$(echo "$SUBJECT" | cut -c1-$MAX_DESC_LEN)
    FULL_SUBJECT="${TYPE}${SCOPE}: ${SUBJECT}"
  fi

  # Generate commit body (WHY, not HOW)
  COMMIT_BODY="Improves code quality and maintainability by addressing:"
  if echo "$CHANGED_FILES" | grep -qE "test"; then
    COMMIT_BODY="${COMMIT_BODY}\n- Test coverage and reliability"
  fi
  if git diff --cached | grep -qE "type:|->"; then
    COMMIT_BODY="${COMMIT_BODY}\n- Type safety and error handling"
  fi
  if git diff --cached | grep -qE "import"; then
    COMMIT_BODY="${COMMIT_BODY}\n- Module organization and dependencies"
  fi

  # Construct full commit message
  COMMIT_MSG="${FULL_SUBJECT}\n\n${COMMIT_BODY}"
  if [ -n "$ISSUE_REF" ]; then
    COMMIT_MSG="${COMMIT_MSG}\n\n${ISSUE_REF}"
  fi

  # Validate message quality
  if echo "$FULL_SUBJECT" | grep -qiE "stuff|things|update code|fix bug|changes"; then
    echo "⚠️  WARNING: Generated commit message may be too vague"
    echo "Consider providing specific message via: /commit_orchestrate 'type(scope): specific description'"
  fi

  echo "📝 Generated commit message:"
  echo "$COMMIT_MSG"
else
  COMMIT_MSG="$USER_PROVIDED_MESSAGE"

  # Validate user-provided message
  if ! echo "$COMMIT_MSG" | grep -qE "^(feat|fix|docs|style|refactor|perf|test|build|ci|chore)(\(.+\))?:"; then
    echo "⚠️  WARNING: Message doesn't follow Conventional Commits format"
    echo "Expected: <type>[optional scope]: <description>"
    echo "Types: feat, fix, docs, style, refactor, perf, test, build, ci, chore"
  fi

  SUBJECT_LINE=$(echo "$COMMIT_MSG" | head -1)
  if [ ${#SUBJECT_LINE} -gt 50 ]; then
    echo "⚠️  WARNING: Subject line exceeds 50 characters (${#SUBJECT_LINE})"
  fi

  if echo "$SUBJECT_LINE" | grep -qiE "stuff|things|update code|fix bug|changes|fixed|updated"; then
    echo "⚠️  WARNING: Commit message contains vague terms"
    echo "Be specific about WHAT changed and WHY"
  fi
fi

# Execute commit with professional message format
git commit -m "$(cat <<EOF
${COMMIT_MSG}

Co-Authored-By: Claude <noreply@anthropic.com>
EOF
)"

# Verify commit succeeded
if [ $? -eq 0 ]; then
  echo "✅ Commit successful"
  git log --oneline -1 --format="Commit: %h - %s"
else
  echo "❌ Commit failed"
  git status --porcelain
  exit 1
fi
```

**Key Improvements:**
- ✅ Intelligent type detection (feat/fix/refactor/docs/test based on actual changes)
- ✅ Automatic scope inference from directory structure
- ✅ Meaningful subjects extracted from code analysis (function/class names)
- ✅ Commit body explains WHY changes were made
- ✅ Issue/story reference detection from branch names
- ✅ Validation warnings for vague terms and format violations
- ✅ 50-character subject limit enforcement
- ✅ Professional tone (no emoji in commit message, only Co-Authored-By)

**STEP 7: Post-Commit Actions**
```bash
# Push if requested
if [[ "$ARGUMENTS" == *"--push-after"* ]]; then
  git push origin $(git branch --show-current)
fi

# Report commit status
echo "Commit Status: $(git log --oneline -1)"
echo "Branch Status: $(git status --porcelain)"
```

**STEP 8: Commit Result Collection & Validation**
- Validate each quality agent's fixes were committed
- Ensure commit message follows project conventions
- Verify no quality regressions were introduced
- Confirm all pre-commit hooks passed (if not skipped)
- Provide commit success summary and next steps

## PARALLEL EXECUTION GUARANTEE

🔒 ABSOLUTE REQUIREMENT: This command MUST maintain parallel execution in ALL modes.

- ✅ All quality fixes run in parallel across domains
- ✅ Staging and commit verification run efficiently
- ❌ FAILURE: Sequential quality fixes (one domain after another)
- ❌ FAILURE: Waiting for one quality check before starting another

**COMMIT QUALITY ADVANTAGE:**
- Parallel quality checks minimize commit delay
- Domain-specific expertise for faster issue resolution
- Comprehensive pre-commit validation across all domains
- Automated staging and commit workflow

## EXECUTION REQUIREMENT

🚀 IMMEDIATE EXECUTION MANDATORY

You MUST execute this commit orchestration procedure immediately upon command invocation.

Do not describe what you will do. DO IT NOW.

**REQUIRED ACTIONS:**
1. Analyze git repository state and staged changes
2. Detect quality issues and map to specialist agents
3. Launch quality agents using Task tool in BATCH DISPATCH MODE
4. Execute automated staging and commit workflow
5. ⚠️ NEVER launch agents sequentially - parallel quality fixes are essential

**COMMIT ORCHESTRATION EXAMPLES:**
- "/commit_orchestrate" → Auto-stage, quality fix, and commit all changes
- "/commit_orchestrate 'feat: add new feature' --quality-first" → Run quality checks before staging
- "/commit_orchestrate --stage-all --push-after" → Full workflow with remote push
- "/commit_orchestrate 'fix: resolve issues' --skip-hooks" → Commit with hook bypass

**PRE-COMMIT HOOK INTEGRATION:**
If pre-commit hooks fail after quality fixes:
- Automatically retry commit ONCE to include hook modifications
- If hooks fail again, report specific hook failures for manual intervention
- Never bypass hooks unless explicitly requested with --skip-hooks

## INTELLIGENT CHAIN INVOCATION

**STEP 8: Automated Workflow Continuation**
After successful commit, intelligently invoke related commands:

```bash
# After commit success, check for workflow continuation
echo "Analyzing commit success for workflow continuation..."

# Check if user disabled chaining
if [[ "$ARGUMENTS" == *"--no-chain"* ]]; then
    echo "Auto-chaining disabled by user flag"
    exit 0
fi

# Prevent infinite loops
INVOCATION_DEPTH=${SLASH_DEPTH:-0}
if [[ $INVOCATION_DEPTH -ge 3 ]]; then
    echo "⚠️ Maximum command chain depth reached. Stopping auto-invocation."
    exit 0
fi

# Set depth for next invocation
export SLASH_DEPTH=$((INVOCATION_DEPTH + 1))

# If --push-after flag was used and commit succeeded, create/update PR
if [[ "$ARGUMENTS" == *"--push-after"* ]] && [[ "$COMMIT_SUCCESS" == "true" ]]; then
    echo "Commit pushed to remote. Creating/updating PR..."
    SlashCommand(command="/pr create")
fi

# If on a feature branch and commit succeeded, offer PR creation
CURRENT_BRANCH=$(git branch --show-current)
if [[ "$CURRENT_BRANCH" != "main" ]] && [[ "$CURRENT_BRANCH" != "master" ]] && [[ "$COMMIT_SUCCESS" == "true" ]]; then
    echo "✅ Commit successful on feature branch: $CURRENT_BRANCH"

    # Check if PR already exists
    PR_EXISTS=$(gh pr view --json number 2>/dev/null)
    if [[ -z "$PR_EXISTS" ]]; then
        echo "No PR exists for this branch. Creating one..."
        SlashCommand(command="/pr create")
    else
        echo "PR already exists. Checking status..."
        SlashCommand(command="/pr status")
    fi
fi
```

---

## Agent Quick Reference

| Quality Domain | Agent | Model | JSON Output |
|----------------|-------|-------|-------------|
| Linting/formatting | linting-fixer | haiku | Required |
| Security scanning | security-scanner | sonnet | Required |
| Type errors | type-error-fixer | sonnet | Required |
| Import errors | import-error-fixer | haiku | Required |
| Unit tests | unit-test-fixer | sonnet | Required |
| API tests | api-test-fixer | sonnet | Required |
| Database tests | database-test-fixer | sonnet | Required |
| E2E tests | e2e-test-fixer | sonnet | Required |
| Git conflicts | general-purpose | sonnet | Required |

---

## Token Efficiency: JSON Output Format

**ALL agents MUST return distilled JSON summaries only.**

```json
{
  "status": "fixed|partial|failed",
  "issues_fixed": 3,
  "files_modified": ["path/to/file.py"],
  "quality_gates_passed": true,
  "staging_ready": true,
  "summary": "Brief description of fixes"
}
```

**DO NOT return:**
- Full file contents
- Verbose explanations
- Step-by-step execution logs

This reduces token usage by 80-90% per agent response.

---

## Model Strategy

| Agent Type | Model | Rationale |
|------------|-------|-----------|
| linting-fixer, import-error-fixer | haiku | Simple pattern matching |
| security-scanner | sonnet | Security analysis complexity |
| All test fixers | sonnet | Balanced speed + quality |
| type-error-fixer | sonnet | Type inference complexity |
| general-purpose | sonnet | Varied task complexity |

---

EXECUTE NOW. Start with STEP 1 (parse arguments).