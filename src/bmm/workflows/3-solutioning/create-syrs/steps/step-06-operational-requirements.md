---
name: 'step-06-operational-requirements'
description: 'Define system operations, modes and states, physical characteristics, and environment conditions for SyRS Sections 3.6-3.9'

# Path Definitions
workflow_path: '{project-root}/_bmad/bmm/workflows/3-solutioning/create-syrs'

# File References
thisStepFile: './step-06-operational-requirements.md'
nextStepFile: './step-07-constraints-lifecycle.md'
workflowFile: '{workflow_path}/workflow.md'
outputFile: '{planning_artifacts}/syrs-{{project_name}}.md'

# Task References
advancedElicitationTask: '{project-root}/_bmad/core/workflows/advanced-elicitation/workflow.xml'
partyModeWorkflow: '{project-root}/_bmad/core/workflows/party-mode/workflow.md'
---

# Step 6: Operational Requirements

## STEP GOAL:

Define system operations and maintenance, system modes and states (operational, degraded, maintenance, emergency), physical characteristics (if applicable), and environment conditions. This step populates ISO 29148 Clause 8 Sections 3.6 (System Operations), 3.7 (System Modes and States), 3.8 (Physical Characteristics), and 3.9 (Environment Conditions).

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
- ✅ You bring operational systems engineering and resilience expertise
- ✅ User brings operational context, deployment environment knowledge, and operational procedures

### Step-Specific Rules:

- 🎯 Focus ONLY on operational requirements (Sections 3.6-3.9)
- 🚫 FORBIDDEN to write constraint or lifecycle requirements in this step
- 💬 System modes and states must include transition conditions
- 🚪 Physical characteristics should be marked N/A if truly not applicable (e.g., pure software systems)
- 📐 Operational requirements must be consistent with performance and security from previous step

## EXECUTION PROTOCOLS:

- 🎯 Show your analysis before taking any action
- ⚠️ Present A/P/C menu after generating operational requirements content
- 💾 ONLY save when user chooses C (Continue)
- 📖 Update frontmatter `stepsCompleted: [1, 2, 3, 4, 5, 6]` before loading next step
- 🚫 FORBIDDEN to load next step until C is selected

## COLLABORATION MENUS (A/P/C):

This step will generate content and present choices:

- **A (Advanced Elicitation)**: Use discovery protocols to explore edge cases in system operations and failure scenarios
- **P (Party Mode)**: Bring multiple perspectives to evaluate operational completeness (ops, SRE, infrastructure)
- **C (Continue)**: Save the content to the document and proceed to next step

## PROTOCOL INTEGRATION:

- When 'A' selected: Read fully and follow: {advancedElicitationTask}
- When 'P' selected: Read fully and follow: {partyModeWorkflow}
- PROTOCOLS always return to display this step's A/P/C menu after the A or P have completed
- User accepts/rejects protocol changes before proceeding

## CONTEXT BOUNDARIES:

- Current document with Sections 1, 2, 3.1-3.5 completed
- Performance and security requirements inform operational needs
- Architecture document may define deployment and operational patterns
- Focus on how the system operates, not what it does functionally

## OPERATIONAL REQUIREMENTS ENGINEERING SEQUENCE:

### 1. System Operations (Section 3.6)

Define how the system is operated and maintained:

**Operations Categories to Address:**

1. **System Startup** - How the system is brought online
2. **System Shutdown** - How the system is gracefully stopped
3. **Backup and Recovery** - Data backup requirements and recovery procedures
4. **Monitoring** - What the system must expose for monitoring
5. **Alerting** - What conditions trigger alerts and to whom
6. **Maintenance Windows** - Requirements for planned maintenance
7. **Data Management** - Routine data operations (archival, cleanup, migration)

For each operational requirement:

```markdown
**SYS-OPS-###:** [Requirement statement about system operation]

| Attribute | Value |
|-----------|-------|
| Priority | [Critical / High / Medium / Low] |
| Source | [PRD NFR ref, StRS ref, or Operational need] |
| V&V Method | [Demonstration / Test / Inspection] |
```

**Consider:**
- Who operates the system (operations team, automated systems, end users)?
- What operational procedures are required?
- What level of operational expertise is assumed?
- What operational documentation must the system support?

### 2. System Modes and States (Section 3.7)

Define the system's operational modes and state transitions:

**Standard Modes to Consider:**

1. **Operational Mode** - Normal full-functionality operation
2. **Degraded Mode** - Reduced functionality when components fail
3. **Maintenance Mode** - System available for maintenance activities only
4. **Emergency Mode** - Critical situation handling
5. **Initialization Mode** - System startup/bootstrapping
6. **Shutdown Mode** - Graceful termination
7. **Standby Mode** - System ready but not actively processing (if applicable)

For each mode:

```markdown
**SYS-MODE-###:** [Requirement statement about system mode]

| Attribute | Value |
|-----------|-------|
| Priority | [Critical / High / Medium / Low] |
| Source | [PRD NFR ref, StRS ref, or Operational need] |
| V&V Method | [Demonstration / Test] |
| Mode | [Mode name] |
| Available Functions | [What functions are available in this mode] |
| Restricted Functions | [What functions are restricted in this mode] |
```

**State Transition Requirements:**

Define the conditions under which the system transitions between modes:

```markdown
**State Transition Table:**

| From State | To State | Trigger Condition | Actions Required |
|------------|----------|-------------------|------------------|
| Operational | Degraded | [condition] | [actions] |
| Degraded | Operational | [condition] | [actions] |
| Operational | Maintenance | [condition] | [actions] |
| Maintenance | Operational | [condition] | [actions] |
| Any | Emergency | [condition] | [actions] |
| Emergency | Operational | [condition] | [actions] |
```

### 3. Physical Characteristics (Section 3.8)

Define physical requirements of the system:

**For software-only systems:**
"This system is a software system with no dedicated physical hardware requirements. Physical characteristics are governed by the deployment environment specified in Section 3.9."

**For systems with physical components:**

```markdown
**SYS-PHYS-###:** [Requirement statement about physical characteristic]

| Attribute | Value |
|-----------|-------|
| Priority | [Critical / High / Medium / Low] |
| Source | [StRS ref or Operational need] |
| V&V Method | [Inspection / Test] |
```

**Consider:**
- Size and weight constraints
- Power requirements
- Heat dissipation requirements
- Physical security requirements (locks, enclosures)
- Portability requirements
- Hardware component specifications

### 4. Environment Conditions (Section 3.9)

Define the environment in which the system must operate:

**Environment Categories:**

1. **Deployment Environment** - Where the system runs (cloud, on-premise, hybrid, edge)
2. **Operating System Requirements** - Supported OS versions
3. **Runtime Environment** - Required runtime dependencies
4. **Network Environment** - Network conditions the system must handle
5. **Geographic Distribution** - Multi-region or single-region deployment
6. **Regulatory Environment** - Data residency or jurisdictional requirements

For each environment requirement:

```markdown
**SYS-ENV-###:** [Requirement statement about environment condition]

| Attribute | Value |
|-----------|-------|
| Priority | [Critical / High / Medium / Low] |
| Source | [StRS ref, Architecture ref, or Operational need] |
| V&V Method | [Inspection / Analysis / Demonstration] |
```

**Consider:**
- Cloud provider requirements or constraints
- Container/orchestration requirements (Kubernetes, Docker)
- Network latency and bandwidth constraints
- Browser/client environment requirements
- Temperature, humidity, vibration (for physical deployments)

### 5. Consistency Check

Verify operational requirements are consistent with:

- Performance requirements from Section 3.3 (e.g., availability targets match mode definitions)
- Security requirements from Section 3.5 (e.g., maintenance mode security)
- Functional requirements from Section 3.1 (e.g., functions available per mode)

### 6. Generate Operational Requirements Content

Prepare the content to replace the Sections 3.6-3.9 placeholders:

#### Content Structure:

```markdown
### 3.6 System Operations

[Operational requirements with SYS-OPS-### format]

### 3.7 System Modes and States

[Mode requirements with SYS-MODE-### format]

[State Transition Table]

### 3.8 Physical Characteristics

[Physical requirements with SYS-PHYS-### format, or N/A statement for software systems]

### 3.9 Environment Conditions

[Environment requirements with SYS-ENV-### format]
```

### 7. Present Content and Menu

Show the generated content and present choices:

"I've defined operational requirements covering system operations, modes, physical characteristics, and environment.

**Operational Requirements Summary:**
- System Operations: {{ops_count}} requirements
- System Modes: {{mode_count}} modes defined with state transition table
- Physical Characteristics: {{phys_count}} requirements (or N/A)
- Environment Conditions: {{env_count}} requirements

**Here's what I'll add to the SyRS document (Sections 3.6-3.9):**

[Show the complete markdown content from step 6]

**What would you like to do?**
[A] Advanced Elicitation - Explore edge cases in operations and failure scenarios
[P] Party Mode - Evaluate from operations, SRE, and infrastructure perspectives
[C] Continue - Save these operational requirements and proceed to constraints and lifecycle"

### 8. Handle Menu Selection

#### If 'A' (Advanced Elicitation):

- Read fully and follow: {advancedElicitationTask} with the current operational requirements
- Process enhanced insights about operational edge cases
- Ask user: "Accept these enhancements to the operational requirements? (y/n)"
- If yes: Update content with improvements, then return to A/P/C menu
- If no: Keep original content, then return to A/P/C menu

#### If 'P' (Party Mode):

- Read fully and follow: {partyModeWorkflow} with the current operational requirements
- Process collaborative improvements to operational coverage
- Ask user: "Accept these changes to the operational requirements? (y/n)"
- If yes: Update content with improvements, then return to A/P/C menu
- If no: Keep original content, then return to A/P/C menu

#### If 'C' (Continue):

- Write the final content to Sections 3.6-3.9 in `{outputFile}`
- Update frontmatter: `stepsCompleted: [1, 2, 3, 4, 5, 6]`
- Load `{nextStepFile}`

## APPEND TO DOCUMENT:

When user selects 'C', replace the placeholder content in Sections 3.6, 3.7, 3.8, and 3.9 of the output document with the finalized content.

## SUCCESS METRICS:

✅ System operations cover startup, shutdown, backup, monitoring, and maintenance
✅ System modes defined with clear available/restricted functions per mode
✅ State transition table complete with trigger conditions and actions
✅ Physical characteristics addressed (requirements or explicit N/A)
✅ Environment conditions cover deployment, runtime, and network requirements
✅ Each requirement uses appropriate identifier format (SYS-OPS, SYS-MODE, SYS-PHYS, SYS-ENV)
✅ Each requirement has Enterprise attributes
✅ Consistency with performance and security requirements verified
✅ A/P/C menu presented and handled correctly
✅ Content properly written to document when C selected

## FAILURE MODES:

❌ Not defining system modes and state transitions
❌ Missing degraded mode definition (critical for resilience)
❌ Not addressing physical characteristics (even to say N/A)
❌ Vague environment conditions without specific targets
❌ Operational requirements inconsistent with performance targets
❌ Missing Enterprise attributes on any requirement
❌ Not presenting A/P/C menu after content generation

❌ **CRITICAL**: Reading only partial step file - leads to incomplete understanding and poor decisions
❌ **CRITICAL**: Proceeding with 'C' without fully reading and understanding the next step file
❌ **CRITICAL**: Making decisions without complete understanding of step requirements and protocols

## NEXT STEP:

After user selects 'C' and content is saved to document, load `./step-07-constraints-lifecycle.md` to define constraints and lifecycle requirements.

Remember: Do NOT proceed to step-07 until user explicitly selects 'C' from the A/P/C menu and content is saved!
