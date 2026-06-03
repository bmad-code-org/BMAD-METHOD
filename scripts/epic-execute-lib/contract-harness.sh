#!/bin/bash
#
# BMAD Epic Execute - Contract Harness Preflight Module
#
# A project may declare a contract-validation harness (contract-harness.yaml)
# that describes how to bring up a SAMPLE/TEST environment and verify that the
# API and database contracts hold (the proper API is called and data lands in
# the right place).
#
# This module does NOT execute the per-story contract checks. It validates at
# STARTUP that the system has everything it needs to run them - credentials,
# commands, and files - so a misconfigured harness fails fast (or, in a dry
# run, produces an exit-code-honest readiness report) instead of blowing up
# mid-epic.
#
# The user never hand-maintains a checklist: prerequisites are inferred from the
# harness commands themselves (env var references, executables, file paths),
# with an optional `requires:` block for anything inference cannot see.
#
# Usage: sourced by epic-execute.sh
#

# Set true by contract_preflight when a required prerequisite is missing.
# epic-execute uses this to fail the run / dry-run exit code.
PREFLIGHT_FAILED=false

# =============================================================================
# Harness Discovery
# =============================================================================

# Locate the harness file (project root, then docs/). Echoes the path or "".
find_contract_harness() {
    local candidate
    for candidate in \
        "$PROJECT_ROOT/contract-harness.yaml" \
        "$PROJECT_ROOT/contract-harness.yml" \
        "$PROJECT_ROOT/docs/contract-harness.yaml" \
        "$PROJECT_ROOT/docs/contract-harness.yml"; do
        if [ -f "$candidate" ]; then
            echo "$candidate"
            return 0
        fi
    done
    echo ""
    return 0
}

# =============================================================================
# Prerequisite Inference
# =============================================================================

# Emit every command string declared in the harness (setup, start, teardown,
# and the datastore verify command), one per line.
_harness_commands() {
    local h="$1"
    yq '(.environment.setup // [])[]' "$h" 2>/dev/null
    yq '.environment.start.command // ""' "$h" 2>/dev/null
    yq '(.environment.teardown // [])[]' "$h" 2>/dev/null
    yq '.datastore.verify_command // ""' "$h" 2>/dev/null
}

# Derive required environment variables: references inside command strings
# ($VAR / ${VAR}), the datastore url_env value (itself a var name), and any
# explicit requires.env entries.
_derive_env_vars() {
    local h="$1"
    {
        _harness_commands "$h" | grep -oE '\$\{?[A-Za-z_][A-Za-z0-9_]*\}?' | tr -d '${}'
        yq '.datastore.url_env // ""' "$h" 2>/dev/null
        yq '(.requires.env // [])[]' "$h" 2>/dev/null
    } | sed '/^$/d' | sort -u
}

# Derive required executables: the first non-assignment token of each command,
# plus any explicit requires.commands entries.
_derive_commands() {
    local h="$1"
    {
        _harness_commands "$h" | while IFS= read -r cmd; do
            [ -z "$cmd" ] && continue
            # shellcheck disable=SC2086
            set -- $cmd
            while [ $# -gt 0 ]; do
                case "$1" in
                    *=*) shift ;;          # skip leading VAR=value assignments
                    *)   echo "$1"; break ;;
                esac
            done
        done
        yq '(.requires.commands // [])[]' "$h" 2>/dev/null
    } | sed '/^$/d' | sort -u
}

# Derive referenced files: path-like tokens in command strings (best effort),
# plus any explicit requires.files entries.
_derive_files() {
    local h="$1"
    {
        _harness_commands "$h" | tr ' ' '\n' | grep -E '/|\.(ya?ml|json|toml|sh|env)$' 2>/dev/null
        yq '(.requires.files // [])[]' "$h" 2>/dev/null
    } | sed '/^$/d' | sort -u
}

# =============================================================================
# Safety Guard
# =============================================================================

# Warn if the declared datastore connection looks like a real/production target.
# Contract validation writes data, so it must point at a throwaway/test store.
_check_datastore_safety() {
    local h="$1"
    local url_env
    url_env=$(yq '.datastore.url_env // ""' "$h" 2>/dev/null)
    [ -z "$url_env" ] && return 0

    case "$url_env" in
        DATABASE_URL|*PROD*|*PRODUCTION*)
            log_warn "  ! datastore.url_env='$url_env' looks production-scoped - use a TEST-only variable" ;;
    esac

    local val="${!url_env:-}"
    if [ -n "$val" ]; then
        case "$val" in
            *localhost*|*127.0.0.1*|*test*) : ;;
            *) log_warn "  ! $url_env does not look local/test-scoped - contract validation must never run against a real database" ;;
        esac
    fi
    return 0
}

# =============================================================================
# Preflight (presence checks + readiness report)
# =============================================================================

# Validate that everything needed to run the harness is present.
# Arguments:
#   $1 - path to the harness file
# Returns: 0 if ready, 1 if a required prerequisite is missing.
contract_preflight() {
    local h="$1"
    [ -z "$h" ] && return 0

    log "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    log "Contract Harness Preflight"
    log "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    log "Harness: $h"

    local check="✓" cross="✗"
    local missing=0

    # yq is required to parse the harness
    if ! command -v yq >/dev/null 2>&1; then
        log_error "  $cross yq is required to parse the contract harness (install yq)"
        PREFLIGHT_FAILED=true
        return 1
    fi

    # Basic schema sanity (advisory)
    local start_cmd
    start_cmd=$(yq '.environment.start.command // ""' "$h" 2>/dev/null)
    [ -z "$start_cmd" ] && log_warn "  ! harness declares no environment.start.command"

    # 1. Credentials / environment variables
    local envs
    envs=$(_derive_env_vars "$h")
    if [ -n "$envs" ]; then
        log "Credentials / environment variables:"
        while IFS= read -r v; do
            [ -z "$v" ] && continue
            if [ -n "${!v:-}" ]; then
                echo "    $check $v"
            else
                echo "    $cross $v (not set)"
                missing=$((missing + 1))
            fi
        done <<< "$envs"
    fi

    # 2. Required executables
    local cmds
    cmds=$(_derive_commands "$h")
    if [ -n "$cmds" ]; then
        log "Required commands:"
        while IFS= read -r c; do
            [ -z "$c" ] && continue
            if command -v "$c" >/dev/null 2>&1; then
                echo "    $check $c"
            else
                echo "    $cross $c (not on PATH)"
                missing=$((missing + 1))
            fi
        done <<< "$cmds"
    fi

    # 3. Referenced files
    local files
    files=$(_derive_files "$h")
    if [ -n "$files" ]; then
        log "Referenced files:"
        while IFS= read -r f; do
            [ -z "$f" ] && continue
            local path="$f"
            case "$f" in /*) path="$f" ;; *) path="$PROJECT_ROOT/$f" ;; esac
            if [ -e "$path" ]; then
                echo "    $check $f"
            else
                echo "    $cross $f (not found)"
                missing=$((missing + 1))
            fi
        done <<< "$files"
    fi

    # 4. Safety guard on datastore connection
    _check_datastore_safety "$h"

    # 5. Optional deep connectivity smoke (boots the sample environment)
    if [ "${PREFLIGHT_DEEP:-false}" = true ]; then
        if [ "$missing" -gt 0 ]; then
            log_warn "Skipping deep connectivity smoke - presence checks failed first"
        elif ! contract_preflight_deep "$h"; then
            missing=$((missing + 1))
        fi
    fi

    if [ "$missing" -gt 0 ]; then
        log_error "Contract preflight: $missing required prerequisite(s) missing"
        PREFLIGHT_FAILED=true
        return 1
    fi

    log_success "Contract preflight passed - ready to validate contracts"
    return 0
}

# =============================================================================
# Deep Connectivity Smoke (opt-in: --preflight-deep)
# =============================================================================

# Run teardown commands (best effort, always safe to call).
_harness_teardown() {
    local h="$1"
    while IFS= read -r cmd; do
        [ -z "$cmd" ] && continue
        log "  teardown: $cmd"
        ( cd "$PROJECT_ROOT" && eval "$cmd" ) >>"$LOG_FILE" 2>&1 || true
    done < <(yq '(.environment.teardown // [])[]' "$h" 2>/dev/null)
}

# Actually bring the sample environment up, check readiness, then tear it down.
# Executes the project's own commands (same trust level as package.json scripts).
# Arguments:
#   $1 - path to the harness file
# Returns: 0 on success, 1 on any failure.
contract_preflight_deep() {
    local h="$1"
    log "Deep connectivity smoke (booting the sample environment)..."

    # Run setup commands
    local rc=0 cmd
    while IFS= read -r cmd; do
        [ -z "$cmd" ] && continue
        log "  setup: $cmd"
        if ! ( cd "$PROJECT_ROOT" && eval "$cmd" ) >>"$LOG_FILE" 2>&1; then
            log_error "  setup failed: $cmd"
            rc=1
            break
        fi
    done < <(yq '(.environment.setup // [])[]' "$h" 2>/dev/null)

    if [ "$rc" -ne 0 ]; then
        _harness_teardown "$h"
        return 1
    fi

    # Start the app in the background (if a start command is declared)
    local start_cmd start_pid=""
    start_cmd=$(yq '.environment.start.command // ""' "$h" 2>/dev/null)
    if [ -n "$start_cmd" ]; then
        log "  start: $start_cmd"
        ( cd "$PROJECT_ROOT" && eval "$start_cmd" ) >>"$LOG_FILE" 2>&1 &
        start_pid=$!
    fi

    # Poll the readiness URL (if declared)
    local ready_url timeout ok=1
    ready_url=$(yq '.environment.start.ready.url // ""' "$h" 2>/dev/null)
    timeout=$(yq '.environment.start.ready.timeout_seconds // 30' "$h" 2>/dev/null)
    if [ -n "$ready_url" ]; then
        ok=0
        local waited=0
        while [ "$waited" -lt "$timeout" ]; do
            if curl -sf -o /dev/null "$ready_url" 2>/dev/null; then
                ok=1
                break
            fi
            sleep 2
            waited=$((waited + 2))
        done
        if [ "$ok" -eq 1 ]; then
            log_success "  ready: $ready_url"
        else
            log_error "  not ready after ${timeout}s: $ready_url"
        fi
    fi

    # Stop the app and tear down
    [ -n "$start_pid" ] && kill "$start_pid" 2>/dev/null || true
    _harness_teardown "$h"

    [ "$ok" -eq 1 ] && return 0 || return 1
}

# =============================================================================
# Scaffolder (--init-harness)
# =============================================================================

# Write a commented contract-harness.yaml template to the project root.
init_contract_harness() {
    local target="$PROJECT_ROOT/contract-harness.yaml"
    if [ -e "$target" ]; then
        log_warn "Harness already exists: $target (not overwriting)"
        return 0
    fi

    cat > "$target" <<'YAML'
# Contract validation harness for epic-execute.
#
# Declares how to bring up a SAMPLE/TEST environment and verify that the API and
# database contracts hold. epic-execute validates at startup that it has
# everything needed to run this - run `epic-execute <epic> --dry-run` to get an
# exit-code-honest readiness report (great as a CI gate).
version: 1

environment:
  # Commands to provision the sample environment (DB, migrations, seed data).
  setup:
    - docker compose -f docker-compose.test.yml up -d db
    # - npm run migrate:test
    # - npm run seed:test
  # How to start the app under test.
  start:
    command: npm run start:test
    ready:
      url: http://localhost:3000/health
      timeout_seconds: 60
  # Always run to clean up.
  teardown:
    - docker compose -f docker-compose.test.yml down -v

api:
  base_url: http://localhost:3000

# How to verify data landed "in the right place". Prefer a command (no DB
# credentials needed); the system passes the table/where as arguments.
datastore:
  verify_command: "npm run db:assert --"
  # OR direct query via a TEST-scoped env var (never a real DATABASE_URL):
  # url_env: TEST_DATABASE_URL

# Optional explicit prerequisites. The system also INFERS these from the
# commands above (env var references, executables, and file paths), so you only
# need to list things inference cannot see (e.g. an API token used at call time).
requires:
  env: []
  commands: []
  files: []

# Contract cases: call the API and assert the response + persistence.
# (Validated by preflight now; executed by the per-story contract gate.)
cases:
  - name: "example: create persists a row"
    request: { method: POST, path: /api/example, body: { name: "x" } }
    expect: { status: 201, body_contains: { name: "x" } }
    verify_persistence: { table: example, where: { name: "x" }, exists: true }
YAML

    log_success "Created harness template: $target"
    log "Edit it, then run a dry run to validate readiness."
    return 0
}
