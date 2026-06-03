#!/bin/bash
#
# BMAD Epic Execute - TDD Flow Module
#
# Provides test-first development (TDD) workflow phases:
# 1. Test Specification - Generate test specs from acceptance criteria
# 2. Test Implementation - Create failing tests from specs
# 3. Test Verification - Verify tests fail appropriately before implementation
#
# Usage: Sourced by epic-execute.sh
#

# =============================================================================
# TDD Flow Variables
# =============================================================================

# Store test specifications for use across phases
LAST_TEST_SPEC=""

# Test spec output directory
TEST_SPEC_DIR=""

# =============================================================================
# Test Specification Phase
# =============================================================================

# Execute test specification phase
# Generates BDD-style test specifications from acceptance criteria
# Arguments:
#   $1 - story_file path
execute_test_spec_phase() {
    local story_file="$1"
    local story_id=$(basename "$story_file" .md)

    # Reset last spec
    LAST_TEST_SPEC=""

    log ">>> TEST SPEC PHASE: $story_id (generating test specifications)"

    local story_contents=$(cat "$story_file")

    # Load architecture file if available for context
    local arch_contents=""
    for search_path in "$PROJECT_ROOT/docs/architecture.md" "$PROJECT_ROOT/docs/architecture/architecture.md" "$PROJECT_ROOT/architecture.md"; do
        if [ -f "$search_path" ]; then
            arch_contents=$(cat "$search_path")
            break
        fi
    done

    # Get design context if available
    local design_context=""
    if type get_last_design >/dev/null 2>&1; then
        design_context=$(get_last_design)
    fi

    # Get the test files the design phase already planned, so the test-spec
    # phase reuses them instead of deciding the test surface independently (#7).
    local planned_tests=""
    if type build_planned_test_files_context >/dev/null 2>&1; then
        planned_tests=$(build_planned_test_files_context "$story_id")
    fi

    local spec_prompt="You are a Test Architect (TEA) generating test specifications from acceptance criteria.

## Your Task

Generate test specifications for: $story_id

Do NOT write test code yet. Output only test specifications in BDD format.

### CRITICAL RULES
- One test specification per acceptance criterion minimum
- Use Given-When-Then format for all specifications
- Include edge cases and error scenarios
- Assign unique test IDs (format: ${story_id}-E2E-001, ${story_id}-UNIT-001)
- Map each AC explicitly to test specifications

## Story to Analyze

**Story Path:** $story_file
**Story ID:** $story_id

<story>
$story_contents
</story>

## Architecture Context (for understanding test boundaries)

<architecture>
$arch_contents
</architecture>

## Design Context (if available)

<design>
$design_context
</design>
$planned_tests
## Exploration Commands

First, explore existing test patterns in the codebase:
\`\`\`bash
# Find existing test files
find . -type f \\( -name \"*.spec.ts\" -o -name \"*.test.ts\" -o -name \"*.spec.js\" -o -name \"*.test.js\" \\) | head -10
# Check test directory structure
ls -la test/ tests/ __tests__/ src/**/__tests__/ 2>/dev/null || true
\`\`\`

## Required Output

Output your test specifications in this exact format:

\`\`\`
TEST SPEC START
story_id: $story_id
generated: $(date '+%Y-%m-%d')

test_specifications:

## AC1: <acceptance criterion text>

### ${story_id}-E2E-001: <descriptive test name>
- Priority: P0|P1|P2
- Type: e2e|integration|unit
- Given: <precondition state>
- When: <action performed>
- Then: <expected outcome>
- Data: <test data requirements>

### ${story_id}-E2E-002: <edge case for AC1>
- Priority: P1
- Type: e2e
- Given: <edge case precondition>
- When: <action>
- Then: <expected error/behavior>

## AC2: <next acceptance criterion>

### ${story_id}-UNIT-001: <unit test name>
...

edge_cases:
  - <scenario not in ACs but important>

error_scenarios:
  - <error condition to test>

test_file_mapping:
  - ${story_id}-E2E-*: <suggested test file path>
  - ${story_id}-UNIT-*: <suggested test file path>
  - ${story_id}-INT-*: <suggested test file path>

TEST SPEC END
\`\`\`

## Completion Signal

After outputting the spec block:

1. Output JSON result:
\`\`\`json
{
  \"status\": \"COMPLETE\",
  \"story_id\": \"$story_id\",
  \"summary\": \"Generated N test specifications for M acceptance criteria\",
  \"tests_added\": <number of specs>
}
\`\`\`

2. Then output: TEST SPEC COMPLETE: $story_id - Generated N specifications"

    if [ "$DRY_RUN" = true ]; then
        echo "[DRY RUN] Would execute test spec phase for $story_id"
        return 0
    fi

    # Pipe to file to avoid memory bloat
    run_claude_to_file "$spec_prompt"
    local result
    result=$(read_phase_tail)

    # Extract test spec block
    LAST_TEST_SPEC=$(echo "$result" | sed -n '/TEST SPEC START/,/TEST SPEC END/p')

    if [ -n "$LAST_TEST_SPEC" ]; then
        # Save to spec directory
        TEST_SPEC_DIR="$SPRINT_ARTIFACTS_DIR/test-specs"
        mkdir -p "$TEST_SPEC_DIR"
        echo "$LAST_TEST_SPEC" > "$TEST_SPEC_DIR/${story_id}-test-spec.md"

        # Save to decision log
        if type append_to_decision_log >/dev/null 2>&1; then
            append_to_decision_log "TEST_SPEC" "$story_id" "$LAST_TEST_SPEC"
        fi

        log_success "Test spec phase complete: $story_id"
        log "Saved to: $TEST_SPEC_DIR/${story_id}-test-spec.md"
        return 0
    else
        log_error "Test spec phase did not produce valid output"
        return 1
    fi
}

# =============================================================================
# Test Implementation Phase
# =============================================================================

# Execute test implementation phase
# Creates failing tests from specifications
# Arguments:
#   $1 - story_file path
execute_test_impl_phase() {
    local story_file="$1"
    local story_id=$(basename "$story_file" .md)

    log ">>> TEST IMPL PHASE: $story_id (implementing failing tests)"

    # Check if we have test specs
    if [ -z "$LAST_TEST_SPEC" ]; then
        # Try to load from file
        if [ -f "$TEST_SPEC_DIR/${story_id}-test-spec.md" ]; then
            LAST_TEST_SPEC=$(cat "$TEST_SPEC_DIR/${story_id}-test-spec.md")
        else
            log_error "No test specifications available for $story_id"
            return 1
        fi
    fi

    local story_contents=$(cat "$story_file")

    local impl_prompt="You are a Test Architect (TEA) implementing tests from specifications.

## Your Task

Implement failing tests for: $story_id

The tests MUST FAIL initially because the feature is not yet implemented.
This is Test-First Development (TDD).

### CRITICAL RULES
- Create test files based on the specifications below
- Tests should compile/parse without errors
- Tests should FAIL when run (feature not implemented yet)
- Follow existing test patterns in the codebase
- Use proper fixtures and data factories
- Do NOT implement any feature code

## Test Specifications to Implement

<test-spec>
$LAST_TEST_SPEC
</test-spec>

## Story Context

<story>
$story_contents
</story>

## Exploration Commands

First, examine existing test patterns:
\`\`\`bash
# Find existing test patterns
find . -type f \\( -name \"*.spec.ts\" -o -name \"*.test.ts\" \\) -exec head -50 {} \\; 2>/dev/null | head -100
# Check for test utilities
ls -la test/utils/ tests/helpers/ __tests__/fixtures/ 2>/dev/null || true
\`\`\`

## Implementation Guidelines

1. **File Structure**: Create test files in the appropriate directory
2. **Imports**: Use the project's test framework (jest, mocha, vitest, etc.)
3. **Describe Blocks**: Group tests by acceptance criterion
4. **Test Names**: Include test IDs from specifications
5. **BDD Format**: Use Given-When-Then comments
6. **Assertions**: Write assertions that will FAIL until feature is implemented
7. **Data**: Use factories or fixtures, no hardcoded values

## Example Test Structure

\`\`\`typescript
describe('Feature: <story description>', () => {
  describe('AC1: <acceptance criterion>', () => {
    test('${story_id}-E2E-001: should <expected behavior>', async () => {
      // Given: <precondition>
      const setup = await createTestFixture();

      // When: <action>
      const result = await performAction(setup);

      // Then: <expected outcome>
      expect(result).toBe(expectedValue); // Will FAIL - not implemented
    });
  });
});
\`\`\`

## Completion Signal

After implementing the tests:

1. Stage the test files: git add -A
2. Output JSON result:
\`\`\`json
{
  \"status\": \"COMPLETE\",
  \"story_id\": \"$story_id\",
  \"summary\": \"Implemented N failing tests in M files\",
  \"files_changed\": [\"<test file paths>\"],
  \"tests_added\": <number>
}
\`\`\`

3. Then output: TEST IMPL COMPLETE: $story_id - Implemented N tests"

    if [ "$DRY_RUN" = true ]; then
        echo "[DRY RUN] Would execute test impl phase for $story_id"
        return 0
    fi

    # Pipe to file to avoid memory bloat
    run_claude_to_file "$impl_prompt"
    local result
    result=$(read_phase_tail)

    # Check completion
    local completion_status
    if type check_phase_completion >/dev/null 2>&1; then
        check_phase_completion "$result" "test_gen" "$story_id"
        completion_status=$?
    else
        if echo "$result" | grep -q "TEST IMPL COMPLETE"; then
            completion_status=0
        else
            completion_status=2
        fi
    fi

    case $completion_status in
        0)
            log_success "Test impl phase complete: $story_id"
            return 0
            ;;
        *)
            log_error "Test impl phase did not complete cleanly: $story_id"
            return 1
            ;;
    esac
}

# =============================================================================
# Test Verification Phase
# =============================================================================

# Execute test verification phase
# Verifies that tests fail appropriately (compile but don't pass)
# Arguments:
#   $1 - story_file path
execute_test_verification_phase() {
    local story_file="$1"
    local story_id=$(basename "$story_file" .md)

    log ">>> TEST VERIFICATION PHASE: $story_id (verifying tests fail correctly)"

    if [ "$DRY_RUN" = true ]; then
        echo "[DRY RUN] Would verify tests fail for $story_id"
        return 0
    fi

    # Run tests and expect failures
    local test_output=""
    local test_exit_code=0

    if [ -f "$PROJECT_ROOT/package.json" ]; then
        # Node.js project
        test_output=$(cd "$PROJECT_ROOT" && npm test 2>&1) || test_exit_code=$?
    elif [ -f "$PROJECT_ROOT/Cargo.toml" ]; then
        test_output=$(cd "$PROJECT_ROOT" && cargo test 2>&1) || test_exit_code=$?
    elif [ -f "$PROJECT_ROOT/go.mod" ]; then
        test_output=$(cd "$PROJECT_ROOT" && go test ./... 2>&1) || test_exit_code=$?
    elif [ -f "$PROJECT_ROOT/requirements.txt" ] || [ -f "$PROJECT_ROOT/pyproject.toml" ]; then
        if command -v pytest >/dev/null 2>&1; then
            test_output=$(cd "$PROJECT_ROOT" && pytest 2>&1) || test_exit_code=$?
        fi
    fi

    echo "$test_output" >> "$LOG_FILE"

    # Analyze test output
    # We expect: tests compile, tests run, tests FAIL (exit code non-zero)

    # Check for compilation errors (bad - tests should at least compile)
    if echo "$test_output" | grep -qiE "syntax error|cannot find module|compilation failed|parse error"; then
        log_error "Tests have compilation/syntax errors - fix before proceeding"
        echo "$test_output" | grep -iE "syntax error|cannot find module|compilation failed|parse error" | head -10
        return 1
    fi

    # Check for test failures (good - expected in TDD)
    if [ $test_exit_code -ne 0 ]; then
        # Count failures
        local failure_count=0
        failure_count=$(echo "$test_output" | grep -cE "FAIL|failed|failing" || echo "0")

        if [ "$failure_count" -gt 0 ]; then
            log_success "Test verification passed: $failure_count test(s) failing as expected"
            log "Tests compile and fail appropriately - ready for implementation"
            return 0
        else
            log_warn "Tests exited with error but no clear failures detected"
            return 0  # Proceed anyway - might be framework difference
        fi
    else
        # Tests passed - this is unexpected in TDD before implementation
        log_warn "Tests passed unexpectedly - verify tests are actually testing new functionality"
        log "This may indicate tests are not properly written or feature already exists"
        return 0  # Don't block, but warn
    fi
}

# =============================================================================
# Helper Functions
# =============================================================================

# Get the last test specification for use in other phases
get_last_test_spec() {
    echo "$LAST_TEST_SPEC"
}

# Build test spec context for dev phase prompt
build_test_spec_context_for_dev() {
    local story_id="$1"

    if [ -z "$LAST_TEST_SPEC" ]; then
        # Try to load from file
        if [ -n "$TEST_SPEC_DIR" ] && [ -f "$TEST_SPEC_DIR/${story_id}-test-spec.md" ]; then
            LAST_TEST_SPEC=$(cat "$TEST_SPEC_DIR/${story_id}-test-spec.md")
        fi
    fi

    if [ -z "$LAST_TEST_SPEC" ]; then
        echo ""
        return
    fi

    cat << EOF

## Test Specifications (TDD)

The following tests have been written and are FAILING. Your implementation must make these tests pass.

<test-specifications>
$LAST_TEST_SPEC
</test-specifications>

### TDD Implementation Guidelines

1. Run tests frequently: \`npm test\` (or equivalent)
2. Implement just enough code to make the next test pass
3. Do NOT modify the test files - only implement the feature code
4. All tests in the specification must pass when implementation is complete

EOF
}
