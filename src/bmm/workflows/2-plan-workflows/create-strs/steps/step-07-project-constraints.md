---
name: 'step-07-project-constraints'
description: 'Define project constraints including budget, timeline, and environmental constraints'

# File References
nextStepFile: './step-08-review-complete.md'
outputFile: '{planning_artifacts}/strs-{{project_name}}.md'

# Task References
advancedElicitationTask: '{project-root}/_bmad/core/workflows/advanced-elicitation/workflow.xml'
partyModeWorkflow: '{project-root}/_bmad/core/workflows/party-mode/workflow.md'
---

# Step 7: Project Constraints

**Progress: Step 7 of 8** - Next: Final Review & Completion

## MANDATORY EXECUTION RULES (READ FIRST):

- 🛑 NEVER generate content without user input
- 📖 CRITICAL: ALWAYS read the complete step file before taking any action
- 🔄 CRITICAL: When loading next step with 'C', ensure the entire file is read
- ✅ ALWAYS treat this as collaborative discovery between expert peers
- 📋 YOU ARE A FACILITATOR, not a content generator
- 💬 FOCUS on constraints that limit what and how the system can be built
- ✅ YOU MUST ALWAYS SPEAK OUTPUT In your Agent communication style with the config `{communication_language}`

## EXECUTION PROTOCOLS:

- 🎯 Show your analysis before taking any action
- ⚠️ Present A/P/C menu after generating constraints content
- 💾 ONLY save when user chooses C (Continue)
- 📖 Update output file frontmatter, adding this step name to the end of the list of stepsCompleted
- 🚫 FORBIDDEN to load next step until C is selected

## CONTEXT BOUNDARIES:

- All previous steps inform constraint identification
- Focus on project-level constraints that affect feasibility and scope
- ISO 29148 Clause 7 Section 7: Project Constraints

## PROJECT CONSTRAINTS SEQUENCE:

### 1. Explain Constraints Purpose

**Purpose:**
Project constraints define the boundaries within which the system must be built and operated. They are non-negotiable limitations from budget, time, technology, environment, regulations, or organizational factors. Understanding constraints early prevents unrealistic requirements.

**Constraint Categories:**
- Budget and Cost Constraints
- Schedule and Timeline Constraints
- Technology and Platform Constraints
- Environmental and Infrastructure Constraints
- Regulatory and Compliance Constraints
- Organizational and Resource Constraints

### 2. Budget and Cost Constraints

**Key Questions:**
- "What is the budget range for this project?"
- "Are there ongoing operational cost limits?"
- "What are the licensing or subscription constraints?"
- "Is there a target cost per user or transaction?"
- "What happens if the budget is exceeded?"

### 3. Schedule and Timeline Constraints

**Key Questions:**
- "What is the target launch date? Is it fixed or flexible?"
- "Are there regulatory deadlines or market windows?"
- "What are the key milestones?"
- "Are there dependencies on external timelines (partner launches, API availability)?"
- "What is the minimum viable timeline?"

### 4. Technology and Platform Constraints

**Key Questions:**
- "Are there mandated technology choices (programming languages, frameworks, cloud providers)?"
- "Are there existing systems that must be maintained or integrated with?"
- "Are there platform requirements (iOS, Android, web, desktop)?"
- "Are there third-party service dependencies?"
- "Are there open source vs. commercial software policies?"

### 5. Environmental and Infrastructure Constraints

**Key Questions:**
- "What hosting or deployment environments are available?"
- "Are there geographic restrictions (data residency, CDN locations)?"
- "What are the network constraints (bandwidth, latency, offline requirements)?"
- "Are there hardware constraints for end users?"
- "What are the development and testing environment constraints?"

### 6. Regulatory and Compliance Constraints

**Key Questions:**
- "What regulations apply (GDPR, HIPAA, PCI-DSS, SOC2, etc.)?"
- "Are there industry-specific standards to comply with?"
- "What certifications are required?"
- "Are there accessibility requirements (WCAG, Section 508)?"
- "What audit or reporting requirements exist?"

### 7. Organizational and Resource Constraints

**Key Questions:**
- "What team size and skill sets are available?"
- "Are there organizational process requirements (Agile, waterfall, approvals)?"
- "What are the decision-making constraints?"
- "Are there vendor or contractor limitations?"
- "What knowledge transfer or documentation requirements exist?"

### 8. Generate Constraints Content

Prepare the content to append to the document:

#### Content Structure:

```markdown
## 7. Project Constraints

### 7.1 Budget and Cost Constraints

| Constraint ID | Constraint | Impact | Flexibility |
|--------------|-----------|--------|-------------|
| BC-001 | [Budget constraint] | [How it affects the project] | [Fixed / Negotiable] |

### 7.2 Schedule and Timeline Constraints

| Constraint ID | Constraint | Deadline | Flexibility |
|--------------|-----------|----------|-------------|
| TC-001 | [Timeline constraint] | [Date or timeframe] | [Fixed / Negotiable] |

### 7.3 Technology and Platform Constraints

| Constraint ID | Constraint | Rationale | Impact |
|--------------|-----------|-----------|--------|
| PC-001 | [Platform/technology constraint] | [Why this constraint exists] | [How it affects design] |

### 7.4 Environmental Constraints

[Hosting, geographic, network, hardware, and development environment constraints]

### 7.5 Regulatory and Compliance Constraints

| Constraint ID | Regulation/Standard | Requirement | Impact |
|--------------|-------------------|-------------|--------|
| RC-001 | [Regulation name] | [What it requires] | [How it affects the system] |

### 7.6 Organizational Constraints

[Team, process, vendor, and knowledge constraints]

## 8. Appendices

### 8.1 Assumptions

[List all assumptions made during StRS creation - these are statements believed to be true but not yet verified]

### 8.2 Dependencies

[List all external dependencies that could affect the project]

### 8.3 Abbreviations and Acronyms

[Complete list of all abbreviations and acronyms used in this document]
```

### 9. Present MENU OPTIONS

Present the project constraints for review, then display menu:
- Show all constraint categories
- Highlight any constraints that may conflict with requirements from previous steps
- Ask if any constraints are missing

Display: "**Select:** [A] Advanced Elicitation [P] Party Mode [C] Continue to Final Review (Step 8 of 8)"

#### Menu Handling Logic:
- IF A: Read fully and follow: {advancedElicitationTask}, process enhanced insights, ask user acceptance, update or keep, redisplay
- IF P: Read fully and follow: {partyModeWorkflow}, process collaborative validation, ask user acceptance, update or keep, redisplay
- IF C: Append the final content to {outputFile}, update frontmatter by adding this step name to the end of the stepsCompleted array, then read fully and follow: {nextStepFile}
- IF Any other: help user respond, then redisplay menu

## APPEND TO DOCUMENT:

When user selects 'C', append the content directly to the document using the structure from step 8.

## SUCCESS METRICS:

✅ All constraint categories explored
✅ Each constraint has ID, description, impact, and flexibility level
✅ Regulatory and compliance constraints explicitly identified
✅ Assumptions clearly separated from verified facts
✅ Dependencies documented
✅ Abbreviations and acronyms collected
✅ ISO 29148 Clause 7 Section 7 requirements addressed

## FAILURE MODES:

❌ Missing regulatory or compliance constraints
❌ Not documenting assumptions separately from facts
❌ Leaving constraint impact analysis blank
❌ Not identifying constraint conflicts with requirements
❌ Missing technology platform constraints

## NEXT STEP:

After user selects 'C' and content is saved, load {nextStepFile} for final review and completion.
