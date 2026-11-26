---
title: "Usage Alerts Epic PRD"
template: prd-epic
status: final
created: "2026-11-23"
updated: "2026-11-24"
---

# Usage Alerts Epic PRD

## Context

Target band: `OKR-02` Good — 99% of threshold breaches deliver within 60 seconds.

## Requirements

- **E02-FR-01**: Workspace admins can create, edit, and disable percentage-based usage threshold rules.
- **E02-FR-02**: Threshold rules validate numeric bounds (1–100%) and target channels before saving.
- **E02-FR-03**: The evaluator dispatches email or webhook alerts once per breach window with deduplication.
- **E02-FR-04**: Failed webhook deliveries retry three times with backoff and record failure state.

## Rules, edge cases and failure modes

- Duplicate alerts within 15 minutes are suppressed unless threshold severity increases.

## Instrumentation

- Record `alert_delivery_latency_ms` and `alert_delivery_status` on every dispatch to prove the 60s target band.

## Changes to the parent

None

## Chunky story slice map

| Story | Outcome | FRs & Instrumentation |
|---|---|---|
| **Threshold rule configuration** | Admins configure, validate, and toggle usage threshold rules. | `E02-FR-01`, `E02-FR-02` |
| **Breach alert delivery & retries** | Breaches trigger deduplicated email/webhook alerts with retries and latency telemetry. | `E02-FR-03`, `E02-FR-04`, `alert_delivery_latency_ms` |
