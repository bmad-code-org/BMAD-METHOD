---
title: Observability Implementation Plan
---

# Observability Implementation Plan

**Date:** 2026-06-15
**Targets:** HIGH item #1 (Tracing 1/5), with synergistic wins on #5 (I/O Validation) and #9 (Evaluation Metrics)
**Source analysis:** [`agent-loop-2026-gap-analysis.md`](./agent-loop-2026-gap-analysis.md) — Appendix A
**Status:** Phases 0–2 implemented on branch `feat/observability-tracing` (gated behind `BMAD_TRACE=1`). Phase 3 (`--json-schema` enforcement) and Phase 4 (OTLP bridge) deferred to separate PRs. Chain-level trace id (decision #5) still deferred.

**Locked decisions:** (1) ambient vars · (2) jq live renderer, capture tee placed upstream of jq so renderer failure is cosmetic-only · (3) separate PRs · (4) hard-fail on jq when `BMAD_TRACE=1` · (5) chain-level trace id deferred.

**Added beyond original plan — intra-phase heartbeat.** Per request, `start_phase_heartbeat`/`emit_heartbeat`/`stop_phase_heartbeat` append a liveness beat to `epic-<id>-trace.live.jsonl` every `BMAD_TRACE_HEARTBEAT_INTERVAL` seconds (default 10) while a phase runs — so a `kill -9` mid-phase leaves a forensic trail (which phase, elapsed, context size, last assistant text). Reads only the latest assistant event (bounded I/O, no slurp); self-terminates within one interval if the main process dies; defensively stopped in `cleanup()`.

**Implementation note:** all new tracing logic lives in `scripts/epic-execute-lib/observability.sh` (new module). `epic-execute.sh` changes are limited to: sourcing the module, a startup dep-check + `init_observability`, the `run_claude_to_file` rewrite, a `record_span` call inside that helper, `rollup_telemetry` in `cleanup()`, one temp-file cleanup line, and 9 one-line `set_span_context` calls. Verified against the live CLI: real span lands with correct model/tokens/cost/ctx%, clean-text compatibility holds (downstream `IMPLEMENTATION COMPLETE` detection still works), crash path writes a degraded error span, legacy path (`BMAD_TRACE` unset) is byte-for-byte unchanged, and the hard-fail exits 1 when jq is absent.

---

## Goal

Stop discarding the telemetry the `claude` CLI already emits on every call. Capture it as OTel-shaped trace spans, roll it up into deterministic (non-fabricated) metrics, and — as a side effect of the same code-path change — replace fragile stdout-scraping with clean `.result` parsing.

## Verified CLI facts (claude 2.1.177)

All confirmed against the installed CLI on 2026-06-15:

1. `--output-format json` returns one result object with: `session_id`, `total_cost_usd`, `usage.{input_tokens,output_tokens,cache_read_input_tokens,cache_creation_input_tokens}`, `modelUsage[model].{costUSD,inputTokens,outputTokens,contextWindow}`, `duration_ms`, `duration_api_ms`, `ttft_ms`, `num_turns`, `stop_reason`, `is_error`, `api_error_status`, `permission_denials`.
2. `--output-format stream-json` **requires `--verbose`** (hard error otherwise). Emits JSONL: `system/init` → `rate_limit_event` → `assistant`(s)/`tool_use`/`tool_result` → **`result`** (always the last line).
3. The final `result` line carries `.result` = the clean final assistant text, plus the full telemetry envelope from (1). It is a single line, so `tail -n 1 | jq` extracts it cheaply regardless of phase length — the memory-safe "read the tail" design is preserved.
4. A stderr warning (`no stdin data received in 3s…`) leaks into `2>&1`; suppressed with `< /dev/null`.
5. `modelUsage` attributes cost across models — internal sub-agents (e.g. a Haiku helper inside an Opus phase) show up separately. Record verbatim; do not flatten.
6. `uuidgen`, `jq`, `yq` all present on the dev machine.

## Design decision: stream-json + `.result` extraction (compatibility-preserving)

`run_claude_to_file` is the single chokepoint (`epic-execute.sh:518-529`); all 9 phase call sites follow `run_claude_to_file …; result=$(read_phase_tail)`. The downstream parsers (`extract_json_result`, `check_phase_completion`) expect `PHASE_OUTPUT_FILE` to hold the rendered assistant text.

**Plan:** switch the invocation to `stream-json --verbose`, write the raw JSONL to a separate stream file, then post-process:
- Extract `.result` (clean text) from the final `result` line → write to `PHASE_OUTPUT_FILE`. **All 9 call sites keep working unchanged**, and parsing improves (no interleaved tool output → fixes the 9-mismark incident, gap #5).
- Extract telemetry from the same line → `record_span` (new) appends a JSONL span.
- Graceful degradation: if `jq` is absent, no `result` line is found, or the call crashed, fall back to today's raw-text behavior so nothing regresses.

This keeps the blast radius to one function plus two new helpers; the 9 call sites are untouched.

---

## Work breakdown (phased)

### Phase 0 — Prerequisites & scaffolding (low risk)
- [ ] Add `jq` to a startup capability check; decide hard-fail vs. graceful-degrade (see Open Decision 4). Mirror the existing `yq` check pattern.
- [ ] Create `TRACES_DIR="$SPRINT_ARTIFACTS_DIR/traces"`; `mkdir -p` alongside the other artifact dirs (`epic-execute.sh:138-145`).
- [ ] Generate an epic-level `TRACE_ID=$(uuidgen)` at startup (near `EPIC_START_SECONDS`, `:1283`). This is the single correlating ID `$$` never provided.

### Phase 1 — Instrument the invocation (core, additive)
- [ ] Rewrite `run_claude_to_file` to use `stream-json --verbose`, raw JSONL → `$PHASE_STREAM_FILE`, live-render assistant text to the log (Open Decision 2), then derive `PHASE_OUTPUT_FILE` from `.result`.
- [ ] Add `record_span <phase> <story_id>` — reads `tail -n 1 "$PHASE_STREAM_FILE"`, validates `.type=="result"`, appends one OTel-shaped span to `$TRACES_DIR/epic-<id>-trace.jsonl`.
- [ ] Pass `phase` + `story_id` into `run_claude_to_file` (currently positional `$1`/`-f`); thread through the 9 call sites or set module-level `CURRENT_PHASE`/`CURRENT_STORY_ID` before each call (Open Decision 1 — signature vs. ambient vars).
- [ ] Compute `ctx_util_pct` = (input + cache_read + cache_creation) / `contextWindow` and `log_warn` when > 80% (feeds Context Strategy, gap #7).

Span schema (one line per phase):
```json
{"trace_id":"…","span_id":"<session_id>","parent":"<story_id>","name":"dev",
 "story_id":"4-3","model":"claude-opus-4-8[1m]","input_tokens":2705,
 "output_tokens":4,"cache_read":19080,"cost_usd":0.0237,"duration_ms":1089,
 "ttft_ms":1012,"num_turns":1,"is_error":false,"api_error_status":null,
 "ctx_util_pct":2.1,"status":"COMPLETE","ts":"2026-06-15T…Z"}
```

### Phase 2 — Deterministic rollup (replaces fabrication)
- [ ] Add `rollup_telemetry` — sum the JSONL spans into a `telemetry:` block in `metrics.yaml` (`total_cost_usd`, `total_input_tokens`, `total_output_tokens`, `cache_read_tokens`, `by_phase`). Call from `finalize_metrics` (`:765`).
- [ ] Add derived metrics (gap #9): Task Completion Rate, Escalation Rate (`max_retries_hit/stories` + real `is_error` rate), Tool Call Success Rate (`is_error=false` ÷ phases).
- [ ] Chain: delete the fabricated `Estimated Token Usage` / `Cost Estimates` sections (`epic-chain-execution-report.md` generator, `epic-chain.sh:831-876`); have the report read measured `telemetry:` from each epic's metrics. Also instrument the chain's own report-generator `claude` call (`epic-chain.sh:884`).

### Phase 3 — Contract enforcement (synergistic, higher risk — gate separately)
- [ ] Use `--json-schema` to make the completion `status` field structurally mandatory, removing the fuzzy-regex fallback (`json-output.sh:311-387`). Sequence **after** Phases 1–2 prove stable, since it changes completion semantics.

### Phase 4 — OTel bridge (optional, later)
- [ ] Post-processor: JSONL spans → OTLP exporter to a collector. No hot-path change. Defer until someone needs a dashboard.

---

## Test strategy

- **Unit (bats or shell asserts):** feed a captured `result` JSONL fixture into `record_span`/`rollup_telemetry`; assert span fields and YAML sums. Capture one real fixture now (we already have sample envelopes) and commit under `test/fixtures/`.
- **Degradation:** run the new path with `jq` shadowed out of `PATH`; assert it falls back to raw text and does not crash.
- **Crash path:** feed a truncated stream (no `result` line); assert graceful fallback + a span marked `is_error`/incomplete.
- **End-to-end:** `--dry-run` won't call claude, so add a tiny real one-story epic to a scratch fixture and confirm a populated `trace.jsonl` + `telemetry:` block.
- **Regression:** confirm all 9 phases still parse completion correctly (the `.result` text is a superset of what they saw before).

## Rollout / safety

- Gate Phase 1 behind an env flag (e.g. `BMAD_TRACE=1`) for the first iteration so the old text path stays default until the new one is proven, then flip the default.
- Phases 1–2 are observe-only (no behavior change beyond cleaner parsing). Phase 3 changes control flow — ship it on its own PR per the repo's "<800 lines, split larger changes" rule.

## Open decisions (need sign-off before coding)

1. **Threading phase/story into the invocation** — change `run_claude_to_file`'s signature, or set ambient `CURRENT_PHASE`/`CURRENT_STORY_ID` before each call? Ambient is a smaller diff (no call-site edits) but more implicit. *Recommendation: ambient vars set in the phase functions.*
2. **Live log format** — tee raw JSONL to the log (ugly for humans tailing it) vs. pipe through a small `jq` renderer that prints assistant text live. *Recommendation: jq renderer for the terminal/log, raw JSONL to the stream file.*
3. **Bundle scope** — observability-only (Phases 0–2), or include the contract enforcement (Phase 3) in the same effort since it touches the same path? *Recommendation: separate PRs; land 0–2 first.*
4. **`jq` dependency** — hard prerequisite (fail fast at startup) or graceful degradation? Telemetry is useless without it, but failing hard is a sharper UX change. *Recommendation: graceful-degrade with a loud one-time warning, consistent with the current `yq` handling.*
5. **Trace ID propagation to chain** — should `epic-chain.sh` mint a chain-level trace ID that each epic inherits as a parent span, giving one trace across the whole chain? *Recommendation: yes, but defer to Phase 2.*

---

## Effort estimate

| Phase | Scope | Risk | Rough size |
|-------|-------|------|-----------|
| 0 | dirs, trace id, jq check | low | ~30 lines |
| 1 | invocation + record_span | medium | ~120 lines (1 fn rewrite + 1 new) |
| 2 | rollup + derived metrics + chain report | low–med | ~150 lines |
| 3 | --json-schema enforcement | medium–high | separate PR |
| 4 | OTLP bridge | low (isolated) | deferred |

Phases 0–2 are the core observability win and are mostly additive plumbing.
</content>
</invoke>
