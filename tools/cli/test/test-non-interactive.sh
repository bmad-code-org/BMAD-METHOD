#!/bin/bash
# Test script for non-interactive BMAD installation
# Tests various CLI options and validates installation

set -e  # Exit on error

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../../.." && pwd)"
TEST_DIR="/tmp/bmad-test-$(date +%s)"

echo "🧪 BMAD Non-Interactive Installation Test Suite"
echo "================================================"
echo "Test directory: $TEST_DIR"
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Track test results
TESTS_PASSED=0
TESTS_FAILED=0

# Helper function to run a test
run_test() {
    local test_name="$1"
    local test_dir="$TEST_DIR/$test_name"
    shift

    echo -e "${YELLOW}▶ Running: $test_name${NC}"
    mkdir -p "$test_dir"
    cd "$test_dir"

    if "$@"; then
        echo -e "${GREEN}✓ PASSED: $test_name${NC}"
        TESTS_PASSED=$((TESTS_PASSED + 1))
        return 0
    else
        echo -e "${RED}✗ FAILED: $test_name${NC}"
        TESTS_FAILED=$((TESTS_FAILED + 1))
        return 1
    fi
}

# Helper to verify installation
verify_installation() {
    local dir="$1"
    local expected_agents="$2"  # comma-separated list
    local expected_workflows="$3"  # comma-separated list

    # Check _bmad directory exists
    if [ ! -d "$dir/_bmad" ]; then
        echo "❌ _bmad directory not found"
        return 1
    fi

    # Check manifest exists
    if [ ! -f "$dir/_bmad/_config/manifest.yaml" ]; then
        echo "❌ manifest.yaml not found"
        return 1
    fi

    # Check agents CSV if expected agents provided
    if [ -n "$expected_agents" ]; then
        if [ ! -f "$dir/_bmad/_config/agents.csv" ]; then
            echo "❌ agents.csv not found"
            return 1
        fi

        IFS=',' read -ra AGENTS <<< "$expected_agents"
        for agent in "${AGENTS[@]}"; do
            if ! grep -q "$agent" "$dir/_bmad/_config/agents.csv"; then
                echo "❌ Agent '$agent' not found in agents.csv"
                return 1
            fi
        done
    fi

    # Check workflows CSV if expected workflows provided
    if [ -n "$expected_workflows" ]; then
        if [ ! -f "$dir/_bmad/_config/workflows.csv" ]; then
            echo "❌ workflows.csv not found"
            return 1
        fi

        IFS=',' read -ra WORKFLOWS <<< "$expected_workflows"
        for workflow in "${WORKFLOWS[@]}"; do
            if ! grep -q "$workflow" "$dir/_bmad/_config/workflows.csv"; then
                echo "❌ Workflow '$workflow' not found in workflows.csv"
                return 1
            fi
        done
    fi

    echo "✓ Installation verified"
    return 0
}

# Test 1: Minimal non-interactive installation
run_test "test-01-minimal-install" bash -c "
    node $PROJECT_ROOT/tools/bmad-npx-wrapper.js install -y
    verify_installation . '' ''
"

# Test 2: Non-interactive with custom user name
run_test "test-02-custom-user" bash -c "
    node $PROJECT_ROOT/tools/bmad-npx-wrapper.js install -y --user-name=TestUser
    verify_installation . '' ''
    grep -q 'user_name: TestUser' _bmad/core/config.yaml
"

# Test 3: Selective agent installation
run_test "test-03-selective-agents" bash -c "
    node $PROJECT_ROOT/tools/bmad-npx-wrapper.js install -y --agents=dev,architect
    verify_installation . 'dev,architect' ''
"

# Test 4: Selective workflow installation
run_test "test-04-selective-workflows" bash -c "
    node $PROJECT_ROOT/tools/bmad-npx-wrapper.js install -y --workflows=create-prd,create-tech-spec
    verify_installation . '' 'create-prd,create-tech-spec'
"

# Test 5: Team-based installation (fullstack)
run_test "test-05-team-fullstack" bash -c "
    node $PROJECT_ROOT/tools/bmad-npx-wrapper.js install -y --team=fullstack
    verify_installation . 'analyst,architect,pm,sm,ux-designer' ''
"

# Test 6: Profile-based installation (minimal)
run_test "test-06-profile-minimal" bash -c "
    node $PROJECT_ROOT/tools/bmad-npx-wrapper.js install -y --profile=minimal
    verify_installation . 'dev' 'create-tech-spec,quick-dev'
"

# Test 7: Multiple CLI options
run_test "test-07-multiple-options" bash -c "
    node $PROJECT_ROOT/tools/bmad-npx-wrapper.js install -y \
        --user-name=FullTest \
        --skill-level=advanced \
        --output-folder=.output \
        --agents=dev,architect
    verify_installation . 'dev,architect' ''
    grep -q 'user_name: FullTest' _bmad/core/config.yaml
    grep -q 'user_skill_level: advanced' _bmad/core/config.yaml
"

# Test 8: Manifest tracking
run_test "test-08-manifest-tracking" bash -c "
    node $PROJECT_ROOT/tools/bmad-npx-wrapper.js install -y --agents=dev
    verify_installation . 'dev' ''
    grep -q 'installMode: non-interactive' _bmad/_config/manifest.yaml
    grep -q 'selectedAgents:' _bmad/_config/manifest.yaml
"

# Cleanup
echo ""
echo "🧹 Cleaning up test directory: $TEST_DIR"
rm -rf "$TEST_DIR"

# Summary
echo ""
echo "================================================"
echo "Test Summary"
echo "================================================"
echo -e "${GREEN}Passed: $TESTS_PASSED${NC}"
echo -e "${RED}Failed: $TESTS_FAILED${NC}"
echo ""

if [ $TESTS_FAILED -eq 0 ]; then
    echo -e "${GREEN}✓ All tests passed!${NC}"
    exit 0
else
    echo -e "${RED}✗ Some tests failed${NC}"
    exit 1
fi
