# Project Planning Validation Checklist (Adaptive: All Levels)

**Scope**: This checklist adapts based on project level (0-4) and field type (greenfield/brownfield)

- **Level 0**: Tech-spec only validation
- **Level 1-2**: PRD + Tech-spec + Epics validation
- **Level 3-4**: PRD + Epics validation (no tech-spec)
- **Greenfield**: Focus on setup sequencing and dependencies
- **Brownfield**: Focus on integration risks and backward compatibility

## User Intent Validation (Critical First Check)

### Input Sources and User Need

- [ ] Product brief or initial context was properly gathered (not just project name)
- [ ] User's actual problem/need was identified through conversation (not assumed)
- [ ] Technical preferences mentioned by user were captured separately
- [ ] User confirmed the description accurately reflects their vision
- [ ] The PRD addresses what the user asked for, not what we think they need

### Alignment with User Goals

- [ ] Goals directly address the user's stated problem
- [ ] Context reflects actual user-provided information (not invented)
- [ ] Requirements map to explicit user needs discussed
- [ ] Nothing critical the user mentioned is missing

## Document Structure

- [ ] All required sections are present
- [ ] No placeholder text remains (all {{variables}} replaced)
- [ ] Proper formatting and organization throughout

## Section 1: Description

- [ ] Clear, concise description of what's being built
- [ ] Matches user's actual request (not extrapolated)
- [ ] Sets proper scope and expectations

## Section 2: Goals (Step 2)

- [ ] Level 3: Contains 3-5 primary goals
- [ ] Level 4: Contains 5-7 strategic goals
- [ ] Each goal is specific and measurable where possible
- [ ] Goals focus on user and project outcomes
- [ ] Goals represent what success looks like
- [ ] Strategic objectives align with product scale

## Section 3: Context (Step 3)

- [ ] 1-2 short paragraphs explaining why this matters now
- [ ] Context was gathered from user (not invented)
- [ ] Explains actual problem being solved
- [ ] Describes current situation or pain point
- [ ] Connects to real-world impact

## Section 4: Functional Requirements (Step 4)

- [ ] Level 3: Contains 12-20 FRs
- [ ] Level 4: Contains 20-30 FRs
- [ ] Each has unique FR identifier (FR001, FR002, etc.)
- [ ] Requirements describe capabilities, not implementation
- [ ] Related features grouped logically while maintaining granularity
- [ ] All FRs are testable user actions
- [ ] User provided feedback on proposed FRs
- [ ] Missing capabilities user expected were added
- [ ] Priority order reflects user input
- [ ] Coverage comprehensive for target product scale

## Section 5: Non-Functional Requirements (Step 5 - Optional)

- [ ] Only included if truly needed (not arbitrary targets)
- [ ] Each has unique NFR identifier
- [ ] Business justification provided for each NFR
- [ ] Compliance requirements noted if regulated industry
- [ ] Performance constraints tied to business needs
- [ ] Typically 0-5 for MVP (not invented)

## Section 6: User Journeys (Step 6)

- [ ] Level 3: 2-3 detailed user journeys documented
- [ ] Level 4: 3-5 comprehensive journeys for major segments
- [ ] Each journey has named persona with context
- [ ] Journey shows complete path through system via FRs
- [ ] Specific FR references included (e.g., "signs up (FR001)")
- [ ] Success criteria and pain points identified
- [ ] Edge cases and alternative paths considered
- [ ] Journeys validate comprehensive value delivery

## Section 7: UX Principles (Step 7 - Optional)

- [ ] Target users and sophistication level defined
- [ ] Design values stated (simple vs powerful, playful vs professional)
- [ ] Platform strategy specified (mobile-first, web, native)
- [ ] Accessibility requirements noted if applicable
- [ ] Sets direction without prescribing specific solutions

## Section 8: Epics (Step 8)

- [ ] Level 3: 3-5 epics defined (targeting 12-40 stories)
- [ ] Level 4: 5-8 epics defined (targeting 40+ stories)
- [ ] Each epic represents significant, deployable functionality
- [ ] Epic format includes: Title, Goal, Capabilities, Success Criteria, Dependencies
- [ ] Related FRs grouped into coherent capabilities
- [ ] Each epic references specific FR numbers
- [ ] Post-MVP epics listed separately with their FRs
- [ ] Dependencies between epics clearly noted
- [ ] Phased delivery strategy apparent

## Section 9: Out of Scope (Step 9)

- [ ] Ideas preserved with FR/NFR references
- [ ] Format: description followed by (FR###, NFR###)
- [ ] Prevents scope creep while capturing future possibilities
- [ ] Clear distinction from MVP scope

## Section 10: Assumptions and Dependencies (Step 10)

- [ ] Only ACTUAL assumptions from user discussion (not invented)
- [ ] Technical choices user explicitly mentioned captured
- [ ] Dependencies identified in FRs/NFRs listed
- [ ] User-stated constraints documented
- [ ] If none exist, states "No critical assumptions identified yet"

## Cross-References and Consistency

- [ ] All FRs trace back to at least one goal
- [ ] User journeys reference actual FR numbers
- [ ] Epic capabilities cover all FRs
- [ ] Terminology consistent throughout
- [ ] No contradictions between sections
- [ ] Technical details saved to technical_preferences (not in PRD)

## Quality Checks

- [ ] Requirements are strategic, not implementation-focused
- [ ] Document maintains appropriate abstraction level
- [ ] No premature technical decisions
- [ ] Focus on WHAT, not HOW

## Readiness for Next Phase

- [ ] Sufficient detail for comprehensive architecture design
- [ ] Clear enough for detailed solution design
- [ ] Ready for epic breakdown into 12-40+ stories
- [ ] Value delivery path supports phased releases
- [ ] If UI exists, ready for UX expert collaboration
- [ ] Scale and complexity match Level 3-4 requirements

## Scale Validation

- [ ] Project scope justifies PRD
- [ ] Complexity matches Level 1-4 designation
- [ ] Story estimate aligns with epic structure (12-40+)
- [ ] Not over-engineered for actual needs

## Final Validation

- [ ] Document addresses user's original request completely
- [ ] All user feedback incorporated
- [ ] No critical user requirements missing
- [ ] Ready for user final review and approval
- [ ] File saved in correct location: {{output_folder}}/PRD.md

---

# Cohesion Validation (All Levels)

**Purpose**: Validate alignment between planning artifacts and readiness for implementation

## Project Context Detection

- [ ] Project level confirmed (0, 1, 2, 3, or 4)
- [ ] Field type identified (greenfield or brownfield)
- [ ] Appropriate validation sections applied based on context

## Section A: Tech Spec Validation (Levels 0, 1, 2 only)

### A.1 Tech Spec Completeness

- [ ] All technical decisions are DEFINITIVE (no "Option A or B")
- [ ] Specific versions specified for all frameworks/libraries
- [ ] Source tree structure clearly defined
- [ ] Technical approach precisely described
- [ ] Implementation stack complete with exact tools
- [ ] Testing approach clearly defined
- [ ] Deployment strategy documented

### A.2 Tech Spec - PRD Alignment (Levels 1-2 only)

- [ ] Every functional requirement has technical solution
- [ ] Non-functional requirements addressed in tech spec
- [ ] Tech stack aligns with PRD constraints
- [ ] Performance requirements achievable with chosen stack
- [ ] Technical preferences from user incorporated

## Section B: Greenfield-Specific Validation (if greenfield)

### B.1 Project Setup Sequencing

- [ ] Epic 0 or 1 includes project initialization steps
- [ ] Repository setup precedes feature development
- [ ] Development environment configuration included early
- [ ] Core dependencies installed before use
- [ ] Testing infrastructure set up before tests written

### B.2 Infrastructure Before Features

- [ ] Database setup before data operations
- [ ] API framework before endpoint implementation
- [ ] Authentication setup before protected features
- [ ] CI/CD pipeline before deployment
- [ ] Monitoring setup included

### B.3 External Dependencies

- [ ] Third-party account creation assigned to user
- [ ] API keys acquisition process defined
- [ ] Credential storage approach specified
- [ ] External service setup sequenced properly
- [ ] Fallback strategies for external failures

## Section C: Brownfield-Specific Validation (if brownfield)

### C.1 Existing System Integration

- [ ] Current architecture analyzed and documented
- [ ] Integration points with existing system identified
- [ ] Existing functionality preservation validated
- [ ] Database schema compatibility assessed
- [ ] API contract compatibility verified

### C.2 Risk Management

- [ ] Breaking change risks identified and mitigated
- [ ] Rollback procedures defined for each integration
- [ ] Feature flags or toggles included where appropriate
- [ ] Performance degradation risks assessed
- [ ] User impact analysis completed

### C.3 Backward Compatibility

- [ ] Database migrations maintain backward compatibility
- [ ] API changes don't break existing consumers
- [ ] Authentication/authorization integration safe
- [ ] Configuration changes non-breaking
- [ ] Existing monitoring preserved or enhanced

### C.4 Dependency Conflicts

- [ ] New dependencies compatible with existing versions
- [ ] No version conflicts introduced
- [ ] Security vulnerabilities not introduced
- [ ] License compatibility verified
- [ ] Bundle size impact acceptable

## Section D: Feature Sequencing (All Levels)

### D.1 Functional Dependencies

- [ ] Features depending on others sequenced correctly
- [ ] Shared components built before consumers
- [ ] User flows follow logical progression
- [ ] Authentication precedes protected features

### D.2 Technical Dependencies

- [ ] Lower-level services before higher-level ones
- [ ] Utilities and libraries created before use
- [ ] Data models defined before operations
- [ ] API endpoints before client consumption

### D.3 Epic Dependencies

- [ ] Later epics build on earlier epic functionality
- [ ] No circular dependencies between epics
- [ ] Infrastructure from early epics reused
- [ ] Incremental value delivery maintained

## Section E: UI/UX Cohesion (if UI components exist)

### E.1 Design System (Greenfield)

- [ ] UI framework selected and installed early
- [ ] Design system or component library established
- [ ] Styling approach defined
- [ ] Responsive design strategy clear
- [ ] Accessibility requirements defined

### E.2 Design Consistency (Brownfield)

- [ ] UI consistent with existing system
- [ ] Component library updates non-breaking
- [ ] Styling approach matches existing
- [ ] Accessibility standards maintained
- [ ] Existing user workflows preserved

### E.3 UX Flow Validation

- [ ] User journeys mapped completely
- [ ] Navigation patterns defined
- [ ] Error and loading states planned
- [ ] Form validation patterns established

## Section F: Responsibility Assignment (All Levels)

### F.1 User vs Agent Clarity

- [ ] Human-only tasks assigned to user
- [ ] Account creation on external services → user
- [ ] Payment/purchasing actions → user
- [ ] All code tasks → developer agent
- [ ] Configuration management properly assigned

## Section G: Documentation Readiness (All Levels)

### G.1 Developer Documentation

- [ ] Setup instructions comprehensive
- [ ] Technical decisions documented
- [ ] Patterns and conventions clear
- [ ] API documentation plan exists (if applicable)

### G.2 Deployment Documentation (Brownfield)

- [ ] Runbook updates planned
- [ ] Incident response procedures updated
- [ ] Rollback procedures documented and tested
- [ ] Monitoring dashboard updates planned

## Section H: Future-Proofing (All Levels)

### H.1 Extensibility

- [ ] Current scope vs future features clearly separated
- [ ] Architecture supports planned enhancements
- [ ] Technical debt considerations documented
- [ ] Extensibility points identified

### H.2 Observability

- [ ] Monitoring strategy defined
- [ ] Success metrics from planning captured
- [ ] Analytics or tracking included if needed
- [ ] Performance measurement approach clear

## Cohesion Summary

### Overall Readiness Assessment

- [ ] **Ready for Development** - All critical items pass
- [ ] **Needs Alignment** - Some gaps need addressing
- [ ] **Too Risky** (brownfield only) - Integration risks too high

### Critical Gaps Identified

_List any blocking issues or unacceptable risks:_

### Integration Risk Level (brownfield only)

- [ ] Low - well-understood integration with good rollback
- [ ] Medium - some unknowns but manageable
- [ ] High - significant risks require mitigation

### Recommendations

_Specific actions to improve cohesion before development:_

---
