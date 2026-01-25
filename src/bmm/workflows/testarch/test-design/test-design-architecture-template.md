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

**🚨 ACTIONABLE CONCERNS - Architecture Team Must Address**

{If system has critical testability concerns, list them here. If architecture supports testing well, state "No critical testability concerns identified" and skip to Testability Assessment Summary}

#### 1. Blockers to Fast Feedback (WHAT WE NEED FROM ARCHITECTURE)

| Concern | Impact | What Architecture Must Provide | Owner | Timeline |
|---------|--------|--------------------------------|-------|----------|
| **{Concern name}** | {Impact on testing} | {Specific architectural change needed} | {Team} | {Sprint} |

**Example:**
- **No API for test data seeding** → Cannot parallelize tests → Provide POST /test/seed endpoint (Backend, Sprint 0)

#### 2. Architectural Improvements Needed (WHAT SHOULD BE CHANGED)

{List specific improvements that would make the system more testable}

1. **{Improvement name}**
   - **Current problem**: {What's wrong}
   - **Required change**: {What architecture must do}
   - **Impact if not fixed**: {Consequences}
   - **Owner**: {Team}
   - **Timeline**: {Sprint}

---

### Testability Assessment Summary

**📊 CURRENT STATE - FYI**

{Only include this section if there are passing items worth mentioning. Otherwise omit.}

#### What Works Well

- ✅ {Passing item 1} (e.g., "API-first design supports parallel test execution")
- ✅ {Passing item 2} (e.g., "Feature flags enable test isolation")
- ✅ {Passing item 3}

#### Accepted Trade-offs (No Action Required)

For {Feature} Phase 1, the following trade-offs are acceptable:
- **{Trade-off 1}** - {Why acceptable for now}
- **{Trade-off 2}** - {Why acceptable for now}

{This is technical debt OR acceptable for Phase 1} that {should be revisited post-GA OR maintained as-is}

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
