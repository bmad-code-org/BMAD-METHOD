---
name: cross-document-validation
description: Systematic validation of consistency and alignment across all requirement documents in the project. Enterprise track workflow with BMad Method optional use.
track: enterprise
---

# Cross-Document Validation Workflow

**Goal:** Systematically verify that all requirement documents (StRS, SyRS, PRD/SRS, Architecture, UX, Epics) are internally consistent, properly aligned, and maintain full traceability.

**Your Role:** You are a Consistency Auditor. Your job is to find every contradiction, gap, terminology mismatch, and broken traceability link across all project documents. You are THOROUGH and UNFORGIVING - inconsistencies cause implementation failures.

**Track:** This workflow is primarily for the **Enterprise** track (mandatory before implementation). Available but optional for **BMad Method** track.

---

## CROSS-DOCUMENT VALIDATION ARCHITECTURE

This is a **single-pass analytical workflow** (not step-file based). It loads all documents and performs systematic cross-referencing.

### Critical Rules

- 🔐 **NEVER** declare consistency without checking every document pair
- 📖 **ALWAYS** load and read ALL available requirement documents fully
- 🔗 **ALWAYS** verify both forward AND backward traceability
- ⚠️ **ALWAYS** report findings with specific document locations and quotes
- 💾 **ALWAYS** produce a consistency report with actionable findings
- 🚫 **NEVER** assume consistency - verify everything explicitly

---

## INITIALIZATION

### 1. Configuration Loading

Load config from `{project-root}/_bmad/bmm/config.yaml` and resolve project variables.

### 2. Document Discovery

Search for and load ALL available requirement documents:

| Document | Search Pattern | Required? |
|----------|---------------|-----------|
| StRS | `{planning_artifacts}/*strs*.md` | Enterprise: Yes |
| SyRS | `{planning_artifacts}/*syrs*.md` | Enterprise: Yes |
| PRD/SRS | `{planning_artifacts}/*prd*.md` | All tracks: Yes |
| Architecture | `{planning_artifacts}/*architecture*.md` | BMad+Enterprise: Yes |
| UX Design | `{planning_artifacts}/*ux*.md` | Optional |
| Epics & Stories | `{planning_artifacts}/*epic*.md` | All tracks: Yes |
| RTM | `{planning_artifacts}/*rtm*.md` | Enterprise: Yes |
| Product Brief | `{planning_artifacts}/*brief*.md` | Optional (reference) |

Report which documents were found and which are missing.

---

## VALIDATION PHASE 1: Terminology Consistency

### 1.1 Term Extraction

From each document, extract:
- Key domain terms and their definitions
- Actor/user role names
- System component names
- Feature/capability names

### 1.2 Terminology Cross-Check

| Check | Description |
|-------|-------------|
| **Same concept, different names** | Is "user" called "customer" in one doc and "end-user" in another? |
| **Same name, different meanings** | Does "admin" mean different things in different documents? |
| **Undefined terms** | Terms used but never defined in any glossary |
| **Conflicting definitions** | Same term defined differently in different glossaries |

**Output:** Terminology Consistency Matrix with all findings.

---

## VALIDATION PHASE 2: Requirements Alignment

### 2.1 StRS ↔ PRD/SRS Alignment (Enterprise)

For each StRS stakeholder requirement:
- [ ] Is it traced forward to at least one PRD requirement?
- [ ] Does the PRD requirement accurately reflect the stakeholder need?
- [ ] Is the scope of the PRD requirement within the StRS scope?

For each PRD requirement:
- [ ] Does it trace back to a StRS stakeholder need?
- [ ] If not traceable to StRS, is it justified (derived requirement)?

**Check for:**
- StRS requirements with no PRD coverage (orphans)
- PRD requirements not traceable to StRS (scope creep or derived)
- Scope contradictions (PRD exceeds StRS boundaries)
- Priority mismatches (StRS Must → PRD Could = inconsistency)

### 2.2 SyRS ↔ PRD Alignment (Enterprise)

For each SyRS system requirement:
- [ ] Is it traceable to a PRD requirement?
- [ ] Does the system-level requirement correctly decompose the software requirement?

For each PRD functional requirement:
- [ ] Is there a corresponding SyRS system requirement?
- [ ] Are the system-level constraints compatible with the PRD requirement?

**Check for:**
- SyRS requirements without PRD traceability
- PRD requirements without SyRS system-level mapping
- Interface specification contradictions
- Performance/quality attribute mismatches

### 2.3 StRS ↔ SyRS Alignment (Enterprise)

- [ ] SyRS system scope aligns with StRS operational concept
- [ ] SyRS interfaces cover all StRS operational scenarios
- [ ] SyRS constraints are compatible with StRS project constraints
- [ ] SyRS quality attributes meet StRS operational quality expectations

---

## VALIDATION PHASE 3: Architecture Alignment

### 3.1 Architecture ↔ PRD Alignment

- [ ] Every PRD functional requirement is addressable by the architecture
- [ ] Architecture tech stack supports all PRD non-functional requirements
- [ ] Architecture data model supports all PRD data-related requirements
- [ ] No architecture decisions contradict PRD requirements
- [ ] API design covers all PRD functional capabilities

### 3.2 Architecture ↔ SyRS Alignment (Enterprise)

- [ ] Architecture interfaces match SyRS interface specifications
- [ ] Architecture performance characteristics meet SyRS quality requirements
- [ ] Architecture security model satisfies SyRS security requirements
- [ ] Architecture deployment model aligns with SyRS operational requirements

### 3.3 Architecture ↔ UX Alignment (if UX exists)

- [ ] Architecture API endpoints support all UX interaction patterns
- [ ] Architecture data model supports all UX data display needs
- [ ] Architecture performance targets enable responsive UX
- [ ] No architecture constraints make UX designs infeasible

---

## VALIDATION PHASE 4: Epics & Stories Alignment

### 4.1 Epics ↔ PRD Coverage

- [ ] Every PRD functional requirement is covered by at least one story
- [ ] Story acceptance criteria accurately reflect PRD requirement intent
- [ ] No stories introduce features beyond PRD scope (scope creep)
- [ ] Epic grouping aligns with PRD capability areas

### 4.2 Stories ↔ Architecture Alignment

- [ ] Stories reference correct architectural components
- [ ] Story implementation approach is compatible with architecture decisions
- [ ] Database stories align with architecture data model
- [ ] API stories align with architecture API design

### 4.3 Stories ↔ UX Alignment (if UX exists)

- [ ] UI stories implement the correct UX designs
- [ ] UX interaction patterns are captured in story acceptance criteria
- [ ] All UX screens/flows have corresponding stories

### 4.4 Stories ↔ SyRS Alignment (Enterprise)

- [ ] Stories reference source requirement IDs (StRS/SyRS/PRD)
- [ ] Story acceptance criteria support verification of system requirements
- [ ] No stories implement features not traceable to system requirements

---

## VALIDATION PHASE 5: RTM Integrity (Enterprise)

### 5.1 Forward Traceability

- [ ] StRS → SyRS: Every StRS requirement traces to at least one SyRS requirement
- [ ] SyRS → PRD: Every SyRS requirement traces to at least one PRD requirement
- [ ] PRD → Stories: Every PRD requirement traces to at least one story
- [ ] Stories → Tests: Every story has associated test references (if TEA module active)

### 5.2 Backward Traceability

- [ ] Tests → Stories: Every test traces back to a story
- [ ] Stories → PRD: Every story traces back to a PRD requirement
- [ ] PRD → SyRS: Every PRD requirement traces back to a SyRS requirement
- [ ] SyRS → StRS: Every SyRS requirement traces back to a StRS requirement

### 5.3 Orphan Detection

- [ ] No StRS requirements without forward links
- [ ] No SyRS requirements without forward OR backward links
- [ ] No PRD requirements without forward links
- [ ] No stories without backward links to requirements
- [ ] No derived requirements without documented justification

### 5.4 Coverage Statistics

Calculate and report:
- Forward traceability coverage % at each level
- Backward traceability coverage % at each level
- Number of orphan requirements per level
- Number of derived (unlinked) requirements per level

---

## CONSISTENCY REPORT

After completing all validation phases, produce a report:

```markdown
# Cross-Document Consistency Report - {{project_name}}

**Date:** {{date}}
**Assessed By:** {{agent_name}}
**Documents Assessed:** {{list of documents found}}

## Overall Consistency Score: [HIGH / MEDIUM / LOW / CRITICAL ISSUES]

## Phase 1: Terminology Consistency

| Finding | Severity | Documents | Details |
|---------|----------|-----------|---------|
| [Finding] | [Critical/High/Medium/Low] | [Doc A ↔ Doc B] | [Specific text] |

## Phase 2: Requirements Alignment

### StRS ↔ PRD
| Check | Result | Details |
|-------|--------|---------|

### SyRS ↔ PRD
| Check | Result | Details |
|-------|--------|---------|

## Phase 3: Architecture Alignment

| Check | Result | Details |
|-------|--------|---------|

## Phase 4: Epics & Stories Alignment

| Check | Result | Details |
|-------|--------|---------|

## Phase 5: RTM Integrity

| Metric | Value | Target | Status |
|--------|-------|--------|--------|
| Forward Traceability (StRS→SyRS) | X% | >90% | PASS/FAIL |
| Forward Traceability (SyRS→PRD) | X% | >90% | PASS/FAIL |
| Forward Traceability (PRD→Stories) | X% | >95% | PASS/FAIL |
| Orphan Requirements | N | 0 | PASS/FAIL |

## Critical Issues Requiring Resolution

| Issue | Severity | Documents | Resolution Required |
|-------|----------|-----------|-------------------|

## Recommendations

[Prioritized list of actions to resolve consistency issues]
```

Save report to: `{planning_artifacts}/cross-document-validation-report-{{date}}.md`

---

## SUCCESS METRICS:

✅ All available documents discovered and loaded
✅ Terminology consistency checked across all document pairs
✅ Requirements alignment verified at every level (StRS↔SyRS↔PRD)
✅ Architecture alignment checked against requirements and UX
✅ Epics & Stories coverage validated against PRD
✅ RTM integrity verified with coverage statistics
✅ Consistency report generated with specific, actionable findings

## FAILURE MODES:

❌ Missing documents not flagged
❌ Terminology inconsistencies not caught
❌ Orphan requirements not detected
❌ Scope creep in stories not flagged
❌ Broken traceability links not identified
❌ Vague findings without specific document references
❌ Not checking all document pair combinations
