#!/bin/bash
# CLI install smoke E2E test.
# Verifies non-interactive install succeeds in a clean temp project.

set -euo pipefail

echo "========================================"
echo "CLI Install Smoke E2E"
echo "========================================"
echo ""

GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

PASSED=0
FAILED=0

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
TEMP_DIR="$(mktemp -d)"

cleanup() {
  rm -rf "$TEMP_DIR"
}
trap cleanup EXIT

PROJECT_DIR="$TEMP_DIR/e2e-project"
mkdir -p "$PROJECT_DIR"

echo "Test 1: Non-interactive install succeeds and creates BMAD layout"
if OUTPUT=$(node "$REPO_ROOT/tools/cli/bmad-cli.js" install \
  --directory "$PROJECT_DIR" \
  --modules bmm \
  --tools none \
  --yes \
  --user-name "E2E User" \
  --communication-language English \
  --document-output-language English \
  --output-folder _bmad-output 2>&1); then
  if [ -d "$PROJECT_DIR/_bmad" ] && [ -f "$PROJECT_DIR/_bmad/_config/manifest.yaml" ]; then
    if echo "$OUTPUT" | grep -q "clack.box is not a function"; then
      echo -e "${RED}✗${NC} Install output still contains clack.box runtime error"
      FAILED=$((FAILED + 1))
    else
      echo -e "${GREEN}✓${NC} Install succeeded and created expected structure"
      PASSED=$((PASSED + 1))
    fi
  else
    echo -e "${RED}✗${NC} Install completed but expected files were not created"
    FAILED=$((FAILED + 1))
  fi
else
  echo -e "${RED}✗${NC} Install command failed"
  echo "$OUTPUT"
  FAILED=$((FAILED + 1))
fi
echo ""

echo "========================================"
echo "Test Results:"
echo -e "  Passed: ${GREEN}$PASSED${NC}"
echo -e "  Failed: ${RED}$FAILED${NC}"
echo "========================================"

if [ "$FAILED" -eq 0 ]; then
  echo -e "\n${GREEN}✨ CLI install smoke E2E passed!${NC}\n"
  exit 0
fi

echo -e "\n${RED}❌ CLI install smoke E2E failed${NC}\n"
exit 1
