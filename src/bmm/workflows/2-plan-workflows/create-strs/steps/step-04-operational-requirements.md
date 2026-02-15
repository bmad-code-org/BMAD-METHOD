---
name: 'step-04-operational-requirements'
description: 'Define business operational requirements including processes, constraints, operational modes, and quality expectations'

# File References
nextStepFile: './step-05-user-requirements.md'
outputFile: '{planning_artifacts}/strs-{{project_name}}.md'

# Task References
advancedElicitationTask: '{project-root}/_bmad/core/workflows/advanced-elicitation/workflow.xml'
partyModeWorkflow: '{project-root}/_bmad/core/workflows/party-mode/workflow.md'
---

# Step 4: Business Operational Requirements

**Progress: Step 4 of 8** - Next: User Requirements

## MANDATORY EXECUTION RULES (READ FIRST):

- 🛑 NEVER generate content without user input
- 📖 CRITICAL: ALWAYS read the complete step file before taking any action
- 🔄 CRITICAL: When loading next step with 'C', ensure the entire file is read
- ✅ ALWAYS treat this as collaborative discovery between expert peers
- 📋 YOU ARE A FACILITATOR, not a content generator
- 💬 FOCUS on HOW the business operates and what the system must support operationally
- ✅ YOU MUST ALWAYS SPEAK OUTPUT In your Agent communication style with the config `{communication_language}`

## EXECUTION PROTOCOLS:

- 🎯 Show your analysis before taking any action
- ⚠️ Present A/P/C menu after generating operational requirements
- 💾 ONLY save when user chooses C (Continue)
- 📖 Update output file frontmatter, adding this step name to the end of the list of stepsCompleted
- 🚫 FORBIDDEN to load next step until C is selected

## CONTEXT BOUNDARIES:

- Previous steps (stakeholders, business context) are available in document
- Focus on operational aspects - how the business runs and what the system must support
- ISO 29148 Clause 7 Section 4: Business Operational Requirements

## OPERATIONAL REQUIREMENTS SEQUENCE:

### 1. Explain Operational Requirements Purpose

**Purpose:**
Operational requirements define HOW the business currently operates (or intends to operate) and what the system must support at a business process level. These are NOT system design requirements - they describe business operations.

**Sections to Cover:**
- Business Processes (what workflows the system supports)
- Operational Policies and Constraints
- Operational Modes (normal, degraded, maintenance, emergency)
- Operational Quality Requirements (at business level)
- Business Structure (organizational context)

### 2. Business Process Discovery

Map the key business processes this system supports:

**Key Questions:**
- "Walk me through the main business processes this system will support"
- "What happens before and after someone uses this system?"
- "Are there manual processes that this system will automate?"
- "What handoffs exist between people/departments?"
- "What are the critical path processes that cannot fail?"

**For each process, capture:**
- Process name and description
- Trigger (what starts the process)
- Actors involved
- Key steps
- Expected outcome
- Current pain points

### 3. Operational Policies and Constraints

Identify operational boundaries:

**Key Questions:**
- "What are the operating hours? Is 24/7 availability required?"
- "Are there geographic or regional constraints?"
- "What are the data handling policies (retention, deletion, privacy)?"
- "Are there capacity limits or constraints?"
- "What compliance policies affect operations?"

### 4. Operational Modes

Define how the system behaves in different states:

**Modes to Explore:**
- **Normal Operation**: Standard operating conditions
- **Degraded Mode**: What happens when parts of the system are unavailable?
- **Maintenance Mode**: How are updates and maintenance handled?
- **Emergency Mode**: What happens during incidents or emergencies?
- **Peak Load**: How does the system behave under maximum load?

**For each mode:**
- "What triggers this mode?"
- "What capabilities are available/unavailable?"
- "What stakeholders are affected?"
- "How is normal operation restored?"

### 5. Operational Quality Expectations

Define quality expectations from a business perspective:

**Key Questions:**
- "What level of availability does the business require?"
- "What is the acceptable data loss window?"
- "What response time expectations exist from a business perspective?"
- "What are the business continuity requirements?"
- "What reporting or audit capabilities are needed?"

### 6. Business Structure Context

Understand organizational context:

**Key Questions:**
- "How is the organization structured around this system?"
- "What teams or departments interact with the system?"
- "Are there geographical distributions to consider?"
- "What is the decision-making hierarchy for this system?"

### 7. Generate Operational Requirements Content

Prepare the content to append to the document:

#### Content Structure:

```markdown
## 4. Business Operational Requirements

### 4.1 Business Processes

#### BP-001: [Process Name]

- **Trigger:** [What starts this process]
- **Actors:** [Who is involved]
- **Steps:** [Key process steps]
- **Outcome:** [Expected result]
- **Current Pain Points:** [What needs improvement]

[Repeat for each key process]

### 4.2 Operational Policies and Constraints

| Policy ID | Policy | Rationale | Impact |
|-----------|--------|-----------|--------|
| OP-001 | [Policy description] | [Why this exists] | [How it affects the system] |

### 4.3 Operational Modes

| Mode | Trigger | Available Capabilities | Unavailable | Recovery |
|------|---------|----------------------|-------------|----------|
| Normal | Default state | All | None | N/A |
| Degraded | [Trigger] | [Limited set] | [Unavailable] | [Recovery process] |
| Maintenance | [Trigger] | [Available during maintenance] | [Suspended] | [Restoration] |
| Emergency | [Trigger] | [Critical only] | [Non-critical] | [Emergency procedures] |

### 4.4 Operational Quality

[Business-level quality expectations: availability, data loss tolerance, response expectations, business continuity]

### 4.5 Business Structure

[Organizational context, team interactions, geographical distribution]
```

### 8. Present MENU OPTIONS

Present the operational requirements for review, then display menu:
- Show documented business processes and operational requirements
- Highlight any gaps in operational mode coverage
- Ask if any processes or constraints are missing

Display: "**Select:** [A] Advanced Elicitation [P] Party Mode [C] Continue to User Requirements (Step 5 of 8)"

#### Menu Handling Logic:
- IF A: Read fully and follow: {advancedElicitationTask}, process enhanced insights, ask user acceptance, update or keep, redisplay
- IF P: Read fully and follow: {partyModeWorkflow}, process collaborative validation, ask user acceptance, update or keep, redisplay
- IF C: Append the final content to {outputFile}, update frontmatter by adding this step name to the end of the stepsCompleted array, then read fully and follow: {nextStepFile}
- IF Any other: help user respond, then redisplay menu

## APPEND TO DOCUMENT:

When user selects 'C', append the content directly to the document using the structure from step 7.

## SUCCESS METRICS:

✅ Key business processes mapped with triggers, actors, steps, outcomes
✅ Operational policies and constraints identified
✅ All operational modes defined (normal, degraded, maintenance, emergency)
✅ Business-level quality expectations documented
✅ Organizational structure context captured
✅ ISO 29148 Clause 7 Section 4 requirements addressed

## FAILURE MODES:

❌ Confusing operational requirements with system design requirements
❌ Missing operational modes (especially degraded and emergency)
❌ Not identifying operational constraints
❌ Generating process maps without user validation

## NEXT STEP:

After user selects 'C' and content is saved, load {nextStepFile} to define user requirements.
