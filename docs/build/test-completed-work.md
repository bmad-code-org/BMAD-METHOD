---
title: 'Test Completed Work'
description: Choose a test-generation skill after implementation. Use bmad-qa-generate-e2e-tests for straightforward coverage or bmad-tea-automate for deeper test suites.
sidebar:
  order: 5
---

After a feature works, decide whether it needs more automated test coverage and which test-generation skill fits best. Both `bmad-qa-generate-e2e-tests` and `bmad-tea-automate` generate tests from existing code. The built-in QA skill keeps tests lean and straightforward, while Automate (from the optional Test Architect Enterprise, or **TEA**, module) adds heavier patterns such as reusable test **fixtures** (shared setup and sample data helpers) and broader test levels.

This step adds automated coverage for finished work. It does not replace code review or the hands-on inspection in [Walk Through a Change](walk-through-a-change.md).

## Which Path?

| Factor | `bmad-qa-generate-e2e-tests` | `bmad-tea-automate` |
| --- | --- | --- |
| **Best for** | Straightforward coverage of implemented features | Deeper test suites with reusable fixtures and extra layers |
| **Setup** | Included in the method module | Install the optional TEA module |
| **Approach** | Generates tests directly from existing code | Runs standalone on existing code; optional test design sharpens results |
| **What it covers** | API and end-to-end tests for main paths and user-visible errors | API, end-to-end, fixtures, extra patterns, and optional component tests |

:::tip[Start with built-in QA]
Most projects should start with `bmad-qa-generate-e2e-tests`. Add `bmad-tea-automate` when your suite grows large enough to need structured fixtures, deeper test planning, or release quality gates.
:::

TEA also offers additional skills (test design, coverage tracing, test review, assessments for non-functional requirements such as performance and reliability, and release gates) plus Automate's red mode for **ATDD** (Acceptance Test-Driven Development, writing failing acceptance tests before implementation starts). To run ATDD before coding on the full build route, use `bmad-customize` to customize the implementation handoff (see [Customize BMad](../customize/customize-bmad.md)).

## Run `bmad-qa-generate-e2e-tests`

Open a **fresh chat** and invoke the skill. Name what you want tested (a feature, a directory, a ticket, or simply "discover what is untested"):

```text
/bmad-qa-generate-e2e-tests
```

```text
/bmad-qa-generate-e2e-tests Create API and E2E tests for the login flow.
```

The skill follows whatever test framework your repository already uses. If no test setup exists yet, it proposes one and waits for your approval before installing or creating anything.

### What a run does

1. The skill chooses what to test from your prompt, a ticket awaiting review, or the changes on your current branch, asking only if none of those makes the target clear.
2. It proposes one-sentence test scenarios and waits for your confirmation before writing code.
3. It inspects how your project already writes tests and runs the current suite once first.
4. It writes one test per scenario, exercising the app the way a real user or API client does, with each test managing its own setup data so tests pass in any order.
5. It runs the new tests twice to verify they are deterministic and not flaky, and if a new test catches a real bug in your app, it reports the bug and keeps the failing test rather than weakening the assertion.
6. It reports in chat what is now covered, what was intentionally skipped and why, any bugs found, and the exact command to run the new tests.

Generated tests stay readable on purpose, sticking to your framework's standard APIs and existing helpers.

## What You Get

- New test files placed alongside your project's existing end-to-end or API tests
- A concise coverage and command report in chat (with no extra report file cluttering the repo)
- Tests verified across two consecutive runs, or clear failing tests documenting bugs they uncovered

## Limits

`bmad-qa-generate-e2e-tests` only generates automated tests. It does not review code quality (that happens inside `bmad-build` or [`bmad-code-review`](review-a-change.md)). It focuses on primary user paths and user-visible error handling rather than building custom fixture libraries or exhaustive corner-case matrices; reach for TEA when you want that depth.

## When to Use TEA

Install the TEA (Test Architect Enterprise) module when you want `bmad-tea-automate` for deeper test generation or specialized quality engineering:

- `bmad-tea-test-design` optionally plans risk-based test coverage before generating tests.
- `bmad-tea-trace` optionally audits requirement-to-test traceability after tests exist.
- Automate's red mode supports ATDD when you want failing acceptance tests written before building a new feature.
- Test review, NFR (Non-Functional Requirement) assessments covering qualities like latency, security, or resilience, and release gates are available whenever your team's delivery bar requires them.

TEA is maintained as a separate module with its full guide in the [TEA documentation](https://bmad-code-org.github.io/bmad-method-test-architecture-enterprise/). Install it with `npx skills add bmad-code-org/bmad-method-test-architecture-enterprise` and run `bmad setup tea`; see [Add Modules](../customize/add-modules.md).

## Where It Fits

[`bmad-build`](build-a-change.md) writes unit tests alongside the feature and ensures existing tests keep passing. Test generation is the optional next step when you want dedicated API or end-to-end tests on top of finished work.

You can run built-in QA after any single story without waiting for an entire epic to finish. A common flow is to build with `bmad-build`, optionally [walk through the change](walk-through-a-change.md), and then generate API or E2E coverage here. Once an entire epic finishes, `bmad-retrospective` performs a separate check, evaluating the epic as a whole against its spec and completion criteria rather than only running tests.
