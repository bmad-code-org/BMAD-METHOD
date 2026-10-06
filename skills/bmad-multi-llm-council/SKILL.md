---
name: bmad-multi-llm-council
description: Swarm Adversarial Cross-Review Gate for BMAD. Dispatches unified diffs to independent external LLM reviewers (MiniMax, Gemini, Claude, Kimi, Codex) via standard local CLI adapters. Use when the user requests multi-model verification, cross-LLM code review, or adversarial review by an independent model.
---

# BMAD Multi-LLM Council (Swarm Cross-Review Gate)

## Purpose & Philosophy

Traditional agentic development suffers from **same-model confirmation bias**: when the implementing LLM reviews its own code or spawns subagents on the same model weights, systematic blind spots (concurrency races, multi-tenant leaks, edge cases) go unnoticed.

The **Multi-LLM Council** operationalizes an adversarial, multi-provider review gate:
- **Independent Evaluator:** A different model family (e.g. MiniMax M3, Gemini Pro/Flash, Claude 3.7, Kimi K3, Codex) audits the unified diff.
- **Zero-Dependency CLI Adapters:** Communicates via local CLI/stdio or ephemeral prompt files in disk (`review-prompts/`), preserving the BMAD core principle of "simplicity over cleverness".
- **Strict Evidence Standard:** Evaluators are constrained to report only concrete, reproducible bugs with file/line evidence. Stylistic suggestions are silenced.

## Workflow

1. **Activation:** Run `bmad-multi-llm-council <diff_file>` or integrate into `bmad-code-review` / `bmad-build`.
2. **Adapter Probing:** The dispatcher probes for available local CLIs (`minimax`, `kimi`, `gemini`, `codex`).
3. **Execution:** The diff is audited using strict adversarial instructions.
4. **Result:** If issues are found, they route into BMAD's standard triage flow (`step-03-triage.md`). If clean, it outputs `APPROVED`.
5. **Fallback:** If no CLI is configured, a manual review prompt is written to disk and halts (`HALT_INSPECT`), ensuring safety is never silently bypassed.
