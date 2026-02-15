---
name: 'step-03-business-context'
description: 'Define business management requirements including objectives, business model, and information environment'

# File References
nextStepFile: './step-04-operational-requirements.md'
outputFile: '{planning_artifacts}/strs-{{project_name}}.md'

# Task References
advancedElicitationTask: '{project-root}/_bmad/core/workflows/advanced-elicitation/workflow.xml'
partyModeWorkflow: '{project-root}/_bmad/core/workflows/party-mode/workflow.md'
---

# Step 3: Business Context & Management Requirements

**Progress: Step 3 of 8** - Next: Operational Requirements

## MANDATORY EXECUTION RULES (READ FIRST):

- 🛑 NEVER generate content without user input
- 📖 CRITICAL: ALWAYS read the complete step file before taking any action
- 🔄 CRITICAL: When loading next step with 'C', ensure the entire file is read
- ✅ ALWAYS treat this as collaborative discovery between expert peers
- 📋 YOU ARE A FACILITATOR, not a content generator
- 💬 FOCUS on business context that shapes what the system must do
- ✅ YOU MUST ALWAYS SPEAK OUTPUT In your Agent communication style with the config `{communication_language}`

## EXECUTION PROTOCOLS:

- 🎯 Show your analysis before taking any action
- ⚠️ Present A/P/C menu after generating business context content
- 💾 ONLY save when user chooses C (Continue)
- 📖 Update output file frontmatter, adding this step name to the end of the list of stepsCompleted
- 🚫 FORBIDDEN to load next step until C is selected

## CONTEXT BOUNDARIES:

- Stakeholder identification from Step 2 is now available in document
- Product Brief content continues to inform this step
- Focus on business-level requirements, NOT system design
- ISO 29148 Clause 7 Section 3: Business Management Requirements

## BUSINESS CONTEXT SEQUENCE:

### 1. Explain Business Context Purpose

**Purpose:**
ISO 29148 requires understanding the business environment, objectives, and model before defining what the system must do. This ensures system requirements are grounded in real business needs, not assumptions.

**Sections to Cover:**
- Business Environment (market, competitive landscape, technology context)
- Business Objectives and Success Measures
- Business Model (how value is created and captured)
- Information Environment (data flows, existing systems, integration landscape)

### 2. Business Environment Discovery

Extract and validate business environment from Product Brief and research:

**Key Questions:**
- "What market forces or trends are driving this system?"
- "Who are the main competitors and how does this system differentiate?"
- "What technology changes or opportunities enable this system?"
- "What regulatory or compliance environment affects this system?"
- "What are the current pain points this system addresses?"

### 3. Business Objectives and Success

Define measurable business objectives:

**Key Questions:**
- "What are the top 3 business objectives this system must achieve?"
- "How will you measure whether these objectives are met?"
- "What is the timeline for achieving these objectives?"
- "What happens if these objectives are NOT met?"
- "Are there intermediate milestones?"

**Objective Format:**
Each objective should be SMART: Specific, Measurable, Achievable, Relevant, Time-bound.

### 4. Business Model

Capture how the system fits the business model:

**Key Questions:**
- "How does this system generate or protect revenue?"
- "What is the cost model (development, operations, maintenance)?"
- "Who pays for the system and how?"
- "What are the key business processes the system supports?"
- "How does the system fit within the larger organizational strategy?"

### 5. Information Environment

Map the data and system landscape:

**Key Questions:**
- "What existing systems must this system interact with?"
- "What data does the system consume and produce?"
- "Are there data governance or privacy requirements?"
- "What is the current state of data (paper, legacy systems, manual processes)?"
- "What are the key information flows this system must support?"

### 6. Business Policies and Rules

Identify policies that constrain the system:

**Key Questions:**
- "What business policies must the system enforce?"
- "Are there industry standards or best practices to follow?"
- "What authorization or approval workflows exist?"
- "Are there data retention or archiving requirements?"

### 7. Generate Business Context Content

Prepare the content to append to the document:

#### Content Structure:

```markdown
## 2. References

[List of reference documents, standards, and regulations relevant to this project]

## 3. Business Management Requirements

### 3.1 Business Environment

[Market context, competitive landscape, technology drivers, regulatory context]

### 3.2 Business Objectives

| Objective ID | Objective | Success Measure | Timeline |
|-------------|-----------|----------------|----------|
| BO-001 | [Objective description] | [Measurable criteria] | [Target date] |

### 3.3 Business Model

[How the system creates, delivers, and captures value. Revenue model, cost structure, key processes supported.]

### 3.4 Information Environment

[Existing systems, data flows, integration landscape, data governance requirements]

### 3.5 Business Policies and Rules

[Business policies the system must enforce, industry standards, authorization workflows]
```

### 8. Present MENU OPTIONS

Present the business context for review, then display menu:
- Show synthesized business context and objectives
- Highlight any gaps or assumptions that need validation
- Ask if any business aspects are missing

Display: "**Select:** [A] Advanced Elicitation [P] Party Mode [C] Continue to Operational Requirements (Step 4 of 8)"

#### Menu Handling Logic:
- IF A: Read fully and follow: {advancedElicitationTask} with current business context, process enhanced insights, ask user acceptance, if yes update then redisplay, if no keep original then redisplay
- IF P: Read fully and follow: {partyModeWorkflow} with business context, process collaborative validation, ask user acceptance, if yes update then redisplay, if no keep original then redisplay
- IF C: Append the final content to {outputFile}, update frontmatter by adding this step name to the end of the stepsCompleted array, then read fully and follow: {nextStepFile}
- IF Any other: help user respond, then redisplay menu

#### EXECUTION RULES:
- ALWAYS halt and wait for user input after presenting menu
- ONLY proceed to next step when user selects 'C'

## APPEND TO DOCUMENT:

When user selects 'C', append the content directly to the document using the structure from step 7.

## SUCCESS METRICS:

✅ Business environment thoroughly documented
✅ Business objectives are SMART (Specific, Measurable, Achievable, Relevant, Time-bound)
✅ Business model clearly articulated
✅ Information environment mapped (existing systems, data flows)
✅ Business policies and rules identified
✅ All content grounded in Product Brief and user input
✅ ISO 29148 Clause 7 Section 3 requirements addressed

## FAILURE MODES:

❌ Vague or unmeasurable business objectives
❌ Missing information environment analysis
❌ Not connecting business context to Product Brief
❌ Generating content without user validation
❌ Skipping business policy identification

## NEXT STEP:

After user selects 'C' and content is saved, load {nextStepFile} to define operational requirements.
