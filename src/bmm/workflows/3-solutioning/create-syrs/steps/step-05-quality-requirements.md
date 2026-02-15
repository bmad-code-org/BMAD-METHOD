---
name: 'step-05-quality-requirements'
description: 'Define performance, usability, and security requirements with measurable targets for SyRS Sections 3.3-3.5'

# Path Definitions
workflow_path: '{project-root}/_bmad/bmm/workflows/3-solutioning/create-syrs'

# File References
thisStepFile: './step-05-quality-requirements.md'
nextStepFile: './step-06-operational-requirements.md'
workflowFile: '{workflow_path}/workflow.md'
outputFile: '{planning_artifacts}/syrs-{{project_name}}.md'

# Task References
advancedElicitationTask: '{project-root}/_bmad/core/workflows/advanced-elicitation/workflow.xml'
partyModeWorkflow: '{project-root}/_bmad/core/workflows/party-mode/workflow.md'
---

# Step 5: Quality & Performance Requirements

## STEP GOAL:

Define performance requirements with measurable targets, usability requirements, and security requirements at the system level. All quality requirements must have quantifiable acceptance criteria. This step populates ISO 29148 Clause 8 Sections 3.3 (Performance), 3.4 (Usability), and 3.5 (Security).

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
- ✅ You bring performance engineering and security requirements expertise
- ✅ User brings business context for quality targets and risk tolerance

### Step-Specific Rules:

- 🎯 Focus ONLY on performance, usability, and security requirements (Sections 3.3-3.5)
- 🚫 FORBIDDEN to write operational or lifecycle requirements in this step
- 💬 Every performance requirement MUST have a measurable target (specific number, not "fast" or "responsive")
- 🚪 Security requirements must be at system level, not implementation level
- 📐 Quality requirements must be verifiable with clear pass/fail criteria

## EXECUTION PROTOCOLS:

- 🎯 Show your analysis before taking any action
- ⚠️ Present A/P/C menu after generating quality requirements content
- 💾 ONLY save when user chooses C (Continue)
- 📖 Update frontmatter `stepsCompleted: [1, 2, 3, 4, 5]` before loading next step
- 🚫 FORBIDDEN to load next step until C is selected

## COLLABORATION MENUS (A/P/C):

This step will generate content and present choices:

- **A (Advanced Elicitation)**: Use discovery protocols to refine performance targets or uncover security concerns
- **P (Party Mode)**: Bring multiple perspectives to evaluate quality requirements from ops, security, and UX angles
- **C (Continue)**: Save the content to the document and proceed to next step

## PROTOCOL INTEGRATION:

- When 'A' selected: Read fully and follow: {advancedElicitationTask}
- When 'P' selected: Read fully and follow: {partyModeWorkflow}
- PROTOCOLS always return to display this step's A/P/C menu after the A or P have completed
- User accepts/rejects protocol changes before proceeding

## CONTEXT BOUNDARIES:

- Current document with Sections 1, 2, 3.1, and 3.2 completed
- Functional and interface requirements inform quality targets
- PRD NFRs are primary source for quality requirements
- Architecture document may specify performance constraints
- Focus on measurable, verifiable quality attributes

## QUALITY REQUIREMENTS ENGINEERING SEQUENCE:

### 1. Extract Quality-Related Requirements from Sources

**From PRD NFRs:**

- Extract all performance-related NFRs
- Extract all usability-related NFRs
- Extract all security-related NFRs
- Note the business context and rationale for each

**From StRS (if available):**

- Extract stakeholder quality expectations
- Note any compliance or regulatory quality requirements
- Identify stakeholder-driven performance thresholds

**From Architecture (if available):**

- Note any performance constraints from architectural decisions
- Identify security architecture patterns that imply requirements
- Extract any capacity planning assumptions

### 2. Performance Requirements (Section 3.3)

Define measurable performance requirements:

**Performance Categories to Address:**

1. **Response Time** - How quickly the system must respond to specific operations
2. **Throughput** - How many operations the system must handle per time unit
3. **Capacity** - Maximum load the system must support (users, data, transactions)
4. **Scalability** - How the system must scale under increasing load
5. **Resource Utilization** - Constraints on CPU, memory, storage, bandwidth
6. **Availability** - Uptime requirements (e.g., 99.9% availability)
7. **Recovery Time** - How quickly the system must recover from failures

For each performance requirement:

```markdown
**SYS-PERF-###:** [Requirement statement with specific measurable target]

| Attribute | Value |
|-----------|-------|
| Priority | [Critical / High / Medium / Low] |
| Source | [PRD NFR ref or StRS ref] |
| V&V Method | [Test / Analysis] |
| Measurement | [How this will be measured, e.g., "p95 latency under load test"] |
| Target | [Specific numeric target, e.g., "< 200ms"] |
| Conditions | [Under what conditions, e.g., "with 1000 concurrent users"] |
```

**CRITICAL RULE:** Every performance requirement MUST have a specific numeric target. Reject vague terms:
- "The system shall respond quickly" - REJECTED
- "The system shall respond to API requests within 200ms at the 95th percentile under a load of 500 concurrent users" - ACCEPTED

### 3. Usability Requirements (Section 3.4)

Define measurable usability requirements:

**Usability Categories to Address:**

1. **Ease of Use** - Task completion metrics
2. **Learnability** - Time to proficiency for new users
3. **Accessibility** - WCAG compliance level and specific accommodations
4. **Error Tolerance** - System behavior when users make mistakes
5. **User Satisfaction** - Measurable satisfaction targets (if applicable)

For each usability requirement:

```markdown
**SYS-USAB-###:** [Requirement statement with measurable criteria]

| Attribute | Value |
|-----------|-------|
| Priority | [Critical / High / Medium / Low] |
| Source | [PRD NFR ref or StRS ref] |
| V&V Method | [Demonstration / Test / Inspection] |
| Measurement | [How this will be verified] |
```

**Consider:**
- Task completion rate targets
- Error rate thresholds
- Accessibility compliance levels (WCAG 2.1 Level A, AA, or AAA)
- Localization and internationalization requirements
- Help and documentation accessibility

### 4. Security Requirements (Section 3.5)

Define system-level security requirements:

**Security Categories to Address:**

1. **Authentication** - How the system verifies user identity
2. **Authorization** - How the system controls access to functions and data
3. **Data Protection** - How the system protects data at rest and in transit
4. **Audit & Logging** - What the system must record for security monitoring
5. **Compliance** - Regulatory security requirements (GDPR, HIPAA, SOC2, etc.)
6. **Vulnerability Management** - How the system must handle security updates
7. **Session Management** - How the system manages user sessions securely

For each security requirement:

```markdown
**SYS-SEC-###:** [Requirement statement at system level]

| Attribute | Value |
|-----------|-------|
| Priority | [Critical / High / Medium / Low] |
| Source | [PRD NFR ref, StRS ref, or Regulatory requirement] |
| V&V Method | [Test / Inspection / Analysis] |
| Standard | [Applicable security standard, e.g., "OWASP Top 10"] |
```

**CRITICAL RULE:** Security requirements must be at the system level, not implementation level:
- "The system shall use bcrypt for password hashing" - IMPLEMENTATION LEVEL (too specific)
- "The system shall store user credentials using a one-way cryptographic hash function that meets NIST SP 800-63B requirements" - SYSTEM LEVEL (correct)

### 5. Cross-Reference Quality with Functional Requirements

Verify that quality requirements align with functional requirements:

- Performance requirements should reference the functions they apply to
- Security requirements should cover all sensitive functions identified in 3.1
- Usability requirements should address user-facing functions

### 6. Generate Quality Requirements Content

Prepare the content to replace the Sections 3.3-3.5 placeholders:

#### Content Structure:

```markdown
### 3.3 Performance Requirements

[Performance requirements with SYS-PERF-### format, each with measurable targets]

### 3.4 Usability Requirements

[Usability requirements with SYS-USAB-### format]

### 3.5 Security Requirements

[Security requirements with SYS-SEC-### format]
```

### 7. Present Content and Menu

Show the generated content and present choices:

"I've defined quality and performance requirements across three areas:

**Quality Requirements Summary:**
- Performance: {{perf_count}} requirements (all with measurable targets)
- Usability: {{usab_count}} requirements
- Security: {{sec_count}} requirements

**Here's what I'll add to the SyRS document (Sections 3.3-3.5):**

[Show the complete markdown content from step 6]

**What would you like to do?**
[A] Advanced Elicitation - Refine performance targets or explore security concerns
[P] Party Mode - Evaluate quality requirements from operations, security, and UX perspectives
[C] Continue - Save these quality requirements and proceed to operational requirements"

### 8. Handle Menu Selection

#### If 'A' (Advanced Elicitation):

- Read fully and follow: {advancedElicitationTask} with the current quality requirements
- Process enhanced insights about performance targets or security concerns
- Ask user: "Accept these enhancements to the quality requirements? (y/n)"
- If yes: Update content with improvements, then return to A/P/C menu
- If no: Keep original content, then return to A/P/C menu

#### If 'P' (Party Mode):

- Read fully and follow: {partyModeWorkflow} with the current quality requirements
- Process collaborative improvements to quality requirements
- Ask user: "Accept these changes to the quality requirements? (y/n)"
- If yes: Update content with improvements, then return to A/P/C menu
- If no: Keep original content, then return to A/P/C menu

#### If 'C' (Continue):

- Write the final content to Sections 3.3-3.5 in `{outputFile}`
- Update frontmatter: `stepsCompleted: [1, 2, 3, 4, 5]`
- Load `{nextStepFile}`

## APPEND TO DOCUMENT:

When user selects 'C', replace the placeholder content in Sections 3.3, 3.4, and 3.5 of the output document with the finalized content.

## SUCCESS METRICS:

✅ All performance requirements have specific measurable targets (no vague language)
✅ Performance requirements include conditions and measurement methods
✅ Usability requirements address accessibility with compliance levels
✅ Security requirements are at system level, not implementation level
✅ Each requirement uses appropriate identifier format (SYS-PERF, SYS-USAB, SYS-SEC)
✅ Each requirement has Enterprise attributes
✅ Quality requirements cross-referenced with functional requirements
✅ A/P/C menu presented and handled correctly
✅ Content properly written to document when C selected

## FAILURE MODES:

❌ Using vague performance targets ("fast", "responsive", "scalable")
❌ Missing measurement methods for performance requirements
❌ Specifying implementation-level security instead of system-level
❌ Not addressing accessibility in usability requirements
❌ Missing Enterprise attributes on any requirement
❌ Not cross-referencing with functional requirements
❌ Not presenting A/P/C menu after content generation

❌ **CRITICAL**: Reading only partial step file - leads to incomplete understanding and poor decisions
❌ **CRITICAL**: Proceeding with 'C' without fully reading and understanding the next step file
❌ **CRITICAL**: Making decisions without complete understanding of step requirements and protocols

## NEXT STEP:

After user selects 'C' and content is saved to document, load `./step-06-operational-requirements.md` to define operational requirements.

Remember: Do NOT proceed to step-06 until user explicitly selects 'C' from the A/P/C menu and content is saved!
