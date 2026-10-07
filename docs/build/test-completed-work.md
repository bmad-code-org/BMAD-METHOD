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
| **What it covers** | API and E2E; the main path and the errors a user can see | API, E2E, fixtures, more patterns; optional component tests |

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

It uses whatever test setup the project already has. If there is none,
it proposes one and waits for your go-ahead before adding anything.

### What a run does

1. **Decide what to test** — from what you asked for, or a ticket that is
   in review, or what the current branch changed. It asks if none of those
   says.
2. **List the scenarios** — one sentence each, and waits for your
   confirmation.
3. **Learn how the project already tests** — and runs those tests once
   first.
4. **Write one test per scenario** — driving the app the way a user or an
   API client would, with each test setting up its own data.
5. **Run the new tests twice.** A real bug is reported, and its test is kept
   as a known failure. No test is loosened to make it pass.
6. **Report in chat** — what is covered, what is not and why, any bugs, and
   the command that runs the new tests.

Generated tests stay simple on purpose: the framework's standard features,
the project's existing helpers, and tests that pass in any order.

## What You Get

- Test files where the project keeps its end-to-end tests
- A report in chat; no summary file
- Tests that passed twice in this session, or that record a bug they found

## Limits

`bmad-qa-generate-e2e-tests` generates tests only. It does not review the
implementation — that is `bmad-build` during the run, or
[`bmad-code-review`](review-a-change.md) if you want another pass.

It covers the main path and the errors a user can see, and no more. It
does not build shared test helpers. More edge cases are follow-up work,
or a reason to use Automate.

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
Install it with the rest of BMad; see [Add Modules](../customize/add-modules.md)
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
