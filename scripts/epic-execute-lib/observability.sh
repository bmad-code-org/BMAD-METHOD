#!/bin/bash
#
# BMAD Epic Execute - Observability Module
#
# Captures the telemetry the `claude` CLI already emits (session id, token
# usage, cost, latency, context window) as OTel-shaped trace spans, and rolls
# them up into deterministic (non-fabricated) metrics.
#
# Source: docs/improvements/observability-implementation-plan.md
#
# Usage: Sourced by epic-execute.sh. Relies on jq (hard prerequisite, enforced
# by require_observability_deps below) and the following globals from the
# parent script: SPRINT_ARTIFACTS_DIR, EPIC_ID, LOG_FILE, VERBOSE.
#
# Gated behind BMAD_TRACE: tracing is only active when BMAD_TRACE=1 (default
# off during initial rollout). The invocation helper in epic-execute.sh falls
# back to the legacy text path when tracing is disabled.
#

# =============================================================================
# Observability State
# =============================================================================

# Epic-level trace id (one per run); each phase's claude session_id is a span id.
TRACE_ID="${TRACE_ID:-}"

# Path to the append-only span log for this epic (set by init_observability).
TRACE_FILE=""

# Ambient context for the next span (set by the phase functions before each
# claude invocation — see Open Decision 1 in the implementation plan).
CURRENT_PHASE=""
CURRENT_STORY_ID=""

# Whether tracing is active for this run.
TRACE_ENABLED=false

# Intra-phase heartbeat: appends a liveness beat to a .live.jsonl every N
# seconds while a phase is running, so a hard kill (SIGKILL) mid-phase still
# leaves a forensic trail of which phase was in flight and how far it got.
HEARTBEAT_INTERVAL="${BMAD_TRACE_HEARTBEAT_INTERVAL:-10}"
LIVE_TRACE_FILE=""
HEARTBEAT_PID=""
PHASE_START_SECONDS=""
# Main script PID ($$ is the sourcing shell = the epic-execute process).
MAIN_PID="$$"

# =============================================================================
# Dependency Enforcement (Open Decision 4: hard fail)
# =============================================================================

# jq is load-bearing for observability in three places: the live renderer,
# span extraction, and clean .result extraction. When tracing is enabled it is
# a hard prerequisite — too much rides on it to silently degrade.
require_observability_deps() {
    if [ "${BMAD_TRACE:-}" != "1" ]; then
        return 0
    fi
    if ! command -v jq >/dev/null 2>&1; then
        log_error "BMAD_TRACE=1 requires 'jq' but it was not found on PATH."
        log_error "Install jq (https://jqlang.github.io/jq/) or unset BMAD_TRACE."
        exit 1
    fi
    return 0
}

# =============================================================================
# Initialization
# =============================================================================

# Initialize the trace for this epic. Mints a trace id (if not already set) and
# creates the span file. No-op unless BMAD_TRACE=1.
init_observability() {
    if [ "${BMAD_TRACE:-}" != "1" ]; then
        TRACE_ENABLED=false
        return 0
    fi

    if [ -z "$SPRINT_ARTIFACTS_DIR" ] || [ -z "$EPIC_ID" ]; then
        log_warn "Cannot initialize tracing: SPRINT_ARTIFACTS_DIR or EPIC_ID not set"
        TRACE_ENABLED=false
        return 1
    fi

    if [ -z "$TRACE_ID" ]; then
        if command -v uuidgen >/dev/null 2>&1; then
            TRACE_ID=$(uuidgen | tr '[:upper:]' '[:lower:]')
        else
            # Fallback id: epic + pid + start seconds (still unique per run)
            TRACE_ID="epic-${EPIC_ID}-$$-$(date +%s)"
        fi
    fi

    TRACES_DIR="${TRACES_DIR:-$SPRINT_ARTIFACTS_DIR/traces}"
    mkdir -p "$TRACES_DIR" 2>/dev/null || true
    TRACE_FILE="$TRACES_DIR/epic-${EPIC_ID}-trace.jsonl"
    LIVE_TRACE_FILE="$TRACES_DIR/epic-${EPIC_ID}-trace.live.jsonl"

    TRACE_ENABLED=true
    log "Tracing enabled (trace_id=$TRACE_ID) -> $TRACE_FILE"
    return 0
}

# Set the ambient context for the next span. Called by phase functions before
# invoking claude (ambient-vars approach, Open Decision 1).
set_span_context() {
    CURRENT_PHASE="$1"
    CURRENT_STORY_ID="$2"
}

# =============================================================================
# Intra-phase Heartbeat (liveness for debugging hangs / hard kills)
# =============================================================================

# Append one heartbeat record describing the in-flight phase. Reads only the
# latest assistant event from the stream (bounded I/O — no slurp), so it stays
# cheap even for long phases with large tool output. Best-effort: a transient
# partial line just skips this tick.
emit_heartbeat() {
    local stream_file="$1"
    { [ "$TRACE_ENABLED" = true ] && [ -n "$LIVE_TRACE_FILE" ] && [ -f "$stream_file" ]; } || return 0

    local now elapsed ts events last_asst
    now=$(date +%s)
    elapsed=$(( now - ${PHASE_START_SECONDS:-$now} ))
    ts=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
    events=$(wc -l < "$stream_file" 2>/dev/null | tr -d ' '); events="${events:-0}"
    last_asst=$(grep '"type":"assistant"' "$stream_file" 2>/dev/null | tail -n 1)

    if [ -n "$last_asst" ]; then
        printf '%s' "$last_asst" | jq -c \
            --arg trace_id "$TRACE_ID" --arg phase "$CURRENT_PHASE" --arg story "$CURRENT_STORY_ID" \
            --arg ts "$ts" --argjson elapsed "$elapsed" --argjson events "$events" '
            (.message.usage // {}) as $u
            | { trace_id:$trace_id, kind:"heartbeat", phase:$phase, story_id:$story,
                elapsed_s:$elapsed, ts:$ts, events:$events,
                ctx_input_tokens: ($u.input_tokens // 0),
                cache_read: ($u.cache_read_input_tokens // 0),
                out_tokens: ($u.output_tokens // 0),
                last_text: ((([ .message.content[]? | select(.type=="text") | .text ] | last) // "")[0:160]) }' \
            >> "$LIVE_TRACE_FILE" 2>/dev/null || true
    else
        # No assistant output yet — still emit a beat so you can see it started.
        jq -nc \
            --arg trace_id "$TRACE_ID" --arg phase "$CURRENT_PHASE" --arg story "$CURRENT_STORY_ID" \
            --arg ts "$ts" --argjson elapsed "$elapsed" --argjson events "$events" \
            '{trace_id:$trace_id, kind:"heartbeat", phase:$phase, story_id:$story,
              elapsed_s:$elapsed, ts:$ts, events:$events, ctx_input_tokens:0, out_tokens:0, last_text:""}' \
            >> "$LIVE_TRACE_FILE" 2>/dev/null || true
    fi
}

# Start a background heartbeat for the current phase. Emits an immediate beat,
# then one every HEARTBEAT_INTERVAL seconds until the phase ends or the main
# process dies (self-terminates within one interval on SIGKILL).
start_phase_heartbeat() {
    local stream_file="$1"
    { [ "$TRACE_ENABLED" = true ] && [ "${HEARTBEAT_INTERVAL:-0}" -gt 0 ] 2>/dev/null; } || return 0

    PHASE_START_SECONDS=$(date +%s)
    emit_heartbeat "$stream_file"

    (
        while kill -0 "$MAIN_PID" 2>/dev/null; do
            sleep "$HEARTBEAT_INTERVAL"
            emit_heartbeat "$stream_file"
        done
    ) &
    HEARTBEAT_PID=$!
}

# Stop the background heartbeat (called when the phase's claude call returns,
# and defensively from cleanup()).
stop_phase_heartbeat() {
    [ -n "${HEARTBEAT_PID:-}" ] || return 0
    kill "$HEARTBEAT_PID" 2>/dev/null || true
    wait "$HEARTBEAT_PID" 2>/dev/null || true
    HEARTBEAT_PID=""
}

# =============================================================================
# Span Recording
# =============================================================================

# Append one OTel-shaped span for the just-completed claude phase.
# Reads the final `result` envelope from the raw stream file (always the last
# JSONL line) and derives the telemetry fields.
#
# Arguments:
#   $1 - raw stream file (JSONL emitted by claude --output-format stream-json)
#   $2 - phase status (optional; the downstream completion status, e.g. COMPLETE)
record_span() {
    local stream_file="$1"
    local status="${2:-}"

    [ "$TRACE_ENABLED" = true ] || return 0
    [ -n "$TRACE_FILE" ] || return 0
    [ -f "$stream_file" ] || return 0

    # The result envelope is always the last line. A single JSONL line, so this
    # is memory-cheap regardless of phase length.
    local envelope
    envelope=$(tail -n 1 "$stream_file" 2>/dev/null)

    # Validate it is actually the result event; if the call crashed mid-stream
    # the last line won't be a result — record a degraded error span instead.
    local etype
    etype=$(printf '%s' "$envelope" | jq -r '.type // empty' 2>/dev/null) || true
    local ts
    ts=$(date -u +"%Y-%m-%dT%H:%M:%SZ")

    if [ "$etype" != "result" ]; then
        jq -nc \
            --arg trace_id "$TRACE_ID" \
            --arg parent "$CURRENT_STORY_ID" \
            --arg name "$CURRENT_PHASE" \
            --arg story_id "$CURRENT_STORY_ID" \
            --arg status "${status:-UNKNOWN}" \
            --arg ts "$ts" \
            '{trace_id:$trace_id, span_id:null, parent:$parent, name:$name,
              story_id:$story_id, model:null, input_tokens:0, output_tokens:0,
              cache_read:0, cost_usd:0, duration_ms:0, ttft_ms:0, num_turns:0,
              is_error:true, api_error_status:"no_result_envelope",
              ctx_util_pct:0, status:$status, ts:$ts}' \
            >> "$TRACE_FILE" 2>/dev/null || true
        [ "$VERBOSE" = true ] && log_warn "record_span: no result envelope in stream (degraded span)"
        return 0
    fi

    # Pull the primary (largest-context) model for ctx utilization. Sub-agent
    # usage is preserved verbatim under model/cost via the envelope, but for the
    # span's headline model we take the model with the largest context window.
    printf '%s' "$envelope" | jq -c \
        --arg trace_id "$TRACE_ID" \
        --arg parent "$CURRENT_STORY_ID" \
        --arg name "$CURRENT_PHASE" \
        --arg story_id "$CURRENT_STORY_ID" \
        --arg status "$status" \
        --arg ts "$ts" '
        # Choose headline model = the one with the largest contextWindow
        (.modelUsage // {}) as $mu
        | ($mu | to_entries | sort_by(.value.contextWindow // 0) | last) as $primary
        | ($primary.key // .usage.service_tier // null) as $model
        | (($primary.value.contextWindow) // 0) as $ctxwin
        | ((.usage.input_tokens // 0)
            + (.usage.cache_read_input_tokens // 0)
            + (.usage.cache_creation_input_tokens // 0)) as $ctx_used
        | (if $ctxwin > 0 then (($ctx_used / $ctxwin) * 100 * 10 | round / 10) else 0 end) as $ctx_pct
        | {
            trace_id: $trace_id,
            span_id: (.session_id // null),
            parent: $parent,
            name: $name,
            story_id: $story_id,
            model: $model,
            input_tokens: (.usage.input_tokens // 0),
            output_tokens: (.usage.output_tokens // 0),
            cache_read: (.usage.cache_read_input_tokens // 0),
            cost_usd: (.total_cost_usd // 0),
            duration_ms: (.duration_ms // 0),
            ttft_ms: (.ttft_ms // 0),
            num_turns: (.num_turns // 0),
            is_error: (.is_error // false),
            api_error_status: (.api_error_status // null),
            ctx_util_pct: $ctx_pct,
            status: $status,
            ts: $ts
          }' >> "$TRACE_FILE" 2>/dev/null || true

    # Context-utilization warning feeds the Context Strategy gap (#7).
    local ctx_pct
    ctx_pct=$(printf '%s' "$envelope" | jq -r '
        (.modelUsage // {} | to_entries | sort_by(.value.contextWindow // 0) | last) as $p
        | (($p.value.contextWindow) // 0) as $w
        | ((.usage.input_tokens // 0) + (.usage.cache_read_input_tokens // 0) + (.usage.cache_creation_input_tokens // 0)) as $u
        | if $w > 0 then (($u / $w) * 100 | floor) else 0 end' 2>/dev/null)
    if [ -n "$ctx_pct" ] && [ "$ctx_pct" -ge 80 ] 2>/dev/null; then
        log_warn "Context utilization high: ${ctx_pct}% (${CURRENT_PHASE} / ${CURRENT_STORY_ID})"
    fi

    return 0
}

# =============================================================================
# Rollup (deterministic telemetry into metrics.yaml)
# =============================================================================

# Sum all spans for this epic and write a telemetry block into metrics.yaml.
# Deterministic: no model involved, no fabrication. No-op without yq.
rollup_telemetry() {
    [ "$TRACE_ENABLED" = true ] || return 0
    [ -n "$TRACE_FILE" ] && [ -f "$TRACE_FILE" ] || return 0
    [ -n "$METRICS_FILE" ] && [ -f "$METRICS_FILE" ] || return 0
    command -v yq >/dev/null 2>&1 || { log_warn "yq not found - skipping telemetry rollup"; return 0; }

    # Aggregate totals + per-phase breakdown from the JSONL spans.
    local totals_json
    totals_json=$(jq -s '
        {
          total_cost_usd: (map(.cost_usd) | add // 0),
          total_input_tokens: (map(.input_tokens) | add // 0),
          total_output_tokens: (map(.output_tokens) | add // 0),
          cache_read_tokens: (map(.cache_read) | add // 0),
          phases_total: length,
          phases_errored: (map(select(.is_error == true)) | length),
          by_phase: (group_by(.name) | map({
              key: (.[0].name // "unknown"),
              value: {
                  calls: length,
                  cost_usd: (map(.cost_usd) | add // 0),
                  input_tokens: (map(.input_tokens) | add // 0),
                  output_tokens: (map(.output_tokens) | add // 0)
              }
          }) | from_entries)
        }' "$TRACE_FILE" 2>/dev/null)

    [ -z "$totals_json" ] && return 0

    # Tool Call Success Rate (phase-level proxy): non-errored phases / total.
    local rate
    rate=$(printf '%s' "$totals_json" | jq -r '
        if .phases_total > 0
        then (((.phases_total - .phases_errored) / .phases_total) * 100 * 10 | round / 10)
        else 0 end' 2>/dev/null)

    # Write the telemetry block (yq reads the JSON via env to avoid quoting hell).
    TELEMETRY_JSON="$totals_json" yq -i '.telemetry = (strenv(TELEMETRY_JSON) | from_json) | (.telemetry | ..) style=""' "$METRICS_FILE" 2>/dev/null || {
        log_warn "Failed to write telemetry block to metrics"
        return 0
    }
    yq -i ".telemetry.trace_id = \"$TRACE_ID\"" "$METRICS_FILE" 2>/dev/null || true

    # 2026 business-outcome rates (gap #9). Derived deterministically from the
    # counters already in metrics.yaml — no model, no estimation.
    #   - Tool Call Success Rate (phase-level proxy): non-errored phases / total
    #   - Task Completion Rate: completed stories / total stories
    #   - Escalation Rate: stories that exhausted retries / total stories
    local total completed max_retries
    total=$(yq '.stories.total // 0' "$METRICS_FILE" 2>/dev/null); total="${total:-0}"
    completed=$(yq '.stories.completed // 0' "$METRICS_FILE" 2>/dev/null); completed="${completed:-0}"
    max_retries=$(yq '.fix_loop.max_retries_hit // 0' "$METRICS_FILE" 2>/dev/null); max_retries="${max_retries:-0}"

    local completion_rate=0 escalation_rate=0
    if [ "$total" -gt 0 ] 2>/dev/null; then
        completion_rate=$(awk "BEGIN { printf \"%.1f\", ($completed / $total) * 100 }")
        escalation_rate=$(awk "BEGIN { printf \"%.1f\", ($max_retries / $total) * 100 }")
    fi

    yq -i ".telemetry.tool_call_success_rate = $rate" "$METRICS_FILE" 2>/dev/null || true
    yq -i ".telemetry.task_completion_rate = $completion_rate" "$METRICS_FILE" 2>/dev/null || true
    yq -i ".telemetry.escalation_rate = $escalation_rate" "$METRICS_FILE" 2>/dev/null || true

    log "Telemetry rolled up into metrics: $METRICS_FILE"
    return 0
}
