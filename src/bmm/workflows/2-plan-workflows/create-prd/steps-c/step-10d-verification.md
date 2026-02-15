---
name: 'step-10d-verification'
description: 'Define verification approach for each requirement category - ISO 29148 Clause 9.4'

# File References
nextStepFile: './step-11-polish.md'
outputFile: '{planning_artifacts}/prd.md'

# Task References
advancedElicitationTask: '{project-root}/_bmad/core/workflows/advanced-elicitation/workflow.xml'
partyModeWorkflow: '{project-root}/_bmad/core/workflows/party-mode/workflow.md'
---

# Step 10d: Verification Plan

**Progress: Step 10d** - Next: Document Polish

## MANDATORY EXECUTION RULES (READ FIRST):

- 🛑 NEVER generate content without user input
- 📖 CRITICAL: ALWAYS read the complete step file before taking any action
- 🔄 CRITICAL: When loading next step with 'C', ensure the entire file is read
- ✅ ALWAYS treat this as collaborative discovery between PM peers
- 📋 YOU ARE A FACILITATOR, not a content generator
- 💬 FOCUS on HOW each requirement will be verified
- 🎯 This step is REQUIRED for Enterprise track, OPTIONAL for BMad Method track
- ✅ YOU MUST ALWAYS SPEAK OUTPUT In your Agent communication style with the config `{communication_language}`

## TRACK-AWARE EXECUTION:

**Check the document frontmatter for `track` value:**
- If `track: 'enterprise'` → This step is MANDATORY
- If `track: 'bmad'` or not set → This step is OPTIONAL, ask user if they want a verification plan
- If user on non-Enterprise track declines → Skip to {nextStepFile} immediately

## EXECUTION PROTOCOLS:

- 🎯 Show your analysis before taking any action
- ⚠️ Present A/P/C menu after generating verification content
- 💾 ONLY save when user chooses C (Continue)
- 📖 Update output file frontmatter, adding this step name to the end of the list of stepsCompleted
- 🚫 FORBIDDEN to load next step until C is selected

## CONTEXT BOUNDARIES:

- All FRs, NFRs, interface requirements, and constraints from previous steps
- Focus on defining HOW requirements will be proven satisfied
- ISO 29148 Clause 9 Section 4: Verification
- This feeds directly into test strategy (TEA module for Enterprise track)

## VERIFICATION PLAN SEQUENCE:

### 1. Explain Verification Purpose

**Purpose:**
ISO 29148 requires that every requirement has a defined verification method. This ensures requirements are not only stated but can be proven satisfied. The four standard verification methods are:

- **Inspection:** Visual examination of documents, code, or artifacts
- **Analysis:** Mathematical or logical reasoning, modeling, or simulation
- **Demonstration:** Operation of the system under specific conditions to show capability
- **Test:** Execution of the system with test inputs and comparison against expected outputs

### 2. Review All Requirements

Load and review all requirements from the current PRD:
- Functional Requirements (FRs)
- Non-Functional Requirements (NFRs)
- Interface Requirements (if defined)
- Design Constraints (if defined)

### 3. Assign Verification Methods

For each requirement category, determine the appropriate verification method:

**Guidelines:**
- **FRs** → Typically verified by **Test** (automated or manual) or **Demonstration**
- **NFR Performance** → Typically verified by **Test** (load testing, benchmarks) or **Analysis**
- **NFR Security** → Typically verified by **Test** (penetration testing) and **Inspection** (code review)
- **NFR Accessibility** → Typically verified by **Test** (automated) and **Inspection** (manual audit)
- **Interface Requirements** → Typically verified by **Test** (integration testing) or **Demonstration**
- **Constraints** → Typically verified by **Inspection** (architecture review) or **Analysis**
- **Compliance** → Typically verified by **Inspection** (audit) or **Analysis** (gap analysis)

### 4. Create Verification Summary

**Key Questions:**
- "For each capability area, what is the primary way you'd verify it works?"
- "Are there requirements that can only be verified through analysis rather than testing?"
- "What verification activities require specialized tools or expertise?"
- "Are there requirements that need third-party verification?"

### 5. Generate Verification Content

#### Content Structure:

```markdown
## Verification Approaches

### Verification Method Summary

| Requirement Category | Primary Method | Secondary Method | Notes |
|---------------------|---------------|-----------------|-------|
| Functional Requirements | Test | Demonstration | Automated test suite |
| Performance NFRs | Test | Analysis | Load testing required |
| Security NFRs | Test + Inspection | Analysis | Penetration testing + code review |
| Accessibility NFRs | Test + Inspection | Demonstration | WCAG automated + manual audit |
| Interface Requirements | Test | Demonstration | Integration testing |
| Design Constraints | Inspection | Analysis | Architecture review |
| Compliance | Inspection | Analysis | Audit and gap analysis |

### Verification Details

#### Functional Requirements Verification

[How FRs will be verified - test approach, acceptance criteria validation, demonstration scenarios]

#### Non-Functional Requirements Verification

[How NFRs will be verified - performance benchmarks, security scans, accessibility audits]

#### Interface Requirements Verification

[How interfaces will be verified - integration tests, API contract testing, protocol compliance]

### Verification Dependencies

[Tools, environments, expertise, or third-party services needed for verification]

### TEA Module Integration (Enterprise Track)

[Note: For Enterprise track projects, the TEA (Test Architecture Enterprise) module provides comprehensive test strategy, risk-based prioritization (P0-P3), and test-requirement traceability. This verification plan feeds into TEA's TD (Test Design) workflow.]
```

### 6. Present MENU OPTIONS

Display: "**Select:** [A] Advanced Elicitation [P] Party Mode [C] Continue to Document Polish (Step 11)"

#### Menu Handling Logic:
- IF A: Read fully and follow: {advancedElicitationTask}, process, ask acceptance, update or keep, redisplay
- IF P: Read fully and follow: {partyModeWorkflow}, process, ask acceptance, update or keep, redisplay
- IF C: Append to {outputFile}, update frontmatter, then read fully and follow: {nextStepFile}
- IF Any other: help user respond, then redisplay menu

## APPEND TO DOCUMENT:

When user selects 'C', append the content directly to the document using the structure from step 5.

## SUCCESS METRICS:

✅ Every requirement category has an assigned verification method
✅ Verification methods are appropriate (Test, Analysis, Demonstration, Inspection)
✅ Verification dependencies identified (tools, environments, expertise)
✅ TEA module integration noted for Enterprise track
✅ ISO 29148 Clause 9 Section 4 requirements addressed

## FAILURE MODES:

❌ Requirements without any verification method
❌ Using only "Test" when some requirements need Analysis or Inspection
❌ Not identifying verification dependencies
❌ Generating verification plan without reviewing actual requirements

## NEXT STEP:

After user selects 'C' and content is saved, load {nextStepFile} to polish the document.
