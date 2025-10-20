#!/bin/bash
# CLI Integration Tests for Agent Schema Validator
# Tests the CLI wrapper (tools/validate-agent-schema.js) behavior and error handling
# NOTE: Tests CLI functionality using temporary test fixtures

echo "========================================"
echo "CLI Integration Tests"
echo "========================================"
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

PASSED=0
FAILED=0

# Get the repo root (assuming script is in test/ directory)
REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"

# Create temp directory for test fixtures
TEMP_DIR=$(mktemp -d)
cleanup() {
  rm -rf "$TEMP_DIR"
}
trap cleanup EXIT

# Test 1: CLI fails when no files found (exit 1)
echo "Test 1: CLI fails when no agent files found (should exit 1)"
mkdir -p "$TEMP_DIR/empty/src/core/agents"
OUTPUT=$(node "$REPO_ROOT/tools/validate-agent-schema.js" "$TEMP_DIR/empty" 2>&1)
EXIT_CODE=$?
if [ $EXIT_CODE -eq 1 ] && echo "$OUTPUT" | grep -q "No agent files found"; then
  echo -e "${GREEN}✓${NC} CLI fails correctly when no files found (exit 1)"
  PASSED=$((PASSED + 1))
else
  echo -e "${RED}✗${NC} CLI failed to handle no files properly (exit code: $EXIT_CODE)"
  FAILED=$((FAILED + 1))
fi
echo ""

# Test 2: CLI reports validation errors with exit code 1
echo "Test 2: CLI reports validation errors (should exit 1)"
mkdir -p "$TEMP_DIR/invalid/src/core/agents"
cat > "$TEMP_DIR/invalid/src/core/agents/bad.agent.yaml" << 'EOF'
agent:
  metadata:
    id: bad
    name: Bad
    title: Bad
    icon: 🧪
  persona:
    role: Test
    identity: Test
    communication_style: Test
    principles: []
  menu: []
EOF
OUTPUT=$(node "$REPO_ROOT/tools/validate-agent-schema.js" "$TEMP_DIR/invalid" 2>&1)
EXIT_CODE=$?
if [ $EXIT_CODE -eq 1 ] && echo "$OUTPUT" | grep -q "failed validation"; then
  echo -e "${GREEN}✓${NC} CLI reports errors correctly (exit 1)"
  PASSED=$((PASSED + 1))
else
  echo -e "${RED}✗${NC} CLI failed to report errors (exit code: $EXIT_CODE)"
  FAILED=$((FAILED + 1))
fi
echo ""

# Test 3: CLI discovers and counts agent files correctly
echo "Test 3: CLI discovers and counts agent files"
mkdir -p "$TEMP_DIR/valid/src/core/agents"
cat > "$TEMP_DIR/valid/src/core/agents/test1.agent.yaml" << 'EOF'
agent:
  metadata:
    id: test1
    name: Test1
    title: Test1
    icon: 🧪
  persona:
    role: Test
    identity: Test
    communication_style: Test
    principles: [Test]
  menu:
    - trigger: help
      description: Help
      action: help
EOF
cat > "$TEMP_DIR/valid/src/core/agents/test2.agent.yaml" << 'EOF'
agent:
  metadata:
    id: test2
    name: Test2
    title: Test2
    icon: 🧪
  persona:
    role: Test
    identity: Test
    communication_style: Test
    principles: [Test]
  menu:
    - trigger: help
      description: Help
      action: help
EOF
OUTPUT=$(node "$REPO_ROOT/tools/validate-agent-schema.js" "$TEMP_DIR/valid" 2>&1)
EXIT_CODE=$?
if [ $EXIT_CODE -eq 0 ] && echo "$OUTPUT" | grep -q "Found 2 agent file"; then
  echo -e "${GREEN}✓${NC} CLI discovers and counts files correctly"
  PASSED=$((PASSED + 1))
else
  echo -e "${RED}✗${NC} CLI file discovery failed"
  echo "Output: $OUTPUT"
  FAILED=$((FAILED + 1))
fi
echo ""

# Test 4: CLI provides detailed error messages
echo "Test 4: CLI provides detailed error messages"
OUTPUT=$(node "$REPO_ROOT/tools/validate-agent-schema.js" "$TEMP_DIR/invalid" 2>&1)
if echo "$OUTPUT" | grep -q "Path:" && echo "$OUTPUT" | grep -q "Error:"; then
  echo -e "${GREEN}✓${NC} CLI provides error details (Path and Error)"
  PASSED=$((PASSED + 1))
else
  echo -e "${RED}✗${NC} CLI error details missing"
  FAILED=$((FAILED + 1))
fi
echo ""

# Test 5: CLI validates real BMAD agents (smoke test)
echo "Test 5: CLI validates actual BMAD agents (smoke test)"
OUTPUT=$(node "$REPO_ROOT/tools/validate-agent-schema.js" 2>&1)
EXIT_CODE=$?
if [ $EXIT_CODE -eq 0 ] && echo "$OUTPUT" | grep -qE "Found [0-9]+ agent file"; then
  echo -e "${GREEN}✓${NC} CLI validates real BMAD agents successfully"
  PASSED=$((PASSED + 1))
else
  echo -e "${RED}✗${NC} CLI failed on real BMAD agents (exit code: $EXIT_CODE)"
  FAILED=$((FAILED + 1))
fi
echo ""

# Summary
echo "========================================"
echo "Test Results:"
echo "  Passed: ${GREEN}$PASSED${NC}"
echo "  Failed: ${RED}$FAILED${NC}"
echo "========================================"

if [ $FAILED -eq 0 ]; then
  echo -e "\n${GREEN}✨ All CLI integration tests passed!${NC}\n"
  exit 0
else
  echo -e "\n${RED}❌ Some CLI integration tests failed${NC}\n"
  exit 1
fi
