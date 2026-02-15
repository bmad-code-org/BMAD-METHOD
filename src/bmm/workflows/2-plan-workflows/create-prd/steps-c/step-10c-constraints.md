---
name: 'step-10c-constraints'
description: 'Define design constraints, assumptions, and dependencies - ISO 29148 Clause 9.3.6 and Appendix A'

# File References
nextStepFile: './step-10d-verification.md'
outputFile: '{planning_artifacts}/prd.md'

# Task References
advancedElicitationTask: '{project-root}/_bmad/core/workflows/advanced-elicitation/workflow.xml'
partyModeWorkflow: '{project-root}/_bmad/core/workflows/party-mode/workflow.md'
---

# Step 10c: Design Constraints & Assumptions

**Progress: Step 10c** - Next: Verification Plan

## MANDATORY EXECUTION RULES (READ FIRST):

- 🛑 NEVER generate content without user input
- 📖 CRITICAL: ALWAYS read the complete step file before taking any action
- 🔄 CRITICAL: When loading next step with 'C', ensure the entire file is read
- ✅ ALWAYS treat this as collaborative discovery between PM peers
- 📋 YOU ARE A FACILITATOR, not a content generator
- 💬 FOCUS on constraints that limit design choices and assumptions that must hold true
- 🎯 This step is REQUIRED for Enterprise track, OPTIONAL for BMad Method track
- ✅ YOU MUST ALWAYS SPEAK OUTPUT In your Agent communication style with the config `{communication_language}`

## TRACK-AWARE EXECUTION:

**Check the document frontmatter for `track` value:**
- If `track: 'enterprise'` → This step is MANDATORY
- If `track: 'bmad'` or not set → This step is OPTIONAL, ask user if they want to define constraints
- If user on non-Enterprise track declines → Skip to {nextStepFile} immediately

## EXECUTION PROTOCOLS:

- 🎯 Show your analysis before taking any action
- ⚠️ Present A/P/C menu after generating constraints content
- 💾 ONLY save when user chooses C (Continue)
- 📖 Update output file frontmatter, adding this step name to the end of the list of stepsCompleted
- 🚫 FORBIDDEN to load next step until C is selected

## CONTEXT BOUNDARIES:

- All previous PRD content informs constraint discovery
- StRS project constraints (if available) are the primary source
- Focus on constraints that limit HOW the system can be designed
- ISO 29148 Clause 9 Section 3.6: Design Constraints + Appendix A

## CONSTRAINTS SEQUENCE:

### 1. Explain Constraints and Assumptions Purpose

**Purpose:**
Design constraints limit the choices available to architects and developers. Assumptions are conditions believed to be true that, if invalidated, could impact the project. Both must be explicitly documented to prevent costly surprises.

**Categories:**
- Design Constraints (technology, standards, regulatory)
- Software System Attributes (reliability, availability, security, maintainability, portability)
- Compliance Requirements
- Assumptions
- Dependencies

### 2. Design Constraints Discovery

**Key Questions:**
- "Are there mandated technology choices (languages, frameworks, platforms)?"
- "Are there coding standards or development practices that must be followed?"
- "Are there database or storage technology constraints?"
- "Are there hosting or deployment constraints (on-premise, specific cloud provider)?"
- "Are there regulatory constraints that affect design (data residency, encryption standards)?"
- "Are there backward compatibility requirements?"

### 3. Software System Attributes (ISO 29148 Clause 9.3.7)

Explore quality attributes that constrain design:

**Reliability:** Mean time between failures, error handling, recovery
**Availability:** Uptime requirements, maintenance windows
**Security:** Authentication, authorization, data protection, audit
**Maintainability:** Code standards, documentation, modularity
**Portability:** Platform independence, migration requirements

### 4. Compliance Requirements (ISO 29148 Clause 9.3.8)

**Key Questions:**
- "What industry standards must be met?"
- "What regulatory compliance is required?"
- "Are there certification requirements?"
- "What audit trail requirements exist?"

### 5. Assumptions and Dependencies

**Key Questions:**
- "What conditions are we assuming to be true?"
- "What external systems or services are we depending on?"
- "What team skills or availability are we assuming?"
- "What timeline assumptions are we making?"
- "If any of these assumptions prove false, what is the impact?"

### 6. Generate Constraints Content

#### Content Structure:

```markdown
## Design Constraints

### Technology Constraints

[Mandated technology choices and standards]

### Software System Attributes

- **Reliability:** [Requirements and targets]
- **Availability:** [Uptime targets and maintenance windows]
- **Security:** [Authentication, authorization, data protection requirements]
- **Maintainability:** [Code standards, modularity, documentation requirements]
- **Portability:** [Platform independence, migration requirements]

### Compliance Requirements

[Industry standards, regulatory compliance, certifications required]

## Assumptions and Dependencies

### Assumptions

| ID | Assumption | Impact if False | Probability |
|----|-----------|----------------|-------------|
| A-001 | [Assumption] | [Impact] | [High/Medium/Low] |

### Dependencies

| ID | Dependency | Owner | Status | Risk if Unavailable |
|----|-----------|-------|--------|-------------------|
| D-001 | [Dependency] | [Who controls it] | [Available/Pending/Unknown] | [Impact] |
```

### 7. Present MENU OPTIONS

Display: "**Select:** [A] Advanced Elicitation [P] Party Mode [C] Continue to Verification Plan (Step 10d)"

#### Menu Handling Logic:
- IF A: Read fully and follow: {advancedElicitationTask}, process, ask acceptance, update or keep, redisplay
- IF P: Read fully and follow: {partyModeWorkflow}, process, ask acceptance, update or keep, redisplay
- IF C: Append to {outputFile}, update frontmatter, then read fully and follow: {nextStepFile}
- IF Any other: help user respond, then redisplay menu

## APPEND TO DOCUMENT:

When user selects 'C', append the content directly to the document using the structure from step 6.

## SUCCESS METRICS:

✅ Technology constraints explicitly documented
✅ Software system attributes (reliability, availability, security, maintainability, portability) addressed
✅ Compliance requirements identified
✅ Assumptions documented with impact analysis
✅ Dependencies documented with ownership and risk
✅ ISO 29148 Clause 9 Sections 3.6, 3.7, 3.8 and Appendix A addressed

## FAILURE MODES:

❌ Missing technology constraints for system with mandated technology
❌ Not documenting assumptions (leads to undiscovered risks)
❌ Confusing constraints with requirements
❌ Not identifying critical dependencies

## NEXT STEP:

After user selects 'C' and content is saved, load {nextStepFile} to define the verification plan.
