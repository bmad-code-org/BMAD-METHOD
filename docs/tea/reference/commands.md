---
title: "TEA Command Reference"
description: Quick reference for all 8 TEA workflows - inputs, outputs, and links to detailed guides
---

# TEA Command Reference

Quick reference for all 8 TEA (Test Architect) workflows. For detailed step-by-step guides, see the how-to documentation.

## Quick Index

- [`framework`](#framework) - Scaffold test framework
- [`ci`](#ci) - Setup CI/CD pipeline
- [`test-design`](#test-design) - Risk-based test planning
- [`atdd`](#atdd) - Acceptance TDD
- [`automate`](#automate) - Test automation
- [`test-review`](#test-review) - Quality audit
- [`nfr-assess`](#nfr-assess) - NFR assessment
- [`trace`](#trace) - Coverage traceability

---

## framework

**Purpose:** Scaffold production-ready test framework (Playwright or Cypress)

**Phase:** Phase 3 (Solutioning)

**Frequency:** Once per project

**Key Inputs:**
- Tech stack, test framework choice, testing scope

**Key Outputs:**
- `tests/` directory with `support/fixtures/` and `support/helpers/`
- `playwright.config.ts` or `cypress.config.ts`
- `.env.example`, `.nvmrc`
- Sample tests with best practices

**How-To Guide:** [Setup Test Framework](/docs/tea/how-to/workflows/setup-test-framework.md)

---

## ci

**Purpose:** Setup CI/CD pipeline with selective testing and burn-in

**Phase:** Phase 3 (Solutioning)

**Frequency:** Once per project

**Key Inputs:**
- CI platform (GitHub Actions, GitLab CI, etc.)
- Sharding strategy, burn-in preferences

**Key Outputs:**
- Platform-specific CI workflow (`.github/workflows/test.yml`, etc.)
- Parallel execution configuration
- Burn-in loops for flakiness detection
- Secrets checklist

**How-To Guide:** [Setup CI Pipeline](/docs/tea/how-to/workflows/setup-ci.md)

---

## test-design

**Purpose:** Risk-based test planning with coverage strategy

**Phase:** Phase 3 (system-level), Phase 4 (epic-level)

**Frequency:** Once (system), per epic (epic-level)

**Modes:**
- **System-level:** Architecture testability review (TWO documents)
- **Epic-level:** Per-epic risk assessment (ONE document)

**Key Inputs:**
- System-level: Architecture, PRD, ADRs
- Epic-level: Epic, stories, acceptance criteria

**Key Outputs:**

**System-Level (TWO Documents):**
- `test-design-architecture.md` - For Architecture/Dev teams
  - Quick Guide (🚨 BLOCKERS / ⚠️ HIGH PRIORITY / 📋 INFO ONLY)
  - Risk assessment with scoring
  - Testability concerns and gaps
  - Mitigation plans
- `test-design-qa.md` - For QA team
  - Test execution recipe
  - Coverage plan (P0/P1/P2/P3 with checkboxes)
  - Sprint 0 setup requirements
  - NFR readiness summary

**Epic-Level (ONE Document):**
- `test-design-epic-N.md`
  - Risk assessment (probability × impact scores)
  - Test priorities (P0-P3)
  - Coverage strategy
  - Mitigation plans

**Why Two Documents for System-Level?**
- Architecture teams scan blockers in <5 min
- QA teams have actionable test recipes
- No redundancy (cross-references instead)
- Clear separation (what to deliver vs how to test)

**MCP Enhancement:** Exploratory mode (live browser UI discovery)

**How-To Guide:** [Run Test Design](/docs/tea/how-to/workflows/run-test-design.md)

---

## atdd

**Purpose:** Generate failing acceptance tests BEFORE implementation (TDD red phase)

**Phase:** Phase 4 (Implementation)

**Frequency:** Per story (optional)

**Key Inputs:**
- Story with acceptance criteria, test design, test levels

**Key Outputs:**
- Failing tests (`tests/api/`, `tests/e2e/`)
- Implementation checklist
- All tests fail initially (red phase)

**MCP Enhancement:** Recording mode (for skeleton UI only - rare)

**How-To Guide:** [Run ATDD](/docs/tea/how-to/workflows/run-atdd.md)

---

## automate

**Purpose:** Expand test coverage after implementation

**Phase:** Phase 4 (Implementation)

**Frequency:** Per story/feature

**Key Inputs:**
- Feature description, test design, existing tests to avoid duplication

**Key Outputs:**
- Comprehensive test suite (`tests/e2e/`, `tests/api/`)
- Updated fixtures, README
- Definition of Done summary

**MCP Enhancement:** Healing + Recording modes (fix tests, verify selectors)

**How-To Guide:** [Run Automate](/docs/tea/how-to/workflows/run-automate.md)

---

## test-review

**Purpose:** Audit test quality with 0-100 scoring

**Phase:** Phase 4 (optional per story), Release Gate

**Frequency:** Per epic or before release

**Key Inputs:**
- Test scope (file, directory, or entire suite)

**Key Outputs:**
- `test-review.md` with quality score (0-100)
- Critical issues with fixes
- Recommendations
- Category scores (Determinism, Isolation, Assertions, Structure, Performance)

**Scoring Categories:**
- Determinism: 35 points
- Isolation: 25 points
- Assertions: 20 points
- Structure: 10 points
- Performance: 10 points

**How-To Guide:** [Run Test Review](/docs/tea/how-to/workflows/run-test-review.md)

---

## nfr-assess

**Purpose:** Validate non-functional requirements with evidence

**Phase:** Phase 2 (enterprise), Release Gate

**Frequency:** Per release (enterprise projects)

**Key Inputs:**
- NFR categories (Security, Performance, Reliability, Maintainability)
- Thresholds, evidence location

**Key Outputs:**
- `nfr-assessment.md`
- Category assessments (PASS/CONCERNS/FAIL)
- Mitigation plans
- Gate decision inputs

**How-To Guide:** [Run NFR Assessment](/docs/tea/how-to/workflows/run-nfr-assess.md)

---

## trace

**Purpose:** Requirements traceability + quality gate decision

**Phase:** Phase 2/4 (traceability), Release Gate (decision)

**Frequency:** Baseline, per epic refresh, release gate

**Two-Phase Workflow:**

**Phase 1: Traceability**
- Requirements → test mapping
- Coverage classification (FULL/PARTIAL/NONE)
- Gap prioritization
- Output: `traceability-matrix.md`

**Phase 2: Gate Decision**
- PASS/CONCERNS/FAIL/WAIVED decision
- Evidence-based (coverage %, quality scores, NFRs)
- Output: `gate-decision-{gate_type}-{story_id}.md`

**Gate Rules:**
- P0 coverage: 100% required
- P1 coverage: ≥90% for PASS, 80-89% for CONCERNS, <80% FAIL
- Overall coverage: ≥80% required

**How-To Guide:** [Run Trace](/docs/tea/how-to/workflows/run-trace.md)

---

## Summary Table

| Command | Phase | Frequency | Primary Output |
|---------|-------|-----------|----------------|
| `framework` | 3 | Once | Test infrastructure |
| `ci` | 3 | Once | CI/CD pipeline |
| `test-design` | 3, 4 | System + per epic | Test design doc |
| `atdd` | 4 | Per story (optional) | Failing tests |
| `automate` | 4 | Per story | Passing tests |
| `test-review` | 4, Gate | Per epic/release | Quality report |
| `nfr-assess` | 2, Gate | Per release | NFR assessment |
| `trace` | 2, 4, Gate | Baseline + refresh + gate | Coverage matrix + decision |

---

## See Also

**How-To Guides (Detailed Instructions):**
- [Setup Test Framework](/docs/tea/how-to/workflows/setup-test-framework.md)
- [Setup CI Pipeline](/docs/tea/how-to/workflows/setup-ci.md)
- [Run Test Design](/docs/tea/how-to/workflows/run-test-design.md)
- [Run ATDD](/docs/tea/how-to/workflows/run-atdd.md)
- [Run Automate](/docs/tea/how-to/workflows/run-automate.md)
- [Run Test Review](/docs/tea/how-to/workflows/run-test-review.md)
- [Run NFR Assessment](/docs/tea/how-to/workflows/run-nfr-assess.md)
- [Run Trace](/docs/tea/how-to/workflows/run-trace.md)

**Explanation:**
- [TEA Overview](/docs/tea/explanation/tea-overview.md) - Complete TEA lifecycle
- [Engagement Models](/docs/tea/explanation/engagement-models.md) - When to use which workflows

**Reference:**
- [TEA Configuration](/docs/tea/reference/configuration.md) - Config options
- [Knowledge Base Index](/docs/tea/reference/knowledge-base.md) - Pattern fragments

---

Generated with [BMad Method](https://bmad-method.org) - TEA (Test Architect)
