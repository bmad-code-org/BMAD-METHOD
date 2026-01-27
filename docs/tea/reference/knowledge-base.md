---
title: "TEA Knowledge Base Index"
description: Complete index of TEA's 33 knowledge fragments for context engineering
---

# TEA Knowledge Base Index

TEA uses 33 specialized knowledge fragments for context engineering. These fragments are loaded dynamically based on workflow needs via the `tea-index.csv` manifest.

## What is Context Engineering?

**Context engineering** is the practice of loading domain-specific standards into AI context automatically rather than relying on prompts alone.

Instead of asking AI to "write good tests" every time, TEA:
1. Reads `tea-index.csv` to identify relevant fragments for the workflow
2. Loads only the fragments needed (keeps context focused)
3. Operates with domain-specific standards, not generic knowledge
4. Produces consistent, production-ready tests across projects

**Example:**
```
User runs: `test-design`

TEA reads tea-index.csv:
- Loads: test-quality.md, test-priorities-matrix.md, risk-governance.md
- Skips: network-recorder.md, burn-in.md (not needed for test design)

Result: Focused context, consistent quality standards
```

## How Knowledge Loading Works

### 1. Workflow Trigger
User runs a TEA workflow (e.g., `test-design`)

### 2. Manifest Lookup
TEA reads `src/bmm/testarch/tea-index.csv`:
```csv
id,name,description,tags,fragment_file
test-quality,Test Quality,Execution limits and isolation rules,quality;standards,knowledge/test-quality.md
risk-governance,Risk Governance,Risk scoring and gate decisions,risk;governance,knowledge/risk-governance.md
```

### 3. Dynamic Loading
Only fragments needed for the workflow are loaded into context

### 4. Consistent Output
AI operates with established patterns, producing consistent results

## Fragment Categories

### Architecture & Fixtures

Core patterns for test infrastructure and fixture composition.

| Fragment | Description | Key Topics |
|----------|-------------|-----------|
| [fixture-architecture](../../../src/bmm/testarch/knowledge/fixture-architecture.md) | Pure function → Fixture → mergeTests composition with auto-cleanup | Testability, composition, reusability |
| [network-first](../../../src/bmm/testarch/knowledge/network-first.md) | Intercept-before-navigate workflow, HAR capture, deterministic waits | Flakiness prevention, network patterns |
| [playwright-config](../../../src/bmm/testarch/knowledge/playwright-config.md) | Environment switching, timeout standards, artifact outputs | Configuration, environments, CI |
| [fixtures-composition](../../../src/bmm/testarch/knowledge/fixtures-composition.md) | mergeTests composition patterns for combining utilities | Fixture merging, utility composition |

**Used in:** `framework`, `test-design`, `atdd`, `automate`, `test-review`

---

### Data & Setup

Patterns for test data generation, authentication, and setup.

| Fragment | Description | Key Topics |
|----------|-------------|-----------|
| [data-factories](../../../src/bmm/testarch/knowledge/data-factories.md) | Factory patterns with faker, overrides, API seeding, cleanup | Test data, factories, cleanup |
| [email-auth](../../../src/bmm/testarch/knowledge/email-auth.md) | Magic link extraction, state preservation, negative flows | Authentication, email testing |
| [auth-session](../../../src/bmm/testarch/knowledge/auth-session.md) | Token persistence, multi-user, API/browser authentication | Auth patterns, session management |

**Used in:** `framework`, `atdd`, `automate`, `test-review`

---

### Network & Reliability

Network interception, error handling, and reliability patterns.

| Fragment | Description | Key Topics |
|----------|-------------|-----------|
| [network-recorder](../../../src/bmm/testarch/knowledge/network-recorder.md) | HAR record/playback, CRUD detection for offline testing | Offline testing, network replay |
| [intercept-network-call](../../../src/bmm/testarch/knowledge/intercept-network-call.md) | Network spy/stub, JSON parsing for UI tests | Mocking, interception, stubbing |
| [error-handling](../../../src/bmm/testarch/knowledge/error-handling.md) | Scoped exception handling, retry validation, telemetry logging | Error patterns, resilience |
| [network-error-monitor](../../../src/bmm/testarch/knowledge/network-error-monitor.md) | HTTP 4xx/5xx detection for UI tests | Error detection, monitoring |

**Used in:** `atdd`, `automate`, `test-review`

---

### Test Execution & CI

CI/CD patterns, burn-in testing, and selective test execution.

| Fragment | Description | Key Topics |
|----------|-------------|-----------|
| [ci-burn-in](../../../src/bmm/testarch/knowledge/ci-burn-in.md) | Staged jobs, shard orchestration, burn-in loops | CI/CD, flakiness detection |
| [burn-in](../../../src/bmm/testarch/knowledge/burn-in.md) | Smart test selection, git diff for CI optimization | Test selection, performance |
| [selective-testing](../../../src/bmm/testarch/knowledge/selective-testing.md) | Tag/grep usage, spec filters, diff-based runs | Test filtering, optimization |

**Used in:** `ci`, `test-review`

---

### Quality & Standards

Test quality standards, test level selection, and TDD patterns.

| Fragment | Description | Key Topics |
|----------|-------------|-----------|
| [test-quality](../../../src/bmm/testarch/knowledge/test-quality.md) | Execution limits, isolation rules, green criteria | DoD, best practices, anti-patterns |
| [test-levels-framework](../../../src/bmm/testarch/knowledge/test-levels-framework.md) | Guidelines for unit, integration, E2E selection | Test pyramid, level selection |
| [test-priorities-matrix](../../../src/bmm/testarch/knowledge/test-priorities-matrix.md) | P0-P3 criteria, coverage targets, execution ordering | Prioritization, risk-based testing |
| [test-healing-patterns](../../../src/bmm/testarch/knowledge/test-healing-patterns.md) | Common failure patterns and automated fixes | Debugging, healing, fixes |
| [component-tdd](../../../src/bmm/testarch/knowledge/component-tdd.md) | Red→green→refactor workflow, provider isolation | TDD, component testing |

**Used in:** `test-design`, `atdd`, `automate`, `test-review`, `trace`

---

### Risk & Gates

Risk assessment, governance, and gate decision frameworks.

| Fragment | Description | Key Topics |
|----------|-------------|-----------|
| [risk-governance](../../../src/bmm/testarch/knowledge/risk-governance.md) | Scoring matrix, category ownership, gate decision rules | Risk assessment, governance |
| [probability-impact](../../../src/bmm/testarch/knowledge/probability-impact.md) | Probability × impact scale for scoring matrix | Risk scoring, impact analysis |
| [nfr-criteria](../../../src/bmm/testarch/knowledge/nfr-criteria.md) | Security, performance, reliability, maintainability status | NFRs, compliance, enterprise |

**Used in:** `test-design`, `nfr-assess`, `trace`

---

### Selectors & Timing

Selector resilience, race condition debugging, and visual debugging.

| Fragment | Description | Key Topics |
|----------|-------------|-----------|
| [selector-resilience](../../../src/bmm/testarch/knowledge/selector-resilience.md) | Robust selector strategies and debugging | Selectors, locators, resilience |
| [timing-debugging](../../../src/bmm/testarch/knowledge/timing-debugging.md) | Race condition identification and deterministic fixes | Race conditions, timing issues |
| [visual-debugging](../../../src/bmm/testarch/knowledge/visual-debugging.md) | Trace viewer usage, artifact expectations | Debugging, trace viewer, artifacts |

**Used in:** `atdd`, `automate`, `test-review`

---

### Feature Flags & Testing Patterns

Feature flag testing, contract testing, and API testing patterns.

| Fragment | Description | Key Topics |
|----------|-------------|-----------|
| [feature-flags](../../../src/bmm/testarch/knowledge/feature-flags.md) | Enum management, targeting helpers, cleanup, checklists | Feature flags, toggles |
| [contract-testing](../../../src/bmm/testarch/knowledge/contract-testing.md) | Pact publishing, provider verification, resilience | Contract testing, Pact |
| [api-testing-patterns](../../../src/bmm/testarch/knowledge/api-testing-patterns.md) | Pure API patterns without browser | API testing, backend testing |

**Used in:** `test-design`, `atdd`, `automate`

---

### Playwright-Utils Integration

Patterns for using `@seontechnologies/playwright-utils` package (9 utilities).

| Fragment | Description | Key Topics |
|----------|-------------|-----------|
| [api-request](../../../src/bmm/testarch/knowledge/api-request.md) | Typed HTTP client, schema validation, retry logic | API calls, HTTP, validation |
| [auth-session](../../../src/bmm/testarch/knowledge/auth-session.md) | Token persistence, multi-user, API/browser authentication | Auth patterns, session management |
| [network-recorder](../../../src/bmm/testarch/knowledge/network-recorder.md) | HAR record/playback, CRUD detection for offline testing | Offline testing, network replay |
| [intercept-network-call](../../../src/bmm/testarch/knowledge/intercept-network-call.md) | Network spy/stub, JSON parsing for UI tests | Mocking, interception, stubbing |
| [recurse](../../../src/bmm/testarch/knowledge/recurse.md) | Async polling for API responses, background jobs | Polling, eventual consistency |
| [log](../../../src/bmm/testarch/knowledge/log.md) | Structured logging for API and UI tests | Logging, debugging, reporting |
| [file-utils](../../../src/bmm/testarch/knowledge/file-utils.md) | CSV/XLSX/PDF/ZIP handling with download support | File validation, exports |
| [burn-in](../../../src/bmm/testarch/knowledge/burn-in.md) | Smart test selection with git diff analysis | CI optimization, selective testing |
| [network-error-monitor](../../../src/bmm/testarch/knowledge/network-error-monitor.md) | Auto-detect HTTP 4xx/5xx errors during tests | Error monitoring, silent failures |

**Note:** `fixtures-composition` is listed under Architecture & Fixtures (general Playwright `mergeTests` pattern, applies to all fixtures).

**Used in:** `framework` (if `tea_use_playwright_utils: true`), `atdd`, `automate`, `test-review`, `ci`

**Official Docs:** <https://seontechnologies.github.io/playwright-utils/>

---

## Fragment Manifest (tea-index.csv)

**Location:** `src/bmm/testarch/tea-index.csv`

**Purpose:** Tracks all knowledge fragments and their usage in workflows

**Structure:**
```csv
id,name,description,tags,fragment_file
test-quality,Test Quality,Execution limits and isolation rules,quality;standards,knowledge/test-quality.md
risk-governance,Risk Governance,Risk scoring and gate decisions,risk;governance,knowledge/risk-governance.md
```

**Columns:**
- `id` - Unique fragment identifier (kebab-case)
- `name` - Human-readable fragment name
- `description` - What the fragment covers
- `tags` - Searchable tags (semicolon-separated)
- `fragment_file` - Relative path to fragment markdown file

**Fragment Location:** `src/bmm/testarch/knowledge/` (all 33 fragments in single directory)

**Manifest:** `src/bmm/testarch/tea-index.csv`

---

## Workflow Fragment Loading

Each TEA workflow loads specific fragments:

### `framework`
**Key Fragments:**
- fixture-architecture.md
- playwright-config.md
- fixtures-composition.md

**Purpose:** Test infrastructure patterns and fixture composition

**Note:** Loads additional fragments based on framework choice (Playwright/Cypress) and config (`tea_use_playwright_utils`).

---

### `test-design`
**Key Fragments:**
- test-quality.md
- test-priorities-matrix.md
- test-levels-framework.md
- risk-governance.md
- probability-impact.md

**Purpose:** Risk assessment and test planning standards

**Note:** Loads additional fragments based on mode (system-level vs epic-level) and focus areas.

---

### `atdd`
**Key Fragments:**
- test-quality.md
- component-tdd.md
- fixture-architecture.md
- network-first.md
- data-factories.md
- selector-resilience.md
- timing-debugging.md
- test-healing-patterns.md

**Purpose:** TDD patterns and test generation standards

**Note:** Loads auth, network, and utility fragments based on feature requirements.

---

### `automate`
**Key Fragments:**
- test-quality.md
- test-levels-framework.md
- test-priorities-matrix.md
- fixture-architecture.md
- network-first.md
- selector-resilience.md
- test-healing-patterns.md
- timing-debugging.md

**Purpose:** Comprehensive test generation with quality standards

**Note:** Loads additional fragments for data factories, auth, network utilities based on test needs.

---

### `test-review`
**Key Fragments:**
- test-quality.md
- test-healing-patterns.md
- selector-resilience.md
- timing-debugging.md
- visual-debugging.md
- network-first.md
- test-levels-framework.md
- fixture-architecture.md

**Purpose:** Comprehensive quality review against all standards

**Note:** Loads all applicable playwright-utils fragments when `tea_use_playwright_utils: true`.

---

### `ci`
**Key Fragments:**
- ci-burn-in.md
- burn-in.md
- selective-testing.md
- playwright-config.md

**Purpose:** CI/CD best practices and optimization

---

### `nfr-assess`
**Key Fragments:**
- nfr-criteria.md
- risk-governance.md
- probability-impact.md

**Purpose:** NFR assessment frameworks and decision rules

---

### `trace`
**Key Fragments:**
- test-priorities-matrix.md
- risk-governance.md
- test-quality.md

**Purpose:** Traceability and gate decision standards

**Note:** Loads nfr-criteria.md if NFR assessment is part of gate decision.

---

## Related

- [TEA Overview](/docs/tea/explanation/tea-overview.md) - How knowledge base fits in TEA
- [Testing as Engineering](/docs/tea/explanation/testing-as-engineering.md) - Context engineering philosophy
- [TEA Command Reference](/docs/tea/reference/commands.md) - Workflows that use fragments

---

Generated with [BMad Method](https://bmad-method.org) - TEA (Test Architect)
