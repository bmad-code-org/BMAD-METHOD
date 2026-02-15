---
name: 'step-04-interface-requirements'
description: 'Define system interface requirements (user, hardware, software, communication) for SyRS Section 3.2'

# Path Definitions
workflow_path: '{project-root}/_bmad/bmm/workflows/3-solutioning/create-syrs'

# File References
thisStepFile: './step-04-interface-requirements.md'
nextStepFile: './step-05-quality-requirements.md'
workflowFile: '{workflow_path}/workflow.md'
outputFile: '{planning_artifacts}/syrs-{{project_name}}.md'

# Task References
advancedElicitationTask: '{project-root}/_bmad/core/workflows/advanced-elicitation/workflow.xml'
partyModeWorkflow: '{project-root}/_bmad/core/workflows/party-mode/workflow.md'
---

# Step 4: System Interface Requirements

## STEP GOAL:

Define all system interface requirements covering user interfaces, hardware interfaces, software interfaces, and communication interfaces. These are more technically focused than PRD interfaces - centered on system integration and interoperability. This step populates ISO 29148 Clause 8 Section 3.2 (System Interfaces).

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
- ✅ You bring system integration and interface engineering expertise
- ✅ User brings knowledge of external systems and integration needs

### Step-Specific Rules:

- 🎯 Focus ONLY on interface requirements (Section 3.2)
- 🚫 FORBIDDEN to write performance, security, or operational requirements in this step
- 💬 Define interfaces at the SYSTEM integration level, not product feature level
- 🚪 Reference the system context and external entities from Section 1.3.1
- 📐 Each interface requirement must specify protocols, data formats, and standards where applicable

## EXECUTION PROTOCOLS:

- 🎯 Show your analysis before taking any action
- ⚠️ Present A/P/C menu after generating interface requirements content
- 💾 ONLY save when user chooses C (Continue)
- 📖 Update frontmatter `stepsCompleted: [1, 2, 3, 4]` before loading next step
- 🚫 FORBIDDEN to load next step until C is selected

## COLLABORATION MENUS (A/P/C):

This step will generate content and present choices:

- **A (Advanced Elicitation)**: Use discovery protocols to uncover hidden interface requirements or integration complexities
- **P (Party Mode)**: Bring multiple perspectives to evaluate interface completeness (security, ops, dev)
- **C (Continue)**: Save the content to the document and proceed to next step

## PROTOCOL INTEGRATION:

- When 'A' selected: Read fully and follow: {advancedElicitationTask}
- When 'P' selected: Read fully and follow: {partyModeWorkflow}
- PROTOCOLS always return to display this step's A/P/C menu after the A or P have completed
- User accepts/rejects protocol changes before proceeding

## CONTEXT BOUNDARIES:

- Current document with Sections 1, 2, and 3.1 completed
- System context and external entities defined in Section 1.3.1
- Functional requirements from Section 3.1 inform interface needs
- Architecture document (if loaded) provides technical interface details
- Focus on system-to-system and system-to-user integration points

## INTERFACE REQUIREMENTS ENGINEERING SEQUENCE:

### 1. Identify Interface Points

Using the system context from Section 1.3.1 and the functional requirements from Section 3.1, identify all interface points:

**Interface Discovery Sources:**

- External entities identified in system context diagram/description
- System functions that require external communication
- Architecture document interface decisions (if available)
- PRD interface requirements (if any)
- StRS interface expectations (if available)

Present to user:
"Based on the system context and functional requirements, I've identified the following interface categories. Let me walk through each one."

### 2. User Interfaces (Section 3.2.1)

Define system-level user interface requirements:

**NOTE:** These are NOT UI design requirements (that's UX). These are system requirements about HOW the system presents information to and accepts input from users.

For each user interface requirement:

```markdown
**SYS-IF-###:** [Requirement statement about user interface capability]

| Attribute | Value |
|-----------|-------|
| Priority | [Critical / High / Medium / Low] |
| Source | [PRD FR ref or StRS ref] |
| V&V Method | [Inspection / Analysis / Demonstration / Test] |
| Interface Type | User Interface |
| Standards | [Applicable standards, e.g., WCAG 2.1 AA] |
```

**Consider:**
- Input methods and modalities the system must support
- Output formats and presentation methods the system must provide
- Accessibility requirements at system level
- Localization/internationalization requirements
- Error communication mechanisms

### 3. Hardware Interfaces (Section 3.2.2)

Define system-level hardware interface requirements:

For each hardware interface requirement:

```markdown
**SYS-IF-###:** [Requirement statement about hardware interface]

| Attribute | Value |
|-----------|-------|
| Priority | [Critical / High / Medium / Low] |
| Source | [PRD FR ref or StRS ref] |
| V&V Method | [Inspection / Analysis / Demonstration / Test] |
| Interface Type | Hardware Interface |
| Protocol | [Applicable protocol or standard] |
```

**Consider:**
- Physical device connections
- Sensor interfaces
- Display or output device requirements
- Storage device interfaces
- Network hardware requirements
- If not applicable, explicitly state: "No hardware interface requirements identified for this system."

### 4. Software Interfaces (Section 3.2.3)

Define system-level software interface requirements:

For each software interface requirement:

```markdown
**SYS-IF-###:** [Requirement statement about software interface]

| Attribute | Value |
|-----------|-------|
| Priority | [Critical / High / Medium / Low] |
| Source | [PRD FR ref or StRS ref] |
| V&V Method | [Inspection / Analysis / Demonstration / Test] |
| Interface Type | Software Interface |
| Protocol | [API protocol, e.g., REST, GraphQL, gRPC] |
| Data Format | [e.g., JSON, XML, Protocol Buffers] |
| External System | [Name of external system or service] |
```

**Consider:**
- Third-party API integrations
- Database interfaces
- Operating system interfaces
- Authentication/authorization service interfaces (OAuth, SAML, etc.)
- Cloud service interfaces (storage, compute, messaging)
- Monitoring and logging system interfaces
- CI/CD pipeline interfaces

### 5. Communication Interfaces (Section 3.2.4)

Define system-level communication interface requirements:

For each communication interface requirement:

```markdown
**SYS-IF-###:** [Requirement statement about communication interface]

| Attribute | Value |
|-----------|-------|
| Priority | [Critical / High / Medium / Low] |
| Source | [PRD FR ref or StRS ref] |
| V&V Method | [Inspection / Analysis / Demonstration / Test] |
| Interface Type | Communication Interface |
| Protocol | [e.g., HTTPS, WebSocket, MQTT, AMQP] |
| Standard | [Applicable communication standard] |
```

**Consider:**
- Network protocols required
- Real-time communication requirements
- Message queue/event bus interfaces
- Email/notification interfaces
- File transfer protocols
- Encryption and secure communication requirements

### 6. Interface Consistency Check

Verify interface requirements are consistent with:

- Functional requirements in Section 3.1 (every function that communicates externally has an interface requirement)
- System context entities from Section 1.3.1 (every external entity has interface requirements)
- Architecture document interface decisions (if available)

Present summary:
```
**Interface Requirements Summary:**
- User Interfaces: {{count}} requirements
- Hardware Interfaces: {{count}} requirements (or N/A)
- Software Interfaces: {{count}} requirements
- Communication Interfaces: {{count}} requirements
- Total: {{total_count}} interface requirements

**Coverage Check:**
- External entities with interface requirements: {{covered}}/{{total_entities}}
- Uncovered entities: {{list or "None"}}
```

### 7. Generate Interface Requirements Content

Prepare the content to replace the Section 3.2 placeholders:

#### Content Structure:

```markdown
### 3.2 System Interfaces

#### 3.2.1 User Interfaces

[User interface requirements with SYS-IF-### format and attribute tables]

#### 3.2.2 Hardware Interfaces

[Hardware interface requirements or "No hardware interface requirements identified for this system."]

#### 3.2.3 Software Interfaces

[Software interface requirements with protocols and data formats]

#### 3.2.4 Communication Interfaces

[Communication interface requirements with protocols and standards]
```

### 8. Present Content and Menu

Show the generated content and present choices:

"I've defined {{total_if_count}} system interface requirements covering all identified integration points.

**Interface Summary:**
- User Interfaces: {{ui_count}} requirements
- Hardware Interfaces: {{hw_count}} requirements
- Software Interfaces: {{sw_count}} requirements
- Communication Interfaces: {{comm_count}} requirements

**Here's what I'll add to the SyRS document (Section 3.2):**

[Show the complete markdown content from step 7]

**What would you like to do?**
[A] Advanced Elicitation - Explore hidden interface complexities or integration challenges
[P] Party Mode - Evaluate interfaces from security, operations, and development perspectives
[C] Continue - Save these interface requirements and proceed to quality requirements"

### 9. Handle Menu Selection

#### If 'A' (Advanced Elicitation):

- Read fully and follow: {advancedElicitationTask} with the current interface requirements
- Process enhanced insights about interface complexities
- Ask user: "Accept these enhancements to the interface requirements? (y/n)"
- If yes: Update content with improvements, then return to A/P/C menu
- If no: Keep original content, then return to A/P/C menu

#### If 'P' (Party Mode):

- Read fully and follow: {partyModeWorkflow} with the current interface requirements
- Process collaborative improvements to interface coverage
- Ask user: "Accept these changes to the interface requirements? (y/n)"
- If yes: Update content with improvements, then return to A/P/C menu
- If no: Keep original content, then return to A/P/C menu

#### If 'C' (Continue):

- Write the final content to Section 3.2 in `{outputFile}`
- Update frontmatter: `stepsCompleted: [1, 2, 3, 4]`
- Load `{nextStepFile}`

## APPEND TO DOCUMENT:

When user selects 'C', replace the interface placeholder sections (3.2.1 through 3.2.4) in the output document with the finalized content.

## SUCCESS METRICS:

✅ All external entities from system context have interface requirements
✅ Interface requirements organized by type (user, hardware, software, communication)
✅ Each requirement uses SYS-IF-### identifier format
✅ Each requirement has Enterprise attributes (priority, source, V&V method)
✅ Protocols and data formats specified for software/communication interfaces
✅ Standards referenced where applicable
✅ Consistency with functional requirements verified
✅ A/P/C menu presented and handled correctly
✅ Content properly written to document when C selected

## FAILURE MODES:

❌ Confusing UI design requirements with system-level user interface requirements
❌ Missing interfaces for external entities identified in system context
❌ Not specifying protocols and data formats
❌ Missing Enterprise attributes on any requirement
❌ Not checking consistency with functional requirements
❌ Not presenting A/P/C menu after content generation

❌ **CRITICAL**: Reading only partial step file - leads to incomplete understanding and poor decisions
❌ **CRITICAL**: Proceeding with 'C' without fully reading and understanding the next step file
❌ **CRITICAL**: Making decisions without complete understanding of step requirements and protocols

## NEXT STEP:

After user selects 'C' and content is saved to document, load `./step-05-quality-requirements.md` to define quality and performance requirements.

Remember: Do NOT proceed to step-05 until user explicitly selects 'C' from the A/P/C menu and content is saved!
