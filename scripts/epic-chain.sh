#!/bin/bash
#
# BMAD Epic Chain - Execute Multiple Epics with Analysis and Context Sharing
#
# Usage: ./epic-chain.sh <epic-ids...> [options]
#
# Examples:
#   ./epic-chain.sh 36 37 38
#   ./epic-chain.sh 36 37 38 --dry-run --verbose
#   ./epic-chain.sh 36 37 38 --analyze-only
#   ./epic-chain.sh 36 37 38 --start-from 37
#   ./epic-chain.sh 36 37 38 --uat-gate=full --uat-blocking
#
# Options:
#   --dry-run           Show what would be executed without running
#   --analyze-only      Run analysis phase only, don't execute
#   --verbose           Show detailed output
#   --start-from ID     Start from a specific epic (skip earlier ones)
#   --skip-done         Skip epics/stories with Status: Done
#   --no-handoff        Don't generate context handoffs between epics
#   --no-combined-uat   Skip combined UAT generation at end
#
# UAT Gate Options:
#   --uat-gate=MODE     UAT validation mode: quick|full|skip (default: quick)
#   --uat-blocking      Halt chain if UAT fails (default: continue)
#   --uat-retries=N     Max fix attempts per epic (default: 2)
#   --no-uat            Disable UAT validation gate entirely
#
# Report Options:
#   --no-report         Skip chain execution report generation
#

set -e

# Allow nested Claude Code sessions (when launched from within Claude Code)
unset CLAUDECODE 2>/dev/null || true

# =============================================================================
# Configuration
# =============================================================================

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
BMAD_DIR="$PROJECT_ROOT/.bmad"

STORIES_DIR="$PROJECT_ROOT/docs/stories"
SPRINT_ARTIFACTS_DIR="$PROJECT_ROOT/docs/sprint-artifacts"
EPICS_DIR="$PROJECT_ROOT/docs/epics"
UAT_DIR="$PROJECT_ROOT/docs/uat"
HANDOFF_DIR="$PROJECT_ROOT/docs/handoffs"

LOG_FILE="/tmp/bmad-epic-chain-$$.log"
LOGS_DIR="$SPRINT_ARTIFACTS_DIR/logs"
FINAL_LOG_FILE=""
CHAIN_PLAN_FILE="$SPRINT_ARTIFACTS_DIR/chain-plan.yaml"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m' # No Color

# UAT Gate Configuration
UAT_GATE_ENABLED="${UAT_GATE_ENABLED:-true}"
UAT_GATE_MODE="${UAT_GATE_MODE:-quick}"
UAT_MAX_RETRIES="${UAT_MAX_RETRIES:-2}"
UAT_BLOCKING="${UAT_BLOCKING:-false}"

# Metrics Configuration
METRICS_DIR="$SPRINT_ARTIFACTS_DIR/metrics"

# Report Configuration
GENERATE_REPORT="${GENERATE_REPORT:-true}"
CHAIN_REPORT_FILE="$SPRINT_ARTIFACTS_DIR/chain-execution-report.md"

# =============================================================================
# Helper Functions
# =============================================================================

log() {
    echo -e "${BLUE}[CHAIN]${NC} $1"
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" >> "$LOG_FILE"
}

log_success() {
    echo -e "${GREEN}[✓]${NC} $1"
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] [SUCCESS] $1" >> "$LOG_FILE"
}

log_error() {
    echo -e "${RED}[✗]${NC} $1"
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] [ERROR] $1" >> "$LOG_FILE"
}

log_warn() {
    echo -e "${YELLOW}[!]${NC} $1"
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] [WARN] $1" >> "$LOG_FILE"
}

log_header() {
    echo ""
    echo -e "${CYAN}${BOLD}═══════════════════════════════════════════════════════════${NC}"
    echo -e "${CYAN}${BOLD}  $1${NC}"
    echo -e "${CYAN}${BOLD}═══════════════════════════════════════════════════════════${NC}"
    echo ""
}

log_section() {
    echo ""
    echo -e "${BOLD}───────────────────────────────────────────────────────────${NC}"
    echo -e "${BOLD}  $1${NC}"
    echo -e "${BOLD}───────────────────────────────────────────────────────────${NC}"
}

# =============================================================================
# Orphaned Process Cleanup
# =============================================================================

kill_orphaned_test_processes() {
    # Kill orphaned node/test processes that may have been spawned during epic execution
    local killed=0

    for pattern in "node.*jest" "node.*vitest" "node.*playwright" "node.*next.*dev" "node.*tsx.*watch"; do
        local pids
        pids=$(pgrep -f "$pattern" 2>/dev/null || true)
        if [ -n "$pids" ]; then
            echo "$pids" | while read -r pid; do
                if [ -n "$pid" ] && kill -0 "$pid" 2>/dev/null; then
                    kill "$pid" 2>/dev/null || true
                    ((killed++)) || true
                fi
            done
        fi
    done

    local pytest_pids
    pytest_pids=$(pgrep -f "python.*pytest" 2>/dev/null || true)
    if [ -n "$pytest_pids" ]; then
        echo "$pytest_pids" | while read -r pid; do
            if [ -n "$pid" ] && kill -0 "$pid" 2>/dev/null; then
                kill "$pid" 2>/dev/null || true
                ((killed++)) || true
            fi
        done
    fi

    if [ "${killed:-0}" -gt 0 ]; then
        log "Killed orphaned test processes"
    fi
}

# =============================================================================
# Log Persistence
# =============================================================================

save_log_to_repo() {
    if [ ! -f "$LOG_FILE" ] || [ ! -s "$LOG_FILE" ]; then
        return 0
    fi

    mkdir -p "$LOGS_DIR" 2>/dev/null || true

    local timestamp
    timestamp=$(date '+%Y%m%d-%H%M%S')
    FINAL_LOG_FILE="$LOGS_DIR/epic-chain-${timestamp}.log"

    if cp "$LOG_FILE" "$FINAL_LOG_FILE" 2>/dev/null; then
        echo "[$(date '+%Y-%m-%d %H:%M:%S')] Log saved to: $FINAL_LOG_FILE" >> "$FINAL_LOG_FILE"
    fi
}

cleanup_chain() {
    local exit_code=$?
    trap - EXIT INT TERM
    kill_orphaned_test_processes
    save_log_to_repo
    if [ -n "$FINAL_LOG_FILE" ] && [ -f "$FINAL_LOG_FILE" ]; then
        echo "    - Log saved:     $FINAL_LOG_FILE"
    fi
    exit $exit_code
}

trap cleanup_chain EXIT INT TERM

# Helper function to create basic report if Claude fails
create_basic_report() {
    local end_time_iso=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
    local duration_formatted="${DURATION}s"
    if [ $DURATION -gt 3600 ]; then
        duration_formatted="$((DURATION / 3600))h $((DURATION % 3600 / 60))m"
    elif [ $DURATION -gt 60 ]; then
        duration_formatted="$((DURATION / 60))m $((DURATION % 60))s"
    fi

    cat > "$CHAIN_REPORT_FILE" << EOF
# Epic Chain Execution Report

## Executive Summary

**Execution Method:** BMAD Epic Chain (automated AI-driven development)
**Status:** $([ $FAILED_EPICS -eq 0 ] && echo "COMPLETE" || echo "PARTIAL")

| Metric | Value |
|--------|-------|
| Total Epics | ${#EPIC_IDS[@]} |
| Completed | $COMPLETED_EPICS |
| Failed | $FAILED_EPICS |
| Skipped | $SKIPPED_EPICS |
| Duration | $duration_formatted |

---

## Timeline

| Epic | Status |
|------|--------|
EOF

    for epic_id in "${EPIC_IDS[@]}"; do
        local status="Unknown"
        local metrics_file="$METRICS_DIR/epic-${epic_id}-metrics.yaml"
        if [ -f "$metrics_file" ]; then
            if command -v yq >/dev/null 2>&1; then
                local completed=$(yq '.stories.completed // 0' "$metrics_file")
                local failed=$(yq '.stories.failed // 0' "$metrics_file")
                if [ "$failed" -gt 0 ]; then
                    status="Partial ($completed completed, $failed failed)"
                else
                    status="Complete ($completed stories)"
                fi
            fi
        fi
        echo "| Epic $epic_id | $status |" >> "$CHAIN_REPORT_FILE"
    done

    cat >> "$CHAIN_REPORT_FILE" << EOF

---

EOF

    # Measured telemetry (real numbers, or an honest "not captured")
    build_measured_telemetry_md >> "$CHAIN_REPORT_FILE"

    cat >> "$CHAIN_REPORT_FILE" << EOF

---

## Artifacts

| Artifact | Location |
|----------|----------|
| Chain Plan | $CHAIN_PLAN_FILE |
| Metrics | $METRICS_DIR/ |
| UAT Documents | $UAT_DIR/ |
| Handoffs | $HANDOFF_DIR/ |
| Log | $LOG_FILE |

---

*Report generated: $end_time_iso*
*BMAD Method Epic Chain*
EOF

    log_success "Basic report created: $CHAIN_REPORT_FILE"
}

# Build a MEASURED telemetry markdown section by aggregating the deterministic
# `telemetry:` blocks that epic-execute writes into each epic's metrics.yaml
# (populated when run with BMAD_TRACE=1). Emits real per-epic + total token/cost
# numbers — never estimates. If no epic captured telemetry, says so plainly.
# Output: markdown on stdout.
build_measured_telemetry_md() {
    if ! command -v yq >/dev/null 2>&1; then
        echo "## Telemetry"
        echo ""
        echo "_Telemetry rollup requires \`yq\` (not found)._"
        return 0
    fi

    local any=false
    local total_cost=0 total_in=0 total_out=0
    local rows=""

    for epic_id in "${EPIC_IDS[@]}"; do
        local mf="$METRICS_DIR/epic-${epic_id}-metrics.yaml"
        [ -f "$mf" ] || continue
        local has
        has=$(yq '.telemetry // "" | tag' "$mf" 2>/dev/null)
        [ "$has" = "!!map" ] || continue
        any=true

        local cost in out
        cost=$(yq '.telemetry.total_cost_usd // 0' "$mf" 2>/dev/null)
        in=$(yq '.telemetry.total_input_tokens // 0' "$mf" 2>/dev/null)
        out=$(yq '.telemetry.total_output_tokens // 0' "$mf" 2>/dev/null)

        rows+="| $epic_id | $in | $out | \$$(printf '%.4f' "$cost" 2>/dev/null || echo "$cost") |"$'\n'
        total_cost=$(awk "BEGIN { printf \"%.6f\", $total_cost + $cost }")
        total_in=$(( total_in + ${in%.*} ))
        total_out=$(( total_out + ${out%.*} ))
    done

    echo "## Telemetry (Measured)"
    echo ""
    if [ "$any" != true ]; then
        echo "_No measured telemetry captured. Re-run with \`BMAD_TRACE=1\` to record"
        echo "real token usage and cost per epic (see docs/improvements/observability-implementation-plan.md)._"
        return 0
    fi
    echo "Actual usage captured from the Claude CLI result envelopes (not estimated):"
    echo ""
    echo "| Epic | Input Tokens | Output Tokens | Cost (USD) |"
    echo "|------|--------------|---------------|------------|"
    printf '%s' "$rows"
    echo "| **Total** | **$total_in** | **$total_out** | **\$$(printf '%.4f' "$total_cost")** |"
}

# =============================================================================
# Argument Parsing
# =============================================================================

EPIC_IDS=()
DRY_RUN=false
ANALYZE_ONLY=false
VERBOSE=false
START_FROM=""
SKIP_DONE=false
NO_HANDOFF=false
NO_COMBINED_UAT=false

while [[ $# -gt 0 ]]; do
    case $1 in
        --dry-run)
            DRY_RUN=true
            shift
            ;;
        --analyze-only)
            ANALYZE_ONLY=true
            shift
            ;;
        --verbose)
            VERBOSE=true
            shift
            ;;
        --start-from)
            START_FROM="$2"
            shift 2
            ;;
        --skip-done)
            SKIP_DONE=true
            shift
            ;;
        --no-handoff)
            NO_HANDOFF=true
            shift
            ;;
        --no-combined-uat)
            NO_COMBINED_UAT=true
            shift
            ;;
        --uat-gate=*)
            UAT_GATE_MODE="${1#*=}"
            shift
            ;;
        --uat-blocking)
            UAT_BLOCKING=true
            shift
            ;;
        --no-uat)
            UAT_GATE_ENABLED=false
            shift
            ;;
        --uat-retries=*)
            UAT_MAX_RETRIES="${1#*=}"
            shift
            ;;
        --no-report)
            GENERATE_REPORT=false
            shift
            ;;
        -*)
            echo "Unknown option: $1"
            exit 1
            ;;
        *)
            EPIC_IDS+=("$1")
            shift
            ;;
    esac
done

if [ ${#EPIC_IDS[@]} -eq 0 ]; then
    echo "Usage: $0 <epic-id> [epic-id...] [options]"
    echo ""
    echo "Examples:"
    echo "  $0 36 37 38                    # Execute epics 36, 37, 38 in order"
    echo "  $0 36 37 38 --dry-run          # Show what would happen"
    echo "  $0 36 37 38 --analyze-only     # Just analyze, don't execute"
    echo "  $0 36 37 38 --start-from 37    # Resume from epic 37"
    echo "  $0 36 37 38 --uat-gate=full    # Run full UAT validation after each epic"
    echo ""
    echo "Options:"
    echo "  --dry-run           Show execution plan without running"
    echo "  --analyze-only      Analyze dependencies only"
    echo "  --verbose           Detailed output"
    echo "  --start-from ID     Start from specific epic"
    echo "  --skip-done         Skip completed stories"
    echo "  --no-handoff        Skip context handoffs between epics"
    echo "  --no-combined-uat   Skip combined UAT at end"
    echo ""
    echo "UAT Gate Options:"
    echo "  --uat-gate=MODE     UAT validation mode: quick|full|skip (default: quick)"
    echo "  --uat-blocking      Halt chain if UAT fails (default: continue)"
    echo "  --uat-retries=N     Max fix attempts per epic (default: 2)"
    echo "  --no-uat            Disable UAT validation gate entirely"
    echo ""
    echo "Report Options:"
    echo "  --no-report         Skip chain execution report generation"
    exit 1
fi

# =============================================================================
# Setup
# =============================================================================

log_header "EPIC CHAIN EXECUTION"
log "Epics to chain: ${EPIC_IDS[*]}"
log "Project root: $PROJECT_ROOT"

# Ensure directories exist
mkdir -p "$UAT_DIR"
mkdir -p "$HANDOFF_DIR"
mkdir -p "$SPRINT_ARTIFACTS_DIR"

# =============================================================================
# Phase 1: Validate Epics
# =============================================================================

log_section "Phase 1: Validating Epics"

# Bash 3.2 compatible: use indexed arrays with matching indices
EPIC_FILES_LIST=()
EPIC_STORIES_LIST=()
EPIC_DEPS_LIST=()

for i in "${!EPIC_IDS[@]}"; do
    epic_id="${EPIC_IDS[$i]}"

    # Find epic file
    epic_file=""
    for pattern in "epic-${epic_id}.md" "epic-${epic_id}-"*.md "epic-0${epic_id}-"*.md "${epic_id}.md"; do
        found=$(find "$EPICS_DIR" -name "$pattern" 2>/dev/null | head -1)
        if [ -n "$found" ]; then
            epic_file="$found"
            break
        fi
    done

    if [ -z "$epic_file" ] || [ ! -f "$epic_file" ]; then
        log_error "Epic $epic_id: File not found in $EPICS_DIR"
        exit 1
    fi

    EPIC_FILES_LIST[$i]="$epic_file"
    log_success "Epic $epic_id: Found $(basename "$epic_file")"

    # Find stories for this epic
    story_count=0
    for search_dir in "$STORIES_DIR" "$SPRINT_ARTIFACTS_DIR"; do
        if [ -d "$search_dir" ]; then
            count=$(find "$search_dir" -name "${epic_id}-*-*.md" 2>/dev/null | wc -l)
            story_count=$((story_count + count))
        fi
    done

    if [ "$story_count" -eq 0 ]; then
        log_warn "Epic $epic_id: No story files found (will check epic file for story definitions)"
    else
        log "Epic $epic_id: Found $story_count story files"
    fi

    EPIC_STORIES_LIST[$i]=$story_count
done

log_success "All ${#EPIC_IDS[@]} epics validated"

# =============================================================================
# Phase 2: Analyze Dependencies
# =============================================================================

log_section "Phase 2: Analyzing Dependencies"

# Simple dependency detection: check for ## Dependencies section in epic files
for i in "${!EPIC_IDS[@]}"; do
    epic_id="${EPIC_IDS[$i]}"
    epic_file="${EPIC_FILES_LIST[$i]}"

    # Look for Dependencies section
    deps=$(grep -A 10 "^## Dependencies" "$epic_file" 2>/dev/null | grep -oE "Epic [0-9]+" | grep -oE "[0-9]+" || true)

    if [ -n "$deps" ]; then
        EPIC_DEPS_LIST[$i]="$deps"
        log "Epic $epic_id depends on: $deps"
    else
        EPIC_DEPS_LIST[$i]=""
        log "Epic $epic_id: No explicit dependencies"
    fi
done

# =============================================================================
# Phase 3: Determine Execution Order
# =============================================================================

log_section "Phase 3: Determining Execution Order"

# For now, use order as provided (user presumably knows the right order)
# Future enhancement: topological sort based on dependencies

EXECUTION_ORDER=("${EPIC_IDS[@]}")

log "Execution order: ${EXECUTION_ORDER[*]}"

# =============================================================================
# Phase 4: Generate Chain Plan
# =============================================================================

log_section "Phase 4: Generating Chain Plan"

cat > "$CHAIN_PLAN_FILE" << EOF
# Epic Chain Execution Plan
# Generated: $(date '+%Y-%m-%d %H:%M:%S')

epics: [${EPIC_IDS[*]}]
total_epics: ${#EPIC_IDS[@]}

execution_order:
EOF

total_stories=0
for i in "${!EXECUTION_ORDER[@]}"; do
    epic_id="${EXECUTION_ORDER[$i]}"
    story_count=${EPIC_STORIES_LIST[$i]}
    total_stories=$((total_stories + story_count))
    deps="${EPIC_DEPS_LIST[$i]}"

    cat >> "$CHAIN_PLAN_FILE" << EOF
  - epic: $epic_id
    file: $(basename "${EPIC_FILES_LIST[$i]}")
    stories: $story_count
    dependencies: [$deps]
EOF
done

cat >> "$CHAIN_PLAN_FILE" << EOF

total_stories: $total_stories

options:
  dry_run: $DRY_RUN
  skip_done: $SKIP_DONE
  context_handoff: $([ "$NO_HANDOFF" = true ] && echo "false" || echo "true")
  combined_uat: $([ "$NO_COMBINED_UAT" = true ] && echo "false" || echo "true")
EOF

log_success "Chain plan saved to: $CHAIN_PLAN_FILE"

# =============================================================================
# Display Summary
# =============================================================================

log_header "CHAIN EXECUTION PLAN"

echo "  Epics:          ${EPIC_IDS[*]}"
echo "  Total Stories:  $total_stories"
echo "  Dry Run:        $DRY_RUN"
echo "  Skip Done:      $SKIP_DONE"
echo ""
echo "  Execution Order:"
for i in "${!EXECUTION_ORDER[@]}"; do
    epic_id="${EXECUTION_ORDER[$i]}"
    deps="${EPIC_DEPS_LIST[$i]}"
    echo "    $((i+1)). Epic $epic_id (${EPIC_STORIES_LIST[$i]} stories) ${deps:+← depends on: $deps}"
done
echo ""

if [ "$ANALYZE_ONLY" = true ]; then
    log_success "Analysis complete (--analyze-only specified)"
    echo ""
    echo "To execute this chain, run:"
    echo "  $0 ${EPIC_IDS[*]}"
    echo ""
    exit 0
fi

# =============================================================================
# Phase 5: Execute Chain
# =============================================================================

log_header "EXECUTING EPIC CHAIN"

COMPLETED_EPICS=0
FAILED_EPICS=0
SKIPPED_EPICS=0
START_TIME=$(date +%s)
STARTED=false
PREVIOUS_EPIC=""
PREVIOUS_IDX=-1

for current_idx in "${!EXECUTION_ORDER[@]}"; do
    epic_id="${EXECUTION_ORDER[$current_idx]}"
    # Handle --start-from
    if [ -n "$START_FROM" ] && [ "$STARTED" = false ]; then
        if [ "$epic_id" = "$START_FROM" ]; then
            STARTED=true
        else
            log_warn "Skipping Epic $epic_id (waiting for --start-from $START_FROM)"
            ((SKIPPED_EPICS++))
            continue
        fi
    fi

    log_section "Executing Epic $epic_id"

    # Generate context handoff from previous epic
    if [ -n "$PREVIOUS_EPIC" ] && [ "$NO_HANDOFF" = false ]; then
        handoff_file="$HANDOFF_DIR/epic-${PREVIOUS_EPIC}-to-${epic_id}-handoff.md"
        if [ -f "$handoff_file" ]; then
            log "Loading context handoff from Epic $PREVIOUS_EPIC"
        fi
    fi

    # Build epic-execute command
    exec_cmd="$SCRIPT_DIR/epic-execute.sh $epic_id"

    if [ "$DRY_RUN" = true ]; then
        exec_cmd="$exec_cmd --dry-run"
    fi

    if [ "$SKIP_DONE" = true ]; then
        exec_cmd="$exec_cmd --skip-done"
    fi

    if [ "$VERBOSE" = true ]; then
        exec_cmd="$exec_cmd --verbose"
    fi

    log "Running: $exec_cmd"

    # Execute epic
    if [ "$DRY_RUN" = true ]; then
        echo "[DRY RUN] Would execute: $exec_cmd"
        ((COMPLETED_EPICS++))
    else
        if $exec_cmd; then
            log_success "Epic $epic_id completed"

            # Run UAT validation if enabled
            if [ "$UAT_GATE_ENABLED" = true ]; then
                log_section "UAT Validation Gate: Epic $epic_id"

                uat_cmd="$SCRIPT_DIR/uat-validate.sh $epic_id --gate-mode=$UAT_GATE_MODE --max-retries=$UAT_MAX_RETRIES"

                if [ "$VERBOSE" = true ]; then
                    uat_cmd="$uat_cmd --verbose"
                fi

                log "Running: $uat_cmd"

                # Capture UAT result
                uat_output=""
                uat_exit_code=0
                uat_output=$($uat_cmd 2>&1) || uat_exit_code=$?

                echo "$uat_output" >> "$LOG_FILE"

                # Parse result signals
                if echo "$uat_output" | grep -q "UAT_GATE_RESULT: PASS"; then
                    log_success "UAT validation passed for Epic $epic_id"

                    # Update metrics file if it exists
                    epic_metrics_file="$METRICS_DIR/epic-${epic_id}-metrics.yaml"
                    if [ -f "$epic_metrics_file" ] && command -v yq >/dev/null 2>&1; then
                        yq -i '.validation.gate_executed = true' "$epic_metrics_file"
                        yq -i '.validation.gate_status = "PASS"' "$epic_metrics_file"
                    fi
                else
                    log_error "UAT validation failed for Epic $epic_id"

                    # Update metrics file if it exists
                    epic_metrics_file="$METRICS_DIR/epic-${epic_id}-metrics.yaml"
                    if [ -f "$epic_metrics_file" ] && command -v yq >/dev/null 2>&1; then
                        yq -i '.validation.gate_executed = true' "$epic_metrics_file"
                        yq -i '.validation.gate_status = "FAIL"' "$epic_metrics_file"
                    fi

                    # Extract fix attempts from output
                    fix_attempts=$(echo "$uat_output" | grep -oE "UAT_FIX_ATTEMPTS: [0-9]+" | grep -oE "[0-9]+" || echo "0")
                    [ "$VERBOSE" = true ] && log "Fix attempts: $fix_attempts"

                    if [ "$UAT_BLOCKING" = true ]; then
                        log_error "UAT blocking enabled - halting chain"
                        ((FAILED_EPICS++))
                        break
                    else
                        log_warn "UAT blocking disabled - continuing to next epic"
                    fi
                fi
            fi

            ((COMPLETED_EPICS++))

            # Kill orphaned node/test processes between epics
            kill_orphaned_test_processes

            # Generate handoff for next epic
            if [ "$NO_HANDOFF" = false ]; then
                next_idx=$((current_idx + 1))

                if [ $next_idx -lt ${#EXECUTION_ORDER[@]} ]; then
                    next_epic="${EXECUTION_ORDER[$next_idx]}"
                    handoff_file="$HANDOFF_DIR/epic-${epic_id}-to-${next_epic}-handoff.md"

                    log "Generating context handoff: Epic $epic_id → Epic $next_epic"

                    story_count=${EPIC_STORIES_LIST[$current_idx]}

                    # Determine UAT validation status for handoff
                    uat_status="Not executed"
                    uat_fix_info=""
                    if [ "$UAT_GATE_ENABLED" = true ]; then
                        if echo "$uat_output" | grep -q "UAT_GATE_RESULT: PASS"; then
                            uat_status="PASS"
                            local fix_count=$(echo "$uat_output" | grep -oE "UAT_FIX_ATTEMPTS: [0-9]+" | grep -oE "[0-9]+" || echo "0")
                            if [ "$fix_count" -gt 0 ]; then
                                uat_status="PASS (after $fix_count fix attempts)"
                                uat_fix_info="Self-healing fixes were applied. Review fix contexts at:
\`docs/sprint-artifacts/uat-fixes/epic-${epic_id}-fix-context-*.md\`"
                            fi
                        else
                            uat_status="FAIL (non-blocking)"
                            uat_fix_info="UAT validation failed but chain continued (non-blocking mode).
Review failures at: \`docs/sprint-artifacts/uat-fixes/epic-${epic_id}-fix-context-*.md\`"
                        fi
                    fi

                    cat > "$handoff_file" << EOF
# Epic $epic_id → Epic $next_epic Handoff

## Generated
$(date '+%Y-%m-%d %H:%M:%S')

## Epic $epic_id Completion Summary

Epic $epic_id has been completed. Key context for Epic $next_epic:

### Implementation Status
- **Stories:** Completed via epic-execute workflow
- **UAT Validation:** $uat_status
- **Metrics:** \`$METRICS_DIR/epic-${epic_id}-metrics.yaml\`

### Patterns Established
- Review code changes in Epic $epic_id for established patterns
- Check \`docs/stories/${epic_id}-*\` for implementation details

### Files Modified
$(git diff --name-only HEAD~${story_count} HEAD 2>/dev/null | head -20 || echo "Unable to determine - check git log")

### UAT Document
- Location: \`docs/uat/epic-${epic_id}-uat.md\`
- Contains test scenarios for regression testing

$([ -n "$uat_fix_info" ] && echo "### Fix Context
$uat_fix_info")

### Notes for Next Epic
- Continue following patterns established in this epic
- Ensure changes don't break Epic $epic_id functionality
- Reference UAT document for integration points

EOF
                    log_success "Handoff saved to: $handoff_file"
                fi
            fi
        else
            log_error "Epic $epic_id failed"
            ((FAILED_EPICS++))

            # Ask whether to continue or abort
            echo ""
            echo "Epic $epic_id failed. Continue with remaining epics? (y/n)"
            read -r continue_choice
            if [ "$continue_choice" != "y" ]; then
                log_error "Chain execution aborted by user"
                break
            fi
        fi
    fi

    PREVIOUS_EPIC="$epic_id"
    PREVIOUS_IDX=$current_idx
done

# =============================================================================
# Phase 6: Generate Combined UAT
# =============================================================================

if [ "$NO_COMBINED_UAT" = false ] && [ "$DRY_RUN" = false ] && [ $COMPLETED_EPICS -gt 1 ]; then
    log_section "Generating Combined UAT Document"

    combined_uat_file="$UAT_DIR/chain-${EPIC_IDS[*]// /-}-uat.md"

    cat > "$combined_uat_file" << EOF
# Combined UAT: Epics ${EPIC_IDS[*]}

## Generated
$(date '+%Y-%m-%d %H:%M:%S')

## Overview

This document combines User Acceptance Testing for epics: ${EPIC_IDS[*]}

## Individual Epic UATs

EOF

    for epic_id in "${EPIC_IDS[@]}"; do
        uat_file="$UAT_DIR/epic-${epic_id}-uat.md"
        if [ -f "$uat_file" ]; then
            echo "### Epic $epic_id" >> "$combined_uat_file"
            echo "" >> "$combined_uat_file"
            echo "See: [epic-${epic_id}-uat.md](epic-${epic_id}-uat.md)" >> "$combined_uat_file"
            echo "" >> "$combined_uat_file"
        fi
    done

    cat >> "$combined_uat_file" << EOF

## Cross-Epic Integration Testing

After individual epic testing, verify these cross-epic scenarios:

1. [ ] Features from earlier epics still work after later epic changes
2. [ ] Data flows correctly between features from different epics
3. [ ] No regression in previously tested functionality

## Sign-off

| Epic | Tester | Date | Status |
|------|--------|------|--------|
EOF

    for epic_id in "${EPIC_IDS[@]}"; do
        echo "| $epic_id | | | Pending |" >> "$combined_uat_file"
    done

    log_success "Combined UAT saved to: $combined_uat_file"
fi

# =============================================================================
# Phase 7: Generate Chain Execution Report
# =============================================================================

if [ "$GENERATE_REPORT" = true ] && [ "$DRY_RUN" = false ]; then
    log_section "Generating Chain Execution Report"

    # Check if metrics files exist
    metrics_found=0
    for epic_id in "${EPIC_IDS[@]}"; do
        if [ -f "$METRICS_DIR/epic-${epic_id}-metrics.yaml" ]; then
            ((metrics_found++))
        fi
    done

    if [ $metrics_found -eq 0 ]; then
        log_warn "No metrics files found - skipping report generation"
    else
        log "Found $metrics_found metrics files"

        # Determine workflow path (installed vs source)
        WORKFLOW_PATH=""
        if [ -d "$BMAD_DIR/bmm/workflows/4-implementation/epic-chain" ]; then
            WORKFLOW_PATH="$BMAD_DIR/bmm/workflows/4-implementation/epic-chain"
        elif [ -d "$PROJECT_ROOT/src/bmm/workflows/4-implementation/epic-chain" ]; then
            WORKFLOW_PATH="$PROJECT_ROOT/src/bmm/workflows/4-implementation/epic-chain"
        fi

        # Precompute the MEASURED telemetry section in bash so the report uses
        # ground-truth numbers and the model has no room to invent token/cost data.
        measured_telemetry_md=$(build_measured_telemetry_md)

        # Build report generation prompt
        report_prompt="You are Bob, the Scrum Master, generating a chain execution report.

## Your Task

Generate a comprehensive chain execution report for the completed epic chain.

## CRITICAL: No Fabricated Metrics

Do NOT estimate, infer, or invent token counts, costs, or call counts. Token
and cost figures come ONLY from the measured telemetry section below. If a value
is not present there, write \"not captured\" — never a guess or a typical-pattern
estimate. Include the measured telemetry section verbatim in the report.

## Measured Telemetry (ground truth — include verbatim)

${measured_telemetry_md}

## Configuration

- Chain Plan: $CHAIN_PLAN_FILE
- Metrics Folder: $METRICS_DIR
- Output File: $CHAIN_REPORT_FILE
- Stories Location: $STORIES_DIR
- UAT Location: $UAT_DIR
- Epics Location: $EPICS_DIR
- Handoffs Location: $HANDOFF_DIR

## Epics in Chain

${EPIC_IDS[*]}

## Process

1. Read the chain plan file to understand the epic sequence
2. For each epic, load the metrics file from: $METRICS_DIR/epic-{id}-metrics.yaml
3. Aggregate metrics across all epics:
   - Total duration
   - Story counts (total, completed, failed, skipped)
   - UAT gate results
   - Issues encountered
4. Generate the report following the template structure

## Report Structure

Generate a markdown report with these sections:
- Executive Summary (status, counts, duration)
- Timeline (epic-by-epic execution details)
- What Was Built (brief per-epic summary)
- Issues Encountered (aggregated from metrics)
- UAT Validation Summary (gate results, fix attempts)
- Artifacts Generated (list generated files)
- Conclusion

## Output

Write the report to: $CHAIN_REPORT_FILE

When complete, output exactly:
REPORT_GENERATED: $CHAIN_REPORT_FILE"

        log "Invoking report generator..."

        # Execute report generation
        report_result=$(claude --dangerously-skip-permissions -p "$report_prompt" 2>&1) || true

        echo "$report_result" >> "$LOG_FILE"

        if echo "$report_result" | grep -q "REPORT_GENERATED"; then
            log_success "Report generated: $CHAIN_REPORT_FILE"

            # Stage report file
            git add "$CHAIN_REPORT_FILE" 2>/dev/null || true
        else
            log_warn "Report generation may not have completed cleanly"

            # If Claude didn't generate it, create a basic report
            if [ ! -f "$CHAIN_REPORT_FILE" ]; then
                log "Creating basic report from metrics..."
                create_basic_report
            fi
        fi
    fi
fi

# =============================================================================
# Summary
# =============================================================================

END_TIME=$(date +%s)
DURATION=$((END_TIME - START_TIME))

log_header "EPIC CHAIN COMPLETE"

echo "  Epics in Chain: ${#EPIC_IDS[@]}"
echo "  Completed:      $COMPLETED_EPICS"
echo "  Failed:         $FAILED_EPICS"
echo "  Skipped:        $SKIPPED_EPICS"
echo "  Duration:       ${DURATION}s"
echo ""
echo "  Artifacts:"
echo "    - Chain Plan:    $CHAIN_PLAN_FILE"
echo "    - Handoffs:      $HANDOFF_DIR/"
echo "    - UAT Documents: $UAT_DIR/"
echo "    - Metrics:       $METRICS_DIR/"
if [ -f "$CHAIN_REPORT_FILE" ]; then
echo "    - Report:        $CHAIN_REPORT_FILE"
fi
echo "    - Log:           (saved on exit to $LOGS_DIR/)"
echo ""

if [ $FAILED_EPICS -gt 0 ]; then
    log_warn "$FAILED_EPICS epic(s) failed - check log for details"
    exit 1
fi

log_success "All epics completed successfully"
echo ""
if [ -f "$CHAIN_REPORT_FILE" ]; then
    echo "Next steps:"
    echo "  1. Review execution report: $CHAIN_REPORT_FILE"
    echo "  2. Run UAT validation for each epic"
    echo "  3. Execute manual test scenarios"
else
    echo "Next step: Review UAT documents and run manual testing"
fi
echo ""
