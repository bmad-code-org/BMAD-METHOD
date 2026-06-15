---
title: Agent Loop 2026 Framework — Gap Analysis
---

# Agent Loop 2026 Framework — Gap Analysis

**Date:** 2026-06-15
**Workflows Reviewed:** epic-execute, epic-chain (+ `scripts/epic-execute-lib/`)
**Benchmark:** "Agent Loop Evaluation Framework (2026 Standard)" — Manus AI 5-category rubric
**Status:** Active

---

## Overview

This document scores the epic-execute / epic-chain shell automation against the 2026 Agent Loop Evaluation Framework (context engineering, tool design, runtime governance, error recovery, observability). Each criterion is rated on the rubric's Legacy↔2026 axis (1–5) with concrete `file:line` evidence, followed by a prioritized remediation roadmap.

The headline: the **objective machinery is already strong** — durable external state, per-phase context isolation, real-tooling gates, and deterministic state transitions are at or near 2026 standard. The gaps cluster in **governance, observability, and "prose where code belongs"** — places where a rule is told to the model instead of enforced in the harness.

**Scope note:** This is a point-in-time review of the scripts as of the date above. Line numbers reference the current `scripts/epic-execute.sh` (3,328 lines), `scripts/epic-chain.sh` (946 lines), and `scripts/epic-execute-lib/*.sh`.

---

## Scorecard

| # | Category | Criterion | Score (1–5) | Verdict |
|---|----------|-----------|:-----------:|---------|
| 1 | Context & Memory | Context Strategy | 3 | Partial — isolation yes, summarization no |
| 1 | Context & Memory | Tool Disclosure | 5 | 2026 — lean per-phase step templates |
| 1 | Context & Memory | Memory Persistence | 5 | 2026 — checkpoints / metrics / decision log |
| 1 | Context & Memory | Scaffolding Type | 3 | Partial — strong gates, residual personas |
| 2 | Tool Design | Tool Scoping | 2 | Legacy — `--dangerously-skip-permissions` + `eval` |
| 2 | Tool Design | Input/Output Validation | 3 | Partial — schema declared, not enforced |
| 2 | Tool Design | Deterministic Delegation | 5 | 2026 — state/math/writes all in bash |
| 2 | Tool Design | Failure Handling | 4 | 2026-leaning — self-heal loops |
| 3 | Governance (OWASP) | Policy Enforcement | 3 | Partial — one structural, one prompt-only |
| 3 | Governance (OWASP) | Privilege Tiers | 2 | Legacy — one standing autonomous tier, no HITL |
| 3 | Governance (OWASP) | Identity Management | 2 | Legacy — ambient long-lived creds |
| 3 | Governance (OWASP) | Memory Security | 2 | Legacy — unvalidated write-back + re-ingest |
| 4 | Error Recovery / RALF | Session Architecture | 3 | Partial — fresh process/phase, no watchdog |
| 4 | Error Recovery / RALF | Error Diagnosis | 3 | Partial — self-heal yes, retry wrapper dead code |
| 4 | Error Recovery / RALF | Loop Guardrails | 4 | 2026 — hard caps; missing time/token budgets |
| 4 | Error Recovery / RALF | Exit Conditions | 4 | 2026 — deterministic gates; some advisory |
| 5 | Observability | Tracing Infrastructure | 1 | Legacy — no trace ID, no token/cost/OTel |
| 5 | Observability | Evaluation Metrics | 3 | Partial — raw counters, self-graded scores |
| 5 | Observability | Evaluation Integration | 4 | 2026-leaning — embedded inline gates |

**Category averages:** Context **4.0** · Tools **3.75** · Governance **2.25** · Error Recovery **3.5** · Observability **2.67**

---

## What's Already at the 2026 Bar

### Memory Persistence (5/5)
Durable external state survives session death — the rubric's "external state files" pattern:
- Checkpoint files with 7-day expiry — `utils.sh:500-551`, written on exit `epic-execute.sh:74-82`
- Metrics YAML that **resumes and accumulates** counters across sessions — `epic-execute.sh:646-664`, `:779-785`
- Per-story design plans persisted for post-resume dev phases — `epic-execute.sh:144-145`
- Decision log + sprint-status.yaml as external workflow state — `decision-log.sh`, `epic-execute.sh:832-906`

### Tool Disclosure (5/5)
Progressive disclosure: loads lean ~4–9KB step templates per phase instead of embedding ~40KB workflow YAML — `epic-execute.sh:551-563`, per-phase template selection `:179-183`.

### Deterministic Delegation (5/5)
The LLM emits intent only (a status enum + findings); all counting, duration math, status writes, and pass/fail verdicts run in bash — `epic-execute.sh:693-797`, `:803-906`; `contract-exec.sh:144-170`. Playwright specs are **generated from the harness** (`contract-exec.sh:220-296`), not authored by the model.

### Embedded Probes (4/5)
Quality gates run **inline per story**, not offline batch: arch / test-quality / traceability / static-analysis / regression / contract. The static-analysis and contract gates run **real tooling** (`tsc`, lint, build, pytest, `curl`, `playwright`) whose actual output gates progression and can fail the epic's exit code — `epic-execute.sh:1986-2307`, `:3203-3208`.

---

## Improvement Areas

### HIGH Priority

#### 1. Observability foundation: no trace ID, no token/cost telemetry (Tracing 1/5)

The weakest foundational layer — and the rubric explicitly advises fixing the lowest foundational layer first.

There is no session/trace ID, no OpenTelemetry, and zero token/cost/latency capture. LLM calls are an opaque blob teed to a PID-named text log; the only correlation key is `$$`.

**Evidence:**
- Plain-text logging, no structured fields/spans — `epic-execute.sh:199-217`
- LLM call uninstrumented (no tokens/cost/latency/model captured) — `run_claude_to_file`, `epic-execute.sh:518-529`
- Metrics schema has no tokens/cost/trace ID — `epic-execute.sh:668-688`
- Cost figures in reports are openly **estimated** ("may vary 50–200%") — `epic-chain-execution-report.md:225-248`

**Fix:** Generate a session/trace ID at startup and thread it through every phase + the metrics/log/decision-log writes. Capture real usage by invoking `claude` with `--output-format json` (or `--output-format stream-json`) and parsing the `usage` / `total_cost_usd` fields per phase. This unlocks every downstream metric.

---

#### 2. Resilience layer is fully built but never wired in (Error Recovery)

`execute_claude_with_retry`, `run_with_timeout`, and `CLAUDE_TIMEOUT` (600s default) all exist in `utils.sh:55-150` — but have **zero callers**. Every phase uses bare `run_claude_to_file` (`epic-execute.sh:518-529`) with `|| true`, so:
- A hung phase blocks forever (`CLAUDE_TIMEOUT` never applied to the real path)
- Transient errors (429/timeout/503) are not retried
- Crashes are swallowed and silently judged "incomplete"

There is also no watchdog/supervisor and no stuck-loop progress detection — fix loops burn all attempts even on an identical failure set, despite computing failure signatures in `test-failure-filter.sh:139-151`.

**Fix:** Route `run_claude_to_file` through the existing `run_with_timeout` + retry wrapper (mostly plumbing — the code already exists). Add a progress check that compares failure signatures across fix iterations and aborts early when the set is unchanged.

---

#### 3. Governance is structurally bypassable (Privilege 2/5, Policy partial)

The strong git policies — `check_sensitive_files` (`epic-execute.sh:351-391`), `git add -u` (`:2937`), `check_branch_protection` (`utils.sh:444-474`) — only guard the **final `commit_story` path**. Mid-phase, every agent runs `--dangerously-skip-permissions` (`:524`, `:527`) and can `git add -A` / commit anything itself. The "don't use git add -A" rule is injected as **prose in 7+ places** (`:597-598`, `:1772`, `:1875`, …) but enforced in code only at commit time. There is no read/write/destructive privilege separation and no HITL gate ("AUTOMATED… do NOT pause for user confirmation" — `:593-595`).

**Fix:** Move the staging policy into a git **pre-commit hook** (structural, not prose) so it governs agent-authored commits too; re-run `check_sensitive_files` on any commit. Introduce an approval tier (even a coarse env-gated one) for destructive operations.

---

#### 4. Memory poisoning loop is unguarded (Memory Security 2/5)

`append_to_decision_log` writes raw agent output straight to disk (`decision-log.sh:54-76`), and `get_decision_log_context` re-injects the whole log **verbatim** into the next phase's prompt (`decision-log.sh:80-87`) — the exact RAG/memory-poisoning loop OWASP 2026 (ASI06) warns against, with no validation, segmentation, or provenance tagging. `add_metrics_issue` / `record_fix_attempt` also interpolate agent-influenced strings directly into `yq` expressions (`epic-execute.sh:725`, `:745`) — a YAML/expression-injection surface.

**Fix:** Validate and length-bound decision-log entries before commit; tag provenance (which phase/story produced each entry); sanitize or parameterize strings before they enter `yq` expressions.

---

#### 5. Output contracts declared but not enforced (I/O Validation 3/5)

JSON result schemas are prescribed to the model and parsed with `jq`, but malformed/missing output **silently falls back to grepping prose** (`json-output.sh:311-387`, `check_phase_completion_fuzzy` in `utils.sh`). The documented consequence: **9 stories were mis-marked failed** because the model didn't emit the exact `IMPLEMENTATION COMPLETE:` phrase, requiring manual correction (`epic-chain-execution-report.md:254-272`).

**Fix:** Reject non-conforming output and force a bounded retry instead of degrading to regex. Make the JSON result block mandatory (fail the phase if absent). Relatedly, promote the advisory gates (arch / test-quality / traceability / regression — currently "proceed with documented concerns") to blocking where the risk warrants it, matching the deterministic behavior of the static-analysis and contract gates.

---

### MEDIUM Priority

#### 6. Tool Scoping & sandboxing (Tool Scoping 2/5)

`claude --dangerously-skip-permissions` grants the full unrestricted toolset with no per-phase allowlist or sandbox (`epic-execute.sh:524`, `:527`). Harness commands run via raw `eval` on YAML-derived strings — an injection surface — in `contract-exec.sh:43,53,86,168` and `contract-harness.sh:333,351,368`. The production-scope datastore guard is advisory (`log_warn`), not a block (`contract-harness.sh:194-213`).

**Fix:** Run harness commands as argv arrays (no `eval`). Consider a per-phase tool allowlist and/or containerized execution. Promote the production-scope datastore guard from warning to hard block.

#### 7. Context summarization (Context Strategy 3/5)

Per-phase context isolation is excellent (fresh `claude` process per phase, paths-not-contents handoff), but there is no **anchored iterative summarization**: cross-phase carryover is raw grep/sed-extracted text or tail-truncation (decision context truncated to 20KB at `epic-execute.sh:1466`), and the only control is a hard 150KB cap (`MAX_PROMPT_SIZE`, `:398`), not a utilization band.

**Fix:** Add a summarization step between phases — hold an anchor block (story + ACs + constraints) constant while condensing completed-phase outcomes into a structured summary; target 60–80% utilization rather than a hard truncate.

#### 8. Identity Management (2/5)

Every `claude` call inherits the operator's ambient, long-lived credentials; harness secrets are consumed as ambient env vars (`contract-harness.sh:205`, `:254`). No unique per-task identity, short-lived tokens, or credential scoping.

**Fix:** Where feasible, issue short-lived/scoped credentials per run; vault harness secrets rather than relying on ambient env.

#### 9. Evaluation Metrics — derive rates, separate the judge (Metrics 3/5)

The raw inputs exist (completed/failed/skipped, fix attempts, `max_retries_hit`) but are never computed into **Task Completion Rate / Escalation Rate / Tool Call Success Rate**. Rubric scores (test-quality ≥70, traceability P0=100%) are **self-graded by the same executing model** (`json-output.sh:473-496`) rather than by an independent calibrated judge.

**Fix:** Compute and persist the derived rates in the metrics YAML. Introduce a separate, cheaper judge model (e.g., Haiku) for binary rubric scoring so the executor isn't grading its own work.

---

### LOW Priority

#### 10. `yq`-dependent durability

Metrics, sprint-status, and issue persistence silently degrade without `yq` installed (`epic-execute.sh:707`, `:790`). The otherwise-excellent memory layer is best-effort, not guaranteed.

**Fix:** Either declare `yq` a hard prerequisite (fail fast at startup) or harden the sed/awk fallbacks to full parity.

#### 11. Vestigial "full workflow YAML" priority tier

`CONTENT_PRIORITY_LOW` is still described as "Full workflow YAML (truncate first)" (`epic-execute.sh:404`), a legacy fallback path no active builder uses. Remove to avoid confusion.

#### 12. Gate status not persisted by standalone runs

`validation.gate_status` is written by the **chain** wrapper (`epic-chain.sh:626-638`), not the inner execute loop, so a standalone `epic-execute.sh` run leaves `gate_status: PENDING`.

---

## Two Structural Themes

1. **Prose where code belongs.** The recurring pattern — git rules, "do NOT pause", personas like *"You ARE an adversarial reviewer"* (`:1616`) — is the compensatory scaffolding the rubric flags: a rule told to the model that the harness could instead enforce. The codebase is mid-migration; the objective gates (contracts, real tooling, JSON results) are already constitutive, but the soft rules haven't caught up.

2. **Built-but-unwired.** The retry/timeout resilience layer (`utils.sh:55-150`) is the clearest example — fully implemented, zero callers. The capability gap is often plumbing, not net-new code.

---

## Suggested Sequencing

Per the rubric's "fix the lowest-scoring foundational layer first":

1. **Observability** (#1) — trace/session ID + real token/cost/latency from `claude --output-format json`. Foundation for everything; currently 1/5.
2. **Wire the existing retry/timeout layer** (#2) — pure plumbing, already-written code, large RALF payoff.
3. **Governance** (#3, #4) — pre-commit hook + sensitive-file re-check on agent commits; validate decision-log/metrics writes before commit.
4. **Enforce JSON contracts** (#5) — fail-and-retry on missing signal instead of fuzzy fallback; promote advisory gates to blocking.
5. **Context summarization** (#7) — anchored iterative summarization targeting a utilization band.

The smallest, highest-leverage starting points are **#2 (retry wiring)** and **#3 (pre-commit hook)**.

---

## References

- Benchmark source: "Agent Loop Evaluation Framework (2026 Standard)," Manus AI — context engineering, tool design, OWASP Top 10 for Agentic Apps 2026, RALF loop, OpenTelemetry-first observability.
- Prior review: [`epic-workflows-v1.md`](./epic-workflows-v1.md) (2026-01-02) — overlaps on the `--dangerously-skip-permissions` finding (#1/#3, #6 here).

---

## Appendix A — Observability Deep Dive

**Added:** 2026-06-15 · Expands HIGH-priority item #1 and Evaluation Metrics (#9).

### A.1 Root cause: a single discard point

Every LLM call routes through `run_claude_to_file` (`epic-execute.sh:518-529`), which uses the CLI's **default `text` output format**:

```bash
claude --dangerously-skip-permissions -p "$prompt" 2>&1 | tee -a "$LOG_FILE" > "$PHASE_OUTPUT_FILE" || true
```

Only rendered assistant text survives. The chain report generator does the same (`epic-chain.sh:884`). The 1/5 Tracing score is the consequence of this one choice — not an architectural limit. The telemetry is produced on every call and thrown away.

### A.2 What `claude --output-format json` already returns (verified)

Tested against the installed CLI (v2.1.177). The result envelope contains every field 2026 observability requires:

| Field (verified present) | Example | Rubric need it satisfies |
|---|---|---|
| `session_id` | `f6ff5b55-…` | Trace/session ID (today: PID `$$`) |
| `total_cost_usd` | `0.0586` | Real cost (today: fabricated) |
| `usage.input_tokens` / `output_tokens` | 2629 / 4 | Token spend |
| `usage.cache_read_input_tokens` / `cache_creation_input_tokens` | 15362 / 3718 | Cache efficiency |
| `modelUsage[model].costUSD` + per-model tokens | Opus + Haiku sub-agent | Per-model cost attribution |
| `modelUsage[model].contextWindow` | 1000000 | Enables context-utilization % |
| `duration_ms` / `duration_api_ms` / `ttft_ms` | 1757 / 2522 / 1754 | Per-call latency |
| `num_turns`, `stop_reason`, `is_error`, `api_error_status`, `permission_denials` | 1 / end_turn / false / null / [] | Tool-call success / error telemetry |

The CLI also exposes `--output-format stream-json` (live JSONL ending with the same `result` envelope) and `--json-schema <schema>` for structured-output enforcement. All three require `--print`, which the script already passes.

### A.3 The current report is actively misleading, not merely empty

Because real telemetry is discarded, the chain report **fabricates** it (`epic-chain-execution-report.md:225-248`):

- Token table derived from `Est. Calls = stories × 2` and `~16K input/call` assumptions — arithmetic on story counts, not measurement.
- Cost table priced against **Claude Sonnet 3.5 ($3/$15)** and **Opus ($15/$75)** — neither is the model that ran (`claude-opus-4-8[1m]`); the real `total_cost_usd` was available and discarded.
- Carries the disclaimer *"Actual usage may vary by 50-200%."*

An authoritative-looking cost table that is invented is worse than a blank cell — it is unfalsifiable noise where ground truth was one flag away.

### A.4 Synergy: this fix lifts three other findings

The same envelope partially closes gaps scored elsewhere:

1. **Context Strategy (#7).** `contextWindow` + `input_tokens + cache_read + cache_creation` yields exact per-phase utilization, making the 60–80% target measurable and enforceable for free.
2. **I/O Validation (#5) + the 9-mismark incident.** Parsing `.result` (clean final message) instead of scraping interleaved stdout, plus `--json-schema` to make the status field structurally mandatory, removes the fuzzy-regex fallback (`json-output.sh:311-387`) that mismarked 9 stories (`epic-chain-execution-report.md:254-272`). That incident is fundamentally an output-format problem.
3. **Evaluation Metrics (#9).** Enables the rubric's business metrics: Task Completion Rate (`completed/total`), Escalation Rate (`max_retries_hit/stories` + real `is_error` rate), Tool Call Success Rate (`is_error=false` phases ÷ total).

### A.5 Target design (fits the existing architecture)

Constraints: preserve the memory-safe "pipe to file, read 32KB tail" pattern, and keep the live `tee` to the log.

1. **Switch to `stream-json`, not plain `json`.** Plain `json` buffers and kills the live tee. `--output-format stream-json --include-partial-messages` streams live *and* makes the **last JSON line** the `result` envelope; `read_phase_tail` still captures it (parse the last line where `.type=="result"`). Memory-safety preserved.
2. **One append-only trace file per epic**, using the OTel span data model (convertible to OTLP later):
   `docs/sprint-artifacts/traces/epic-<id>-trace.jsonl` — one span per phase:
   ```json
   {"trace_id":"<epic-uuid>","span_id":"<claude session_id>","parent":"<story_id>",
    "name":"dev","story_id":"4-3","model":"claude-opus-4-8[1m]",
    "input_tokens":2629,"output_tokens":4,"cache_read":15362,"cost_usd":0.058,
    "duration_ms":1757,"ttft_ms":1754,"num_turns":1,"is_error":false,
    "ctx_util_pct":2.1,"status":"COMPLETE","ts":"2026-06-15T…"}
   ```
   Generate one epic-level `trace_id` (`uuidgen`) at startup; each call's `session_id` is the `span_id`, `story_id` the parent. This is the single correlating ID `$$` never provided.
3. **Deterministic rollup into `metrics.yaml`** — add a `telemetry:` block summed from the JSONL (no model, no fabrication): `total_cost_usd`, `total_input_tokens`, `total_output_tokens`, `cache_read_tokens`, `by_phase`. The chain report then reads measured numbers; the `Estimated Token Usage` section is deleted.
4. **OTel bridge (phase 2, optional).** JSONL-with-OTel-fields is the pragmatic 80%. A later post-processor converts spans → OTLP without touching the hot path.

### A.6 Caveats

- **jq dependency** — telemetry parsing needs `jq` (same soft-dep fragility as `yq`, item #10). Degrade gracefully (skip span, don't crash); consider making `jq` a hard startup prerequisite.
- **Cost includes sub-agents** — `modelUsage` surfaced an internal Haiku call inside an Opus phase. Record `modelUsage` verbatim; don't flatten to one model.
- **Cache tokens dominate** — in testing, cache-read (15K) was 6× fresh input (2.6K). Report fresh vs. cache-read separately; compute utilization from the sum.
- **`stream-json` is noisier on disk** — log grows faster (every partial chunk). The existing 64KB inter-story log truncation (`epic-execute.sh:3182`) mitigates; confirm it suffices.

### A.7 Why this is the right place to start

Observability scored lowest yet is the cheapest high-priority fix and the only one that drags three other findings upward. The data already exists on every call; the work is plumbing (a format switch + a `record_span` helper + a deterministic rollup), not building telemetry infrastructure.
