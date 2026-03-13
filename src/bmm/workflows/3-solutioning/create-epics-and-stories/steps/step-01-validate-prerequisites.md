---
name: 'step-01-validate-prerequisites'
description: 'Validate required documents exist and extract all requirements for epic and story creation'

# Path Definitions
workflow_path: '{project-root}/_bmad/bmm/workflows/3-solutioning/create-epics-and-stories'

# File References
thisStepFile: './step-01-validate-prerequisites.md'
nextStepFile: './step-02-design-epics.md'
workflowFile: '{workflow_path}/workflow.md'
outputFile: '{planning_artifacts}/epics.md'
epicsTemplate: '{workflow_path}/templates/epics-template.md'

# Task References
advancedElicitationTask: 'skill:bmad-advanced-elicitation'
partyModeWorkflow: '{project-root}/_bmad/core/workflows/bmad-party-mode/workflow.md'

# Template References
epicsTemplate: '{workflow_path}/templates/epics-template.md'
---

# Step 1: Validate Prerequisites and Extract Requirements

## STEP GOAL:

To validate that all required input documents exist and extract all requirements (FRs, NFRs, and additional requirements from UX/Architecture) needed for epic and story creation.

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:

- 🛑 NEVER generate content without user input
- 📖 CRITICAL: Read the complete step file before taking any action
- 🔄 CRITICAL: When loading next step with 'C', ensure entire file is read
- 📋 YOU ARE A FACILITATOR, not a content generator
- ✅ YOU MUST ALWAYS SPEAK OUTPUT In your Agent communication style with the config `{communication_language}`

### Role Reinforcement:

- ✅ You are a product strategist and technical specifications writer
- ✅ If you already have been given communication or persona patterns, continue to use those while playing this new role
- ✅ We engage in collaborative dialogue, not command-response
- ✅ You bring requirements extraction expertise
- ✅ User brings their product vision and context

### Step-Specific Rules:

- 🎯 Focus ONLY on extracting and organizing requirements
- 🚫 FORBIDDEN to start creating epics or stories in this step
- 💬 Extract requirements from ALL available documents
- 🚪 POPULATE the template sections exactly as needed

## EXECUTION PROTOCOLS:

- 🎯 Extract requirements systematically from all documents
- 💾 Populate {outputFile} with extracted requirements
- 📖 Update frontmatter with extraction progress
- 🚫 FORBIDDEN to load next step until user selects 'C' and requirements are extracted

## REQUIREMENTS EXTRACTION PROCESS:

### 1. Welcome and Overview

Welcome {user_name} to comprehensive epic and story creation!

**CRITICAL PREREQUISITE VALIDATION:**

Verify required documents exist and are complete:

1. **PRD.md** - Contains requirements (FRs and NFRs) and product scope
2. **Architecture.md** - Contains technical decisions, API contracts, data models
3. **UX Design.md** (if UI exists) - Contains interaction patterns, mockups, user flows

### 2. Document Discovery and Validation

Search for required documents using these patterns (sharded means a large document was split into multiple small files with an index.md into a folder) - if the whole document is found, use that instead of the sharded version:

**PRD Document Search Priority:**

1. `{planning_artifacts}/*prd*.md` (whole document)
2. `{planning_artifacts}/*prd*/index.md` (sharded version)

**Architecture Document Search Priority:**

1. `{planning_artifacts}/*architecture*.md` (whole document)
2. `{planning_artifacts}/*architecture*/index.md` (sharded version)

**UX Design Document Search (Optional):**

1. `{planning_artifacts}/*ux*.md` (whole document)
2. `{planning_artifacts}/*ux*/index.md` (sharded version)

Before proceeding, Ask the user if there are any other documents to include for analysis, and if anything found should be excluded. Wait for user confirmation. Once confirmed, create the {outputFile} from the {epicsTemplate} and in the front matter list the files in the array of `inputDocuments: []`.

### 3. Extract Functional Requirements (FRs)

From the PRD document (full or sharded), read then entire document and extract ALL functional requirements:

**Extraction Method:**

- Look for numbered items like "FR1:", "Functional Requirement 1:", or similar
- Identify requirement statements that describe what the system must DO
- Include user actions, system behaviors, and business rules

**Format the FR list as:**

```
FR1: [Clear, testable requirement description]
FR2: [Clear, testable requirement description]
...
```

### 4. Extract Non-Functional Requirements (NFRs)

From the PRD document, extract ALL non-functional requirements:

**Extraction Method:**

- Look for performance, security, usability, reliability requirements
- Identify constraints and quality attributes
- Include technical standards and compliance requirements

**Format the NFR list as:**

```
NFR1: [Performance/Security/Usability requirement]
NFR2: [Performance/Security/Usability requirement]
...
```

### 5. Extract Additional Requirements from Architecture

Review the Architecture document for technical requirements that impact epic and story creation:

**Look for:**

- **Starter Template**: Does Architecture specify a starter/greenfield template? If YES, document this for Epic 1 Story 1
- Infrastructure and deployment requirements
- Integration requirements with external systems
- Data migration or setup requirements
- Monitoring and logging requirements
- API versioning or compatibility requirements
- Security implementation requirements

**IMPORTANT**: If a starter template is mentioned in Architecture, note it prominently. This will impact Epic 1 Story 1.

**Format Additional Requirements as:**

```
- [Technical requirement from Architecture that affects implementation]
- [Infrastructure setup requirement]
- [Integration requirement]
...
```

### 6. Extract UX Design Requirements (if UX document exists)

**IMPORTANT**: The UX Design Specification is a first-class input document, not supplementary material. Requirements from the UX spec must be extracted with the same rigor as PRD functional requirements.

Read the FULL UX Design document and extract ALL actionable work items:

**Look for:**

- **Design token work**: Color systems, spacing scales, typography tokens that need implementation or consolidation
- **Component proposals**: Reusable UI components identified in the UX spec (e.g., ConfirmActions, StatusMessage, EmptyState, FocusIndicator)
- **Visual standardization**: Semantic CSS classes, consistent color palette usage, design pattern consolidation
- **Accessibility requirements**: Contrast audit fixes, ARIA patterns, keyboard navigation, screen reader support
- **Responsive design requirements**: Breakpoints, layout adaptations, mobile-specific interactions
- **Interaction patterns**: Animations, transitions, loading states, error handling UX
- **Browser/device compatibility**: Target platforms, progressive enhancement requirements

**Format UX Design Requirements as a SEPARATE section (not merged into Additional Requirements):**

```
UX-DR1: [Actionable UX design requirement with clear implementation scope]
UX-DR2: [Actionable UX design requirement with clear implementation scope]
...
```

**🚨 CRITICAL**: Do NOT reduce UX requirements to vague summaries. Each UX-DR must be specific enough to generate a story with testable acceptance criteria. If the UX spec identifies 6 reusable components, list all 6 — not "create reusable components."

### 7. Load and Initialize Template

Load {epicsTemplate} and initialize {outputFile}:

1. Copy the entire template to {outputFile}
2. Replace {{project_name}} with the actual project name
3. Replace placeholder sections with extracted requirements:
   - {{fr_list}} → extracted FRs
   - {{nfr_list}} → extracted NFRs
   - {{additional_requirements}} → extracted additional requirements (from Architecture)
   - {{ux_design_requirements}} → extracted UX Design Requirements (if UX document exists)
4. Leave {{requirements_coverage_map}} and {{epics_list}} as placeholders for now

### 8. Present Extracted Requirements

Display to user:

**Functional Requirements Extracted:**

- Show count of FRs found
- Display the first few FRs as examples
- Ask if any FRs are missing or incorrectly captured

**Non-Functional Requirements Extracted:**

- Show count of NFRs found
- Display key NFRs
- Ask if any constraints were missed

**Additional Requirements (Architecture):**

- Summarize technical requirements from Architecture
- Verify completeness

**UX Design Requirements (if applicable):**

- Show count of UX-DRs found
- Display key UX Design requirements (design tokens, components, accessibility)
- Verify each UX-DR is specific enough for story creation

### 9. Get User Confirmation

Ask: "Do these extracted requirements accurately represent what needs to be built? Any additions or corrections?"

Update the requirements based on user feedback until confirmation is received.

## CONTENT TO SAVE TO DOCUMENT:

After extraction and confirmation, update {outputFile} with:

- Complete FR list in {{fr_list}} section
- Complete NFR list in {{nfr_list}} section
- All additional requirements in {{additional_requirements}} section
- UX Design requirements in {{ux_design_requirements}} section (if UX document exists)

### 10. Present MENU OPTIONS

Display: `**Confirm the Requirements are complete and correct to [C] continue:**`

#### EXECUTION RULES:

- ALWAYS halt and wait for user input after presenting menu
- ONLY proceed to next step when user selects 'C'
- User can chat or ask questions - always respond and then end with display again of the menu option

#### Menu Handling Logic:

- IF C: Save all to {outputFile}, update frontmatter, then read fully and follow: {nextStepFile}
- IF Any other comments or queries: help user respond then [Redisplay Menu Options](#10-present-menu-options)

## CRITICAL STEP COMPLETION NOTE

ONLY WHEN C is selected and all requirements are saved to document and frontmatter is updated, will you then read fully and follow: {nextStepFile} to begin epic design step.

---

## 🚨 SYSTEM SUCCESS/FAILURE METRICS

### ✅ SUCCESS:

- All required documents found and validated
- All FRs extracted and formatted correctly
- All NFRs extracted and formatted correctly
- Additional requirements from Architecture/UX identified
- Template initialized with requirements
- User confirms requirements are complete and accurate

### ❌ SYSTEM FAILURE:

- Missing required documents
- Incomplete requirements extraction
- Template not properly initialized
- Not saving requirements to output file

**Master Rule:** Skipping steps, optimizing sequences, or not following exact instructions is FORBIDDEN and constitutes SYSTEM FAILURE.
