#!/bin/bash
#
# BMAD Epic Execute - Utility Functions Module
#
# Provides shared utility functions for reliability and cross-platform support:
# - M1: Retry logic with exponential backoff
# - M2: yq version validation
# - M3: Fuzzy completion signal detection
# - M4: Cross-platform sed
# - M5: Branch protection check
#
# Usage: Sourced by epic-execute.sh
#

# =============================================================================
# Portable Timeout Wrapper
# =============================================================================

# Run a command with a timeout (portable, no coreutils needed)
# Usage: run_with_timeout <seconds> <command...>
# Returns: command output via stdout; exit code 0 on success, 1 on timeout
run_with_timeout() {
    local timeout_secs="$1"; shift
    local output_file
    output_file=$(mktemp /tmp/bmad-timeout-XXXXXX)

    ( "$@" > "$output_file" 2>&1 ) &
    local cmd_pid=$!

    ( sleep "$timeout_secs" && kill -TERM "$cmd_pid" 2>/dev/null && sleep 2 && kill -9 "$cmd_pid" 2>/dev/null ) &
    local watchdog_pid=$!

    wait "$cmd_pid" 2>/dev/null
    local exit_code=$?

    # Kill watchdog if command finished in time
    kill "$watchdog_pid" 2>/dev/null
    wait "$watchdog_pid" 2>/dev/null

    cat "$output_file"
    rm -f "$output_file"

    # 143 = SIGTERM, 137 = SIGKILL (timed out)
    if [ $exit_code -eq 143 ] || [ $exit_code -eq 137 ]; then
        return 1
    fi
    return $exit_code
}

# =============================================================================
# M1: Retry Logic with Exponential Backoff
# =============================================================================

# Default retry configuration
RETRY_MAX_ATTEMPTS="${RETRY_MAX_ATTEMPTS:-3}"
RETRY_INITIAL_DELAY="${RETRY_INITIAL_DELAY:-5}"
RETRY_MAX_DELAY="${RETRY_MAX_DELAY:-60}"

# Execute a command with retry logic and exponential backoff
# Arguments:
#   $1 - max attempts (optional, default: RETRY_MAX_ATTEMPTS)
#   $2 - initial delay in seconds (optional, default: RETRY_INITIAL_DELAY)
#   $@ - command and arguments to execute
# Returns: Exit code of the command, or 1 if all retries failed
execute_with_retry() {
    local max_attempts="${1:-$RETRY_MAX_ATTEMPTS}"
    local delay="${2:-$RETRY_INITIAL_DELAY}"
    shift 2

    local attempt=1
    local result=""
    local exit_code=0

    while [ $attempt -le $max_attempts ]; do
        # Execute the command and capture result
        result=$("$@" 2>&1)
        exit_code=$?

        if [ $exit_code -eq 0 ]; then
            echo "$result"
            return 0
        fi

        # Check if this is a retryable error (transient failures)
        local is_retryable=false
        case "$result" in
            *"rate limit"*|*"Rate limit"*|*"429"*)
                is_retryable=true
                [ "$VERBOSE" = true ] && log_warn "Rate limited, retrying..."
                ;;
            *"timeout"*|*"Timeout"*|*"ETIMEDOUT"*)
                is_retryable=true
                [ "$VERBOSE" = true ] && log_warn "Timeout, retrying..."
                ;;
            *"connection"*|*"Connection"*|*"ECONNREFUSED"*|*"ECONNRESET"*)
                is_retryable=true
                [ "$VERBOSE" = true ] && log_warn "Connection error, retrying..."
                ;;
            *"temporarily unavailable"*|*"503"*|*"502"*)
                is_retryable=true
                [ "$VERBOSE" = true ] && log_warn "Service temporarily unavailable, retrying..."
                ;;
        esac

        if [ "$is_retryable" = false ]; then
            # Non-retryable error, return immediately
            echo "$result"
            return $exit_code
        fi

        if [ $attempt -lt $max_attempts ]; then
            log_warn "Attempt $attempt/$max_attempts failed. Retrying in ${delay}s..."
            sleep "$delay"

            # Exponential backoff with cap
            delay=$((delay * 2))
            if [ $delay -gt $RETRY_MAX_DELAY ]; then
                delay=$RETRY_MAX_DELAY
            fi
        fi
        ((attempt++))
    done

    log_error "All $max_attempts attempts failed"
    echo "$result"
    return 1
}

# Execute Claude prompt with retry logic
# Arguments:
#   $1 - prompt
#   $2 - optional timeout (default: CLAUDE_TIMEOUT)
# Returns: Claude's response or error
execute_claude_with_retry() {
    local prompt="$1"
    local timeout="${2:-${CLAUDE_TIMEOUT:-600}}"

    # Wrapper function for retry
    _claude_invoke() {
        timeout "$timeout" claude --dangerously-skip-permissions -p "$1" 2>&1
        local code=$?
        if [ $code -eq 124 ]; then
            echo "TIMEOUT: Claude invocation timed out after ${timeout}s"
            return 124
        fi
        return $code
    }

    execute_with_retry "$RETRY_MAX_ATTEMPTS" "$RETRY_INITIAL_DELAY" _claude_invoke "$prompt"
}

# =============================================================================
# M2: yq Version Validation
# =============================================================================

# Global flag for yq availability and version
YQ_AVAILABLE=false
YQ_VERSION=""

# Validate yq installation and version
# Returns: 0 if valid yq (mikefarah Go version), 1 otherwise
validate_yq() {
    if ! command -v yq >/dev/null 2>&1; then
        log_warn "yq not installed - YAML updates will use sed fallback"
        return 1
    fi

    local version_output
    version_output=$(yq --version 2>&1 || echo "")

    # Check if it's the Go version (mikefarah/yq) which we expect
    if echo "$version_output" | grep -qE "(mikefarah|version.*v4|version.*4\.)"; then
        YQ_VERSION="go"
        YQ_AVAILABLE=true
        return 0
    fi

    # Python yq has different syntax (kislyuk/yq)
    if echo "$version_output" | grep -qE "(jq wrapper|kislyuk)"; then
        log_warn "Python yq detected (kislyuk/yq) - using sed fallback"
        log_warn "For full YAML support, install: brew install yq (macOS) or go install github.com/mikefarah/yq/v4@latest"
        YQ_VERSION="python"
        return 1
    fi

    # Unknown version
    log_warn "Unknown yq version - YAML updates may fail"
    log_warn "Version output: $version_output"
    YQ_VERSION="unknown"
    return 1
}

# Safe yq operation with fallback
# Arguments:
#   $1 - yq operation (e.g., ".field = value")
#   $2 - file path
# Returns: 0 on success, 1 on failure
safe_yq() {
    local operation="$1"
    local file="$2"

    if [ "$YQ_AVAILABLE" = true ]; then
        yq -i "$operation" "$file" 2>/dev/null && return 0
    fi

    # yq not available or failed, return 1 to indicate fallback needed
    return 1
}

# =============================================================================
# M3: Fuzzy Completion Signal Detection
# =============================================================================

# Check phase completion with fuzzy matching
# Arguments:
#   $1 - Full Claude output
#   $2 - Phase type (dev, review, fix, arch, test_quality, trace, uat)
#   $3 - Story ID (for legacy text matching)
# Returns: 0 if complete/passed, 1 if failed/blocked, 2 if unclear
check_phase_completion_fuzzy() {
    local output="$1"
    local phase_type="$2"
    local story_id="$3"

    # Try JSON parsing first (unless legacy mode)
    if [ "$USE_LEGACY_OUTPUT" != true ]; then
        local json_result
        json_result=$(extract_json_result "$output" 2>/dev/null || echo "")

        if [ -n "$json_result" ]; then
            local status
            status=$(get_result_status "$json_result" 2>/dev/null || echo "")

            # Normalize status to uppercase
            status=$(echo "$status" | tr '[:lower:]' '[:upper:]')

            case "$status" in
                COMPLETE|PASSED|COMPLIANT|APPROVED|SUCCESS|DONE|OK)
                    return 0
                    ;;
                BLOCKED|FAILED|VIOLATIONS|CONCERNS|ERROR|INCOMPLETE|REJECTED)
                    return 1
                    ;;
            esac
        fi
    fi

    # Fuzzy text matching fallback (case-insensitive)
    # Convert output to lowercase for matching
    local output_lower
    output_lower=$(echo "$output" | tr '[:upper:]' '[:lower:]')

    case "$phase_type" in
        dev)
            # Success patterns
            if echo "$output_lower" | grep -qE "(implementation|dev(elopment)?|story).*(complete|done|finish|success|implement)"; then
                return 0
            fi
            # Failure patterns
            if echo "$output_lower" | grep -qE "(implementation|dev(elopment)?).*(block|fail|error|cannot|unable|halt)"; then
                return 1
            fi
            # Explicit legacy signals (case-sensitive)
            if echo "$output" | grep -q "IMPLEMENTATION COMPLETE"; then
                return 0
            fi
            if echo "$output" | grep -q "IMPLEMENTATION BLOCKED"; then
                return 1
            fi
            ;;
        review)
            # Success patterns
            if echo "$output_lower" | grep -qE "review.*(pass|approv|success|complete|clean|good|lgtm)"; then
                return 0
            fi
            # Failure patterns
            if echo "$output_lower" | grep -qE "review.*(fail|reject|issue|problem|concern|block)"; then
                return 1
            fi
            # Explicit legacy signals
            if echo "$output" | grep -q "REVIEW PASSED"; then
                return 0
            fi
            if echo "$output" | grep -q "REVIEW FAILED"; then
                return 1
            fi
            ;;
        fix)
            # Success patterns
            if echo "$output_lower" | grep -qE "(fix|repair|resolve).*(complete|done|success|all|finish)"; then
                return 0
            fi
            # Failure patterns
            if echo "$output_lower" | grep -qE "(fix|repair).*(fail|incomplete|partial|cannot|unable|remain)"; then
                return 1
            fi
            # Explicit legacy signals
            if echo "$output" | grep -q "FIX COMPLETE"; then
                return 0
            fi
            if echo "$output" | grep -q "FIX INCOMPLETE"; then
                return 1
            fi
            ;;
        arch)
            # Success patterns
            if echo "$output_lower" | grep -qE "(arch|architecture).*(compliant|pass|conform|valid|ok|good)"; then
                return 0
            fi
            # Failure patterns
            if echo "$output_lower" | grep -qE "(arch|architecture).*(violation|fail|non-compliant|issue|problem)"; then
                return 1
            fi
            # Explicit legacy signals
            if echo "$output" | grep -q "ARCH COMPLIANT"; then
                return 0
            fi
            if echo "$output" | grep -q "ARCH VIOLATIONS"; then
                return 1
            fi
            ;;
        test_quality)
            # Success patterns (including concerns which don't block)
            if echo "$output_lower" | grep -qE "test.*quality.*(approv|pass|good|accept|meets)"; then
                return 0
            fi
            if echo "$output" | grep -qE "TEST QUALITY (APPROVED|CONCERNS)"; then
                return 0
            fi
            # Failure patterns
            if echo "$output_lower" | grep -qE "test.*quality.*(fail|reject|below|poor|unaccept)"; then
                return 1
            fi
            if echo "$output" | grep -q "TEST QUALITY FAILED"; then
                return 1
            fi
            ;;
        trace|traceability)
            # Success patterns (including concerns which don't block)
            if echo "$output_lower" | grep -qE "trace.*((pass|complete|valid|good|100%)|concerns?)"; then
                return 0
            fi
            if echo "$output" | grep -qE "TRACEABILITY (PASS|CONCERNS)"; then
                return 0
            fi
            # Failure patterns
            if echo "$output_lower" | grep -qE "trace.*(fail|gap|missing|incomplete)"; then
                return 1
            fi
            if echo "$output" | grep -q "TRACEABILITY FAIL"; then
                return 1
            fi
            ;;
        uat)
            # Success patterns
            if echo "$output_lower" | grep -qE "uat.*(generat|creat|complete|success|done)"; then
                return 0
            fi
            if echo "$output" | grep -q "UAT GENERATED"; then
                return 0
            fi
            ;;
        test_gen)
            # Success patterns
            if echo "$output_lower" | grep -qE "test.*(generat|creat).*(complete|success|done)"; then
                return 0
            fi
            if echo "$output" | grep -q "TEST GENERATION COMPLETE"; then
                return 0
            fi
            # Partial failure
            if echo "$output" | grep -q "TEST GENERATION PARTIAL"; then
                return 1
            fi
            ;;
    esac

    # Unclear result
    return 2
}

# =============================================================================
# M4: Cross-Platform sed -i
# =============================================================================

# Cross-platform sed in-place edit
# Handles macOS (BSD sed) vs Linux (GNU sed) differences
# Arguments:
#   $1 - sed pattern
#   $2 - file path
# Returns: 0 on success, non-zero on failure
sed_inplace() {
    local pattern="$1"
    local file="$2"

    if [ ! -f "$file" ]; then
        log_error "sed_inplace: File not found: $file"
        return 1
    fi

    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS/BSD sed requires '' after -i for no backup
        sed -i '' "$pattern" "$file"
    else
        # GNU sed (Linux)
        sed -i "$pattern" "$file"
    fi
}

# Cross-platform sed in-place with backup
# Arguments:
#   $1 - sed pattern
#   $2 - file path
#   $3 - backup extension (optional, default: .bak)
# Returns: 0 on success, non-zero on failure
sed_inplace_backup() {
    local pattern="$1"
    local file="$2"
    local backup_ext="${3:-.bak}"

    if [ ! -f "$file" ]; then
        log_error "sed_inplace_backup: File not found: $file"
        return 1
    fi

    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS/BSD sed
        sed -i "$backup_ext" "$pattern" "$file"
    else
        # GNU sed (Linux)
        sed -i"$backup_ext" "$pattern" "$file"
    fi
}

# =============================================================================
# M5: Branch Protection Check
# =============================================================================

# List of protected branches (can be overridden via environment)
PROTECTED_BRANCHES="${PROTECTED_BRANCHES:-main master}"

# Check if current branch is protected
# Returns: 0 if safe to commit, 1 if protected branch
check_branch_protection() {
    if [ ! -d "$PROJECT_ROOT/.git" ]; then
        # Not a git repo, nothing to check
        return 0
    fi

    local current_branch
    current_branch=$(git -C "$PROJECT_ROOT" branch --show-current 2>/dev/null || \
                     git -C "$PROJECT_ROOT" rev-parse --abbrev-ref HEAD 2>/dev/null || \
                     echo "")

    if [ -z "$current_branch" ]; then
        log_warn "Cannot determine current branch - proceeding with caution"
        return 0
    fi

    # Check against protected branches
    for protected in $PROTECTED_BRANCHES; do
        if [ "$current_branch" = "$protected" ]; then
            log_error "Cannot commit directly to protected branch: $current_branch"
            log_error "Create a feature branch first:"
            log_error "  git checkout -b epic-${EPIC_ID:-new}"
            log_error ""
            log_error "Or bypass protection with: PROTECTED_BRANCHES='' $0 ..."
            return 1
        fi
    done

    log "Working on branch: $current_branch"
    return 0
}

# Get current branch name
get_current_branch() {
    git -C "$PROJECT_ROOT" branch --show-current 2>/dev/null || \
    git -C "$PROJECT_ROOT" rev-parse --abbrev-ref HEAD 2>/dev/null || \
    echo ""
}

# =============================================================================
# L1: Checkpoint / Resume Capability
# =============================================================================

# Global checkpoint state
CHECKPOINT_FILE=""
CHECKPOINT_LOADED=false
CHECKPOINT_STORY_INDEX=0
CHECKPOINT_COMPLETED=0
CHECKPOINT_FAILED=0
CHECKPOINT_SKIPPED=0

# Load checkpoint from previous interrupted run
# Arguments:
#   $1 - epic ID
#   $2 - sprint artifacts directory
# Returns: 0 if checkpoint loaded successfully, 1 if no checkpoint
load_checkpoint() {
    local epic_id="$1"
    local artifacts_dir="$2"

    CHECKPOINT_FILE="$artifacts_dir/.epic-${epic_id}-checkpoint"

    if [ ! -f "$CHECKPOINT_FILE" ]; then
        [ "$VERBOSE" = true ] && log "No checkpoint file found for epic $epic_id"
        return 1
    fi

    # Check checkpoint age (ignore checkpoints older than 7 days)
    local checkpoint_age=0
    if [[ "$OSTYPE" == "darwin"* ]]; then
        checkpoint_age=$(( $(date +%s) - $(stat -f %m "$CHECKPOINT_FILE" 2>/dev/null || echo 0) ))
    else
        checkpoint_age=$(( $(date +%s) - $(stat -c %Y "$CHECKPOINT_FILE" 2>/dev/null || echo 0) ))
    fi

    local max_age=$((7 * 24 * 60 * 60))  # 7 days in seconds
    if [ "$checkpoint_age" -gt "$max_age" ]; then
        log_warn "Checkpoint file is older than 7 days - ignoring"
        rm -f "$CHECKPOINT_FILE"
        return 1
    fi

    # Source checkpoint file to load variables
    # shellcheck source=/dev/null
    source "$CHECKPOINT_FILE" 2>/dev/null || {
        log_warn "Failed to read checkpoint file"
        return 1
    }

    # Validate checkpoint data
    if [ -z "${LAST_STORY_INDEX:-}" ]; then
        log_warn "Checkpoint file is invalid - missing LAST_STORY_INDEX"
        return 1
    fi

    # Load checkpoint values into global state
    CHECKPOINT_LOADED=true
    CHECKPOINT_STORY_INDEX="${LAST_STORY_INDEX:-0}"
    CHECKPOINT_COMPLETED="${COMPLETED:-0}"
    CHECKPOINT_FAILED="${FAILED:-0}"
    CHECKPOINT_SKIPPED="${SKIPPED:-0}"

    log "Checkpoint loaded from previous run:"
    log "  Last story index: $CHECKPOINT_STORY_INDEX"
    log "  Completed: $CHECKPOINT_COMPLETED, Failed: $CHECKPOINT_FAILED, Skipped: $CHECKPOINT_SKIPPED"

    return 0
}

# Save checkpoint after completing a story
# Arguments:
#   $1 - current story index
#   $2 - story ID
#   $3 - completed count
#   $4 - failed count
#   $5 - skipped count
save_checkpoint() {
    local story_index="$1"
    local story_id="$2"
    local completed="$3"
    local failed="$4"
    local skipped="$5"

    if [ -z "$CHECKPOINT_FILE" ]; then
        return 0
    fi

    local timestamp
    timestamp=$(date -u +"%Y-%m-%dT%H:%M:%SZ")

    cat > "$CHECKPOINT_FILE" << EOF
# Epic checkpoint - $timestamp
# Auto-generated by epic-execute.sh
LAST_STORY_INDEX=$story_index
LAST_STORY_ID=$story_id
COMPLETED=$completed
FAILED=$failed
SKIPPED=$skipped
TIMESTAMP=$timestamp
EOF

    [ "$VERBOSE" = true ] && log "Checkpoint saved: story $story_id (index $story_index)"
}

# Clear checkpoint file after successful completion
clear_checkpoint() {
    if [ -n "$CHECKPOINT_FILE" ] && [ -f "$CHECKPOINT_FILE" ]; then
        rm -f "$CHECKPOINT_FILE"
        log "Checkpoint cleared (epic completed successfully)"
    fi
}

# Get resume story index from checkpoint
# Returns the next story index to process (LAST_STORY_INDEX + 1)
get_resume_index() {
    if [ "$CHECKPOINT_LOADED" = true ]; then
        echo $((CHECKPOINT_STORY_INDEX + 1))
    else
        echo 0
    fi
}

# =============================================================================
# L3: Verbose Claude Output Logging
# =============================================================================

# Execute Claude prompt with optional verbose output streaming
# Arguments:
#   $1 - prompt
#   $2 - phase name (for logging)
#   $3 - optional timeout (default: CLAUDE_TIMEOUT)
# Returns: Claude's response
execute_claude_verbose() {
    local prompt="$1"
    local phase_name="${2:-claude}"
    local timeout="${3:-${CLAUDE_TIMEOUT:-600}}"

    local prompt_size=${#prompt}

    if [ "$VERBOSE" = true ]; then
        log ">>> Claude $phase_name prompt (${prompt_size} bytes)"
        log ">>> Streaming output to terminal..."

        # Execute with output tee'd to both terminal and log file
        local result
        result=$(timeout "$timeout" claude --dangerously-skip-permissions -p "$prompt" 2>&1 | tee -a "$LOG_FILE")
        local exit_code=$?

        if [ $exit_code -eq 124 ]; then
            log_error "Claude timed out after ${timeout}s"
            echo "TIMEOUT"
            return 124
        fi

        echo "$result"
        return $exit_code
    else
        # Non-verbose mode: capture output silently
        local result
        result=$(timeout "$timeout" claude --dangerously-skip-permissions -p "$prompt" 2>&1)
        local exit_code=$?

        # Log to file only
        {
            echo "[$(date '+%Y-%m-%d %H:%M:%S')] >>> Claude $phase_name prompt (${prompt_size} bytes)"
            echo "$result"
            echo "[$(date '+%Y-%m-%d %H:%M:%S')] <<< Claude $phase_name complete (exit: $exit_code)"
        } >> "$LOG_FILE"

        if [ $exit_code -eq 124 ]; then
            log_error "Claude timed out after ${timeout}s"
            echo "TIMEOUT"
            return 124
        fi

        echo "$result"
        return $exit_code
    fi
}

# =============================================================================
# L5: Workflow File Content Validation
# =============================================================================

# Validate YAML content using yq or basic syntax check
# Arguments:
#   $1 - file path
# Returns: 0 if valid, 1 if invalid
validate_yaml_content() {
    local file="$1"

    if [ ! -f "$file" ]; then
        log_error "YAML validation: File not found: $file"
        return 1
    fi

    # Try yq first (most reliable)
    if [ "$YQ_AVAILABLE" = true ]; then
        if yq '.' "$file" >/dev/null 2>&1; then
            return 0
        else
            local error
            error=$(yq '.' "$file" 2>&1 || true)
            log_error "Invalid YAML in: $file"
            [ "$VERBOSE" = true ] && log_error "  Error: $error"
            return 1
        fi
    fi

    # Fallback: basic syntax check (look for common YAML errors)
    # Check for tabs at start of lines (YAML uses spaces)
    if grep -q $'^\t' "$file" 2>/dev/null; then
        log_warn "Potential YAML issue in $file: tabs found (YAML requires spaces)"
    fi

    # Check for unbalanced quotes
    local single_quotes double_quotes
    single_quotes=$(grep -o "'" "$file" 2>/dev/null | wc -l | tr -d ' ')
    double_quotes=$(grep -o '"' "$file" 2>/dev/null | wc -l | tr -d ' ')

    if [ $((single_quotes % 2)) -ne 0 ]; then
        log_warn "Potential YAML issue in $file: unbalanced single quotes"
    fi
    if [ $((double_quotes % 2)) -ne 0 ]; then
        log_warn "Potential YAML issue in $file: unbalanced double quotes"
    fi

    # Without yq, we can't fully validate - return success with warning
    [ "$VERBOSE" = true ] && log_warn "yq not available - YAML validation limited for: $file"
    return 0
}

# Validate XML content using xmllint or basic syntax check
# Arguments:
#   $1 - file path
# Returns: 0 if valid, 1 if invalid
validate_xml_content() {
    local file="$1"

    if [ ! -f "$file" ]; then
        log_error "XML validation: File not found: $file"
        return 1
    fi

    # Try xmllint first (most reliable)
    if command -v xmllint >/dev/null 2>&1; then
        if xmllint --noout "$file" 2>/dev/null; then
            return 0
        else
            local error
            error=$(xmllint --noout "$file" 2>&1 || true)
            log_error "Invalid XML in: $file"
            [ "$VERBOSE" = true ] && log_error "  Error: $error"
            return 1
        fi
    fi

    # Fallback: basic syntax check
    # Check for matching opening/closing root tag
    local first_tag last_tag
    first_tag=$(grep -oE '<[a-zA-Z][a-zA-Z0-9_-]*' "$file" 2>/dev/null | head -1 | tr -d '<' || true)
    last_tag=$(grep -oE '</[a-zA-Z][a-zA-Z0-9_-]*>' "$file" 2>/dev/null | tail -1 | tr -d '</>' || true)

    if [ -n "$first_tag" ] && [ -n "$last_tag" ] && [ "$first_tag" != "$last_tag" ]; then
        log_warn "Potential XML issue in $file: root tag mismatch ($first_tag vs $last_tag)"
    fi

    # Without xmllint, we can't fully validate - return success with warning
    [ "$VERBOSE" = true ] && log_warn "xmllint not available - XML validation limited for: $file"
    return 0
}

# Validate workflow file content based on extension
# Arguments:
#   $1 - file path
# Returns: 0 if valid, 1 if invalid
validate_workflow_content() {
    local file="$1"

    if [ ! -f "$file" ]; then
        return 1
    fi

    local extension="${file##*.}"

    case "$extension" in
        yaml|yml)
            validate_yaml_content "$file"
            return $?
            ;;
        xml)
            validate_xml_content "$file"
            return $?
            ;;
        md|txt)
            # Markdown/text files don't need validation
            return 0
            ;;
        *)
            # Unknown extension - skip validation
            [ "$VERBOSE" = true ] && log_warn "Unknown file type, skipping validation: $file"
            return 0
            ;;
    esac
}

# =============================================================================
# Initialization
# =============================================================================

# Initialize utilities when sourced
init_utils() {
    # Validate yq
    validate_yq || true

    # Log platform info in verbose mode
    if [ "$VERBOSE" = true ]; then
        log "Platform: $OSTYPE"
        log "yq available: $YQ_AVAILABLE (version: ${YQ_VERSION:-none})"
        log "Protected branches: $PROTECTED_BRANCHES"
    fi
}
