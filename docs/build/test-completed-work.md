---
title: 'Test Completed Work'
description: Choose a testing path after implementation — built-in QA for generated coverage, or TEA when you need strategy, traceability, or release gates.
sidebar:
  order: 3
---

After a change is implemented, decide whether it needs more automated
coverage and which BMad path should produce it. The built-in skill is
`bmad-qa-generate-e2e-tests`. It generates API and end-to-end tests for
code that already exists. If you need test strategy, risk-based planning,
or a release gate, install the Test Architect (TEA) module instead. See
[how a run works](#run-bmad-qa-generate-e2e-tests).

This is generated coverage of finished work. It is not code review, and it
is not the manual observations in [Checkpoint a Change](checkpoint-a-change.md).

## Which Path?

| Factor | Built-in QA | TEA |
| --- | --- | --- |
| **Best for** | Coverage for implemented features | Strategy, traceability, or a release gate |
| **Setup** | Included with BMM | Install the TEA module |
| **Approach** | Generate tests from the code that exists | Plan first, then generate with traceability |
| **What it covers** | API and E2E tests | Design, ATDD, automation, review, NFRs, and gates |
| **Strategy** | Happy path plus a few critical errors | Risk-based (P0–P3) |

:::tip[Start with built-in QA]
Most projects should start with `bmad-qa-generate-e2e-tests`. Install TEA
when you need a test strategy, quality gates, or requirements traceability
that this skill does not produce.
:::

## Run `bmad-qa-generate-e2e-tests`

Open a **fresh chat** and name the skill. You can say what to test before,
with, or after the command — a feature, a directory, or "discover what is
untested."

```text
/bmad-qa-generate-e2e-tests
```

```text
/bmad-qa-generate-e2e-tests Create API and E2E tests for the login flow.
```

It uses whatever test framework the project already has. If there is none,
it looks at the stack and suggests one.

### What a run does

1. **Detect the test framework** — scans dependencies and existing tests
   (Playwright, Jest, Vitest, Cypress, and similar).
2. **Identify features** — asks what to test, or auto-discovers features in
   the codebase.
3. **Generate API tests** when there are endpoints — status codes, response
   shape, happy path, and one or two error cases.
4. **Generate E2E tests** when there is a UI — user workflows with semantic
   locators (roles, labels, text) and visible-outcome assertions.
5. **Run the tests** and fix failures immediately.
6. **Write a summary** of what was generated and what is still uncovered.

Generated tests stay simple on purpose: standard framework APIs, independent
cases, no hardcoded waits, descriptions that read as feature documentation.

## What You Get

- Test files under the project's `tests/` directory
- A test summary at `tests/test-summary.md` in your implementation artifacts
  directory
- Tests that were run once in this session and made to pass

## Limits

`bmad-qa-generate-e2e-tests` generates tests only. It does not review the
implementation — that is `bmad-build` during the run, or `bmad-code-review`
if you want another pass.

It does not produce a test strategy, risk ranking, requirements
traceability, NFR evidence, or a go/no-go gate. It does not load a PRD or
architecture to map coverage back to requirements. Happy path plus a few
critical errors is the ceiling; more edge cases are follow-up work.

## When to Use TEA

Install TEA when the built-in skill is not enough:

- The project needs requirements traceability or compliance evidence
- Tests must be prioritized by risk across many features
- A formal quality gate decides whether a release ships
- Test strategy has to exist before tests are written
- The work has outgrown one generate-and-run skill

TEA is a separate module. Its current workflows, commands, and setup live
in the [TEA documentation](https://bmad-code-org.github.io/bmad-method-test-architecture-enterprise/).
Install it with the rest of BMad; see [Official Modules](../reference/modules.md)
for how modules are selected.

## Where It Fits

[`bmad-build`](build-a-change.md) implements a change and, if a suite
already exists, aims to leave those tests passing. This page is the next
testing decision: generate additional API and E2E coverage for that
finished work, or step up to TEA.

You can run built-in QA after one change. You do not have to wait for an
epic to finish. A typical sequence is implement with `bmad-build`,
optionally [walk through the result](checkpoint-a-change.md), then generate
coverage here. After a whole epic, `bmad-retrospective` is a different
check — it judges the epic against its spec, not the test suite.
