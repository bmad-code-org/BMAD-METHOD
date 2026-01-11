---
title: "AI-Generated Testing: Why Most Approaches Fail"
description: How Playwright-Utils, TEA workflows, and Playwright MCPs solve AI test quality problems
---


AI-generated tests frequently fail in production because they lack systematic quality standards. This document explains the problem and presents a solution combining three components: Playwright-Utils, TEA (Test Architect), and Playwright MCPs.

:::note[Source]
This article is adapted from [The Testing Meta Most Teams Have Not Caught Up To Yet](https://dev.to/muratkeremozcan/the-testing-meta-most-teams-have-not-caught-up-to-yet-5765) by Murat K Ozcan.
:::

## The Problem with AI-Generated Tests

When teams use AI to generate tests without structure, they often produce what can be called "slop factory" outputs:

| Issue | Description |
|-------|-------------|
| Redundant coverage | Multiple tests covering the same functionality |
| Incorrect assertions | Tests that pass but don't actually verify behavior |
| Flaky tests | Non-deterministic tests that randomly pass or fail |
| Unreviewable diffs | Generated code too verbose or inconsistent to review |

The core problem is that prompt-driven testing paths lean into nondeterminism, which is the exact opposite of what testing exists to protect.

:::caution[The Paradox]
AI excels at generating code quickly, but testing requires precision and consistency. Without guardrails, AI-generated tests amplify the chaos they're meant to prevent.
:::

## The Solution: A Three-Part Stack

The solution combines three components that work together to enforce quality:

### Playwright-Utils

Bridges the gap between Cypress ergonomics and Playwright's capabilities by standardizing commonly reinvented primitives through utility functions.

| Utility | Purpose |
|---------|---------|
| api-request | API calls with schema validation |
| auth-session | Authentication handling |
| intercept-network-call | Network mocking and interception |
| recurse | Retry logic and polling |
| log | Structured logging |
| network-recorder | Record and replay network traffic |
| burn-in | Smart test selection for CI |
| network-error-monitor | HTTP error detection |
| file-utils | CSV/PDF handling |

These utilities eliminate the need to reinvent authentication, API calls, retries, and logging for every project.

### TEA (Test Architect Agent)

A quality operating model packaged as eight executable workflows spanning test design, CI/CD gates, and release readiness. TEA encodes test architecture expertise into repeatable processes.

| Workflow | Purpose |
|----------|---------|
| `*test-design` | Risk-based test planning per epic |
| `*framework` | Scaffold production-ready test infrastructure |
| `*ci` | CI pipeline with selective testing |
| `*atdd` | Acceptance test-driven development |
| `*automate` | Prioritized test automation |
| `*test-review` | Test quality audits (0-100 score) |
| `*nfr-assess` | Non-functional requirements assessment |
| `*trace` | Coverage traceability and gate decisions |

:::tip[Key Insight]
TEA doesn't just generate tests—it provides a complete quality operating model with workflows for planning, execution, and release gates.
:::

### Playwright MCPs

Model Context Protocols enable real-time verification during test generation. Instead of inferring selectors and behavior from documentation, MCPs allow agents to:

- Run flows and confirm the DOM against the accessibility tree
- Validate network responses in real-time
- Discover actual functionality through interactive exploration
- Verify generated tests against live applications

## How They Work Together

The three components form a quality pipeline:

| Stage | Component | Action |
|-------|-----------|--------|
| Standards | Playwright-Utils | Provides production-ready patterns and utilities |
| Process | TEA Workflows | Enforces systematic test planning and review |
| Verification | Playwright MCPs | Validates generated tests against live applications |

**Before (AI-only):** 20 tests with redundant coverage, incorrect assertions, and flaky behavior.

**After (Full Stack):** Risk-based selection, verified selectors, validated behavior, reviewable code.

## Why This Matters

Traditional AI testing approaches fail because they:

- **Lack quality standards** — No consistent patterns or utilities
- **Skip planning** — Jump straight to test generation without risk assessment
- **Can't verify** — Generate tests without validating against actual behavior
- **Don't review** — No systematic audit of generated test quality

The three-part stack addresses each gap:

| Gap | Solution |
|-----|----------|
| No standards | Playwright-Utils provides production-ready patterns |
| No planning | TEA `*test-design` workflow creates risk-based test plans |
| No verification | Playwright MCPs validate against live applications |
| No review | TEA `*test-review` audits quality with scoring |

This approach is sometimes called *context engineering*—loading domain-specific standards into AI context automatically rather than relying on prompts alone. TEA's `tea-index.csv` manifest loads relevant knowledge fragments so the AI doesn't relearn testing patterns each session.

## Related

- [TEA Overview](/docs/explanation/features/tea-overview.md) — Workflow details and cheat sheets
- [Setup Test Framework](/docs/how-to/workflows/setup-test-framework.md) — Implementation guide
- [The Testing Meta Most Teams Have Not Caught Up To Yet](https://dev.to/muratkeremozcan/the-testing-meta-most-teams-have-not-caught-up-to-yet-5765) — Original article by Murat K Ozcan
- [Playwright-Utils Repository](https://github.com/seontechnologies/playwright-utils) — Source and documentation
