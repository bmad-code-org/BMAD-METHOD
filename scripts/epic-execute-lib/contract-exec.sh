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
# Set true when contract validation ultimately fails (drives the epic exit code).
CONTRACT_VALIDATION_FAILED=false
# Max self-heal attempts for contract failures.
MAX_CONTRACT_FIX_ATTEMPTS="${MAX_CONTRACT_FIX_ATTEMPTS:-2}"

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

# =============================================================================
# UI Flow Execution (Playwright)
# =============================================================================

# Resolve a Playwright locator expression from a selector node, preferring a
# data-testid and falling back to accessible label/role/text.
# Arguments:
#   $1 - harness file
#   $2 - yq path to the selector map (e.g. .ui.flows[0].steps[1].click)
_pw_locator() {
    local h="$1" node="$2"
    local testid label role text
    testid=$(yq "${node}.testid // \"\"" "$h" 2>/dev/null)
    label=$(yq "${node}.label // \"\"" "$h" 2>/dev/null)
    role=$(yq "${node}.role // \"\"" "$h" 2>/dev/null)
    text=$(yq "${node}.text // \"\"" "$h" 2>/dev/null)

    if [ -n "$testid" ] && [ "$testid" != "null" ]; then
        echo "page.getByTestId('$testid')"
    elif [ -n "$label" ] && [ "$label" != "null" ]; then
        echo "page.getByLabel('$label')"
    elif [ -n "$role" ] && [ "$role" != "null" ]; then
        echo "page.getByRole('$role')"
    elif [ -n "$text" ] && [ "$text" != "null" ]; then
        echo "page.getByText('$text')"
    else
        echo "page.locator('body')"
    fi
}

# Strip single quotes from a value so it is safe inside a generated TS string.
_ts_safe() { printf '%s' "${1//\'/}"; }

# Generate a Playwright spec file from the harness ui.flows.
# Arguments:
#   $1 - harness file
#   $2 - output spec path
generate_playwright_spec() {
    local h="$1" out="$2"
    local base_url n
    base_url=$(yq '.ui.base_url // ""' "$h" 2>/dev/null)
    n=$(yq '.ui.flows | length' "$h" 2>/dev/null)
    case "$n" in ''|null) n=0 ;; esac

    {
        echo "// AUTO-GENERATED by epic-execute contract gate. Do not edit by hand."
        echo "import { test, expect } from '@playwright/test';"
        echo ""

        local i
        for ((i = 0; i < n; i++)); do
            local fp="ui.flows[$i]"
            local name role expect_kind
            name=$(_ts_safe "$(yq ".$fp.name // \"flow-$i\"" "$h" 2>/dev/null)")
            role=$(yq ".$fp.as_role // \"\"" "$h" 2>/dev/null)
            expect_kind=$(yq ".$fp.expect // \"allowed\"" "$h" 2>/dev/null)

            echo "test.describe('$name', () => {"
            if [ -n "$role" ] && [ "$role" != "null" ]; then
                # Convention: the ui.roles[<role>].seed produces this auth state.
                echo "  test.use({ storageState: 'playwright/.auth/$role.json' });"
            fi
            echo "  test('$expect_kind', async ({ page }) => {"

            # Steps
            local sn s
            sn=$(yq ".$fp.steps | length" "$h" 2>/dev/null); case "$sn" in ''|null) sn=0 ;; esac
            for ((s = 0; s < sn; s++)); do
                local key
                key=$(yq ".$fp.steps[$s] | keys | .[0]" "$h" 2>/dev/null)
                case "$key" in
                    goto)
                        local p; p=$(_ts_safe "$(yq ".$fp.steps[$s].goto" "$h" 2>/dev/null)")
                        echo "    await page.goto('$base_url$p');"
                        ;;
                    click)
                        echo "    await $(_pw_locator "$h" ".$fp.steps[$s].click").click();"
                        ;;
                    fill)
                        local v; v=$(_ts_safe "$(yq ".$fp.steps[$s].fill.value // \"\"" "$h" 2>/dev/null)")
                        echo "    await $(_pw_locator "$h" ".$fp.steps[$s].fill").fill('$v');"
                        ;;
                esac
            done

            # Assertions
            local an a
            an=$(yq ".$fp.assert | length" "$h" 2>/dev/null); case "$an" in ''|null) an=0 ;; esac
            for ((a = 0; a < an; a++)); do
                local key
                key=$(yq ".$fp.assert[$a] | keys | .[0]" "$h" 2>/dev/null)
                case "$key" in
                    visible) echo "    await expect($(_pw_locator "$h" ".$fp.assert[$a].visible")).toBeVisible();" ;;
                    hidden)  echo "    await expect($(_pw_locator "$h" ".$fp.assert[$a].hidden")).toBeHidden();" ;;
                    text)
                        local t; t=$(_ts_safe "$(yq ".$fp.assert[$a].text.value // \"\"" "$h" 2>/dev/null)")
                        echo "    await expect($(_pw_locator "$h" ".$fp.assert[$a].text")).toContainText('$t');"
                        ;;
                    url)
                        local u; u=$(_ts_safe "$(yq ".$fp.assert[$a].url // \"\"" "$h" 2>/dev/null)")
                        echo "    await expect(page).toHaveURL(/$u/);"
                        ;;
                    persisted)
                        echo "    // persistence is verified via backend cases (datastore.verify_command)"
                        ;;
                esac
            done

            echo "  });"
            echo "});"
            echo ""
        done
    } > "$out"
}

# Parse a Playwright JSON report; append failed flow titles to
# CONTRACT_EXEC_FAILURES. Returns 1 if any test failed.
parse_playwright_report() {
    local report="$1"
    command -v jq >/dev/null 2>&1 || return 0
    [ -f "$report" ] || { CONTRACT_EXEC_FAILURES+="- UI flows: no Playwright report produced"$'\n'; return 1; }

    local unexpected
    unexpected=$(jq '.stats.unexpected // 0' "$report" 2>/dev/null || echo 0)
    unexpected=$(printf '%s' "$unexpected" | tr -d '[:space:]'); [ -z "$unexpected" ] && unexpected=0

    if [ "$unexpected" -gt 0 ]; then
        local titles
        titles=$(jq -r '[.. | objects | select(.ok? == false and .title != null) | .title] | unique[]' "$report" 2>/dev/null || echo "")
        while IFS= read -r t; do
            [ -z "$t" ] && continue
            CONTRACT_EXEC_FAILURES+="- UI flow failed: $t"$'\n'
        done <<< "$titles"
        return 1
    fi
    return 0
}

# Generate + run the UI flows via the project's Playwright. Environment must be
# up. Returns 0 if all flows pass, 1 on failure.
run_ui_flows() {
    local h="$1"

    local driver
    driver=$(yq '.ui.driver // "playwright"' "$h" 2>/dev/null)
    if [ "$driver" != "playwright" ]; then
        log_warn "UI flow execution supports Playwright only in v1 (driver: $driver) - skipping"
        return 0
    fi

    local n
    n=$(yq '.ui.flows | length' "$h" 2>/dev/null)
    case "$n" in ''|null|0) return 0 ;; esac

    local tests_dir spec report
    tests_dir=$(yq '.ui.tests_dir // "e2e"' "$h" 2>/dev/null)
    spec="$PROJECT_ROOT/$tests_dir/contract-flows.generated.spec.ts"
    report="$PROJECT_ROOT/.contract-pw-report.json"

    mkdir -p "$(dirname "$spec")"
    generate_playwright_spec "$h" "$spec"
    log "Generated Playwright spec: $spec"

    ( cd "$PROJECT_ROOT" && npx playwright test "$tests_dir/contract-flows.generated.spec.ts" --reporter=json ) \
        > "$report" 2>>"${LOG_FILE:-/dev/null}" || true

    if parse_playwright_report "$report"; then
        log_success "  UI flows passed"
        return 0
    fi
    log_error "  UI flows failed"
    return 1
}

# =============================================================================
# Orchestration + Fix Loop
# =============================================================================

# Run the full contract validation: bring the env up, run backend cases and UI
# flows, tear the env down. Detail of any failures lands in CONTRACT_EXEC_FAILURES.
# Returns 0 if everything passes, 1 otherwise.
run_contract_validation() {
    local h="$1"
    CONTRACT_EXEC_FAILURES=""

    if [ "${DRY_RUN:-false}" = true ]; then
        echo "[DRY RUN] Would run contract validation (backend cases + UI flows)"
        return 0
    fi

    log ">>> CONTRACT VALIDATION: bringing up sample environment"
    if ! contract_env_up "$h"; then
        contract_env_down "$h"
        CONTRACT_EXEC_FAILURES="- sample environment failed to start"$'\n'
        return 1
    fi

    local rc=0
    run_backend_cases "$h" || rc=1
    run_ui_flows "$h" || rc=1

    contract_env_down "$h"
    return $rc
}

# A focused fix pass for contract validation failures (epic-level self-heal,
# mirroring the traceability fix loop). Returns 0 if the model reports success.
execute_contract_fix_phase() {
    local failures="$1"
    local attempt="$2"

    log ">>> CONTRACT FIX: attempt $attempt (addressing contract validation failures)"

    local fix_prompt="You are fixing failures found by automated contract validation - real API calls and browser flows run against a running app.

## Failures to Fix

<failures>
$failures
</failures>

## Rules
- Fix the IMPLEMENTATION so these contract checks pass
- Do NOT weaken, skip, or delete the contract checks themselves
- Do NOT use 'git add -A' or 'git add .' - stage explicit paths
- This is attempt $attempt of $MAX_CONTRACT_FIX_ATTEMPTS

## Completion Signal
When done, output exactly: CONTRACT FIX COMPLETE
If you cannot fix everything, output: CONTRACT FIX INCOMPLETE: <what remains>"

    if [ "${DRY_RUN:-false}" = true ]; then
        echo "[DRY RUN] Would run contract fix (attempt $attempt)"
        return 0
    fi

    run_claude_to_file "$fix_prompt"
    local result
    result=$(read_phase_tail)

    if echo "$result" | grep -q "CONTRACT FIX COMPLETE"; then
        log_success "Contract fix reported complete (attempt $attempt)"
        return 0
    fi
    log_warn "Contract fix incomplete (attempt $attempt)"
    return 1
}

# Top-level gate: run contract validation with a bounded self-heal loop.
# Non-blocking for the run itself, but sets CONTRACT_VALIDATION_FAILED so the
# epic exits non-zero if contracts never pass.
contract_validation_gate() {
    local h="$1"

    local attempt=0
    while true; do
        if run_contract_validation "$h"; then
            log_success "Contract validation passed"
            return 0
        fi

        if [ -z "$CONTRACT_EXEC_FAILURES" ]; then
            log_warn "Contract validation failed without captured detail - continuing"
            CONTRACT_VALIDATION_FAILED=true
            return 1
        fi

        attempt=$((attempt + 1))
        if [ "$attempt" -gt "$MAX_CONTRACT_FIX_ATTEMPTS" ]; then
            log_error "Contract validation still failing after $MAX_CONTRACT_FIX_ATTEMPTS fix attempt(s)"
            type add_metrics_issue >/dev/null 2>&1 && add_metrics_issue "epic-${EPIC_ID:-?}" "contract_validation_failed" "Contract checks failing after $MAX_CONTRACT_FIX_ATTEMPTS attempts"
            CONTRACT_VALIDATION_FAILED=true
            return 1
        fi

        log_warn "Contract failures found, attempting fix $attempt of $MAX_CONTRACT_FIX_ATTEMPTS"
        execute_contract_fix_phase "$CONTRACT_EXEC_FAILURES" "$attempt" || true

        if [ "${NO_COMMIT:-false}" = false ] && [ "${DRY_RUN:-false}" = false ]; then
            git -C "$PROJECT_ROOT" add -u 2>/dev/null || true
            git -C "$PROJECT_ROOT" commit -m "fix(epic-${EPIC_ID:-0}): contract validation fixes (attempt $attempt)" 2>/dev/null || true
        fi
    done
}
