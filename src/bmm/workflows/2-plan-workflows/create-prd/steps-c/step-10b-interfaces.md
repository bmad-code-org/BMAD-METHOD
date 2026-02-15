---
name: 'step-10b-interfaces'
description: 'Define external interface requirements (user, hardware, software, communication) - ISO 29148 Clause 9.3.1'

# File References
nextStepFile: './step-10c-constraints.md'
outputFile: '{planning_artifacts}/prd.md'

# Task References
advancedElicitationTask: '{project-root}/_bmad/core/workflows/advanced-elicitation/workflow.xml'
partyModeWorkflow: '{project-root}/_bmad/core/workflows/party-mode/workflow.md'
---

# Step 10b: External Interface Requirements

**Progress: Step 10b** - Next: Design Constraints

## MANDATORY EXECUTION RULES (READ FIRST):

- 🛑 NEVER generate content without user input
- 📖 CRITICAL: ALWAYS read the complete step file before taking any action
- 🔄 CRITICAL: When loading next step with 'C', ensure the entire file is read
- ✅ ALWAYS treat this as collaborative discovery between PM peers
- 📋 YOU ARE A FACILITATOR, not a content generator
- 💬 FOCUS on external interfaces the system must support
- 🎯 This step is REQUIRED for Enterprise track, OPTIONAL for BMad Method track
- ✅ YOU MUST ALWAYS SPEAK OUTPUT In your Agent communication style with the config `{communication_language}`

## TRACK-AWARE EXECUTION:

**Check the document frontmatter for `track` value:**
- If `track: 'enterprise'` → This step is MANDATORY, explore all interface categories
- If `track: 'bmad'` or not set → This step is OPTIONAL, ask user if they want to define interfaces
- If user on non-Enterprise track declines → Skip to {nextStepFile} immediately

## EXECUTION PROTOCOLS:

- 🎯 Show your analysis before taking any action
- ⚠️ Present A/P/C menu after generating interface content
- 💾 ONLY save when user chooses C (Continue)
- 📖 Update output file frontmatter, adding this step name to the end of the list of stepsCompleted
- 🚫 FORBIDDEN to load next step until C is selected

## CONTEXT BOUNDARIES:

- Functional and non-functional requirements from previous steps inform interface needs
- Architecture document (if loaded) informs technical interfaces
- Focus on EXTERNAL interfaces (what the system connects to), not internal design
- ISO 29148 Clause 9 Section 3.1: External Interface Requirements

## INTERFACE REQUIREMENTS SEQUENCE:

### 1. Explain Interface Requirements Purpose

**Purpose:**
External interface requirements define how the system interacts with the outside world - users, hardware, other software systems, and communication networks. Clear interface definitions prevent integration failures and misunderstandings.

**Interface Categories (ISO 29148):**
- User Interfaces
- Hardware Interfaces
- Software Interfaces
- Communication Interfaces

### 2. User Interface Requirements

Explore user-facing interface needs:

**Key Questions:**
- "What types of user interfaces are needed (web, mobile, CLI, API)?"
- "Are there specific UI framework or design system requirements?"
- "What screen sizes and devices must be supported?"
- "Are there specific input/output formats users expect?"
- "What accessibility interface requirements exist?"

### 3. Hardware Interface Requirements

Explore hardware interaction needs:

**Key Questions:**
- "Does the system interact with any hardware devices (sensors, printers, scanners)?"
- "What server or hosting hardware requirements exist?"
- "Are there specific hardware compatibility requirements?"
- "Does the system need to support specific hardware protocols?"

Note: For many software-only projects, this section may be minimal or N/A.

### 4. Software Interface Requirements

Explore software integration needs:

**Key Questions:**
- "What external APIs or services must the system integrate with?"
- "What databases or data stores are required?"
- "What operating system compatibility is needed?"
- "Are there specific library, framework, or SDK dependencies?"
- "What authentication/authorization systems must be integrated?"
- "Are there message queue or event streaming requirements?"

### 5. Communication Interface Requirements

Explore network and communication needs:

**Key Questions:**
- "What network protocols are required (HTTP/HTTPS, WebSocket, gRPC)?"
- "Are there specific bandwidth or latency requirements for communication?"
- "What data exchange formats are required (JSON, XML, Protocol Buffers)?"
- "Are there encryption or secure communication requirements?"
- "Are there email, SMS, or push notification requirements?"

### 6. Generate Interface Content

Prepare the content to append to the document:

#### Content Structure:

```markdown
## External Interface Requirements

### User Interfaces

[User interface requirements - platforms, frameworks, accessibility, responsive design]

### Hardware Interfaces

[Hardware interface requirements - devices, protocols, compatibility. "N/A" if software-only]

### Software Interfaces

[Software interface requirements - APIs, databases, OS, libraries, integrations]

### Communication Interfaces

[Communication interface requirements - protocols, data formats, encryption, notifications]
```

### 7. Present MENU OPTIONS

Present the interface requirements for review, then display menu.

Display: "**Select:** [A] Advanced Elicitation [P] Party Mode [C] Continue to Design Constraints (Step 10c)"

#### Menu Handling Logic:
- IF A: Read fully and follow: {advancedElicitationTask}, process enhanced insights, ask user acceptance, update or keep, redisplay
- IF P: Read fully and follow: {partyModeWorkflow}, process collaborative validation, ask user acceptance, update or keep, redisplay
- IF C: Append the final content to {outputFile}, update frontmatter by adding this step name to the end of the stepsCompleted array, then read fully and follow: {nextStepFile}
- IF Any other: help user respond, then redisplay menu

## APPEND TO DOCUMENT:

When user selects 'C', append the content directly to the document using the structure from step 6.

## SUCCESS METRICS:

✅ All four interface categories explored
✅ Software interfaces clearly define external integration points
✅ Communication protocols and data formats specified
✅ Track-appropriate depth (Enterprise=comprehensive, BMad=optional)
✅ ISO 29148 Clause 9 Section 3.1 requirements addressed

## FAILURE MODES:

❌ Skipping software interface definition for a system with integrations
❌ Not identifying communication protocols
❌ Confusing external interfaces with internal system design
❌ Not respecting track configuration (forcing Enterprise on BMad track)

## NEXT STEP:

After user selects 'C' and content is saved, load {nextStepFile} to define design constraints.
