<!-- Case file template. Copy this structure into a new case file at the start of an investigation.
     Update sections as evidence accumulates. Never delete a hypothesis: update its Status and add a Resolution.
     Append follow-up sessions under dated `## Follow-up: {date}` blocks instead of overwriting earlier reasoning. -->

# Investigation: {title}

## Case Info

| Field            | Value                                                                                  |
| ---------------- | -------------------------------------------------------------------------------------- |
| Ticket           | {ticket-id or "N/A"}                                                                   |
| Date opened      | {date}                                                                                 |
| Status           | Active                                                                                 |
| System           | {system description, OS, version, relevant environment details}                        |
| Evidence sources | {diagnostic archive, logs, crash dump, code, version control history, etc.}            |

## Problem Statement

{User-reported problem description. This is the initial claim. It may be refined or contradicted by evidence during the
investigation.}

## Evidence Grading Legend

- **Confirmed.** Directly observed in logs, code, or dumps. Cited with specific evidence.
- **Deduced.** Logically follows from confirmed evidence. Reasoning chain shown.
- **Hypothesized.** Plausible but unconfirmed. States what evidence would confirm or refute.

## Evidence Inventory

| Source   | Status                          | Notes     |
| -------- | ------------------------------- | --------- |
| {source} | {Available / Partial / Missing} | {details} |

## Investigation Backlog

Paths to explore, ordered by priority. Updated throughout the investigation.

| # | Path to Explore | Priority              | Status                                     | Notes     |
| - | --------------- | --------------------- | ------------------------------------------ | --------- |
| 1 | {description}   | {High / Medium / Low} | {Open / In Progress / Done / Blocked}      | {context} |

## Timeline of Events

Chronological reconstruction from multiple evidence sources. Each entry cites its source.

| Time        | Event               | Source                 | Confidence              |
| ----------- | ------------------- | ---------------------- | ----------------------- |
| {timestamp} | {event description} | {log file, commit, …}  | {Confirmed / Deduced}   |

## Confirmed Findings

Directly observed in logs, code, or dumps. Each finding includes a citation: `path:line`, log timestamp, commit hash.

### Finding 1: {title}

**Evidence:** {citation}

**Detail:** {description}

## Deduced Conclusions

Logically follows from confirmed findings. Each deduction shows the reasoning chain from confirmed evidence to
conclusion.

### Deduction 1: {title}

**Based on:** {which confirmed findings}

**Reasoning:** {logical chain}

**Conclusion:** {what follows}

## Hypothesized Paths

All hypotheses ever formed during the investigation. Hypotheses are NEVER removed. Only their Status is updated. This
preserves the full reasoning history.

### Hypothesis 1: {title}

**Status:** {Open / Confirmed / Refuted}

**Theory:** {description}

**Supporting indicators:** {what makes this plausible}

**Would confirm:** {specific evidence that would prove this}

**Would refute:** {specific evidence that would disprove this}

**Resolution:** {when status changes from Open, explain what evidence settled it}

## Missing Evidence

Data gaps identified during investigation. Each gap describes what is missing and what it would resolve if available.

| Gap            | Impact                                | How to Obtain  |
| -------------- | ------------------------------------- | -------------- |
| {what's missing} | {what it would confirm or eliminate} | {how to get it} |

## Source Code Trace

If source code was traced during the investigation.

| Element       | Detail                                       |
| ------------- | -------------------------------------------- |
| Error origin  | {file:line, function name}                   |
| Trigger       | {what causes this code to execute}           |
| Condition     | {what state produces the observed behavior}  |
| Related files | {other files in the same code path}          |

## Conclusion

**Confidence:** {High / Medium / Low}

{Summary of what happened based on the evidence. Clearly states what is Confirmed versus what remains Hypothesized. If
the root cause is identified, states it. If not, states the most promising hypothesized paths and what would resolve the
remaining uncertainty.}

## Recommended Next Steps

### Fix direction

{High-level description of what needs to change and why. Categorize by mechanism when multiple issues combine to produce
the bug.}

### Diagnostic

{Steps to confirm the root cause. Additional logging, targeted tests, data to collect.}

## Reproduction Plan

{How to reproduce the issue in a controlled environment. Include setup, trigger, and expected results. Scale from
isolated proof to full system reproduction when applicable.}

## Follow-up: {date}

Append a new dated block when new findings extend an existing case across sessions. One block per session. Never
overwrite earlier blocks.

### New Evidence

{What new data was provided or discovered.}

### Additional Findings

{New Confirmed findings, Deductions, or Hypotheses, with grading.}

### Updated Hypotheses

{Which hypotheses were Confirmed, Refuted, or refined.}

### Backlog Changes

{Items completed, items added, reprioritization.}

### Updated Conclusion

{Revised assessment incorporating new evidence.}
