#!/bin/bash
#
# BMAD Epic Execute - Regression Gate Module
#
# Provides functions to track test baselines and verify no regressions
# occur during epic execution.
#
# Usage: Sourced by epic-execute.sh
#

# =============================================================================
# Regression Gate Variables
# =============================================================================

BASELINE_PASSING_TESTS=0
BASELINE_COVERAGE=0
REGRESSION_INITIALIZED=false

# =============================================================================
# Test Count Extraction (Multi-Framework Support)
# =============================================================================

# Extract test count from test output using multiple patterns
# Supports: Jest, Mocha, Vitest, AVA, TAP, pytest, Go, Rust, and generic formats
# Arguments:
#   $1 - test output string
# Returns: Number of passing tests (echoed)
extract_test_count() {
    local test_output="$1"
    local count=""

    # Method 1: Try JSON output first (most reliable)
    # Jest with --json, Vitest with --reporter=json
    # Note: Use printf and redirect stderr to avoid broken pipe warnings when jq exits early
    if command -v jq >/dev/null 2>&1; then
        # Jest JSON format
        count=$(printf '%s' "$test_output" 2>/dev/null | jq -r '.numPassedTests // empty' 2>/dev/null) || true
        if [ -n "$count" ] && [ "$count" != "null" ] && [ "$count" -gt 0 ] 2>/dev/null; then
            echo "$count"
            return 0
        fi

        # Vitest JSON format (aggregate from testResults)
        count=$(printf '%s' "$test_output" 2>/dev/null | jq -r '[.testResults[]?.assertionResults[]? | select(.status == "passed")] | length // empty' 2>/dev/null) || true
        if [ -n "$count" ] && [ "$count" != "null" ] && [ "$count" -gt 0 ] 2>/dev/null; then
            echo "$count"
            return 0
        fi
    fi

    # Method 2: Pattern matching fallbacks (ordered by specificity)
    local patterns=(
        # Jest standard output: "Tests:  X passed, Y failed"
        'Tests:[[:space:]]+[0-9]+ passed'
        # Mocha: "X passing"
        '[0-9]+ passing'
        # Vitest/Jest verbose: "X passed"
        '[0-9]+ passed'
        # Generic: "X test(s) passed"
        '[0-9]+ tests? passed'
        # TAP format: "# pass  X" or "# pass X"
        '# pass[[:space:]]+[0-9]+'
        # Rust cargo test: "test result: ok. X passed"
        'test result: ok\. [0-9]+ passed'
        # pytest summary: "X passed"
        '[0-9]+ passed'
        # AVA: "X tests passed" or "X test passed"
        '[0-9]+ tests? passed'
    )

    for pattern in "${patterns[@]}"; do
        count=$(echo "$test_output" | grep -oE "$pattern" | grep -oE '[0-9]+' | head -1 2>/dev/null || echo "")
        if [ -n "$count" ] && [ "$count" != "0" ]; then
            echo "$count"
            return 0
        fi
    done

    # Method 3: Count explicit PASS lines (Go test output)
    local pass_count
    pass_count=$(echo "$test_output" | grep -cE '^---[[:space:]]*PASS:' 2>/dev/null || echo "0")
    if [ "$pass_count" -gt 0 ]; then
        echo "$pass_count"
        return 0
    fi

    # Method 4: Count checkmarks (some reporters use unicode checkmarks)
    pass_count=$(echo "$test_output" | grep -cE '^[[:space:]]*[✓✔]' 2>/dev/null || echo "0")
    if [ "$pass_count" -gt 0 ]; then
        echo "$pass_count"
        return 0
    fi

    # Method 5: Count "ok" lines (TAP format)
    pass_count=$(echo "$test_output" | grep -cE '^ok[[:space:]]+[0-9]+' 2>/dev/null || echo "0")
    if [ "$pass_count" -gt 0 ]; then
        echo "$pass_count"
        return 0
    fi

    # No tests found
    echo "0"
}

# =============================================================================
# Regression Gate Functions
# =============================================================================

# Initialize regression baseline before epic starts
# Captures current test count and coverage (if available)
init_regression_baseline() {
    if [ -z "$PROJECT_ROOT" ]; then
        log_warn "Cannot initialize regression baseline: PROJECT_ROOT not set"
        return 1
    fi

    log "Initializing regression baseline..."

    local test_output=""

    # Detect project type and run tests
    if [ -f "$PROJECT_ROOT/package.json" ]; then
        # Node.js/TypeScript project
        if grep -q '"test"' "$PROJECT_ROOT/package.json" 2>/dev/null; then
            log "Capturing baseline test count (Node.js)..."

            # Check if there's a test:json script for better parsing
            if grep -q '"test:json"' "$PROJECT_ROOT/package.json" 2>/dev/null; then
                test_output=$(cd "$PROJECT_ROOT" && npm run test:json 2>&1) || true
            else
                test_output=$(cd "$PROJECT_ROOT" && npm test 2>&1) || true
            fi

            BASELINE_PASSING_TESTS=$(extract_test_count "$test_output")
            log "Baseline passing tests: $BASELINE_PASSING_TESTS"
        fi

        # Capture baseline coverage if available
        if grep -q '"coverage"' "$PROJECT_ROOT/package.json" 2>/dev/null; then
            log "Capturing baseline coverage..."
            local coverage_output
            coverage_output=$(cd "$PROJECT_ROOT" && npm run coverage -- --json 2>/dev/null) || true

            # Try to extract coverage percentage
            if command -v jq >/dev/null 2>&1; then
                BASELINE_COVERAGE=$(echo "$coverage_output" | jq '.total.lines.pct // 0' 2>/dev/null || echo "0")
            fi

            [ "$BASELINE_COVERAGE" != "0" ] && log "Baseline coverage: ${BASELINE_COVERAGE}%"
        fi

    elif [ -f "$PROJECT_ROOT/Cargo.toml" ]; then
        # Rust project
        log "Capturing baseline test count (Rust)..."
        test_output=$(cd "$PROJECT_ROOT" && cargo test 2>&1) || true
        BASELINE_PASSING_TESTS=$(extract_test_count "$test_output")
        log "Baseline passing tests: $BASELINE_PASSING_TESTS"

    elif [ -f "$PROJECT_ROOT/go.mod" ]; then
        # Go project
        log "Capturing baseline test count (Go)..."
        test_output=$(cd "$PROJECT_ROOT" && go test ./... -v 2>&1) || true
        BASELINE_PASSING_TESTS=$(extract_test_count "$test_output")
        log "Baseline passing tests: $BASELINE_PASSING_TESTS"

    elif [ -f "$PROJECT_ROOT/requirements.txt" ] || [ -f "$PROJECT_ROOT/pyproject.toml" ]; then
        # Python project
        if command -v pytest >/dev/null 2>&1; then
            log "Capturing baseline test count (Python)..."
            test_output=$(cd "$PROJECT_ROOT" && pytest -v 2>&1) || true
            BASELINE_PASSING_TESTS=$(extract_test_count "$test_output")
            log "Baseline passing tests: $BASELINE_PASSING_TESTS"
        fi
    fi

    REGRESSION_INITIALIZED=true
    log_success "Regression baseline initialized: $BASELINE_PASSING_TESTS tests"
    return 0
}

# Execute regression gate after a story completes
# Compares current test count against baseline
# Arguments:
#   $1 - story_id
execute_regression_gate() {
    local story_id="$1"

    if [ "$REGRESSION_INITIALIZED" != true ]; then
        log_warn "Regression gate skipped: baseline not initialized"
        return 0
    fi

    log ">>> REGRESSION GATE: $story_id"

    local current_tests=0
    local test_output=""

    # Get current test count based on project type
    if [ -f "$PROJECT_ROOT/package.json" ]; then
        # Check if there's a test:json script for better parsing
        if grep -q '"test:json"' "$PROJECT_ROOT/package.json" 2>/dev/null; then
            test_output=$(cd "$PROJECT_ROOT" && npm run test:json 2>&1) || true
        else
            test_output=$(cd "$PROJECT_ROOT" && npm test 2>&1) || true
        fi
        current_tests=$(extract_test_count "$test_output")

    elif [ -f "$PROJECT_ROOT/Cargo.toml" ]; then
        test_output=$(cd "$PROJECT_ROOT" && cargo test 2>&1) || true
        current_tests=$(extract_test_count "$test_output")

    elif [ -f "$PROJECT_ROOT/go.mod" ]; then
        test_output=$(cd "$PROJECT_ROOT" && go test ./... -v 2>&1) || true
        current_tests=$(extract_test_count "$test_output")

    elif [ -f "$PROJECT_ROOT/requirements.txt" ] || [ -f "$PROJECT_ROOT/pyproject.toml" ]; then
        if command -v pytest >/dev/null 2>&1; then
            test_output=$(cd "$PROJECT_ROOT" && pytest -v 2>&1) || true
            current_tests=$(extract_test_count "$test_output")
        fi
    fi

    # Check for regression
    if [ "$current_tests" -lt "$BASELINE_PASSING_TESTS" ]; then
        log_error "REGRESSION DETECTED: Test count decreased ($BASELINE_PASSING_TESTS -> $current_tests)"
        add_metrics_issue "$story_id" "regression" "Test count decreased from $BASELINE_PASSING_TESTS to $current_tests"
        return 1
    fi

    # Update baseline for next story (allow growth)
    local previous_baseline=$BASELINE_PASSING_TESTS
    BASELINE_PASSING_TESTS=$current_tests

    log_success "Regression gate passed: $current_tests tests (baseline was $previous_baseline)"
    return 0
}
