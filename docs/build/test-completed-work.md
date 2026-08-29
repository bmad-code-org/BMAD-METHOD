---
title: 'Test Completed Work'
description: Choose a generate skill after implementation — simple coverage with bmad-qa-generate-e2e-tests, or heavier coverage with bmad-testarch-automate.
sidebar:
  order: 4
---

After a change is implemented, decide whether it needs more automated
coverage and which generate skill should produce it. Both
`bmad-qa-generate-e2e-tests` and `bmad-testarch-automate` generate tests
from code that already exists. The built-in skill stays simple. Automate
is the heavier generate: fixtures, more test levels, and knowledge-base
patterns. See [how the built-in skill runs](#run-bmad-qa-generate-e2e-tests).

This is generated coverage of finished work. It is not code review, and it
is not the manual observations in [Walk Through a Change](walk-through-a-change.md).

## Which Path?

| Factor | `bmad-qa-generate-e2e-tests` | `bmad-testarch-automate` |
| --- | --- | --- |
| **Best for** | Simple coverage of implemented features | Heavier coverage of the same kind of work |
| **Setup** | Included with BMM | Install the TEA module |
| **Approach** | Generate from the code that exists | Same, standalone; optional test design improves the run |
| **What it covers** | API and E2E; happy path plus a few errors | API, E2E, fixtures, more patterns; optional component tests |

:::tip[Start with built-in QA]
Most projects should start with `bmad-qa-generate-e2e-tests`. Use
`bmad-testarch-automate` when you want the heavier generate of the same
kind of work.
:::

Other TEA skills — test design, trace, ATDD, test review, NFRs, and gates —
are available. They are not the default generate path.

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
implementation — that is `bmad-build` during the run, or
[`bmad-code-review`](review-a-change.md) if you want another pass.

Happy path plus a few critical errors is the ceiling, and it does not
compose complex fixtures. More edge cases are follow-up work, or a
reason to use Automate.

## When to Use TEA

Install the TEA module when you want `bmad-testarch-automate` — heavier
generate of the same kind of work. Automate still generates from existing
code and can run standalone.

`bmad-testarch-test-design` is optional before Automate. It improves the
run; it is not a prerequisite.

`bmad-testarch-trace` is optional after generation, to check coverage. It
is not part of generate.

ATDD is for features that do not exist yet. Test review, NFR assessment,
and release gates are available when you need them. They are not required
to generate tests.

TEA is a separate module. Its current workflows, commands, and setup live
in the [TEA documentation](https://bmad-code-org.github.io/bmad-method-test-architecture-enterprise/).
Install it with the rest of BMad; see [Official Modules](../reference/modules.md)
for how modules are selected.

## Where It Fits

[`bmad-build`](build-a-change.md) implements a change and, if a suite
already exists, aims to leave those tests passing. This page is the next
testing decision: generate additional coverage for that finished work.

You can run built-in QA after one change. You do not have to wait for an
epic to finish. A typical sequence is implement with `bmad-build`,
optionally [walk through the result](walk-through-a-change.md), then generate
coverage here. After a whole epic, `bmad-retrospective` is a different
check — it judges the epic against its spec, not the test suite.
