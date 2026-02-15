# StRS Quality Checklist (ISO 29148 Clause 7)

Use this checklist to validate StRS completeness and quality.

## Document Structure

- [ ] All ISO 29148 Clause 7 sections are present
- [ ] Frontmatter includes version, status, and workflow tracking
- [ ] Document follows the approved template structure
- [ ] All sections contain substantive content (no empty placeholders)

## Section 1: Introduction & Stakeholders

- [ ] Business purpose is clearly stated
- [ ] Business scope is defined
- [ ] Business overview provides sufficient context
- [ ] Definitions and acronyms section is present
- [ ] All stakeholders are identified with category, interest, and influence levels
- [ ] Each stakeholder has a profile with needs vs. wants distinction
- [ ] Stakeholder relationships and conflicts are analyzed
- [ ] Priority ordering for conflicting needs is established

## Section 2: References

- [ ] All referenced documents are listed
- [ ] Standards and regulations are referenced
- [ ] References are traceable (version, date, source)

## Section 3: Business Management Requirements

- [ ] Business environment is documented (market, competition, technology)
- [ ] Business objectives are SMART (Specific, Measurable, Achievable, Relevant, Time-bound)
- [ ] Business model is articulated (value creation, revenue, costs)
- [ ] Information environment is mapped (existing systems, data flows)
- [ ] Business policies and rules are identified

## Section 4: Business Operational Requirements

- [ ] Key business processes are mapped (trigger, actors, steps, outcome)
- [ ] Operational policies and constraints are documented
- [ ] All operational modes are defined (normal, degraded, maintenance, emergency)
- [ ] Operational quality expectations are specified
- [ ] Business structure context is captured

## Section 5: User Requirements

- [ ] All user types are identified and categorized
- [ ] Each user type has a detailed profile (proficiency, goals, frustrations)
- [ ] Personnel requirements are defined (training, support, staffing)
- [ ] User interaction requirements are captured (devices, connectivity, languages)
- [ ] Accessibility needs are documented per user type

## Section 6: Proposed System Concept

- [ ] Operational concept provides clear picture of system in action
- [ ] At least 3 operational scenarios are documented
- [ ] Scenarios cover happy path, exceptions, and cross-user interactions
- [ ] Each scenario has actors, preconditions, steps, postconditions, and variations
- [ ] Scenario coverage matrix validates completeness against user types and processes

## Section 7: Project Constraints

- [ ] Budget and cost constraints are documented
- [ ] Schedule and timeline constraints are identified
- [ ] Technology and platform constraints are listed
- [ ] Environmental constraints are captured
- [ ] Regulatory and compliance constraints are explicitly identified
- [ ] Organizational constraints are documented

## Section 8: Appendices

- [ ] Assumptions are documented separately from verified facts
- [ ] Dependencies are listed
- [ ] Abbreviations and acronyms glossary is complete

## Cross-Section Consistency

- [ ] Stakeholder names are used consistently throughout
- [ ] Business objectives align with operational requirements
- [ ] User profiles match actors in operational scenarios
- [ ] Constraints don't contradict requirements
- [ ] All abbreviations appear in the glossary

## Quality Criteria (Per Requirement)

- [ ] Each requirement is necessary (traces to a stakeholder need)
- [ ] Each requirement is implementation-free (states WHAT, not HOW)
- [ ] Each requirement is unambiguous (single interpretation)
- [ ] Each requirement is consistent with other requirements
- [ ] Each requirement is complete (sufficient detail)
- [ ] Each requirement is singular (one requirement per statement)
- [ ] Each requirement is feasible within stated constraints
- [ ] Each requirement is traceable (has source reference)
- [ ] Each requirement is verifiable (can be tested or inspected)

## Downstream Readiness

- [ ] StRS provides sufficient input for PRD/SRS creation
- [ ] Stakeholder requirements are traceable (have IDs for RTM)
- [ ] Business objectives can be decomposed into functional requirements
- [ ] Operational scenarios inform user journey creation in PRD
- [ ] Constraints inform architecture decisions
