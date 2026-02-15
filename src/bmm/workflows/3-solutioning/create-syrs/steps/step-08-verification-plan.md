---
name: 'step-08-verification-plan'
description: 'Create verification plan assigning verification methods to every system requirement, with TEA module integration for Enterprise track. SyRS Section 4'

# Path Definitions
workflow_path: '{project-root}/_bmad/bmm/workflows/3-solutioning/create-syrs'

# File References
thisStepFile: './step-08-verification-plan.md'
nextStepFile: './step-09-review-complete.md'
workflowFile: '{workflow_path}/workflow.md'
outputFile: '{planning_artifacts}/syrs-{{project_name}}.md'

# Task References
advancedElicitationTask: '{project-root}/_bmad/core/workflows/advanced-elicitation/workflow.xml'
partyModeWorkflow: '{project-root}/_bmad/core/workflows/party-mode/workflow.md'
---

# Step 8: Verification Plan

## STEP GOAL:

Create a comprehensive verification plan that assigns a verification method to EVERY system requirement defined in Sections 3.1 through 3.13. Build the verification summary table and note TEA (Test, Evaluate, Approve) module integration for the Enterprise track. This step populates ISO 29148 Clause 8 Section 4 (Verification) and also populates Section 5 (Assumptions and Dependencies).

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:

- 🛑 NEVER generate content without user input
- 📖 CRITICAL: Read the complete step file before taking any action
- 🔄 CRITICAL: When loading next step with 'C', ensure entire file is read
- 📋 YOU ARE A FACILITATOR, not a content generator
- ✅ YOU MUST ALWAYS SPEAK OUTPUT In your Agent communication style with the config `{communication_language}`

### Role Reinforcement:

- ✅ You are a System Architecture and Requirements Engineering specialist
- ✅ If you already have been given communication or persona patterns, continue to use those while playing this new role
- ✅ We engage in collaborative dialogue, not command-response
- ✅ You bring verification and validation engineering expertise
- ✅ User brings context on testing capabilities and organizational V&V practices

### Step-Specific Rules:

- 🎯 Focus ONLY on verification planning (Section 4) and assumptions (Section 5)
- 🚫 FORBIDDEN to modify existing requirements in Sections 3.x
- 💬 EVERY requirement must have a verification method - no exceptions
- 🚪 Verification methods must be appropriate to the requirement type
- 📐 The verification summary table must be complete and gap-free

## EXECUTION PROTOCOLS:

- 🎯 Show your analysis before taking any action
- ⚠️ Present A/P/C menu after generating verification plan content
- 💾 ONLY save when user chooses C (Continue)
- 📖 Update frontmatter `stepsCompleted: [1, 2, 3, 4, 5, 6, 7, 8]` before loading next step
- 🚫 FORBIDDEN to load next step until C is selected

## COLLABORATION MENUS (A/P/C):

This step will generate content and present choices:

- **A (Advanced Elicitation)**: Use discovery protocols to refine verification approaches or explore testing strategies
- **P (Party Mode)**: Bring multiple perspectives to evaluate verification completeness (QA, test, ops)
- **C (Continue)**: Save the content to the document and proceed to next step

## PROTOCOL INTEGRATION:

- When 'A' selected: Read fully and follow: {advancedElicitationTask}
- When 'P' selected: Read fully and follow: {partyModeWorkflow}
- PROTOCOLS always return to display this step's A/P/C menu after the A or P have completed
- User accepts/rejects protocol changes before proceeding

## CONTEXT BOUNDARIES:

- Current document with all Sections 1 through 3.13 completed
- All system requirements are defined and available for verification planning
- V&V Method attributes already assigned on each requirement serve as initial input
- Focus on consolidating and validating verification approach

## VERIFICATION PLANNING SEQUENCE:

### 1. Explain Verification Methods

Present the four standard verification methods per ISO 29148:

"**Verification Methods (ISO 29148):**

1. **Inspection** - Visual examination of the system, documentation, or code to verify compliance
   - Best for: Design constraints, documentation requirements, coding standards, policy compliance
   - Example: Verifying that the system uses the required encryption algorithm by code review

2. **Analysis** - Processing of accumulated data using mathematical or statistical methods
   - Best for: Performance under theoretical conditions, capacity planning, resource utilization
   - Example: Analyzing system architecture to verify scalability requirements

3. **Demonstration** - Operation of the system showing observable functional behavior
   - Best for: User interface requirements, workflow requirements, operational procedures
   - Example: Demonstrating that the system can transition from operational to maintenance mode

4. **Test** - Exercising the system under controlled conditions and comparing results to criteria
   - Best for: Functional requirements, performance targets, security requirements
   - Example: Load testing to verify the system handles 1000 concurrent users with <200ms response time"

### 2. Review All Requirements and V&V Assignments

Systematically review every requirement across all sections:

**For each requirement section, verify the V&V method is appropriate:**

| Requirement Category | Typical V&V Methods |
|---------------------|-------------------|
| SYS-FUNC-### (Functional) | Test, Demonstration |
| SYS-IF-### (Interface) | Test, Demonstration, Inspection |
| SYS-PERF-### (Performance) | Test, Analysis |
| SYS-USAB-### (Usability) | Demonstration, Test |
| SYS-SEC-### (Security) | Test, Inspection, Analysis |
| SYS-OPS-### (Operations) | Demonstration, Test |
| SYS-MODE-### (Modes) | Demonstration, Test |
| SYS-PHYS-### (Physical) | Inspection, Test |
| SYS-ENV-### (Environment) | Inspection, Analysis, Demonstration |
| SYS-INFO-### (Info Mgmt) | Inspection, Test, Analysis |
| SYS-POL-### (Policy) | Inspection, Analysis |
| SYS-LIFE-### (Lifecycle) | Inspection, Analysis, Demonstration |
| SYS-CON-### (Constraints) | Inspection, Analysis |

**Validation Rules:**

- Every requirement MUST have at least one verification method
- The method must be achievable with available resources
- Prefer Test for requirements with measurable acceptance criteria
- Use Inspection for requirements verified by examination
- Use Analysis for requirements verified by calculation or modeling
- Use Demonstration for requirements verified by showing behavior

### 3. Define Verification Methods Detail (Section 4.1)

For each verification method used, define the approach:

```markdown
### 4.1 Verification Methods

#### 4.1.1 Inspection
**Scope:** [Which requirement categories will be verified by inspection]
**Approach:** [How inspections will be conducted - code review, document review, etc.]
**Criteria:** [What constitutes pass/fail for inspections]

#### 4.1.2 Analysis
**Scope:** [Which requirement categories will be verified by analysis]
**Approach:** [How analyses will be conducted - modeling, simulation, calculation]
**Criteria:** [What constitutes pass/fail for analyses]

#### 4.1.3 Demonstration
**Scope:** [Which requirement categories will be verified by demonstration]
**Approach:** [How demonstrations will be conducted - operational scenarios, walkthroughs]
**Criteria:** [What constitutes pass/fail for demonstrations]

#### 4.1.4 Test
**Scope:** [Which requirement categories will be verified by test]
**Approach:** [How tests will be conducted - unit, integration, system, acceptance]
**Criteria:** [What constitutes pass/fail for tests]
```

### 4. Build Verification Summary Table (Section 4.2)

Create the comprehensive verification summary table:

```markdown
### 4.2 Verification Summary Table

| Req ID | Requirement Summary | V&V Method | V&V Level | V&V Criteria | Status |
|--------|-------------------|------------|-----------|--------------|--------|
| SYS-FUNC-001 | [Brief summary] | Test | System Test | [Pass criteria] | Planned |
| SYS-FUNC-002 | [Brief summary] | Test | Integration Test | [Pass criteria] | Planned |
| SYS-IF-001 | [Brief summary] | Demonstration | System Demo | [Pass criteria] | Planned |
| SYS-PERF-001 | [Brief summary] | Test | Performance Test | [Pass criteria] | Planned |
| SYS-SEC-001 | [Brief summary] | Test | Security Test | [Pass criteria] | Planned |
...
```

**The table MUST include EVERY requirement from Sections 3.1 through 3.13. No gaps allowed.**

**V&V Level Options:**
- Unit Test
- Integration Test
- System Test
- Acceptance Test
- Performance Test
- Security Test
- Code Review
- Design Review
- Architecture Review
- Operational Demonstration
- System Demo

### 5. TEA Module Integration (Enterprise Track)

For Enterprise track, note TEA module integration:

```markdown
### 4.3 TEA Module Integration

**Track:** Enterprise

The verification plan integrates with the BMAD Enterprise TEA (Test, Evaluate, Approve) module:

- **Test Phase:** Automated and manual test execution per the verification summary table
- **Evaluate Phase:** Assessment of test results against pass/fail criteria for each requirement
- **Approve Phase:** Formal approval workflow for verification results with sign-off authority

**TEA Integration Points:**
- Each requirement's verification status will be tracked in the RTM (Requirements Traceability Matrix)
- Verification results feed into the project's quality gate decisions
- Failed verifications trigger the defect management workflow
- Verification completion is a prerequisite for baseline approval
```

### 6. Document Assumptions and Dependencies (Section 5)

Compile all assumptions and dependencies identified throughout the workflow:

```markdown
## 5. Assumptions and Dependencies

### 5.1 Assumptions

[List all assumptions that underpin the requirements in this SyRS]
- [Assumption about user behavior]
- [Assumption about technology availability]
- [Assumption about organizational readiness]
...

### 5.2 Dependencies

[List all external dependencies]
- [Dependency on external system availability]
- [Dependency on third-party service]
- [Dependency on organizational decision]
...

### 5.3 Risk Implications

[Note risks that arise from key assumptions]
| Assumption | Risk if Invalid | Mitigation |
|-----------|----------------|------------|
| [assumption] | [risk] | [mitigation approach] |
...
```

### 7. Verification Completeness Check

Verify the plan is complete:

```
**Verification Plan Completeness:**
- Total requirements: {{total_req_count}}
- Requirements with verification method: {{verified_count}}
- Requirements WITHOUT verification method: {{unverified_count}} (MUST BE ZERO)

**Verification Method Distribution:**
- Inspection: {{inspection_count}} requirements
- Analysis: {{analysis_count}} requirements
- Demonstration: {{demo_count}} requirements
- Test: {{test_count}} requirements

**Coverage: {{coverage_percentage}}%** (must be 100%)
```

### 8. Generate Verification Plan Content

Prepare the content to replace the Section 4 and Section 5 placeholders.

### 9. Present Content and Menu

Show the generated content and present choices:

"I've created the verification plan covering all {{total_req_count}} system requirements.

**Verification Plan Summary:**
- Inspection: {{inspection_count}} requirements
- Analysis: {{analysis_count}} requirements
- Demonstration: {{demo_count}} requirements
- Test: {{test_count}} requirements
- Coverage: 100% (all requirements have verification methods)

**TEA Module:** Enterprise track integration documented

**Assumptions & Dependencies:** {{assumption_count}} assumptions and {{dependency_count}} dependencies documented

**Here's what I'll add to the SyRS document (Sections 4 and 5):**

[Show the complete markdown content]

**What would you like to do?**
[A] Advanced Elicitation - Refine verification approaches or explore testing strategies
[P] Party Mode - Evaluate verification plan from QA, test, and operations perspectives
[C] Continue - Save the verification plan and proceed to final review"

### 10. Handle Menu Selection

#### If 'A' (Advanced Elicitation):

- Read fully and follow: {advancedElicitationTask} with the current verification plan
- Process enhanced insights about verification strategies
- Ask user: "Accept these enhancements to the verification plan? (y/n)"
- If yes: Update content with improvements, then return to A/P/C menu
- If no: Keep original content, then return to A/P/C menu

#### If 'P' (Party Mode):

- Read fully and follow: {partyModeWorkflow} with the current verification plan
- Process collaborative improvements to verification coverage
- Ask user: "Accept these changes to the verification plan? (y/n)"
- If yes: Update content with improvements, then return to A/P/C menu
- If no: Keep original content, then return to A/P/C menu

#### If 'C' (Continue):

- Write the final content to Sections 4 and 5 in `{outputFile}`
- Update frontmatter: `stepsCompleted: [1, 2, 3, 4, 5, 6, 7, 8]`
- Load `{nextStepFile}`

## APPEND TO DOCUMENT:

When user selects 'C', replace the placeholder content in Sections 4 and 5 of the output document with the finalized content.

## SUCCESS METRICS:

✅ Every system requirement (100%) has an assigned verification method
✅ Verification methods are appropriate to requirement types
✅ Verification summary table is complete with all requirements listed
✅ V&V levels specified for each requirement
✅ Pass/fail criteria defined for each verification
✅ TEA module integration documented for Enterprise track
✅ Assumptions and dependencies compiled from all steps
✅ Risk implications of key assumptions noted
✅ A/P/C menu presented and handled correctly
✅ Content properly written to document when C selected

## FAILURE MODES:

❌ Missing verification methods for any requirement (CRITICAL - 100% coverage required)
❌ Inappropriate verification method for requirement type
❌ Incomplete verification summary table
❌ Missing TEA module integration for Enterprise track
❌ Not documenting assumptions and dependencies
❌ Vague pass/fail criteria
❌ Missing Enterprise attributes on any requirement
❌ Not presenting A/P/C menu after content generation

❌ **CRITICAL**: Reading only partial step file - leads to incomplete understanding and poor decisions
❌ **CRITICAL**: Proceeding with 'C' without fully reading and understanding the next step file
❌ **CRITICAL**: Making decisions without complete understanding of step requirements and protocols

## NEXT STEP:

After user selects 'C' and content is saved to document, load `./step-09-review-complete.md` to perform the final review and complete the workflow.

Remember: Do NOT proceed to step-09 until user explicitly selects 'C' from the A/P/C menu and content is saved!
