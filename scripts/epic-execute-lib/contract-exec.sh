#!/bin/bash
#
# BMAD Epic Execute - Contract Execution Engine
#
# Executes the contract harness against a running sample environment:
#   - backend `cases`: call the API and assert response + persistence
#   - UI `flows`:       drive a real browser and assert allowed/forbidden
#
# The engine is granularity-agnostic: callers decide whether to invoke it
# per-story or once per epic. It assumes contract-harness.sh is also sourced
# (for yq parsing conventions) and reuses the same harness file.
#
# NOTE: end-to-end execution requires a live app (and, for UI flows, browser
# binaries). The deterministic pieces - assertions, JSON-subset matching, and
# spec generation/parsing - are unit-testable without a live stack.
#
# Usage: sourced by epic-execute.sh
#

# Detail of the most recent execution run (failures), for the fix loop.
CONTRACT_EXEC_FAILURES=""
# PID of the app started by contract_env_up (so contract_env_down can stop it).
CONTRACT_APP_PID=""

# =============================================================================
# Environment Lifecycle
# =============================================================================

# Bring the sample environment up: run setup, start the app (background), poll
# the readiness URL. Returns 0 when ready, 1 on failure.
contract_env_up() {
    local h="$1"
    CONTRACT_APP_PID=""

    local cmd
    while IFS= read -r cmd; do
        [ -z "$cmd" ] && continue
        log "  setup: $cmd"
        if ! ( cd "$PROJECT_ROOT" && eval "$cmd" ) >>"${LOG_FILE:-/dev/null}" 2>&1; then
            log_error "  setup failed: $cmd"
            return 1
        fi
    done < <(yq '(.environment.setup // [])[]' "$h" 2>/dev/null)

    local start_cmd
    start_cmd=$(yq '.environment.start.command // ""' "$h" 2>/dev/null)
    if [ -n "$start_cmd" ]; then
        log "  start: $start_cmd"
        ( cd "$PROJECT_ROOT" && eval "$start_cmd" ) >>"${LOG_FILE:-/dev/null}" 2>&1 &
        CONTRACT_APP_PID=$!
    fi

    local ready_url timeout waited=0
    ready_url=$(yq '.environment.start.ready.url // ""' "$h" 2>/dev/null)
    timeout=$(yq '.environment.start.ready.timeout_seconds // 30' "$h" 2>/dev/null)
    if [ -n "$ready_url" ]; then
        while [ "$waited" -lt "$timeout" ]; do
            if curl -sf -o /dev/null "$ready_url" 2>/dev/null; then
                log_success "  ready: $ready_url"
                return 0
            fi
            sleep 2
            waited=$((waited + 2))
        done
        log_error "  not ready after ${timeout}s: $ready_url"
        return 1
    fi

    return 0
}

# Tear the sample environment down: stop the app, run teardown commands.
contract_env_down() {
    local h="$1"
    [ -n "$CONTRACT_APP_PID" ] && kill "$CONTRACT_APP_PID" 2>/dev/null || true
    CONTRACT_APP_PID=""

    local cmd
    while IFS= read -r cmd; do
        [ -z "$cmd" ] && continue
        log "  teardown: $cmd"
        ( cd "$PROJECT_ROOT" && eval "$cmd" ) >>"${LOG_FILE:-/dev/null}" 2>&1 || true
    done < <(yq '(.environment.teardown // [])[]' "$h" 2>/dev/null)
}

# =============================================================================
# Assertion Helpers
# =============================================================================

# True if every key/value pair in the expected JSON object ($2) is present and
# equal in the actual JSON ($1). Used for response body_contains assertions.
_json_contains() {
    local actual="$1" expected="$2"
    jq -e -n --argjson a "$actual" --argjson e "$expected" '
        ($e | to_entries) as $pairs
        | all($pairs[]; .key as $k | $a[$k] == .value)
    ' >/dev/null 2>&1
}

# =============================================================================
# Backend Case Execution
# =============================================================================

# Execute the harness `cases` against the running API. The environment must
# already be up. Appends failures to CONTRACT_EXEC_FAILURES.
# Returns 0 if all cases pass, 1 if any fail.
#
# Persistence contract: the datastore.verify_command is invoked as
#   <verify_command> --table <name> --where <json>
# and must exit 0 when the expected row exists.
run_backend_cases() {
    local h="$1"

    local base_url verify_command n
    base_url=$(yq '.api.base_url // ""' "$h" 2>/dev/null)
    verify_command=$(yq '.datastore.verify_command // ""' "$h" 2>/dev/null)
    n=$(yq '.cases | length' "$h" 2>/dev/null)
    case "$n" in ''|null) n=0 ;; esac

    [ "$n" -eq 0 ] && return 0

    local failures=0 i
    for ((i = 0; i < n; i++)); do
        local name method path body exp_status exp_body
        name=$(yq ".cases[$i].name // \"case-$i\"" "$h" 2>/dev/null)
        method=$(yq ".cases[$i].request.method // \"GET\"" "$h" 2>/dev/null)
        path=$(yq ".cases[$i].request.path // \"/\"" "$h" 2>/dev/null)
        body=$(yq -o=json -I=0 ".cases[$i].request.body // {}" "$h" 2>/dev/null)
        exp_status=$(yq ".cases[$i].expect.status // 0" "$h" 2>/dev/null)
        exp_body=$(yq -o=json -I=0 ".cases[$i].expect.body_contains // {}" "$h" 2>/dev/null)

        # Make the call
        local resp code rbody
        resp=$(curl -s -w $'\n%{http_code}' -X "$method" "$base_url$path" \
            -H 'Content-Type: application/json' --data "$body" 2>/dev/null)
        code=$(printf '%s' "$resp" | tail -n1)
        rbody=$(printf '%s' "$resp" | sed '$d')

        # Status assertion
        if [ "$exp_status" != "0" ] && [ "$code" != "$exp_status" ]; then
            failures=$((failures + 1))
            CONTRACT_EXEC_FAILURES+="- [$name] expected status $exp_status, got ${code:-none}"$'\n'
            log_error "  contract case FAILED: $name (status $code != $exp_status)"
            continue
        fi

        # Response body_contains assertion
        if [ -n "$exp_body" ] && [ "$exp_body" != "{}" ]; then
            if ! _json_contains "${rbody:-null}" "$exp_body"; then
                failures=$((failures + 1))
                CONTRACT_EXEC_FAILURES+="- [$name] response missing expected fields: $exp_body"$'\n'
                log_error "  contract case FAILED: $name (body mismatch)"
                continue
            fi
        fi

        # Persistence verification (data landed in the right place)
        local vp
        vp=$(yq ".cases[$i].verify_persistence // \"\"" "$h" 2>/dev/null)
        if [ -n "$vp" ] && [ "$vp" != "null" ] && [ -n "$verify_command" ]; then
            local table where
            table=$(yq ".cases[$i].verify_persistence.table // \"\"" "$h" 2>/dev/null)
            where=$(yq -o=json -I=0 ".cases[$i].verify_persistence.where // {}" "$h" 2>/dev/null)
            if ! ( cd "$PROJECT_ROOT" && eval "$verify_command --table '$table' --where '$where'" ) >>"${LOG_FILE:-/dev/null}" 2>&1; then
                failures=$((failures + 1))
                CONTRACT_EXEC_FAILURES+="- [$name] persistence check failed (table=$table where=$where)"$'\n'
                log_error "  contract case FAILED: $name (not persisted)"
                continue
            fi
        fi

        log_success "  contract case passed: $name"
    done

    [ "$failures" -gt 0 ] && return 1
    return 0
}
