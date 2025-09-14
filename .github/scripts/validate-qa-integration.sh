#!/bin/bash

# Validate QA Integration Script
# This script checks that all QA integration files are present and valid

echo "🧪 Validating Production QA Integration..."

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Track validation status
VALIDATION_PASSED=true

# Function to check if file exists
check_file() {
    local file=$1
    local description=$2

    if [ -f "$file" ]; then
        echo -e "${GREEN}✓${NC} $description exists: $file"
    else
        echo -e "${RED}✗${NC} $description missing: $file"
        VALIDATION_PASSED=false
    fi
}

# Function to check if string exists in file
check_content() {
    local file=$1
    local search_string=$2
    local description=$3

    if grep -q "$search_string" "$file" 2>/dev/null; then
        echo -e "${GREEN}✓${NC} $description found in $file"
    else
        echo -e "${RED}✗${NC} $description not found in $file"
        VALIDATION_PASSED=false
    fi
}

echo ""
echo "📁 Checking QA Files..."
echo "------------------------"

# Check expansion pack files
check_file "expansion-packs/bmad-production-qa/config.yaml" "Production QA config"
check_file "expansion-packs/bmad-production-qa/agents/qa-test-engineer.md" "QA Test Engineer agent"
check_file "expansion-packs/bmad-production-qa/agents/qa-performance-engineer.md" "Performance Engineer agent"
check_file "expansion-packs/bmad-production-qa/agents/qa-security-engineer.md" "Security Engineer agent"
check_file "expansion-packs/bmad-production-qa/agents/qa-test-lead.md" "QA Test Lead agent"
check_file "expansion-packs/bmad-production-qa/README.md" "Production QA README"

# Check core modifications
check_file "bmad-core/tasks/create-next-story-with-qa.md" "Enhanced story creation task"
check_file "docs/production-qa-guide.md" "Production QA Guide"

echo ""
echo "🔍 Checking Integration Points..."
echo "----------------------------------"

# Check SM agent modifications
check_content "bmad-core/agents/sm.md" "create-next-story-with-qa" "SM agent QA integration"

# Check README enhancements
check_content "README.md" "Production QA" "README QA section"
check_content "README.md" "production-qa-guide.md" "README QA guide link"

# Check workflows
check_file "expansion-packs/bmad-production-qa/workflows/production-qa-cycle.yaml" "Production QA workflow"

# Check tasks
check_file "expansion-packs/bmad-production-qa/tasks/create-e2e-test-suite.md" "E2E test creation task"
check_file "expansion-packs/bmad-production-qa/tasks/setup-testing-framework.md" "Testing framework setup"

echo ""
echo "📊 Validation Summary"
echo "--------------------"

if [ "$VALIDATION_PASSED" = true ]; then
    echo -e "${GREEN}✅ All QA integration checks passed!${NC}"
    echo "Production QA is properly integrated with BMAD."
    exit 0
else
    echo -e "${RED}❌ Some QA integration checks failed!${NC}"
    echo "Please review the missing components above."
    exit 1
fi