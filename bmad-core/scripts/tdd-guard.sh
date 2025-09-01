#!/bin/bash
# TDD Guard - Validates that code changes follow TDD discipline
# Part of BMAD Framework TDD integration

set -e

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "${SCRIPT_DIR}/../.." && pwd)"
CONFIG_FILE="${PROJECT_ROOT}/bmad-core/core-config.yaml"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Default values
TDD_ENABLED="false"
ALLOW_RED_PHASE_FAILURES="true"
EXIT_CODE=0

# Usage information
usage() {
    cat << EOF
TDD Guard - Validates TDD discipline in code changes

Usage: $0 [options]

Options:
    -h, --help              Show this help message
    -c, --config PATH       Path to BMAD core config file
    -b, --base REF          Base commit/branch for comparison (default: HEAD~1)
    -v, --verbose           Verbose output
    --phase PHASE          Current TDD phase: red|green|refactor
    --ci                   Running in CI mode (affects exit behavior)
    --dry-run              Show what would be checked without failing

Examples:
    $0                      # Check changes against HEAD~1
    $0 --base main          # Check changes against main branch
    $0 --phase green        # Validate green phase rules
    $0 --ci --phase red     # CI mode, red phase (allows failures)

Exit Codes:
    0    No TDD violations found
    1    TDD violations found (in green phase)
    2    Configuration error
    3    Git/repository error
EOF
}

# Logging functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

# Parse command line arguments
BASE_REF="HEAD~1"
VERBOSE=false
TDD_PHASE=""
CI_MODE=false
DRY_RUN=false

while [[ $# -gt 0 ]]; do
    case $1 in
        -h|--help)
            usage
            exit 0
            ;;
        -c|--config)
            CONFIG_FILE="$2"
            shift 2
            ;;
        -b|--base)
            BASE_REF="$2"
            shift 2
            ;;
        -v|--verbose)
            VERBOSE=true
            shift
            ;;
        --phase)
            TDD_PHASE="$2"
            shift 2
            ;;
        --ci)
            CI_MODE=true
            shift
            ;;
        --dry-run)
            DRY_RUN=true
            shift
            ;;
        *)
            log_error "Unknown option: $1"
            usage
            exit 2
            ;;
    esac
done

# Check if we're in a git repository
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    log_error "Not in a git repository"
    exit 3
fi

# Load configuration
load_config() {
    if [[ ! -f "$CONFIG_FILE" ]]; then
        if [[ "$VERBOSE" == true ]]; then
            log_warn "Config file not found: $CONFIG_FILE"
            log_info "Assuming TDD disabled"
        fi
        return 0
    fi
    
    # Extract TDD settings from YAML (basic parsing)
    if command -v yq > /dev/null 2>&1; then
        TDD_ENABLED=$(yq e '.tdd.enabled // false' "$CONFIG_FILE" 2>/dev/null || echo "false")
        ALLOW_RED_PHASE_FAILURES=$(yq e '.tdd.allow_red_phase_ci_failures // true' "$CONFIG_FILE" 2>/dev/null || echo "true")
    else
        # Fallback: basic grep parsing
        if grep -q "tdd:" "$CONFIG_FILE" && grep -A 10 "tdd:" "$CONFIG_FILE" | grep -q "enabled: true"; then
            TDD_ENABLED="true"
        fi
    fi
    
    if [[ "$VERBOSE" == true ]]; then
        log_info "TDD enabled: $TDD_ENABLED"
        log_info "Allow red phase failures: $ALLOW_RED_PHASE_FAILURES"
    fi
}

# Detect TDD phase from commit messages or branch name
detect_tdd_phase() {
    if [[ -n "$TDD_PHASE" ]]; then
        return 0
    fi
    
    # Check recent commit messages for TDD phase indicators
    RECENT_COMMITS=$(git log --oneline -5 "$BASE_REF".."HEAD" 2>/dev/null || echo "")
    
    if echo "$RECENT_COMMITS" | grep -qi "\[RED\]"; then
        TDD_PHASE="red"
    elif echo "$RECENT_COMMITS" | grep -qi "\[GREEN\]"; then
        TDD_PHASE="green"
    elif echo "$RECENT_COMMITS" | grep -qi "\[REFACTOR\]"; then
        TDD_PHASE="refactor"
    else
        # Try to detect from branch name
        BRANCH_NAME=$(git branch --show-current 2>/dev/null || echo "")
        if echo "$BRANCH_NAME" | grep -qi "tdd"; then
            TDD_PHASE="green" # Default assumption
        fi
    fi
    
    if [[ "$VERBOSE" == true ]]; then
        log_info "Detected TDD phase: ${TDD_PHASE:-unknown}"
    fi
}

# Get changed files between base and current
get_changed_files() {
    # Get list of changed files
    CHANGED_FILES=$(git diff --name-only "$BASE_REF"..."HEAD" 2>/dev/null || echo "")
    
    if [[ -z "$CHANGED_FILES" ]]; then
        if [[ "$VERBOSE" == true ]]; then
            log_info "No changed files detected"
        fi
        return 0
    fi
    
    # Separate source and test files
    SOURCE_FILES=""
    TEST_FILES=""
    
    while IFS= read -r file; do
        if [[ -f "$file" ]]; then
            if is_test_file "$file"; then
                TEST_FILES="$TEST_FILES$file"$'\n'
            elif is_source_file "$file"; then
                SOURCE_FILES="$SOURCE_FILES$file"$'\n'
            fi
        fi
    done <<< "$CHANGED_FILES"
    
    if [[ "$VERBOSE" == true ]]; then
        log_info "Source files changed: $(echo "$SOURCE_FILES" | wc -l | tr -d ' ')"
        log_info "Test files changed: $(echo "$TEST_FILES" | wc -l | tr -d ' ')"
    fi
}

# Check if file is a test file
is_test_file() {
    local file="$1"
    # Common test file patterns
    if [[ "$file" =~ \.(test|spec)\.(js|ts|py|go|java|cs)$ ]] || \
       [[ "$file" =~ _test\.(py|go)$ ]] || \
       [[ "$file" =~ Test\.(java|cs)$ ]] || \
       [[ "$file" =~ tests?/ ]] || \
       [[ "$file" =~ spec/ ]]; then
        return 0
    fi
    return 1
}

# Check if file is a source file
is_source_file() {
    local file="$1"
    # Common source file patterns (excluding test files)
    if [[ "$file" =~ \.(js|ts|py|go|java|cs|rb|php|cpp|c|h)$ ]] && ! is_test_file "$file"; then
        return 0
    fi
    return 1
}

# Check if commit message indicates refactoring
is_refactor_commit() {
    local commits=$(git log --oneline "$BASE_REF".."HEAD" 2>/dev/null || echo "")
    if echo "$commits" | grep -qi "\[refactor\]"; then
        return 0
    fi
    return 1
}

# Validate TDD rules
validate_tdd_rules() {
    local violations=0
    
    if [[ -z "$SOURCE_FILES" && -z "$TEST_FILES" ]]; then
        if [[ "$VERBOSE" == true ]]; then
            log_info "No relevant source or test files changed"
        fi
        return 0
    fi
    
    case "$TDD_PHASE" in
        "red")
            # Red phase: Tests should be added/modified, minimal or no source changes
            if [[ -n "$SOURCE_FILES" ]] && [[ -z "$TEST_FILES" ]]; then
                log_warn "RED phase violation: Source code changed without corresponding test changes"
                log_warn "In TDD Red phase, tests should be written first"
                if [[ "$ALLOW_RED_PHASE_FAILURES" == "false" ]] || [[ "$CI_MODE" == "false" ]]; then
                    violations=$((violations + 1))
                fi
            fi
            ;;
            
        "green")
            # Green phase: Source changes must have corresponding test changes
            if [[ -n "$SOURCE_FILES" ]] && [[ -z "$TEST_FILES" ]]; then
                log_error "GREEN phase violation: Source code changed without corresponding tests"
                log_error "In TDD Green phase, implementation should only make existing tests pass"
                log_error "Source files modified:"
                echo "$SOURCE_FILES" | while IFS= read -r file; do
                    [[ -n "$file" ]] && log_error "  - $file"
                done
                violations=$((violations + 1))
            fi
            
            # Check for large changes (potential feature creep)
            if [[ -n "$SOURCE_FILES" ]]; then
                local large_changes=0
                while IFS= read -r file; do
                    if [[ -n "$file" ]] && [[ -f "$file" ]]; then
                        local additions=$(git diff --numstat "$BASE_REF" "$file" | cut -f1)
                        if [[ "$additions" =~ ^[0-9]+$ ]] && [[ "$additions" -gt 50 ]]; then
                            log_warn "Large change detected in $file: $additions lines added"
                            log_warn "Consider smaller, more focused changes in TDD Green phase"
                            large_changes=$((large_changes + 1))
                        fi
                    fi
                done <<< "$SOURCE_FILES"
                
                if [[ "$large_changes" -gt 0 ]]; then
                    log_warn "Consider breaking large changes into smaller TDD cycles"
                fi
            fi
            ;;
            
        "refactor")
            # Refactor phase: Source changes allowed, tests should remain stable
            if is_refactor_commit; then
                if [[ "$VERBOSE" == true ]]; then
                    log_info "Refactor phase: Changes detected with proper [REFACTOR] tag"
                fi
            else
                if [[ -n "$SOURCE_FILES" ]] && [[ -z "$TEST_FILES" ]]; then
                    log_warn "Potential refactor phase: Consider tagging commits with [REFACTOR]"
                fi
            fi
            ;;
            
        *)
            # Unknown or no TDD phase
            if [[ "$TDD_ENABLED" == "true" ]]; then
                log_warn "TDD enabled but phase not detected"
                log_warn "Consider tagging commits with [RED], [GREEN], or [REFACTOR]"
                if [[ -n "$SOURCE_FILES" ]] && [[ -z "$TEST_FILES" ]]; then
                    log_warn "Source changes without test changes - may violate TDD discipline"
                fi
            fi
            ;;
    esac
    
    return $violations
}

# Main execution
main() {
    if [[ "$VERBOSE" == true ]]; then
        log_info "TDD Guard starting..."
        log_info "Base reference: $BASE_REF"
        log_info "Config file: $CONFIG_FILE"
    fi
    
    load_config
    
    if [[ "$TDD_ENABLED" != "true" ]]; then
        if [[ "$VERBOSE" == true ]]; then
            log_info "TDD not enabled, skipping validation"
        fi
        exit 0
    fi
    
    detect_tdd_phase
    get_changed_files
    
    if [[ "$DRY_RUN" == true ]]; then
        log_info "DRY RUN - Would check:"
        log_info "  TDD Phase: ${TDD_PHASE:-unknown}"
        log_info "  Source files: $(echo "$SOURCE_FILES" | grep -c . || echo 0)"
        log_info "  Test files: $(echo "$TEST_FILES" | grep -c . || echo 0)"
        exit 0
    fi
    
    validate_tdd_rules
    local violations=$?
    
    if [[ "$violations" -eq 0 ]]; then
        log_success "TDD validation passed"
        exit 0
    else
        log_error "$violations TDD violation(s) found"
        
        # Provide helpful suggestions
        echo ""
        echo "💡 TDD Suggestions:"
        case "$TDD_PHASE" in
            "green")
                echo "  - Ensure all source changes have corresponding failing tests first"
                echo "  - Consider running QA agent's *write-failing-tests command"
                echo "  - Keep implementation minimal - only make tests pass"
                ;;
            "red")
                echo "  - Write failing tests before implementation"
                echo "  - Use QA agent to create test cases first"
                ;;
            *)
                echo "  - Follow TDD Red-Green-Refactor cycle"
                echo "  - Tag commits with [RED], [GREEN], or [REFACTOR]"
                echo "  - Enable TDD workflow in BMAD configuration"
                ;;
        esac
        echo ""
        
        if [[ "$TDD_PHASE" == "red" ]] && [[ "$ALLOW_RED_PHASE_FAILURES" == "true" ]] && [[ "$CI_MODE" == "true" ]]; then
            log_warn "Red phase violations allowed in CI mode"
            exit 0
        fi
        
        exit 1
    fi
}

# Run main function
main "$@"
