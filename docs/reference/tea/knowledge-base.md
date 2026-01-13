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
User runs: *test-design

TEA reads tea-index.csv:
- Loads: test-quality.md, test-priorities-matrix.md, risk-governance.md
- Skips: network-recorder.md, burn-in.md (not needed for test design)

Result: Focused context, consistent quality standards
```

## How Knowledge Loading Works

### 1. Workflow Trigger
User runs a TEA workflow (e.g., `*test-design`)

### 2. Manifest Lookup
TEA reads `src/modules/bmm/testarch/tea-index.csv`:
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
| [fixture-architecture](../../../src/modules/bmm/testarch/knowledge/fixture-architecture.md) | Pure function → Fixture → mergeTests composition with auto-cleanup | Testability, composition, reusability |
| [network-first](../../../src/modules/bmm/testarch/knowledge/network-first.md) | Intercept-before-navigate workflow, HAR capture, deterministic waits | Flakiness prevention, network patterns |
| [playwright-config](../../../src/modules/bmm/testarch/knowledge/playwright-config.md) | Environment switching, timeout standards, artifact outputs | Configuration, environments, CI |
| [fixtures-composition](../../../src/modules/bmm/testarch/knowledge/fixtures-composition.md) | mergeTests composition patterns for combining utilities | Fixture merging, utility composition |

**Used in:** `*framework`, `*test-design`, `*atdd`, `*automate`, `*test-review`

---

### Data & Setup

Patterns for test data generation, authentication, and setup.

| Fragment | Description | Key Topics |
|----------|-------------|-----------|
| [data-factories](../../../src/modules/bmm/testarch/knowledge/data-factories.md) | Factory patterns with faker, overrides, API seeding, cleanup | Test data, factories, cleanup |
| [email-auth](../../../src/modules/bmm/testarch/knowledge/email-auth.md) | Magic link extraction, state preservation, negative flows | Authentication, email testing |
| [auth-session](../../../src/modules/bmm/testarch/knowledge/auth-session.md) | Token persistence, multi-user, API/browser authentication | Auth patterns, session management |

**Used in:** `*framework`, `*atdd`, `*automate`, `*test-review`

---

### Network & Reliability

Network interception, error handling, and reliability patterns.

| Fragment | Description | Key Topics |
|----------|-------------|-----------|
| [network-recorder](../../../src/modules/bmm/testarch/knowledge/network-recorder.md) | HAR record/playback, CRUD detection for offline testing | Offline testing, network replay |
| [intercept-network-call](../../../src/modules/bmm/testarch/knowledge/intercept-network-call.md) | Network spy/stub, JSON parsing for UI tests | Mocking, interception, stubbing |
| [error-handling](../../../src/modules/bmm/testarch/knowledge/error-handling.md) | Scoped exception handling, retry validation, telemetry logging | Error patterns, resilience |
| [network-error-monitor](../../../src/modules/bmm/testarch/knowledge/network-error-monitor.md) | HTTP 4xx/5xx detection for UI tests | Error detection, monitoring |

**Used in:** `*atdd`, `*automate`, `*test-review`

---

### Test Execution & CI

CI/CD patterns, burn-in testing, and selective test execution.

| Fragment | Description | Key Topics |
|----------|-------------|-----------|
| [ci-burn-in](../../../src/modules/bmm/testarch/knowledge/ci-burn-in.md) | Staged jobs, shard orchestration, burn-in loops | CI/CD, flakiness detection |
| [burn-in](../../../src/modules/bmm/testarch/knowledge/burn-in.md) | Smart test selection, git diff for CI optimization | Test selection, performance |
| [selective-testing](../../../src/modules/bmm/testarch/knowledge/selective-testing.md) | Tag/grep usage, spec filters, diff-based runs | Test filtering, optimization |

**Used in:** `*ci`, `*test-review`

---

### Quality & Standards

Test quality standards, test level selection, and TDD patterns.

| Fragment | Description | Key Topics |
|----------|-------------|-----------|
| [test-quality](../../../src/modules/bmm/testarch/knowledge/test-quality.md) | Execution limits, isolation rules, green criteria | DoD, best practices, anti-patterns |
| [test-levels-framework](../../../src/modules/bmm/testarch/knowledge/test-levels-framework.md) | Guidelines for unit, integration, E2E selection | Test pyramid, level selection |
| [test-priorities-matrix](../../../src/modules/bmm/testarch/knowledge/test-priorities-matrix.md) | P0-P3 criteria, coverage targets, execution ordering | Prioritization, risk-based testing |
| [test-healing-patterns](../../../src/modules/bmm/testarch/knowledge/test-healing-patterns.md) | Common failure patterns and automated fixes | Debugging, healing, fixes |
| [component-tdd](../../../src/modules/bmm/testarch/knowledge/component-tdd.md) | Red→green→refactor workflow, provider isolation | TDD, component testing |

**Used in:** `*test-design`, `*atdd`, `*automate`, `*test-review`, `*trace`

---

### Risk & Gates

Risk assessment, governance, and gate decision frameworks.

| Fragment | Description | Key Topics |
|----------|-------------|-----------|
| [risk-governance](../../../src/modules/bmm/testarch/knowledge/risk-governance.md) | Scoring matrix, category ownership, gate decision rules | Risk assessment, governance |
| [probability-impact](../../../src/modules/bmm/testarch/knowledge/probability-impact.md) | Probability × impact scale for scoring matrix | Risk scoring, impact analysis |
| [nfr-criteria](../../../src/modules/bmm/testarch/knowledge/nfr-criteria.md) | Security, performance, reliability, maintainability status | NFRs, compliance, enterprise |

**Used in:** `*test-design`, `*nfr-assess`, `*trace`

---

### Selectors & Timing

Selector resilience, race condition debugging, and visual debugging.

| Fragment | Description | Key Topics |
|----------|-------------|-----------|
| [selector-resilience](../../../src/modules/bmm/testarch/knowledge/selector-resilience.md) | Robust selector strategies and debugging | Selectors, locators, resilience |
| [timing-debugging](../../../src/modules/bmm/testarch/knowledge/timing-debugging.md) | Race condition identification and deterministic fixes | Race conditions, timing issues |
| [visual-debugging](../../../src/modules/bmm/testarch/knowledge/visual-debugging.md) | Trace viewer usage, artifact expectations | Debugging, trace viewer, artifacts |

**Used in:** `*atdd`, `*automate`, `*test-review`

---

### Feature Flags & Testing Patterns

Feature flag testing, contract testing, and API testing patterns.

| Fragment | Description | Key Topics |
|----------|-------------|-----------|
| [feature-flags](../../../src/modules/bmm/testarch/knowledge/feature-flags.md) | Enum management, targeting helpers, cleanup, checklists | Feature flags, toggles |
| [contract-testing](../../../src/modules/bmm/testarch/knowledge/contract-testing.md) | Pact publishing, provider verification, resilience | Contract testing, Pact |
| [api-testing-patterns](../../../src/modules/bmm/testarch/knowledge/api-testing-patterns.md) | Pure API patterns without browser | API testing, backend testing |

**Used in:** `*test-design`, `*atdd`, `*automate`

---

### Playwright-Utils Integration

Patterns for using `@seontechnologies/playwright-utils` package (11 utilities).

| Fragment | Description | Key Topics |
|----------|-------------|-----------|
| overview | Playwright Utils installation, design principles, fixture patterns | Getting started, principles, setup |
| [api-request](../../../src/modules/bmm/testarch/knowledge/api-request.md) | Typed HTTP client, schema validation, retry logic | API calls, HTTP, validation |
| [auth-session](../../../src/modules/bmm/testarch/knowledge/auth-session.md) | Token persistence, multi-user, API/browser authentication | Auth patterns, session management |
| [network-recorder](../../../src/modules/bmm/testarch/knowledge/network-recorder.md) | HAR record/playback, CRUD detection for offline testing | Offline testing, network replay |
| [intercept-network-call](../../../src/modules/bmm/testarch/knowledge/intercept-network-call.md) | Network spy/stub, JSON parsing for UI tests | Mocking, interception, stubbing |
| [recurse](../../../src/modules/bmm/testarch/knowledge/recurse.md) | Async polling for API responses, background jobs | Polling, eventual consistency |
| [log](../../../src/modules/bmm/testarch/knowledge/log.md) | Structured logging for API and UI tests | Logging, debugging, reporting |
| [file-utils](../../../src/modules/bmm/testarch/knowledge/file-utils.md) | CSV/XLSX/PDF/ZIP handling with download support | File validation, exports |
| [burn-in](../../../src/modules/bmm/testarch/knowledge/burn-in.md) | Smart test selection with git diff analysis | CI optimization, selective testing |
| [network-error-monitor](../../../src/modules/bmm/testarch/knowledge/network-error-monitor.md) | Auto-detect HTTP 4xx/5xx errors during tests | Error monitoring, silent failures |
| [fixtures-composition](../../../src/modules/bmm/testarch/knowledge/fixtures-composition.md) | mergeTests composition patterns for combining utilities | Fixture merging, utility composition |

**Note:** All 11 playwright-utils fragments are in the same `knowledge/` directory as other fragments.

**Used in:** `*framework` (if `tea_use_playwright_utils: true`), `*atdd`, `*automate`, `*test-review`, `*ci`

**Official Docs:** <https://seontechnologies.github.io/playwright-utils/>

---

## Fragment Manifest (tea-index.csv)

**Location:** `src/modules/bmm/testarch/tea-index.csv`

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

## Fragment Locations

**Knowledge Base Directory:**
```
src/modules/bmm/testarch/knowledge/
├── api-request.md
├── api-testing-patterns.md
├── auth-session.md
├── burn-in.md
├── ci-burn-in.md
├── component-tdd.md
├── contract-testing.md
├── data-factories.md
├── email-auth.md
├── error-handling.md
├── feature-flags.md
├── file-utils.md
├── fixture-architecture.md
├── fixtures-composition.md
├── intercept-network-call.md
├── log.md
├── network-error-monitor.md
├── network-first.md
├── network-recorder.md
├── nfr-criteria.md
├── playwright-config.md
├── probability-impact.md
├── recurse.md
├── risk-governance.md
├── selector-resilience.md
├── selective-testing.md
├── test-healing-patterns.md
├── test-levels-framework.md
├── test-priorities-matrix.md
├── test-quality.md
├── timing-debugging.md
└── visual-debugging.md
```

**All fragments in single directory** (no subfolders)

**Manifest:**
```
src/modules/bmm/testarch/tea-index.csv
```

## Workflow Fragment Loading

Each TEA workflow loads specific fragments:

### *framework
**Key Fragments:**
- fixture-architecture.md
- playwright-config.md
- fixtures-composition.md

**Purpose:** Test infrastructure patterns and fixture composition

**Note:** Loads additional fragments based on framework choice (Playwright/Cypress) and config (`tea_use_playwright_utils`).

---

### *test-design
**Key Fragments:**
- test-quality.md
- test-priorities-matrix.md
- test-levels-framework.md
- risk-governance.md
- probability-impact.md

**Purpose:** Risk assessment and test planning standards

**Note:** Loads additional fragments based on mode (system-level vs epic-level) and focus areas.

---

### *atdd
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

### *automate
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

### *test-review
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

### *ci
**Key Fragments:**
- ci-burn-in.md
- burn-in.md
- selective-testing.md
- playwright-config.md

**Purpose:** CI/CD best practices and optimization

---

### *nfr-assess
**Key Fragments:**
- nfr-criteria.md
- risk-governance.md
- probability-impact.md

**Purpose:** NFR assessment frameworks and decision rules

---

### *trace
**Key Fragments:**
- test-priorities-matrix.md
- risk-governance.md
- test-quality.md

**Purpose:** Traceability and gate decision standards

**Note:** Loads nfr-criteria.md if NFR assessment is part of gate decision.

---

## Key Fragments Explained

### test-quality.md

**What it covers:**
- Execution time limits (< 1.5 minutes)
- Test size limits (< 300 lines)
- No hard waits (waitForTimeout banned)
- No conditionals for flow control
- No try-catch for flow control
- Assertions must be explicit
- Self-cleaning tests for parallel execution

**Why it matters:**
This is the Definition of Done for test quality. All TEA workflows reference this for quality standards.

**Code examples:** 12+

---

### network-first.md

**What it covers:**
- Intercept-before-navigate pattern
- Wait for network responses, not timeouts
- HAR capture for offline testing
- Deterministic waiting strategies

**Why it matters:**
Prevents 90% of test flakiness. Core pattern for reliable E2E tests.

**Code examples:** 15+

---

### fixture-architecture.md

**What it covers:**
- Build pure functions first
- Wrap in framework fixtures second
- Compose with mergeTests
- Enable reusability and testability

**Why it matters:**
Foundation of scalable test architecture. Makes utilities reusable and unit-testable.

**Code examples:** 10+

---

### risk-governance.md

**What it covers:**
- Risk scoring matrix (Probability × Impact)
- Risk categories (TECH, SEC, PERF, DATA, BUS, OPS)
- Gate decision rules (PASS/CONCERNS/FAIL/WAIVED)
- Mitigation planning

**Why it matters:**
Objective, data-driven release decisions. Removes politics from quality gates.

**Code examples:** 5

---

### test-priorities-matrix.md

**What it covers:**
- P0: Critical path (100% coverage required)
- P1: High value (90% coverage target)
- P2: Medium value (50% coverage target)
- P3: Low value (20% coverage target)
- Execution ordering (P0 → P1 → P2 → P3)

**Why it matters:**
Focus testing effort on what matters. Don't waste time on P3 edge cases.

**Code examples:** 8

---

## Using Fragments Directly

### As a Learning Resource

Read fragments to learn patterns:

```bash
# Read fixture architecture pattern
cat src/modules/bmm/testarch/knowledge/fixture-architecture.md

# Read network-first pattern
cat src/modules/bmm/testarch/knowledge/network-first.md
```

### As Team Guidelines

Use fragments as team documentation:

```markdown
# Team Testing Guidelines

## Fixture Architecture
See: src/modules/bmm/testarch/knowledge/fixture-architecture.md

All fixtures must follow the pure function → fixture wrapper pattern.

## Network Patterns
See: src/modules/bmm/testarch/knowledge/network-first.md

All tests must use network-first patterns. No hard waits allowed.
```

### As Code Review Checklist

Reference fragments in code review:

```markdown
## PR Review Checklist

- [ ] Tests follow test-quality.md standards (no hard waits, < 300 lines)
- [ ] Selectors follow selector-resilience.md (prefer getByRole)
- [ ] Network patterns follow network-first.md (wait for responses)
- [ ] Fixtures follow fixture-architecture.md (pure functions)
```

## Fragment Statistics

**Total Fragments:** 33
**Total Size:** ~600 KB (all fragments combined)
**Average Fragment Size:** ~18 KB
**Largest Fragment:** contract-testing.md (~28 KB)
**Smallest Fragment:** burn-in.md (~7 KB)

**By Category:**
- Architecture & Fixtures: 4 fragments
- Data & Setup: 3 fragments
- Network & Reliability: 4 fragments
- Test Execution & CI: 3 fragments
- Quality & Standards: 5 fragments
- Risk & Gates: 3 fragments
- Selectors & Timing: 3 fragments
- Feature Flags & Patterns: 3 fragments
- Playwright-Utils Integration: 8 fragments

**Note:** Statistics may drift with updates. All fragments are in the same `knowledge/` directory.

## Contributing to Knowledge Base

### Adding New Fragments

1. Create fragment in `src/modules/bmm/testarch/knowledge/`
2. Follow existing format (Principle, Rationale, Pattern Examples)
3. Add to `tea-index.csv` with metadata
4. Update workflow instructions to load fragment
5. Test with TEA workflow

### Updating Existing Fragments

1. Edit fragment markdown file
2. Update `tea-index.csv` if metadata changes (line count, examples)
3. Test with affected workflows
4. Ensure no breaking changes to patterns

### Fragment Quality Standards

**Good fragment:**
- Principle stated clearly
- Rationale explains why
- Multiple pattern examples with code
- Good vs bad comparisons
- Self-contained (links to other fragments minimal)

**Example structure:**
```markdown
# Fragment Name

## Principle
[One sentence - what is this pattern?]

## Rationale
[Why use this instead of alternatives?]

## Pattern Examples

### Example 1: Basic Usage
[Code example with explanation]

### Example 2: Advanced Pattern
[Code example with explanation]

## Anti-Patterns

### Don't Do This
[Bad code example]
[Why it's bad]

## Related Patterns
- [Other fragment](../other-fragment.md)
```

## Related

- [TEA Overview](/docs/explanation/features/tea-overview.md) - How knowledge base fits in TEA
- [Testing as Engineering](/docs/explanation/philosophy/testing-as-engineering.md) - Context engineering philosophy
- [TEA Command Reference](/docs/reference/tea/commands.md) - Workflows that use fragments

---

Generated with [BMad Method](https://bmad-method.org) - TEA (Test Architect)
