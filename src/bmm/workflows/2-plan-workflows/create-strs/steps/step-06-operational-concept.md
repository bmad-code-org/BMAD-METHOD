---
name: 'step-06-operational-concept'
description: 'Define the proposed system operational concept and operational scenarios'

# File References
nextStepFile: './step-07-project-constraints.md'
outputFile: '{planning_artifacts}/strs-{{project_name}}.md'

# Task References
advancedElicitationTask: '{project-root}/_bmad/core/workflows/advanced-elicitation/workflow.xml'
partyModeWorkflow: '{project-root}/_bmad/core/workflows/party-mode/workflow.md'
---

# Step 6: Operational Concept & Scenarios

**Progress: Step 6 of 8** - Next: Project Constraints

## MANDATORY EXECUTION RULES (READ FIRST):

- 🛑 NEVER generate content without user input
- 📖 CRITICAL: ALWAYS read the complete step file before taking any action
- 🔄 CRITICAL: When loading next step with 'C', ensure the entire file is read
- ✅ ALWAYS treat this as collaborative discovery between expert peers
- 📋 YOU ARE A FACILITATOR, not a content generator
- 💬 FOCUS on HOW the system will be used in real operational scenarios
- ✅ YOU MUST ALWAYS SPEAK OUTPUT In your Agent communication style with the config `{communication_language}`

## EXECUTION PROTOCOLS:

- 🎯 Show your analysis before taking any action
- ⚠️ Present A/P/C menu after generating operational concept content
- 💾 ONLY save when user chooses C (Continue)
- 📖 Update output file frontmatter, adding this step name to the end of the list of stepsCompleted
- 🚫 FORBIDDEN to load next step until C is selected

## CONTEXT BOUNDARIES:

- All previous steps (stakeholders, business context, operational requirements, user profiles) inform scenarios
- Focus on HOW the system operates in context, not system internals
- ISO 29148 Clause 7 Section 6: Proposed System Concept

## OPERATIONAL CONCEPT SEQUENCE:

### 1. Explain Operational Concept Purpose

**Purpose:**
The operational concept describes HOW the proposed system will work from the users' and operators' perspective. It paints a picture of the system in action - who does what, when, and how. Operational scenarios are concrete stories that illustrate the concept.

**Sections to Cover:**
- Operational Concept (high-level vision of system operation)
- Operational Scenarios (concrete day-in-the-life stories)

### 2. Build Operational Concept

Synthesize previous steps into a cohesive operational picture:

**Key Questions:**
- "Describe a typical day with this system fully operational - what happens?"
- "How does the system fit into users' existing workflows?"
- "What changes from the current way of doing things?"
- "How do different user types interact with each other through the system?"
- "What is the system's role in the bigger picture (supporting tool vs. central platform)?"

**Operational Concept Elements:**
- System's place in the overall business workflow
- Key interactions between user types and the system
- Information flows between system and external entities
- Major system capabilities from an operational perspective
- How the system handles transitions between operational modes

### 3. Create Operational Scenarios

Develop concrete scenarios that illustrate the operational concept:

**Scenario Development Guidelines:**

Create 3-5 key scenarios covering:
1. **Happy Path**: Normal, successful use of core functionality
2. **First-Time Use**: New user onboarding experience
3. **Exception Handling**: What happens when things go wrong
4. **Peak Load**: System under maximum expected usage
5. **Cross-User Interaction**: Different user types working together

**For each scenario, capture:**
- **Scenario Name**: Descriptive title
- **Actors**: Who is involved
- **Preconditions**: What must be true before the scenario starts
- **Trigger**: What initiates the scenario
- **Steps**: Sequential actions and system responses
- **Postconditions**: What is true after the scenario completes
- **Variations**: Alternative paths or edge cases

**Key Questions per Scenario:**
- "Walk me through exactly what happens step by step"
- "What could go wrong at each step?"
- "How does the user know the step was successful?"
- "What data is created, modified, or consumed?"

### 4. Validate Scenario Coverage

Ensure scenarios cover all key stakeholder needs:

**Coverage Check:**
- Do scenarios cover all user types from Step 5?
- Do scenarios exercise all business processes from Step 4?
- Do scenarios address all operational modes (normal, degraded, maintenance)?
- Are edge cases and error conditions represented?
- Do scenarios illustrate the business objectives from Step 3?

### 5. Generate Operational Concept Content

Prepare the content to append to the document:

#### Content Structure:

```markdown
## 6. Proposed System Concept

### 6.1 Operational Concept

[High-level narrative describing how the system operates in context. Paint a picture of the system in action - who does what, when, how. Include system's place in workflows, key interactions, information flows.]

### 6.2 Operational Scenarios

#### OS-001: [Scenario Name]

- **Actors:** [Who is involved]
- **Preconditions:** [What must be true]
- **Trigger:** [What starts this scenario]
- **Scenario Steps:**
  1. [Actor] [action] → [System response/result]
  2. [Actor] [action] → [System response/result]
  3. [Continue for all steps]
- **Postconditions:** [What is true after completion]
- **Variations:**
  - [Alternative path or edge case]
  - [Error condition and handling]

[Repeat for each scenario]

### 6.3 Scenario Coverage Matrix

| Scenario | User Types | Business Processes | Operational Modes | Business Objectives |
|----------|-----------|-------------------|-------------------|-------------------|
| OS-001 | [Types covered] | [Processes covered] | [Modes covered] | [Objectives addressed] |
```

### 6. Present MENU OPTIONS

Present the operational concept and scenarios for review, then display menu:
- Show operational concept narrative and scenarios
- Highlight scenario coverage matrix
- Ask if any scenarios are missing or need more detail

Display: "**Select:** [A] Advanced Elicitation [P] Party Mode [C] Continue to Project Constraints (Step 7 of 8)"

#### Menu Handling Logic:
- IF A: Read fully and follow: {advancedElicitationTask}, process enhanced insights, ask user acceptance, update or keep, redisplay
- IF P: Read fully and follow: {partyModeWorkflow}, process collaborative validation, ask user acceptance, update or keep, redisplay
- IF C: Append the final content to {outputFile}, update frontmatter by adding this step name to the end of the stepsCompleted array, then read fully and follow: {nextStepFile}
- IF Any other: help user respond, then redisplay menu

## APPEND TO DOCUMENT:

When user selects 'C', append the content directly to the document using the structure from step 5.

## SUCCESS METRICS:

✅ Operational concept provides clear picture of system in action
✅ 3-5 operational scenarios covering happy path, exceptions, and cross-user interactions
✅ Each scenario has actors, preconditions, steps, postconditions, and variations
✅ Scenario coverage matrix validates completeness
✅ All user types from Step 5 appear in at least one scenario
✅ Business processes from Step 4 are exercised by scenarios
✅ ISO 29148 Clause 7 Section 6 requirements addressed

## FAILURE MODES:

❌ Operational concept is too abstract (no concrete operational picture)
❌ Scenarios are too vague (missing steps, actors, or postconditions)
❌ Not covering all user types in scenarios
❌ Only happy-path scenarios (missing error and edge cases)
❌ Not validating scenario coverage against previous steps

## NEXT STEP:

After user selects 'C' and content is saved, load {nextStepFile} to define project constraints.
