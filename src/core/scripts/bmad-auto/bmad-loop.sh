#!/bin/bash
# ============================================================
# BMAD Auto Loop - Automated Story Development Cycle
# ============================================================
#
# DESCRIPTION:
#   Executes BMAD workflow in a loop: create-story -> dev-story -> code-review -> commit
#   Continues until all stories reach 'done' state in sprint-status.yaml
#
# USAGE:
#   ./bmad-loop.sh              # Run with default 30 max iterations
#   ./bmad-loop.sh 50           # Run with 50 max iterations
#   ./bmad-loop.sh 50 --verbose # Run with verbose logging
#
# PREREQUISITES:
#   - Claude Code CLI installed and in PATH
#   - BMAD installed with Claude Code support
#   - Sprint planning completed (sprint-status.yaml exists)
#
# ============================================================

set -e  # Exit on error

# Parse arguments
MAX_ITERATIONS=${1:-30}
VERBOSE=false
if [[ "$2" == "--verbose" || "$2" == "-v" ]]; then
    VERBOSE=true
fi

# Get script directory (works even if script is called via symlink)
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CONFIG_PATH="$SCRIPT_DIR/bmad-auto-config.yaml"
PROGRESS_LOG="$SCRIPT_DIR/bmad-progress.log"
PROMPT_TEMPLATE="$SCRIPT_DIR/bmad-prompt.md"

# ============================================================
# CONFIGURATION LOADING
# ============================================================
# The bmad-auto-config.yaml file is generated during BMAD installation.
# It contains the project root and output folder paths.

if [[ ! -f "$CONFIG_PATH" ]]; then
    echo "[ERROR] Configuration file not found: $CONFIG_PATH"
    echo ""
    echo "This file is generated automatically when you install BMAD with Claude Code support."
    echo "To fix this, run: npx bmad-method install"
    echo "And select 'Claude Code' as your IDE."
    exit 1
fi

# Parse YAML config (simple key: value format)
# Uses grep and sed to extract values, handles quoted and unquoted values
PROJECT_ROOT=$(grep "^project_root:" "$CONFIG_PATH" | sed 's/project_root: *"\{0,1\}\([^"]*\)"\{0,1\}/\1/' | tr -d '\r')
IMPL_ARTIFACTS=$(grep "^implementation_artifacts:" "$CONFIG_PATH" | sed 's/implementation_artifacts: *"\{0,1\}\([^"]*\)"\{0,1\}/\1/' | tr -d '\r')

# Validate required config
if [[ -z "$PROJECT_ROOT" ]]; then
    echo "[ERROR] 'project_root' not found in config file"
    exit 1
fi

# Fallback for implementation_artifacts
if [[ -z "$IMPL_ARTIFACTS" ]]; then
    IMPL_ARTIFACTS="_bmad-output/implementation-artifacts"
fi

# Build paths from config
SPRINT_STATUS_PATH="$PROJECT_ROOT/$IMPL_ARTIFACTS/sprint-status.yaml"

# ============================================================
# LOGGING FUNCTION
# ============================================================

log() {
    local message="$1"
    local color="${2:-white}"
    local timestamp=$(date "+%Y-%m-%d %H:%M:%S")

    # Color codes
    case $color in
        red)    color_code="\033[0;31m" ;;
        green)  color_code="\033[0;32m" ;;
        yellow) color_code="\033[0;33m" ;;
        cyan)   color_code="\033[0;36m" ;;
        gray)   color_code="\033[0;90m" ;;
        *)      color_code="\033[0m" ;;
    esac

    echo -e "${color_code}${message}\033[0m"
    echo "[$timestamp] $message" >> "$PROGRESS_LOG"
}

# ============================================================
# GET NEXT ACTION
# ============================================================
# Analyzes sprint-status.yaml and returns the next action to take
# Priority order: code-review > dev-story > create-story

get_next_action() {
    if [[ ! -f "$SPRINT_STATUS_PATH" ]]; then
        log "[ERROR] sprint-status.yaml not found: $SPRINT_STATUS_PATH" "red"
        echo "error"
        return
    fi

    # Filter story lines (pattern: digits-digits-*) excluding retrospectives
    local story_lines=$(grep -E '^\s*[0-9]+-[0-9]+-' "$SPRINT_STATUS_PATH" | grep -v "retrospective")

    if $VERBOSE; then
        local count=$(echo "$story_lines" | wc -l)
        log "[DEBUG] Found $count story lines" "gray"
    fi

    # Count stories in each state
    local review_count=$(echo "$story_lines" | grep -c ': *review *$' || true)
    local ready_count=$(echo "$story_lines" | grep -c ': *ready-for-dev *$' || true)
    local backlog_count=$(echo "$story_lines" | grep -c ': *backlog *$' || true)
    local done_count=$(echo "$story_lines" | grep -c ': *done *$' || true)
    local total_count=$(echo "$story_lines" | grep -c '.' || true)

    if $VERBOSE; then
        log "[DEBUG] Review: $review_count, Ready: $ready_count, Backlog: $backlog_count, Done: $done_count" "gray"
    fi

    # Priority order: review > ready-for-dev > backlog
    if [[ $review_count -gt 0 ]]; then
        log "[NEXT] Found story in REVIEW state" "green"
        echo "code-review"
        return
    fi

    if [[ $ready_count -gt 0 ]]; then
        log "[NEXT] Found story in READY-FOR-DEV state" "green"
        echo "dev-story"
        return
    fi

    if [[ $backlog_count -gt 0 ]]; then
        log "[NEXT] Found story in BACKLOG state" "green"
        echo "create-story"
        return
    fi

    # Check if all done
    if [[ $done_count -eq $total_count && $total_count -gt 0 ]]; then
        echo "complete"
        return
    fi

    # Check for in-progress (waiting state)
    local in_progress_count=$(echo "$story_lines" | grep -c ': *in-progress *$' || true)
    if [[ $in_progress_count -gt 0 ]]; then
        log "[WAIT] Found $in_progress_count story(ies) in-progress" "yellow"
    fi

    echo "wait"
}

# ============================================================
# INVOKE CLAUDE COMMAND
# ============================================================

invoke_claude_command() {
    local command="$1"

    log "[EXEC] Executing Claude Code: $command" "cyan"

    # Create customized prompt from template
    local prompt=$(cat "$PROMPT_TEMPLATE")
    prompt="${prompt//\{COMMAND\}/$command}"
    prompt="${prompt//\{TIMESTAMP\}/$(date "+%Y-%m-%d %H:%M:%S")}"

    # Save to temp file
    local temp_prompt=$(mktemp)
    echo "$prompt" > "$temp_prompt"

    # Execute Claude Code
    if cat "$temp_prompt" | claude --dangerously-skip-permissions 2>&1; then
        rm -f "$temp_prompt"
        return 0
    else
        log "[ERROR] Claude execution failed" "red"
        rm -f "$temp_prompt"
        return 1
    fi
}

# ============================================================
# GIT COMMIT
# ============================================================

invoke_git_commit() {
    log "[GIT] Checking for changes to commit..." "yellow"

    local status=$(git status --porcelain)

    if [[ -z "$status" ]]; then
        log "[INFO] No changes to commit" "gray"
        return 0
    fi

    log "[GIT] Committing changes..." "yellow"

    if git add -A && git commit -m "feat: BMAD auto-commit after code-review"; then
        log "[SUCCESS] Changes committed successfully" "green"
        return 0
    else
        log "[ERROR] Git commit failed" "red"
        return 1
    fi
}

# ============================================================
# MAIN LOOP
# ============================================================

log "[START] BMAD Auto Loop Started" "green"
log "Max iterations: $MAX_ITERATIONS" "gray"
log "Project root: $PROJECT_ROOT" "gray"
log "Sprint status: $SPRINT_STATUS_PATH" "gray"
echo ""

for ((iteration=1; iteration<=MAX_ITERATIONS; iteration++)); do
    log "=======================================" "cyan"
    log "=== Iteration $iteration/$MAX_ITERATIONS ===" "cyan"
    log "=======================================" "cyan"

    action=$(get_next_action)

    case $action in
        "create-story")
            log "[ACTION] CREATE STORY" "yellow"
            invoke_claude_command "/bmad-bmm-create-story"
            ;;
        "dev-story")
            log "[ACTION] DEVELOP STORY" "yellow"
            invoke_claude_command "/bmad-bmm-dev-story"
            ;;
        "code-review")
            log "[ACTION] CODE REVIEW" "yellow"
            if invoke_claude_command "/bmad-bmm-code-review"; then
                invoke_git_commit
            fi
            ;;
        "complete")
            log "[COMPLETE] ALL STORIES COMPLETED!" "green"
            log "Sprint status: All stories are DONE" "green"
            log "Total iterations: $iteration" "gray"
            exit 0
            ;;
        "wait")
            log "[WAIT] Waiting state - story might be in-progress" "yellow"
            log "Skipping this iteration..." "gray"
            ;;
        "error")
            log "[ERROR] Error state - stopping loop" "red"
            exit 1
            ;;
    esac

    echo ""
    sleep 5
done

log "[TIMEOUT] Max iterations reached without completion" "yellow"
log "Check sprint-status.yaml for current state" "gray"
exit 1
