# Data File Index (v1.9.0)

**Purpose:** Explicit guidance on when to load each data file during execution.

---

## Loading Rules

1. **LOAD ONCE** = Read at step initialization, keep in context
2. **LOAD ON TRIGGER** = Read only when specific condition occurs
3. **NEVER LOAD** = Reference/debug files, not for execution

---

## Step 03: Execute - File Loading Guide

### LOAD ONCE (at step start)

| File | Why |
|------|-----|
| `orchestrator-rules.md` | Core rules for orchestrator behavior |
| `execution-patterns.md` | FORBIDDEN patterns - must know before any execution |
| `scripts-reference.md` | Script usage patterns |

### LOAD ON TRIGGER

| File | When to Load |
|------|--------------|
| `retry-fallback-strategy.md` | When a step FAILS and you need retry logic |
| `monitoring-fallback.md` | When monitoring FAILS (TaskOutput empty/error 2+ times) |
| `crash-recovery.md` | When session CRASHES (not just fails) |
| `code-review-loop.md` | When entering code review phase (Step D) |
| `escalation-triggers.md` | When considering escalation to user |
| `escalation-messages-core.md` | When displaying escalation message (triggers 1-4) |
| `escalation-messages-extended.md` | When displaying escalation message (triggers 5-8) |
| `agent-fallback.md` | When switching from primary to fallback agent |
| `agent-fallback-troubleshooting.md` | When fallback agent also fails |
| `adaptive-retry.md` | When same task fails 3+ times (plateau detection) |
| `subagent-prompts.md` | When parsing session output with sub-agent |
| `monitoring-codex.md` | When using Codex agent (not Claude) |

### NEVER LOAD DURING EXECUTION

| File | Purpose |
|------|---------|
| `tmux-commands.md` | Reference doc - use scripts instead |
| `tmux-long-command-*.md` | Debug/testing docs |
| `complexity-scoring.md` | Used during preflight, not execution |
| `preflight-prompts.md` | Used in step-02, not step-03 |
| `stop-hook-*.md` | Setup docs, not execution |
| `marker-file-format.md` | Internal format reference |
| `success-patterns.md` | Output pattern reference |
| `workflow-commands.md` | Reference doc |
| `wrapup-templates.md` | Used in step-04, not step-03 |
| `retrospective-*.md` | Used in step-03b retrospective section only |

---

## Quick Decision Tree

```
Starting execution?
  → Load: orchestrator-rules.md, execution-patterns.md, scripts-reference.md

Step failed?
  → Load: retry-fallback-strategy.md
  → If 3+ same failures: Load adaptive-retry.md

Monitoring not responding?
  → Load: monitoring-fallback.md

Session crashed?
  → Load: crash-recovery.md

Entering code review?
  → Load: code-review-loop.md

Need to escalate?
  → Load: escalation-triggers.md, then escalation-messages-*.md

Using Codex?
  → Load: monitoring-codex.md
```

---

## Anti-Pattern: Loading Everything

**WRONG:**
```
Load ALL data files at start of step-03
```

**WHY WRONG:** Bloats context, increases confusion, wastes tokens.

**CORRECT:**
```
Load 3 core files at start
Load additional files ONLY when their trigger condition occurs
```
