---
title: Testing Options
description: Comparing the built-in QA agent (Quinn) with the Test Architect (TEA) module for test automation.
sidebar:
  order: 5
---

BMad provides two testing paths: a built-in QA agent for fast test generation and an installable Test Architect module for enterprise-grade test strategy.

## Which Should You Use?

| Factor | Quinn (Built-in QA) | TEA Module |
| --- | --- | --- |
| **Best for** | Small-medium projects, quick coverage | Large projects, regulated or complex domains |
| **Setup** | Nothing to install -- included in BMM | Install separately via `npx bmad-method install` |
| **Approach** | Generate tests fast, iterate later | Plan first, then generate with traceability |
| **Test types** | API and E2E tests | API, E2E, ATDD, NFR, and more |
| **Strategy** | Happy path + critical edge cases | Risk-based prioritization (P0-P3) |
| **Workflow count** | 1 (Automate) | 9 (design, ATDD, automate, review, trace, and others) |

:::tip[Start with Quinn]
Most projects should start with Quinn. If you later need test strategy, quality gates, or requirements traceability, install TEA alongside it.
:::

## Built-in QA Agent (Quinn)

Quinn is the built-in QA agent in the BMM (Agile suite) module. It generates working tests quickly using your project's existing test framework -- no configuration or additional installation required.

**Trigger:** `QA` or `bmad-bmm-qa-automate`

### What Quinn Does

Quinn runs a single workflow (Automate) that walks through five steps:

1. **Detect test framework** -- scans `package.json` and existing test files for your framework (Jest, Vitest, Playwright, Cypress, or any standard runner). If none exists, analyzes the project stack and suggests one.
2. **Identify features** -- asks what to test or auto-discovers features in the codebase.
3. **Generate API tests** -- covers status codes, response structure, happy path, and 1-2 error cases.
4. **Generate E2E tests** -- covers user workflows with semantic locators and visible-outcome assertions.
5. **Run and verify** -- executes the generated tests and fixes failures immediately.

Quinn produces a test summary saved to your project's implementation artifacts folder.

### Test Patterns

Generated tests follow a "simple and maintainable" philosophy:

- **Standard framework APIs only** -- no external utilities or custom abstractions
- **Semantic locators** for UI tests (roles, labels, text rather than CSS selectors)
- **Independent tests** with no order dependencies
- **No hardcoded waits or sleeps**
- **Clear descriptions** that read as feature documentation

:::note[Scope]
Quinn generates tests only. For code review and story validation, use the Code Review workflow (`CR`) instead.
:::

### When to Use Quinn

- Quick test coverage for a new or existing feature
- Beginner-friendly test automation without advanced setup
- Standard test patterns that any developer can read and maintain
- Small-medium projects where comprehensive test strategy is unnecessary

## Test Architect (TEA) Module

TEA is a standalone module that provides an expert agent (Murat) and nine structured workflows for enterprise-grade testing. It goes beyond test generation into test strategy, risk-based planning, quality gates, and requirements traceability.

- **Documentation:** [TEA Module Docs](https://bmad-code-org.github.io/bmad-method-test-architecture-enterprise/)
- **Install:** `npx bmad-method install` and select the TEA module
- **npm:** [`bmad-method-test-architecture-enterprise`](https://www.npmjs.com/package/bmad-method-test-architecture-enterprise)

### What TEA Provides

| Workflow | Purpose |
| --- | --- |
| Test Design | Create a comprehensive test strategy tied to requirements |
| ATDD | Acceptance-test-driven development with stakeholder criteria |
| Automate | Generate tests with advanced patterns and utilities |
| Test Review | Validate test quality and coverage against strategy |
| Traceability | Map tests back to requirements for audit and compliance |
| NFR Assessment | Evaluate non-functional requirements (performance, security) |
| CI Setup | Configure test execution in continuous integration pipelines |
| Framework Scaffolding | Set up test infrastructure and project structure |
| Release Gate | Make data-driven go/no-go release decisions |

TEA also supports P0-P3 risk-based prioritization and optional integrations with Playwright Utils and MCP tooling.

### When to Use TEA

- Projects that require requirements traceability or compliance documentation
- Teams that need risk-based test prioritization across many features
- Enterprise environments with formal quality gates before release
- Complex domains where test strategy must be planned before tests are written
- Projects that have outgrown Quinn's single-workflow approach

## How Testing Fits into Workflows

Quinn's Automate workflow appears in Phase 4 (Implementation) of the BMad Method workflow map. A typical sequence:

1. Implement a story with the Dev workflow (`DS`)
2. Generate tests with Quinn (`QA`) or TEA's Automate workflow
3. Validate implementation with Code Review (`CR`)

Quinn works directly from source code without loading planning documents (PRD, architecture). TEA workflows can integrate with upstream planning artifacts for traceability.

For more on where testing fits in the overall process, see the [Workflow Map](./workflow-map.md).
