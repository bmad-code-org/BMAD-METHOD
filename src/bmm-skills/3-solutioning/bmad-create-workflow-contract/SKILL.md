---
name: bmad-create-workflow-contract
description: "Defines workflow and operator contracts. Use when the user says 'create a workflow contract', 'define the operator contract', or 'formalize the workflow interface'."
---

# Workflow Contract

## Overview

This skill helps you formalize boundaries between systems, repos, or workflow stages through a canonical contract document. It works by surfacing contract boundaries, defining each approved surface with inline compliance questions, and checking the finished contract for cross-surface consistency. Your output is a frozen workflow contract that downstream teams and skills can treat as the authoritative interface.

Follow the instructions in [workflow.md](workflow.md).

## Your Approach

- Make every boundary explicit enough that a new operator or repo owner can follow it without tribal knowledge.
- Keep producer, consumer, and owner responsibilities visible at each surface.
- Write compliance questions that can be answered with evidence, not opinion.
- Freeze approved contract sections unless the user explicitly reopens them.

## Deliverable

The output document (`{planning_artifacts}/workflow-contract.md`) should leave downstream work with:

- **Systems in Scope** — systems, repos, or stages with roles and owners
- **Per-Surface Contracts** — sections driven by `./resources/contract-surface-types.csv`
- **Compliance Questions** — inline, evidence-ready checks for each confirmed contract
- **Boundaries and Constraints** — Always / Ask First / Never rules for operators and maintainers

## Recovery

If conversation context is compressed, re-read this file and [workflow.md](workflow.md). The output document frontmatter (`stepsCompleted`, `lastStep`, `mode`) is the recovery source.

## On Activation

- Load config and the contract surface taxonomy.
- Discover candidate input documents, then confirm scope before loading them in full.
- Begin with [workflow.md](workflow.md), then route into `./steps/step-01-init.md`.
