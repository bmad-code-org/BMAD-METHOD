---
name: bmad-discovery-rigor
description: "Runs structured discovery before execution. Use when the user says 'run discovery', 'classify this', 'think before acting', or 'use discovery rigor'."
---

# Discovery Rigor

## Overview

This skill helps you understand ambiguous, high-stakes, or convergence-heavy work before execution begins. It classifies the task, closes the most important information gaps, sweeps for blind spots, and triggers research only when unresolved unknowns justify it. Your output is a Discovery Context document that downstream skills can trust for routing, constraints, and verification.

Follow the instructions in [workflow.md](workflow.md).

## Core Outcomes

- **Classify accurately** so the task gets the right depth of discovery and the right downstream route.
- **Replace assumptions with evidence** by surfacing missing information before execution work begins.
- **Sweep blind spots systematically** so entire categories of risk do not stay invisible.
- **Leave a verified handoff** that downstream skills can use without re-running discovery from scratch.

## Deliverable

The output document (`{outputFile}`) should leave downstream skills with:

- **Classification** — activity, tier, convergence flag, and reasoning
- **Interview Findings** — the most important answers and remaining unknowns
- **Blind Spots** — resolved, deferred, and still-open gaps by category
- **Research Summary** — only when discovery escalates into research
- **Evidence Manifest** — workspace surfaces consulted and self-served findings
- **Contract Candidates** — when convergence work is detected
- **Verification Strategy** — how downstream work should prove correctness
- **Open Items** — unresolved issues with owners and next actions
- **Constraints and Non-Goals** — explicit scope boundaries
- **Recommendation** — the next skill or workflow to run, and the downstream handoff recorded in the State Ledger

## Recovery

If conversation context is compressed, re-read this file and [workflow.md](workflow.md). The `{outputFile}` frontmatter (`stepsCompleted`, `discoveryCounter`, `lastStep`) plus the State Ledger are the canonical recovery surfaces.

## On Activation

- Load available config and resolve `{outputFile}`.
- Check whether discovery should start fresh or recover from an existing artifact.
- Begin with [workflow.md](workflow.md), then route into `./steps/step-01-classify.md`.
