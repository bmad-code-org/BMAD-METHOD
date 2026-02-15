---
name: 'step-07-constraints-lifecycle'
description: 'Define design constraints, information management, policy and regulation, and lifecycle sustainability for SyRS Sections 3.10-3.13'

# Path Definitions
workflow_path: '{project-root}/_bmad/bmm/workflows/3-solutioning/create-syrs'

# File References
thisStepFile: './step-07-constraints-lifecycle.md'
nextStepFile: './step-08-verification-plan.md'
workflowFile: '{workflow_path}/workflow.md'
outputFile: '{planning_artifacts}/syrs-{{project_name}}.md'

# Task References
advancedElicitationTask: '{project-root}/_bmad/core/workflows/advanced-elicitation/workflow.xml'
partyModeWorkflow: '{project-root}/_bmad/core/workflows/party-mode/workflow.md'
---

# Step 7: Constraints & Lifecycle

## STEP GOAL:

Define design constraints at the system level, information management requirements, policy and regulation requirements, and lifecycle sustainability (maintenance, evolution, decommission). This step populates ISO 29148 Clause 8 Sections 3.10 (Information Management), 3.11 (Policies and Regulations), 3.12 (System Lifecycle Sustainability), and 3.13 (Design Constraints).

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
- ✅ You bring systems lifecycle engineering and governance expertise
- ✅ User brings organizational context, regulatory knowledge, and long-term vision

### Step-Specific Rules:

- 🎯 Focus ONLY on constraints and lifecycle requirements (Sections 3.10-3.13)
- 🚫 FORBIDDEN to write verification or traceability content in this step
- 💬 Lifecycle sustainability must address the entire system lifespan - not just initial development
- 🚪 Design constraints must not duplicate architectural decisions but complement them
- 📐 Policy requirements must reference specific regulations or standards

## EXECUTION PROTOCOLS:

- 🎯 Show your analysis before taking any action
- ⚠️ Present A/P/C menu after generating constraints and lifecycle content
- 💾 ONLY save when user chooses C (Continue)
- 📖 Update frontmatter `stepsCompleted: [1, 2, 3, 4, 5, 6, 7]` before loading next step
- 🚫 FORBIDDEN to load next step until C is selected

## COLLABORATION MENUS (A/P/C):

This step will generate content and present choices:

- **A (Advanced Elicitation)**: Use discovery protocols to explore regulatory landscape or lifecycle implications
- **P (Party Mode)**: Bring multiple perspectives to evaluate constraints from governance, legal, and engineering angles
- **C (Continue)**: Save the content to the document and proceed to next step

## PROTOCOL INTEGRATION:

- When 'A' selected: Read fully and follow: {advancedElicitationTask}
- When 'P' selected: Read fully and follow: {partyModeWorkflow}
- PROTOCOLS always return to display this step's A/P/C menu after the A or P have completed
- User accepts/rejects protocol changes before proceeding

## CONTEXT BOUNDARIES:

- Current document with Sections 1, 2, 3.1-3.9 completed
- All previous requirements inform constraint and lifecycle decisions
- Architecture document may define technology constraints
- StRS may specify organizational and regulatory constraints
- Focus on long-term system viability and governance

## CONSTRAINTS AND LIFECYCLE ENGINEERING SEQUENCE:

### 1. Information Management (Section 3.10)

Define how the system manages information throughout its lifecycle:

**Information Management Categories:**

1. **Data Retention** - How long different data types must be retained
2. **Data Archival** - Requirements for moving data to long-term storage
3. **Data Disposal** - Requirements for secure data deletion/destruction
4. **Data Classification** - Categories of data sensitivity and handling rules
5. **Data Integrity** - Requirements for ensuring data accuracy and consistency
6. **Data Migration** - Requirements for moving data between system versions
7. **Backup and Restoration** - Data backup frequency and restoration requirements

For each information management requirement:

```markdown
**SYS-INFO-###:** [Requirement statement about information management]

| Attribute | Value |
|-----------|-------|
| Priority | [Critical / High / Medium / Low] |
| Source | [StRS ref, Regulatory ref, or Business need] |
| V&V Method | [Inspection / Analysis / Demonstration / Test] |
```

### 2. Policies and Regulations (Section 3.11)

Define policy and regulatory requirements the system must comply with:

**Policy Categories to Address:**

1. **Data Privacy Regulations** - GDPR, CCPA, LGPD, PIPEDA, etc.
2. **Industry Regulations** - HIPAA, PCI-DSS, SOX, etc. as applicable
3. **Accessibility Standards** - ADA, Section 508, EN 301 549, etc.
4. **Organizational Policies** - Internal security, data handling, development policies
5. **Export Control** - If applicable, ITAR, EAR, etc.
6. **Licensing** - Open source licensing compliance requirements

For each policy/regulation requirement:

```markdown
**SYS-POL-###:** [Requirement statement about policy or regulation compliance]

| Attribute | Value |
|-----------|-------|
| Priority | [Critical / High / Medium / Low] |
| Source | [Specific regulation, e.g., "GDPR Article 17"] |
| V&V Method | [Inspection / Analysis / Audit] |
| Regulation | [Full regulation name and version] |
```

**NOTE:** If no specific regulations apply, explicitly state: "No specific regulatory requirements have been identified for this system. The following organizational policies apply: [list or 'None identified']."

### 3. System Lifecycle Sustainability (Section 3.12)

Define requirements for the system's long-term viability:

**Lifecycle Categories:**

1. **Maintenance** - How the system must support ongoing maintenance
   - Corrective maintenance (bug fixing)
   - Adaptive maintenance (environment changes)
   - Perfective maintenance (enhancements)
   - Preventive maintenance (technical debt reduction)

2. **Evolution** - How the system must support planned growth
   - Extensibility requirements
   - Modularity requirements
   - API versioning requirements
   - Feature toggling capabilities

3. **Decommission** - How the system must support end-of-life
   - Data export requirements
   - Migration path requirements
   - Graceful degradation during sunset period
   - Data preservation obligations

For each lifecycle requirement:

```markdown
**SYS-LIFE-###:** [Requirement statement about lifecycle sustainability]

| Attribute | Value |
|-----------|-------|
| Priority | [Critical / High / Medium / Low] |
| Source | [StRS ref, Organizational policy, or Engineering best practice] |
| V&V Method | [Inspection / Analysis / Demonstration] |
| Lifecycle Phase | [Maintenance / Evolution / Decommission] |
```

### 4. Design Constraints (Section 3.13)

Define constraints that limit the design solution space:

**Constraint Categories:**

1. **Technology Constraints** - Required or prohibited technologies
2. **Standards Compliance** - Required technical standards (coding standards, API standards)
3. **Organizational Constraints** - Imposed by the organization (approved vendors, platforms)
4. **Interoperability Constraints** - Must work with specific existing systems
5. **Resource Constraints** - Budget, timeline, team size limitations on design
6. **Legacy Constraints** - Requirements to maintain backward compatibility

For each design constraint:

```markdown
**SYS-CON-###:** [Constraint statement]

| Attribute | Value |
|-----------|-------|
| Priority | [Critical / High / Medium / Low] |
| Source | [Architecture ref, StRS ref, or Organizational policy] |
| V&V Method | [Inspection / Analysis] |
| Constraint Type | [Technology / Standard / Organizational / Interoperability / Resource / Legacy] |
```

**NOTE:** Design constraints should complement, not duplicate, architectural decisions. If the Architecture document specifies technology choices, reference them here as constraints on the system design rather than restating them.

### 5. Cross-Reference Check

Verify constraints and lifecycle requirements are consistent with:

- Security requirements from Section 3.5 (data handling, compliance)
- Operational requirements from Sections 3.6-3.9 (maintenance, environment)
- Interface requirements from Section 3.2 (interoperability constraints)
- Architecture document decisions (if available)

### 6. Generate Constraints and Lifecycle Content

Prepare the content to replace the Sections 3.10-3.13 placeholders:

#### Content Structure:

```markdown
### 3.10 Information Management

[Information management requirements with SYS-INFO-### format]

### 3.11 Policies and Regulations

[Policy and regulation requirements with SYS-POL-### format]

### 3.12 System Lifecycle Sustainability

#### 3.12.1 Maintenance Requirements
[Maintenance requirements with SYS-LIFE-### format]

#### 3.12.2 Evolution Requirements
[Evolution requirements with SYS-LIFE-### format]

#### 3.12.3 Decommission Requirements
[Decommission requirements with SYS-LIFE-### format]

### 3.13 Design Constraints

[Design constraint requirements with SYS-CON-### format]
```

### 7. Present Content and Menu

Show the generated content and present choices:

"I've defined constraints and lifecycle requirements covering information management, policies, sustainability, and design constraints.

**Constraints & Lifecycle Summary:**
- Information Management: {{info_count}} requirements
- Policies and Regulations: {{pol_count}} requirements
- Lifecycle Sustainability: {{life_count}} requirements (maintenance: {{m}}, evolution: {{e}}, decommission: {{d}})
- Design Constraints: {{con_count}} constraints

**Here's what I'll add to the SyRS document (Sections 3.10-3.13):**

[Show the complete markdown content from step 6]

**What would you like to do?**
[A] Advanced Elicitation - Explore regulatory landscape or lifecycle implications in depth
[P] Party Mode - Evaluate constraints from governance, legal, and engineering perspectives
[C] Continue - Save these requirements and proceed to verification planning"

### 8. Handle Menu Selection

#### If 'A' (Advanced Elicitation):

- Read fully and follow: {advancedElicitationTask} with the current constraints and lifecycle requirements
- Process enhanced insights about regulatory or lifecycle concerns
- Ask user: "Accept these enhancements to the constraints and lifecycle requirements? (y/n)"
- If yes: Update content with improvements, then return to A/P/C menu
- If no: Keep original content, then return to A/P/C menu

#### If 'P' (Party Mode):

- Read fully and follow: {partyModeWorkflow} with the current constraints and lifecycle requirements
- Process collaborative improvements to constraint coverage
- Ask user: "Accept these changes to the constraints and lifecycle requirements? (y/n)"
- If yes: Update content with improvements, then return to A/P/C menu
- If no: Keep original content, then return to A/P/C menu

#### If 'C' (Continue):

- Write the final content to Sections 3.10-3.13 in `{outputFile}`
- Update frontmatter: `stepsCompleted: [1, 2, 3, 4, 5, 6, 7]`
- Load `{nextStepFile}`

## APPEND TO DOCUMENT:

When user selects 'C', replace the placeholder content in Sections 3.10, 3.11, 3.12, and 3.13 of the output document with the finalized content.

## SUCCESS METRICS:

✅ Information management covers retention, archival, disposal, and integrity
✅ Policy requirements reference specific regulations and standards
✅ Lifecycle sustainability addresses maintenance, evolution, AND decommission
✅ Design constraints complement (not duplicate) architectural decisions
✅ Each requirement uses appropriate identifier format (SYS-INFO, SYS-POL, SYS-LIFE, SYS-CON)
✅ Each requirement has Enterprise attributes
✅ Constraints cross-referenced with architecture document
✅ A/P/C menu presented and handled correctly
✅ Content properly written to document when C selected

## FAILURE MODES:

❌ Ignoring lifecycle sustainability (common oversight)
❌ Not addressing decommission requirements
❌ Vague policy requirements without specific regulation references
❌ Duplicating architectural decisions as constraints
❌ Missing information management for data-intensive systems
❌ Missing Enterprise attributes on any requirement
❌ Not presenting A/P/C menu after content generation

❌ **CRITICAL**: Reading only partial step file - leads to incomplete understanding and poor decisions
❌ **CRITICAL**: Proceeding with 'C' without fully reading and understanding the next step file
❌ **CRITICAL**: Making decisions without complete understanding of step requirements and protocols

## NEXT STEP:

After user selects 'C' and content is saved to document, load `./step-08-verification-plan.md` to create the verification plan for all system requirements.

Remember: Do NOT proceed to step-08 until user explicitly selects 'C' from the A/P/C menu and content is saved!
