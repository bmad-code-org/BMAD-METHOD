#!/bin/bash
#
# BMAD UAT Validate - Automated UAT Scenario Execution with Self-Healing Fix Loop
#
# Usage: ./uat-validate.sh <epic-id> [options]
#
# Options:
#   --gate-mode=MODE    Validation mode: quick|full|skip (default: quick)
#   --max-retries=N     Max fix attempts before halt (default: 2)
#   --skip-manual       Skip manual-only scenarios (default: skip)
#   --verbose           Show detailed output
#   --dry-run           Show what would be executed without running
#   --timeout=SECONDS   Timeout per scenario (default: 30)
#
# Exit Codes:
#   0 - UAT PASS (all automatable scenarios passed)
#   1 - UAT FAIL (fixable, retries remain or self-heal succeeded)
#   2 - UAT FAIL (max retries exceeded)
#

set -e

# Allow nested Claude Code sessions (when launched from within Claude Code)
unset CLAUDECODE 2>/dev/null || true

# =============================================================================
# Section 1: Configuration
# =============================================================================

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
BMAD_DIR="$PROJECT_ROOT/.bmad"

UAT_DIR="$PROJECT_ROOT/docs/uat"
SPRINT_ARTIFACTS_DIR="$PROJECT_ROOT/docs/sprint-artifacts"
METRICS_DIR="$SPRINT_ARTIFACTS_DIR/metrics"
FIX_DIR="$SPRINT_ARTIFACTS_DIR/uat-fixes"
STORIES_DIR="$PROJECT_ROOT/docs/stories"

LOG_FILE="/tmp/bmad-uat-validate-$$.log"

# Default configuration
UAT_GATE_MODE="quick"
MAX_RETRIES=2
SKIP_MANUAL=true
VERBOSE=false
DRY_RUN=false
TIMEOUT_SECONDS=30

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m' # No Color

# =============================================================================
# Section 2: Helper Functions
# =============================================================================

log() {
    echo -e "${BLUE}[UAT]${NC} $1"
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" >> "$LOG_FILE"
}

log_success() {
    echo -e "${GREEN}[PASS]${NC} $1"
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] [PASS] $1" >> "$LOG_FILE"
}

log_error() {
    echo -e "${RED}[FAIL]${NC} $1"
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] [FAIL] $1" >> "$LOG_FILE"
}

log_warn() {
    echo -e "${YELLOW}[!]${NC} $1"
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] [WARN] $1" >> "$LOG_FILE"
}

log_section() {
    echo ""
    echo -e "${BOLD}───────────────────────────────────────────────────────────${NC}"
    echo -e "${BOLD}  $1${NC}"
    echo -e "${BOLD}───────────────────────────────────────────────────────────${NC}"
}

log_header() {
    echo ""
    echo -e "${CYAN}${BOLD}═══════════════════════════════════════════════════════════${NC}"
    echo -e "${CYAN}${BOLD}  $1${NC}"
    echo -e "${CYAN}${BOLD}═══════════════════════════════════════════════════════════${NC}"
    echo ""
}

# =============================================================================
# Section 3: Argument Parsing
# =============================================================================

EPIC_ID=""

while [[ $# -gt 0 ]]; do
    case $1 in
        --gate-mode=*)
            UAT_GATE_MODE="${1#*=}"
            shift
            ;;
        --max-retries=*)
            MAX_RETRIES="${1#*=}"
            shift
            ;;
        --skip-manual)
            SKIP_MANUAL=true
            shift
            ;;
        --include-manual)
            SKIP_MANUAL=false
            shift
            ;;
        --verbose)
            VERBOSE=true
            shift
            ;;
        --dry-run)
            DRY_RUN=true
            shift
            ;;
        --timeout=*)
            TIMEOUT_SECONDS="${1#*=}"
            shift
            ;;
        -*)
            echo "Unknown option: $1"
            exit 1
            ;;
        *)
            EPIC_ID="$1"
            shift
            ;;
    esac
done

if [ -z "$EPIC_ID" ]; then
    echo "Usage: $0 <epic-id> [options]"
    echo ""
    echo "Options:"
    echo "  --gate-mode=MODE    Validation mode: quick|full|skip (default: quick)"
    echo "  --max-retries=N     Max fix attempts before halt (default: 2)"
    echo "  --skip-manual       Skip manual-only scenarios (default)"
    echo "  --include-manual    Include manual scenarios in checklist"
    echo "  --verbose           Detailed output"
    echo "  --dry-run           Show what would be executed"
    echo "  --timeout=SECONDS   Timeout per scenario (default: 30)"
    echo ""
    echo "Exit Codes:"
    echo "  0 - UAT PASS"
    echo "  1 - UAT FAIL (fixable)"
    echo "  2 - UAT FAIL (max retries exceeded)"
    exit 1
fi

# Validate gate mode
if [[ ! "$UAT_GATE_MODE" =~ ^(quick|full|skip)$ ]]; then
    echo "Invalid gate mode: $UAT_GATE_MODE"
    echo "Valid modes: quick, full, skip"
    exit 1
fi

# =============================================================================
# Section 4: UAT Document Loading
# =============================================================================

load_uat_document() {
    local epic_id="$1"

    # Find UAT document (try multiple patterns)
    UAT_FILE=""
    for pattern in "epic-${epic_id}-uat.md" "epic-0${epic_id}-uat.md" "${epic_id}-uat.md"; do
        found=$(find "$UAT_DIR" -name "$pattern" 2>/dev/null | head -1)
        if [ -n "$found" ]; then
            UAT_FILE="$found"
            break
        fi
    done

    if [ -z "$UAT_FILE" ] || [ ! -f "$UAT_FILE" ]; then
        log_error "UAT document not found for Epic $epic_id"
        log_error "Searched in: $UAT_DIR"
        log_error "Expected: epic-${epic_id}-uat.md"
        return 1
    fi

    log "Found UAT document: $UAT_FILE"

    # Validate structure - check for scenarios section
    if ! grep -qE "^##.*[Ss]cenario|^##.*[Tt]est|^##.*[Cc]riteria" "$UAT_FILE"; then
        log_warn "UAT document may not have standard scenario sections"
    fi

    # Count scenario blocks (lines starting with ### or numbered items under Test Scenarios)
    SCENARIO_COUNT=$(grep -cE "^###|^[0-9]+\." "$UAT_FILE" 2>/dev/null || echo "0")
    log "Found approximately $SCENARIO_COUNT scenario entries"

    return 0
}

# =============================================================================
# Section 5: Scenario Classification
# =============================================================================

# Arrays to store classified scenarios
declare -a AUTOMATABLE_SCENARIOS
declare -a SEMI_AUTO_SCENARIOS
declare -a MANUAL_SCENARIOS

classify_scenarios() {
    local uat_file="$1"

    # Reset arrays
    AUTOMATABLE_SCENARIOS=()
    SEMI_AUTO_SCENARIOS=()
    MANUAL_SCENARIOS=()

    # Read the UAT file and extract scenario blocks
    local current_scenario=""
    local current_name=""
    local in_scenario=false
    local scenario_num=0

    while IFS= read -r line; do
        # Detect scenario headers (### or numbered items)
        if [[ "$line" =~ ^###[[:space:]]*(.*) ]] || [[ "$line" =~ ^([0-9]+)\.[[:space:]]+(.*) ]]; then
            # Save previous scenario if exists
            if [ -n "$current_scenario" ]; then
                classify_single_scenario "$scenario_num" "$current_name" "$current_scenario"
            fi

            # Start new scenario
            ((scenario_num++))
            if [[ "$line" =~ ^###[[:space:]]*(.*) ]]; then
                current_name="${BASH_REMATCH[1]}"
            else
                current_name="${BASH_REMATCH[2]}"
            fi
            current_scenario="$line"
            in_scenario=true
        elif [ "$in_scenario" = true ]; then
            # Continue accumulating scenario content
            current_scenario+=$'\n'"$line"
        fi
    done < "$uat_file"

    # Handle last scenario
    if [ -n "$current_scenario" ]; then
        classify_single_scenario "$scenario_num" "$current_name" "$current_scenario"
    fi

    log "Classification complete:"
    log "  Automatable: ${#AUTOMATABLE_SCENARIOS[@]}"
    log "  Semi-auto:   ${#SEMI_AUTO_SCENARIOS[@]}"
    log "  Manual:      ${#MANUAL_SCENARIOS[@]}"
}

classify_single_scenario() {
    local id="$1"
    local name="$2"
    local content="$3"

    # Check for automatable indicators
    if echo "$content" | grep -qiE 'npx|npm run|yarn|node |curl |wget |pytest|jest|vitest|--version|/health|/api/|exit code|returns [0-9]|\.sh |bash '; then
        # Extract command from code block if present
        local cmd=""
        cmd=$(echo "$content" | grep -oE '`[^`]+`' | head -1 | tr -d '`')
        if [ -z "$cmd" ]; then
            cmd=$(echo "$content" | grep -oE 'npx [a-zA-Z0-9_-]+.*|npm run [a-zA-Z0-9_:-]+.*|curl [^[:space:]]+.*' | head -1)
        fi
        AUTOMATABLE_SCENARIOS+=("$id|$name|$cmd")
        [ "$VERBOSE" = true ] && log "  [AUTO] Scenario $id: $name"

    # Check for semi-automated indicators
    elif echo "$content" | grep -qiE 'test-send|email|inbox|check your|verify.*manually|setup.*first|start.*server'; then
        SEMI_AUTO_SCENARIOS+=("$id|$name|")
        [ "$VERBOSE" = true ] && log "  [SEMI] Scenario $id: $name"

    # Everything else is manual
    else
        MANUAL_SCENARIOS+=("$id|$name|")
        [ "$VERBOSE" = true ] && log "  [MANUAL] Scenario $id: $name"
    fi
}

# =============================================================================
# Section 5.5: Human Intervention Detection
# =============================================================================

# Arrays to store human intervention items
declare -a HUMAN_INTERVENTION_BLOCKING
declare -a HUMAN_INTERVENTION_WARNING

# Patterns that indicate human intervention is required
BLOCKING_PATTERNS=(
    "EACCES|permission denied"
    "\.env|environment variable|not set|undefined|not defined"
    "API[_-]?KEY|SECRET|TOKEN.*required|missing|invalid"
    "authentication failed|unauthorized|401|403"
    "license|subscription|quota exceeded"
    "EPERM|operation not permitted"
    "credentials.*required|credentials.*missing"
)

WARNING_PATTERNS=(
    "connection refused|ECONNREFUSED|ETIMEDOUT|timeout"
    "check.*inbox|verify.*email|manual.*verification"
    "relation.*does not exist|migration|table.*not found"
    "deprecated|warning:"
    "rate limit|throttl"
    "service unavailable|503"
    "could not connect|connection failed"
)

detect_human_intervention() {
    local error_output="$1"
    local scenario_id="$2"
    local scenario_name="$3"

    # Check for BLOCKING patterns
    for pattern in "${BLOCKING_PATTERNS[@]}"; do
        if echo "$error_output" | grep -qiE "$pattern"; then
            local matched_line
            matched_line=$(echo "$error_output" | grep -iE "$pattern" | head -1)
            HUMAN_INTERVENTION_BLOCKING+=("$scenario_id|$scenario_name|$matched_line")
            [ "$VERBOSE" = true ] && log_warn "  [BLOCKING] Detected: $matched_line"
        fi
    done

    # Check for WARNING patterns
    for pattern in "${WARNING_PATTERNS[@]}"; do
        if echo "$error_output" | grep -qiE "$pattern"; then
            local matched_line
            matched_line=$(echo "$error_output" | grep -iE "$pattern" | head -1)
            HUMAN_INTERVENTION_WARNING+=("$scenario_id|$scenario_name|$matched_line")
            [ "$VERBOSE" = true ] && log_warn "  [WARNING] Detected: $matched_line"
        fi
    done
}

analyze_root_cause() {
    local error_output="$1"
    local exit_code="$2"

    # Analyze error patterns and return a hint
    if echo "$error_output" | grep -qiE "\.env|environment variable|not set"; then
        echo "Missing environment configuration. Check .env file or .env.example for required variables."
    elif echo "$error_output" | grep -qiE "API[_-]?KEY|SECRET|TOKEN"; then
        echo "Missing or invalid API credentials. Verify API keys are correctly configured."
    elif echo "$error_output" | grep -qiE "connection refused|ECONNREFUSED"; then
        echo "Service connection failed. Ensure the required service is running (database, redis, etc.)."
    elif echo "$error_output" | grep -qiE "relation.*does not exist|table.*not found"; then
        echo "Database schema issue. Run migrations or check database setup."
    elif echo "$error_output" | grep -qiE "permission denied|EACCES|EPERM"; then
        echo "Permission issue. Check file/directory permissions or run with appropriate privileges."
    elif echo "$error_output" | grep -qiE "timeout|ETIMEDOUT"; then
        echo "Operation timed out. Check network connectivity or increase timeout."
    elif [ "$exit_code" -eq 1 ]; then
        echo "Command failed with exit code 1. Check the error output for specific details."
    elif [ "$exit_code" -eq 124 ]; then
        echo "Command timed out. Consider increasing timeout or checking for blocking operations."
    else
        echo "Analyze error output above. Exit code: $exit_code"
    fi
}

# =============================================================================
# Section 5.6: Story Context Extraction
# =============================================================================

extract_story_context() {
    local epic_id="$1"
    local output_file="$2"

    log "Extracting story context for Epic $epic_id..."

    # Find story files for this epic
    local story_files=()
    for pattern in "${epic_id}-" "epic-${epic_id}-" "0${epic_id}-"; do
        while IFS= read -r -d '' file; do
            story_files+=("$file")
        done < <(find "$STORIES_DIR" -name "${pattern}*.md" -print0 2>/dev/null)
    done

    if [ ${#story_files[@]} -eq 0 ]; then
        log_warn "No story files found for Epic $epic_id in $STORIES_DIR"
        echo "No story files found for this epic." >> "$output_file"
        return 1
    fi

    log "Found ${#story_files[@]} story file(s)"

    echo "## Story Context" >> "$output_file"
    echo "" >> "$output_file"

    for story_file in "${story_files[@]}"; do
        local story_name
        story_name=$(basename "$story_file" .md)

        echo "### $story_name" >> "$output_file"
        echo "" >> "$output_file"

        # Extract acceptance criteria section
        local in_ac_section=false
        local ac_content=""
        while IFS= read -r line; do
            # Detect start of acceptance criteria section
            if echo "$line" | grep -qiE "^##.*[Aa]cceptance [Cc]riteria|^##.*AC"; then
                in_ac_section=true
                ac_content="**Acceptance Criteria:**"$'\n'
                continue
            fi
            # Detect end of section (next ## header)
            if [ "$in_ac_section" = true ] && echo "$line" | grep -qE "^##[^#]"; then
                in_ac_section=false
            fi
            # Accumulate content
            if [ "$in_ac_section" = true ]; then
                ac_content+="$line"$'\n'
            fi
        done < "$story_file"

        if [ -n "$ac_content" ]; then
            echo "$ac_content" >> "$output_file"
        else
            echo "*No acceptance criteria section found in this story.*" >> "$output_file"
        fi
        echo "" >> "$output_file"

        # Extract Dev Agent Record section (implementation notes)
        local in_dar_section=false
        local dar_content=""
        while IFS= read -r line; do
            # Detect start of Dev Agent Record section
            if echo "$line" | grep -qiE "^##.*[Dd]ev [Aa]gent [Rr]ecord|^##.*Implementation [Nn]otes"; then
                in_dar_section=true
                dar_content="**Dev Agent Record (Implementation Notes):**"$'\n'
                continue
            fi
            # Detect end of section (next ## header)
            if [ "$in_dar_section" = true ] && echo "$line" | grep -qE "^##[^#]"; then
                in_dar_section=false
            fi
            # Accumulate content
            if [ "$in_dar_section" = true ]; then
                dar_content+="$line"$'\n'
            fi
        done < "$story_file"

        if [ -n "$dar_content" ]; then
            echo "$dar_content" >> "$output_file"
        fi
        echo "" >> "$output_file"
        echo "---" >> "$output_file"
        echo "" >> "$output_file"
    done

    return 0
}

# =============================================================================
# Section 6: Scenario Execution
# =============================================================================

# Arrays to store results
declare -a PASSED_SCENARIOS
declare -a FAILED_SCENARIOS
declare -a FAILED_DETAILS

execute_scenarios() {
    local gate_mode="$1"

    # Reset results
    PASSED_SCENARIOS=()
    FAILED_SCENARIOS=()
    FAILED_DETAILS=()

    # Skip mode - pass automatically
    if [ "$gate_mode" = "skip" ]; then
        log "Gate mode: skip - bypassing scenario execution"
        echo "UAT_GATE_RESULT: PASS"
        echo "UAT_SCENARIOS_PASSED: 0/0 (skipped)"
        return 0
    fi

    # Select scenarios based on gate mode
    local scenarios_to_run=()
    if [ "$gate_mode" = "quick" ]; then
        scenarios_to_run=("${AUTOMATABLE_SCENARIOS[@]}")
    elif [ "$gate_mode" = "full" ]; then
        scenarios_to_run=("${AUTOMATABLE_SCENARIOS[@]}" "${SEMI_AUTO_SCENARIOS[@]}")
    fi

    if [ ${#scenarios_to_run[@]} -eq 0 ]; then
        log_warn "No automatable scenarios found - gate passes by default"
        echo "UAT_GATE_RESULT: PASS"
        echo "UAT_SCENARIOS_PASSED: 0/0 (none automatable)"
        return 0
    fi

    log_section "Executing ${#scenarios_to_run[@]} Scenarios"

    for scenario_entry in "${scenarios_to_run[@]}"; do
        IFS='|' read -r scenario_id scenario_name scenario_cmd <<< "$scenario_entry"

        execute_single_scenario "$scenario_id" "$scenario_name" "$scenario_cmd"
    done

    # Report results
    local total=${#scenarios_to_run[@]}
    local passed=${#PASSED_SCENARIOS[@]}
    local failed=${#FAILED_SCENARIOS[@]}

    echo ""
    log "Results: $passed/$total passed"

    if [ $failed -eq 0 ]; then
        return 0
    else
        return 1
    fi
}

execute_single_scenario() {
    local scenario_id="$1"
    local scenario_name="$2"
    local scenario_cmd="$3"

    echo ""
    log "Scenario $scenario_id: $scenario_name"

    # If no command extracted, try to infer from name
    if [ -z "$scenario_cmd" ]; then
        log_warn "  No command detected - marking as manual verification needed"
        FAILED_SCENARIOS+=("$scenario_id")
        FAILED_DETAILS+=("$scenario_id|$scenario_name|No automatable command found|manual|1")
        return 1
    fi

    if [ "$VERBOSE" = true ]; then
        log "  Command: $scenario_cmd"
    fi

    if [ "$DRY_RUN" = true ]; then
        echo "  [DRY RUN] Would execute: $scenario_cmd"
        PASSED_SCENARIOS+=("$scenario_id")
        return 0
    fi

    # Execute with timeout
    local start_time=$(date +%s%N)
    local output=""
    local exit_code=0
    local stderr_file="/tmp/uat-stderr-$$.txt"

    # Run command with timeout
    set +e
    if command -v timeout >/dev/null 2>&1; then
        output=$(timeout "$TIMEOUT_SECONDS" bash -c "$scenario_cmd" 2>"$stderr_file")
        exit_code=$?
        # timeout returns 124 on timeout
        if [ $exit_code -eq 124 ]; then
            exit_code=124
        fi
    else
        # macOS fallback using perl
        output=$(perl -e 'alarm shift @ARGV; exec @ARGV' "$TIMEOUT_SECONDS" bash -c "$scenario_cmd" 2>"$stderr_file")
        exit_code=$?
    fi
    set -e

    local end_time=$(date +%s%N)
    local duration_ms=$(( (end_time - start_time) / 1000000 ))

    local stderr=""
    [ -f "$stderr_file" ] && stderr=$(cat "$stderr_file")
    rm -f "$stderr_file"

    # Evaluate result
    if [ $exit_code -eq 0 ]; then
        log_success "  Scenario $scenario_id: PASS (${duration_ms}ms)"
        PASSED_SCENARIOS+=("$scenario_id")
        echo "[$(date '+%Y-%m-%d %H:%M:%S')] Scenario $scenario_id PASS: $scenario_cmd" >> "$LOG_FILE"
    elif [ $exit_code -eq 124 ]; then
        log_error "  Scenario $scenario_id: FAIL (timeout after ${TIMEOUT_SECONDS}s)"
        FAILED_SCENARIOS+=("$scenario_id")
        FAILED_DETAILS+=("$scenario_id|$scenario_name|$scenario_cmd|timeout|$exit_code|$output|$stderr")
        # Detect human intervention needs from output
        detect_human_intervention "$output$stderr" "$scenario_id" "$scenario_name"
    else
        log_error "  Scenario $scenario_id: FAIL (exit code $exit_code)"
        if [ -n "$stderr" ] && [ "$VERBOSE" = true ]; then
            echo "    Error: $stderr"
        fi
        FAILED_SCENARIOS+=("$scenario_id")
        FAILED_DETAILS+=("$scenario_id|$scenario_name|$scenario_cmd|error|$exit_code|$output|$stderr")
        # Detect human intervention needs from error output
        detect_human_intervention "$output$stderr" "$scenario_id" "$scenario_name"
    fi

    return $exit_code
}

# =============================================================================
# Section 7: Gate Evaluation
# =============================================================================

evaluate_gate() {
    local total=${#AUTOMATABLE_SCENARIOS[@]}
    local passed=${#PASSED_SCENARIOS[@]}
    local failed=${#FAILED_SCENARIOS[@]}

    log_section "Gate Evaluation"

    if [ $failed -eq 0 ]; then
        log_success "All automatable scenarios passed"
        return 0
    else
        log_error "$failed scenario(s) failed"
        return 1
    fi
}

# =============================================================================
# Section 8: Self-Healing Loop
# =============================================================================

generate_fix_context() {
    local epic_id="$1"
    local attempt="$2"

    mkdir -p "$FIX_DIR"

    local fix_file="$FIX_DIR/epic-${epic_id}-fix-context-${attempt}.md"
    local timestamp=$(date -u +"%Y-%m-%dT%H:%M:%SZ")

    # Find template
    local template="$PROJECT_ROOT/src/bmm/workflows/5-validation/uat-validate/uat-fix-context-template.md"

    if [ -f "$template" ]; then
        # Render template with basic variable substitution
        sed -e "s/{epic_id}/$epic_id/g" \
            -e "s/{attempt}/$attempt/g" \
            -e "s/{timestamp}/$timestamp/g" \
            -e "s/{max_retries}/$MAX_RETRIES/g" \
            -e "s/{next_attempt}/$((attempt + 1))/g" \
            -e "s/{failure_count}/${#FAILED_SCENARIOS[@]}/g" \
            -e "s|{uat_doc_path}|$UAT_FILE|g" \
            "$template" > "$fix_file"
    else
        # Create minimal fix context without template
        cat > "$fix_file" << EOF
# UAT Fix Context - Epic $epic_id (Attempt $attempt)

**Generated:** $timestamp
**Epic:** $epic_id
**Gate Result:** FAIL (${#PASSED_SCENARIOS[@]}/${#AUTOMATABLE_SCENARIOS[@]} scenarios passed)

---

## Summary

This document contains the context needed to fix UAT failures for Epic $epic_id.

**Failures to fix:** ${#FAILED_SCENARIOS[@]}
**Fix attempt:** $attempt of $MAX_RETRIES

---

EOF
    fi

    # Add human intervention section
    echo "" >> "$fix_file"
    echo "## Human Intervention Items" >> "$fix_file"
    echo "" >> "$fix_file"

    if [ ${#HUMAN_INTERVENTION_BLOCKING[@]} -gt 0 ]; then
        echo "### BLOCKING (likely requires human action)" >> "$fix_file"
        echo "" >> "$fix_file"
        for item in "${HUMAN_INTERVENTION_BLOCKING[@]}"; do
            IFS='|' read -r scenario_id scenario_name matched_line <<< "$item"
            echo "- [ ] **Scenario $scenario_id ($scenario_name):** $matched_line" >> "$fix_file"
        done
        echo "" >> "$fix_file"
    fi

    if [ ${#HUMAN_INTERVENTION_WARNING[@]} -gt 0 ]; then
        echo "### WARNING (may need attention)" >> "$fix_file"
        echo "" >> "$fix_file"
        for item in "${HUMAN_INTERVENTION_WARNING[@]}"; do
            IFS='|' read -r scenario_id scenario_name matched_line <<< "$item"
            echo "- [ ] **Scenario $scenario_id ($scenario_name):** $matched_line" >> "$fix_file"
        done
        echo "" >> "$fix_file"
    fi

    if [ ${#HUMAN_INTERVENTION_BLOCKING[@]} -eq 0 ] && [ ${#HUMAN_INTERVENTION_WARNING[@]} -eq 0 ]; then
        echo "*No human intervention items detected. All failures appear to be code-fixable.*" >> "$fix_file"
        echo "" >> "$fix_file"
    fi

    echo "**Instructions for Barry:** Attempt to fix what you can. For items you cannot resolve programmatically, document them clearly in the fix commit message and update the human-actions file." >> "$fix_file"
    echo "" >> "$fix_file"
    echo "---" >> "$fix_file"

    # Append failed scenarios details with root cause hints
    echo "" >> "$fix_file"
    echo "## Failed Scenarios" >> "$fix_file"
    echo "" >> "$fix_file"

    for detail in "${FAILED_DETAILS[@]}"; do
        IFS='|' read -r scenario_id scenario_name cmd error_type exit_code output stderr <<< "$detail"

        # Generate root cause hint for this failure
        local root_cause_hint
        root_cause_hint=$(analyze_root_cause "$output$stderr" "$exit_code")

        cat >> "$fix_file" << EOF
### Scenario $scenario_id: $scenario_name

**Command Executed:**
\`\`\`bash
$cmd
\`\`\`

**Error Type:** $error_type
**Exit Code:** $exit_code

**Output:**
\`\`\`
$output
\`\`\`

**Error Output:**
\`\`\`
$stderr
\`\`\`

**Root Cause Hint:** $root_cause_hint

---

EOF
    done

    # Extract and append story context (acceptance criteria + dev agent record)
    echo "" >> "$fix_file"
    extract_story_context "$epic_id" "$fix_file"

    # Add context references section
    cat >> "$fix_file" << EOF

## Context References

The following files provide additional context for fixing these failures:

| File | Purpose |
|------|---------|
| \`$UAT_FILE\` | Full UAT document with all scenarios |
| \`$STORIES_DIR/${epic_id}-*\` | Story files with acceptance criteria |
| \`$METRICS_DIR/epic-${epic_id}-metrics.yaml\` | Execution metrics |

## Fix Instructions

Address the failures above in priority order. For each fix:

1. **Analyze** - Understand why the scenario failed
2. **Locate** - Find the relevant code files
3. **Fix** - Implement the minimum change to resolve the failure
4. **Verify** - Run the scenario command locally to confirm fix
5. **Commit** - Use message format: \`fix(epic-$epic_id): {description}\`

### Constraints

- Only fix the identified failures - do not refactor unrelated code
- Run the specific failing commands to verify each fix
- Run project tests after all fixes: \`npm test\`
- If a fix requires changes that would break other scenarios, document the tradeoff

## After Fixing

Once all fixes are committed, the UAT validation will automatically re-run.

- **If all pass:** Epic continues to next phase
- **If failures remain:** Another fix context will be generated (attempt $((attempt + 1)))
- **If max retries exceeded:** Chain halts for human intervention

---

*Generated by UAT Validate Workflow*
*BMAD Method - Epic Chain Self-Healing*
*Fix Context: epic-${epic_id}-fix-context-${attempt}.md*
EOF

    log "Fix context generated: $fix_file"
    echo "$fix_file"
}

run_quick_dev_fix() {
    local fix_context_file="$1"
    local epic_id="$2"
    local attempt="$3"

    log "Spawning quick-dev fix session (attempt $attempt/$MAX_RETRIES)"

    # Build human intervention summary for prompt
    local human_intervention_note=""
    if [ ${#HUMAN_INTERVENTION_BLOCKING[@]} -gt 0 ] || [ ${#HUMAN_INTERVENTION_WARNING[@]} -gt 0 ]; then
        human_intervention_note="
IMPORTANT: Some failures may require human intervention (marked in the fix context).
- For items you CANNOT fix programmatically (missing API keys, .env configuration, etc.):
  Document them clearly and proceed with what you CAN fix.
- Do NOT attempt to create fake credentials or placeholder values.
- Focus on code-level fixes that don't require external configuration."
    fi

    local fix_prompt="You are Barry, the Quick Flow Solo Dev.

FIRST: Read the fix context document at:
$fix_context_file

This document contains:
1. Human Intervention Items - issues that may require human action
2. Failed Scenarios - with commands, errors, and root cause hints
3. Story Context - acceptance criteria and implementation notes from the original stories

Your task:
1. Read the fix context document completely before starting
2. Review the Human Intervention Items section - note which issues you CAN vs CANNOT fix
3. For each failed scenario:
   a. Check the root cause hint
   b. Review the related acceptance criteria
   c. Implement targeted fixes for code-level issues
4. Run the failing commands to verify your fixes work
5. Stage changes: git add -A
6. Commit with message: fix(epic-${epic_id}): UAT fix #${attempt} - {brief description}
$human_intervention_note
Constraints:
- Only fix the identified failures - do not refactor unrelated code
- Run the specific failing commands to verify each fix
- Run project tests after all fixes: npm test
- If a fix requires external configuration (API keys, .env), document it but don't block on it

When done, output exactly:
FIX_COMPLETE: {number_fixed}/${#FAILED_SCENARIOS[@]}
HUMAN_ACTION_NEEDED: {yes/no}"

    if [ "$DRY_RUN" = true ]; then
        echo "[DRY RUN] Would spawn Claude for fixes with prompt:"
        echo "  Fix context: $fix_context_file"
        return 0
    fi

    # Execute in isolated context
    local result
    result=$(claude --dangerously-skip-permissions -p "$fix_prompt" 2>&1) || true

    echo "$result" >> "$LOG_FILE"

    if echo "$result" | grep -q "FIX_COMPLETE"; then
        log_success "Quick-dev fix session completed"
        # Check if human action was flagged
        if echo "$result" | grep -q "HUMAN_ACTION_NEEDED: yes"; then
            log_warn "Barry indicated human action is needed for some issues"
        fi
        return 0
    else
        log_warn "Quick-dev fix session may not have completed cleanly"
        return 1
    fi
}

generate_human_actions_file() {
    local epic_id="$1"
    local final_attempt="$2"

    local human_actions_file="$FIX_DIR/epic-${epic_id}-human-actions.md"
    local timestamp=$(date -u +"%Y-%m-%dT%H:%M:%SZ")

    # Only generate if there are human intervention items
    if [ ${#HUMAN_INTERVENTION_BLOCKING[@]} -eq 0 ] && [ ${#HUMAN_INTERVENTION_WARNING[@]} -eq 0 ]; then
        log "No human actions required"
        return 0
    fi

    log "Generating human actions file: $human_actions_file"

    cat > "$human_actions_file" << EOF
# Human Actions Required - Epic $epic_id

**Generated:** $timestamp
**After:** Fix attempt $final_attempt of $MAX_RETRIES
**UAT Result:** FAIL (${#PASSED_SCENARIOS[@]}/${#AUTOMATABLE_SCENARIOS[@]} scenarios passed)

---

## Required Actions

The following items could not be automatically fixed and require human intervention.

EOF

    local action_num=0

    # Add BLOCKING items
    if [ ${#HUMAN_INTERVENTION_BLOCKING[@]} -gt 0 ]; then
        for item in "${HUMAN_INTERVENTION_BLOCKING[@]}"; do
            ((action_num++))
            IFS='|' read -r scenario_id scenario_name matched_line <<< "$item"

            cat >> "$human_actions_file" << EOF
### $action_num. $scenario_name (Scenario $scenario_id)

**Priority:** High (BLOCKING)
**Issue:** $matched_line

**Suggested Action:**
EOF
            # Add specific guidance based on pattern
            if echo "$matched_line" | grep -qiE "\.env|environment variable"; then
                cat >> "$human_actions_file" << EOF
Check your \`.env\` file and ensure all required environment variables are set.
Reference \`.env.example\` if available.

EOF
            elif echo "$matched_line" | grep -qiE "API[_-]?KEY|SECRET|TOKEN"; then
                cat >> "$human_actions_file" << EOF
Verify your API credentials are correctly configured.
Check the service dashboard for valid keys.

EOF
            elif echo "$matched_line" | grep -qiE "permission denied|EACCES"; then
                cat >> "$human_actions_file" << EOF
Check file/directory permissions. You may need to run with elevated privileges
or adjust ownership/permissions on the affected files.

EOF
            else
                echo "Review the error message and take appropriate action." >> "$human_actions_file"
                echo "" >> "$human_actions_file"
            fi
        done
    fi

    # Add WARNING items
    if [ ${#HUMAN_INTERVENTION_WARNING[@]} -gt 0 ]; then
        for item in "${HUMAN_INTERVENTION_WARNING[@]}"; do
            ((action_num++))
            IFS='|' read -r scenario_id scenario_name matched_line <<< "$item"

            cat >> "$human_actions_file" << EOF
### $action_num. $scenario_name (Scenario $scenario_id)

**Priority:** Medium (WARNING)
**Issue:** $matched_line

**Suggested Action:**
EOF
            # Add specific guidance based on pattern
            if echo "$matched_line" | grep -qiE "connection refused|ECONNREFUSED"; then
                cat >> "$human_actions_file" << EOF
Ensure the required service is running (database, Redis, etc.).
Check service logs for startup errors.

EOF
            elif echo "$matched_line" | grep -qiE "inbox|email|manual.*verification"; then
                cat >> "$human_actions_file" << EOF
Manual verification required. Check the relevant inbox or UI to confirm
the expected behavior.

EOF
            elif echo "$matched_line" | grep -qiE "migration|relation.*does not exist"; then
                cat >> "$human_actions_file" << EOF
Database schema may need updating. Run migrations:
\`\`\`bash
npm run db:migrate  # or your project's migration command
\`\`\`

EOF
            else
                echo "Review the warning and take appropriate action if needed." >> "$human_actions_file"
                echo "" >> "$human_actions_file"
            fi
        done
    fi

    cat >> "$human_actions_file" << EOF

---

## After Completing Actions

Re-run UAT validation:
\`\`\`bash
./scripts/uat-validate.sh $epic_id --gate-mode=$UAT_GATE_MODE
\`\`\`

---

*Generated by UAT Validate Workflow*
*BMAD Method - Epic Chain Self-Healing*
EOF

    echo "$human_actions_file"
}

self_healing_loop() {
    local epic_id="$1"
    local attempt=0

    while [ $attempt -lt $MAX_RETRIES ]; do
        ((attempt++))

        log_section "Self-Healing Fix Loop (Attempt $attempt/$MAX_RETRIES)"

        # Reset human intervention arrays for this attempt
        HUMAN_INTERVENTION_BLOCKING=()
        HUMAN_INTERVENTION_WARNING=()

        # Generate fix context (this will detect human intervention items)
        local fix_file
        fix_file=$(generate_fix_context "$epic_id" "$attempt")

        # Log human intervention summary
        if [ ${#HUMAN_INTERVENTION_BLOCKING[@]} -gt 0 ]; then
            log_warn "Detected ${#HUMAN_INTERVENTION_BLOCKING[@]} BLOCKING human intervention item(s)"
        fi
        if [ ${#HUMAN_INTERVENTION_WARNING[@]} -gt 0 ]; then
            log_warn "Detected ${#HUMAN_INTERVENTION_WARNING[@]} WARNING human intervention item(s)"
        fi

        # Run quick-dev fix
        if ! run_quick_dev_fix "$fix_file" "$epic_id" "$attempt"; then
            log_warn "Fix attempt $attempt may have issues"
        fi

        # Re-run validation
        log "Re-validating after fix attempt $attempt..."

        # Reset scenario results but preserve human intervention items
        PASSED_SCENARIOS=()
        FAILED_SCENARIOS=()
        FAILED_DETAILS=()

        if execute_scenarios "$UAT_GATE_MODE"; then
            log_success "UAT passed after fix attempt $attempt"
            return 0
        fi

        log_warn "UAT still failing after attempt $attempt"
    done

    # Generate human actions file for remaining issues
    generate_human_actions_file "$epic_id" "$MAX_RETRIES"

    log_error "Max retries ($MAX_RETRIES) exceeded"
    return 2
}

# =============================================================================
# Section 9: Output Signals and Metrics
# =============================================================================

update_metrics() {
    local epic_id="$1"
    local gate_status="$2"
    local fix_attempts="$3"

    mkdir -p "$METRICS_DIR"

    local metrics_file="$METRICS_DIR/epic-${epic_id}-metrics.yaml"

    # Calculate timing
    local end_time=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
    local end_epoch=$(date +%s)
    local duration_seconds=$((end_epoch - UAT_START_EPOCH))

    # Calculate human intervention counts
    local blocking_count=${#HUMAN_INTERVENTION_BLOCKING[@]}
    local warning_count=${#HUMAN_INTERVENTION_WARNING[@]}

    # Check if yq is available for YAML manipulation
    if command -v yq >/dev/null 2>&1; then
        if [ -f "$metrics_file" ]; then
            yq -i ".validation.gate_executed = true" "$metrics_file"
            yq -i ".validation.gate_status = \"$gate_status\"" "$metrics_file"
            yq -i ".validation.fix_attempts = $fix_attempts" "$metrics_file"
            yq -i ".validation.scenarios_passed = ${#PASSED_SCENARIOS[@]}" "$metrics_file"
            yq -i ".validation.scenarios_failed = ${#FAILED_SCENARIOS[@]}" "$metrics_file"
            yq -i ".validation.start_time = \"$UAT_START_TIME\"" "$metrics_file"
            yq -i ".validation.end_time = \"$end_time\"" "$metrics_file"
            yq -i ".validation.duration_seconds = $duration_seconds" "$metrics_file"
            yq -i ".validation.human_intervention.blocking = $blocking_count" "$metrics_file"
            yq -i ".validation.human_intervention.warning = $warning_count" "$metrics_file"
        else
            # Create new metrics file
            cat > "$metrics_file" << EOF
epic_id: "$epic_id"
validation:
  gate_executed: true
  gate_status: "$gate_status"
  fix_attempts: $fix_attempts
  scenarios_passed: ${#PASSED_SCENARIOS[@]}
  scenarios_failed: ${#FAILED_SCENARIOS[@]}
  start_time: "$UAT_START_TIME"
  end_time: "$end_time"
  duration_seconds: $duration_seconds
  human_intervention:
    blocking: $blocking_count
    warning: $warning_count
EOF
        fi
    else
        # Fallback: append to file or create new
        if [ ! -f "$metrics_file" ]; then
            cat > "$metrics_file" << EOF
epic_id: "$epic_id"
validation:
  gate_executed: true
  gate_status: "$gate_status"
  fix_attempts: $fix_attempts
  scenarios_passed: ${#PASSED_SCENARIOS[@]}
  scenarios_failed: ${#FAILED_SCENARIOS[@]}
  start_time: "$UAT_START_TIME"
  end_time: "$end_time"
  duration_seconds: $duration_seconds
  human_intervention:
    blocking: $blocking_count
    warning: $warning_count
EOF
        else
            # Simple append for validation section
            log_warn "yq not found - metrics update may be incomplete"
        fi
    fi

    log "Metrics updated: $metrics_file"
    log "  Duration: ${duration_seconds}s"
}

output_signals() {
    local gate_status="$1"
    local fix_attempts="$2"

    local total=${#AUTOMATABLE_SCENARIOS[@]}
    local passed=${#PASSED_SCENARIOS[@]}
    local human_action_count=$((${#HUMAN_INTERVENTION_BLOCKING[@]} + ${#HUMAN_INTERVENTION_WARNING[@]}))
    local human_action_required="false"
    [ $human_action_count -gt 0 ] && human_action_required="true"

    echo ""
    echo "UAT_GATE_RESULT: $gate_status"
    echo "UAT_FIX_ATTEMPTS: $fix_attempts"
    echo "UAT_SCENARIOS_PASSED: $passed/$total"
    echo "UAT_HUMAN_ACTION_REQUIRED: $human_action_required"
    echo "UAT_HUMAN_ACTION_COUNT: $human_action_count"
    if [ "$human_action_required" = "true" ]; then
        echo "UAT_HUMAN_ACTION_FILE: $FIX_DIR/epic-${EPIC_ID}-human-actions.md"
    fi
}

print_summary() {
    local gate_status="$1"
    local fix_attempts="$2"

    local human_action_count=$((${#HUMAN_INTERVENTION_BLOCKING[@]} + ${#HUMAN_INTERVENTION_WARNING[@]}))

    # Calculate duration
    local end_epoch=$(date +%s)
    local duration_seconds=$((end_epoch - UAT_START_EPOCH))
    local duration_display="${duration_seconds}s"
    if [ $duration_seconds -ge 60 ]; then
        local minutes=$((duration_seconds / 60))
        local seconds=$((duration_seconds % 60))
        duration_display="${minutes}m ${seconds}s"
    fi

    log_header "UAT VALIDATION COMPLETE"

    echo "  Epic:              $EPIC_ID"
    echo "  Gate Mode:         $UAT_GATE_MODE"
    echo "  Gate Result:       $gate_status"
    echo "  Duration:          $duration_display"
    echo ""
    echo "  Scenarios:"
    echo "    Automatable:     ${#AUTOMATABLE_SCENARIOS[@]}"
    echo "    Semi-automated:  ${#SEMI_AUTO_SCENARIOS[@]}"
    echo "    Manual:          ${#MANUAL_SCENARIOS[@]}"
    echo ""
    echo "  Results:"
    echo "    Passed:          ${#PASSED_SCENARIOS[@]}"
    echo "    Failed:          ${#FAILED_SCENARIOS[@]}"
    echo "    Fix Attempts:    $fix_attempts"
    echo ""
    echo "  Human Intervention:"
    echo "    Blocking Items:  ${#HUMAN_INTERVENTION_BLOCKING[@]}"
    echo "    Warning Items:   ${#HUMAN_INTERVENTION_WARNING[@]}"
    echo ""
    echo "  Artifacts:"
    echo "    Log:             $LOG_FILE"
    echo "    UAT Document:    $UAT_FILE"
    if [ ${#FAILED_SCENARIOS[@]} -gt 0 ] && [ -d "$FIX_DIR" ]; then
        echo "    Fix Contexts:    $FIX_DIR/"
    fi
    if [ $human_action_count -gt 0 ]; then
        echo "    Human Actions:   $FIX_DIR/epic-${EPIC_ID}-human-actions.md"
    fi
    echo ""

    # Print human intervention summary if any
    if [ $human_action_count -gt 0 ]; then
        echo -e "${YELLOW}${BOLD}  ⚠ Human Action Required:${NC}"
        if [ ${#HUMAN_INTERVENTION_BLOCKING[@]} -gt 0 ]; then
            echo -e "    ${RED}BLOCKING:${NC}"
            for item in "${HUMAN_INTERVENTION_BLOCKING[@]}"; do
                IFS='|' read -r scenario_id scenario_name matched_line <<< "$item"
                echo "      - Scenario $scenario_id: $matched_line"
            done
        fi
        if [ ${#HUMAN_INTERVENTION_WARNING[@]} -gt 0 ]; then
            echo -e "    ${YELLOW}WARNING:${NC}"
            for item in "${HUMAN_INTERVENTION_WARNING[@]}"; do
                IFS='|' read -r scenario_id scenario_name matched_line <<< "$item"
                echo "      - Scenario $scenario_id: $matched_line"
            done
        fi
        echo ""
        echo "  See $FIX_DIR/epic-${EPIC_ID}-human-actions.md for details."
        echo ""
    fi
}

# =============================================================================
# Main Execution
# =============================================================================

# Capture UAT evaluation start time
UAT_START_TIME=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
UAT_START_EPOCH=$(date +%s)

log_header "UAT VALIDATION: Epic $EPIC_ID"
log "Gate mode: $UAT_GATE_MODE"
log "Max retries: $MAX_RETRIES"
log "Timeout: ${TIMEOUT_SECONDS}s"
log "Started: $UAT_START_TIME"

# Ensure directories exist
mkdir -p "$METRICS_DIR"
mkdir -p "$FIX_DIR"

# Step 1: Load UAT document
log_section "Loading UAT Document"
if ! load_uat_document "$EPIC_ID"; then
    echo "UAT_GATE_RESULT: FAIL"
    echo "UAT_FIX_ATTEMPTS: 0"
    echo "UAT_SCENARIOS_PASSED: 0/0"
    exit 1
fi

# Step 2: Classify scenarios
log_section "Classifying Scenarios"
classify_scenarios "$UAT_FILE"

# Step 3: Execute scenarios
if ! execute_scenarios "$UAT_GATE_MODE"; then
    # Gate failed - check if we should try self-healing
    if [ "$DRY_RUN" = false ] && [ $MAX_RETRIES -gt 0 ]; then
        if ! self_healing_loop "$EPIC_ID"; then
            # Max retries exceeded
            update_metrics "$EPIC_ID" "FAIL" "$MAX_RETRIES"
            output_signals "FAIL" "$MAX_RETRIES"
            print_summary "FAIL" "$MAX_RETRIES"
            exit 2
        fi
    else
        # No self-healing or dry-run
        update_metrics "$EPIC_ID" "FAIL" "0"
        output_signals "FAIL" "0"
        print_summary "FAIL" "0"
        exit 1
    fi
fi

# Step 4: Gate passed
FINAL_ATTEMPTS=0
if [ ${#FAILED_SCENARIOS[@]} -gt 0 ]; then
    # Passed after retries
    FINAL_ATTEMPTS=$((MAX_RETRIES - $(ls -1 "$FIX_DIR"/epic-${EPIC_ID}-fix-context-*.md 2>/dev/null | wc -l) + 1))
fi

update_metrics "$EPIC_ID" "PASS" "$FINAL_ATTEMPTS"
output_signals "PASS" "$FINAL_ATTEMPTS"
print_summary "PASS" "$FINAL_ATTEMPTS"

log_success "UAT validation passed for Epic $EPIC_ID"
exit 0
