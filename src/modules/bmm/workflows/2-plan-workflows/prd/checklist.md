# PRD + Epics + Stories Validation Checklist

**Purpose**: Comprehensive validation that PRD, epics, and stories form a complete, implementable product plan.

**Scope**: Validates the complete planning output (PRD.md + epics.md) for Levels 2-4 software projects

**Expected Outputs**:

- PRD.md with complete requirements
- epics.md with detailed epic and story breakdown
- Updated bmm-workflow-status.yaml

---

## 1. PRD Document Completeness

### Core Sections Present

- [ ] Executive Summary with vision alignment
- [ ] Product differentiator clearly articulated
- [ ] Project classification (type, domain, complexity)
- [ ] Success criteria defined
- [ ] Product scope (MVP, Growth, Vision) clearly delineated
- [ ] Functional requirements comprehensive and numbered
- [ ] Non-functional requirements (when applicable)
- [ ] References section with source documents

### Project-Specific Sections

- [ ] **If complex domain:** Domain context and considerations documented
- [ ] **If innovation:** Innovation patterns and validation approach documented
- [ ] **If API/Backend:** Endpoint specification and authentication model included
- [ ] **If Mobile:** Platform requirements and device features documented
- [ ] **If SaaS B2B:** Tenant model and permission matrix included
- [ ] **If UI exists:** UX principles and key interactions documented

### Quality Checks

- [ ] No unfilled template variables ({{variable}})
- [ ] All variables properly populated with meaningful content
- [ ] Product differentiator reflected throughout (not just stated once)
- [ ] Language is clear, specific, and measurable
- [ ] Project type correctly identified and sections match
- [ ] Domain complexity appropriately addressed

---

## 2. Functional Requirements Quality

### FR Format and Structure

- [ ] Each FR has unique identifier (FR-001, FR-002, etc.)
- [ ] FRs describe WHAT capabilities, not HOW to implement
- [ ] FRs are specific and measurable
- [ ] FRs are testable and verifiable
- [ ] FRs focus on user/business value
- [ ] No technical implementation details in FRs (those belong in architecture)

### FR Completeness

- [ ] All MVP scope features have corresponding FRs
- [ ] Growth features documented (even if deferred)
- [ ] Vision features captured for future reference
- [ ] Domain-mandated requirements included
- [ ] Innovation requirements captured with validation needs
- [ ] Project-type specific requirements complete

### FR Organization

- [ ] FRs organized by capability/feature area (not by tech stack)
- [ ] Related FRs grouped logically
- [ ] Dependencies between FRs noted when critical
- [ ] Priority/phase indicated (MVP vs Growth vs Vision)

---

## 3. Epics Document Completeness

### Required Files

- [ ] epics.md exists in output folder
- [ ] Epic list in PRD.md matches epics in epics.md (titles and count)
- [ ] All epics have detailed breakdown sections

### Epic Quality

- [ ] Each epic has clear goal and value proposition
- [ ] Each epic includes complete story breakdown
- [ ] Stories follow proper user story format: "As a [role], I want [goal], so that [benefit]"
- [ ] Each story has numbered acceptance criteria
- [ ] Prerequisites/dependencies explicitly stated per story
- [ ] Stories are AI-agent sized (completable in 2-4 hour session)

---

## 4. FR Coverage Validation (CRITICAL)

### Complete Traceability

- [ ] **Every FR from PRD.md is covered by at least one story in epics.md**
- [ ] Each story references relevant FR numbers
- [ ] No orphaned FRs (requirements without stories)
- [ ] No orphaned stories (stories without FR connection)
- [ ] Coverage matrix verified (can trace FR → Epic → Stories)

### Coverage Quality

- [ ] Stories sufficiently decompose FRs into implementable units
- [ ] Complex FRs broken into multiple stories appropriately
- [ ] Simple FRs have appropriately scoped single stories
- [ ] Non-functional requirements reflected in story acceptance criteria
- [ ] Domain requirements embedded in relevant stories

---

## 5. Story Sequencing Validation (CRITICAL)

### Epic 1 Foundation Check

- [ ] **Epic 1 establishes foundational infrastructure**
- [ ] Epic 1 delivers initial deployable functionality
- [ ] Epic 1 creates baseline for subsequent epics
- [ ] Exception: If adding to existing app, foundation requirement adapted appropriately

### Vertical Slicing

- [ ] **Each story delivers complete, testable functionality** (not horizontal layers)
- [ ] No "build database" or "create UI" stories in isolation
- [ ] Stories integrate across stack (data + logic + presentation when applicable)
- [ ] Each story leaves system in working/deployable state

### No Forward Dependencies

- [ ] **No story depends on work from a LATER story or epic**
- [ ] Stories within each epic are sequentially ordered
- [ ] Each story builds only on previous work
- [ ] Dependencies flow backward only (can reference earlier stories)
- [ ] Parallel tracks clearly indicated if stories are independent

### Value Delivery Path

- [ ] Each epic delivers significant end-to-end value
- [ ] Epic sequence shows logical product evolution
- [ ] User can see value after each epic completion
- [ ] MVP scope clearly achieved by end of designated epics

---

## 6. Scope Management

### MVP Discipline

- [ ] MVP scope is genuinely minimal and viable
- [ ] Core features list contains only true must-haves
- [ ] Each MVP feature has clear rationale for inclusion
- [ ] No obvious scope creep in "must-have" list

### Future Work Captured

- [ ] Growth features documented for post-MVP
- [ ] Vision features captured to maintain long-term direction
- [ ] Out-of-scope items explicitly listed
- [ ] Deferred features have clear reasoning for deferral

### Clear Boundaries

- [ ] Stories marked as MVP vs Growth vs Vision
- [ ] Epic sequencing aligns with MVP → Growth progression
- [ ] No confusion about what's in vs out of initial scope

---

## 7. Research and Context Integration

### Source Document Integration

- [ ] **If product brief exists:** Key insights incorporated into PRD
- [ ] **If domain brief exists:** Domain requirements reflected in FRs and stories
- [ ] **If research documents exist:** Research findings inform requirements
- [ ] **If competitive analysis exists:** Differentiation strategy clear in PRD
- [ ] All source documents referenced in PRD References section

### Research Continuity to Architecture

- [ ] Domain complexity considerations documented for architects
- [ ] Technical constraints from research captured
- [ ] Regulatory/compliance requirements clearly stated
- [ ] Integration requirements with existing systems documented
- [ ] Performance/scale requirements informed by research data

### Information Completeness for Next Phase

- [ ] PRD provides sufficient context for architecture decisions
- [ ] Epics provide sufficient detail for technical design
- [ ] Stories have enough acceptance criteria for implementation
- [ ] Non-obvious business rules documented
- [ ] Edge cases and special scenarios captured

---

## 8. Cross-Document Consistency

### Terminology Consistency

- [ ] Same terms used across PRD and epics for concepts
- [ ] Feature names consistent between documents
- [ ] Epic titles match between PRD and epics.md
- [ ] No contradictions between PRD and epics

### Alignment Checks

- [ ] Success metrics in PRD align with story outcomes
- [ ] Product differentiator articulated in PRD reflected in epic goals
- [ ] Technical preferences in PRD align with story implementation hints
- [ ] Scope boundaries consistent across all documents

---

## 9. Readiness for Implementation

### Architecture Readiness (Next Phase)

- [ ] PRD provides sufficient context for architecture workflow
- [ ] Technical constraints and preferences documented
- [ ] Integration points identified
- [ ] Performance/scale requirements specified
- [ ] Security and compliance needs clear

### Development Readiness

- [ ] Stories are specific enough to estimate
- [ ] Acceptance criteria are testable
- [ ] Technical unknowns identified and flagged
- [ ] Dependencies on external systems documented
- [ ] Data requirements specified

### Track-Appropriate Detail

**If BMad Method:**

- [ ] PRD supports full architecture workflow
- [ ] Epic structure supports phased delivery
- [ ] Scope appropriate for product/platform development
- [ ] Clear value delivery through epic sequence

**If Enterprise Method:**

- [ ] PRD addresses enterprise requirements (security, compliance, multi-tenancy)
- [ ] Epic structure supports extended planning phases
- [ ] Scope includes security, devops, and test strategy considerations
- [ ] Clear value delivery with enterprise gates

---

## 10. Quality and Polish

### Writing Quality

- [ ] Language is clear and free of jargon (or jargon is defined)
- [ ] Sentences are concise and specific
- [ ] No vague statements ("should be fast", "user-friendly")
- [ ] Measurable criteria used throughout
- [ ] Professional tone appropriate for stakeholder review

### Document Structure

- [ ] Sections flow logically
- [ ] Headers and numbering consistent
- [ ] Cross-references accurate (FR numbers, section references)
- [ ] Formatting consistent throughout
- [ ] Tables/lists formatted properly

### Completeness Indicators

- [ ] No [TODO] or [TBD] markers remain
- [ ] No placeholder text
- [ ] All sections have substantive content
- [ ] Optional sections either complete or omitted (not half-done)

---

## Critical Failures (Auto-Fail)

If ANY of these are true, validation FAILS:

- [ ] ❌ **No epics.md file exists** (two-file output required)
- [ ] ❌ **Epic 1 doesn't establish foundation** (violates core sequencing principle)
- [ ] ❌ **Stories have forward dependencies** (breaks sequential implementation)
- [ ] ❌ **Stories not vertically sliced** (horizontal layers block value delivery)
- [ ] ❌ **Epics don't cover all FRs** (orphaned requirements)
- [ ] ❌ **FRs contain technical implementation details** (should be in architecture)
- [ ] ❌ **No FR traceability to stories** (can't validate coverage)
- [ ] ❌ **Template variables unfilled** (incomplete document)

---

## Validation Summary

- **Pass Rate ≥ 95%:** ✅ EXCELLENT - Ready for architecture phase
- **Pass Rate 85-94%:** ⚠️ GOOD - Minor fixes needed
- **Pass Rate 70-84%:** ⚠️ FAIR - Important issues to address
- **Pass Rate < 70%:** ❌ POOR - Significant rework required

### Critical Issue Threshold

- **0 Critical Failures:** Proceed to fixes
- **1+ Critical Failures:** STOP - Must fix critical issues first

---

## Validation Execution Notes

**When validating:**

1. **Load ALL documents - whole or sharded (but not both of each) for example epics.md vs epics/\*.md:**
   - PRD.md (required)
   - epics.md (required)
   - product-brief.md (if exists)
   - domain-brief.md (if exists)
   - research documents (if referenced)

2. **Validate in order:**
   - Check critical failures first (immediate stop if any found)
   - Verify PRD completeness
   - Verify epics completeness
   - Cross-reference FR coverage (most important)
   - Check sequencing (second most important)
   - Validate research integration
   - Check polish and quality

3. **Report findings:**
   - List critical failures prominently
   - Group issues by severity
   - Provide specific line numbers/sections
   - Suggest concrete fixes
   - Highlight what's working well

4. **Provide actionable next steps:**
   - If validation passes: "Ready for architecture workflow"
   - If minor issues: "Fix [X] items then re-validate"
   - If major issues: "Rework [sections] then re-validate"
   - If critical failures: "Must fix critical items before proceeding"

---

**Remember:** This validation ensures the entire planning phase is complete and the implementation phase has everything needed to succeed. Be thorough but fair - the goal is quality, not perfection.
