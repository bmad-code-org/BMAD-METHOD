---
name: 'step-03-functional-requirements'
description: 'Transform PRD functional requirements into system-level functional requirements with Enterprise attributes for SyRS Section 3.1'

# Path Definitions
workflow_path: '{project-root}/_bmad/bmm/workflows/3-solutioning/create-syrs'

# File References
thisStepFile: './step-03-functional-requirements.md'
nextStepFile: './step-04-interface-requirements.md'
workflowFile: '{workflow_path}/workflow.md'
outputFile: '{planning_artifacts}/syrs-{{project_name}}.md'

# Task References
advancedElicitationTask: '{project-root}/_bmad/core/workflows/advanced-elicitation/workflow.xml'
partyModeWorkflow: '{project-root}/_bmad/core/workflows/party-mode/workflow.md'
---

# Step 3: System Functional Requirements

## STEP GOAL:

Transform PRD functional requirements into system-level functional requirements. Map each PRD FR to system functions using the SYS-FUNC-### identifier format with Enterprise attributes (priority, source, V&V method). This step populates ISO 29148 Clause 8 Section 3.1 (Functional Requirements).

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
- ✅ You bring requirements transformation and decomposition expertise
- ✅ User brings domain knowledge and priority decisions

### Step-Specific Rules:

- 🎯 Focus ONLY on functional requirements (Section 3.1)
- 🚫 FORBIDDEN to write interface, performance, or other requirement types in this step
- 💬 Transform PRD FRs to system-level - do NOT copy them verbatim
- 🚪 Every system requirement MUST trace back to at least one PRD FR
- 📐 Each requirement must be atomic, verifiable, and unambiguous

## EXECUTION PROTOCOLS:

- 🎯 Show your analysis before taking any action
- ⚠️ Present A/P/C menu after generating functional requirements content
- 💾 ONLY save when user chooses C (Continue)
- 📖 Update frontmatter `stepsCompleted: [1, 2, 3]` before loading next step
- 🚫 FORBIDDEN to load next step until C is selected

## COLLABORATION MENUS (A/P/C):

This step will generate content and present choices:

- **A (Advanced Elicitation)**: Use discovery protocols to uncover hidden functional requirements or refine transformations
- **P (Party Mode)**: Bring multiple perspectives to evaluate requirement completeness and quality
- **C (Continue)**: Save the content to the document and proceed to next step

## PROTOCOL INTEGRATION:

- When 'A' selected: Read fully and follow: {advancedElicitationTask}
- When 'P' selected: Read fully and follow: {partyModeWorkflow}
- PROTOCOLS always return to display this step's A/P/C menu after the A or P have completed
- User accepts/rejects protocol changes before proceeding

## CONTEXT BOUNDARIES:

- Current document with Sections 1 and 2 completed from step 2
- Input documents already loaded are in memory (StRS, PRD, Architecture)
- Focus on system-level functional requirement engineering
- Use system functions identified in Section 1.3.2 as a framework

## FUNCTIONAL REQUIREMENTS ENGINEERING SEQUENCE:

### 1. Extract PRD Functional Requirements

From the loaded PRD document, systematically extract ALL functional requirements:

**Extraction Method:**

- Look for numbered items like "FR1:", "Functional Requirement 1:", or similar
- Identify requirement statements that describe what the system must DO
- Include user actions, system behaviors, and business rules
- Count total PRD FRs extracted

Present to user:
"I've identified {{fr_count}} functional requirements from the PRD. Let me show you how I plan to transform these into system-level requirements."

### 2. Explain Transformation Approach

Explain the PRD-to-System requirement transformation:

"**PRD-to-SyRS Transformation:**

PRD requirements describe what the PRODUCT should do from a user/business perspective.
System requirements describe what the SYSTEM must do from an engineering perspective.

**Example Transformation:**
- PRD FR: 'Users shall be able to search for products by name, category, or price range'
- System Requirements:
  - SYS-FUNC-001: The system shall accept search queries containing text strings up to 256 characters
  - SYS-FUNC-002: The system shall support search filtering by product category from the defined category taxonomy
  - SYS-FUNC-003: The system shall support search filtering by price range with minimum and maximum values
  - SYS-FUNC-004: The system shall return search results within the response time defined in SYS-PERF-001

Note: One PRD FR may produce multiple system requirements, and multiple PRD FRs may contribute to a single system function."

### 3. Transform Requirements by System Function Group

Organize system functional requirements by the system functions identified in Section 1.3.2:

For each system function group:

**Format each requirement as:**

```markdown
**SYS-FUNC-###:** [Requirement statement - atomic, verifiable, unambiguous]

| Attribute | Value |
|-----------|-------|
| Priority | [Critical / High / Medium / Low] |
| Source | [PRD FR reference(s), e.g., "PRD-FR-001, PRD-FR-003"] |
| V&V Method | [Inspection / Analysis / Demonstration / Test] |
| Rationale | [Brief justification for this system requirement] |
```

**Requirement Quality Rules:**

- **Atomic**: Each requirement addresses exactly one capability
- **Verifiable**: Must be testable or inspectable with clear pass/fail criteria
- **Unambiguous**: Only one possible interpretation
- **System-Level**: Expressed in terms of what the SYSTEM does, not the user experience
- **Shall Statements**: Use "The system shall..." phrasing consistently

### 4. Map StRS Traceability

If StRS is available, also note which StRS requirements each system requirement supports:

- Add StRS reference to the Source attribute where applicable
- Note any StRS requirements that don't yet have system-level coverage
- Flag gaps for discussion with user

### 5. Completeness Check

After transforming all requirements, verify:

- Every PRD FR has at least one corresponding SYS-FUNC requirement
- No PRD FR was overlooked or dropped
- System functions from Section 1.3.2 all have corresponding requirements
- Present a coverage summary:

```
**PRD FR Coverage Summary:**
- PRD FRs extracted: {{count}}
- System functional requirements created: {{count}}
- PRD FRs fully covered: {{count}}
- PRD FRs partially covered: {{count}} (list them)
- PRD FRs not covered: {{count}} (list them - REQUIRES ATTENTION)
```

### 6. Generate Functional Requirements Content

Prepare the content to replace the Section 3.1 placeholder:

#### Content Structure:

```markdown
### 3.1 Functional Requirements

#### 3.1.1 [System Function Group 1 Name]

**SYS-FUNC-001:** [Requirement statement]

| Attribute | Value |
|-----------|-------|
| Priority | [value] |
| Source | [PRD FR ref] |
| V&V Method | [method] |
| Rationale | [justification] |

**SYS-FUNC-002:** [Requirement statement]
...

#### 3.1.2 [System Function Group 2 Name]
...

#### PRD FR Coverage Map

| PRD FR | System Requirements | Coverage Status |
|--------|-------------------|-----------------|
| PRD-FR-001 | SYS-FUNC-001, SYS-FUNC-002 | Full |
| PRD-FR-002 | SYS-FUNC-003 | Full |
...
```

### 7. Present Content and Menu

Show the generated content and present choices:

"I've transformed the PRD functional requirements into {{sys_func_count}} system-level functional requirements organized by system function groups.

**Coverage Summary:**
- {{prd_fr_count}} PRD FRs mapped to {{sys_func_count}} system requirements
- Coverage: {{coverage_percentage}}%

**Here's what I'll add to the SyRS document (Section 3.1):**

[Show the complete markdown content from step 6]

**What would you like to do?**
[A] Advanced Elicitation - Uncover hidden requirements or refine transformations
[P] Party Mode - Evaluate requirement quality from different perspectives
[C] Continue - Save these requirements and proceed to interface requirements"

### 8. Handle Menu Selection

#### If 'A' (Advanced Elicitation):

- Read fully and follow: {advancedElicitationTask} with the current functional requirements
- Process enhanced insights about missing or refined requirements
- Ask user: "Accept these enhancements to the functional requirements? (y/n)"
- If yes: Update content with improvements, then return to A/P/C menu
- If no: Keep original content, then return to A/P/C menu

#### If 'P' (Party Mode):

- Read fully and follow: {partyModeWorkflow} with the current functional requirements
- Process collaborative improvements to requirement quality
- Ask user: "Accept these changes to the functional requirements? (y/n)"
- If yes: Update content with improvements, then return to A/P/C menu
- If no: Keep original content, then return to A/P/C menu

#### If 'C' (Continue):

- Write the final content to Section 3.1 in `{outputFile}`
- Update frontmatter: `stepsCompleted: [1, 2, 3]`
- Load `{nextStepFile}`

## APPEND TO DOCUMENT:

When user selects 'C', replace the `{{functional_requirements}}` placeholder in Section 3.1 of the output document with the finalized content.

## SUCCESS METRICS:

✅ All PRD functional requirements extracted and counted
✅ PRD FRs transformed to system-level requirements (not copied verbatim)
✅ Each requirement uses SYS-FUNC-### identifier format
✅ Each requirement has Enterprise attributes (priority, source, V&V method, rationale)
✅ Each requirement is atomic, verifiable, and unambiguous
✅ PRD FR coverage map complete with no unexplained gaps
✅ Requirements organized by system function groups
✅ StRS traceability noted where applicable
✅ A/P/C menu presented and handled correctly
✅ Content properly written to document when C selected

## FAILURE MODES:

❌ Copying PRD FRs verbatim instead of transforming to system level
❌ Missing PRD FRs in the coverage map
❌ Creating non-atomic requirements (multiple capabilities in one statement)
❌ Using vague or non-verifiable language
❌ Missing Enterprise attributes on any requirement
❌ Not organizing by system function groups
❌ Not presenting A/P/C menu after content generation

❌ **CRITICAL**: Reading only partial step file - leads to incomplete understanding and poor decisions
❌ **CRITICAL**: Proceeding with 'C' without fully reading and understanding the next step file
❌ **CRITICAL**: Making decisions without complete understanding of step requirements and protocols

## NEXT STEP:

After user selects 'C' and content is saved to document, load `./step-04-interface-requirements.md` to define system interface requirements.

Remember: Do NOT proceed to step-04 until user explicitly selects 'C' from the A/P/C menu and content is saved!
