#!/bin/bash
#
# BMAD Epic Execute - Automated Story Execution with Context Isolation
#
# Usage: ./epic-execute.sh <epic-id> [options]
#
# Options:
#   --dry-run       Show what would be executed without running
#   --skip-review   Skip code review phase (not recommended)
#   --no-commit     Stage changes but don't commit
#   --parallel      Run independent stories in parallel (experimental)
#   --verbose       Show detailed output
#   --start-from ID Start from a specific story (e.g., 31-2)
#   --skip-done     Skip stories with Status: Done
#   --skip-arch     Skip architecture compliance check
#   --skip-test-quality  Skip test quality review
#   --skip-traceability  Skip traceability check (not recommended)
#   --skip-static-analysis  Skip static analysis gate (runs real tooling)
#

set -e

# Allow nested Claude Code sessions (when launched from within Claude Code)
unset CLAUDECODE 2>/dev/null || true

# =============================================================================
# Cleanup and Signal Handling
# =============================================================================

# Track execution state for cleanup
CURRENT_STORY_INDEX=0
CLEANUP_DONE=false

cleanup() {
    # Prevent recursive cleanup
    if [ "$CLEANUP_DONE" = true ]; then
        return
    fi
    CLEANUP_DONE=true

    local exit_code=$?

    # Disable trap during cleanup
    trap - EXIT INT TERM

    echo ""
    log "Cleaning up (exit code: $exit_code)..."

    # Finalize metrics if initialized
    if [ -n "$METRICS_FILE" ] && [ -f "$METRICS_FILE" ]; then
        local duration=0
        if [ -n "$EPIC_START_SECONDS" ]; then
            duration=$(($(date +%s) - EPIC_START_SECONDS))
        fi

        # Only finalize if we have story data
        if [ "${#STORIES[@]}" -gt 0 ] 2>/dev/null; then
            finalize_metrics "${#STORIES[@]}" "${COMPLETED:-0}" "${FAILED:-0}" "${SKIPPED:-0}" "$duration"
            log "Metrics finalized: $METRICS_FILE"
        fi
    fi

    # Report git status
    if command -v git >/dev/null 2>&1 && [ -d "$PROJECT_ROOT/.git" ] 2>/dev/null; then
        local uncommitted
        uncommitted=$(git -C "$PROJECT_ROOT" status --porcelain 2>/dev/null | wc -l | tr -d ' ')
        if [ "$uncommitted" -gt 0 ]; then
            log_warn "Uncommitted changes remain ($uncommitted files). Review with 'git status'"
        fi
    fi

    # Save checkpoint for resume capability
    if [ -n "$SPRINT_ARTIFACTS_DIR" ] && [ -n "$EPIC_ID" ] && [ -d "$SPRINT_ARTIFACTS_DIR" ] 2>/dev/null; then
        local checkpoint_file="$SPRINT_ARTIFACTS_DIR/.epic-${EPIC_ID}-checkpoint"
        {
            echo "# Epic $EPIC_ID checkpoint - $(date '+%Y-%m-%d %H:%M:%S')"
            echo "LAST_STORY_INDEX=$CURRENT_STORY_INDEX"
            echo "COMPLETED=${COMPLETED:-0}"
            echo "FAILED=${FAILED:-0}"
            echo "SKIPPED=${SKIPPED:-0}"
            echo "EXIT_CODE=$exit_code"
        } > "$checkpoint_file" 2>/dev/null || true

        if [ $exit_code -ne 0 ]; then
            log "Checkpoint saved: $checkpoint_file"
        fi
    fi

    # Log final state on non-zero exit
    if [ $exit_code -ne 0 ]; then
        log_error "Epic execution interrupted (exit code: $exit_code)"
        if [ -n "$EPIC_ID" ]; then
            log "Resume with: $0 $EPIC_ID --start-from <story-id>"
        fi
    fi

    # Kill orphaned node/test processes
    kill_orphaned_test_processes

    # Clean up phase output temp file
    rm -f "$PHASE_OUTPUT_FILE" 2>/dev/null

    # Save log to repo before exiting
    save_log_to_repo
    if [ -n "$FINAL_LOG_FILE" ] && [ -f "$FINAL_LOG_FILE" ]; then
        echo "    - Log saved:     $FINAL_LOG_FILE"
    fi

    exit $exit_code
}

# Register trap for cleanup on exit, interrupt, or termination
trap cleanup EXIT INT TERM

# =============================================================================
# Configuration
# =============================================================================

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
BMAD_DIR="$PROJECT_ROOT/bmad"

# =============================================================================
# Source Modular Components
# =============================================================================

LIB_DIR="$SCRIPT_DIR/epic-execute-lib"
[ -f "$LIB_DIR/utils.sh" ] && source "$LIB_DIR/utils.sh"
[ -f "$LIB_DIR/decision-log.sh" ] && source "$LIB_DIR/decision-log.sh"
[ -f "$LIB_DIR/regression-gate.sh" ] && source "$LIB_DIR/regression-gate.sh"
[ -f "$LIB_DIR/test-failure-filter.sh" ] && source "$LIB_DIR/test-failure-filter.sh"
[ -f "$LIB_DIR/design-phase.sh" ] && source "$LIB_DIR/design-phase.sh"
[ -f "$LIB_DIR/json-output.sh" ] && source "$LIB_DIR/json-output.sh"
[ -f "$LIB_DIR/tdd-flow.sh" ] && source "$LIB_DIR/tdd-flow.sh"

STORIES_DIR="$PROJECT_ROOT/docs/stories"
SPRINT_ARTIFACTS_DIR="$PROJECT_ROOT/docs/sprint-artifacts"
SPRINTS_DIR="$PROJECT_ROOT/docs/sprints"
EPICS_DIR="$PROJECT_ROOT/docs/epics"
UAT_DIR="$PROJECT_ROOT/docs/uat"
LOGS_DIR="$SPRINT_ARTIFACTS_DIR/logs"
# Per-story design plans (persisted so dev phase can read them after resume)
DESIGN_DIR="$SPRINT_ARTIFACTS_DIR/design"

# Temporary log file during execution - will be copied to LOGS_DIR on completion
LOG_FILE="/tmp/bmad-epic-execute-$$.log"
# Final log path set after EPIC_ID is known (in save_log_to_repo)
FINAL_LOG_FILE=""

# =============================================================================
# BMAD Workflow Paths
# =============================================================================

# Source workflow files from the BMAD-METHOD repository
BMAD_SRC_DIR="$SCRIPT_DIR/.."

# Our automation workflows (epic-execute, epic-chain, uat-validate) under src/bmm/workflows/
WORKFLOWS_DIR="$BMAD_SRC_DIR/src/bmm/workflows/4-implementation"

# Upstream BMM skills (post-v6.0 architecture) under src/bmm-skills/
SKILLS_DIR="$BMAD_SRC_DIR/src/bmm-skills/4-implementation"

# Dev Story Skill (upstream)
DEV_WORKFLOW_DIR="$SKILLS_DIR/bmad-dev-story"
DEV_WORKFLOW_SKILL="$DEV_WORKFLOW_DIR/SKILL.md"
DEV_WORKFLOW_CHECKLIST="$DEV_WORKFLOW_DIR/checklist.md"

# Code Review Skill (upstream)
REVIEW_WORKFLOW_DIR="$SKILLS_DIR/bmad-code-review"
REVIEW_WORKFLOW_SKILL="$REVIEW_WORKFLOW_DIR/SKILL.md"

# UAT Generation (from epic-execute workflow)
UAT_STEP_TEMPLATE="$WORKFLOWS_DIR/epic-execute/steps/step-04-generate-uat.md"
UAT_DOC_TEMPLATE="$WORKFLOWS_DIR/epic-execute/templates/uat-template.md"

# Epic-Execute Step Templates (lean, pipe-mode prompts)
DEV_STORY_STEP="$WORKFLOWS_DIR/epic-execute/steps/step-02-dev-story.md"
CODE_REVIEW_STEP="$WORKFLOWS_DIR/epic-execute/steps/step-03-code-review.md"
ARCH_COMPLIANCE_STEP="$WORKFLOWS_DIR/epic-execute/steps/step-02b-arch-compliance.md"
TEST_QUALITY_STEP="$WORKFLOWS_DIR/epic-execute/steps/step-03b-test-quality.md"
TRACEABILITY_STEP="$WORKFLOWS_DIR/epic-execute/steps/step-03c-traceability.md"

# Traceability output directory
TRACEABILITY_DIR="$PROJECT_ROOT/docs/sprint-artifacts/traceability"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# =============================================================================
# Helper Functions
# =============================================================================

log() {
    echo -e "${BLUE}[BMAD]${NC} $1"
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

# =============================================================================
# Log Persistence Functions
# =============================================================================

# Save the temporary log file to the repo's logs directory
# Called during cleanup to ensure logs are preserved
save_log_to_repo() {
    # Skip if no log file or it's empty
    if [ ! -f "$LOG_FILE" ] || [ ! -s "$LOG_FILE" ]; then
        return 0
    fi

    # Create logs directory if needed
    if [ -n "$LOGS_DIR" ]; then
        mkdir -p "$LOGS_DIR" 2>/dev/null || true
    else
        return 0
    fi

    # Generate descriptive filename: epic-{id}-{timestamp}.log or epic-execute-{timestamp}.log
    local timestamp
    timestamp=$(date '+%Y%m%d-%H%M%S')
    local log_filename

    if [ -n "$EPIC_ID" ]; then
        log_filename="epic-${EPIC_ID}-${timestamp}.log"
    else
        log_filename="epic-execute-${timestamp}.log"
    fi

    FINAL_LOG_FILE="$LOGS_DIR/$log_filename"

    # Copy the log file
    if cp "$LOG_FILE" "$FINAL_LOG_FILE" 2>/dev/null; then
        echo "[$(date '+%Y-%m-%d %H:%M:%S')] Log saved to: $FINAL_LOG_FILE" >> "$LOG_FILE"
        # Also append to the saved copy
        echo "[$(date '+%Y-%m-%d %H:%M:%S')] Log saved to: $FINAL_LOG_FILE" >> "$FINAL_LOG_FILE"
        return 0
    else
        echo "[$(date '+%Y-%m-%d %H:%M:%S')] [WARN] Failed to save log to $FINAL_LOG_FILE" >> "$LOG_FILE"
        return 1
    fi
}

# Flush the current log to the repo after each story completes/fails.
# Unlike save_log_to_repo (which runs once at exit), this overwrites
# the same file incrementally so the repo always has the latest progress.
flush_log_to_repo() {
    # Skip if no log file or it's empty
    if [ ! -f "$LOG_FILE" ] || [ ! -s "$LOG_FILE" ]; then
        return 0
    fi

    # Create logs directory if needed
    if [ -n "$LOGS_DIR" ]; then
        mkdir -p "$LOGS_DIR" 2>/dev/null || true
    else
        return 0
    fi

    # Use a stable filename so each flush overwrites the previous snapshot
    if [ -n "$EPIC_ID" ]; then
        local flush_file="$LOGS_DIR/epic-${EPIC_ID}-latest.log"
    else
        return 0
    fi

    cp "$LOG_FILE" "$flush_file" 2>/dev/null || true
}

# =============================================================================
# Orphaned Process Cleanup
# =============================================================================

kill_orphaned_test_processes() {
    # Kill orphaned node/test processes that may have been spawned during story execution
    # These can accumulate and consume memory if tests or dev servers aren't cleaned up
    local killed=0

    # Kill orphaned node test runners (jest, vitest, playwright)
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

    # Kill orphaned pytest processes
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
# Git Safety Functions
# =============================================================================

# Patterns for sensitive files that should never be committed
SENSITIVE_FILE_PATTERNS=(
    "\.env$"
    "\.env\."
    "credentials\.json$"
    "secrets\.json$"
    "\.secrets$"
    "\.pem$"
    "\.key$"
    "\.p12$"
    "id_rsa"
    "\.credentials$"
    "\.npmrc$"
    "\.pypirc$"
)

# Check for untracked sensitive files that would be staged by git add -A
# Returns 0 if safe, 1 if sensitive files found
check_sensitive_files() {
    if [ ! -d "$PROJECT_ROOT/.git" ]; then
        return 0  # Not a git repo, nothing to check
    fi

    local has_issues=false

    # Get list of untracked files that would be staged
    local untracked_files
    untracked_files=$(git -C "$PROJECT_ROOT" ls-files --others --exclude-standard 2>/dev/null || true)

    if [ -z "$untracked_files" ]; then
        return 0  # No untracked files
    fi

    # Check each sensitive pattern
    for pattern in "${SENSITIVE_FILE_PATTERNS[@]}"; do
        local matches
        matches=$(echo "$untracked_files" | grep -E "$pattern" 2>/dev/null || true)

        if [ -n "$matches" ]; then
            while IFS= read -r file; do
                [ -z "$file" ] && continue

                # Check if file is gitignored (it shouldn't match if we got it from ls-files --others)
                if ! git -C "$PROJECT_ROOT" check-ignore -q "$PROJECT_ROOT/$file" 2>/dev/null; then
                    log_error "SAFETY: Sensitive file '$file' is untracked and not gitignored"
                    has_issues=true
                fi
            done <<< "$matches"
        fi
    done

    if [ "$has_issues" = true ]; then
        log_error "Add sensitive files to .gitignore before committing"
        log_error "Or use --no-commit to skip automatic commits"
        return 1
    fi

    return 0
}

# =============================================================================
# Prompt Size Management
# =============================================================================

# Maximum prompt size in bytes (default ~150KB, well under Claude's context limit)
MAX_PROMPT_SIZE="${MAX_PROMPT_SIZE:-150000}"

# Priority levels for content inclusion
CONTENT_PRIORITY_CRITICAL=1   # Story, core workflow instructions (always include)
CONTENT_PRIORITY_HIGH=2       # Architecture, checklist
CONTENT_PRIORITY_MEDIUM=3     # Decision log, design context
CONTENT_PRIORITY_LOW=4        # Full workflow YAML (truncate first)

# Get size of a string in bytes
get_byte_size() {
    local content="$1"
    printf '%s' "$content" | wc -c | tr -d ' '
}

# Truncate content to a maximum size, preserving structure
# Arguments:
#   $1 - content to truncate
#   $2 - max size in bytes
#   $3 - label for logging (optional)
truncate_content() {
    local content="$1"
    local max_size="$2"
    local label="${3:-Content}"

    local current_size
    current_size=$(get_byte_size "$content")

    if [ "$current_size" -le "$max_size" ]; then
        printf '%s' "$content"
        return 0
    fi

    [ "$VERBOSE" = true ] && log_warn "$label truncated: ${current_size}B -> ${max_size}B"

    # Truncate and add notice
    local truncated
    truncated=$(printf '%s' "$content" | head -c "$max_size")
    printf '%s\n\n... [CONTENT TRUNCATED - %sB total, showing first %sB] ...' "$truncated" "$current_size" "$max_size"
}

# Build a prompt with size limits
# Adds content in priority order until limit reached
# Arguments:
#   $1 - base prompt (critical, always included)
#   Remaining args: triplets of "label|priority|content"
# Note: This is a simplified version - for complex prompts, build manually with truncate_content
build_sized_prompt() {
    local base_prompt="$1"
    shift

    local current_size
    current_size=$(get_byte_size "$base_prompt")
    local final_prompt="$base_prompt"
    local remaining=$((MAX_PROMPT_SIZE - current_size - 5000))  # Reserve 5KB for output

    # Process content blocks
    while [ $# -ge 3 ]; do
        local label="$1"
        local priority="$2"
        local content="$3"
        shift 3

        local content_size
        content_size=$(get_byte_size "$content")

        if [ "$content_size" -eq 0 ]; then
            continue
        fi

        if [ "$content_size" -le "$remaining" ]; then
            # Fits entirely
            final_prompt+="$content"
            remaining=$((remaining - content_size))
        elif [ "$priority" -le "$CONTENT_PRIORITY_HIGH" ]; then
            # Critical/high priority - truncate but include
            local truncated
            truncated=$(truncate_content "$content" "$remaining" "$label")
            final_prompt+="$truncated"
            remaining=0
        else
            # Lower priority - skip entirely
            [ "$VERBOSE" = true ] && log_warn "Skipping $label (${content_size}B) due to size limit"
        fi

        if [ "$remaining" -le 0 ]; then
            [ "$VERBOSE" = true ] && log_warn "Prompt size limit reached (${MAX_PROMPT_SIZE}B)"
            break
        fi
    done

    printf '%s' "$final_prompt"
}

# Log prompt size in verbose mode
log_prompt_size() {
    local prompt="$1"
    local phase_name="${2:-prompt}"

    if [ "$VERBOSE" = true ]; then
        local prompt_size
        prompt_size=$(get_byte_size "$prompt")
        log "Prompt size ($phase_name): ${prompt_size}B / ${MAX_PROMPT_SIZE}B limit"
    fi
}

# =============================================================================
# Memory-safe Claude execution helpers
# =============================================================================
# Instead of capturing claude output into a bash variable (which can consume
# gigabytes of RAM), pipe output directly to a temp file and read only the
# tail for completion signal parsing.

# Temp file for current phase output (reused across phases, cleaned up on exit)
PHASE_OUTPUT_FILE="/tmp/bmad-phase-output-$$.txt"

# Run claude and pipe output directly to file + LOG_FILE (no bash variable)
# Arguments:
#   $1 - prompt text (use "-f" as first arg to use file-based prompt)
#   $2 - prompt file path (only when $1 is "-f")
# Sets: PHASE_OUTPUT_FILE with the output
run_claude_to_file() {
    # Truncate phase output file
    : > "$PHASE_OUTPUT_FILE"

    if [ "$1" = "-f" ]; then
        local prompt_file="$2"
        claude --dangerously-skip-permissions -f "$prompt_file" 2>&1 | tee -a "$LOG_FILE" > "$PHASE_OUTPUT_FILE" || true
    else
        local prompt="$1"
        claude --dangerously-skip-permissions -p "$prompt" 2>&1 | tee -a "$LOG_FILE" > "$PHASE_OUTPUT_FILE" || true
    fi
}

# Read the tail of phase output for completion signal parsing.
# Only reads the last 32KB — enough for JSON result blocks and signal lines,
# but avoids loading megabytes of tool output into a bash variable.
# Arguments: none (reads from PHASE_OUTPUT_FILE)
# Returns: tail content on stdout
read_phase_tail() {
    tail -c 32768 "$PHASE_OUTPUT_FILE" 2>/dev/null || echo ""
}

# Read full phase output (use sparingly — only when you must search the entire output)
# Arguments: none (reads from PHASE_OUTPUT_FILE)
# Returns: full content on stdout
read_phase_output() {
    cat "$PHASE_OUTPUT_FILE" 2>/dev/null || echo ""
}

# =============================================================================
# Shared Automated Prompt Builder
# =============================================================================

# Build a lean automated prompt from a step template + automation wrapper.
# Instead of embedding full workflow files (~40KB), loads the step template (~4-9KB)
# and wraps it with automation rules and completion signals.
#
# Arguments:
#   $1 - step_template_file: Path to the step template .md file
#   $2 - story_file: Path to the story .md file (passed as path, NOT embedded)
#   $3 - phase_name: Name of the phase (dev, review, fix, arch, test_quality, trace, uat)
#   $4 - extra_context: Optional extra context (review findings, decisions, etc.)
#   $5 - completion_signals: Phase-specific completion signal instructions
#
# Outputs:
#   The assembled prompt string to stdout
build_automated_prompt() {
    local step_template_file="$1"
    local story_file="$2"
    local phase_name="$3"
    local extra_context="${4:-}"
    local completion_signals="${5:-}"
    local story_id
    story_id=$(basename "$story_file" .md)

    # Load the step template
    local template=""
    if [ -f "$step_template_file" ]; then
        template=$(cat "$step_template_file")
    else
        log_warn "Step template not found: $step_template_file"
    fi

    # Perform variable substitution on template
    template="${template//\{story_id\}/$story_id}"
    template="${template//\{story_file\}/$story_file}"
    template="${template//\{story_file_contents\}/Read the story file at: $story_file}"
    template="${template//\{project_root\}/$PROJECT_ROOT}"
    template="${template//\{epic_id\}/$EPIC_ID}"
    template="${template//\{date\}/$(date '+%Y-%m-%d')}"

    cat <<PROMPT_EOF
## Automated Execution Mode

### Rules
- AUTOMATED execution - do NOT pause for user confirmation at any step
- When instructions say 'ask user', make a reasonable autonomous decision
- Complete the ENTIRE workflow in a single execution
- Stage changes with explicit file paths: git add <file1> <file2> ...
- Do NOT use 'git add -A' or 'git add .'

### Execution Variables (Pre-resolved)
- story_path: $story_file
- story_key: $story_id
- project_root: $PROJECT_ROOT
- implementation_artifacts: $STORIES_DIR
- sprint_status: $SPRINT_ARTIFACTS_DIR/sprint-status.yaml
- date: $(date '+%Y-%m-%d')
- user_name: Epic Executor
- communication_language: English
- user_skill_level: expert
- document_output_language: English

## Step Template Instructions

$template

## Story File

**Read this file before proceeding:** $story_file
**Story ID:** $story_id

$extra_context

$completion_signals

## Begin Execution

Execute the $phase_name workflow now.
PROMPT_EOF
}

# =============================================================================
# Metrics Functions
# =============================================================================

METRICS_DIR=""
METRICS_FILE=""
METRICS_RESUMED=false

init_metrics() {
    METRICS_DIR="$SPRINT_ARTIFACTS_DIR/metrics"
    METRICS_FILE="$METRICS_DIR/epic-${EPIC_ID}-metrics.yaml"
    mkdir -p "$METRICS_DIR"

    local start_time=$(date -u +"%Y-%m-%dT%H:%M:%SZ")

    # If metrics file already exists, preserve it and seed in-memory counters
    if [ -f "$METRICS_FILE" ]; then
        METRICS_RESUMED=true
        log "Resuming with existing metrics: $METRICS_FILE"

        # Seed in-memory counters from existing YAML so they accumulate
        if command -v yq >/dev/null 2>&1; then
            COMPLETED=$(yq '.stories.completed // 0' "$METRICS_FILE")
            FAILED=$(yq '.stories.failed // 0' "$METRICS_FILE")
            SKIPPED=$(yq '.stories.skipped // 0' "$METRICS_FILE")

            log "Restored counters: completed=$COMPLETED failed=$FAILED skipped=$SKIPPED"

            # Record resume event
            yq -i ".execution.resumed_at = \"$start_time\"" "$METRICS_FILE"
        else
            log_warn "yq not found - cannot restore counters from existing metrics"
        fi

        return
    fi

    # No existing file - create fresh metrics
    cat > "$METRICS_FILE" << EOF
epic_id: "$EPIC_ID"
execution:
  start_time: "$start_time"
  end_time: ""
  duration_seconds: 0
stories:
  total: 0
  completed: 0
  failed: 0
  skipped: 0
fix_loop:
  total_fix_attempts: 0
  stories_requiring_fixes: 0
  max_retries_hit: 0
validation:
  gate_executed: false
  gate_status: "PENDING"
issues: []
story_details: []
EOF

    log "Metrics initialized: $METRICS_FILE"
}

update_story_metrics() {
    local status="$1"  # completed|failed|skipped

    if [ -z "$METRICS_FILE" ] || [ ! -f "$METRICS_FILE" ]; then
        return
    fi

    # Check if yq is available for YAML manipulation
    if command -v yq >/dev/null 2>&1; then
        case "$status" in
            completed) yq -i '.stories.completed += 1' "$METRICS_FILE" ;;
            failed)    yq -i '.stories.failed += 1' "$METRICS_FILE" ;;
            skipped)   yq -i '.stories.skipped += 1' "$METRICS_FILE" ;;
        esac
    else
        # Fallback: log warning (metrics will be finalized at end)
        [ "$VERBOSE" = true ] && log_warn "yq not found - metrics update deferred"
    fi
}

add_metrics_issue() {
    local story_id="$1"
    local issue_type="$2"
    local message="$3"

    if [ -z "$METRICS_FILE" ] || [ ! -f "$METRICS_FILE" ]; then
        return
    fi

    local timestamp=$(date -u +"%Y-%m-%dT%H:%M:%SZ")

    if command -v yq >/dev/null 2>&1; then
        yq -i ".issues += [{\"story\": \"$story_id\", \"type\": \"$issue_type\", \"message\": \"$message\", \"timestamp\": \"$timestamp\"}]" "$METRICS_FILE"
    fi
}

record_fix_attempt() {
    local story_id="$1"
    local attempt_num="$2"
    local outcome="$3"  # success|failed|max_retries

    if [ -z "$METRICS_FILE" ] || [ ! -f "$METRICS_FILE" ]; then
        return
    fi

    local timestamp=$(date -u +"%Y-%m-%dT%H:%M:%SZ")

    if command -v yq >/dev/null 2>&1; then
        # Increment total fix attempts
        yq -i '.fix_loop.total_fix_attempts += 1' "$METRICS_FILE"

        # Track per-story fix details
        yq -i ".story_details += [{\"story\": \"$story_id\", \"fix_attempt\": $attempt_num, \"outcome\": \"$outcome\", \"timestamp\": \"$timestamp\"}]" "$METRICS_FILE"

        if [ "$outcome" = "max_retries" ]; then
            yq -i '.fix_loop.max_retries_hit += 1' "$METRICS_FILE"
        fi
    fi
}

record_story_required_fixes() {
    local story_id="$1"

    if [ -z "$METRICS_FILE" ] || [ ! -f "$METRICS_FILE" ]; then
        return
    fi

    if command -v yq >/dev/null 2>&1; then
        yq -i '.fix_loop.stories_requiring_fixes += 1' "$METRICS_FILE"
    fi
}

finalize_metrics() {
    local total_stories="$1"
    local completed="$2"
    local failed="$3"
    local skipped="$4"
    local duration="$5"

    if [ -z "$METRICS_FILE" ] || [ ! -f "$METRICS_FILE" ]; then
        return
    fi

    local end_time=$(date -u +"%Y-%m-%dT%H:%M:%SZ")

    if command -v yq >/dev/null 2>&1; then
        # Add current session duration to any prior duration (for resumed runs)
        local prior_duration
        prior_duration=$(yq '.execution.duration_seconds // 0' "$METRICS_FILE")
        local total_duration=$((prior_duration + duration))

        yq -i ".execution.end_time = \"$end_time\"" "$METRICS_FILE"
        yq -i ".execution.duration_seconds = $total_duration" "$METRICS_FILE"
        yq -i ".stories.total = $total_stories" "$METRICS_FILE"
        yq -i ".stories.completed = $completed" "$METRICS_FILE"
        yq -i ".stories.failed = $failed" "$METRICS_FILE"
        yq -i ".stories.skipped = $skipped" "$METRICS_FILE"
    else
        # Fallback without yq: only update counters, don't overwrite the file
        # This preserves issues, story_details, and fix_loop data
        log_warn "yq not found - metrics finalization limited (counters may be stale)"
    fi

    log "Metrics finalized: $METRICS_FILE"
}

# =============================================================================
# Status Update Functions
# =============================================================================

update_story_status() {
    local story_file="$1"
    local new_status="$2"
    local story_id=$(basename "$story_file" .md)

    if [ ! -f "$story_file" ]; then
        log_warn "Story file not found for status update: $story_file"
        return 1
    fi

    # Update Status field in story file using sed
    # Matches "Status: <anything>" and replaces with "Status: <new_status>"
    if grep -q "^Status:" "$story_file"; then
        # Use cross-platform sed function if available, fallback to direct sed
        if type sed_inplace >/dev/null 2>&1; then
            sed_inplace "s/^Status:.*$/Status: $new_status/" "$story_file"
        else
            # Fallback: use backup and remove approach
            sed -i.bak "s/^Status:.*$/Status: $new_status/" "$story_file" && rm -f "${story_file}.bak"
        fi
        log_success "Updated story file status: $story_id → $new_status"
    else
        log_warn "No Status field found in story file: $story_id"
        return 1
    fi

    return 0
}

update_sprint_status() {
    local story_id="$1"
    local new_status="$2"

    # Find sprint-status.yaml file
    local sprint_file=""
    for search_dir in "$SPRINT_ARTIFACTS_DIR" "$SPRINTS_DIR" "$PROJECT_ROOT/_bmad-output" "$PROJECT_ROOT/docs"; do
        if [ -f "$search_dir/sprint-status.yaml" ]; then
            sprint_file="$search_dir/sprint-status.yaml"
            break
        fi
    done

    if [ -z "$sprint_file" ] || [ ! -f "$sprint_file" ]; then
        [ "$VERBOSE" = true ] && log_warn "No sprint-status.yaml found - skipping sprint status update"
        return 0
    fi

    # Extract story key from story_id (e.g., "1-2-user-auth" from various naming formats)
    # Story files can be named: 1-2-user-auth.md, story-1.2-user-auth.md, etc.
    local story_key=""

    # Try to extract the key pattern: {epic}-{seq}-{name}
    if [[ "$story_id" =~ ^([0-9]+)-([0-9]+)-(.+)$ ]]; then
        story_key="${BASH_REMATCH[1]}-${BASH_REMATCH[2]}-${BASH_REMATCH[3]}"
    elif [[ "$story_id" =~ ^story-([0-9]+)\.([0-9]+)-(.+)$ ]]; then
        story_key="${BASH_REMATCH[1]}-${BASH_REMATCH[2]}-${BASH_REMATCH[3]}"
    elif [[ "$story_id" =~ ^story-([0-9]+)-([0-9]+)-(.+)$ ]]; then
        story_key="${BASH_REMATCH[1]}-${BASH_REMATCH[2]}-${BASH_REMATCH[3]}"
    else
        # Use story_id as-is if no pattern matches
        story_key="$story_id"
    fi

    # Check if yq is available for YAML manipulation
    if command -v yq >/dev/null 2>&1; then
        # Check if story key exists in development_status
        if yq -e ".development_status[\"$story_key\"]" "$sprint_file" >/dev/null 2>&1; then
            yq -i ".development_status[\"$story_key\"] = \"$new_status\"" "$sprint_file"
            log_success "Updated sprint status: $story_key → $new_status"
        else
            [ "$VERBOSE" = true ] && log_warn "Story key '$story_key' not found in sprint-status.yaml"
        fi
    else
        # Fallback: use sed for simple replacement
        # This handles the format: "  1-2-user-auth: in-progress"
        if grep -q "^[[:space:]]*${story_key}:" "$sprint_file"; then
            # Use cross-platform sed function if available
            if type sed_inplace >/dev/null 2>&1; then
                sed_inplace "s/^\([[:space:]]*${story_key}:\).*/\1 $new_status/" "$sprint_file"
            else
                # Fallback: use backup and remove approach
                sed -i.bak "s/^\([[:space:]]*${story_key}:\).*/\1 $new_status/" "$sprint_file" && rm -f "${sprint_file}.bak"
            fi
            log_success "Updated sprint status: $story_key → $new_status (via sed)"
        else
            [ "$VERBOSE" = true ] && log_warn "Story key '$story_key' not found in sprint-status.yaml (sed fallback)"
        fi
    fi

    return 0
}

mark_story_done() {
    local story_file="$1"
    local story_id=$(basename "$story_file" .md)

    log "Marking story as done: $story_id"

    # Update story file Status to done
    update_story_status "$story_file" "done"

    # Update sprint-status.yaml if it exists
    update_sprint_status "$story_id" "done"
}

# =============================================================================
# Help Function
# =============================================================================

show_help() {
    cat << 'EOF'
BMAD Epic Execute - Automated Story Execution with Context Isolation

USAGE:
    epic-execute.sh <epic-id> [OPTIONS]

ARGUMENTS:
    epic-id             Numeric ID of the epic to execute (e.g., 1, 42)

OPTIONS:
    Execution Control:
      --dry-run             Show what would be executed without running
      --start-from ID       Start from a specific story (e.g., 31-2)
      --resume              Resume from last checkpoint (auto-detected)
      --parallel            Run independent stories in parallel (experimental)
      --verbose             Show detailed output including Claude responses
      --legacy-output       Use legacy text-based output parsing (no JSON)

    Gate Skipping:
      --skip-review         Skip code review phase (not recommended)
      --skip-arch           Skip architecture compliance check
      --skip-test-quality   Skip test quality review
      --skip-traceability   Skip traceability check (not recommended)
      --skip-static-analysis  Skip static analysis gate
      --skip-regression     Skip regression test gate

    TDD/Testing Options:
      --skip-design         Skip pre-implementation design phase
      --skip-tdd            Skip all test-first development phases
      --skip-test-spec      Skip test specification phase only
      --skip-test-impl      Skip test implementation phase only

    Commit Control:
      --no-commit           Stage changes but don't commit
      --skip-done           Skip stories with Status: Done

    Help:
      -h, --help            Show this help message

EXAMPLES:
    # Execute epic 1 with all quality gates
    ./epic-execute.sh 1

    # Dry run to preview what will be executed
    ./epic-execute.sh 1 --dry-run --verbose

    # Resume from last checkpoint (after interruption)
    ./epic-execute.sh 1 --resume

    # Start from a specific story
    ./epic-execute.sh 1 --start-from 1-3

    # Skip already-completed stories
    ./epic-execute.sh 1 --skip-done

    # Fast mode (skip optional quality gates)
    ./epic-execute.sh 1 --skip-arch --skip-traceability

    # Development mode (no commits, verbose output)
    ./epic-execute.sh 1 --no-commit --verbose

ENVIRONMENT VARIABLES:
    CLAUDE_TIMEOUT          Timeout for Claude invocations (default: 600s)
    PROJECT_ROOT            Override project root detection
    PROTECTED_BRANCHES      Space-separated list of protected branches (default: "main master")
    MAX_PROMPT_SIZE         Maximum prompt size in bytes (default: 150000)
    RETRY_MAX_ATTEMPTS      Max retry attempts for transient failures (default: 3)
    RETRY_INITIAL_DELAY     Initial retry delay in seconds (default: 5)

FILES:
    Logs:       docs/sprint-artifacts/logs/epic-<id>-<timestamp>.log
    Metrics:    docs/sprint-artifacts/metrics/epic-<id>-metrics.yaml
    Checkpoint: docs/sprint-artifacts/.epic-<id>-checkpoint

For more information, see: docs/bmad_improvements_v2_fixes.md
EOF
    exit 0
}

# =============================================================================
# Argument Parsing
# =============================================================================

EPIC_ID=""
DRY_RUN=false
SKIP_REVIEW=false
NO_COMMIT=false
PARALLEL=false
VERBOSE=false
START_FROM=""
RESUME_FROM_CHECKPOINT=false
SKIP_DONE=false
SKIP_ARCH=false
SKIP_TEST_QUALITY=false
SKIP_TRACEABILITY=false
SKIP_STATIC_ANALYSIS=false
SKIP_DESIGN=false
SKIP_REGRESSION=false
SKIP_TDD=false
SKIP_TEST_SPEC=false
SKIP_TEST_IMPL=false
LEGACY_OUTPUT=false

# Check for help flag before processing other arguments
if [[ "${1:-}" =~ ^(-h|--help)$ ]]; then
    show_help
fi

while [[ $# -gt 0 ]]; do
    case $1 in
        -h|--help)
            show_help
            ;;
        --dry-run)
            DRY_RUN=true
            shift
            ;;
        --skip-review)
            SKIP_REVIEW=true
            shift
            ;;
        --no-commit)
            NO_COMMIT=true
            shift
            ;;
        --parallel)
            PARALLEL=true
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
        --resume)
            RESUME_FROM_CHECKPOINT=true
            shift
            ;;
        --skip-done)
            SKIP_DONE=true
            shift
            ;;
        --skip-arch)
            SKIP_ARCH=true
            shift
            ;;
        --skip-test-quality)
            SKIP_TEST_QUALITY=true
            shift
            ;;
        --skip-traceability)
            SKIP_TRACEABILITY=true
            shift
            ;;
        --skip-static-analysis)
            SKIP_STATIC_ANALYSIS=true
            shift
            ;;
        --skip-design)
            SKIP_DESIGN=true
            shift
            ;;
        --skip-regression)
            SKIP_REGRESSION=true
            shift
            ;;
        --skip-tdd)
            SKIP_TDD=true
            shift
            ;;
        --skip-test-spec)
            SKIP_TEST_SPEC=true
            shift
            ;;
        --skip-test-impl)
            SKIP_TEST_IMPL=true
            shift
            ;;
        --legacy-output)
            LEGACY_OUTPUT=true
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
    echo "  --dry-run       Show what would be executed"
    echo "  --skip-review   Skip code review phase"
    echo "  --no-commit     Don't commit after stories"
    echo "  --parallel      Parallel execution (experimental)"
    echo "  --verbose       Detailed output"
    echo "  --start-from ID Start from a specific story (e.g., 31-2)"
    echo "  --skip-done     Skip stories with Status: Done"
    echo "  --skip-arch     Skip architecture compliance check"
    echo "  --skip-test-quality  Skip test quality review"
    echo "  --skip-traceability  Skip traceability check (not recommended)"
    echo "  --skip-static-analysis  Skip static analysis gate (runs real tooling)"
    echo "  --skip-design     Skip pre-implementation design phase"
    echo "  --skip-regression Skip regression test gate"
    echo "  --skip-tdd        Skip test-first development phases"
    echo "  --skip-test-spec  Skip test specification phase only"
    echo "  --skip-test-impl  Skip test implementation phase only"
    echo "  --legacy-output   Use legacy text-based output parsing (no JSON)"
    exit 1
fi

# =============================================================================
# Setup
# =============================================================================

log "Starting epic execution for: $EPIC_ID"
log "Project root: $PROJECT_ROOT"

# =============================================================================
# Validate BMAD Workflow Files
# =============================================================================

validate_workflows() {
    local missing=0
    local invalid=0

    log "Validating BMAD workflow files..."

    # Dev-story skill
    if [ ! -f "$DEV_WORKFLOW_SKILL" ]; then
        log_error "Missing: Dev SKILL.md at $DEV_WORKFLOW_SKILL"
        ((missing++))
    else
        if type validate_workflow_content >/dev/null 2>&1; then
            if ! validate_workflow_content "$DEV_WORKFLOW_SKILL"; then
                ((invalid++))
            fi
        fi
    fi

    # Code-review skill
    if [ ! -f "$REVIEW_WORKFLOW_SKILL" ]; then
        log_error "Missing: Review SKILL.md at $REVIEW_WORKFLOW_SKILL"
        ((missing++))
    else
        if type validate_workflow_content >/dev/null 2>&1; then
            if ! validate_workflow_content "$REVIEW_WORKFLOW_SKILL"; then
                ((invalid++))
            fi
        fi
    fi

    if [ $missing -gt 0 ]; then
        log_error "Missing $missing required BMAD workflow files"
        log_error "Ensure you are running from the BMAD-METHOD repository"
        log_error "Skills expected at: $SKILLS_DIR"
        exit 1
    fi

    if [ $invalid -gt 0 ]; then
        log_warn "$invalid workflow files have content issues (may still work)"
    fi

    log_success "All BMAD workflow files validated"

    if [ "$VERBOSE" = true ]; then
        echo "  Dev skill:    $DEV_WORKFLOW_DIR"
        echo "  Review skill: $REVIEW_WORKFLOW_DIR"
    fi
}

validate_workflows

# Initialize utility module (M1-M5 fixes)
if type init_utils >/dev/null 2>&1; then
    init_utils
fi

# Check branch protection (M5) - prevent commits to main/master
if [ "$NO_COMMIT" != true ] && type check_branch_protection >/dev/null 2>&1; then
    if ! check_branch_protection; then
        exit 1
    fi
fi

# Ensure directories exist
mkdir -p "$UAT_DIR"
mkdir -p "$SPRINTS_DIR"

# Initialize metrics collection
EPIC_START_TIME=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
EPIC_START_SECONDS=$(date +%s)
init_metrics

# L1: Load checkpoint for resume capability
RESUME_START_INDEX=0
if [ "$RESUME_FROM_CHECKPOINT" = true ] && type load_checkpoint >/dev/null 2>&1; then
    if load_checkpoint "$EPIC_ID" "$SPRINT_ARTIFACTS_DIR"; then
        RESUME_START_INDEX=$(get_resume_index)
        # Restore counters from checkpoint
        COMPLETED="${CHECKPOINT_COMPLETED:-0}"
        FAILED="${CHECKPOINT_FAILED:-0}"
        SKIPPED="${CHECKPOINT_SKIPPED:-0}"
        log "Will resume from story index: $RESUME_START_INDEX"
    else
        log "No checkpoint found - starting from beginning"
    fi
elif [ -n "$START_FROM" ]; then
    # Manual --start-from takes precedence
    log "Using --start-from: $START_FROM"
fi

# Initialize decision log (if module loaded)
if type init_decision_log >/dev/null 2>&1; then
    init_decision_log
fi

# Initialize regression baseline (if module loaded and not skipped)
if [ "$SKIP_REGRESSION" = false ] && type init_regression_baseline >/dev/null 2>&1; then
    init_regression_baseline
fi

# Set legacy output mode if requested
if [ "$LEGACY_OUTPUT" = true ] && type -v USE_LEGACY_OUTPUT >/dev/null 2>&1; then
    USE_LEGACY_OUTPUT=true
    log "Using legacy text-based output parsing"
fi

# Find epic file (supports both epic-39-*.md and epic-039-*.md formats)
EPIC_FILE=""
# Pad epic ID with leading zero for 3-digit format (e.g., 40 -> 040)
EPIC_ID_PADDED=$(printf "%03d" "$EPIC_ID" 2>/dev/null || echo "$EPIC_ID")
for pattern in "epic-${EPIC_ID}.md" "epic-${EPIC_ID}-"*.md "epic-${EPIC_ID_PADDED}-"*.md "epic-0${EPIC_ID}-"*.md "${EPIC_ID}.md"; do
    found=$(find "$EPICS_DIR" -name "$pattern" 2>/dev/null | head -1)
    if [ -n "$found" ]; then
        EPIC_FILE="$found"
        break
    fi
done

if [ -z "$EPIC_FILE" ] || [ ! -f "$EPIC_FILE" ]; then
    log_error "Epic file not found for: $EPIC_ID"
    log_error "Searched in: $EPICS_DIR"
    exit 1
fi

log "Found epic file: $EPIC_FILE"

# =============================================================================
# Discover Stories
# =============================================================================

log "Discovering stories..."

# Search multiple locations for story files
STORY_LOCATIONS=("$STORIES_DIR" "$SPRINT_ARTIFACTS_DIR" "$SPRINTS_DIR")
STORIES=()

# Use associative array for O(1) deduplication (bash 4+)
# Fallback to path comparison for bash 3.x
if [[ "${BASH_VERSINFO[0]}" -ge 4 ]]; then
    declare -A SEEN_STORIES
fi

# Helper function to check if story is already discovered
is_story_duplicate() {
    local file="$1"
    local normalized
    # Normalize path for comparison (handles symlinks, relative paths)
    normalized=$(cd "$(dirname "$file")" 2>/dev/null && pwd)/$(basename "$file") 2>/dev/null || normalized="$file"

    if [[ "${BASH_VERSINFO[0]}" -ge 4 ]]; then
        if [ -n "${SEEN_STORIES[$normalized]:-}" ]; then
            return 0  # Is duplicate
        fi
        SEEN_STORIES[$normalized]=1
        return 1  # Not duplicate
    else
        # Bash 3.x fallback: iterate through array
        for existing in "${STORIES[@]}"; do
            local existing_norm
            existing_norm=$(cd "$(dirname "$existing")" 2>/dev/null && pwd)/$(basename "$existing") 2>/dev/null || existing_norm="$existing"
            if [ "$normalized" = "$existing_norm" ]; then
                return 0  # Is duplicate
            fi
        done
        return 1  # Not duplicate
    fi
}

for search_dir in "${STORY_LOCATIONS[@]}"; do
    if [ ! -d "$search_dir" ]; then
        continue
    fi

    # Method 1: Stories that reference this epic in content (with word boundary)
    # Use ([^0-9]|$) to ensure "Epic: 1" doesn't match "Epic: 10" or "Epic: 100"
    while IFS= read -r -d '' file; do
        if ! is_story_duplicate "$file"; then
            STORIES+=("$file")
        fi
    done < <(grep -l -Z -E "(Epic[[:space:]]*:[[:space:]]*${EPIC_ID}([^0-9]|$)|epic-${EPIC_ID}([^0-9]|$)|Epic[[:space:]]+${EPIC_ID}([^0-9]|$))" "$search_dir"/*.md 2>/dev/null || true)

    # Method 2: {EpicNumber}-{StoryNumber}-{description}.md (e.g., 1-1-user-registration.md)
    # Use more specific pattern: EPIC_ID followed by dash and digit
    while IFS= read -r -d '' file; do
        if ! is_story_duplicate "$file"; then
            STORIES+=("$file")
        fi
    done < <(find "$search_dir" -maxdepth 1 -name "${EPIC_ID}-[0-9]*-*.md" -print0 2>/dev/null || true)

    # Method 3: story-{epic}.{seq}-*.md (BMAD standard)
    while IFS= read -r -d '' file; do
        if ! is_story_duplicate "$file"; then
            STORIES+=("$file")
        fi
    done < <(find "$search_dir" -maxdepth 1 -name "story-${EPIC_ID}.[0-9]*-*.md" -print0 2>/dev/null || true)

    # Method 4: story-{epic}-{seq}-*.md (BMAD alternate)
    while IFS= read -r -d '' file; do
        if ! is_story_duplicate "$file"; then
            STORIES+=("$file")
        fi
    done < <(find "$search_dir" -maxdepth 1 -name "story-${EPIC_ID}-[0-9]*-*.md" -print0 2>/dev/null || true)
done

if [ ${#STORIES[@]} -eq 0 ]; then
    log_error "No stories found for epic: $EPIC_ID"
    log_error "Searched in: ${STORY_LOCATIONS[*]}"
    log_error "Looking for:"
    log_error "  - Files containing 'Epic: $EPIC_ID'"
    log_error "  - Files named: ${EPIC_ID}-*-*.md (e.g., ${EPIC_ID}-1-description.md)"
    log_error "  - Files named: story-${EPIC_ID}.*.md or story-${EPIC_ID}-*.md"
    exit 1
fi

log "Found ${#STORIES[@]} stories"

# Sort stories for consistent execution order
IFS=$'\n' STORIES=($(sort -V <<<"${STORIES[*]}")); unset IFS

# Show which directories stories came from
if [ "$VERBOSE" = true ]; then
    for story in "${STORIES[@]}"; do
        echo "  - $story"
    done
fi

# =============================================================================
# Execution Functions
# =============================================================================

execute_dev_phase() {
    local story_file="$1"
    local story_id=$(basename "$story_file" .md)

    log ">>> DEV PHASE: $story_id (using step template, lean prompt)"

    # Verify step template exists, fall back to workflow files
    if [ ! -f "$DEV_STORY_STEP" ]; then
        log_warn "Step template not found: $DEV_STORY_STEP"
        log_error "BMAD dev-story step template is required"
        return 1
    fi

    # Get decision log context if available (with size limit)
    local decision_context=""
    if type get_decision_log_context >/dev/null 2>&1; then
        decision_context=$(get_decision_log_context)
        # Limit decision log to prevent context overflow
        local dec_size
        dec_size=$(get_byte_size "$decision_context")
        if [ "$dec_size" -gt 20000 ]; then
            decision_context=$(printf '%s' "$decision_context" | tail -c 20000)
            [ "$VERBOSE" = true ] && log_warn "Decision log truncated to last 20KB"
        fi
    fi

    # Get design context if available (from design phase)
    local design_context=""
    if type build_design_context_for_dev >/dev/null 2>&1; then
        design_context=$(build_design_context_for_dev "$story_id")
    fi

    # Get test spec context if available (from TDD test spec phase)
    local test_spec_context=""
    if type build_test_spec_context_for_dev >/dev/null 2>&1; then
        test_spec_context=$(build_test_spec_context_for_dev "$story_id")
    fi

    # Build extra context from in-memory sources (decision log, design, test spec)
    local extra_context=""
    if [ -n "$design_context" ]; then
        extra_context+="
$design_context
"
    fi
    if [ -n "$test_spec_context" ]; then
        extra_context+="
$test_spec_context
"
    fi
    if [ -n "$decision_context" ]; then
        extra_context+="
## Previous Implementation Context

<decision-log>
$decision_context
</decision-log>
"
    fi

    # Completion signals for dev phase
    local completion_signals="## Completion Signals

When the workflow completes successfully (all tasks done, tests pass, status set to 'review'):

1. Output a JSON result block:
\`\`\`json
{
  \"status\": \"COMPLETE\",
  \"story_id\": \"$story_id\",
  \"summary\": \"<brief description of what was implemented>\",
  \"files_changed\": [\"<list of files created/modified>\"],
  \"tests_added\": <number>,
  \"decisions\": [{\"what\": \"<key decision>\", \"why\": \"<reasoning>\"}]
}
\`\`\`

2. Then output exactly: IMPLEMENTATION COMPLETE: $story_id

If a HALT condition is triggered or implementation is blocked:

1. Output a JSON result block with status \"BLOCKED\" and issues array describing blockers
2. Then output exactly: IMPLEMENTATION BLOCKED: $story_id - [specific reason]

Stage your changes with explicit file paths: git add <file1> <file2> ...
Do NOT use 'git add -A' or 'git add .' - only stage files you created or modified."

    # Build the lean prompt using step template + automation wrapper
    local dev_prompt
    dev_prompt=$(build_automated_prompt "$DEV_STORY_STEP" "$story_file" "dev-story" "$extra_context" "$completion_signals")

    # Log prompt size in verbose mode
    log_prompt_size "$dev_prompt" "dev-phase"

    if [ "$DRY_RUN" = true ]; then
        echo "[DRY RUN] Would execute dev-story step template for $story_id"
        echo "[DRY RUN] Template: $DEV_STORY_STEP"
        return 0
    fi

    # Execute in isolated context — pipe to file to avoid memory bloat
    run_claude_to_file "$dev_prompt"
    local result
    result=$(read_phase_tail)

    # Check completion using JSON parsing with text fallback
    local completion_status
    if type check_phase_completion >/dev/null 2>&1; then
        check_phase_completion "$result" "dev" "$story_id"
        completion_status=$?
    else
        # Fallback to legacy detection
        if echo "$result" | grep -q "IMPLEMENTATION COMPLETE"; then
            completion_status=0
        elif echo "$result" | grep -q "IMPLEMENTATION BLOCKED"; then
            completion_status=1
        else
            completion_status=2
        fi
    fi

    case $completion_status in
        0)
            # Extract decisions for decision log if available
            if type get_result_decisions >/dev/null 2>&1 && type append_to_decision_log >/dev/null 2>&1; then
                local decisions=$(get_result_decisions)
                if [ "$decisions" != "[]" ] && [ -n "$decisions" ]; then
                    append_to_decision_log "DEV" "$story_id" "Decisions: $decisions"
                fi
            fi
            log_success "Dev phase complete: $story_id"
            return 0
            ;;
        1)
            log_error "Dev phase blocked: $story_id"
            if type get_result_summary >/dev/null 2>&1; then
                local summary=$(get_result_summary)
                [ -n "$summary" ] && echo "Reason: $summary"
            fi
            echo "$result" | grep "IMPLEMENTATION BLOCKED" || true
            return 1
            ;;
        *)
            log_error "Dev phase did not complete cleanly: $story_id"
            return 1
            ;;
    esac
}

# Global variable to store review findings for fix loop
LAST_REVIEW_FINDINGS=""

execute_review_phase() {
    local story_file="$1"
    local story_id=$(basename "$story_file" .md)

    # Reset findings
    LAST_REVIEW_FINDINGS=""

    log ">>> REVIEW PHASE: $story_id (using step template, fresh context)"

    # Verify step template exists
    if [ ! -f "$CODE_REVIEW_STEP" ]; then
        log_warn "Step template not found: $CODE_REVIEW_STEP"
        log_error "BMAD code-review step template is required"
        return 1
    fi

    # Review-specific extra context: adversarial mode + auto-fix policy
    local extra_context="## Adversarial Review Mode

You ARE an adversarial reviewer - find 3-10 specific issues minimum.
You are seeing this code for the FIRST TIME - review with fresh eyes.

## Automated Decision Policy

When options are presented:
- Always auto-fix HIGH and MEDIUM severity issues
- LOW severity issues: document only, do not fix"

    # Completion signals for review phase
    local completion_signals="## Completion Signals

When review passes (all HIGH/MEDIUM issues fixed, all ACs implemented, status set to 'done'):

1. Output a JSON result block:
\`\`\`json
{
  \"status\": \"PASSED\",
  \"story_id\": \"$story_id\",
  \"summary\": \"<what was reviewed and any fixes made>\",
  \"files_changed\": [\"<files modified during review>\"],
  \"issues\": []
}
\`\`\`

2. Then output exactly: REVIEW PASSED: $story_id
   Or if fixes were made: REVIEW PASSED WITH FIXES: $story_id - Fixed N issues

If review fails (unfixable issues, missing acceptance criteria that YOU cannot fix):

1. Output a JSON result block with issues:
\`\`\`json
{
  \"status\": \"FAILED\",
  \"story_id\": \"$story_id\",
  \"summary\": \"<summary of why review failed>\",
  \"issues\": [
    {\"severity\": \"HIGH\", \"description\": \"<issue>\", \"location\": \"<file:line>\"},
    {\"severity\": \"MEDIUM\", \"description\": \"<issue>\", \"location\": \"<file:line>\"}
  ]
}
\`\`\`

2. Then output the legacy findings block:
\`\`\`
REVIEW FINDINGS START
- [HIGH] Description of issue 1 (file:line if applicable)
- [MEDIUM] Description of issue 2
REVIEW FINDINGS END
\`\`\`

3. Then output exactly: REVIEW FAILED: $story_id - [summary reason]

Stage any fixes with explicit file paths: git add <file1> <file2> ..."

    # Build the lean prompt using step template + automation wrapper
    local review_prompt
    review_prompt=$(build_automated_prompt "$CODE_REVIEW_STEP" "$story_file" "code-review" "$extra_context" "$completion_signals")

    # Log prompt size in verbose mode
    log_prompt_size "$review_prompt" "review-phase"

    if [ "$DRY_RUN" = true ]; then
        echo "[DRY RUN] Would execute code-review step template for $story_id"
        echo "[DRY RUN] Template: $CODE_REVIEW_STEP"
        return 0
    fi

    # Execute in isolated context — pipe to file to avoid memory bloat
    run_claude_to_file "$review_prompt"
    local result
    result=$(read_phase_tail)

    # Check completion using JSON parsing with text fallback
    local completion_status
    if type check_phase_completion >/dev/null 2>&1; then
        check_phase_completion "$result" "review" "$story_id"
        completion_status=$?
    else
        # Fallback to legacy detection
        if echo "$result" | grep -q "REVIEW PASSED"; then
            completion_status=0
        elif echo "$result" | grep -q "REVIEW FAILED"; then
            completion_status=1
        else
            completion_status=2
        fi
    fi

    case $completion_status in
        0)
            log_success "Review passed: $story_id"
            return 0
            ;;
        1)
            log_error "Review failed: $story_id"
            echo "$result" | grep "REVIEW FAILED" || true

            # Extract findings for fix loop - try JSON first, then legacy
            if type get_result_issues >/dev/null 2>&1; then
                local json_issues=$(get_result_issues)
                if [ "$json_issues" != "[]" ] && [ -n "$json_issues" ]; then
                    # Convert JSON issues to text format for fix phase
                    LAST_REVIEW_FINDINGS=$(echo "$json_issues" | jq -r '.[] | "- [\(.severity)] \(.description) (\(.location // "unknown"))"' 2>/dev/null || echo "")
                fi
            fi

            # Fallback to legacy text extraction if JSON didn't work
            if [ -z "$LAST_REVIEW_FINDINGS" ]; then
                LAST_REVIEW_FINDINGS=$(echo "$result" | sed -n '/REVIEW FINDINGS START/,/REVIEW FINDINGS END/p' | grep -E '^\s*-\s*\[(HIGH|MEDIUM)\]' || true)
            fi

            if [ -n "$LAST_REVIEW_FINDINGS" ]; then
                log "Captured review findings for fix loop"
            fi

            return 1
            ;;
        *)
            log_warn "Review did not complete cleanly: $story_id"
            return 1
            ;;
    esac
}

execute_fix_phase() {
    local story_file="$1"
    local review_findings="$2"
    local attempt_num="$3"
    local static_analysis_context="${4:-}"  # Optional: real tooling output
    local story_id=$(basename "$story_file" .md)

    log ">>> FIX PHASE: $story_id (attempt $attempt_num, lean focused prompt)"

    # Build real tooling output section if available
    local tooling_section=""
    if [ -n "$static_analysis_context" ]; then
        tooling_section="
## Actual Tooling Output

The following are REAL errors from running the project's tooling (not AI-generated).
These must be fixed first as they represent actual compilation/test failures:

$static_analysis_context
"
    fi

    # Build a focused fix prompt - no workflow files needed, just findings + rules
    local fix_prompt="## Automated Execution Mode

### Rules
- AUTOMATED execution - do NOT pause for user confirmation at any step
- This is a TARGETED FIX session - only fix the issues listed below
- Do NOT refactor unrelated code
- Do NOT add new features
- Stage changes with explicit file paths: git add <file1> <file2> ...
- Do NOT use 'git add -A' or 'git add .'

## Fix Phase Context

This is attempt $attempt_num of 3 to fix issues identified during code review.
You MUST address ALL HIGH and MEDIUM severity issues listed below.

## Story Being Fixed

**Read this file before proceeding:** $story_file
**Story ID:** $story_id
**Fix Attempt:** $attempt_num of 3

## Review Findings to Address

The following issues were identified during code review and MUST be fixed:

<review-findings>
$review_findings
</review-findings>
$tooling_section
## Fix Process

1. Read the story file at: $story_file
2. For each issue in the review findings:
   a. Locate the problematic code
   b. Implement the fix
   c. Run relevant tests to verify
   d. Move to next issue
3. After all issues are fixed:
   a. Run full test suite
   b. Update story file Dev Agent Record with fix notes
   c. Stage changed files: git add <file1> <file2> ...

## Completion Signals

When ALL review issues are successfully fixed:

1. Output a JSON result block:
\`\`\`json
{
  \"status\": \"COMPLETE\",
  \"story_id\": \"$story_id\",
  \"summary\": \"Fixed N issues: <brief list>\",
  \"files_changed\": [\"<files modified>\"],
  \"issues\": []
}
\`\`\`

2. Then output exactly: FIX COMPLETE: $story_id - Fixed [N] issues

If unable to fix one or more issues:

1. Output a JSON result block with remaining issues:
\`\`\`json
{
  \"status\": \"FAILED\",
  \"story_id\": \"$story_id\",
  \"summary\": \"<what was fixed and what remains>\",
  \"issues\": [{\"severity\": \"HIGH\", \"description\": \"<remaining issue>\", \"location\": \"<file:line>\"}]
}
\`\`\`

2. Then output exactly: FIX INCOMPLETE: $story_id - [reason and which issues remain]

## Begin Execution

Address all review findings now. This is attempt $attempt_num of 3."

    # Check and enforce prompt size limits
    local prompt_size
    prompt_size=$(get_byte_size "$fix_prompt")

    # Log prompt size (always, not just verbose - critical for debugging)
    log "Prompt size (fix-phase): ${prompt_size}B / ${MAX_PROMPT_SIZE}B limit"

    # If prompt is too large, truncate the review findings
    if [ "$prompt_size" -gt "$MAX_PROMPT_SIZE" ]; then
        log_warn "Fix prompt exceeds size limit (${prompt_size}B > ${MAX_PROMPT_SIZE}B) - truncating"

        # Calculate how much we need to cut
        local excess=$((prompt_size - MAX_PROMPT_SIZE + 10000))  # Extra 10KB buffer

        # Truncate the review_findings (the variable content)
        local findings_size
        findings_size=$(get_byte_size "$review_findings")
        local new_findings_size=$((findings_size - excess))

        if [ "$new_findings_size" -lt 5000 ]; then
            new_findings_size=5000  # Minimum 5KB of findings
        fi

        review_findings=$(truncate_content "$review_findings" "$new_findings_size" "Review findings")

        # Rebuild the prompt with truncated content
        fix_prompt="## Automated Execution Mode

### Rules
- AUTOMATED execution - do NOT pause for user confirmation at any step
- This is a TARGETED FIX session - only fix the issues listed below
- Do NOT refactor unrelated code
- Do NOT add new features
- Stage changes with explicit file paths: git add <file1> <file2> ...
- Do NOT use 'git add -A' or 'git add .'

## Fix Phase Context

This is attempt $attempt_num of 3 to fix issues identified during code review.
You MUST address ALL HIGH and MEDIUM severity issues listed below.

**NOTE: Review findings were truncated due to size limits. Focus on the issues shown.**

## Story Being Fixed

**Read this file before proceeding:** $story_file
**Story ID:** $story_id
**Fix Attempt:** $attempt_num of 3

## Review Findings to Address

<review-findings>
$review_findings
</review-findings>
$tooling_section
## Fix Process

1. Read the story file at: $story_file
2. For each issue in the review findings:
   a. Locate the problematic code
   b. Implement the fix
   c. Run relevant tests to verify
   d. Move to next issue
3. After all issues are fixed:
   a. Run full test suite
   b. Update story file Dev Agent Record with fix notes
   c. Stage changed files: git add <file1> <file2> ...

## Begin Execution

Address all review findings now. This is attempt $attempt_num of 3."

        prompt_size=$(get_byte_size "$fix_prompt")
        log "Truncated prompt size: ${prompt_size}B"
    fi

    # Final safety check - if still too large, write to temp file and use -f flag
    if [ "$prompt_size" -gt "$MAX_PROMPT_SIZE" ]; then
        log_warn "Prompt still too large after truncation - using file-based prompt"
        local temp_prompt_file
        temp_prompt_file=$(mktemp /tmp/bmad-fix-prompt-XXXXXX.txt)
        printf '%s' "$fix_prompt" > "$temp_prompt_file"

        if [ "$DRY_RUN" = true ]; then
            echo "[DRY RUN] Would execute fix phase for $story_id (attempt $attempt_num) via file"
            rm -f "$temp_prompt_file"
            return 0
        fi

        # Pipe to file to avoid memory bloat
        run_claude_to_file "-f" "$temp_prompt_file"
        rm -f "$temp_prompt_file"
    else
        if [ "$DRY_RUN" = true ]; then
            echo "[DRY RUN] Would execute fix phase for $story_id (attempt $attempt_num)"
            return 0
        fi

        # Execute in isolated context — pipe to file to avoid memory bloat
        run_claude_to_file "$fix_prompt"
    fi

    local result
    result=$(read_phase_tail)

    # Check completion using JSON parsing with text fallback
    local completion_status
    if type check_phase_completion >/dev/null 2>&1; then
        check_phase_completion "$result" "fix" "$story_id"
        completion_status=$?
    else
        # Fallback to legacy detection
        if echo "$result" | grep -q "FIX COMPLETE"; then
            completion_status=0
        elif echo "$result" | grep -q "FIX INCOMPLETE"; then
            completion_status=1
        else
            completion_status=2
        fi
    fi

    case $completion_status in
        0)
            log_success "Fix phase complete: $story_id (attempt $attempt_num)"
            record_fix_attempt "$story_id" "$attempt_num" "success"
            return 0
            ;;
        1)
            log_error "Fix phase incomplete: $story_id (attempt $attempt_num)"
            echo "$result" | grep "FIX INCOMPLETE" || true
            record_fix_attempt "$story_id" "$attempt_num" "failed"
            return 1
            ;;
        *)
            log_warn "Fix phase did not complete cleanly: $story_id (attempt $attempt_num)"
            record_fix_attempt "$story_id" "$attempt_num" "failed"
            return 1
            ;;
    esac
}

# =============================================================================
# Static Analysis Gate - Real Tooling Verification
# =============================================================================

execute_static_analysis_gate() {
    local story_file="$1"
    local story_id=$(basename "$story_file" .md)
    local failures=0
    local failure_details=""

    # Reset failures
    LAST_STATIC_ANALYSIS_FAILURES=""

    log ">>> STATIC ANALYSIS GATE: $story_id (running real tooling)"

    if [ "$DRY_RUN" = true ]; then
        echo "[DRY RUN] Would run static analysis gate for $story_id"
        return 0
    fi

    # Detect project type and run appropriate checks
    if [ -f "$PROJECT_ROOT/package.json" ]; then
        log "Detected Node.js/TypeScript project"

        # 1. Type checking (catches type errors AI might miss)
        if grep -q '"typecheck"\|"type-check"\|"tsc"' "$PROJECT_ROOT/package.json" 2>/dev/null; then
            log "Running type check..."
            local typecheck_output
            typecheck_output=$(cd "$PROJECT_ROOT" && npm run typecheck 2>&1) || {
                local exit_code=$?
                log_error "Type check failed (exit code: $exit_code)"
                failure_details+="
### Type Check Failures
\`\`\`
$typecheck_output
\`\`\`
"
                ((failures++))
            }
            echo "$typecheck_output" >> "$LOG_FILE"
        elif [ -f "$PROJECT_ROOT/tsconfig.json" ]; then
            # Fallback: run tsc directly if tsconfig exists
            log "Running tsc directly..."
            local tsc_output
            tsc_output=$(cd "$PROJECT_ROOT" && npx tsc --noEmit 2>&1) || {
                local exit_code=$?
                log_error "TypeScript compilation failed (exit code: $exit_code)"
                failure_details+="
### TypeScript Compilation Failures
\`\`\`
$tsc_output
\`\`\`
"
                ((failures++))
            }
            echo "$tsc_output" >> "$LOG_FILE"
        fi

        # 2. Linting (catches code style/quality issues)
        if grep -q '"lint"' "$PROJECT_ROOT/package.json" 2>/dev/null; then
            log "Running lint..."
            local lint_output
            lint_output=$(cd "$PROJECT_ROOT" && npm run lint 2>&1) || {
                local exit_code=$?
                log_error "Lint failed (exit code: $exit_code)"
                failure_details+="
### Lint Failures
\`\`\`
$lint_output
\`\`\`
"
                ((failures++))
            }
            echo "$lint_output" >> "$LOG_FILE"
        fi

        # 3. Build (catches compilation errors)
        if grep -q '"build"' "$PROJECT_ROOT/package.json" 2>/dev/null; then
            log "Running build..."
            local build_output
            build_output=$(cd "$PROJECT_ROOT" && npm run build 2>&1) || {
                local exit_code=$?
                log_error "Build failed (exit code: $exit_code)"
                failure_details+="
### Build Failures
\`\`\`
$build_output
\`\`\`
"
                ((failures++))
            }
            echo "$build_output" >> "$LOG_FILE"
        fi

        # 4. Tests (catches actual test failures)
        if grep -q '"test"' "$PROJECT_ROOT/package.json" 2>/dev/null; then
            log "Running tests..."
            local test_output
            test_output=$(cd "$PROJECT_ROOT" && npm test 2>&1) || {
                local exit_code=$?

                # Check if there are NEW failures (not just pre-existing baseline failures)
                local new_failure_count=0
                if type count_new_test_failures >/dev/null 2>&1; then
                    new_failure_count=$(count_new_test_failures "$test_output")
                    new_failure_count=$(echo "$new_failure_count" | tr -d '[:space:]')
                fi

                if [ "$new_failure_count" -gt 0 ] 2>/dev/null; then
                    log_error "Tests failed with $new_failure_count NEW failure(s) (exit code: $exit_code)"

                    # Filter test output to only include failures (not all 1900+ passing tests)
                    # This prevents prompt size explosion in fix phase
                    local filtered_failures
                    if type prepare_test_failures_for_fix >/dev/null 2>&1; then
                        filtered_failures=$(prepare_test_failures_for_fix "$test_output" "$story_id")
                    else
                        # Fallback: basic extraction if module not loaded
                        filtered_failures=$(echo "$test_output" | grep -E "FAIL|Error:|AssertionError|Test Files.*failed|Tests.*failed" | head -200)
                    fi

                    failure_details+="
### Test Failures ($new_failure_count NEW, rest are pre-existing baseline)
\`\`\`
$filtered_failures
\`\`\`
"
                    ((failures++))
                else
                    # All failures are pre-existing - don't count as a failure for this story
                    log_warn "Tests exited non-zero but all failures are pre-existing (baseline). Passing gate."
                fi
            }
            echo "$test_output" >> "$LOG_FILE"
        fi

    elif [ -f "$PROJECT_ROOT/Cargo.toml" ]; then
        log "Detected Rust project"

        # Cargo check (type checking)
        log "Running cargo check..."
        local cargo_output
        cargo_output=$(cd "$PROJECT_ROOT" && cargo check 2>&1) || {
            log_error "Cargo check failed"
            failure_details+="
### Cargo Check Failures
\`\`\`
$cargo_output
\`\`\`
"
            ((failures++))
        }
        echo "$cargo_output" >> "$LOG_FILE"

        # Cargo test
        log "Running cargo test..."
        local test_output
        test_output=$(cd "$PROJECT_ROOT" && cargo test 2>&1) || {
            # Check if there are NEW failures
            local new_failure_count=0
            if type count_new_test_failures >/dev/null 2>&1; then
                new_failure_count=$(count_new_test_failures "$test_output")
                new_failure_count=$(echo "$new_failure_count" | tr -d '[:space:]')
            fi

            if [ "$new_failure_count" -gt 0 ] 2>/dev/null; then
                log_error "Cargo tests failed with $new_failure_count NEW failure(s)"

                # Filter test output to only include failures
                local filtered_failures
                if type prepare_test_failures_for_fix >/dev/null 2>&1; then
                    filtered_failures=$(prepare_test_failures_for_fix "$test_output" "$story_id")
                else
                    filtered_failures=$(echo "$test_output" | grep -E "FAILED|error\[|panicked" | head -200)
                fi

                failure_details+="
### Cargo Test Failures ($new_failure_count NEW)
\`\`\`
$filtered_failures
\`\`\`
"
                ((failures++))
            else
                log_warn "Cargo tests exited non-zero but all failures are pre-existing. Passing gate."
            fi
        }
        echo "$test_output" >> "$LOG_FILE"

    elif [ -f "$PROJECT_ROOT/go.mod" ]; then
        log "Detected Go project"

        # Go build
        log "Running go build..."
        local build_output
        build_output=$(cd "$PROJECT_ROOT" && go build ./... 2>&1) || {
            log_error "Go build failed"
            failure_details+="
### Go Build Failures
\`\`\`
$build_output
\`\`\`
"
            ((failures++))
        }
        echo "$build_output" >> "$LOG_FILE"

        # Go test
        log "Running go test..."
        local test_output
        test_output=$(cd "$PROJECT_ROOT" && go test ./... 2>&1) || {
            # Check if there are NEW failures
            local new_failure_count=0
            if type count_new_test_failures >/dev/null 2>&1; then
                new_failure_count=$(count_new_test_failures "$test_output")
                new_failure_count=$(echo "$new_failure_count" | tr -d '[:space:]')
            fi

            if [ "$new_failure_count" -gt 0 ] 2>/dev/null; then
                log_error "Go tests failed with $new_failure_count NEW failure(s)"

                # Filter test output to only include failures
                local filtered_failures
                if type prepare_test_failures_for_fix >/dev/null 2>&1; then
                    filtered_failures=$(prepare_test_failures_for_fix "$test_output" "$story_id")
                else
                    filtered_failures=$(echo "$test_output" | grep -E "FAIL|panic:|--- FAIL" | head -200)
                fi

                failure_details+="
### Go Test Failures ($new_failure_count NEW)
\`\`\`
$filtered_failures
\`\`\`
"
                ((failures++))
            else
                log_warn "Go tests exited non-zero but all failures are pre-existing. Passing gate."
            fi
        }
        echo "$test_output" >> "$LOG_FILE"

    elif [ -f "$PROJECT_ROOT/requirements.txt" ] || [ -f "$PROJECT_ROOT/pyproject.toml" ]; then
        log "Detected Python project"

        # pytest
        if command -v pytest >/dev/null 2>&1; then
            log "Running pytest..."
            local test_output
            test_output=$(cd "$PROJECT_ROOT" && pytest 2>&1) || {
                # Check if there are NEW failures
                local new_failure_count=0
                if type count_new_test_failures >/dev/null 2>&1; then
                    new_failure_count=$(count_new_test_failures "$test_output")
                    new_failure_count=$(echo "$new_failure_count" | tr -d '[:space:]')
                fi

                if [ "$new_failure_count" -gt 0 ] 2>/dev/null; then
                    log_error "Pytest failed with $new_failure_count NEW failure(s)"

                    # Filter test output to only include failures
                    local filtered_failures
                    if type prepare_test_failures_for_fix >/dev/null 2>&1; then
                        filtered_failures=$(prepare_test_failures_for_fix "$test_output" "$story_id")
                    else
                        filtered_failures=$(echo "$test_output" | grep -E "FAILED|ERROR|AssertionError|=+ FAILURES =+" | head -200)
                    fi

                    failure_details+="
### Pytest Failures ($new_failure_count NEW)
\`\`\`
$filtered_failures
\`\`\`
"
                    ((failures++))
                else
                    log_warn "Pytest exited non-zero but all failures are pre-existing. Passing gate."
                fi
            }
            echo "$test_output" >> "$LOG_FILE"
        fi

        # mypy (if available)
        if command -v mypy >/dev/null 2>&1 && [ -f "$PROJECT_ROOT/mypy.ini" ] || [ -f "$PROJECT_ROOT/setup.cfg" ]; then
            log "Running mypy..."
            local mypy_output
            mypy_output=$(cd "$PROJECT_ROOT" && mypy . 2>&1) || {
                log_error "Mypy type check failed"
                failure_details+="
### Mypy Type Check Failures
\`\`\`
$mypy_output
\`\`\`
"
                ((failures++))
            }
            echo "$mypy_output" >> "$LOG_FILE"
        fi

    else
        log_warn "No recognized project type found - skipping static analysis"
        return 0
    fi

    # Check results
    if [ $failures -gt 0 ]; then
        log_error "Static analysis gate failed with $failures issue(s)"

        # Store failures for fix phase
        LAST_STATIC_ANALYSIS_FAILURES="## Static Analysis Failures for $story_id

The following REAL tooling failures were detected. These are NOT AI-generated - they are actual errors from running the project's tooling.

$failure_details

## Instructions

Fix ALL the errors shown above. These are real compilation/test failures that must be resolved."

        add_metrics_issue "$story_id" "static_analysis_failed" "Static analysis gate failed with $failures issue(s)"
        return 1
    fi

    log_success "Static analysis gate passed: $story_id"
    return 0
}

# Maximum number of fix attempts before giving up
MAX_FIX_ATTEMPTS=3
MAX_ARCH_FIX_ATTEMPTS=2
MAX_TEST_QUALITY_FIX_ATTEMPTS=2
MAX_TRACEABILITY_FIX_ATTEMPTS=3
MAX_STATIC_ANALYSIS_FIX_ATTEMPTS=3

# Global variable to store arch violations for fix loop
LAST_ARCH_VIOLATIONS=""

# Global variable to store test quality issues for fix loop
LAST_TEST_QUALITY_ISSUES=""

# Global variable to store traceability gaps for fix loop
LAST_TRACEABILITY_GAPS=""

# Global variable to store static analysis failures for fix loop
LAST_STATIC_ANALYSIS_FAILURES=""

execute_arch_compliance_phase() {
    local story_file="$1"
    local story_id=$(basename "$story_file" .md)

    # Reset violations
    LAST_ARCH_VIOLATIONS=""

    log ">>> ARCH COMPLIANCE: $story_id (using step template, fresh context)"

    # Verify step template exists
    if [ ! -f "$ARCH_COMPLIANCE_STEP" ]; then
        log_warn "Step template not found: $ARCH_COMPLIANCE_STEP"
        log_error "BMAD arch compliance step template is required"
        return 1
    fi

    # Load architecture file path (pass as path, don't embed)
    local arch_file=""
    for search_path in "$PROJECT_ROOT/docs/architecture.md" "$PROJECT_ROOT/docs/architecture/architecture.md" "$PROJECT_ROOT/architecture.md"; do
        if [ -f "$search_path" ]; then
            arch_file="$search_path"
            break
        fi
    done

    if [ -z "$arch_file" ]; then
        log_warn "No architecture.md found - skipping compliance check"
        return 0
    fi

    # Extra context: architecture file path for Claude to read on-demand
    local extra_context="## Architecture Reference

**Read the architecture document at:** $arch_file

Use this to validate compliance. Focus only on structural/architectural issues, not code quality."

    # Completion signals for arch compliance
    local completion_signals="## Completion Signals

If compliant (no HIGH/MEDIUM violations or all fixed):
Output: ARCH COMPLIANT: $story_id
Or: ARCH COMPLIANT WITH FIXES: $story_id - Fixed N violations

If HIGH violations cannot be fixed:
First output:
\`\`\`
ARCH VIOLATIONS START
- [HIGH] Description (file:line)
- [MEDIUM] Description (file:line)
ARCH VIOLATIONS END
\`\`\`
Then: ARCH VIOLATIONS: $story_id - [summary]

Stage any fixes with: git add <file1> <file2> ..."

    # Build the lean prompt using step template + automation wrapper
    local arch_prompt
    arch_prompt=$(build_automated_prompt "$ARCH_COMPLIANCE_STEP" "$story_file" "arch-compliance" "$extra_context" "$completion_signals")

    # Log prompt size in verbose mode
    log_prompt_size "$arch_prompt" "arch-compliance"

    if [ "$DRY_RUN" = true ]; then
        echo "[DRY RUN] Would execute arch compliance step template for $story_id"
        echo "[DRY RUN] Template: $ARCH_COMPLIANCE_STEP"
        return 0
    fi

    # Pipe to file to avoid memory bloat
    run_claude_to_file "$arch_prompt"
    local result
    result=$(read_phase_tail)

    if echo "$result" | grep -q "ARCH COMPLIANT"; then
        log_success "Architecture compliant: $story_id"
        return 0
    elif echo "$result" | grep -q "ARCH VIOLATIONS"; then
        log_error "Architecture violations found: $story_id"
        echo "$result" | grep "ARCH VIOLATIONS"

        # Extract violations for fix loop
        LAST_ARCH_VIOLATIONS=$(echo "$result" | sed -n '/ARCH VIOLATIONS START/,/ARCH VIOLATIONS END/p' | grep -E '^\s*-\s*\[(HIGH|MEDIUM)\]' || true)

        if [ -n "$LAST_ARCH_VIOLATIONS" ]; then
            log "Captured architecture violations for fix loop"
        fi

        return 1
    else
        log_warn "Architecture check did not complete cleanly: $story_id"
        return 0  # Don't block on unclear result
    fi
}

execute_test_quality_phase() {
    local story_file="$1"
    local story_id=$(basename "$story_file" .md)

    # Reset issues
    LAST_TEST_QUALITY_ISSUES=""

    log ">>> TEST QUALITY: $story_id (using step template, fresh context)"

    # Verify step template exists
    if [ ! -f "$TEST_QUALITY_STEP" ]; then
        log_warn "Step template not found: $TEST_QUALITY_STEP"
        log_error "BMAD test quality step template is required"
        return 1
    fi

    # Completion signals for test quality phase
    local completion_signals="## Completion Signals

If quality approved (score ≥70, no critical/high remaining):
Output: TEST QUALITY APPROVED: $story_id - Score: N/100
Or: TEST QUALITY APPROVED WITH FIXES: $story_id - Score: N/100, Fixed M issues

If quality concerns (score 60-69):
Output: TEST QUALITY CONCERNS: $story_id - Score: N/100

If quality failed (score <60 or unfixable critical issues):
First output:
\`\`\`
TEST QUALITY ISSUES START
- [CRITICAL] Description (file:line)
- [HIGH] Description (file:line)
TEST QUALITY ISSUES END
\`\`\`
Then: TEST QUALITY FAILED: $story_id - Score: N/100

Stage any fixes with: git add <file1> <file2> ..."

    # Build the lean prompt using step template + automation wrapper
    local quality_prompt
    quality_prompt=$(build_automated_prompt "$TEST_QUALITY_STEP" "$story_file" "test-quality" "" "$completion_signals")

    # Log prompt size in verbose mode
    log_prompt_size "$quality_prompt" "test-quality"

    if [ "$DRY_RUN" = true ]; then
        echo "[DRY RUN] Would execute test quality step template for $story_id"
        echo "[DRY RUN] Template: $TEST_QUALITY_STEP"
        return 0
    fi

    # Pipe to file to avoid memory bloat
    run_claude_to_file "$quality_prompt"
    local result
    result=$(read_phase_tail)

    if echo "$result" | grep -q "TEST QUALITY APPROVED"; then
        log_success "Test quality approved: $story_id"
        return 0
    elif echo "$result" | grep -q "TEST QUALITY CONCERNS"; then
        log_warn "Test quality concerns: $story_id"
        return 0  # Concerns don't block
    elif echo "$result" | grep -q "TEST QUALITY FAILED"; then
        log_error "Test quality failed: $story_id"
        echo "$result" | grep "TEST QUALITY FAILED"

        # Extract issues for fix loop
        LAST_TEST_QUALITY_ISSUES=$(echo "$result" | sed -n '/TEST QUALITY ISSUES START/,/TEST QUALITY ISSUES END/p' | grep -E '^\s*-\s*\[(CRITICAL|HIGH)\]' || true)

        if [ -n "$LAST_TEST_QUALITY_ISSUES" ]; then
            log "Captured test quality issues for fix loop"
        fi

        return 1
    else
        log_warn "Test quality check did not complete cleanly: $story_id"
        return 0  # Don't block on unclear result
    fi
}

execute_traceability_phase() {
    log ">>> TRACEABILITY CHECK: Epic $EPIC_ID (using step template, fresh context)"

    # Reset gaps
    LAST_TRACEABILITY_GAPS=""

    # Ensure output directory exists
    mkdir -p "$TRACEABILITY_DIR"

    # Verify step template exists
    if [ ! -f "$TRACEABILITY_STEP" ]; then
        log_warn "Step template not found: $TRACEABILITY_STEP"
        log_error "BMAD traceability step template is required"
        return 1
    fi

    # Build story file paths list instead of embedding all contents
    local story_count=${#STORIES[@]}
    local story_paths_list=""
    for story_file in "${STORIES[@]}"; do
        local sid=$(basename "$story_file" .md)
        story_paths_list+="- $sid: $story_file
"
    done

    # Load step template and perform substitutions
    local template
    template=$(cat "$TRACEABILITY_STEP")
    template="${template//\{epic_id\}/$EPIC_ID}"
    template="${template//\{date\}/$(date '+%Y-%m-%d')}"

    # Extra context: epic and story file paths for Claude to read on-demand
    local extra_context="## Epic Definition

**Read the epic file at:** $EPIC_FILE
**Epic ID:** $EPIC_ID

## Completed Stories ($story_count total)

Read each story file as needed during analysis:

$story_paths_list
## Output Location

Save traceability matrix to: $TRACEABILITY_DIR/epic-${EPIC_ID}-traceability.md"

    # Completion signals for traceability phase
    local completion_signals="## Completion Signals

If PASS (P0=100%, P1≥90%):
Output: TRACEABILITY PASS: $EPIC_ID - P0: N%, P1: M%, Overall: O%

If CONCERNS (P0=100%, P1 80-89%):
Output: TRACEABILITY CONCERNS: $EPIC_ID - P1 at N% (below 90%)

If FAIL (P0<100% or P1<80%):
First output gaps for self-healing:
\`\`\`
TRACEABILITY GAPS START
GAP: {story_id}|AC-{n}|{priority}|{description}|{recommended_test_id}|{test_level}
SPEC:
  Given: {precondition}
  When: {action}
  Then: {expected result}
GAP: ...
TRACEABILITY GAPS END
\`\`\`
Then: TRACEABILITY FAIL: $EPIC_ID - P0: N%, P1: M%, X critical gaps"

    # Build the prompt - traceability doesn't use a story_file, so pass EPIC_FILE
    local trace_prompt="## Automated Execution Mode

### Rules
- AUTOMATED execution - do NOT pause for user confirmation at any step
- When instructions say 'ask user', make a reasonable autonomous decision
- Complete the ENTIRE workflow in a single execution

### Execution Variables (Pre-resolved)
- epic_id: $EPIC_ID
- epic_file: $EPIC_FILE
- story_count: $story_count
- project_root: $PROJECT_ROOT
- traceability_dir: $TRACEABILITY_DIR
- date: $(date '+%Y-%m-%d')

## Step Template Instructions

$template

$extra_context

$completion_signals

## Begin Execution

Analyze traceability now. Read story files on-demand as needed."

    # Log prompt size in verbose mode
    log_prompt_size "$trace_prompt" "traceability"

    if [ "$DRY_RUN" = true ]; then
        echo "[DRY RUN] Would execute traceability step template for Epic $EPIC_ID"
        echo "[DRY RUN] Template: $TRACEABILITY_STEP"
        return 0
    fi

    # Pipe to file to avoid memory bloat
    run_claude_to_file "$trace_prompt"
    local result
    result=$(read_phase_tail)

    if echo "$result" | grep -q "TRACEABILITY PASS"; then
        log_success "Traceability passed: Epic $EPIC_ID"
        return 0
    elif echo "$result" | grep -q "TRACEABILITY CONCERNS"; then
        log_warn "Traceability concerns: Epic $EPIC_ID"
        return 0  # Concerns don't block
    elif echo "$result" | grep -q "TRACEABILITY FAIL"; then
        log_error "Traceability failed: Epic $EPIC_ID"
        echo "$result" | grep "TRACEABILITY FAIL"

        # Extract gaps for self-healing
        LAST_TRACEABILITY_GAPS=$(echo "$result" | sed -n '/TRACEABILITY GAPS START/,/TRACEABILITY GAPS END/p' || true)

        if [ -n "$LAST_TRACEABILITY_GAPS" ]; then
            log "Captured traceability gaps for self-healing"
        fi

        return 1
    else
        log_warn "Traceability check did not complete cleanly"
        return 0  # Don't block on unclear result
    fi
}

execute_traceability_fix_phase() {
    local gaps="$1"
    local attempt_num="$2"

    log ">>> TRACEABILITY FIX: Epic $EPIC_ID (attempt $attempt_num, generating missing tests)"

    local fix_prompt="You are a Test Architect generating tests to close coverage gaps.

## Your Task

Generate missing tests for Epic: $EPIC_ID (attempt $attempt_num of $MAX_TRACEABILITY_FIX_ATTEMPTS)

### CRITICAL RULES
- Generate ONLY the tests specified in the gaps
- Follow existing test patterns in the codebase
- Run each test to verify it passes
- Stage changes with explicit paths: git add <file1> <file2> ...

## Gaps to Address

$gaps

## Instructions

For each GAP:
1. Parse the specification (Given/When/Then)
2. Create the test file if needed
3. Implement the test following the spec
4. Use existing patterns from codebase
5. Run the test
6. Stage changes

## Completion Signals

If all tests generated:
Output: TEST GENERATION COMPLETE: Generated N tests

If partial success:
Output: TEST GENERATION PARTIAL: Generated N of M tests - [reason]

## Begin Execution

Generate missing tests now."

    if [ "$DRY_RUN" = true ]; then
        echo "[DRY RUN] Would generate missing tests for Epic $EPIC_ID (attempt $attempt_num)"
        return 0
    fi

    # Pipe to file to avoid memory bloat
    run_claude_to_file "$fix_prompt"
    local result
    result=$(read_phase_tail)

    if echo "$result" | grep -q "TEST GENERATION COMPLETE"; then
        log_success "Test generation complete for Epic $EPIC_ID"
        return 0
    elif echo "$result" | grep -q "TEST GENERATION PARTIAL"; then
        log_warn "Partial test generation for Epic $EPIC_ID"
        return 1
    else
        log_error "Test generation did not complete cleanly"
        return 1
    fi
}

execute_story_with_fix_loop() {
    local story_file="$1"
    local story_id=$(basename "$story_file" .md)
    local fix_attempt=0
    local arch_fix_attempt=0
    local test_quality_fix_attempt=0
    local needs_fixes=false

    # DESIGN PHASE (Context 0) - Pre-implementation planning
    if [ "$SKIP_DESIGN" = false ] && type execute_design_phase >/dev/null 2>&1; then
        if ! execute_design_phase "$story_file"; then
            log_warn "Design phase did not complete cleanly for $story_id - proceeding"
            # Don't fail - design is advisory
        fi
    fi

    # TDD PHASES (Test-First Development)
    # Enabled by default, skip with --skip-tdd or individual --skip-test-spec/--skip-test-impl
    if [ "$SKIP_TDD" = false ]; then

        # TEST SPEC PHASE - Generate test specifications from acceptance criteria
        if [ "$SKIP_TEST_SPEC" = false ] && type execute_test_spec_phase >/dev/null 2>&1; then
            if ! execute_test_spec_phase "$story_file"; then
                log_warn "Test spec phase did not complete cleanly for $story_id - proceeding"
                # Don't fail - spec generation is advisory
            fi
        fi

        # TEST IMPL PHASE - Create failing tests from specifications
        if [ "$SKIP_TEST_IMPL" = false ] && type execute_test_impl_phase >/dev/null 2>&1; then
            # Only run if we have test specs (either just generated or loaded from file)
            if [ -n "$LAST_TEST_SPEC" ] || [ -f "$TEST_SPEC_DIR/${story_id}-test-spec.md" ] 2>/dev/null; then
                if ! execute_test_impl_phase "$story_file"; then
                    log_warn "Test impl phase did not complete cleanly for $story_id - proceeding"
                    # Don't fail - test impl is advisory in first iteration
                fi
            else
                log_warn "No test specifications available - skipping test implementation"
            fi
        fi

        # TEST VERIFICATION PHASE - Verify tests fail appropriately
        if [ "$SKIP_TEST_IMPL" = false ] && type execute_test_verification_phase >/dev/null 2>&1; then
            # Only verify if we just created tests
            if type get_last_test_spec >/dev/null 2>&1 && [ -n "$(get_last_test_spec)" ]; then
                if ! execute_test_verification_phase "$story_file"; then
                    log_warn "Test verification had issues - proceeding to dev phase"
                    # Don't fail - verification is informational
                fi
            fi
        fi
    fi

    # Capture test failure baseline before dev phase (for filtering in fix phase)
    # This allows us to distinguish new failures from pre-existing ones
    if type capture_failure_baseline >/dev/null 2>&1; then
        capture_failure_baseline "$story_id"
    fi

    # DEV PHASE (Context 1) - Now implements to make tests pass (if TDD enabled)
    if ! execute_dev_phase "$story_file"; then
        log_error "Dev phase failed for $story_id"
        return 1
    fi

    # STATIC ANALYSIS GATE (Real Tooling) - Per Story
    local static_analysis_fix_attempt=0
    if [ "$SKIP_STATIC_ANALYSIS" = false ]; then
        while true; do
            if execute_static_analysis_gate "$story_file"; then
                log_success "Static analysis passed: $story_id"
                break
            fi

            # Check if we have failures to fix
            if [ -z "$LAST_STATIC_ANALYSIS_FAILURES" ]; then
                log_warn "Static analysis unclear, proceeding anyway"
                break
            fi

            ((static_analysis_fix_attempt++))
            if [ $static_analysis_fix_attempt -gt $MAX_STATIC_ANALYSIS_FIX_ATTEMPTS ]; then
                log_error "Max static analysis fix attempts ($MAX_STATIC_ANALYSIS_FIX_ATTEMPTS) reached for $story_id"
                add_metrics_issue "$story_id" "static_analysis_max_retries" "Static analysis failures after $MAX_STATIC_ANALYSIS_FIX_ATTEMPTS attempts"
                # Fail the story - real tooling errors must be fixed
                return 1
            fi

            log_warn "Static analysis failed, attempting fix $static_analysis_fix_attempt of $MAX_STATIC_ANALYSIS_FIX_ATTEMPTS"
            # Use the regular fix phase with static analysis context
            if ! execute_fix_phase "$story_file" "$LAST_STATIC_ANALYSIS_FAILURES" "$static_analysis_fix_attempt"; then
                log_warn "Static analysis fix incomplete, re-running gate..."
            fi
        done
    fi

    # ARCHITECTURE COMPLIANCE CHECK (Context 2) - Per Story
    if [ "$SKIP_ARCH" = false ]; then
        while true; do
            if execute_arch_compliance_phase "$story_file"; then
                log_success "Architecture compliant: $story_id"
                break
            fi

            # Check if we have violations to fix
            if [ -z "$LAST_ARCH_VIOLATIONS" ]; then
                log_warn "Arch check unclear, proceeding anyway"
                break
            fi

            ((arch_fix_attempt++))
            if [ $arch_fix_attempt -gt $MAX_ARCH_FIX_ATTEMPTS ]; then
                log_error "Max arch fix attempts ($MAX_ARCH_FIX_ATTEMPTS) reached for $story_id"
                add_metrics_issue "$story_id" "arch_violations" "Architecture violations after $MAX_ARCH_FIX_ATTEMPTS attempts"
                # Don't fail the story, proceed with violations documented
                break
            fi

            log_warn "Arch violations found, attempting fix $arch_fix_attempt of $MAX_ARCH_FIX_ATTEMPTS"
            # Use the regular fix phase with arch context
            if ! execute_fix_phase "$story_file" "$LAST_ARCH_VIOLATIONS" "$arch_fix_attempt"; then
                log_warn "Arch fix incomplete, continuing..."
            fi
        done
    fi

    # REVIEW + FIX LOOP
    while true; do
        # REVIEW PHASE (Fresh Context)
        if execute_review_phase "$story_file"; then
            # Review passed - proceed to test quality
            log_success "Story passed review: $story_id"
            break
        fi

        # Review failed - check if we have findings to fix
        if [ -z "$LAST_REVIEW_FINDINGS" ]; then
            log_error "Review failed but no findings captured for $story_id"
            return 1
        fi

        # First failure - record that this story required fixes
        if [ "$needs_fixes" = false ]; then
            needs_fixes=true
            record_story_required_fixes "$story_id"
        fi

        # Check if we've exhausted fix attempts
        ((fix_attempt++))
        if [ $fix_attempt -gt $MAX_FIX_ATTEMPTS ]; then
            log_error "Max fix attempts ($MAX_FIX_ATTEMPTS) reached for $story_id"
            record_fix_attempt "$story_id" "$fix_attempt" "max_retries"
            add_metrics_issue "$story_id" "max_retries_exhausted" "Failed after $MAX_FIX_ATTEMPTS fix attempts"
            return 1
        fi

        log_warn "Review failed, attempting fix $fix_attempt of $MAX_FIX_ATTEMPTS for $story_id"

        # FIX PHASE (New Context)
        if ! execute_fix_phase "$story_file" "$LAST_REVIEW_FINDINGS" "$fix_attempt"; then
            log_error "Fix phase failed for $story_id (attempt $fix_attempt)"
            # Continue to next attempt - the review will catch remaining issues
        fi

        # Loop back to review phase to verify fixes
        log "Re-running review after fix attempt $fix_attempt..."
    done

    # TEST QUALITY REVIEW (Fresh Context) - Per Story
    if [ "$SKIP_TEST_QUALITY" = false ]; then
        while true; do
            if execute_test_quality_phase "$story_file"; then
                log_success "Test quality approved: $story_id"
                break
            fi

            # Check if we have issues to fix
            if [ -z "$LAST_TEST_QUALITY_ISSUES" ]; then
                log_warn "Test quality check unclear, proceeding anyway"
                break
            fi

            ((test_quality_fix_attempt++))
            if [ $test_quality_fix_attempt -gt $MAX_TEST_QUALITY_FIX_ATTEMPTS ]; then
                log_warn "Max test quality fix attempts ($MAX_TEST_QUALITY_FIX_ATTEMPTS) reached for $story_id"
                add_metrics_issue "$story_id" "test_quality_concerns" "Test quality issues after $MAX_TEST_QUALITY_FIX_ATTEMPTS attempts"
                # Don't fail the story, proceed with concerns documented
                break
            fi

            log_warn "Test quality issues found, attempting fix $test_quality_fix_attempt of $MAX_TEST_QUALITY_FIX_ATTEMPTS"
            # Use the regular fix phase with test quality context
            if ! execute_fix_phase "$story_file" "$LAST_TEST_QUALITY_ISSUES" "$test_quality_fix_attempt"; then
                log_warn "Test quality fix incomplete, continuing..."
            fi
        done
    fi

    # REGRESSION GATE (if module loaded and not skipped)
    if [ "$SKIP_REGRESSION" = false ] && type execute_regression_gate >/dev/null 2>&1; then
        if ! execute_regression_gate "$story_id"; then
            log_error "Regression detected in $story_id"
            add_metrics_issue "$story_id" "regression_detected" "Test count decreased after implementation"
            # Don't fail the story - regression is a warning that should be investigated
            log_warn "Proceeding despite regression - investigate manually"
        fi
    fi

    return 0
}

commit_story() {
    local story_id="$1"

    if [ "$NO_COMMIT" = true ]; then
        log "Skipping commit (--no-commit)"
        return 0
    fi

    if [ "$DRY_RUN" = true ]; then
        echo "[DRY RUN] Would commit: feat(epic-$EPIC_ID): complete $story_id"
        return 0
    fi

    # Safety check for sensitive files before committing
    if ! check_sensitive_files; then
        log_error "Commit aborted due to sensitive files. Fix .gitignore or use --no-commit"
        return 1
    fi

    # Use git add -u (tracked files only) instead of git add -A
    # This prevents accidentally staging untracked files like .env, credentials, etc.
    # Claude prompts instruct it to stage specific new files explicitly
    git add -u

    # Check if there's anything to commit
    local staged_count
    staged_count=$(git diff --cached --name-only 2>/dev/null | wc -l | tr -d ' ')

    if [ "$staged_count" -eq 0 ]; then
        log_warn "Nothing to commit for $story_id"
        return 0
    fi

    git commit -m "feat(epic-$EPIC_ID): complete $story_id" || {
        log_warn "Commit failed for $story_id"
        return 1
    }

    log_success "Committed: $story_id"
}

generate_uat() {
    log ">>> GENERATING UAT DOCUMENT (using step template, fresh context)"

    # Verify step template exists
    if [ ! -f "$UAT_STEP_TEMPLATE" ]; then
        log_warn "Step template not found: $UAT_STEP_TEMPLATE"
        log_error "BMAD UAT step template is required"
        return 1
    fi

    # Count stories and build paths list
    local story_count=${#STORIES[@]}
    local story_paths_list=""
    for story_file in "${STORIES[@]}"; do
        local sid=$(basename "$story_file" .md)
        story_paths_list+="- $sid: $story_file
"
    done

    # Load step template and perform substitutions
    local template
    template=$(cat "$UAT_STEP_TEMPLATE")
    template="${template//\{epic_id\}/$EPIC_ID}"
    template="${template//\{date\}/$(date '+%Y-%m-%d')}"
    template="${template//\{story_count\}/$story_count}"

    # Extra context: file paths + doc template path + guidelines
    local extra_context="## Epic Definition

**Read the epic file at:** $EPIC_FILE
**Epic ID:** $EPIC_ID

## Completed Stories ($story_count total)

Read each story file as needed:

$story_paths_list
## UAT Document Template

**Read the UAT document template at:** $UAT_DOC_TEMPLATE
Follow this template structure for the generated document.

## Output

1. Generate the complete UAT document following the template structure
2. Save to: $UAT_DIR/epic-${EPIC_ID}-uat.md
3. Output exactly: UAT GENERATED: $UAT_DIR/epic-${EPIC_ID}-uat.md"

    # Build the prompt
    local uat_prompt="## Automated Execution Mode

### Rules
- AUTOMATED execution - do NOT pause for user confirmation at any step
- Write for NON-TECHNICAL users who can use software but don't know how it's built
- Focus on user journeys, not implementation details
- Generate clear, actionable test scenarios with binary pass/fail criteria
- Complete the entire document in a single execution

### Execution Variables (Pre-resolved)
- epic_id: $EPIC_ID
- epic_file: $EPIC_FILE
- story_count: $story_count
- project_root: $PROJECT_ROOT
- output_path: $UAT_DIR/epic-${EPIC_ID}-uat.md
- date: $(date '+%Y-%m-%d')

## Step Template Instructions

$template

$extra_context

## Begin Execution

Generate the UAT document now. Read story files on-demand as needed."

    # Log prompt size in verbose mode
    log_prompt_size "$uat_prompt" "uat-generation"

    if [ "$DRY_RUN" = true ]; then
        echo "[DRY RUN] Would generate UAT document using step template"
        echo "[DRY RUN] Template: $UAT_STEP_TEMPLATE"
        return 0
    fi

    # Pipe to file to avoid memory bloat
    run_claude_to_file "$uat_prompt"
    local result
    result=$(read_phase_tail)

    if echo "$result" | grep -q "UAT GENERATED"; then
        log_success "UAT document generated"
    else
        log_warn "UAT generation may not have completed cleanly"
    fi

    # Commit UAT document
    if [ "$NO_COMMIT" = false ]; then
        git add "$UAT_DIR/epic-${EPIC_ID}-uat.md" 2>/dev/null || true
        git commit -m "docs(epic-$EPIC_ID): add UAT document" 2>/dev/null || true
    fi
}

# =============================================================================
# Main Execution Loop
# =============================================================================

log "=========================================="
log "Starting execution of ${#STORIES[@]} stories"
log "=========================================="

# Initialize counters (may already be restored from metrics or checkpoint)
: "${COMPLETED:=0}"
: "${FAILED:=0}"
: "${SKIPPED:=0}"
START_TIME=$(date +%s)
STARTED=false

# Track current story index for checkpoint/resume
STORY_INDEX=0

for story_file in "${STORIES[@]}"; do
    story_id=$(basename "$story_file" .md)

    # L1: Resume capability - skip stories before resume index
    if [ "$RESUME_START_INDEX" -gt 0 ] && [ "$STORY_INDEX" -lt "$RESUME_START_INDEX" ]; then
        log_warn "Skipping $story_id (resuming from index $RESUME_START_INDEX)"
        ((STORY_INDEX++))
        CURRENT_STORY_INDEX=$STORY_INDEX
        continue
    fi

    # --start-from: Skip stories until we reach the specified one
    if [ -n "$START_FROM" ] && [ "$STARTED" = false ]; then
        if [[ "$story_id" == *"$START_FROM"* ]]; then
            STARTED=true
        else
            log_warn "Skipping $story_id (waiting for $START_FROM)"
            # Only count as skipped if this is a fresh run (no prior metrics)
            if [ "${METRICS_RESUMED:-false}" = false ]; then
                ((SKIPPED++))
                update_story_metrics "skipped"
            fi
            ((STORY_INDEX++))
            CURRENT_STORY_INDEX=$STORY_INDEX
            continue
        fi
    fi

    # --skip-done: Skip stories with Status: done (case-insensitive)
    if [ "$SKIP_DONE" = true ]; then
        if grep -qi "^Status:.*done" "$story_file" 2>/dev/null; then
            log_warn "Skipping $story_id (Status: Done)"
            # Only count as skipped if this is a fresh run (no prior metrics)
            if [ "${METRICS_RESUMED:-false}" = false ]; then
                ((SKIPPED++))
                update_story_metrics "skipped"
            fi
            ((STORY_INDEX++))
            CURRENT_STORY_INDEX=$STORY_INDEX
            continue
        fi
    fi

    echo ""
    log "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    log "Story: $story_id"
    log "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

    # Execute story with fix loop (dev → review → fix loop if needed)
    if [ "$SKIP_REVIEW" = false ]; then
        # Full flow: dev → review (with fix loop if issues found)
        if ! execute_story_with_fix_loop "$story_file"; then
            log_error "Story execution failed for $story_id"
            ((FAILED++))
            ((STORY_INDEX++))
            CURRENT_STORY_INDEX=$STORY_INDEX
            update_story_metrics "failed"
            # Save checkpoint on failure too
            if type save_checkpoint >/dev/null 2>&1; then
                save_checkpoint "$STORY_INDEX" "$story_id" "$COMPLETED" "$FAILED" "$SKIPPED"
            fi
            # Flush log to repo after story failure
            flush_log_to_repo
            continue
        fi
    else
        # Skip review: just run dev phase
        if ! execute_dev_phase "$story_file"; then
            log_error "Dev phase failed for $story_id"
            ((FAILED++))
            ((STORY_INDEX++))
            CURRENT_STORY_INDEX=$STORY_INDEX
            update_story_metrics "failed"
            add_metrics_issue "$story_id" "dev_phase_failed" "Development phase did not complete"
            # Save checkpoint on failure too
            if type save_checkpoint >/dev/null 2>&1; then
                save_checkpoint "$STORY_INDEX" "$story_id" "$COMPLETED" "$FAILED" "$SKIPPED"
            fi
            # Flush log to repo after story failure
            flush_log_to_repo
            continue
        fi
    fi

    # MARK STORY AS DONE
    # Update both story file and sprint-status.yaml after successful review
    if [ "$DRY_RUN" = false ]; then
        mark_story_done "$story_file"
    else
        echo "[DRY RUN] Would mark story as done: $story_id"
    fi

    # COMMIT
    commit_story "$story_id"

    ((COMPLETED++))
    update_story_metrics "completed"
    log_success "Story complete: $story_id ($COMPLETED/${#STORIES[@]})"

    # Kill orphaned node/test processes between stories
    kill_orphaned_test_processes

    # Truncate log file between stories to prevent unbounded growth.
    # Each Claude phase appends via tee -a, so across 6-7 phases per story
    # the log can grow to hundreds of MB. Keep only the last 64KB as context.
    if [ -f "$LOG_FILE" ]; then
        tail -c 65536 "$LOG_FILE" > "${LOG_FILE}.tmp" 2>/dev/null && mv "${LOG_FILE}.tmp" "$LOG_FILE" 2>/dev/null || true
    fi

    # Track progress for checkpoint/resume
    ((STORY_INDEX++))
    CURRENT_STORY_INDEX=$STORY_INDEX

    # L1: Save checkpoint after each completed story
    if type save_checkpoint >/dev/null 2>&1; then
        save_checkpoint "$STORY_INDEX" "$story_id" "$COMPLETED" "$FAILED" "$SKIPPED"
    fi
done

# =============================================================================
# Traceability Check (Per-Epic, with Self-Healing)
# =============================================================================

if [ "$SKIP_TRACEABILITY" = false ]; then
    echo ""
    log "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    log "Requirements Traceability Check"
    log "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

    trace_fix_attempt=0
    while true; do
        if execute_traceability_phase; then
            log_success "Traceability check passed for Epic $EPIC_ID"
            break
        fi

        # Check if we have gaps to fix
        if [ -z "$LAST_TRACEABILITY_GAPS" ]; then
            log_warn "Traceability check unclear, proceeding to UAT"
            break
        fi

        ((trace_fix_attempt++))
        if [ $trace_fix_attempt -gt $MAX_TRACEABILITY_FIX_ATTEMPTS ]; then
            log_warn "Max traceability fix attempts ($MAX_TRACEABILITY_FIX_ATTEMPTS) reached"
            add_metrics_issue "epic-$EPIC_ID" "traceability_gaps" "Coverage gaps remain after $MAX_TRACEABILITY_FIX_ATTEMPTS attempts"
            # Don't fail the epic, proceed with gaps documented
            break
        fi

        log_warn "Traceability gaps found, generating missing tests (attempt $trace_fix_attempt of $MAX_TRACEABILITY_FIX_ATTEMPTS)"
        if ! execute_traceability_fix_phase "$LAST_TRACEABILITY_GAPS" "$trace_fix_attempt"; then
            log_warn "Test generation incomplete, continuing..."
        fi

        # Commit any generated tests
        if [ "$NO_COMMIT" = false ] && [ "$DRY_RUN" = false ]; then
            # Use git add -u for safety (tracked files only)
            git add -u
            git commit -m "test(epic-$EPIC_ID): generate missing tests for traceability (attempt $trace_fix_attempt)" 2>/dev/null || true
        fi

        log "Re-running traceability check..."
    done
fi

# =============================================================================
# UAT Generation (Fresh Context)
# =============================================================================

echo ""
log "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
log "UAT Document Generation"
log "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

generate_uat

# =============================================================================
# Summary
# =============================================================================

END_TIME=$(date +%s)
DURATION=$((END_TIME - START_TIME))

# Finalize metrics with final counts
finalize_metrics "${#STORIES[@]}" "$COMPLETED" "$FAILED" "$SKIPPED" "$DURATION"

echo ""
log "=========================================="
log "EPIC EXECUTION COMPLETE"
log "=========================================="
echo ""
echo "  Epic:       $EPIC_ID"
echo "  Duration:   ${DURATION}s"
echo "  Stories:    ${#STORIES[@]}"
echo "  Skipped:    $SKIPPED"
echo "  Completed:  $COMPLETED"
echo "  Failed:     $FAILED"
echo ""
echo "  Deliverables:"
echo "    - Stories:       $STORIES_DIR/"
echo "    - UAT:           $UAT_DIR/epic-${EPIC_ID}-uat.md"
echo "    - Traceability:  $TRACEABILITY_DIR/epic-${EPIC_ID}-traceability.md"
echo "    - Metrics:       $METRICS_FILE"
echo "    - Log:           $LOGS_DIR/epic-${EPIC_ID}-<timestamp>.log (saved on exit)"
echo ""

if [ $FAILED -gt 0 ]; then
    log_warn "$FAILED stories failed - check log for details"
    log "Checkpoint preserved for resume capability"
    exit 1
fi

# L1: Clear checkpoint on successful completion
if type clear_checkpoint >/dev/null 2>&1; then
    clear_checkpoint
fi

log_success "All stories completed successfully"
echo ""
echo "Next step: Run UAT document with a human tester"
echo ""
