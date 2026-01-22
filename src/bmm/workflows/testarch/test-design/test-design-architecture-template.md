# Test Design for Architecture: {Feature Name}

**Purpose:** Architectural concerns, testability gaps, and NFR requirements for review by Architecture/Dev teams. Serves as a contract between QA and Engineering on what must be addressed before test development begins.

**Date:** {date}
**Author:** {author}
**Status:** Architecture Review Pending
**Project:** {project_name}
**PRD Reference:** {prd_link}
**ADR Reference:** {adr_link}

---

## Executive Summary

**Scope:** {Brief description of feature scope}

**Business Context** (from PRD):
- **Revenue/Impact:** {Business metrics if applicable}
- **Problem:** {Problem being solved}
- **GA Launch:** {Target date or timeline}

**Architecture** (from ADR {adr_number}):
- **Key Decision 1:** {e.g., OAuth 2.1 authentication}
- **Key Decision 2:** {e.g., Centralized MCP Server pattern}
- **Key Decision 3:** {e.g., Stack: TypeScript, SDK v1.x}

**Expected Scale** (from ADR):
- {RPS, volume, users, etc.}

**Risk Summary:**
- **Total risks**: {N}
- **High-priority (≥6)**: {N} risks requiring immediate mitigation
- **Test effort**: ~{N} tests (~{X} weeks for 1 QA, ~{Y} weeks for 2 QAs)

---

## Quick Guide

### 🚨 BLOCKERS - Team Must Decide (Can't Proceed Without)

**Sprint 0 Critical Path** - These MUST be completed before QA can write integration tests:

1. **{Blocker ID}: {Blocker Title}** - {What architecture must provide} (recommended owner: {Team/Role})
2. **{Blocker ID}: {Blocker Title}** - {What architecture must provide} (recommended owner: {Team/Role})
3. **{Blocker ID}: {Blocker Title}** - {What architecture must provide} (recommended owner: {Team/Role})

**What we need from team:** Complete these {N} items in Sprint 0 or test development is blocked.

---

### ⚠️ HIGH PRIORITY - Team Should Validate (We Provide Recommendation, You Approve)

1. **{Risk ID}: {Title}** - {Recommendation + who should approve} (Sprint {N})
2. **{Risk ID}: {Title}** - {Recommendation + who should approve} (Sprint {N})
3. **{Risk ID}: {Title}** - {Recommendation + who should approve} (Sprint {N})

**What we need from team:** Review recommendations and approve (or suggest changes).

---

### 📋 INFO ONLY - Solutions Provided (Review, No Decisions Needed)

1. **Test strategy**: {Test level split} ({Rationale})
2. **Tooling**: {Test frameworks and utilities}
3. **Tiered CI/CD**: {Execution tiers with timing}
4. **Coverage**: ~{N} test scenarios prioritized P0-P3 with risk-based classification
5. **Quality gates**: {Pass criteria}

**What we need from team:** Just review and acknowledge (we already have the solution).

---

## For Architects and Devs - Open Topics 👷

### Risk Assessment

**Total risks identified**: {N} ({X} high-priority score ≥6, {Y} medium, {Z} low)

#### High-Priority Risks (Score ≥6) - IMMEDIATE ATTENTION

| Risk ID | Category | Description | Probability | Impact | Score | Mitigation | Owner | Timeline |
|---------|----------|-------------|-------------|--------|-------|------------|-------|----------|
| **{R-ID}** | **{CAT}** | {Description} | {1-3} | {1-3} | **{Score}** | {Mitigation strategy} | {Owner} | {Date} |

#### Medium-Priority Risks (Score 3-5)

| Risk ID | Category | Description | Probability | Impact | Score | Mitigation | Owner |
|---------|----------|-------------|-------------|--------|-------|------------|-------|
| {R-ID} | {CAT} | {Description} | {1-3} | {1-3} | {Score} | {Mitigation} | {Owner} |

#### Low-Priority Risks (Score 1-2)

| Risk ID | Category | Description | Probability | Impact | Score | Action |
|---------|----------|-------------|-------------|--------|-------|--------|
| {R-ID} | {CAT} | {Description} | {1-3} | {1-3} | {Score} | Monitor |

#### Risk Category Legend

- **TECH**: Technical/Architecture (flaws, integration, scalability)
- **SEC**: Security (access controls, auth, data exposure)
- **PERF**: Performance (SLA violations, degradation, resource limits)
- **DATA**: Data Integrity (loss, corruption, inconsistency)
- **BUS**: Business Impact (UX harm, logic errors, revenue)
- **OPS**: Operations (deployment, config, monitoring)

---

### Testability Concerns and Architectural Gaps

**IMPORTANT**: {If system has constraints, explain them. If standard CI/CD achievable, state that.}

#### Blockers to Fast Feedback

| Blocker | Impact | Current Mitigation | Ideal Solution |
|---------|--------|-------------------|----------------|
| **{Blocker name}** | {Impact description} | {How we're working around it} | {What architecture should provide} |

#### Why This Matters

**Standard CI/CD expectations:**
- Full test suite on every commit (~5-15 min feedback)
- Parallel test execution (isolated test data per worker)
- Ephemeral test environments (spin up → test → tear down)
- Fast feedback loop (devs stay in flow state)

**Current reality for {Feature}:**
- {Actual situation - what's different from standard}

#### Tiered Testing Strategy

{If forced by architecture, explain. If standard approach works, state that.}

| Tier | When | Duration | Coverage | Why Not Full Suite? |
|------|------|----------|----------|---------------------|
| **Smoke** | Every commit | <5 min | {N} tests | Fast feedback, catch build-breaking changes |
| **P0** | Every commit | ~{X} min | ~{N} tests | Critical paths, security-critical flows |
| **P1** | PR to main | ~{X} min | ~{N} tests | Important features, algorithm accuracy |
| **P2/P3** | Nightly | ~{X} min | ~{N} tests | Edge cases, performance, NFR |

**Note**: {Any timing assumptions or constraints}

#### Architectural Improvements Needed

{If system has technical debt affecting testing, list improvements. If architecture supports testing well, acknowledge that.}

1. **{Improvement name}**
   - {What to change}
   - **Impact**: {How it improves testing}

#### Acceptance of Trade-offs

For {Feature} Phase 1, the team accepts:
- **{Trade-off 1}** ({Reasoning})
- **{Trade-off 2}** ({Reasoning})
- ⚠️ **{Known limitation}** ({Why acceptable for now})

This is {**technical debt** OR **acceptable for Phase 1**} that should be {revisited post-GA OR maintained as-is}.

---

### Risk Mitigation Plans (High-Priority Risks ≥6)

**Purpose**: Detailed mitigation strategies for all {N} high-priority risks (score ≥6). These risks MUST be addressed before {GA launch date or milestone}.

#### {R-ID}: {Risk Description} (Score: {Score}) - {CRITICALITY LEVEL}

**Mitigation Strategy:**
1. {Step 1}
2. {Step 2}
3. {Step 3}

**Owner:** {Owner}
**Timeline:** {Sprint or date}
**Status:** Planned / In Progress / Complete
**Verification:** {How to verify mitigation is effective}

---

{Repeat for all high-priority risks}

---

### Assumptions and Dependencies

#### Assumptions

1. {Assumption about architecture or requirements}
2. {Assumption about team or timeline}
3. {Assumption about scope or constraints}

#### Dependencies

1. {Dependency} - Required by {date/sprint}
2. {Dependency} - Required by {date/sprint}

#### Risks to Plan

- **Risk**: {Risk to the test plan itself}
  - **Impact**: {How it affects testing}
  - **Contingency**: {Backup plan}

---

**End of Architecture Document**

**Next Steps for Architecture Team:**
1. Review Quick Guide (🚨/⚠️/📋) and prioritize blockers
2. Assign owners and timelines for high-priority risks (≥6)
3. Validate assumptions and dependencies
4. Provide feedback to QA on testability gaps

**Next Steps for QA Team:**
1. Wait for Sprint 0 blockers to be resolved
2. Refer to companion QA doc (test-design-qa.md) for test scenarios
3. Begin test infrastructure setup (factories, fixtures, environments)
