# Session Trace Output Template

_Use this template when `downstream_consumer` is "session trace", "protocol output", or "calibration". It defines the structure a distilled session trace should preserve._

## Required Sections

A session trace distillate must preserve these sections in order:

### Header

- Activity type and tier (Solve/Build/Execute + depth)
- Commands exercised
- Protocol files loaded
- Self-serve summary

### Discovery Counter Log

| Step | Counter change | Reason |
| ---- | -------------- | ------ |

### Evidence Log

- Authoritative files read
- Files changed
- Validation performed
- Calibration follow-up status

### Outcome Summary

| Area              | Assessment            |
| ----------------- | --------------------- |
| Problem framing   | Pass / Partial / Fail |
| Evidence coverage | Pass / Partial / Fail |
| Verification      | Pass / Partial / Fail |
| Output quality    | Pass / Partial / Fail |

Unresolved items (if any).

### State Ledger (final)

- Session identifier
- Problem summary
- Activity and tier
- Workflow position (completed command sequence)
- Discovery Counter (final value)
- Findings per command
- Open items
- Stop-gate decisions

## Compression Rules for Session Traces

When compressing session traces:

- **Preserve all stop-gate outcomes** — these are decisions, not filler
- **Preserve Discovery Counter transitions** — each increment/reset is a signal
- **Preserve evidence references** — file paths, search results, test outcomes
- **Compress reasoning narrative** — keep conclusions, drop exploration prose
- **Preserve the final State Ledger verbatim** — it enables session resumption
- **Drop intermediate State Ledger snapshots** — only the final one matters
- **Preserve formal receipts** — counterexample witnesses, proof targets, dispositions

## Calibration Metadata

When the distillate is produced for calibration purposes, include in frontmatter:

```yaml
calibration_path: '[mode/path label from calibration index]'
calibration_status: 'candidate | promoted | gap-filler'
```
